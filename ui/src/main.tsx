import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ChakraProvider } from '@chakra-ui/react'
import './index.css'
import App from './App.tsx'
import { Provider } from 'react-redux';
import { store } from './store/store';
import { initializeAuthState } from './store/authSlice';
/* import setupAxiosInterceptors from './utils/axiosInterceptor';
setupAxiosInterceptors();

 */

import axios from 'axios';

// 添加响应拦截器
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      // Session 失效，自动跳转登录页
      window.location.href = '/login';
      // 可选：清理本地登录状态
      // localStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);
store.dispatch(initializeAuthState());

createRoot(document.getElementById('root')!).render(
  <StrictMode>
     <Provider store={store}>
    <ChakraProvider>
      <App />
    </ChakraProvider>
    </Provider>
  </StrictMode>,
)


/* 
// src/main.tsx
import { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import Settings, { applySettingsToCssVars } from './config/globalConfig';
import { registerServiceWorker, unregisterServiceWorkersAndClearCache } from './config/sw-register';
import './index.css';
import App from './App';
import SWEventHandlers from './config/SWEventHandlers';

import theme from './theme';
import { Provider } from 'react-redux';
import { store } from './store/store';

function Bootstrap() {
  useEffect(() => {
    applySettingsToCssVars();

    if (import.meta.env.PROD) {
      if (Settings.pwa) {
        registerServiceWorker();
      } else {
        if (location.protocol === 'https:') {
          unregisterServiceWorkersAndClearCache().catch(() => {});
        }
      }
    } else {
      // In dev, ensure no SW is running
      unregisterServiceWorkersAndClearCache().catch(() => {});
    }
  }, []);

  return (
    <Provider store={store}>
    <ChakraProvider theme={theme}>
      <SWEventHandlers />
      <App settings={Settings} />
    </ChakraProvider>
    </Provider>
  );
}

createRoot(document.getElementById('root')!).render(<Bootstrap />); */