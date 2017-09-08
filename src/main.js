// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import "./iconfont/fonts/iconfont.css"
import Vue from "vue"
import App from "./App"
import router from "./router"
import { ConfirmPlugin, ToastPlugin } from 'vux'
import VueWechatTitle from 'vue-wechat-title'
Vue.use(VueWechatTitle)
Vue.use(ConfirmPlugin)
Vue.use(ToastPlugin)
Vue.config.productionTip = false

Vue.prototype.tooltip = (customer_class, msg, time, type, callback) => {
  let _this = Vue;
  let msgHtml = "<div class=\"content__customer " + customer_class + "\">" + msg + "</div>";
  _this.$vux.toast.show({
    time: time, type: type, width: "1200em", position: "top", text: msgHtml, onHide: () => {
      if (typeof callback === "function") {
        callback();
      }
    }
  });
}

//钩子函数
router.beforeEach((to, from, next) => {
  // console.log(to);
  if (to.path === '/hasTrained') to.meta.title = to.query.type;
  next();
});

/* eslint-disable no-new */
new Vue({
  el: "#app-box",
  router,
  template: "<App/>",
  components: { App }
})
