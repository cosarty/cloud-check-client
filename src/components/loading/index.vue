<template>
  <view class="loadingFour">
    <text></text>
    <text></text>
    <text></text>
    <text></text>
    <text></text>
  </view>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.loadingFour {
  width: 150px;
  height: 15px;
  margin: 0 auto;
  margin-top: 100px;
  text-align: center;
}
.loadingFour text {
  display: inline-block;
  width: 15px;
  height: 100%;
  margin-right: 5px;
  background: lightgreen;
  animation: load 1.04s ease infinite;
}
.loadingFour text:last-child {
  margin-right: 0px;
}
@keyframes load {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
.loadingFour text:nth-child(1) {
  animation-delay: 0.13s;
}
.loadingFour text:nth-child(2) {
  animation-delay: 0.26s;
}
.loadingFour text:nth-child(3) {
  animation-delay: 0.39s;
}
.loadingFour text:nth-child(4) {
  animation-delay: 0.52s;
}
.loadingFour text:nth-child(5) {
  animation-delay: 0.65s;
}
.loadingTwo {
  width: 150px;
  height: 4px;
  border-radius: 2px;
  margin: 0 auto;
  margin-top: 100px;
  position: relative;
  background: lightgreen;
  animation: changeBgColor 1.04s ease-in infinite alternate;
  animation: changeBgColor 1.04s ease-in infinite alternate;
}
.loadingTwo text {
  display: inline-block;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: lightgreen;
  position: absolute;
  margin-top: -7px;
  margin-left: -8px;
  animation: changePosition 1.04s ease-in infinite alternate;
  animation: changePosition 1.04s ease-in infinite alternate;
}
@keyframes changeBgColor {
  0% {
    background: lightgreen;
  }
  100% {
    background: lightblue;
  }
}
@keyframes changePosition {
  0% {
    background: lightgreen;
  }
  100% {
    margin-left: 142px;
    background: lightblue;
  }
}
</style>
