<template>
    <section class="container">
        <header class="header">
            <Flexbox>
                <flexbox-item :span="4">
                    <img style="display:inline-block;width:60px;height:60px;border-radius:50%;" :src="billData.car.coach.photo" v-if='billData.car.coach.photo?true:false' alt="">
                    <div v-else style='width:60px;height:60px;border-radius:50%;background:#D3DCE6;margin:auto;'>
                        <i class='iconfont icon-wode' style='font-size:49px;color:#fff;'></i>
                    </div>
                </flexbox-item>
                <flexbox-item>
                    <flexbox orient="vertical">
                        <flexbox-item>
                            <flexbox orient="vertical">
                                <flexbox-item class="leftFlex">{{billData.car.coach.userName?billData.car.coach.userName:'未知教练'}}
                                    <span style="color:#999;font-size:14px;"> {{billData.car.license?billData.car.license:'--'}} - {{billData.car.brand?billData.car.brand:'--'}}</span>
                                </flexbox-item>
                                <flexbox-item style="text-align:left;margin-top:0px;">
                                    <flexbox>
                                        <div style="display:flex;align-items:center;justify-content:center;width:20px;height:20px;border-radius:5px;background:#58B7FF;">
                                            <i style="color:#fff;font-size:13px;" :class="['iconfont',billData.car.coach.gender==='女'?'icon-nv':'icon-iconfontnan']"></i>
                                        </div>
                                        <button class="tagButton" v-if='billData.car.coach.star?billData.car.coach.star:false'>星级教练</button>
                                    </flexbox>
                                </flexbox-item>
                            </flexbox>
                        </flexbox-item>
                    </flexbox>
                </flexbox-item>
            </Flexbox>
        </header>
        <scroller lock-x :height='height' v-model="status">
            <div>
                <group label-align="left">
                    <cell title="车辆信息">
                        <div slot="value">
                            <span>{{billData.car.license}} - {{billData.car.brand}}</span>
                        </div>
                    </cell>
                    <cell title="培训车型" :value="billData.car.type"></cell>
                    <cell title="培训科目" :value="billData.schedules[0].course==='course_2'?'科目二':'科目三'"></cell>
                    <cell title='培训日期' :value="new Date(billData.schedules[0].date).Format('yyyy-MM-dd')"></cell>
                    <cell title="当前预约人数">
                        <div slot="value">
                            <span style="color: #58B7FF;">{{billData.schedules[0].totalNumber}}人</span>
                        </div>
                    </cell>
                </group>
                <group label-align="left">
                    <cell title="服务单价">
                        <div slot="value">
                            <span style="color: #FF4949;">{{chargeSetting.fee?chargeSetting.fee:'0'}}元
                            </span>
                        </div>
                    </cell>
                    <x-number :fillable='false' @on-change="changeCount" :min='1' title="购买数量" v-model="count"></x-number>
                </group>
            </div>
        </scroller>
        <!--底部导航上方咨询电话-->
        <p class="tel">咨询电话：
            <a href="tel:028-12324556">028-12324556</a>
        </p>
        <!--底部总金额和购买按钮-->
        <flexbox class="billBottom">
            <flexbox-item>
                金额：
                <span class="billCount">¥ {{billCharge.totalFee}}</span>
            </flexbox-item>
            <flexbox-item>
                <span style='color:#58B7FF;text-decoration:underline;' @click='showDetail = true'>价格说明</span>
            </flexbox-item>
            <flexbox-item style="text-align:right;">
                <button :class="['bgColor','buyButton',isClickBuy?'btnDisabaled':'']" :disabled='isClickBuy' mini @click="buyNow">购买</button>
            </flexbox-item>
        </flexbox>
        <!--点击购买后弹出的购买信息-->
        <x-dialog v-model="showDetail" class="dialog-demo">
            <group label-align="left">
                <cell title="服务内容:">
                    <p slot="value">
                        考前驾驶培训
                        <span style="color:#FF4949;">{{billCharge.quantity?billCharge.quantity*chargeSetting.unit:'--'}}</span>{{chargeSetting.way==='circle'?'圈':'分钟'}}
                    </p>
                </cell>
                <cell title="服务单价:">
                    <p slot="value">
                        <span style="color:#FF4949;">{{billCharge.price?billCharge.price:'--'}}</span>元
                    </p>
                </cell>
                <cell title="购买数量:">
                    <p slot="value">
                        <span style="color:#FF4949;">{{billCharge.quantity?billCharge.quantity:'--'}}</span>次
                    </p>
                </cell>
                <cell title="星级教练选择费:">
                    <p slot="value">
                        <span style="color:#FF4949;">{{billCharge.starExpense?billCharge.starExpense:0}}</span>元
                    </p>
                </cell>
                <cell title="本校学员优惠:">
                    <p slot="value">
                        <span style="color:#FF4949;">{{billCharge.discounts?billCharge.discounts:0}}</span>元
                    </p>
                </cell>
                <cell title="总价:">
                    <p slot="value">
                        <span style="color:#FF4949;">{{billCharge.totalFee?billCharge.totalFee:0}}</span>元
                    </p>
                </cell>
            </group>
            <div @click="showDetail=false" style="height:40px;line-height:40px;color:#58B7FF;">
                知道了
            </div>
        </x-dialog>
        <!--反复购买提示-->
        <confirm v-model="repeatBuy" title="重复预约" confirm-text='继续购买' cancel-text='查看预约' theme="ios" @on-cancel="onCancel" @on-confirm="onConfirm">
            <p style="text-align:left;">您已购买当日预约，请是否确认还要再次购买?</p>
        </confirm>
    </section>
</template>

<script>
var wx = require("weixin-js-sdk");
import {
    Flexbox,
    FlexboxItem,
    Group,
    Cell,
    Calendar,
    XButton,
    InlineXNumber,
    Datetime,
    XNumber,
    Confirm,
    Scroller,
    XDialog
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
        Scroller,
        Cell,
        XButton,
        Calendar,
        Datetime,
        Confirm,
        InlineXNumber,
        XNumber,
        FlexboxItem,
        XDialog
    },
    data() {
        return {
            count: 1,
            showDetail: false,
            billData: {
                "id": '',
                "car": {
                    "id": '',
                    "companyId": '',
                    "license": "",
                    "numeration": '',
                    "brand": "",
                    "type": "",
                    "coach": {
                        "userId": '',
                        "userName": "",
                        "telephone": "",
                        "companyId": null,
                        "available": true,
                        "gmtCreate": null,
                        "gender": null,
                        "identityCard": null,
                        "star": true,
                        "photo": null
                    },
                    "gmtCreate": ''
                },
                "schedules": [
                    {
                        "companyId": '',
                        "id": '',
                        "carId": '',
                        "tempCoach": '',
                        "course": "",
                        "date": '',
                        "totalNumber": '',
                        "waitNumber": '',
                        "status": "",
                        "gmtCreate": ''
                    }
                ]
            },
            chargeSetting: {
                "id": '',
                "companyId": '',
                "type": '',
                "course": '',
                "way": '',
                "unit": '',
                "fee": '',
                "discounts": '',
                "starExpense": '',
                "gmtCreate": ''
            },
            billCharge: {
                "price": '',
                "quantity": '',
                "servicePrice": '',
                "discounts": '',
                "starExpense": '',
                "totalFee": ''
            },
            type: this.$route.query.carType,
            course: this.$route.query.course,
            userInfo: JSON.parse(sessionStorage.getItem('userInfo')),
            repeatBuy: false,
            isClickBuy: false,
            status: {
                // pullupStatus: 'default'
            },
            height: ''
        }
    },
    methods: {
        // 购买数量变更，即时请求价格总数
        changeCount() {
            // console.log(this.count);
            let args = {
                "studentId": this.userInfo.student.userId,
                "quantity": this.count,
                "scheduleId": this.$route.query.id
            }
            request.calculate(args).then(res => {
                // console.log(res);
                if (res.success) {
                    this.billCharge = res.object;
                } else {
                    this.tooltip("error", '接口数据请求失败，请稍后再试', 3000, "text", false);
                }
            });
        },
        // 反复购买提示-确认点击
        onConfirm() {

        },
        // 反复购买提示-取消点击
        onCancel() {

        },
        // 购买服务
        buyNow() {
            // this.repeatBuy = true;
            this.isClickBuy = true;
            let args = {
                "studentId": this.userInfo.student.userId,
                "quantity": this.count,
                "scheduleId": this.$route.query.id
            }
            request.payNow(args).then(res => {
                if (res.success) {
                    let params = res.object.param;
                    let outTradeNo = res.object.outTradeNo;
                    setTimeout(() => {
                        this.isClickBuy = false;
                    }, 3000);
                    this.initConfig(params.appId, params.timeStamp, params.nonceStr, () => {
                        wx.ready(() => {
                            wx.chooseWXPay({
                                timestamp: params.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                                nonceStr: params.nonceStr, // 支付签名随机串，不长于 32 位
                                package: params.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
                                signType: params.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                                paySign: params.paySign, // 支付签名
                                success: (payRes) => {
                                    this.$router.push({ path: '/mine', query: { id: outTradeNo, type: "即将开始" } });
                                }
                            });
                        });
                    });
                }
            });
        },
        // 获取当前选中教练订单详情
        queryBillDetail() {
            request.schedule(this.$route.query.id).then(res => {
                // console.warn(res);
                if (res.success) {
                    let cars = res.object;
                    if (!!res.object.schedules[0].tempCoach) {
                        cars.car.coach = res.object.schedules[0].tempCoach;
                    }
                    this.billData = cars;
                } else {
                    this.tooltip("error", '接口数据请求失败，请稍后再试', 3000, "text", false);
                }          
            });
        },
        // 获取收费设置
        queryCharge() {
            let params = [this.userInfo.student.companyId, this.type, this.course];
            request.expenses(params).then(res => {
                // console.log(res);
                if (res.success) {
                    this.chargeSetting = res.object;
                } else {
                    this.tooltip("error", '接口数据请求失败，请稍后再试', 3000, "text", false);                    
                }           
            });
        },
        // 配置微信参数
        initConfig(appId, timestamp, noncestr, callback) {
            let companyId = this.userInfo.student.companyId;
            request.getTicket([companyId, timestamp, noncestr]).then(res => {
                if (res.success) {
                    wx.config({
                        debug: false,
                        appId: appId,
                        timestamp: timestamp,
                        nonceStr: noncestr,
                        signature: res.object.sign,
                        jsApiList: ["chooseWXPay"] // 必填，需要使用的JS接口列表，所有JS接口列表见官方文档附录2
                    });
                    callback();
                }
            });
        }
    },
    created() {
        this.height = '-160';
        this.queryBillDetail();
        this.queryCharge();
    }
}
</script>

<style lang="less" scoped>
@import "~vux/src/styles/close";
.dialog-demo {
    .weui-dialog {
        border-radius: 8px;
        padding-bottom: 8px;
    }
    .dialog-title {
        line-height: 30px;
        color: #666;
    }
    .img-box {
        height: 350px;
        overflow: hidden;
    }
    .vux-close {
        margin-top: 8px;
        margin-bottom: 8px;
    }
}

.container {
    .header {
        background: #fff;
        padding-top: 10px;
        .leftFlex {
            text-align: left !important;
            padding: 5px 0px;
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
        .coachHistory {
            color: #324057;
            display: inline-block;
            position: relative;
            bottom: 21px;
            left: 22px;
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
        position: absolute;
        bottom: 42px;
        width: 100%;
        text-align: center;
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
        .btnDisabaled {
            background: #D3DCE6;
        }
    }
}
</style>