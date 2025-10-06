import { BACKEND_HOST_LOCAL, BACKEND_HOST_PROD } from './UrlConfig';
import { createStandaloneToast } from '@chakra-ui/react'

const { toast } = createStandaloneToast()

// Local lightweight replacements for Umi types to avoid pulling @umijs packages
// We only declare the fields used in this file.
export interface RequestOptions {
  url?: string
  headers?: Record<string, any>
  // allow arbitrary extra props
  [key: string]: any
}

export interface RequestConfig {
  baseURL?: string
  withCredentials?: boolean
  requestInterceptors?: Array<(config: RequestOptions) => RequestOptions | Promise<RequestOptions>>
  responseInterceptors?: Array<(response: any) => any | Promise<any>>
  // allow arbitrary extra props
  [key: string]: any
}
/* import { message } from 'antd'; */

// 与后端约定的响应数据格式
interface ResponseStructure {
  success: boolean;
  data: any;
  errorCode?: number;
  errorMessage?: string;
}
const isDev = import.meta.env.VITE_DEBUG_MODE
/**
 * @name 错误处理
 * pro 自带的错误处理， 可以在这里做自己的改动
 * @doc https://umijs.org/docs/max/request#配置
 */
export const requestConfig: RequestConfig = {
  baseURL: isDev ? BACKEND_HOST_LOCAL : BACKEND_HOST_PROD,
  withCredentials: true,

  // 请求拦截器
  requestInterceptors: [
    (config: RequestOptions) => {
      // 拦截请求配置，进行个性化处理。
      const headers = {};
      const tokenName = localStorage.getItem('tokenName');
      const tokenValue = localStorage.getItem('tokenValue');
      if (tokenName && tokenValue) {
        // @ts-ignore
        headers[tokenName] = tokenValue as any;
      }
      config.headers = headers;
      return config;
    },
  ],

  // 响应拦截器
  responseInterceptors: [
    (response) => {
      // 请求地址
      const requestPath: string = response.config.url ?? '';

      // 响应
      const { data } = response as unknown as ResponseStructure;
      if (!data) {
        toast({ title: '服务异常', status: 'error', duration: 5000, isClosable: true })
        // throw new Error('服务异常');
      }

      // 错误码处理
      const code: number = data.code;
      // 未登录，且不为获取用户登录信息接口
      if (
        (code === 40100 || code === 50001) &&
        !requestPath.includes('user/get/login') &&
        !location.pathname.includes('/user/login')
      ) {
        // 跳转至登录页
        window.location.href = `/user/login?redirect=${window.location.href}`;
        throw new Error('请先登录');
      }

      if (code !== 0) {
        toast({ title: data.message || '错误', status: 'error', duration: 5000, isClosable: true })
      }
      return response;
    },
  ],
};








how to do a global middleware in react project  like spring security did
在 React 项目中实现类似 Spring Security 的全局中间件功能，可以通过以下方式实现。React 本身没有直接等同于 Spring Security 的机制，但可以通过路由拦截、上下文（Context）和自定义 Hook 来模拟类似的功能。

1. 使用路由拦截（推荐）
React Router 提供了路由守卫功能，可以在路由跳转前进行权限校验或其他全局逻辑。

实现步骤
创建权限校验组件： 在 src 目录下创建 AuthMiddleware.tsx 文件，用于封装权限校验逻辑。

封装路由守卫： 使用 useEffect 和 useNavigate 实现路由拦截。

typescript
import { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';

const AuthMiddleware = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login'); // 未登录则跳转到登录页
    }
  }, [navigate]);

  return <Outlet />; // 渲染子路由
};

export default AuthMiddleware;
应用到路由配置： 在 App.tsx 中，将需要权限校验的路由包裹在 AuthMiddleware 中。

typescript
const router = createBrowserRouter([
  {
    path: '/',
    element: <AuthMiddleware />, // 全局拦截
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/user', element: <UserPage /> },
    ],
  },
  { path: '/login', element: <LoginPage /> },
]);
2. 使用上下文（Context）
通过 React 的 Context API 实现全局状态管理，结合拦截逻辑。

实现步骤
创建 AuthContext： 在 src/context/AuthContext.tsx 中定义上下文。

typescript
import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext<{ isAuthenticated: boolean }>({ isAuthenticated: false });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
    if (!token) navigate('/login');
  }, [navigate]);

  return <AuthContext.Provider value={{ isAuthenticated }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
包裹根组件： 在 main.tsx 中包裹 App 组件。

typescript
import { AuthProvider } from './context/AuthContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <AuthProvider>
    <App />
  </AuthProvider>
);
在组件中使用： 在需要权限的组件中调用 useAuth 。

typescript
const { isAuthenticated } = useAuth();
if (!isAuthenticated) return <Navigate to="/login" />;
3. 使用 Axios 拦截器
如果项目中使用 Axios 进行 HTTP 请求，可以通过拦截器实现全局请求/响应拦截。

实现步骤
配置 Axios 拦截器： 在 src/api/axios.ts 中配置。

typescript
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const axiosInstance = axios.create();

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login'; // 强制跳转
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
全局使用： 在项目中统一使用 axiosInstance 发起请求。

4. 结合 Redux Middleware
如果项目使用 Redux，可以自定义中间件实现全局逻辑。

实现步骤
创建 Redux Middleware： 在 src/store/middleware/authMiddleware.ts 中定义。

typescript
import { Middleware } from '@reduxjs/toolkit';
import { logout } from '../slices/authSlice';

const authMiddleware: Middleware = (store) => (next) => (action) => {
  if (action.type === 'FETCH_DATA_REJECTED' && action.payload?.status === 401) {
    store.dispatch(logout()); // 触发登出逻辑
  }
  return next(action);
};

export default authMiddleware;
应用到 Redux Store： 在 store.ts 中注册中间件。

typescript
import { configureStore } from '@reduxjs/toolkit';
import authMiddleware from './middleware/authMiddleware';

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(authMiddleware),
});
总结
路由拦截：适合页面级权限控制。
Context API：适合全局状态管理。
Axios 拦截器：适合 API 请求层面的拦截。
Redux Middleware：适合 Redux 项目的全局逻辑。
根据项目需求选择合适的方式，推荐优先使用路由拦截和 Axios 拦截器组合实现类似 Spring Security 的功能。

1 个文件



