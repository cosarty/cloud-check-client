import userStore from "@/store/userStore";
const install = () => {
  uni.$u.http.setConfig((config) => {
    /* config 为默认全局配置*/
    config.baseURL = "http://localhost:3030/api"; /* 根域名 */
    return config;
  });

  // 请求拦截
  uni.$u.http.interceptors.request.use(
    (config) => {
      const user = userStore();

      if (user.token) {
        config.header.Authorization = `Bearer ${user.token}`;
      }
      return config;
    },
    (config) => {
      // 可使用async await 做异步操作
      return Promise.reject(config);
    }
  );

  // 响应拦截
  uni.$u.http.interceptors.response.use(
    (response) => {
      const data = response.data;

      return data.data;
    },
    (response) => {
      switch (response.statusCode) {
        case 400:
          const { error } = response.data;
          console.log("error: ", error);
          if (Array.isArray(error))
            uni.showToast({ title: error[0].message, icon: "error" });
          else {
            uni.showToast({ title: error, icon: "error" });
          }
          break;
        case 401:
          uni.showToast({ title: "请重新登录", icon: "none" });
          // 退出登录
          userStore().logOut();
          break;
      }
      // 对响应错误做点什么 （statusCode !== 200）
      return Promise.reject(response);
    }
  );
};

export default { install };
