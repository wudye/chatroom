import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ChakraProvider } from '@chakra-ui/react'
import './index.css'
import App from './App.tsx'
import { Provider } from 'react-redux';
import { store } from './store/store';
import { initializeAuthState } from './store/authSlice';

// Environment setup


// Import axios after environment setup
import axios from 'axios';

/* // 添加响应拦截器 this is for session timeout handling when bakcend returns 401 Unauthorized because session expired
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      // Session 失效，自动跳转登录页
      window.location.href = '/login';
      // 可选：清理本地登录状态
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('auth');
      store.dispatch({ type: 'auth/logout' }); // 假设你有一个 logout action
      console.log('Session expired, redirecting to login.');
    }
    return Promise.reject(error);
  }
); */

import setupAxiosAuth from './auth/setupAxiosAuth.ts'
setupAxiosAuth();

// Initialize auth state from localStorage when the app starts
// This ensures that the Redux store is in sync with any existing auth tokens in localStorage
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