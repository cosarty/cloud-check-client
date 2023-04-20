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
        <view class="tag" :style="acBg" v-if="!isCall">{{
          singTaks.isRun ? '签到中' : '等待签到'
        }}</view>
        <view v-else> 已签到</view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import { CSSProperties, computed } from 'vue'

import userStore from '@/store/userStore'
const user = userStore()
const props = defineProps<{ singTaks: any }>()

const isCall = computed(() =>
  props.singTaks.students.find((s) => s.userId === user.userInfo.userId)
)

const acBg = computed<CSSProperties>(() =>
  props.singTaks.isRun
    ? { backgroundColor: '#5acf80' }
    : { backgroundColor: '#fac327' }
)

const emit = defineEmits<{ (e: 'close'): void }>()

const itemClickHandle = () => {
  if (!props.singTaks.isRun) {
    uni.showToast({ title: '签到未开始', icon: 'none' })
    return
  }

  if (
    !dayjs(props.singTaks.taskTime)
      .add(props.singTaks.integral, 'second')
      .isAfter(dayjs())
  ) {
    emit('close')

    uni.showToast({
      title: '签到已结束.',
      icon: 'none',
    })
    return
  }
  uni.navigateTo({
    url:
      '/pages/compare-face/compare-face?info=' +
      encodeURIComponent(JSON.stringify({ ...props.singTaks })),
  })
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
