const http = uni.$u.http;

export const login = (params, config = {}) =>
  http.post("/genIn/login", params, config);
