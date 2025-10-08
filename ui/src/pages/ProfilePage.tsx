import React, { useState, useEffect } from 'react';
import { Flex, Box, Avatar, Text, Input, Button, useToast, Spinner, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { BACKEND_HOST_LOCAL } from '../api/UrlConfig';
interface UserProfile {
  id: string;
  username: string;
  account: string;
  password: string;
  avatar: string;
  joinedGroups: number;
  friendsCount: number;
  email?: string;
  createdGroups: string[];
}

const ProfilePage = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [tempProfile, setTempProfile] = useState<UserProfile | null>(null);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user profile from backend
    const fetchProfile = async () => {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        navigate('/login', { replace: true });
        return;
      }
      const response = await fetch(`${BACKEND_HOST_LOCAL}/api/user/get/login`, {
        method: 'GET',
        headers: {
          "withCredentials": "true",
          'Content-Type': 'application/json',
          
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      if (response.status === 200) {
        const data = await response.json();
        setProfile(data);
        setTempProfile(data);
      } else {
        toast({
          title: 'Error',
          description: 'Failed to fetch profile',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
      setIsLoading(false);
      /* try {
        // Mock API call
        const mockProfile: UserProfile = {
          id: '1',
          username: 'John Doe',
          account: 'johndoe',
          password: '********',
          avatar: 'https://example.com/avatar.jpg',
          joinedGroups: 5,
          friendsCount: 10,
          createdGroups: ['Group 1', 'Group 2'],
        };
        setProfile(mockProfile);
        setTempProfile(mockProfile);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to fetch profile',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      } */
    };
    fetchProfile();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Mock API call to save profile
      toast({
        title: 'Success',
        description: 'Profile updated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setProfile(tempProfile);
      setIsEditing(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTempProfile(prev => ({
      ...prev!,
      [name]: value,
    }));
  };

  if (isLoading) {
    return (
      <Flex justify="center" align="center" h="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  return (
    <Flex direction="column" h="100vh">
      {/* Navbar */}
      <Flex bg="blue.500" p={4} justify="space-between" align="center">
        <Text color="white" fontWeight="bold">ChatNav</Text>
        <Button colorScheme="red" onClick={() => navigate('/logout')} isDisabled={isEditing}>
          Logout
        </Button>
      </Flex>

      {/* Profile Content */}
      <Flex flex={1} p={4}>
        {/* User Info */}
        <Box w="30%" p={4} borderRight="1px" borderColor="gray.200">
          <Flex direction="column" align="center">
            <Avatar size="xl" src={tempProfile?.avatar} mb={4} />
            {isEditing ? (
              <Input
                name="username"
                value={tempProfile?.username || ''}
                onChange={handleChange}
                mb={2}
              />
            ) : (
              <Text fontSize="xl" fontWeight="bold">{profile?.username}</Text>
            )}
            <Text color="gray.500">{profile?.account}</Text>
            {isEditing ? (
              <Input
                name="password"
                type="password"
                value={tempProfile?.password || ''}
                onChange={handleChange}
                mb={2}
              />
            ) : (
              <Text color="gray.500">********</Text>
            )}
            <Text mt={4}>Joined Groups: {profile?.joinedGroups}</Text>
            <Text>Friends: {profile?.friendsCount}</Text>
            <Box mt={4}>
              {isEditing ? (
                <Button colorScheme="green" onClick={handleSave} isLoading={isLoading}>
                  Save
                </Button>
              ) : (
                <Button colorScheme="blue" onClick={handleEdit}>
                  Edit
                </Button>
              )}
            </Box>
          </Flex>
        </Box>

        {/* Created Groups */}
        <Box w="70%" p={4}>
          <Text fontSize="lg" fontWeight="bold" mb={4}>Created Groups</Text>
          {profile?.createdGroups.map((group, index) => (
            <Menu key={index}>
              <MenuButton as={Box} p={2} borderBottom="1px" borderColor="gray.200" onContextMenu={(e) => e.preventDefault()}>
                <Text>{group}</Text>
              </MenuButton>
              <MenuList>
                <MenuItem onClick={() => {
                  const newGroups = [...profile.createdGroups];
                  newGroups.splice(index, 1);
                  setProfile({ ...profile, createdGroups: newGroups });
                  toast({
                    title: 'Success',
                    description: 'Group deleted successfully',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                  });
                }}>Delete</MenuItem>
                <MenuItem onClick={() => {
                  const newName = prompt('Enter new group name:', group);
                  if (newName) {
                    const newGroups = [...profile.createdGroups];
                    newGroups[index] = newName;
                    setProfile({ ...profile, createdGroups: newGroups });
                    toast({
                      title: 'Success',
                      description: 'Group updated successfully',
                      status: 'success',
                      duration: 3000,
                      isClosable: true,
                    });
                  }
                }}>Edit</MenuItem>
              </MenuList>
            </Menu>
          ))}
        </Box>
      </Flex>
    </Flex>
  );
};

export default ProfilePage;