import React from 'react'
import { Outlet } from 'react-router-dom'
import AuthProvider from './AuthProvider'

const RootLayout: React.FC = () => {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  )
}

export default RootLayout
