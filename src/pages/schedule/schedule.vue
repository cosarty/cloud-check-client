<template>
  <div>
    首页

    <u-button @click="user.logOut()" type="primary"> 退出登录</u-button>
  </div>
</template>

<script setup lang="ts">
import userStore from "@/store/userStore";

const user = userStore();
</script>

<style scoped lang="scss"></style>
