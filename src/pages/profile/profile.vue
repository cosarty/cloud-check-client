<template>
  <view
    >我的文档

    <u-button @click="user.logOut()" type="primary"> 退出登录</u-button>
  </view>
</template>

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import userStore from '@/store/userStore'
const user = userStore()
onLoad(() => {})
</script>

<style scoped lang="scss"></style>
