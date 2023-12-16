import axios from 'axios'
import { Toast } from 'vant'
import store from '@/store'

// 创建 axios实例，将来可以对创建出来的实例，进行自定义配置
// 优点：不会污染原始的 axios实例
const instance = axios.create({
  baseURL: 'http://cba.itlike.com/public/index.php?s=/api/',
  timeout: 5000
})

// 自定义配置 - 请求/响应 拦截器
// 添加请求拦截器
instance.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  // 只要有token ,就在请求头中添加token,以便于请求一些需要授权的接口
  const token = store.getters.token
  if (token) {
    config.headers['Access-token'] = token
    config.headers.platform = 'h5'
  }

  // 开启loading, 并且禁止背景点击，避免无效点击
  Toast.loading({
    message: '加载中...',
    forbidClick: true,
    loadingType: 'spinner',
    duration: 0
  })
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 添加响应拦截器
instance.interceptors.response.use(function (response) {
  // 2xx 范围内的状态码都会触发该函数。
  // 对响应数据做点什么 (默认 axios会多包装一层，需要响应拦截器中处理一下)
  const res = response.data
  if (res.status !== 200) {
    // 提示错误信息
    // toast默认是单例模式，如果出现一个新的，会自动清除之前的效果
    Toast.fail(res.message)
    // 抛出错误的promise
    return Promise.reject(res.message)
  } else {
    // 正确情况,直接走核心业务代码，清除loading样式
    Toast.clear()
  }
  return res
}, function (error) {
  // 超出 2xx 范围的状态码都会触发该函数。
  // 对响应错误做点什么
  return Promise.reject(error)
})

// 导出配置好的实例
export default instance
