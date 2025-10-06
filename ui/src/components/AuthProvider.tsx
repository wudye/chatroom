import React, { useEffect } from 'react'
import setupAxiosAuth from '../lib/setupAxiosAuth'

const AuthProvider: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    const cleanup = setupAxiosAuth()
    return cleanup
  }, [])

  return <>{children}</>
}

export default AuthProvider
