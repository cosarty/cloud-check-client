export interface IData {
  data: any;
  expire?: number;
}

class Storage {
  set(key: string, data: any, expire?: number) {
    let cache: IData = { data };
    if (expire) {
      cache.expire = new Date().getTime() + data.expire * 1000;
    }
    uni.setStorageSync(key, JSON.stringify(cache));
  }
  get(key: string, defaultValue: any = null): any {
    const cacheStore = uni.getStorageSync(key);
    if (cacheStore) {
      const cache = JSON.parse(cacheStore);
      const expire = cache?.expire;
      if (expire && expire < new Date().getTime()) {
        uni.removeStorageSync(key);
        return defaultValue;
      }
      return cache.data;
    }
    return defaultValue;
  }
  remove(key: string) {
    uni.removeStorageSync(key);
  }
}

export default new Storage();
