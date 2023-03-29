<template>
  <view>
    <u--form>
      <u-form-item>
        <u--input placeholder="请输入内容" v-model="account.email"
      /></u-form-item>
      <u-form-item>
        <u--input
          placeholder="请输入内容"
          type="password"
          v-model="account.password"
      /></u-form-item>
    </u--form>

    <u-button type="success" text="登录" @click="submit"></u-button>
  </view>
</template>

<script setup lang="ts">
import { onLoad, onReady } from "@dcloudio/uni-app";
import { login } from "@/http/api";
import { onMounted, reactive } from "vue";
import userStore from "@/store/userStore";

const user = userStore();
const account = reactive({
  email: "414359193@qq.com",
  password: "aA123456789",
});
onLoad(() => {
  // 自动登录
  if (uni.getStorageSync("token")) {
    user.setToken(uni.getStorageSync("token")).then(() => {
      uni.showToast({ icon: "none", title: "登录成功" });
      uni.reLaunch({ url: "/pages/schedule/schedule" });
    });
  }
});

// onMounted(() => {
//   console.log(2);
// });

const submit = async () => {
  // 登录
  user.regLogin(account).then(() => {
    uni.reLaunch({ url: "/pages/schedule/schedule" });
  });
};
</script>

<style scoped lang="scss"></style>
