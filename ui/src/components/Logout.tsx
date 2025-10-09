import React from 'react'

import { useDispatch } from 'react-redux'
import { logout } from '../store/authSlice'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { Button } from '@chakra-ui/react'

const Logout = () => {
  const dispatch = useDispatch()

  const navigate = useNavigate()
  
  const handleLogout = () => {
    dispatch(logout())
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('auth')
    navigate('/', { replace: true })
  }

  useEffect(() => {
    // perform logout immediately when this route is visited
    handleLogout()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div>

      <h1>Logout Confirm</h1>
      <Button onClick={handleLogout}>Logout</Button>
      
    </div>
  )
}

export default Logout
