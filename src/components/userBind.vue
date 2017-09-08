<!-- 用户手机绑定 -->
<template>
  <section>
    <img src="https://raw.githubusercontent.com/GuangWuLin/haoxueche/master/banner.png" alt="" class="backImg">
    <group class="weui-cells_form">
      <x-input title="姓名" type="text" placeholder="输入姓名" v-model="userName"></x-input>
      <x-input title="手机号码" placeholder="输入手机号码" class="weui-vcode" v-model="phone">
        <x-button slot="right" class="bgColor" v-if="showCount" mini @click.native='sendCheckCode'>发送验证码</x-button>
        <x-button disabled mini v-else class="bgColor" slot="right">
          <countdown :value="time" @on-finish="showCount=true"></countdown>
          秒后重试
        </x-button mini>
      </x-input>
      <x-input title="验证码" type="text" placeholder="输入验证码" v-model="checkCode"></x-input>
    </group>
    <box gap="20px 20px">
      <x-button class="bgColor" :disabled="checkCode.length!==6" @click.native="bindInfo">下一步</x-button>
    </box>
    <!--失败的提示-->
    <!-- <toast v-model="showMsg" :type="type" :text="text"></toast> -->
  </section>
</template>

<script>
import {
  Box,
  XButton,
  Toast,
  XInput,
  Group,
  Countdown
} from "vux"
import {
  global
} from "../assets/javascript/global.js"
import {
  request
} from "../assets/api/api.js"
export default {
  components: {
    Box,
    Group,
    Toast,
    XButton,
    XInput,
    Countdown
  },
  data() {
    return {
      checkCode: "",
      userName: "",
      phone: "",
      time: 60,
      showMsg: false,
      showCount: true,
      type: '',
      text: '',
      url_params: JSON.parse(localStorage.getItem("url_params")),
      openId: localStorage.getItem("openId")
    }
  },
  methods: {
    // 发送验证码
    sendCheckCode() {
      if (this.phone.length > 0) {
        if (global.fieldVerification.IsPhone(Number(this.phone))) {
          request.verificationCode(this.phone).then(res => {
            if (res.success) {
              this.showCount = false;
              this.tooltip("success", "短信验证码已发送", 3000, "text", false);
            } else {
              this.tooltip("error", '接口数据请求失败，请稍后再试', 3000, "text", false);
            }
          });
        } else {
          this.tooltip("error", '请输入正确的电话号码', 3000, "text", false);
        }
      } else {
        this.tooltip("error", '手机号不能为空', 3000, "text", false);
      }
    },
    // 绑定手机
    bindInfo() {
      let that = this;
      const args = {
        "companyId": this.url_params.id,
        "openId": this.openId,
        "telephone": this.phone,
        "name": this.userName,
        "verifyCode": this.checkCode
      }
      if (!args.name) {
        this.tooltip("error", '用户姓名不能为空', 3000, "text", false);        
      } else if (!global.fieldVerification.IsPhone(Number(args.telephone))) {
        this.tooltip("error", '请输入正确的手机号码', 3000, "text", false);        
      } else {
        setTimeout(() => {
          request.bind(args).then(res => {
            // console.log(res);
            if (res.success) {
              sessionStorage.setItem('userInfo', JSON.stringify(res.object));
              that.$router.replace({
                path: '/'
              });
            } else {
              this.tooltip("error", res.message, 3000, "text", false);        
            }
          });
        }, 1000);
      }
    }
  }
}
</script>

<style lang="less">
.backImg {
  width: 100%;
  height: 170px;
}
</style>