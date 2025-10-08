import axios from 'axios';
import { createBrowserHistory } from 'history';

const history = createBrowserHistory();

const setupAxiosInterceptors = () => {
  // 响应拦截器
  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response && error.response.status === 401) {
        // 清理本地登录状态
        localStorage.removeItem('accessToken');
        // 跳转到登录页
        history.replace('/login');
      }
      return Promise.reject(error);
    }
  );
};

export default setupAxiosInterceptors;