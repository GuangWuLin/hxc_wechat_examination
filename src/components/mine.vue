<template>
    <section class="container">
        <!--学员个人信息简略-->
        <header class="header">
            <flexbox align="center">
                <flexbox-item :span="4">
                    <img style="display:inline-block;width:60px;height:60px;border-radius:50%;" :src="userInfo.student.photo" v-if='userInfo?(userInfo.student?(userInfo.student.photo?true:false):false):false' alt="">
                    <div v-else style='width:60px;height:60px;border-radius:50%;background:#D3DCE6;margin:auto;'>
                        <i class='iconfont icon-wode' style='font-size:49px;color:#fff;'></i>
                    </div>
                </flexbox-item>
                <flexbox-item>
                    <flexbox orient="vertical">
                        <flexbox-item>
                            <flexbox orient="vertical">
                                <flexbox-item class="leftFlex">
                                    <flexbox style="font-size:20px;">
                                        <span>{{userInfo.student.userName}}</span>
                                        <button disabled :class="['tagButton',userInfo.student.ownSchool?'':'notOwnSchool']">{{userInfo.student.ownSchool?'本校学员':'非本校学员'}}</button>
                                    </flexbox>
                                </flexbox-item>
                                <flexbox-item style="text-align:left;color:#8492A6;">
                                    Tel:{{userInfo.student.telephone}}
                                </flexbox-item>
                            </flexbox>
                        </flexbox-item>
                    </flexbox>
                </flexbox-item>
            </flexbox>
        </header>
        <!--历史培训记录-->
        <scroller v-if='lists.length' :scroll-bottom-offst="10" height='-147' @on-pullup-loading="onPullUpLoad" v-model="status" lock-x use-pullup :pullup-config="pullupConfig" @on-scroll="onScroll" ref="scrollerBottom">
            <div>
                <group label-align="left">
                    <div v-for="(item,index) in lists" :key="index" class='vux-1px-t'>
                        <cell is-link @click.native='cellClick(item)'>
                            <div slot="value" style='margin-right:10px;'>
                                <flexbox orient="vertical">
                                    <flexbox-item>
                                        <span :style="{color:format(item,'bg'),fontSize:'15px'}">{{format(item,'font')}}</span>
                                    </flexbox-item>
                                    <flexbox-item>
                                        <span style='font-size:14px;'>{{`${new Date(item.date).Format('yyyy-MM-dd').slice(5).replace(/\-/g,'月')}日`}}</span>
                                    </flexbox-item>
                                </flexbox>
                            </div>
                            <div slot="title">
                                <flexbox orient="vertical">
                                    <flexbox-item>{{item.coach.userName}} &nbsp;
                                        <span style="color:#999;font-size:14px;"> {{item.license}}</span>
                                    </flexbox-item>
                                    <flexbox-item>
                                        <flexbox>
                                            <div class='iconClass' :style="{background:item.coach.gender==='男'?'#58B7FF':'rgba(255,73,73,0.84)'}">
                                                <i style="color:#fff;font-size:13px;" :class="['iconfont',item.coach.gender!=='女'?'icon-iconfontnan':'icon-nv']"></i>
                                            </div>
                                            <button v-if='item.coach.star' class="tagButton" disabled>星级教练</button>
                                        </flexbox>
                                    </flexbox-item>
                                </flexbox>
                            </div>
                        </cell>
                    </div>
                </group>
                <p style='width:100%;text-align:center;color:#99A9BF;' v-if='isAll'>{{deadlineMsg}}</p>
            </div>
        </scroller>
        <!--<group label-align="left" v-if='lists.length'>
                                                        </group>-->
        <!--无培训记录提示-->
        <div style='margin:35% 0px;' v-if='!lists.length && isNoData'>
            <div style="margin: 10px;text-align:center;margin-top:20%;">
                <i class="weui-icon weui_icon_info weui-icon-info weui-icon_msg" style='color:#C0CCDA;'></i>
                <p style="margin-top:10%;">暂时没有订单信息</p>
            </div>
        </div>
        <!--底部导航-->
        <tabbar @on-index-change="tabbarChanged">
            <tabbar-item :selected='selectedTab===0'>
                <i slot="icon" :class="['iconfont',selectedTab===0?'icon-yuyue1':'icon-yuyue']"></i>
                <span slot="label">预约</span>
            </tabbar-item>
            <tabbar-item :selected='selectedTab===1'>
                <i slot="icon" :class="['iconfont',selectedTab==1?'icon-qiandao':'icon-sign']"></i>
                <span slot="label">签到</span>
            </tabbar-item>
            <tabbar-item :selected='selectedTab===2'>
                <i slot="icon" :class="['iconfont',selectedTab==2?'icon-wode1':'icon-wode']"></i>
                <span slot="label">我的</span>
            </tabbar-item>
        </tabbar>
    </section>
</template>

<script>
import {
    Flexbox,
    FlexboxItem,
    Group,
    GroupTitle,
    Cell,
    Calendar,
    XButton,
    InlineXNumber,
    XDialog,
    Tabbar,
    Scroller,
    TabbarItem
} from "vux"
import {
    global
} from "../assets/javascript/global.js"
import {
    request
} from "../assets/api/api.js"

export default {
    components: {
        Flexbox,
        Group,
        GroupTitle,
        Cell,
        XButton,
        Scroller,
        Calendar,
        InlineXNumber,
        FlexboxItem,
        XDialog,
        Tabbar,
        TabbarItem
    },
    data() {
        return {
            lists: [],
            selectedTab: 2,
            userInfo: JSON.parse(sessionStorage.getItem('userInfo')),
            date: '',
            page: 1,
            totalPage: 1,
            deadlineMsg: '',
            pageSize: global.pageSize,
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
            isNoData:false
        }
    },
    computed: {
        isAll: function() {
            return this.page > this.totalPage
        }
    },
    methods: {
        onScroll() {
            // console.log('onScroll')
        },
        onPullUpLoad() {
            // 当 page 小于 总页数时 页数递加 并请求新数据
            if (this.page < this.totalPage) {
                this.$refs.scrollerBottom.enablePullup();
                this.page += 1;
                this.getBillHistory();
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
        // 行点击
        cellClick(item) {
            var demo = this.format(item, 'font');
            this.$router.push({
                path: '/hasTrained',
                query: {
                    id: item.id,
                    type: demo
                }
            });
        },
        // 底部导航栏点击
        tabbarChanged(val) {
            this.selectedTab = val;
            if (val === 0) {
                this.$router.push({ path: "/" });
            }
            else if (val === 1) {
                this.$router.push({ path: "/scan" });
            }
        },
        // 每一行右侧标签显示文字及字体颜色格式设置
        format(temp, type) {
            if (temp.status === 'PAYED') {
                if (!temp.trainingRecord) {
                    return type === 'bg' ? '#04BE02' : '即将开始'
                } else {
                    if (temp.trainingRecord.status === 'doing') {
                        return type === 'bg' ? '#04BE02' : '培训中'
                    } else if (temp.trainingRecord.status === 'finish') {
                        return type === 'bg' ? '#58B7FF' : '已完成'
                    }
                }
            } else if (temp.status === 'UN_PAY') {
                return type === 'bg' ? 'rgba(255,73,73,0.84)' : '未付款'
            } else if (temp.status === 'REFUND') {
                return type === 'bg' ? '#F7BA2A' : '已退款'
            } else if (temp.status === 'ABANDON') {
                return type === 'bg' ? 'rgba(255,73,73,0.84)' : '已作废'
            }
        },
        // 获取历史培训记录
        getBillHistory() {
            let args = [this.userInfo.student.companyId, this.userInfo.student.userId, this.page, this.pageSize, 'PAYED,REFUND,ABANDON'];
            request.queryOrder(args).then(res => {
                if (res.success) {
                    this.totalPage = res.object.totalPage;
                    if (res.object.list.length) {
                        res.object.list.forEach(item => {
                            this.lists.push({
                                carType: item.carType,
                                coach: item.coach,
                                companyId: item.companyId,
                                course: item.course,
                                date: item.date,
                                fee: item.fee,
                                gmtCreate: item.gmtCreate,
                                gmtPay: item.gmtPay,
                                gmtRefund: item.gmtRefund,
                                id: item.id,
                                license: item.license,
                                operator: item.operator,
                                payTool: item.payTool,
                                quantity: item.quantity,
                                scheduleId: item.scheduleId,
                                sequence: item.sequence,
                                status: item.status,
                                student: item.student,
                                tradeNo: item.tradeNo,
                                trainingRecord: item.trainingRecord,
                                unit: item.unit,
                                verifyCode: item.verifyCode,
                                way: item.way
                            });
                        });
                    }else{
                        this.isNoData = true;
                    }
                } else {
                    this.tooltip("error", '接口数据请求失败，请稍后再试', 5000, "text", false);
                }
            });
        }
    },
    created() {
        this.getBillHistory();
    }
}
</script>

<style lang="less" scoped>
.weui-cells__title {
    text-align: left !important;
}

.weui-tabbar__item.weui-bar__item_on .weui-tabbar__icon,
.weui-tabbar__item.weui-bar__item_on .weui-tabbar__icon>i,
.weui-tabbar__item.weui-bar__item_on .weui-tabbar__label {
    color: #58B7FF !important;
}

.weui-tabbar__item {
    text-decoration: none;
}

.container {
    .iconClass {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 20px;
        height: 20px;
        border-radius: 5px;
        background: #58B7FF;
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
    .notOwnSchool {
        border: 1px solid #58B7FF;
        color: #58B7FF;
    }
    .header {
        background: #fff;
        padding: 10px 0px;
        .leftFlex {
            text-align: left !important;
            padding: 5px 0px;
        }
        .coachHistory {
            color: #324057;
            display: inline-block;
            position: relative;
            bottom: 10px;
            font-size: 14px;
            a {
                text-decoration: none;
                color: #04BE02;
            }
        }
        .vux-flexbox-item {
            text-align: center;
        }
    }
    .tel {
        position: relative;
        top: 60px;
        a {
            text-decoration: none;
            color: #58B7FF;
        }
    }
    .billBottom {
        background: #fff;
        position: absolute;
        bottom: 0px;
        height: 40px;
        .billCount {
            color: #FF4949;
        }
        .buyButton {
            height: 40px;
            width: 60px;
            border: none;
        }
    }
}
</style>