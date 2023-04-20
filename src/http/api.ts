const http = uni.$u.http

export const login = (params, config = {}) =>
  http.post('/genIn/login', params, config)

export const getCurrent = () => http.get('/user/getCurrent')

export const getTaskList = (id: any) => http.get(`/singTask/getTask/${id}`)

// 人脸活体检测
export const detectLivingFace = (params: any) =>
  http.post(`/face/detectLivingFace`, params)

// 校验
export const compareFace = (params: any) =>
  http.post(`/face/compareFace`, params)
export const getCurrentDay = (params: any) =>
  http.post(`/singTask/getCurrentDay`, params)
export const createStat = (params: any) =>
  http.post(`/statinfo/create`, params)
