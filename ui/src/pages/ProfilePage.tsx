import React, { useState, useEffect } from 'react'
import {
  Container,
  Box,
  Heading,
  Text,
  Avatar,
  Stack,
  Spinner,
  Stat,
  StatLabel,
  StatNumber,
  SimpleGrid,
  Button,
} from '@chakra-ui/react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

type UserProfile = {
  id: number
  userAccount: string
  email: string
  userPassword?: string
  level?: number
  userName?: string
  userAvatar?: string
  userProfile?: string
  friendNum?: number
  groupNum?: number
  userRole?: string
  createTime?: string
  updateTime?: string
  isDelete?: number
}

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Auto-load profile on mount. Authorization is attached by setupAxiosAuth interceptors.
  const fetchProfile = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await axios.get('/api/user/test/profile', { withCredentials: true })
      setUser(res.data || null)
    } catch (err: any) {
      setError(err?.response?.data?.message ?? err.message ?? 'Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let mounted = true
    const run = async () => {
      await fetchProfile()
    }
    if (mounted) run()
    return () => { mounted = false }
  }, [])
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('tokenName')
    localStorage.removeItem('tokenValue')
    localStorage.removeItem('auth')
    navigate('/login', { replace: true })
  }

  return (
    <Container py={12}>
      <Box bg="white" p={8} rounded="lg" boxShadow="lg">
        {!user && (
          <Box textAlign="center">
            <Heading size="md" mb={4}>No profile loaded</Heading>
            {error && <Text color="red.500" mb={2}>{error}</Text>}
            <Button colorScheme="blue" onClick={fetchProfile} isLoading={loading}>
              Load profile
            </Button>
          </Box>
        )}

        {user && (
          <>
            <Stack direction={{ base: 'column', md: 'row' }} spacing={6} align="center">
              <Avatar size="xl" src={user.userAvatar || undefined} name={user.userName || user.userAccount} />
              <Box>
                <Heading size="lg">{user.userName ?? user.userAccount}</Heading>
                <Text color="gray.500">{user.userRole}</Text>
              </Box>
              <Box ml="auto">
                <Button size="sm" mr={2} onClick={fetchProfile} isLoading={loading}>Refresh</Button>
                <Button size="sm" colorScheme="red" onClick={handleLogout}>Logout</Button>
              </Box>
            </Stack>

            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mt={6}>
              <Stat>
                <StatLabel>Friends</StatLabel>
                <StatNumber>{user.friendNum ?? 0}</StatNumber>
              </Stat>
              <Stat>
                <StatLabel>Groups</StatLabel>
                <StatNumber>{user.groupNum ?? 0}</StatNumber>
              </Stat>
              <Stat>
                <StatLabel>Level</StatLabel>
                <StatNumber>{user.level ?? 1}</StatNumber>
              </Stat>
            </SimpleGrid>

            <Box mt={6}>
              <Heading size="sm">Profile</Heading>
              <Text mt={2}>{user.userProfile ?? 'No profile'}</Text>

              <Heading size="sm" mt={4}>Contact</Heading>
              <Text mt={2}>{user.email}</Text>

              <Heading size="sm" mt={4}>Account</Heading>
              <Text mt={2}>{user.userAccount}</Text>

              <Heading size="sm" mt={4}>Timestamps</Heading>
              <Text mt={2}>Created: {user.createTime}</Text>
              <Text>Updated: {user.updateTime}</Text>
            </Box>
          </>
        )}
      </Box>
    </Container>
  )
}

export default ProfilePage
