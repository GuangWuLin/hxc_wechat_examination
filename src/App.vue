<template>
  <div id="app">
    <router-view v-wechat-title="$route.meta.title"></router-view>
    <loading :show="showLoading" text="加载中 ..."></loading>
  </div>
</template>

<script>
import { Loading } from 'vux'
import store from './store.js'
export default {
  name: "app",
  components:{
    Loading
  },
  computed: {
    showLoading: {
      get: function() {
        return store.state.showLoading
      },
      set: function() {
        return store.state.showLoading
      }
    }
  }
}

</script>

<style lang="less">
@import "~vux/src/styles/1px.less";
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
