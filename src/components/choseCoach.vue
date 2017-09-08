<template>
    <section class="container">
        <tab class="itemTop">
            <tab-item v-for="(item,index) in days" :selected="isChooses === index" :key="index" @on-item-click="onItemClick(index)">{{index===0?'今天':`${item.slice(5).replace(/\-/g,'月')}日`}}</tab-item>
        </tab>
        <flexbox>
            <flexbox-item class="leftFlex" style="margin-left:5% !important;color:#999;">
                {{coaches.length}}名教练
            </flexbox-item>
            <flexbox-item style="text-align:right;margin-right:5%;color:#999;">
                <div @click="isDown = !isDown">
                    <span>排序</span>
                    <div :class="{'triangle':!isDown,'triangle-selected':isDown}"></div>
                </div>
            </flexbox-item>
        </flexbox>
        <group v-if="isDown" class="sortSelector">
            <radio :options="sortList" @on-change="sortChange" v-model="sorts"></radio>
        </group>
        <scroller  v-if='coaches.length' @on-pullup-loading="onPullUpLoad" v-model="status" lock-x use-pullup :pullup-config="pullupConfig" ref="scrollerBottom" :scroll-bottom-offst="10" :height="height + 'px'">
            <div>
                <ul>
                    <li v-for="(item,index) in coaches" :key="index" style="background:#fff;margin:10px;border-radius:6px;height:106px;">
                        <flexbox orient="vertical" style='position:relative;bottom:16px;'>
                            <flexbox-item>
                                <flexbox>
                                    <flexbox-item :span="4">
                                        <img style="display:inline-block;width:60px;height:60px;border-radius:50%;" :src="item.car.coach.photo" v-if='item.car?(item.car.coach?(item.car.coach.photo?true:false):false):false' alt="">
                                        <div v-else style='width:60px;height:60px;border-radius:50%;background:#D3DCE6;margin:auto;'>
                                            <i class='iconfont icon-wode' style='font-size:49px;color:#fff;'></i>
                                        </div>
                                    </flexbox-item>
                                    <flexbox-item>
                                        <flexbox orient="vertical">
                                            <flexbox-item class="leftFlex">{{item.car.coach.userName?item.car.coach.userName:'--'}}
                                                <span style="color:#999;font-size:14px;"> {{item.car.license?item.car.license:'--'}}-{{item.car.brand?item.car.brand:'--'}}</span>
                                            </flexbox-item>
                                            <flexbox-item style="text-align:left;">
                                                <flexbox> 
                                                    <div :style="{display:'flex',alignItems:'center',justifyContent:'center',width:'20px',height:'20px',borderRadius:'5px',background:item.car.coach.gender==='男'?'#58B7FF':'rgba(255,73,73,0.84)'}">
                                                        <i style="color:#fff;font-size:13px;" :class="['iconfont',item.car.coach.gender==='女'?'icon-nv':'icon-iconfontnan']"></i>
                                                    </div>
                                                    <button disabled class="tagButton" v-if="item.car.coach.star?item.car.coach.star:false">星级教练</button>
                                                </flexbox>
                                            </flexbox-item>
                                        </flexbox>
                                    </flexbox-item>
                                </flexbox>
                            </flexbox-item>
                            <flexbox-item style="padding-top:5px;margin-bottom:4px;margin-top:0px;" class="vux-1px-t">
                                <flexbox>
                                    <!--<flexbox-item>
                                            <span class="infoCount">55</span>次好评
                                    </flexbox-item>-->
                                    <flexbox-item>
                                        当日
                                        <span class="infoCount">{{item.schedule?item.schedule.totalNumber:'0'}}</span>人预约</flexbox-item>
                                    <flexbox-item>
                                        <button class="bgColor" style="width:50px;height:25px;float:right;margin-right:10px;font-size:16px;border:none;border-radius:5px;" @click="goRouter(item)">预约</button>
                                    </flexbox-item>
                                </flexbox>
                            </flexbox-item>
                        </flexbox>
                    </li>
                </ul>
                <p style='width:100%;text-align:center;color:#99A9BF;' v-if='isAll'>{{deadlineMsg}}</p>
            </div>
        </scroller>
        <div style='margin:35% 0px;' v-if='!coaches.length && isNoData'>
            <div style="margin: 10px;text-align:center;margin-top:20%;">
                <i class="weui-icon weui_icon_info weui-icon-info weui-icon_msg" style='color:#C0CCDA;'></i>
                <p style="margin-top:10%;">暂时没有可预约教练</p>
            </div>
        </div>
    </section>
</template>

<script>
import {
    XButton,
    Tab,
    Scroller,
    TabItem,
    Flexbox,
    Group,
    Radio,
    FlexboxItem
} from "vux"
import {
    global
} from "../assets/javascript/global.js"
import {
    request
} from "../assets/api/api.js"

export default {
    components: {
        XButton,
        Tab,
        Group,
        Scroller,
        Radio,
        Flexbox,
        FlexboxItem,
        TabItem
    },
    data() {
        return {
            days: [],
            isChooses: 0,
            isNoData: false,
            coaches: [],
            isDown: false,
            sortList: ["默认排序", "星级优先", "空闲优先", "女士优先"],
            carType: this.$route.query.carType,
            course: this.$route.query.course,
            gmtBegin: new Date().Format('yyyy-MM-dd'),
            gmtEnd: new Date().Format('yyyy-MM-dd'),
            sorts: '默认排序',
            userInfo: JSON.parse(sessionStorage.getItem('userInfo')),
            pullupConfig: {
                content: '',
                pullUpHeight: 60,
                height: 40,
                autoRefresh: false,
                downContent: '松开进行加载',
                upContent: '上拉加载更多',
                loadingContent: '加载中...'
            },
            status: {
                pullupStatus: 'default'
            },
            page:1,
            totalPage:1,
            deadlineMsg: ''
        }
    },
    computed: {
        height: function() {
            // let app = navigator.userAgent;
            // if(app.indexOf('iPhone')>-1){
            //     return 570
            // }else if(app.indexOf('Android')>-1){
            //     return 450
            // }
            let height_ = document.documentElement.clientHeight;
            return (height_ - 120);
        },
        isAll: function() {
            return this.page > this.totalPage
        }
    },
    methods: {
        // 上拉刷新
        onPullUpLoad(){
            // 当 page 小于 总页数时 页数递加 并请求新数据
            if (this.page < this.totalPage) {
                this.$refs.scrollerBottom.enablePullup();
                this.page += 1;
                this.queryLists();
                this.$nextTick(() => {
                    this.$refs.scrollerBottom.donePullup();
                });
            } else {
                // 当 page 大于或 等于总页数时 禁止上拉 并且不发起新的数据请求
                this.page += 1;
                this.$refs.scrollerBottom.disablePullup();
                this.$nextTick(() => {
                    this.$refs.scrollerBottom.reset();
                    // 底部 无新数据 提示
                    this.deadlineMsg = '已加载全部信息';
                });
            }
        },
        // 排序选择
        sortChange(val) {
            // console.log(val);
            this.isDown = false;
            switch (val) {
                case '星级排序':

                    break;
                case '空闲优先':

                    break;
                case '女士优先':

                    break;
                default:
                    break;
            }
        },
        // 初始化日期
        getDay() {
            let timestamp = Date.now();
            let tmpDays = [];
            // 递增五天的日期
            for (let i = 0; i < 5; i++) {
                tmpDays.push(new Date(timestamp + 8.64e7 * i));
            }
            // 取每天年月日
            tmpDays.forEach(day => {
                this.days.push(day.Format('yyyy-MM-dd'));
            });
        },
        // 顶部日期切换
        onItemClick(index) {
            this.isChooses = index;
            this.isDown = false;
            this.gmtBegin = this.days[index];
            this.gmtEnd = this.days[index];
            this.queryLists();
        },
        // 行点击之后跳到相应 id 订单详情
        goRouter(item) {
            // console.log(item);
            this.$router.push({
                path: "/choseCoachBill",
                query: {
                    id: item.schedule.id,
                    carType: this.$route.query.carType,
                    course: this.$route.query.course
                }
            });
        },
        // 获取可预约教练列表
        queryLists() {
            let params = [this.userInfo.student.companyId, this.carType, this.course, this.gmtBegin, this.gmtEnd];
            let tmpArr = [];
            this.coaches = [];
            request.query(params).then(res => {
                // console.log(res);
                if (res.success) {
                    this.totalPage = res.object.totalPage;
                    if (res.object.list.length) {
                        res.object.list.forEach((item, index) => {
                            if (!!item.car.coach && item.schedules.length) {
                                tmpArr.push(item);
                            } else {
                                this.isNoData = true;
                            }
                        });
                        if (tmpArr.length) {
                            tmpArr.forEach(item => {
                                let car = item.car;
                                if (!!item.schedules[0].tempCoach) {
                                    car.coach = item.schedules[0].tempCoach;
                                }
                                this.coaches.push({
                                    car: car,
                                    id: item.id,
                                    schedule: item.schedules[0]
                                });
                            });
                        }
                    } else {
                        this.isNoData = true;

                    }
                } else {
                    this.tooltip("error", '数据请求失败，请稍后重试', 5000, "text", false);
                }
            });
        }
    },
    created() {
        this.getDay();
        this.queryLists();
        // console.log('documentElement.clientHeight: ' + document.documentElement.clientHeight);
    }
}
</script>

<style lang="less" scoped>
.container {
    .sortSelector {
        position: absolute;
        width: 100%;
        top: 60px;
        z-index: 999;
        text-align: left;
    }
    .infoCount {
        color: #04BE02;
    }
    .tagButton {
        margin-left: 10px;
        width: 70px;
        height: 20px;
        border: 1px solid #04BE02;
        background: #fff;
        border-radius: 5px;
        color: #04BE02;
    }
    .leftFlex {
        text-align: left !important;
    }
    .itemTop {
        font-size: 16px;
        font-weight: bold;
        margin-bottom: 5px;
        color: #E5E9F2;
    }
    .triangle-selected {
        width: 0;
        height: 0;
        border-left: 5px solid transparent;
        border-right: 5px solid transparent;
        border-bottom: 10px solid #999;
        display: inline-block;
    }
    .triangle {
        width: 0;
        height: 0;
        border-left: 5px solid transparent;
        border-right: 5px solid transparent;
        border-top: 10px solid #999;
        display: inline-block;
    }
}

.vux-flexbox-item {
    text-align: center;
}
</style>