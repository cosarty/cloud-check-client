<template>
  <view class="login-box">
    <view class="login-header">
      <image
        src="@/static/cloud-icon.png"
        mode="scaleToFill"
        style="
          z-index: 3;
          width: 220rpx;
          height: 220rpx;
          outline: dotted 9rpx #5558df;
          outline-offset: -28rpx;
        "
      />
      <view class="login-title"> 您好\n欢迎使用云签到 </view>
    </view>

    <view class="login-tag">
      <u-tabs
        :activeStyle="{
          color: '#303133',
          fontWeight: 'bold',
          transform: 'scale(1.05)',
        }"
        :list="[{ name: '密码登录' }]"
      ></u-tabs>
    </view>

    <view class="login-form">
      <u--form>
        <u-form-item>
          <u--input
            prefixIcon="account"
            clearable
            border="bottom"
            placeholder="请输入内容"
            v-model="account.email"
            prefixIconStyle="font-size: 22px;color: #909399"
        /></u-form-item>
        <u-form-item>
          <u--input
            prefixIcon="lock"
            clearable
            border="bottom"
            placeholder="请输入内容"
            type="password"
            v-model="account.password"
            prefixIconStyle="font-size: 22px;color: #909399"
        /></u-form-item>
      </u--form>
    </view>

    <view class="login-button">
      <u-button type="primary" text="登录" @click="submit"></u-button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { onLoad, onReady } from '@dcloudio/uni-app'
import { onMounted, reactive } from 'vue'
import userStore from '@/store/userStore'

const user = userStore()
const account = reactive({
  email: '12345@qq.com',
  password: 'aA12345678',
})
onLoad(() => {
  // 自动登录
  if (uni.getStorageSync('token')) {
    user.setToken(uni.getStorageSync('token')).then(() => {
      uni.showToast({ icon: 'success', title: '登录成功', duration: 500 })
      setTimeout(() => {
        uni.reLaunch({ url: '/pages/schedule/schedule' })
      }, 500)
    })
  }
})

// onMounted(() => {
//   console.log(2);
// });

const submit = async () => {
  // 登录
  user.regLogin(account).then(() => {
    uni.showToast({ icon: 'none', title: '登录成功', duration: 500 })
    setTimeout(() => {
      uni.reLaunch({ url: '/pages/schedule/schedule' })
    }, 500)
  })
}
</script>

<style scoped lang="scss">
.login-box {
  position: relative;

  &::before {
    content: '';
    background-image: url('@/static/cloud-bg.png');
    background-repeat: no-repeat;
    background-size: 100% 20%;
    opacity: 0.3;
    z-index: 0;
    height: inherit;
    width: inherit;
    position: absolute;
    top: 20rpx;
    left: 0;
  }
  height: 100vh;
  width: 100vw;
}

.login-header {
  margin-top: 60rpx;
  padding: 27rpx;
  display: flex;
  align-items: center;
}

.login-title {
  white-space: pre-wrap;
  margin-left: 20rpx;
  line-height: 1.8;
  font-size: 42rpx;
  font-weight: 700;
}

.login-form,
.login-tag,
.login-button {
  max-width: 670rpx;
  margin: 0 auto;
  margin-bottom: 50rpx;
}

.login-tag{
  margin-bottom: 20rpx;
}
</style>
