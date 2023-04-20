<template>
  <view class="box">
    <image
      :src="user?.userInfo?.pic"
      mode="scaleToFill"
      style="
        z-index: 3;
        width: 200rpx;
        height: 200rpx;
        padding-left: 40rpx;
        margin-bottom: 30rpx; ;
      "
    />

    <view
      ><text>姓名</text><text>{{ user?.userInfo?.userName }}</text></view
    >

    <view
      ><text>{{
        user?.auth?.includes?.('student') ? '学号：' : '教师编号：'
      }}</text
      ><text>{{ user?.userInfo?.account }}</text></view
    >

    <view
      ><text>性别：</text>
      <u-tag v-if="user?.userInfo?.sex === 1" text="男" type="success"></u-tag>
      <u-tag v-else text="女" type="error"></u-tag>
    </view>
    <view v-if="user?.auth?.includes('student')"
      ><text>{{ '班级：' }}</text
      ><text>{{ user?.userInfo?.class?.className }}</text></view
    >

    <view
      ><text>邮箱</text><text>{{ user?.userInfo?.email }}</text></view
    >

  

    <view>
      <text>身份：</text>
      <u-tag
        v-for="au in user?.auth"
        :key="au"
        :text="AuthEnum?.[au]"
        type="success"
      ></u-tag>
    </view>
    <view v-if="user?.auth?.includes('student')"
      ><text>人脸：</text
      ><text>{{ user?.userInfo?.face ? '已录入' : '未录入' }}</text></view
    >
    <u-button @click="user.logOut()" type="primary"> 退出登录</u-button>
  </view>
</template>

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import userStore from '@/store/userStore'
import { AuthEnum } from '@/util/AuthEnum'
const user = userStore()
onLoad(() => {})
</script>

<style scoped lang="scss">
.box {
  > view {
    margin-bottom: 30rpx;
    padding-left: 40rpx;
  }
}
</style>
