import { changeCount, delSelect, getCartList } from '@/api/cart'
import { Toast } from 'vant'

export default {
  namespaced: true,
  state () {
    return {
      cartList: []
    }
  },
  getters: {
    // 商品总数
    cartTotal (state) {
      return state.cartList.reduce((sum, item) => sum + item.goods_num, 0)
    },
    // 选中的商品项
    selCartList (state) {
      return state.cartList.filter(item => item.isChecked)
    },
    // 选中总0数
    selCount (state, getters) {
      return getters.selCartList.reduce((sum, item) => sum + item.goods_num, 0)
    },
    // 选中的商品总价
    selPrice (state, getters) {
      return getters.selCartList.reduce((sum, item) =>
        sum + item.goods.goods_price_min * item.goods_num, 0).toFixed(2)
    },
    // 是否全选
    isAllChecked (state) {
      return state.cartList.every(item => item.isChecked)
    }
  },
  mutations: {
    setCartList (state, data) {
      state.cartList = data
    },
    toggleCheck (state, goodsId) {
      // 让对应id的商品的isChecked取反
      const goods = state.cartList.find(item => item.goods_id === goodsId)
      goods.isChecked = !goods.isChecked
    },
    toggleAllCheck (state, checked) {
      // 让所有商品的isChecked取反
      state.cartList.forEach(item => {
        item.isChecked = checked
      })
    },
    changeCount (state, { goodsId, goodsNum }) {
      state.cartList.forEach(item => {
        if (item.goods_id === goodsId) {
          item.goods_num = goodsNum
        }
      })
    }
  },
  actions: {
    async getCartAction (context) {
      const { data } = await getCartList()
      // console.log(data.list)
      // 后台返回的数据中，不包含复选框的状态
      // 为了以后操作，需要手动添加一个isChecked属性（标记当前商品是否为选中状态）
      data.list.forEach(item => {
        item.isChecked = true
      })
      context.commit('setCartList', data.list)
    },
    async changeCountAction (context, obj) {
      const { goodsId, goodsSkuId, goodsNum } = obj
      // 先本地修改
      context.commit('changeCount', { goodsId, goodsNum })
      // 再同步到后台
      await changeCount(goodsId, goodsNum, goodsSkuId)
    },
    // 删除商品
    async delSelect (context) {
      const selCartList = context.getters.selCartList
      const cartIds = selCartList.map(item => item.id)
      // console.log(cartIds)
      await delSelect(cartIds)
      Toast.success('删除成功')
      // 重新获取购物车列表
      context.dispatch('getCartAction')
    }
  }
}
