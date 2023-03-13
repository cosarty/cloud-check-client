<template>
  <view class="content">
    <!-- <camera class="camera" mode="normal" device-position="front" flash="auto" @initdone='initdone' /> -->
    <image :src="img" mode="scaleToFill" style="width: 100px; height: 100px" />

    <button @tap="takePhoto">照相</button>
    <u-button type="primary">月落</u-button>
  </view>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { onLoad } from "@dcloudio/uni-app";

import { request } from "../../http/axios";
const title = ref<string>("蔡夏柠");
const img = ref("");
let cameraEngine: any;

onLoad(async () => {
  cameraEngine = uni.createCameraContext();
  const listener = cameraEngine.onCameraFrame(async (frame: any) => {});
  // listener.start()
});

const initdone = (e: any) => {
  console.log("e: ", e);
};

const takePhoto = () => {
  cameraEngine.takePhoto({
    quality: "high",
    success({ tempImagePath }: any) {
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
