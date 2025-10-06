import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function AuthListener() {
  const navigate = useNavigate()

  useEffect(() => {
    const handler = (e: Event) => {
      try {
        // event detail now contains an app-relative path in `redirectPath` (pathname+search)
        // @ts-ignore
        //       // 从事件中获取重定向路径，若不存在则使用当前路径

        const rp = e?.detail?.redirectPath || window.location.pathname
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
