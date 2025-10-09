// Environment check
const isDev = import.meta.env.MODE === 'development';

/**
 * Backend URLs based on environment
 */
const BACKEND_URLS = {
  development: {
    http: 'http://localhost:8869',
    ws: 'ws://localhost:8090?token='
  },
  production: {
    http: 'https://qingxin.store/wedog',
    ws: 'wss://qingxin.store/ws?token='
  }
};

// Auto-select based on environment
export const BACKEND_HOST = isDev ? BACKEND_URLS.development.http : BACKEND_URLS.production.http;
export const BACKEND_HOST_WS = isDev ? BACKEND_URLS.development.ws : BACKEND_URLS.production.ws;

// Legacy exports for backward compatibility (if needed)
export const BACKEND_HOST_LOCAL = BACKEND_URLS.development.http;
export const BACKEND_HOST_PROD = BACKEND_URLS.production.http;
export const BACKEND_HOST_LOCAL_WS = BACKEND_URLS.development.ws;
export const BACKEND_HOST_PROD_WS = BACKEND_URLS.production.ws;

export const SYSTEM_LOGO =
  'https://img0.baidu.com/it/u=1455188211,4132484470&fm=253&app=138&size=w931&n=0&f=JPEG&fmt=auto?sec=1708448400&t=b8e8e5f8dc7e7ece5e4db2f1b0a12813';

export const ENV = import.meta.env.MODE; // 'development' | 'production' | 'test'