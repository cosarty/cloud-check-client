import { getCurrent, login } from "@/http/api";
import { defineStore } from "pinia";
import { onMounted, ref } from "vue";

const userStore = defineStore("user", () => {
  const token = ref<string>("");
  const userInfo = ref<any>();

  const selectDate = ref<any>('')
  const regLogin = async (param: any) => {
    const data = await login({ ...param });
    token.value = data.token;
    uni.setStorageSync("token", data.token);
    await getCurrentUser();
  };

  const setToken = async (t: string) => {
    token.value = t;
    await getCurrentUser();
  };
  const getCurrentUser = async () => {
    const data = await getCurrent();
    userInfo.value = data;
  };

  const logOut = () => {
    token.value = undefined;
    uni.removeStorageSync("token");
    userInfo.value = undefined;

    uni.showToast({
      title: "退出登录成功",
      duration: 500,
      icon: "none",
    });
    setTimeout(() => {
      uni.reLaunch({
        url: "/pages/login/login",
      });
    }, 500);
  };

  const setSlectDate = (data: any) => {
    if (!data) return 
    selectDate.value = data
  }
  return { token, regLogin, logOut, getCurrentUser, setToken, userInfo,setSlectDate,selectDate };
});

export default userStore;
