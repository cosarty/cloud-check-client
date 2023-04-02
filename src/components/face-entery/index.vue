<template>
  <view>
    1
    <view> 人脸录入 </view>
    <camera class="camera" mode="normal" device-position="front" flash="auto" />
    <image :src="img" mode="scaleToFill" style="width: 100px; height: 100px" />
    <button @tap="takePhoto">照相</button>
  </view>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
let cameraEngine: any;
const img = ref("");

onMounted(async () => {
  cameraEngine = uni.createCameraContext();
  const listener = cameraEngine.onCameraFrame(async (frame: any) => {});
  // listener.start()
});

const takePhoto = () => {
  cameraEngine.takePhoto({
    quality: "high",
    success({ tempImagePath }: any) {
      console.log("tempImagePath: ", tempImagePath);
      img.value = tempImagePath;
      uni.getFileSystemManager().readFile({
        filePath: tempImagePath, //选择图片返回的相对路径
        encoding: "base64", //编码格式
        success: (res) => {
          console.log("res: ", res);
          uni.request({
            url: "http://localhost:3030/api/face/detectLivingFace",
            method: "POST",
            data: { imageData: res.data },
            success(data) {
              console.log("data: ", data);
            },
          });
        },
      });
    },
    fail(err: any) {
      console.log("err: ", err);
    },
  });
};
</script>

<style scoped>
.camera {
  width: 400rpx;
  height: 400rpx;
  border-radius: 100%;
}
</style>
