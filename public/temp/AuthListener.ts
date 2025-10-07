import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { useLocation } from 'react-router-dom'
import RequireLogin from './RequireLogin'

export default function AuthListener(): null {
  const navigate = useNavigate()


/*    const loc = useLocation()

  useEffect(() => {
    const { needRedirect, redirectPath } = RequireLogin(loc.pathname, loc.search)
    if (needRedirect) {
      navigate(`/login?redirect=${encodeURIComponent(redirectPath)}`, { replace: true })
    }
  }, [loc.pathname, loc.search]) */

  useEffect(() => {
    const handler = (e: Event) => {
      try {
        // event detail now contains an app-relative path in `redirectPath` (pathname+search)
        // @ts-ignore
        //       // 从事件中获取重定向路径，若不存在则使用当前路径

        // event.detail may not be typed on Event, so access safely
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const detail: any = (e as any).detail
        const rp = detail?.redirectPath || window.location.pathname
        // Basic validation: only allow paths that start with '/'
        const safePath = typeof rp === 'string' && rp.startsWith('/') ? rp : '/'
        const encoded = encodeURIComponent(safePath)
        navigate(`/login?redirect=${encoded}`)
      } catch {
        navigate('/login')
      }
    }
    window.addEventListener('auth:logout', handler as EventListener)
    return () => window.removeEventListener('auth:logout', handler as EventListener)
  }, [navigate])

  return null
}
