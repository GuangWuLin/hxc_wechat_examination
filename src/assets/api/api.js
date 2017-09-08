import $ from "jquery";
import vue from "vue";
import axios from "axios";
import { global } from "../../assets/javascript/global.js"
import store from '../../store.js'
// const baseUrl = 'http://10.50.50.249:9696'; // 内网IP
const baseUrl = 'http://182.148.114.194:9696'; // 外网IP
// let baseUrl = `${localStorage.getItem('wechatApi')}`; // 外网IP
// axios实例化
var instance = axios.create({
    baseURL: baseUrl,
    timeout: 10000,
    validateStatus: viewMsgByStatusCode
});

//请求拦截，添加header鉴权
instance.interceptors.request.use(
    config => {
        config.headers.Authorization = JSON.parse(sessionStorage.getItem('userInfo')) === null ? "" : JSON.parse(sessionStorage.getItem('userInfo')).authorization;
        store.commit('LOADING');
        return config;
    },
    err => {
        return Promise.reject(err);
    }
);

//返回状态判断(添加响应拦截器)
instance.interceptors.response.use((res) => {
    //对响应数据做些事
    // alert(1);
    store.commit('LOADED');
    if (res.status === 200 && res.status < 300) {
        return Promise.resolve(res.data);
    }
    else if (res.status === 401) {
        return Promise.resolve(res);
    }
}, (error) => {
    store.commit('LOADED');
    return false;
});

//对请求响应的status做处理
function viewMsgByStatusCode(status) {
    if (status >= 200 && status < 300) {
        return true;
    }
    else {
        vue.$vux.toast.show({
            time: 3000, type: "text", width: "1200em", position: "top", text: "<div class=\"content__customer error\">" + global.enums.statusText[status] + "</div>", onHide: () => {
                if (status === 401) {
                    window.location.replace("/#/userBind");
                }
            }
        });
    }
    return true;
}

export const request = {
    // 短信验证码
    verificationCode: params => { return instance.put(`/examination/sms/send?telephone=` + params); },
    // 根据授权码，获取用户信息
    login: params => { return instance.post(`/examination/wechat/student/login`, params); },
    // 账号绑定
    bind: params => { return instance.post(`/examination/wechat/student/bind`, params); },
    // 获取可约排班列表
    query: params => { return instance.get(`/examination/wechat/schedule/query?companyId=` + params[0] + '&carType=' + params[1] + '&course=' + params[2] + '&gmtBegin=' + params[3] + '&gmtEnd=' + params[4]); },
    // 获取可约排班详情
    schedule: params => { return instance.get(`/examination/wechat/schedule?id=` + params); },
    // 获取收费设置
    expenses: params => { return instance.get(`/examination/wechat/schedule/expenses?companyId=` + params[0] + '&type=' + params[1] + '&course=' + params[2]); },
    // 订单记录列表
    queryOrder: params => { return instance.get(`/examination/wechat/order/query?companyId=` + params[0] + '&studentId=' + params[1] + '&currentPage=' + params[2] + '&pageSize=' + params[3] + '&status=' + params[4]); },
    // 获取订单详情
    order: params => { return instance.get(`/examination/wechat/order?id=` + params); },
    // 查询车辆型号列表
    types: params => { return instance.get(`/examination/car/types`); },
    // 价格预览
    calculate: params => { return instance.post(`/examination/wechat/order/calculate`, params); },
    // 购买
    payNow: params => { return instance.post(`/examination/wechat/order`, params); },
    // 验证码签到
    code_sign: params => { return instance.put(`/examination/wechat/student/code_sign?studentId=` + params[0] + '&verifyCode=' + params[1]); },
    // 扫码签到
    qr_sign: params => { return instance.put(`/examination/wechat/student/qr_sign?studentId=` + params[0] + '&orderId=' + params[1]); },
    // 退款
    refund: params => { return instance.put(`/examination/wechat/order/refund?id=` + params); },
    // 获取微信Ticket（MD5）
    getTicket: params => { return instance.get(`/examination/wechat/student/jsapi_ticket?companyId=` + params[0] + "&noncestr=" + params[1] + "&timestamp=" + params[2] + "&url=http://scfree.haoxueche.com/index.html").then(res => res); },
    // 获取微信Ticket（SHA1）
    getTicketBySHA1: params => { return instance.get(`/examination/wechat/student/jsapi_ticket/sha1?companyId=` + params + "&url=http://scfree.haoxueche.com/").then(res => res); }
}