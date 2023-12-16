<template>
  <div class="login">
    <!-- 头部  NavBar -->
    <van-nav-bar title="会员登录" left-arrow @click-left="$router.go(-1)"/>
    <!-- 主体 -->
    <div class="container">
      <div class="title">
        <h3>手机号登录</h3>
        <p>未注册的手机号登录后将自动注册</p>
      </div>

      <div class="form">
        <div class="form-item">
          <input
            class="inp"
            maxlength="11"
            v-model="mobile"
            placeholder="请输入手机号码"
            type="text"
          />
        </div>
        <div class="form-item">
          <input
            class="inp"
            maxlength="5"
            v-model="priCode"
            placeholder="请输入图形验证码"
            type="text"
          />
          <img v-if="priUrl" :src="priUrl" alt="" @click="getPriCode"/>
        </div>
        <div class="form-item">
          <input v-model="msgCode" class="inp" placeholder="请输入短信验证码" type="text"/>
          <button @click="getCode">
            {{ second === totalSecond ? '获取验证码' : `${second}秒后重发` }}
          </button>
        </div>
      </div>
      <div @click="login" class="login-btn">登录</div>
    </div>
  </div>
</template>

<script>
// 按需引入api文件
import { getPriCode, getMsgCode, codeLogin } from '@/api/login'

export default {
  name: 'LoginIndex',
  data () {
    return {
      priCode: '', // 用户输入的图形验证码
      priKey: '', // 将来传递的图像验证码的唯一标识
      priUrl: '', // 存储请求渲染的图片地址
      totalSecond: 60, // 倒计时总秒数
      second: 60, // 当前秒数
      timer: null, // 定时器Id
      mobile: '15715136360', // 用户输入的手机号
      msgCode: '' // 用户输入的短信验证码
    }
  },
  created () {
    this.getPriCode()
  },
  methods: {
    // 获取图形验证码
    async getPriCode () {
      const { data: { base64, key } } = await getPriCode()
      this.priUrl = base64 // 存储地址
      this.priKey = key // 存储唯一标识
    },
    // 校验手机号和图形验证码
    // 通过校验，返回true，否则返回false
    validFn () {
      // 校验手机号
      if (!/^1[3-9]\d{9}$/.test(this.mobile)) {
        this.$toast.fail('手机号格式不正确')
        return false
      }
      // 校验图形验证码
      if (!this.priCode) {
        this.$toast.fail('请输入图形验证码')
        return false
      }
      return true
    },
    // 获取验证码
    async getCode () {
      // 校验手机号和图形验证码
      if (!this.validFn()) {
        // 校验不通过，直接return
        return
      }
      // 当目前没有定时器开着，且 totalSecond === second 才可以开始倒计时
      if (!this.timer && this.totalSecond === this.second) {
        // 发送请求，获取验证码
        await getMsgCode(this.priCode, this.priKey, this.mobile)
        this.$toast.success('验证码发送成功')
        // 开启倒计时
        this.timer = setInterval(() => {
          this.second--
          if (this.second === 0) {
            this.second = this.totalSecond
          }
        }, 1000)
      }
    },
    // 登录
    async login () {
      // 校验手机号和图形验证码
      if (!this.validFn()) {
        // 校验不通过，直接return
        return
      }
      if (!/^\d{6}$/.test(this.msgCode)) {
        this.$toast.fail('输入正确的验证码')
        return
      }
      const res = await codeLogin(this.mobile, this.msgCode)
      // 存储个人权证信息
      this.$store.commit('user/setUserInfo', res.data)
      // console.log(res)
      this.$toast.success('登录成功')

      // 进行判断，看地址栏是否有回跳地址
      // 如果有 =》 说明是从其他页面拦截，到此处登录的，需要回跳
      // 如果没有正常去首页
      const url = this.$route.query.backUrl || '/'
      await this.$router.replace(url)
    }

  },
  destroyed () {
    // 离开页面，清除定时器
    clearInterval(this.timer)
  }
}
</script>

<style scoped lang="less">
.container {
  padding: 49px 29px;

  .title {
    margin-bottom: 20px;

    h3 {
      font-size: 26px;
      font-weight: normal;
    }

    p {
      line-height: 40px;
      font-size: 14px;
      color: #b8b8b8;
    }
  }

  .form-item {
    border-bottom: 1px solid #f3f1f2;
    padding: 8px;
    margin-bottom: 14px;
    display: flex;
    align-items: center;

    .inp {
      display: block;
      border: none;
      outline: none;
      height: 32px;
      font-size: 14px;
      flex: 1;
    }

    img {
      width: 94px;
      height: 31px;
    }

    button {
      height: 31px;
      border: none;
      font-size: 13px;
      color: #cea26a;
      background-color: transparent;
      padding-right: 9px;
    }
  }

  .login-btn {
    width: 100%;
    height: 42px;
    margin-top: 39px;
    background: linear-gradient(90deg, #ecb53c, #ff9211);
    color: #fff;
    border-radius: 39px;
    box-shadow: 0 10px 20px 0 rgba(0, 0, 0, 0.1);
    letter-spacing: 2px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
