<template>
  <div>
    首页
    <scroll-view
      style="height: 300px"
      scroll-y="true"
      refresher-enabled="true"
      :refresher-triggered="triggered"
      :refresher-threshold="100"
      refresher-background="lightgreen"
      @refresherrefresh="onRefresh"
      @refresherrestore="onRestore"
    >
      {{ info }}
      <u-button @click="entery" type="primary"> 人脸录入</u-button>
      <u-button @click="compara" type="primary"> 人脸检测</u-button>
    </scroll-view>
    <u-button @click="user.logOut()" type="primary"> 退出登录</u-button>
  </div>
</template>

<script setup lang="ts">
import { getTaskList } from "@/http/api";
import userStore from "@/store/userStore";
import { onMounted, ref } from "vue";
const info = ref<any>();
const user = userStore();
const triggered = ref(false);
onMounted(async () => {
  if (user.userInfo.classId) {
    const data = await getTaskList(user.userInfo.classId);
    info.value = data[0]?.taskName;
  }
});

const onRefresh = async () => {
  triggered.value = true;
  if (user.userInfo.classId) {
    const data = await getTaskList(user.userInfo.classId);
    triggered.value = false;

    info.value = data[0]?.taskName;
  }
};

const entery = () => {
  uni.navigateTo({ url: "/pages/face-entery/face-entery" });
};

const compara = () => {
  uni.navigateTo({ url: "/pages/compare-face/compare-face" });
};
const onRestore = () => {
  triggered.value = false;
};
</script>

<style scoped lang="scss"></style>
