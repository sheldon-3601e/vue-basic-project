import { getInfo, setInfo } from '@/utils/storage'

export default {
  namespaced: true,
  state () {
    return {
      // 个人权证相关
      userInfo: getInfo()
    }
  },
  mutations: {
    // 所有mutations的第一个参数都是state
    setUserInfo (state, obj) {
      state.userInfo = obj
      // 进行持久化处理
      setInfo(obj)
    }
  },
  actions: {},
  getters: {}

}
