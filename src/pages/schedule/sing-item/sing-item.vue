<template>
  <view class="container" @click="itemClickHandle">
    <view class="header"
      ><image
        src="@/static/call-icon.png"
        mode="scaleToFill"
        style="z-index: 3; width: 70rpx; height: 70rpx"
      />
      <videw class="title">{{ singTaks.taskName }}</videw>
    </view>
    <view>
      <view class="integral"> 持续时间：{{ singTaks.integral }} 秒</view>

      <view class="action-box">
        <view class="time">{{ dayjs(singTaks.taskTime).format('HH:mm') }}</view>
        <view class="tag" :style="acBg">{{
          singTaks.isRun ? '签到中' : '等待签到'
        }}</view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import { CSSProperties, computed } from 'vue'
const props = defineProps<{ singTaks: any }>()

const acBg = computed<CSSProperties>(() =>
  props.singTaks.isRun
    ? { backgroundColor: '#5acf80' }
    : { backgroundColor: '#fac327' }
)

const itemClickHandle = () => {
  if (!props.singTaks.isRun) {
    uni.showToast({title:'签到未开始',icon:'none'})
    return 
  }

  uni.navigateTo({ url: '/pages/compare-face/compare-face' })
}
</script>

<style scoped lang="scss">
.title {
  font-size: 40rpx;
  font-weight: 600;
  margin-left: 20rpx;
}
.header {
  display: flex;
  align-items: center;
}
.container {
  background-color: white;

  padding: 40rpx;
  border-radius: 16rpx;
}

.integral {
  font-size: 24rpx;
  margin-top: 10rpx;
}

.action-box {
  padding: 20rpx;
  border-radius: 10rpx;
  background-color: #f8f6f9;
  margin-top: 10rpx;
  font-size: 50rpx;
  font-weight: 500;
  padding-left: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.tag {
  padding: 10rpx;
  border-radius: 20rpx;
  font-size: 24rpx;
  color: white;
}
</style>
