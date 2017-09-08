import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// 应用初始状态
const state = {
    showLoading: false
}

// 定义所需的 mutations
const mutations = {
    LOADING(state) {
        state.showLoading = true;
    },
    LOADED(state){
        state.showLoading = false;
    }
}
const getters = {
    showLoading:state => state.showLoading
}
// 创建 store 实例
export default new Vuex.Store({
    state,
    mutations,
    getters
});