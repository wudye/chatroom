import axios from "axios"
import type { UserRegisterParams, UserRegisterResponse } from "./types"



export const userRegister = async  (params: UserRegisterParams) : Promise<UserRegisterResponse> => {
 

    try {

    
/* 
        fetch API 中的 Response 对象有一个 ok 属性，用于快速判断请求是否成功。以下是详细说明：

    1. fetch 的 ok 属性
    作用： res.ok 是一个布尔值，表示 HTTP 请求是否成功（状态码在 200-299 范围内）。 */
    const res = await fetch('/api/user/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
          credentials: 'include', // ensure browser saves cookie from Set-Cookie
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

export const userGetLogin = async(): Promise<GetLogInUser> => {
    try {
        const response = await fetch(
            '/api/user/get/login',
            {
                method: 'GET',
                credentials: 'include', // this will send cookies
                headers: { 'Content-Type': 'application/json' },
            },
        )
        if (!response.ok) {
            const data = await response.json().catch(() => ({}))
            return {
                userName: data?.userName ?? '',
                email: data?.email ?? '',
                userAccount: data?.userAccount ?? '',
            }
        }
        const data = await response.json().catch(() => ({}))
        return {
            userName: data?.userName ?? '',
            email: data?.email ?? '',
            userAccount: data?.userAccount ?? '',
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

  interface UserLoginParams {
    userAccount: string
    userPassword: string
  }
  interface UserLoginResponse {
    accessToken?: string
    refreshToken?: string
    message?: string
  }

  export const userLogin = async(params: UserLoginParams) : Promise<UserLoginResponse> => {
    try {
         const localjwt = localStorage.getItem('accessToken') || ''
            const headers: Record<string, string> = { 'Content-Type': 'application/json' }
            if (localjwt) headers['Authorization'] = `Bearer ${localjwt}`
       
            const res = await axios.post<UserLoginResponse>(
            '/api/user/login/my',
            params,
            {
                headers,
                withCredentials: true, // ensure browser saves cookie from Set-Cookie
            },
        )
        const data = res.data
        localStorage.setItem('accessToken', data?.accessToken || '')
        localStorage.setItem('refreshToken', data?.refreshToken || '')
        // Prefer Authorization
        localStorage.setItem('auth', JSON.stringify({ accessToken: data?.accessToken || '' }));
/*        
        with the interceptors in setupAxiosAuth.ts, this line is optional but ensures immediate header update
(axios.defaults.headers.common as any)['Authorization'] = `Bearer ${data?.accessToken || ''}`
 */        return {
            accessToken: data?.accessToken,
            refreshToken: data?.refreshToken,
            message: data?.message,
        }
    } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
            const httpStatus = err.response?.status ?? 500
            const data: any = err.response?.data
            return {
                accessToken: undefined,
                refreshToken: undefined,
                message: (data && data.message) ? data.message : '登录失败，请重试',
            }
        }
        return {
            accessToken: undefined,
            refreshToken: undefined,
            message: err instanceof Error ? err.message : 'An unexpected error occurred',
        }
    }
}

