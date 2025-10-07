/*
 three ways to check if login or not
 1: Using Redux state (isLoggedIn) - Implemented in ProtectedRouter component.
 2: Using localStorage token check - Implemented in DemoRequireLoginChild component.
 3: Using RequireAuth component - Implemented in RequireAuth.tsx component with useEffect
*/

// ...existing code...
import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
} from 'react-router-dom'
import HomePage from './pages/HomePage'
import ChatNavPage from './pages/ChatNavPage'
import UserPage from './pages/UserPage'
import RegisterPage from './pages/RegisterPage'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import LogoutPage from './components/Logout'
/* import RootLayout from './auth/RootLayout' */

// App.tsx
//import Settings from './config/globalConfig';

//import DemoRequireLoginChild from './auth/demoRequireLoginChild';
import ProtectedRouter from './auth/ProtectedRouter'
import RootLayout from './auth/RootLayout'
import LoginSuccess from './auth/LoginSuccess'

/* export interface AppProps {
  settings: typeof Settings;
}
 */



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
    element: (
    <>
          <RootLayout />
    </>
   ),
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/user', element: <UserPage /> },
      { path: '/register', element: <RegisterPage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/login/success', element: <LoginSuccess /> },
/* 
      // Protected routes use DemoRequireLoginChild as an element that wraps an Outlet
      {
        element: <DemoRequireLoginChild><Outlet /></DemoRequireLoginChild>,
        children: [
          { path: '/profile', element: <ProfilePage /> },
          { path: '/chatnav', element: <ChatNavPage /> },
        ],
      }, */
      {
        element: <ProtectedRouter></ProtectedRouter>,
        children: [
          { path: '/profile', element: <ProfilePage /> },
          { path: '/chatnav', element: <ChatNavPage /> },

          { path: '/logout', element: <LogoutPage /> },
        ],
      },
    ],
  },
])
  // _settings signals unused; note: this only silences ESLint if configured to ignore leading underscores.
//function App(_: AppProps) {
/* 
function App({ settings:_settings }: AppProps) {
  return (
      <RouterProvider router={router} />
  )
} */

function App() {
  return (
      <RouterProvider router={router} />
  )
}
export default App
