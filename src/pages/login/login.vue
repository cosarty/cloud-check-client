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
import { onReady } from "@dcloudio/uni-app";
import { login } from "@/http/user";
import { reactive } from "vue";

const account = reactive({
  email: "414359193@qq.com",
  password: "aA123456789",
});
onReady(() => {
  // uni.reLaunch({ url: "/pages/profile/profile" });
});

const submit = async () => {
  const data = await login({ ...account });
  console.log("data: ", data);

  uni.reLaunch({ url: "/pages/schedule/schedule" });
};
</script>

<style scoped lang="scss"></style>
