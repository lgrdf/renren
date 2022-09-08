import Vue from 'vue'
import Vuex from 'vuex'
import cloneDeep from 'lodash/cloneDeep'
import common from './modules/common'
import user from './modules/user'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    common,
    user
  },
  state:{
    merchantId: +JSON.parse(sessionStorage.getItem('wuehhssyhdinfo')) || 0,
    orderdata: JSON.parse(sessionStorage.getItem('wsdrtsfdodt')) || {}, //订单信息
    outOrder: JSON.parse(sessionStorage.getItem('ksiwpsusout')) || [], //外卖订单
    eatOrder: JSON.parse(sessionStorage.getItem('waerdfrteat')) || [] //堂食订单
  },
  mutations: {
    // 重置vuex本地储存状态
    resetStore (state) {
      Object.keys(state).forEach((key) => {
        state[key] = cloneDeep(window.SITE_CONFIG['storeState'][key])
      })
    },
    //保存商家id
    saveId(state,id){
      state.merchantId = id
      sessionStorage.setItem('wuehhssyhdinfo',id)
    },
    //获取订单对象
    getOrderData(state,order){
      state.orderdata = order
      sessionStorage.setItem('wsdrtsfdodt',JSON.stringify(order))
    },
    //获取外卖订单数组
    getOutArr(state,out){
      const newArr = state.outOrder.push(out)
      sessionStorage.setItem('ksiwpsusout',JSON.stringify(newArr))
    },
    //删除外卖订单
    deleteOutOrder(state,inde){
      const arr2 = state.outOrder.splice(inde,1)
      sessionStorage.setItem('ksiwpsusout',JSON.stringify(arr2))
    },
    //获取堂食订单数组
    getEatArr(state,eatin) {
      const arr = state.eatOrder.push(eatin)
      sessionStorage.setItem('waerdfrteat',JSON.stringify(arr))
    },
    //删除堂食订单
    deleteEatOrder(state,index){
      const arr1 = state.eatOrder.splice(index,1)
      sessionStorage.setItem('waerdfrteat',JSON.stringify(arr1))
    },

  },
  strict: process.env.NODE_ENV !== 'production'
})
