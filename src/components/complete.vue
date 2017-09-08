<!-- 手机绑定成功 -->

<template>
    <section class="msg-info">
        <msg title="绑定成功" :icon="icon"></msg>
        <div class="markInfo">
            <p>点击
                <router-link to="/reservation" class="goRouter">『开始预约』</router-link> 按钮，进入系统开始预约考场
            </p>
            <p>也可以通过主菜单
                <router-link to="/" class="goRouter">『签到』</router-link> 按钮扫描二维码开始培训
            </p>
        </div>
        <box gap="20px 20px">
            <x-button class="bgColor" @click.native="goRouter">开始预约</x-button>
        </box>
    </section>
</template>

<script>
    import {
        Msg,
        Box,
        XButton
    } from "vux"
    export default {
        components: {
            Msg,
            Box,
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
            },
            goRouter(){
                this.$router.push({
                    path:"/reservation"
                });
            }
        },
        created() {
            // this.changeIcon();
        }
    }
</script>

<style lang="less">
    .weui-icon-success,.weui-icon-warn,.weui-icon-waiting,.weui-icon-info{
        color:#58B7FF !important;
    }
    .msg-info {
        margin-top: 100px;
        .markInfo {
            font-size: 13px;
            .goRouter{
                text-decoration: none;
                color: #58B7FF;
            }
        }
    }
</style>
