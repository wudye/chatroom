import React from 'react'
import { Navigate } from 'react-router-dom'

type Props = {
  children: React.ReactElement
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

/* encodeURIComponent 并不是来自 React，而是 JavaScript 的原生全局函数。以下是详细说明：

1. encodeURIComponent 的来源
JavaScript 原生函数： encodeURIComponent 是 JavaScript 内置的全局方法，用于对 URI 的组成部分进行编码。
作用：将特殊字符（如 ? , = , & , / , # 等）转换为 URL 安全的编码格式（如 %3F , %3D , %26 , %2F , %23 ）。
2. 为什么在这里使用？
在 RequireAuth.tsx 中， encodeURIComponent 用于编码当前页面的 URL，以便在重定向到登录页时将其作为查询参数传递：

typescript
const redirect = encodeURIComponent(window.location.href);
return <Navigate to={`/login?redirect=${redirect}`} replace />;
示例
当前 URL： http://example.com/profile
编码后： http%3A%2F%2Fexample.com%2Fprofile
最终重定向 URL： /login?redirect=http%3A%2F%2Fexample.com%2Fprofile */
const RequireAuth: React.FC<Props> = ({ children }) => {
  const token = getTokenValue()
  if (!token) {
    const redirect = encodeURIComponent(window.location.href)
/*     replace 属性：
使用 replace 替换当前历史记录，而不是添加新记录。这样用户点击浏览器返回按钮时不会回到未认证的页面。

    登录成功后，可以从 redirect 参数中解码出原始 URL，并跳转回去： */

    return <Navigate to={`/login?redirect=${redirect}`} replace />
  }
  return children
}

export default RequireAuth
