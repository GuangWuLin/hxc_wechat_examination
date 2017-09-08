import Vue from 'vue'
import Router from 'vue-router'
// 手机绑定
import UserBind from '@/components/userBind'
// 绑定成功
import Complete from '@/components/complete'
// 南充考场-考前预约培训
import Reservation from '@/components/reservationBeforeExam'
// 选择培训教练
import ChoseCoach from '@/components/choseCoach'
// 选择培训教练-详情
import ChoseCoachBill from '@/components/choseCoachBill'
// 支付成功
import PaySuccess from '@/components/paySuccess'
// 我的
import Mine from '@/components/mine'
// 培训已完成
import HasTrained from '@/components/hasTrained'
// 扫码
import Scan from '@/components/scan'


Vue.use(Router)

export default new Router({
  routes: [
    { path: '/', name: 'reservation', component: Reservation, meta: { title: '南充考场-考前预约培训', requireAuth: true }, hidden: true },
    // { path: '/reservation',name: 'reservation',component: Reservation,meta:{title:'南充考场-考前预约培训',requireAuth:true},hidden: true},
    { path: '/userBind', name: 'userBind', component: UserBind, meta: { title: '手机绑定', requireAuth: true }, hidden: true },
    { path: '/complete', name: 'complete', component: Complete, meta: { title: '绑定成功', requireAuth: true }, hidden: true },
    { path: '/choseCoach', name: 'choseCoach', component: ChoseCoach, meta: { title: '选择培训教练', requireAuth: true }, hidden: true },
    { path: '/choseCoachBill', name: 'choseCoachBill', component: ChoseCoachBill, meta: { title: '选择培训教练', requireAuth: true }, hidden: true },
    { path: '/paySuccess', name: 'paySuccess', component: PaySuccess, meta: { title: '支付成功', requireAuth: true }, hidden: true },
    { path: '/mine', name: 'mine', component: Mine, meta: { title: '我的', requireAuth: true }, hidden: true },
    { path: '/hasTrained', name: 'hasTrained', component: HasTrained, meta: { title: '已完成', requireAuth: true }, hidden: true },
    { path: '/scan', name: 'scan', component: Scan, meta: { title: '扫码', requireAuth: true }, hidden: true },
  ]
})
