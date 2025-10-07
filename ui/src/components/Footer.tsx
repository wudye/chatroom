import React from 'react';
import { Box, HStack, Link as ChakraLink, Text, Icon } from '@chakra-ui/react';
import { FaGithub } from 'react-icons/fa';

const Footer: React.FC = () => {
  const defaultMessage = '聪ζ';
  const currentYear = new Date().getFullYear();
  return (
    <Box as="footer" className="w-full py-4 bg-transparent" px={4}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <HStack spacing={4}>
          <ChakraLink href="https://github.com/lhccon" isExternal className="text-sm text-gray-500">
            {defaultMessage}
          </ChakraLink>
          <ChakraLink href="https://github.com/lhccong/short-link-dog-backend" isExternal className="text-sm text-gray-500 flex items-center gap-2">
            <Icon as={FaGithub} boxSize="1em" />
            <span>wanwu产物-微狗源码</span>
          </ChakraLink>
        </HStack>
        <Text className="text-sm text-gray-500">{currentYear} {defaultMessage}</Text>
      </div>
    </Box>
  );
};

export default Footer;
