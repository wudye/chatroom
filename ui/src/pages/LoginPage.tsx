import React, { useState } from 'react'
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



import { userLogin } from '../api/UserController'

/**
 * Login page
 * - Two inputs: userAccount and password
 * - Third-party OAuth buttons (GitHub, Google, X)
 * - Login button which posts to /api/user/login (credentials included)
 * - On success redirect to '/'
 *
 * Notes / assumptions:
 * - Backend login POST endpoint: /api/user/login accepts { userAccount, userPassword }
 * - Backend may return tokenName/tokenValue in JSON or set an HttpOnly cookie. We treat HTTP 2xx as success.
 * - Third-party OAuth endpoints are assumed at: /api/oauth2/authorization/{provider}
 */

const LoginPage: React.FC = () => {
  const [userAccount, setUserAccount] = useState('')
  const [userPassword, setUserPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [lastResponseRaw, setLastResponseRaw] = useState<string | null>(null)
  const toast = useToast()
  const navigate = useNavigate()

  const oauthProviders: { id: string; label: string }[] = [
    { id: 'github', label: 'GitHub' },
    { id: 'google', label: 'Google' },
    { id: 'x', label: 'X' },
  ]

  const redirectToProvider = (providerId: string) => {
    // Assumption: backend provides an OAuth endpoint under /api/oauth2/authorization/:provider
    const url = `/api/oauth2/authorization/${providerId}`
    // Use full navigation so the server can set cookies / start the OAuth flow
    window.location.href = url
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userAccount || !userPassword) {
      toast({ title: 'Please enter account and password', status: 'warning', duration: 3000 })
      return
    }
    setLoading(true)
    try {
   
      await userLogin({ userAccount, userPassword })

        toast({ title: 'Login successful', status: 'success', duration: 2000 })
        // clear any previous debug response
        setLastResponseRaw(null)
        navigate('/profile', { replace: true })
        return
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
                  onClick={() => redirectToProvider(p.id)}
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
