<template>
    <section class="scan-info">
        <div class="info-row">
            <a class="row-icon" @click="scan">
                <i class="iconfont icon-saoyisao"></i>
            </a>
            <p class="row-title">扫一扫</p>
        </div>
        <div class="info-row" style="display:none;">
            <div class="row-inner">
                <p class="row-desc">也可在培训仪界面手动输入以下验证码</p>
                <flexbox :gutter="10">
                    <flexbox-item>
                        <div class="inner-flex">1</div>
                    </flexbox-item>
                    <flexbox-item>
                        <div class="inner-flex">2</div>
                    </flexbox-item>
                    <flexbox-item>
                        <div class="inner-flex">3</div>
                    </flexbox-item>
                    <flexbox-item>
                        <div class="inner-flex">4</div>
                    </flexbox-item>
                    <flexbox-item>
                        <div class="inner-flex">5</div>
                    </flexbox-item>
                    <flexbox-item>
                        <div class="inner-flex">6</div>
                    </flexbox-item>
                </flexbox>
            </div>
        </div>
        <!-- <button class="tagButton" @click="scan"></button> -->
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
var wx = require("weixin-js-sdk");
import { request } from "../assets/api/api.js"
import { Msg, Toast, Tabbar, TabbarItem, Flexbox, FlexboxItem } from "vux"
export default {
    components: {
        Msg,
        Toast,
        Tabbar,
        TabbarItem,
        Flexbox,
        FlexboxItem
    },
    data() {
        return {
            selectedTab: 1,
            userInfo: JSON.parse(sessionStorage.getItem("userInfo"))
        }
    },
    methods: {
        // 配置微信参数
        initConfig() {
            this.tooltip("success", "开始调用后台接口获取数据", 3000, "text", false);
            let companyId = this.userInfo.student.companyId;
            request.getTicketBySHA1(companyId).then(res => {
                if (res.success) {
                    this.tooltip("success", "数据获取成功，开始注册微信", 3000, "text", false);
                    wx.config({
                        debug: false,
                        appId: res.object.appId,
                        timestamp: res.object.timestamp,
                        nonceStr: res.object.noncestr,
                        signature: res.object.sign,
                        jsApiList: ["scanQRCode"] // 必填，需要使用的JS接口列表，所有JS接口列表见官方文档附录2
                    });
                    wx.error((res) => {
                        this.tooltip("error", "微信注册失败，请刷新页面后重试", 3000, "text", false);
                    });
                }
                else {
                    this.tooltip("error", "接口数据获取失败", 3000, "text", false);
                }
            });
        },
        // 微信扫一扫
        scan() {
            wx.scanQRCode({
                desc: "scanQRCode desc",
                needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
                scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
                // 成功回调
                success: (res) => {
                    if (res.errMsg === "scanQRCode:ok") {
                        let studentId = this.userInfo.student.userId;
                        let orderId = res.resultStr.split("&")[0].split("=")[1];
                        request.qr_sign([studentId, orderId]).then(res => {
                            if (res.success) {
                                this.tooltip("success", "扫描成功，即将开始培训", 3000, "text", () => {
                                    this.$router.push({ path: "/hasTrained", query: { id: res.object, type: "培训中" } });
                                });
                            }
                            else {
                                this.tooltip("error", "扫码签到失败，原因：无权限操作", 3000, "text", false);
                            }
                        });
                    }
                },
                // 失败回调
                error: (res) => {
                    if (res.errMsg.indexOf("function_not_exist") > 0) {
                        this.tooltip("error", "微信版本过低，请先升级", 3000, "text", false);
                    }
                }
            });
        },
        // 底部导航栏切换
        tabbarChanged(val) {
            this.selectedTab = val;
            if (val === 0) {
                this.$router.push({ path: "/" });
            }
            else if (val === 2) {
                this.$router.push({ path: "/mine" });
            }
        }
    },
    created() {
        this.initConfig();
    },
    mounted() {
        // this.tooltip("success", "我是消息内容", 2000, "text", () => {
        //     console.log("tips关闭后的回调");
        // });
        // this.tooltip("error", "我是消息内容", 5000, "text", false);
    }
}
</script>
<style lang="less">
.scan-info {
    .info-row {
        .row-icon {
            display: block;
            width: 100px;
            height: 100px;
            border-radius: 100%;
            background: #20A0FF;
            margin: 150px auto 8px auto;
            .iconfont {
                color: #fff;
                font-size: 3.5em;
                line-height: 105px;
            }
        }
        p {
            &.row-title {
                font-size: 1.4em;
            }
            &.row-desc {
                margin-top: 5px;
                font-size: .88em;
                line-height: 50px;
                text-align: left;
                color: #838383;
            }
        }
        &:not(:first-child) {
            padding: 0 20px;
            margin-top: 140px;
        }
        .row-inner {
            border-top: 1px solid #DFE1E9;
            .inner-flex {
                text-align: center;
                border: 1px solid #FBA13A;
                line-height: 80px;
            }
        }
    }
}
</style>