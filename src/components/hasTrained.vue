<template>
    <section class="container">
        <header :class="['header',showPop?'headerMargin':'']">
            <Flexbox>
                <flexbox-item :span="4">
                    <img style="display:inline-block;width:60px;height:60px;border-radius:50%;" :src="dataById.coach.photo" v-if='dataById.coach.photo?true:false' alt="">
                    <div v-else style='width:60px;height:60px;border-radius:50%;background:#D3DCE6;margin:auto;'>
                        <i class='iconfont icon-wode' style='font-size:49px;color:#fff;'></i>
                    </div>
                </flexbox-item>
                <flexbox-item>
                    <flexbox orient="vertical" style='height:66px;'>
                        <flexbox-item>
                            <flexbox orient="vertical">
                                <flexbox-item class="leftFlex">{{dataById.coach.userName}}  {{dataById.license}}</flexbox-item>
                                <flexbox-item style="text-align:left;margin-top:0px;">
                                    <flexbox>
                                        <div class='iconClass' :style="{background:dataById?(dataById.coach.gender==='男')?'#58B7FF':'rgba(255,73,73,0.84)':''}">
                                            <i style="color:#fff;font-size:13px;" :class="['iconfont',dataById.coach.gender==='男'?'icon-iconfontnan':'icon-nv']"></i>
                                        </div>
                                        <button class="tagButton" disabled v-if="dataById.coach.star?true:false">星级教练</button>
                                        <p class="coachHistory" v-if='false'>
                                            共培训
                                            <a href="javascript:;">{{dataById.quantity}}次 </a>好评
                                        </p>
                                    </flexbox>
                                </flexbox-item>
                            </flexbox>
                        </flexbox-item>
                    </flexbox>
                </flexbox-item>
            </Flexbox>
        </header>
        <group label-align="left" class="groups">
            <!-- 车辆基本信息 -->
            <cell>
                <div slot="value">
                    <flexbox orient="vertical">
                        <flexbox-item>培训科目：
                            <span class="cellFont">{{dataById.course==='course_2'?'科目二':'科目三'}}</span>
                        </flexbox-item>
                        <flexbox-item>培训车型：
                            <span class="cellFont">{{dataById.carType?dataById.carType:'--'}}</span>
                        </flexbox-item>
                    </flexbox>
                </div>
                <div slot="title">
                    <flexbox orient="vertical">
                        <flexbox-item>车辆信息：
                            <span class="cellFont">{{dataById.license?dataById.license:'--'}}</span>
                        </flexbox-item>
                        <flexbox-item>培训日期：
                            <span class="cellFont">{{(dataById.date?new Date(dataById.date):new Date(Date.now())).Format('yyyy-MM-dd')}}</span>
                        </flexbox-item>
                    </flexbox>
                </div>
            </cell>
            <!-- 当前服务项 -->
            <cell>
                <div slot="title">
                    <flexbox orient="vertical">
                        <flexbox-item>培训次序：
                            <span class="cellFont">{{dataById.sequence?dataById.sequence:'--'}}</span>
                        </flexbox-item>
                        <flexbox-item>服务数量：
                            <span class="cellFont">{{dataById.quantity?dataById.quantity:'--'}}次</span>
                        </flexbox-item>
                        <flexbox-item>服务内容：考前适应性驾驶培训
                            <span class="cellFont">{{dataById.quantity?dataById.quantity*dataById.unit:'--'}}</span>{{dataById.way?(dataById.way==='circle'?'圈':'分钟'):'分钟'}}
                        </flexbox-item>
                    </flexbox>
                </div>
            </cell>
            <!-- 成功完成培训/培训作废／培训中 - 显示 -->
            <cell v-if="trainedComplete || trainedUseless || onTraining">
                <div slot="title">
                    <flexbox orient="vertical">
                        <flexbox-item>签到时间：
                            <span class="cellFont">{{dataById.trainingRecord?(dataById.trainingRecord.gmtBegin?new Date(dataById.trainingRecord.gmtBegin).Format('yyyy-MM-dd'):'--'):'--'}} {{dataById.trainingRecord?(dataById.trainingRecord.gmtBegin?new Date(dataById.trainingRecord.gmtBegin).toTimeString().slice(0,8):'--'):'--'}}</span>
                        </flexbox-item>
                        <flexbox-item v-if='!onTraining'>结束时间：
                            <span class="cellFont">{{dataById.trainingRecord?(dataById.trainingRecord.gmtEnd?new Date(dataById.trainingRecord.gmtEnd).Format('yyyy-MM-dd'):'--'):'--'}} {{dataById.trainingRecord?(dataById.trainingRecord.gmtEnd?new Date(dataById.trainingRecord.gmtEnd).toTimeString().slice(0,8):'--'):'--'}}</span>
                        </flexbox-item>
                    </flexbox>
                </div>
            </cell>
            <!-- 培训取消中 - 显示 -->
            <cell v-if="trainedCancel || afterTrainedCancel">
                <div slot="title">
                    <flexbox orient="vertical">
                        <flexbox-item>退费金额：
                            <span style="color:#FF4949;">{{dataById.fee?dataById.fee:'--'}}元</span>
                        </flexbox-item>
                        <flexbox-item>退款时间：
                            <span class="cellFont">{{dataById.gmtRefund?new Date(dataById.gmtRefund).Format('yyyy-MM-dd'):'--'}} {{dataById.gmtRefund?new Date(dataById.gmtRefund).toTimeString().slice(0,8):'--'}}</span>
                        </flexbox-item>
                    </flexbox>
                </div>
            </cell>
        </group>
        <!-- 退费 - 显示 -->
        <p v-if="afterTrainedCancel || trainedCancel" style="width:100%;margin-top:50px;text-align:center;">对退款过程不满意，拨打
            <span style="color:#58B7FF;">『服务热线』</span>进行查询</p>
        <!-- 即将开始 - 显示 -->
        <div v-if="beforeTrain" class="willCome">
            <p class="someTips">培训签到前，可以取消服务</p>
            <box gap="20px 20px">
                <x-button type="warn" @click.native="shallCancel = true">申请退款</x-button>
            </box>
        </div>
        <!-- 培训取消中或已经取消顶部黄色提示 - 显示 -->
        <popup v-model="showPop" position="top" :show-mask="false" style="height:40px;">
            <div class="position-vertical-demo">
                {{trainedCancel?"服务已取消，退款处理中":"服务已取消，退款已完成"}}
            </div>
        </popup>
        <!-- 即将培训点击取消按钮 - 显示 -->
        <confirm v-model="shallCancel" title="取消订单" cancelText="否" confirmText="是" @on-cancel="shallCancel = false" @on-confirm="onConfirm">
            <p style="text-align:center;">
                取消订单，服务费用将按原支付路径返回，是否继续此操作
            </p>
        </confirm>
    </section>
</template>

<script>
import {
    Flexbox,
    FlexboxItem,
    Group,
    Box,
    Cell,
    XButton,
    Popup,
    Confirm
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
        Cell,
        Box,
        XButton,
        FlexboxItem,
        Popup,
        Confirm
    },
    data() {
        return {
            trainedCancel: false,
            trainedComplete: false,
            afterTrainedCancel: false,
            trainedUseless: false,
            onTraining: false,
            beforeTrain: false,
            shallCancel: false,
            dataById: {
                "id": '',
                "companyId": '',
                "scheduleId": '',
                "license": "",
                "course": "",
                "date": '',
                "way": "",
                "unit": '',
                "quantity": '',
                'gmtRefund':'',
                "fee": '',
                "operator": "",
                "coach": {
                    "userId": '',
                    "userName": "",
                    "telephone": "",
                    "companyId": "",
                    "available": '',
                    "gmtCreate": '',
                    "gender": "",
                    "identityCard": "",
                    "star": '',
                    "photo": ""
                },
                "student": {
                    "userId": '',
                    "userName": "",
                    "telephone": "",
                    "companyId": "",
                    "available": '',
                    "gmtCreate": '',
                    "schoolName": "",
                    "ownSchool": '',
                    "photo": "",
                    "openId": ''
                },
                "status": "",
                "payTool": "",
                "sequence": '',
                "verifyCode": "",
                "trainingRecord": {
                    "id": '',
                    "orderId": '',
                    "status": "",
                    "gmtBegin": '',
                    "gmtEnd": ''
                },
                "gmtCreate": '',
                "gmtPay": ''
            }
        }
    },
    computed: {
        showPop: function() {
            return this.trainedCancel || this.afterTrainedCancel
        }
    },
    methods: {
        onConfirm() {
            //    console.log(msg);
            request.refund(this.$route.query.id).then(res => {
                // console.log(res);
                if (res.success) {
                    this.tooltip("success", '退款成功', 5000, "text", false);
                } else {
                    this.tooltip("text", '接口数据请求失败，请稍后再试', 5000, "text", false);
                }
                setTimeout(() => {
                    this.$router.go(-1);
                }, 5000);
            });
        },
        // 通过订单id获取信息
        queryDataById() {
            // let args = [];
            request.order(this.$route.query.id).then(res => {
                // console.log(res);
                if (res.success) {
                    this.dataById = res.object;
                } else {
                    this.tooltip("error", '接口数据请求失败，请稍后再试', 5000, "text", false);                    
                }             
            });
        },
        // 根据 url 参数判断当前是什么状态
        judgeType(param) {
            if (param === '即将开始') {
                this.beforeTrain = true;
                this.onTraining = false;
                this.trainedComplete = false;
                this.afterTrainedCancel = false;
                this.trainedUseless = false;
            } else if (param === '培训中') {
                this.beforeTrain = false;
                this.onTraining = true;
                this.trainedComplete = false;
                this.afterTrainedCancel = false;
                this.trainedUseless = false;
            } else if (param === '已完成') {
                this.trainedComplete = true;
                this.beforeTrain = false;
                this.onTraining = false;
                this.afterTrainedCancel = false;
                this.trainedUseless = false;
            } else if (param === '未付款') {
                return
            } else if (param === '已退款') {
                this.beforeTrain = false;
                this.trainedUseless = false;
                this.afterTrainedCancel = true;
                this.onTraining = false;
                this.trainedComplete = false;
            } else if (param === '已作废') {
                this.trainedUseless = true;
                this.trainedComplete = false;
                this.beforeTrain = false;
                this.onTraining = false;
                this.afterTrainedCancel = false;
            }
        }
    },
    created() {
        this.judgeType(this.$route.query.type);
        this.queryDataById();
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
    .position-vertical-demo {
        background-color: #ffe26d;
        color: #000;
        text-align: center;
        padding: 10px;
    }
    .header {
        padding-top: 10px;
        background: #fff;
        .iconClass {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 20px;
            height: 20px;
            border-radius: 5px;
            background: #58B7FF;
        }
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
            font-size: 14px;
            margin-left: 10px;
            a {
                text-decoration: none;
                color: #04BE02;
            }
        }
        .vux-flexbox-item {
            text-align: center;
        }
    }
    .headerMargin {
        margin-top: 40px;
    }
    .groups {
        color: #999999;
        .cellFont {
            color: #000;
            font-size: 15px;
        }
    }
    .willCome {
        margin-top: 30%;
        .someTips {
            color: #999999;
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