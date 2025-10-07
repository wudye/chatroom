import React from 'react'
import { Box, Button, Heading, Text, Container, Stack } from '@chakra-ui/react'
import { Link } from 'react-router-dom'

const ChatNavPage: React.FC = () => {
  // This route is protected by DemoRequireLoginChild at the router level.
  // No local token check is necessary here — if the user isn't authenticated
  // they won't reach this component.
  return (
    <Box py={12}>
      <Container maxW="6xl">
        <Heading mb={4}>Chat</Heading>
        <Text color="gray.600">This is where the chat UI will be mounted. (Placeholder)</Text>
      </Container>
    </Box>
  )
}

export default ChatNavPage
