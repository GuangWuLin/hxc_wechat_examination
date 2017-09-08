<template>
    <section>
        <group class="group">
            <div class="content">
                <span class='checkTitle'>选择车型</span>
                <checker style="clear:both;padding:10px;" v-model="carType" default-item-class="demo5-item" selected-item-class="demo5-item-selected">
                    <checker-item @on-item-click='carCheckClicked' v-for="(item,index) in allCars" :key="index" :value="item">{{item}}</checker-item>
                </checker>
            </div>
            <div class="content">
                <span class='checkTitle'>选择科目</span>
                <checker style="clear:both;padding:10px;" v-model="subject" default-item-class="demo5-item" selected-item-class="demo5-item-selected">
                    <checker-item @on-item-click='subCheckClicked' style="width:45%;" v-for="(item,index) in subjects" :key="index" :value="item.key">{{item.value}}</checker-item>
                </checker>
            </div>
        </group>
        <p style="margin-top:20%;color:#999;">选择好要参加培训的车型，科目后进行查询</p>
        <box gap="20px 20px">
            <x-button class="bgColor" @click.native="goRouter">查询</x-button>
        </box>
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
    Msg,
    Box,
    Checker,
    Tabbar,
    TabbarItem,
    CheckerItem,
    Group,
    XButton
} from "vux"
import {
    global
} from "../assets/javascript/global.js"
import {
    request
} from "../assets/api/api.js"
export default {
    components: {
        Msg,
        Box,
        Checker,
        Tabbar,
        TabbarItem,
        CheckerItem,
        Group,
        XButton
    },
    data() {
        return {
            carType: '',
            subject: '',
            allCars: [],
            subjects: [{
                key: 'course_2',
                value: '科目二'
            }, {
                key: 'course_3',
                value: '科目三'
            }],
            selectedTab: 0,
            url_params: {}
        }
    },
    methods: {
        // 科目选择
        subCheckClicked(val) {
            // console.log(111);
            // console.log(this.subject);
        },
        // 车型选择
        carCheckClicked() {
        },
        // 点击查询跳转
        goRouter() {
            if (!this.subject) {
                this.tooltip("error", "请选择科目", 2000, "text", false);
            } else if (!this.carType || !this.allCars.length) {
                this.tooltip("error", "请选择车型", 2000, "text", false);
            } else {
                this.$router.push({
                    path: "/choseCoach",
                    query: {
                        carType: this.carType,
                        course: this.subject
                    }
                })
            }
        },
        // 底部导航栏切换
        tabbarChanged(val) {
            this.selectedTab = val;
            if (val === 1) {
                this.$router.push({ path: "/scan" });
            }
            else if (val === 2) {
                this.$router.push({ path: "/mine" });
            }
        },
        // 从服务端获取车型列表
        queryAllCarsType() {
            request.types().then(res => {
                if (res.success) {
                    if (res.object.length) {
                        this.allCars = res.object;
                    }
                } else {
                    this.tooltip("error", '接口数据请求失败，请稍后再试', 2000, "text", false);
                }
            });
        },
        // 判断用户是否绑定
        judgeUser(id, code) {
            let args = { companyId: id, code: code };
            request.login(args).then(res => {
                if (res.success) {
                    sessionStorage.setItem("userInfo", JSON.stringify(res.object));
                    // 此处会引发二次加载
                    // window.location.replace("/");
                }
                else {
                    if (res.object === null) { return; }
                    localStorage.setItem("openId", res.data.object);
                }
            });
        }
    },
    created() {
        let code = global.GetQueryString("code");
        let companyId = global.GetQueryString("companyId");
        if (code && companyId) {
            this.judgeUser(companyId, code);
            localStorage.setItem("url_params", JSON.stringify({ id: companyId, code: code }));
        }
        this.queryAllCarsType();
    }
}
</script>

<style lang="less">
.carsSelect {
    clear: both;
}

.weui-tabbar__item {
    text-decoration: none;
}

.weui-tabbar__item.weui-bar__item_on .weui-tabbar__icon,
.weui-tabbar__item.weui-bar__item_on .weui-tabbar__icon>i,
.weui-tabbar__item.weui-bar__item_on .weui-tabbar__label {
    color: #58B7FF !important;
}

.group {
    padding: 5px 0;
}

.content {
    .checkTitle {
        text-align: left;
        width: 100%;
        display: inline-block;
        margin-left: 10px;
    }
    margin: 40px 0;
}

.demo5-item {
    width: 17%;
    height: 26px;
    line-height: 26px;
    text-align: center;
    border-radius: 3px;
    border: 1px solid #ccc;
    background-color: #fff;
    margin-right: 6px;
}

.demo5-item-selected {
    background: #58B7FF;
    color: #fff;
    border: none;
}
</style>