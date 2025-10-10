import axios from "axios"
import type { UserLoginParams, UserRegisterParams, UserRegisterResponse } from "./types"
import { BACKEND_HOST } from "./UrlConfig"

export const saveAuthInfo = (authInfo: { accessToken: string; refreshToken: string }) => {
  const authData = {
    accessToken: authInfo.accessToken,
    refreshToken: authInfo.refreshToken,
  };
  localStorage.setItem('auth', JSON.stringify(authData));
};

export const exchangeCodeForTokens = async () => {
  // This request sends the authorization code to the backend.
  // The backend will exchange it for access and refresh tokens.
  const response = await axios.get(`${BACKEND_HOST}/api/auth/token`,  { withCredentials: true });
  const { accessToken, refreshToken } = response.data;

  if (!accessToken || !refreshToken) {
    throw new Error('Could not retrieve tokens from server after exchanging code.');
  }

  saveAuthInfo({ accessToken, refreshToken });
  return response.data;
};


export const userRegister = async  (params: UserRegisterParams) : Promise<UserRegisterResponse> => {
 

    try {

    
/* 
        fetch API 中的 Response 对象有一个 ok 属性，用于快速判断请求是否成功。以下是详细说明：

    1. fetch 的 ok 属性
    作用： res.ok 是一个布尔值，表示 HTTP 请求是否成功（状态码在 200-299 范围内）。 */
    const res = await fetch(`${BACKEND_HOST}/api/user/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
       //   credentials: 'include', // ensure browser saves cookie from Set-Cookie
        body: JSON.stringify(params),
        }) 
/* 
            const httpStatus = res.status
    let data: any = {}
           // Only try to parse body when not 204
            if (httpStatus !== 204) {
            try {
                data = await res.json()
            } catch {
                data = {}
            }
            } */

            console.log('Raw fetch response:', res);
            console.log('Response status:', res.status);
            console.log('Response ok:', `${BACKEND_HOST}/api/auth/register`);

    
        let data: any = {}

        if (!res.ok) {
             data = await res.json().catch(() => ({}))
            return {
                httpStatus: res.status || 500,
                ok: false,
                tokenName: data.tokenName ?? '',
                tokenValue: data.tokenValue ?? '',
                message: data.message ?? '注册失败，请重试',
            }
        }
        
         data = await res.json().catch(() => ({}))
        return {
                httpStatus: data.httpStatus ?? 200,
                ok: true,
                tokenName: data.tokenName ?? '',
                tokenValue: data.tokenValue ?? '',
                message: data.message ?? '',
        };
    } catch (err: unknown) {
        return {
            httpStatus: 500,
            ok: false,
            tokenName: '',
            tokenValue: '',
            message: err instanceof Error ? err.message : 'An unexpected error occurred',
        }
    }
}


   /* axios.post(url, data, config)
         axios 在发送 POST 请求时，会自动对请求体（ data 参数）进行 JSON.stringify 处理。
         This implementation normalizes the response to UserRegisterResponse and
         computes `ok` from response.data.ok if present, otherwise falls back to HTTP 2xx.
   

 export const userRegister2 = async  (params: UserRegisterParams) : Promise<UserRegisterResponse> => {

    try {
        const response = await axios.post<UserRegisterResponse>(
            '/api/user/register',
            params,
            {
                headers: { 'Content-Type': 'application/json' },
            },
        )

        const data: any = response.data
    

        return {
            httpStatus: response.status,
            ok:  (response.status >= 200 && response.status < 300),
            tokenName: data?.tokenName,
            tokenValue: data?.tokenValue,
            message: data?.message,
        }
    } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
            const httpStatus = err.response?.status ?? 500
            const data: any = err.response?.data
            return {
                httpStatus,
                ok: false,
                message: (data && data.message) ? data.message : '注册失败，请重试',
            }
        }
        return {
            httpStatus: 500,
            ok: false,
            tokenName: '',
            tokenValue: '',
            message: err instanceof Error ? err.message : 'An unexpected error occurred',
        }
    }
 } 
 
 */

interface GetLogInUser {
    userName: string
    email: string
    userAccount: string
}

export const userGetPeofile = async(): Promise<GetLogInUser> => {
    try {
        const accessToken = localStorage.getItem('accessToken') || ''
        const headers: Record<string, string> = { 'Content-Type': 'application/json' }
        if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`
        console.log('Using Access Token:', accessToken);
        const response = await axios.get(
           `${BACKEND_HOST}/api/user/get/login`,
            { headers, withCredentials: true }
        )
        console.log('Raw axios response:', response);
        console.log('Response status:', response.status);
        console.log('Response data:', `${BACKEND_HOST}/api/user/get/login`);
        if (!response) {
            return {
                userName: '',
                email: '',
                userAccount: '',
            }
        }
        const data: any = response.data
        return {
            userName: data?.userName || '',
            email: data?.email || '',
            userAccount: data?.userAccount || '',
        }
    } catch (err: unknown) {
        return {
            userName: '',
            email: '',
            userAccount: '',
        }
    }
}

/* 
export async function fetchProfile() {
  try {
    const res = await axios.get('/api/user/profile', {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('accessToken')
      }
    });
    return res.data;
  } catch (err) {
    // accessToken 过期，尝试刷新
    if (err.response && err.response.status === 401) {
      const refreshRes = await axios.post('/api/auth/refresh', {
        refreshToken: localStorage.getItem('refreshToken')
      });
      localStorage.setItem('accessToken', refreshRes.data.accessToken);
      // 用新 accessToken 重试
      const res = await axios.get('/api/user/profile', {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('accessToken')
        }
      });
      return res.data;
    }
    throw err;
  }
} */

  interface UserLoginResponse {
    accessToken?: string
    refreshToken?: string
    userRole?: string
    message?: string
  }

  export const userLogin = async(params: UserLoginParams) : Promise<UserLoginResponse> => {
    try {
         const localjwt = localStorage.getItem('accessToken') || ''
            const headers: Record<string, string> = { 'Content-Type': 'application/json' }
            if (localjwt) headers['Authorization'] = `Bearer ${localjwt}`
       
            const res = await axios.post<UserLoginResponse>(
           `${BACKEND_HOST}/api/user/login`,
            params,
            {
                headers,
                withCredentials: true, // ensure browser saves cookie from Set-Cookie
            },
        )
        const data = res.data
        console.log('Login response data:', data);
   
/*        
        with the interceptors in setupAxiosAuth.ts, this line is optional but ensures immediate header update
(axios.defaults.headers.common as any)['Authorization'] = `Bearer ${data?.accessToken || ''}`
 */        return {
            accessToken: data?.accessToken,
            refreshToken: data?.refreshToken,
            userRole: data?.userRole,
            message: data?.message,
        }
    } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
            const data: any = err.response?.data
            return {
                accessToken: undefined,
                refreshToken: undefined,
                userRole: undefined,
                message: (data && data.message) ? data.message : '登录失败，请重试',
            }
        }
        return {
            accessToken: undefined,
            refreshToken: undefined,
            userRole: undefined,
            message: err instanceof Error ? err.message : 'An unexpected error occurred',
        }
    }
}

