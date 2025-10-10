import React, { useEffect } from 'react'
import { Box, Flex, Button, Heading, Text, Container, Stack, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react'
import { Link, useNavigate } from 'react-router-dom'
import Footer from '../components/Footer'
import { useSelector, useDispatch } from 'react-redux'

const HomePage: React.FC = () => {


  const navigate = useNavigate();

  // Use useSelector at the top level
  const isLoggedIn = useSelector((state: any) => state.auth?.isLoggedIn);
  //const userRole = useSelector((state: any) => state.auth?.user?.userRole);

  const userRole = localStorage.getItem('userRole') || 'user'; // default to 'guest' if not found
  
  console.log('isLoggedIn:', isLoggedIn);
  console.log('userRole:', userRole);



 

  return (
    <Flex minH="100vh" direction="column">
      {/* Navbar */}
      <Box as="nav" bg="gray.50" px={6} py={3} boxShadow="sm">
        <Container maxW="7xl" display="flex" alignItems="center" justifyContent="space-between">
          <Heading as="h1" size="md">Chatroom</Heading>
            <Stack direction="row" spacing={16} align="center">
              <Link to="/chatnav">
              <Button colorScheme="teal" variant="solid" size="sm">Chat</Button>
            </Link>
              {isLoggedIn && userRole === 'ADMIN' && (
              <Link to="/manager">
                <Button colorScheme="blue" variant="solid" size="sm">Manager</Button>
              </Link>
            )}
         
            {isLoggedIn ? (
             
              <Menu>
          
                <MenuButton as={Button} variant="ghost">user</MenuButton>
                <MenuList>
                  <MenuItem as={Link} to="/profile">Profile</MenuItem>
                  <MenuItem  onClick={() => navigate('/logout')}>Logout</MenuItem>
                </MenuList>
              </Menu>
            ) : (
              <Link to="/login" >
                <Button colorScheme="orange" variant="outline" size="sm">登录</Button>
              </Link>
            )}
    
              
          </Stack>
        </Container>
      </Box>

      {/* Intro / Hero */}
      <Box as="main" flex="1" py={20} bg="white">
        <Container maxW="4xl" textAlign="center">
          <Heading as="h2" size="xl" mb={4}>Welcome to Chatroom</Heading>
          <Text fontSize="lg" color="gray.600" mb={6}>
            This project is a lightweight chat application built with React, TypeScript and Vite. It demonstrates authentication, a service-worker friendly PWA setup, and a small example UI using Chakra.
          </Text>
          <Stack direction={["column","row"]} spacing={4} justifyContent="center">
               <Link to="/chatnav">
              <Button colorScheme="teal">Get started</Button>
            </Link>
            <Link to="/about">
              <Button variant="ghost">Learn more</Button>
            </Link>
          </Stack>
        </Container>
      </Box>

      {/* Footer */}
      <Footer />
    </Flex>
  )
}

export default HomePage
