import axios from "axios";
import { setToken, setRefreshToken, getToken } from "./token";
import { refreshToken, isRefreshRequest } from "./refreshToken";

const ins = axios.create({
  baseURL: "http://localhost:5000",
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

// 添加响应拦截器
ins.interceptors.response.use(
  function (res) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    if (res.headers.authorization) {
      const token = res.headers.authorization.replace("Bearer ", "");
      setToken(token);
      ins.defaults.headers.authorization = `Bearer ${token}`;
    }
    if (res.headers.refreshtoken) {
      const refreshToken = res.headers.refreshtoken.replace("Bearer ", "");
      setRefreshToken(refreshToken);
    }
    return res.data;
  },
  async function (error) {
    console.log('%c [ error ]-29', 'font-size:13px; background:pink; color:#bf2c9f;', error)
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    if (error.response.status == 401 && !isRefreshRequest(error.config)) {
      const refreshSuccess = await refreshToken();
      console.log('自动刷新token');
      if (refreshSuccess) {
        error.config.headers.Authorization = `Bearer ${getToken()}`;
        const resp = await ins.request(error.config);
        return resp.data;
      } else {
        console.log('跳转登录')
        return Promise.reject()
      }
    }
    return Promise.reject()
  }
);

export default ins;
