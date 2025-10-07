import axios from 'axios'

export type SetupOptions = {
  publicPaths?: string[]
  loginPath?: string
}
/* 
功能说明
getAuthToken 
从 localStorage 中获取存储的 Token。
请求拦截器：
在每次请求前自动添加 Authorization 头。
响应拦截器：
拦截 401 错误，跳转到登录页。
使用示例
在其他文件中导入并使用配置好的 Axios 实例： 
*/

/**
 * Install axios request/response interceptors to attach Authorization header
 * and redirect to /login when there is no token. Returns a cleanup function
 * that ejects the interceptors.
 */
export function setupAxiosAuth(options?: SetupOptions) {
  const publicPaths = options?.publicPaths ?? [
    '/api/user/login',
    '/api/user/register',
    '/oauth2/authorization',
  ]
  const loginPath = options?.loginPath ?? '/login'

  const reqInterceptor = axios.interceptors.request.use((config) => {
    try {
      const url = (config.url || '') as string

      // If the request is targeting a public path, skip auth check
      if (publicPaths.some((p) => url.includes(p))) return config

      // Read canonical auth object first, fall back to tokenValue
      let token = ''
      const authRaw = localStorage.getItem('auth')
      if (authRaw) {
        try {
          const parsed = JSON.parse(authRaw)
          token = parsed?.accessToken || ''
        } catch {
          token = ''
        }
      }
      if (!token) {
        token = localStorage.getItem('accessToken') || ''
      }

      if (!token) {
        // Not authenticated — if the user is already on the login page, do not emit another redirect event.
        const currentPath = window.location.pathname || ''
        const redirectPath = currentPath + window.location.search
        if (currentPath === loginPath) {
          return Promise.reject(new Error('Not authenticated'))
        }
        window.dispatchEvent(new CustomEvent('auth:logout', { detail: { redirectPath } }))
        return Promise.reject(new Error('Not authenticated'))
      }

      config.headers = config.headers || {}
      ;(config.headers as any)['Authorization'] = `Bearer ${token}`
      return config
    } catch (err) {
      return Promise.reject(err)
    }
  })

  const respInterceptor = axios.interceptors.response.use(
    (res) => res,
    (error) => {
      const status = error?.response?.status
      if (status === 401 || status === 403) {
        // Clear local auth and notify app to navigate to login (SPA style)
        localStorage.removeItem('auth')
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        const currentPath = window.location.pathname || ''
        const redirectPath = currentPath + window.location.search
        if (currentPath !== loginPath) {
          window.dispatchEvent(new CustomEvent('auth:logout', { detail: { redirectPath } }))
        }
      }
      return Promise.reject(error)
    },
  )

  return () => {
    axios.interceptors.request.eject(reqInterceptor)
    axios.interceptors.response.eject(respInterceptor)
  }
}

export default setupAxiosAuth
