// ...existing code...
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom'
import HomePage from './pages/HomePage'
import UserPage from './pages/UserPage'
import RegisterPage from './pages/RegisterPage'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import RequireAuth from './components/RequireAuth'
import RootLayout from './components/RootLayout'



/* 组件	职责	触发时机
AuthListener	监听全局登出事件 ( auth:logout )，跳转到登录页并携带重定向路径。	用户主动登出或会话过期时触发。
RequireAuth	保护路由，检查用户是否有权限访问页面，若无权限则跳转到登录页。	用户尝试访问受保护路由时触发。
AuthProvider	提供用户身份验证状态和登录/登出方法。	用户登录或登出时触发。
AuthContext	提供用户身份验证状态和登录/登出方法。	用户登录或登出时触发。
setupAxiosAuth	设置 Axios 拦截器，在请求中附加用户身份验证信息。	用户登录或登出时触发。
，如果你想用 RequireAuth 保护所有路由，最佳实践是将它放在 RootLayout 组件中。这样，所有通过 RootLayout 渲染的子路由都会自动受到 RequireAuth 的保护。 */
const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {path: "/", element: <HomePage />},
      {path: "/navigate", element: <HomePage />},
      {path: "/user", element: <UserPage />},
      {path: "/register", element: <RegisterPage />},
      {path: "/login", element: <LoginPage />},
      {path: "/profile", element: <RequireAuth><ProfilePage /></RequireAuth>},
    ],
  },
])

function App() {
  return (
    <RouterProvider router={router} />
  )
}

export default App
