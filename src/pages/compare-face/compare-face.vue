<template>
  <view class="entery-box">
    <template v-if="!isSuccsess">
      <template v-if="action.includes('location') && !action.includes('face')">
        <view class="call-button" :class="{ disable: !isPass }" @click="submit">
          {{ isPass ? '签到打卡' : '当前不在签到范围内' }}</view>
      </template>

      <template v-if="action.includes('face') && isFace && false">
        <view v-if="action.includes('location') && !isPass" class="call-button disable">
          当前不在签到范围内</view>
        <template v-else>
          <view class="camera-box">
            <camera v-if="!isSuccsess" class="camera" mode="normal" device-position="front" flash="auto"
              @initdone="done" />

            <view v-else class="img-box">
              <image src="@/static/entery-succsess.png" mode="scaleToFill"
                style="z-index: 3; width: 200rpx; height: 200rpx" />
              <image :src="img" mode="scaleToFill" style="z-index: 1; filter: blur(15rpx)" />
            </view>
            <com-loading v-if="loading" style="
                position: absolute;
                left: 50%;
                top: 30%;
                transform: translate(-50%, -50%);
              "></com-loading>
          </view>

          <view class="tip"><text v-if="isSuccsess" class="scu-text">签到成功</text><text v-else class="text">{{
            loading ? '获取中' : '检测中'
          }}</text></view>
        </template>
      </template>

      <template v-if="action.includes('face') && isFace">
        <u-popup :show="true" :round="10" mode="center">
          <view
            style="width: 500rpx;height: 300rpx;padding:0 20rpx 20rpx;display: flex;justify-content: center;flex-direction: column;">
            <text>您还未录入人脸请先录入人脸，再进行签到</text>
            <view style="display: flex; justify-content: space-around;margin-top: 30rpx;">
              <u-button text="取消" type="warning" style="width: 150rpx;" @click="cancel
"></u-button>
              <u-button type="primary" text="确定" style="width: 150rpx;"></u-button>
            </view>
          </view>
        </u-popup>
      </template>

      <template v-if="!action.length">
        <view class="call-button" @click="submit"> 签到打卡</view>
      </template>
    </template>
    <template v-else>
      <view class="tip"><text class="scu-text">签到成功</text></view>
    </template>
  </view>
</template>

<script setup lang="ts">
import { compareFace, createStat } from '@/http/api'
import userStore from '@/store/userStore'
import { onLoad } from '@dcloudio/uni-app'
import { computed, onMounted, ref, watch } from 'vue'
import dayjs from 'dayjs'
const user = userStore()
let cameraEngine: any
const img = ref('')
const loading = ref(true)

const isSuccsess = ref(false)
const data = ref<any>({})

const isFace = computed(() => user?.userInfo?.face)

const isPass = ref<any>(false)

// 获取位置的时候转圈

onLoad(({ info }) => {


  info = JSON.parse(decodeURIComponent(info))
  data.value = info
  if (info.sustain) {
    uni.getLocation({
      type: 'gcj02', // 使用国标坐标系
      isHighAccuracy: true, // 高精度定位，会调用gps获取高精度坐标
      success: (res) => {
        const { latitude, longitude } = res
        if (info.area || info.location) {
          const location = info.location ?? info.area?.location
          if (location) {
            const l = JSON.parse(location)

            if (
              getDistance(latitude, longitude, l.lat, l.lng).toFixed(2) <=
              info.sustain
            ) {
              isPass.value = true
            }
          }
        }
      },
    })
  }

})

const cancel = () => {
  uni.navigateBack()
}


const getDistance = (la1, lo1, la2, lo2) => {
  // 当前的纬度，当前的经度，接口拿到的纬度，接口拿到的经度
  let La1 = (la1 * Math.PI) / 180.0
  let La2 = (la2 * Math.PI) / 180.0
  let La3 = La1 - La2
  let Lb3 = (lo1 * Math.PI) / 180.0 - (lo2 * Math.PI) / 180.0
  let distance =
    2 *
    Math.asin(
      Math.sqrt(
        Math.pow(Math.sin(La3 / 2), 2) +
        Math.cos(La1) * Math.cos(La2) * Math.pow(Math.sin(Lb3 / 2), 2)
      )
    )
  distance = distance * 6378.137
  distance = Math.round(distance * 10000) / 10000
  return distance * 1000
}

const action = computed(() => {
  const { area, location, isFace } = data.value
  const a = []
  if (isFace) {
    a.push('face')
  }
  if (area || location) {
    a.push('location')
  }

  return a
})

onMounted(async () => {
  cameraEngine = uni.createCameraContext()
})

const done = () => {
  loading.value = false
  startEntery()
}




// 循环检测人脸
const startEntery = () => {
  setTimeout(() => {
    cameraEngine.takePhoto({
      quality: 'high',
      success({ tempImagePath }: any) {
        uni.getFileSystemManager().readFile({
          filePath: tempImagePath, //选择图片返回的相对路径
          encoding: 'base64', //编码格式
          success: async (res) => {
            const data = await compareFace({ imageData: res.data })
            if (!data.isSuccsess) {
              if (data.msg) {
                uni.showToast({
                  title: data.msg,
                  icon: 'none',
                })
              }
              startEntery()
              return
            }
            isSuccsess.value = true
            img.value = tempImagePath
            await createStat({
              // location: JSON.stringify(location),
              // locationName,
              singTaskId: data.value.singTaskId,
              type: 1,
              classScheduleId: data.value.singTclassScheduleIdaskId,
              sustain: data.value.sustain,
            })
          },
        })
      },
      fail(err: any) {
        console.log('err: ', err)
      },
    })
  }, 500)
}



const submit = async () => {
  const { taskTime, integral } = data.value

  if (dayjs(taskTime).add(integral, 'second').isAfter(new Date())) {
    await createStat({
      singTaskId: data.value.singTaskId,
      type: 1,
      classScheduleId: data.value.singTclassScheduleIdaskId,
      sustain: data.value.sustain,
    })
    isSuccsess.value = true
  } else {
    uni.showToast({
      title: '签到时间过期',
      icon: 'none',
      duration: 1000,

    })
    setTimeout(() => {
      uni.navigateBack()
    }, 1000)

  }




}
</script>

<style scoped lang="scss">
.call-button {
  width: 400rpx;
  height: 400rpx;
  border-radius: 100%;
  // border: 2px solid red;
  background-image: linear-gradient(to right, #91a4ed 0%, #48c6ef 100%);
  box-shadow: 2px 3px 20px -5px #48c6ef;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 400;
  font-size: 45rpx;
  color: white;

  &.disable {
    background-image: linear-gradient(to right, #a6a8ae 0%, #78797a 100%);
    box-shadow: 2px 3px 20px -5px #505252;
    cursor: not-allowed;
    user-select: none;
    pointer-events: none;
  }
}

.entery-box {
  margin: 20rpx;
  background: white;
  height: calc(100vh - 40rpx);
  border-radius: 10rpx;
  box-shadow: 0px 0px 30px #bbb9b9;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
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
  margin: 0 auto 50rpx;
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
  content: '';
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
