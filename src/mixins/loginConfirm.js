export default {
  // 此处编写的就是vue组件实例的配置项，通过一定的语法，就可以直接混入组件内部
  // 例如：methods，data，computed，watch，生命周期等
  // 注意点
  // 1.混入的内容会和页面中的内容进行合并，如果有同名，则进行覆盖，组建的优先级更高
  // 2.如果编写了生命周期函数，则mixins中的生命周期函数和 页面中的生命周期会组成同一个数组，统一执行
  // 会先执行混入的生命周期函数，再执行组件内部的生命周期函数

  methods: {
    loginConfirm () {
      // 根据登陆状态判断是否需要跳转到登陆页面
      // 如果需要，返回true，否则返回false
      // 判断token是否存在
      if (!this.$store.getters.token) {
        // 不存在，跳转到登录页面
        console.log('不存在')
        this.$dialog.confirm({
          title: '温馨提示',
          message: '此操作需要登录，是否跳转到登录页面？',
          confirmButtonText: '去登陆',
          cancelButtonText: '再逛逛'
        }).then(() => {
          // 如果希望登录成功后，跳转到之前的页面，可以传递一个参数：当前的路径地址
          // this.$route.fullPath
          // replace方法，替换当前的路由地址，不会留下历史记录
          this.$router.replace({
            path: '/login',
            query: {
              backUrl: this.$route.fullPath
            }
          })
        }).catch(() => {
        })
        return true
      }
      return false
    }
  }
}
