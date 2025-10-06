import axios from 'axios'

export type SetupOptions = {
  publicPaths?: string[]
}

/**
 * Install axios request/response interceptors to attach Authorization header
 * and redirect to /login when there is no token. Returns a cleanup function
 * that ejects the interceptors.
 */
export function setupAxiosAuth(options?: SetupOptions) {
  const publicPaths = options?.publicPaths ?? [
    '/api/user/login',
    '/api/user/register',
    '/api/user/get/login',
    '/api/oauth2/authorization',
  ]

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
        // Not authenticated — emit an event carrying only the app-relative path (pathname + search).
        const redirectPath = window.location.pathname + window.location.search
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
  const redirectPath = window.location.pathname + window.location.search
  window.dispatchEvent(new CustomEvent('auth:logout', { detail: { redirectPath } }))
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
