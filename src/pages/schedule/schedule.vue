<template>
  <view class="sub-container">
    <view class="schdule-title">签到</view>
    <RrangeDate @change="(date) => getDate(date)" />
    <scroll-view
      class="sub-info"
      scroll-y
      :style="{ height: metListHeight + 'px' }"
      :refresher-enabled="true"
      :refresher-triggered="triggered"
      @refresherrefresh="onRefresh"
      @refresherrestore="onRestore"
    >
   
      <view v-if="sintInfo?.length" class="item" v-for="info in sintInfo" :key="info.singTaskId">
        <singItem :sing-taks="info" @close="closeInfo(info)"
      /></view>
      <view v-else class="empty">
        <image src="@/static/empty_schdule.png" style="width: 200rpx; height: 200rpx;margin-top: 30rpx;"></image>
            暂无活动
      </view>
    </scroll-view>
    <view class="circle" v-if="isTeacher">
        <u-icon name="plus" :size="25"></u-icon>
      </view>
  </view>
</template>

<script setup lang="ts">
import { getCurrentDay } from '@/http/api'
import userStore from '@/store/userStore'
import { computed, getCurrentInstance, nextTick, onMounted, ref } from 'vue'
import RrangeDate from './range-date/index.vue'
import singItem from './sing-item/sing-item.vue'
import { onShow } from '@dcloudio/uni-app'

const proxy = getCurrentInstance()?.proxy
const user = userStore()
const triggered = ref<any>(false)
const isTeacher = computed(()=>user?.auth?.includes?.('teacher'))
const sintInfo = ref([])

const metListHeight = ref(0)
const selectDate = computed(() => user.selectDate?.fullDate ?? '')
const onRefresh = () => {
  triggered.value = true
  getDate(selectDate.value).finally(() => {
    triggered.value = false
  })
}

onShow(() => {
  getDate(selectDate.value)
})

// 获取时间
const getDate = async (date: string) => {
  uni.showLoading({ title: '加载中' })
  const data = await getCurrentDay({ date })
  uni.hideLoading()
  sintInfo.value = data
}

onMounted(() => {
  const query = uni.createSelectorQuery().in(proxy)
  query
    .select('.sub-info')
    .boundingClientRect((data: any) => {
      metListHeight.value = uni.getSystemInfoSync().windowHeight - data.top
    })
    .exec()
})
const onRestore = () => {
  triggered.value = 'restore' // 需要重置
}
// 删除过期
const closeInfo = (info: any) => {
  sintInfo.value = sintInfo.value.filter(
    (s) => s.singTaskId !== info.singTaskId
  )
}
const entery = () => {
  uni.navigateTo({ url: '/pages/face-entery/face-entery' })
}

const compara = () => {
  uni.navigateTo({ url: '/pages/compare-face/compare-face' })
}
</script>

<style scoped lang="scss">
.sub-info {
  border-radius: 15rpx;
  height: inherit;
  width: 670rpx;
  margin: 0 auto;
}

.sub-container {
  position: fixed;
  width: 100%;
  left: 50%;
  transform: translateX(-50%);
  top: 0;
  bottom: var(--window-bottom);
  z-index: 10001;

  .schdule-title {
    box-sizing: border-box;
    padding-top: 80rpx;
    line-height: 90rpx;
    position: relative;
    width: 100%;
    background-image: url('@/static/cloud-bg.png');
    background-repeat: no-repeat;
    background-size: 100%;
    background-position: top 40rpx right;
    font-weight: 700;
    font-size: 50rpx;
    padding-left: 50rpx;
  }
}

.empty{
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
}

.item {
  &:not(:last-of-type) {
    margin-bottom: 30rpx;
  }
}

.circle{
  border-radius: 100%;
  padding: 30rpx;
  position:  fixed;
  right: 30rpx;
  bottom: 60rpx;
  background-color: #89a1d2;
}
</style>
