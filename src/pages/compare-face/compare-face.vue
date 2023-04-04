<template>
  <view class="entery-box">
    <view class="camera-box">
      <camera
        v-if="!isSuccsess"
        class="camera"
        mode="normal"
        device-position="front"
        flash="auto"
        @initdone="done"
      />

      <view v-else class="img-box">
        <image
          src="@/static/entery-succsess.png"
          mode="scaleToFill"
          style="z-index: 3; width: 200rpx; height: 200rpx"
        />
        <image
          :src="img"
          mode="scaleToFill"
          style="z-index: 1; filter: blur(15rpx)"
        />
      </view>
      <com-loading
        v-if="loading"
        style="
          position: absolute;
          left: 50%;
          top: 30%;
          transform: translate(-50%, -50%);
        "
      ></com-loading>
    </view>

    <view class="tip"
      ><text v-if="isSuccsess" class="scu-text">签到成功</text
      ><text v-else class="text">{{
        loading ? "获取中" : "检测中"
      }}</text></view
    >
  </view>
</template>

<script setup lang="ts">
import { compareFace, detectLivingFace } from "@/http/api";
import userStore from "@/store/userStore";
import { onMounted, ref } from "vue";

const user = userStore();
let cameraEngine: any;
const img = ref("");
const loading = ref(true);

const isSuccsess = ref(false);

onMounted(async () => {
  cameraEngine = uni.createCameraContext();
});

const done = () => {
  loading.value = false;
  startEntery();
};

// 循环检测人脸
const startEntery = () => {
  setTimeout(() => {
    cameraEngine.takePhoto({
      quality: "high",
      success({ tempImagePath }: any) {
        uni.getFileSystemManager().readFile({
          filePath: tempImagePath, //选择图片返回的相对路径
          encoding: "base64", //编码格式
          success: async (res) => {
            const data = await compareFace({ imageData: res.data });
            if (!data.isSuccsess) {
              if (data.msg) {
                uni.showToast({
                  title: data.msg,
                  icon: "none",
                });
              }
              startEntery();
              return;
            }
            isSuccsess.value = true;
            img.value = tempImagePath;
          },
        });
      },
      fail(err: any) {
        console.log("err: ", err);
      },
    });
  }, 500);
};
</script>

<style scoped lang="scss">
.entery-box {
  margin: 20rpx;
  background: white;
  height: calc(100vh - 40rpx);
  border-radius: 10rpx;
  box-shadow: 0px 0px 30px #bbb9b9;
  overflow: hidden;
}
.footer {
  display: flex;
  gap: 30rpx;
  justify-content: space-between;
  padding: 0 20rpx;
}

.footer :deep(.u-button) {
  width: 300rpx;
}

.camera-box {
  overflow: hidden;
  padding: 15rpx;
  border: 1px solid rgb(150, 150, 180);
  border-radius: 100%;
  width: min-content;
  height: min-content;
  margin: 90rpx auto 50rpx;
  position: relative;
}
.camera {
  width: 500rpx;
  height: 500rpx;
  border-radius: 100%;
}

.tip {
  height: min-content;
  margin-bottom: 30px;
  text-align: center;
}
.tip .text {
  padding: 10rpx 70rpx;
  outline: none;
  background: #e67e22;

  border: solid 3px red;
  color: white;
}

.tip .scu-text {
  color: #e67e22;
}

.img-box {
  width: 500rpx;
  height: 500rpx;
  border-radius: 100%;

  position: relative;
}
.img-box image {
  width: inherit;
  height: inherit;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  position: absolute;
  border-radius: 100%;
}

.tip .text::after {
  content: "";
  display: inline-block;
  height: 3px;
  width: 3px;
  box-shadow: 3px 0 currentColor, 9px 0 currentColor, 15px 0 currentColor;
  animation-name: point;
  animation-duration: 1s;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
  margin-left: 5px;
}

@keyframes point {
  from {
    box-shadow: none;
  }

  30% {
    box-shadow: 3px 0 currentColor;
  }

  60% {
    box-shadow: 3px 0 currentColor, 9px 0 currentColor;
  }

  90% {
    box-shadow: 3px 0 currentColor, 9px 0 currentColor, 15px 0 currentColor;
  }
}
</style>
