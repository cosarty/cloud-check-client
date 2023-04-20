<template>
  <view class="range-date">
    <view class="range-date-content">
      <view class="range-header">
        <view class="header-left" @tap="passWeek(-1)">
          <u-icon name="arrow-left" color="#2979ff" size="28"></u-icon>
        </view>
        <view class="header-content" @tap="checkDate">
          {{ info.currentMonth }}
        </view>
        <view class="header-right" @tap="passWeek(1)">
          <u-icon name="arrow-right" color="#2979ff" size="28"></u-icon>
        </view>
      </view>
      <view class="week-calend">
        <view class="week-day">
          <view v-for="day in info.week_enum" :key="day">{{ day }}</view>
        </view>
        <view class="week-date">
          <view
            v-for="day in info.cutWeek"
            :key="day.date"
            :class="{ 'day-select': day.fullDate === selectDate }"
            @tap="changeDate(day)"
          >
            {{ day.date }}
          </view>
        </view>
      </view>
    </view>
  </view>
  <u-datetime-picker
    @close="info.show = false"
    closeOnClickOverlay
    :show="info.show"
    v-model="info.dateTime"
    mode="date"
    @cancel="info.show = false"
    @confirm="confirmHandle"
  ></u-datetime-picker>
</template>

<script setup lang="ts">
import { mapState } from 'pinia'
import RenderWeekInfo, { WEEK_DAY_ENMU } from '@/util/renderWeekInfo'
import { computed, nextTick, reactive, watch } from 'vue'
import userStore from '@/store/userStore'

const emit = defineEmits<{ (e: 'change', data: any) }>()

const user = userStore()

const info = reactive({
  week: undefined,
  cutWeek: [], // 保存单前周数据
  week_enum: WEEK_DAY_ENMU,
  show: false,
  dateTime: Number(new Date()),
  dayTime: new Date().toLocaleDateString().replace(/\//g, '-'),
  currentMonth: '',
})

info.week = new RenderWeekInfo()

const setDate = (date?: any) => {
  if (date) info.week.setDate(date)
  info.cutWeek = info.week.currentWeek
  user.setSlectDate(info.week.selected)
  info.currentMonth = info.week.getCurentMonth[0]
}

// 初始化数据
setDate()

const selectDate = computed(() => user.selectDate?.fullDate ?? '')
const checkDate = () => {
  info.show = true
}

const changeDate = (day) => {
  info.dayTime = day.fullDate
  setDate(day.fullDate)
}
const passWeek = (acount) => {
  info.week.acrossWeek(acount)
  setDate()
}
const confirmHandle = () => {
  info.show = false
  nextTick(() => {
    setDate(info.dateTime)
  })
}
watch(
  selectDate,
  (nd) => {
    emit('change', nd)
  },
  { immediate: true }
)
</script>

<style lang="scss" scoped>
.range-date {
  &-content {
    width: 670rpx;
    height: 320rpx;
    background-color: rgba($color: yellow, $alpha: 0.3);
    border-radius: 16rpx;

    padding: 40rpx;
    box-sizing: border-box;
    margin: 0 auto 10px;
  }
}

.range-date-content {
  display: flex;
  flex-direction: column;

  .range-header {
    display: flex;
    align-items: center;
    margin-bottom: 40rpx;

    .header-content {
      flex: 1;
      text-align: center;
    }
  }

  .week-calend {
    .week-day {
      display: flex;
      justify-content: space-around;

      view {
        width: 60rpx;
        height: 60rpx;
        text-align: center;
      }

      margin-bottom: 20rpx;
    }

    .week-date {
      display: flex;
      justify-content: space-around;

      view {
        color: rgba(158, 158, 158, 1);
        text-align: center;
        border-radius: 100%;
        width: 60rpx;
        line-height: 60rpx;
        background-color: #f0f0f0;

        &.day-select {
          color: white;
          background-color: rgba(35, 114, 255, 1);
        }
      }
    }
  }
}
</style>
