import React, { useEffect, useState } from 'react'
import {
  Container,
  Box,
  Stack,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  HStack,
  Text,
  useToast,
  Avatar,
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux'
import  {login, setUserRole} from '../store/authSlice'
import { userLogin, exchangeCodeForTokens } from '../api/UserController'

import { BACKEND_HOST_LOCAL } from '../api/UrlConfig'
/**
 * Login page
 * - Handles standard credential login.
 * - Handles OAuth2 login flow by redirecting to the backend.
 * - After successful OAuth, the backend redirects back here with an authorization `code`.
 *   This component then sends the `code` back to the backend to exchange it for tokens.
 *
 * Notes / assumptions:
 * - Backend OAuth2 entry point: /api/oauth2/authorization/{provider}
 * - OAuth provider redirects to: /login?code=...
 * - Backend token exchange endpoint: /api/auth/token (accepts POST with { code })
 */

const LoginPage: React.FC = () => {
  const [userAccount, setUserAccount] = useState('')
  const [userPassword, setUserPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [lastResponseRaw, setLastResponseRaw] = useState<string | null>(null)
  const toast = useToast()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const location = useLocation();

  const oauthProviders: { id: string; label: string }[] = [
    { id: 'github', label: 'GitHub' },
    { id: 'google', label: 'Google' },
    { id: 'x', label: 'X' },
  ]


      // 检查 accessToken 并重定向
  useEffect(() => {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
            const from = location.state?.from?.pathname || '/';
            navigate(from, { replace: true });
        }
    }, [navigate, location.state]);
  // This function's only job is to redirect the user to the backend OAuth endpoint.
  const handleOAuthLogin = (providerId: string) => {
   const url = `${BACKEND_HOST_LOCAL}/oauth2/authorization/${providerId}`;

  //  const url = `/api/oauth2/authorization/${providerId}`;
    window.location.href = url;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userAccount || !userPassword) {
      toast({ title: 'Please enter account and password', status: 'warning', duration: 3000 })
      return
    }
    setLoading(true)
    try {
   
      const data =  await userLogin({ userAccount, userPassword })
      if (!data || !data.accessToken) {
              toast({ title: 'Login failed', status: 'error', duration: 3000 })

              
          
      } else {
         localStorage.setItem('accessToken', data?.accessToken || '')
        localStorage.setItem('refreshToken', data?.refreshToken || '')
        // Prefer Authorization
        localStorage.setItem('auth', JSON.stringify({ accessToken: data?.accessToken || '' }));
        dispatch(setUserRole(data?.userRole || 'user'));
        localStorage.setItem('userRole', data?.userRole || 'user');

      dispatch(login());
        toast({ title: 'Login successful', status: 'success', duration: 2000 })
        // clear any previous debug response
        setLastResponseRaw(null)
//        const from = location.state?.from?.pathname || '/chatnav';
        navigate("/", { replace: true });
      }
    } catch (err: any) {

      setLastResponseRaw(err?.response?.data ?? null)
      toast({ title: err?.message ?? 'Network error', status: 'error', duration: 4000 })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container className="mx-auto max-w-md px-4" py={12}>
      <Box bg="white" p={8} rounded="lg" boxShadow="lg">
        <Stack spacing={6} align="center" mb={4}>
          <Avatar bg="blue.500">🙂</Avatar>
          <Heading as="h1" size="lg">
            Sign in to Chatroom
          </Heading>
          <Text color="gray.500">Use your account or continue with a social provider</Text>
        </Stack>

        <form onSubmit={onSubmit} noValidate>
          <Stack spacing={4}>
            <FormControl id="userAccount" isRequired>
              <FormLabel>Account</FormLabel>
              <Input
                value={userAccount}
                onChange={(e) => setUserAccount(e.target.value)}
                placeholder="Username or email"
                autoComplete="username"
                className="bg-gray-50"
              />
            </FormControl>

            <FormControl id="userPassword" isRequired>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                value={userPassword}
                onChange={(e) => setUserPassword(e.target.value)}
                placeholder="Your password"
                autoComplete="current-password"
                className="bg-gray-50"
              />
            </FormControl>

            <Button type="button" variant="outline" colorScheme="green" onClick={() => navigate('/register')}>
              No account? Register
            </Button>

            <Button type="submit" colorScheme="blue" isLoading={loading} loadingText="Signing in">
              Sign in
            </Button>

            <Text textAlign="center" color="gray.500">Or continue with</Text>

            <HStack spacing={3} justifyContent="center">
              {oauthProviders.map((p) => (
                <Button
                  key={p.id}
                  variant="outline"
                  onClick={() => handleOAuthLogin(p.id)}
                  className="text-sm"
                >
                  {p.label}
                </Button>
              ))}
            </HStack>
          </Stack>
        </form>
        {lastResponseRaw && (
          <Box mt={4} p={3} bg="gray.50" rounded="md">
            <Text fontSize="sm" color="red.600">Server response (debug):</Text>
            <pre style={{ whiteSpace: 'pre-wrap' }}>{lastResponseRaw}</pre>
          </Box>
        )}
      </Box>
    </Container>
  )
}

export default LoginPage
