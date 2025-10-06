import React, { useState } from "react"
import {userRegister} from "../api/UserController"

import { Container
  , Box
  , Stack
  , Avatar
  , Heading
  , Text
  , FormControl
  , FormLabel
  , Input
  , Button
 } from "@chakra-ui/react"
import { useNavigate } from "react-router-dom"


/* React.FC 是 React 中的一个类型别名，用于定义函数组件的类型。
它是 React.FunctionComponent 的简写形式，主要用于 TypeScript 项目中，为函数组件提供类型支持
主要特点：
类型定义：

React.FC 是一个泛型类型，可以接收一个泛型参数，用于定义组件的 props 类型。
例如： const MyComponent: React.FC<MyProps> = (props) => {...} 。
默认包含 children ：

React.FC 会自动为组件的 props 添加一个可选的 children 属性，即使你没有显式定义它。
返回值：

使用 React.FC 定义的组件必须返回一个 React.ReactNode 或 null 。
静态属性：

React.FC 还支持为组件添加静态属性，例如 defaultProps 和 propTypes
在 React 中，如果你定义的是一个全局函数（即不依赖于组件状态或生命周期，纯粹是一个工具函数），通常不需要使用 React.FC 类型。 React.FC 主要用于定义函数组件，而不是普通的工具函数。
*/

const RegisterPage: React.FC = () => {


    const [userAccount, setUserAccount] = useState('')
  const [userName, setUserName] = useState('')
  const [email, setEmail] = useState('')
  const [userPassword, setUserPassword] = useState('')
  const [checkPassword, setCheckPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const navigate = useNavigate()

/*   React.FormEvent 是 React 中的一个事件类型，专门用于处理表单相关的事件。它是 React.SyntheticEvent 的子类型，封装了浏览器原生表单事件的细节，提供了跨浏览器兼容性。

主要特点：
用途：

用于处理表单元素（如 <input> , <select> , <textarea> 等）的事件，例如 onSubmit 、 onChange 、 onBlur 等。
类型定义：

在 TypeScript 中， React.FormEvent 是一个泛型类型，可以指定目标元素的类型。例如： */

function getCookie(name: string): string | null {
  const matches = document.cookie.match(new RegExp('(^|; )' + name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1') + '=([^;]*)'))
  return matches ? decodeURIComponent(matches[2]) : null
}



  const valiate =() => {
        if (!userName || userName.trim().length < 3) {
        return 'Username must be at least 3 characters'
      }
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return 'Please enter a valid email address'
      }
      if (!userAccount || userAccount.trim().length < 3) {
        return 'Account must be at least 3 characters'
      }
      if (!userPassword || userPassword.length < 6) {
        return 'Password must be at least 6 characters'
      }
      if (userPassword !== checkPassword) {
        return 'Passwords do not match'
      }
      return null
  }
  const onSubmit = async(e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    const validationError = valiate()
    if (validationError) {
      setError(validationError)
      return
    }

  

  
    setLoading(true)
    try {
      const res =  await userRegister({
        userName,
        email, 
        userAccount,
        userPassword,
        checkPassword
      })
      console.log('Registration response:', res)
      if (res.ok) {

        // Example
      console.log('document.cookie:', document.cookie)
      console.log('session cookie:', getCookie('SESSION') || getCookie('session') || getCookie('cookie') || getCookie('auth'))

        setSuccess(res && 'Registration successful! You can now log in.')
 /*        console.log('Token Name:', res.tokenName);
        console.log('Token Value:', res.tokenValue); */
        localStorage.setItem('tokenName', res.tokenName ?? 'token');
        localStorage.setItem('tokenValue', res.tokenValue ?? '');
        navigate('/login', { replace: true })

        setUserName('')
        setEmail('')
        setUserAccount('')
        setUserPassword('')
        setCheckPassword('')
      } else {
        setError(res.message || 'Registration failed. Please try again.')
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  
  }
  const formError = error 

 

  return (
    <Container maxW="500px" py={12} px={4}>

      <Box bg="white" p={8} rounded="lg" boxShadow="lg" my={12}>
        <Stack direction="row" spacing={4} align="center" mb={6}>
          <Avatar bg="blue.500">🔒</Avatar>
          <Box>
            <Heading as="h1" size="md" mb={2}>
              Create your account
            </Heading>
            <Text color="gray.500">Join the chatroom — fast, secure, and friendly.</Text>
          </Box>
        </Stack>

         <form onSubmit={onSubmit} noValidate>
            <Stack spacing={4}>
              <FormControl id="userName" isRequired>
                <FormLabel>Username</FormLabel>
                <Input
                  value={userName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUserName(e.target.value)}
                  placeholder="Display name — at least 3 characters"
                  autoComplete="name"
                />
              </FormControl>

              <FormControl id="email" isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  placeholder="you@domain.com"
                  autoComplete="email"
                />
              </FormControl>

              <FormControl id="userAccount" isRequired>
                <FormLabel>Account</FormLabel>
                <Input
                  value={userAccount}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUserAccount(e.target.value)}
                  placeholder="Account — must be at least 3 characters"
                  autoComplete="username"
                />
              </FormControl>

              <FormControl id="userPassword" isRequired>
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  value={userPassword}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUserPassword(e.target.value)}
                  placeholder="Password — at least 6 characters"
                  autoComplete="new-password"
                />
              </FormControl>

              <FormControl id="checkPassword" isRequired>
                <FormLabel>Confirm Password</FormLabel>
                <Input
                  type="password"
                  value={checkPassword}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCheckPassword(e.target.value)}
                  placeholder="Confirm Password — must match Password"
                  autoComplete="new-password"
                />
              </FormControl>
            </Stack>

          {formError && <Text color="red.500" mt={4}>{formError}</Text>}
          {success && <Text color="green.500" mt={4}>{success}</Text>          }

          <Box display="flex" mt={6}>
            <Button
              type="submit"
              colorScheme="blue"
              isLoading={loading}
              loadingText="Registering"
              flex={1}
            >
              Register
            </Button>
          </Box>
        </form>
        


      </Box>
    </Container>
  )
}

export default RegisterPage