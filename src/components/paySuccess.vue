<!-- 手机预约支付成功 -->

<template>
    <section class="msg-info">
        <msg title="支付成功" :icon="icon"></msg>
        <box :class="['vux-1px-t','vux-1px-b','checkCode']">
            <p style="text-align:left;font-size:13px;">签到验证码</p>
            <flexbox>
                <flexbox-item>
                    <button class="checkBtn">1</button>
                </flexbox-item>
                <flexbox-item>
                    <button class="checkBtn">2</button>
                </flexbox-item>
                <flexbox-item>
                    <button class="checkBtn">3</button>
                </flexbox-item>
                <flexbox-item>
                    <button class="checkBtn">4</button>
                </flexbox-item>
                <flexbox-item>
                    <button class="checkBtn">5</button>
                </flexbox-item>
                <flexbox-item>
                    <button class="checkBtn">6</button>
                </flexbox-item>
            </flexbox>
        </box>
        <div class="markInfo">
            <p>也可以通过主菜单
                <a href="javascript:;">『签到』</a> 按钮扫描二维码开始培训
            </p>
        </div>
        <box gap="20px 20px">
            <x-button class="bgColor">完成</x-button>
        </box>
    </section>
</template>

<script>
    import {
        Msg,
        Box,
        Flexbox,
        FlexboxItem,
        XButton
    } from "vux"
    export default {
        components: {
            Msg,
            Box,
            Flexbox,
            FlexboxItem,
            XButton
        },
        data() {
            return {
                icon: ""
            }
        },
        methods: {
            changeIcon() {
                if (!this.icon || this.icon === "success") {
                    this.icon = "warn";
                } else if (this.icon === "warn") {
                    this.icon = "info";
                } else if (this.icon === "info") {
                    this.icon = "waiting";
                } else if (this.icon === "waiting") {
                    this.icon = "success";
                } else {
                    this.icon = "success";
                }
            }
        },
        created() {
            // this.changeIcon();
        }
    }
</script>

<style lang="less">
    .weui-icon-success,
    .weui-icon-warn,
    .weui-icon-waiting,
    .weui-icon-info {
        color: #58B7FF !important;
    }
    
    .msg-info {
        margin-top: 100px;
        .markInfo {
            margin-top: 10%;
            font-size: 13px;
            a {
                text-decoration: none;
                color: #58B7FF;
            }
        }
        .checkCode {
            padding: 2%;
            p {
                margin: 10px;
            }
            .checkBtn {
                border: 1px solid rgba(255, 177, 88, 0.93);
                background: #fff;
                height: 60px;
                width: 80%;
                margin-bottom:10px;
                font-size:16px;
            }
        }
    }
</style>
