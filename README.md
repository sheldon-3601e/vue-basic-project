# 智慧商城-vue

![image-20231217220735707](https://gitee.com/sheldon_kkk/typora-image/raw/master/img/202312172207929.png)

## 学习要点

### 目录结构

- src/api 目录
  - 存储接口模块 (发送ajax请求接口的模块)
- src/utils 目录
  - 存储一些工具模块 (自己封装的方法)

### 路由配置

- 单个页面独立展示的	=>	一级路由
- 都在一个页面上展示的	=>	二级路由 

### request模块—axios封装

![image-20231217235026685](https://gitee.com/sheldon_kkk/typora-image/raw/master/img/202312172350742.png)

在项目开发中，对axios进行二次封装，单独封装到一个模块中，便于使用

```vue
// 添加请求拦截器
axios.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    return response;
  }, function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    return Promise.reject(error);
  });
```

#### 1. 添加请求等待效果

可以在**请求拦截器**，开启等待效果

可以在**响应拦截器**，关闭等待效果

#### 2. 统一处理错误提示

可以在**响应拦截器**中判断请求状态，如果`statue !== 200`

则提供错误提示

#### 3.在请求中携带token，完成权证验证

```vue
// 请求拦截器中
const token = store.getters.token
  if (token) {
    config.headers['Access-Token'] = token
    config.headers.platform = 'H5'
  }
  return config
```



### 封装api接口

![image-20231217235043664](https://gitee.com/sheldon_kkk/typora-image/raw/master/img/202312172350710.png)

> 将请求接口封装成方法，统一存放到api模块，与页面分离

![image-20231217221431790](https://gitee.com/sheldon_kkk/typora-image/raw/master/img/202312172214859.png)

### vuex—登陆权证信息存储

![image-20231217235124691](https://gitee.com/sheldon_kkk/typora-image/raw/master/img/202312172351728.png)

**vuex 构建 user 模块存储登录权证 (token & userId)**



### storage存储模块—vuex持久化存储

**封装 storage 存储模块，利用本地存储，进行 vuex 持久化处理**

新建 `utils/storage.js` 封装方法，是数据本地化处理

```vue
// 约定一个通用的键名
// 个人信息
const INFO_KEY = 'hm_shopping_info'
// 搜索历史
const HISTORY_KEY = 'hm_history_list'

// 获取个人信息
export const getInfo = () => {
  const defaultObj = { token: '', userId: '' }
  const result = localStorage.getItem(INFO_KEY)
  return result ? JSON.parse(result) : defaultObj
}

// 设置个人信息
export const setInfo = (obj) => {
  localStorage.setItem(INFO_KEY, JSON.stringify(obj))
}

// 移除个人信息
export const removeInfo = () => {
  localStorage.removeItem(INFO_KEY)
}

// 获取搜索历史
export const getHistoryList = () => {
  const result = localStorage.getItem(HISTORY_KEY)
  return result ? JSON.parse(result) : []
}

// 设置搜索历史
export const setHistoryList = (arr) => {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(arr))
}

```

### 路由前置守卫

基于全局前置守卫，进行页面访问拦截处理

![image-20231217223340075](https://gitee.com/sheldon_kkk/typora-image/raw/master/img/202312172233139.png)

```vue
router.beforeEach((to, from, next) => {
  // 1. to   往哪里去， 到哪去的路由信息对象  
  // 2. from 从哪里来， 从哪来的路由信息对象
  // 3. next() 是否放行
  //    如果next()调用，就是放行
  //    next(路径) 拦截到某个路径页面
})
```

#### 路由回跳

如果想要通过路由返回上一页，可以在跳转的时候，添加一个参数`backUrl`

```vue
this.$router.replace({
	path: '/login',
	query: {
		backUrl: this.$route.fullPath
	}
})
```

在对应页面时，需要跳转路由时，需要先进行判断

如果当前路由地址有backUrl参数，就回跳，

如果没有，则正常进行回跳

```vue
// 判断有无回跳地址
const url = this.$route.query.backUrl || '/'
this.$router.replace(url)
```

### mixins 复用

新建一个 mixin 文件   `mixins/loginConfirm.js`

当组件中引入该文件时

- 混入的内容会和页面中的内容进行合并，如果有同名，则进行覆盖，组建的优先级更高
- 如果编写了生命周期函数，则mixins中的生命周期函数和 页面中的生命周期会组成同一个数组，统一执行

### 打包优化

#### 1.配置publicPath

使得打包文件中的路径该文相对路径

不需要从根目录找

```vue
module.exports = {
  // 设置获取.js,.css文件时，是以相对地址为基准的。
  // https://cli.vuejs.org/zh/config/#publicpath
  publicPath: './'
}
```



#### 2.路由懒加载

路由懒加载 & 异步组件， 不会一上来就将所有的组件都加载，而是访问到对应的路由了，才加载解析这个路由对应的所有组件

修改路由组件的引入方式

```vue
const ProDetail = () => import('@/views/prodetail')
const Pay = () => import('@/views/pay')
const MyOrder = () => import('@/views/myorder')
```

## 功能实现

