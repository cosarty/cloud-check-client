<template>
  <view class="content">
    <!-- <camera
     class="camera"
      mode="normal"
      device-position="front"
      flash="auto"
      @initdone = 'initdone'
     /> -->
    <button @click="startSoterAuthenticationFaceID">开始FaceID认证</button>
  </view>
</template>

<script lang="ts" setup >
import { ref } from "vue";
const title = ref<string>('蔡夏柠')
const startSoterAuthenticationFaceID = () => {
  uni.checkIsSupportSoterAuthentication({
    success(res) {
      uni.showModal({
        content: '支持的认证方式：' + res.supportMode,
        showCancel: false
      });
      console.log(res);
    },
    fail(err) {
      console.log(err);
    }
  });

}
const initdone = (e: any) => {
  console.log('e: ', e);

}
</script>

<style lang="scss" scoped>
.camera {
  width: 400rpx;
  height: 400rpx;
  border-radius: 100%;
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
