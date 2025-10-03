import React from 'react'
import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
} from 'react-router-dom'
import HomePage from './pages/HomePage'
import UserPage from './pages/UserPage'


const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Outlet />
    ),
    children: [
      {path: "/", element: <HomePage />},
      {path: "/navigate", element: <HomePage />},
      {path: "/user", element: <UserPage />},
    ],
  },
])

function App() {

  return (
    <RouterProvider router={router} />
  )
}

export default App
