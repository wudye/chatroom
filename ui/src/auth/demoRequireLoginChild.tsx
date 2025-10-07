
import type { FC, ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

type Props = {
  children: ReactNode
}


const getTokenValue = (): string => {
  const authRaw = localStorage.getItem('auth')
  if (authRaw) {
    try {
      const parsed = JSON.parse(authRaw)
      if (parsed && parsed.accessToken) return parsed.accessToken
    } catch {
      // ignore parse errors
    }
  }
  return localStorage.getItem('accessToken') || ''
}

const DemoRequireLoginChild: FC<Props> = ({ children }) => {
  const token = getTokenValue()
  const location = useLocation()

  if (!token) {
    const redirectPath = `${location.pathname}${location.search || ''}`
    return <Navigate to={`/login?redirect=${encodeURIComponent(redirectPath)}`} replace />
  }
  return <>{children}</>
}

export default DemoRequireLoginChild