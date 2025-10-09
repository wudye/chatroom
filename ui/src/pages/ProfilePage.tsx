import React, { useState, useEffect } from 'react';
import { Flex, Box, Avatar, Text, Input, Button, useToast, Spinner, Menu, MenuButton, MenuList, MenuItem, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, FormControl, FormLabel, Select } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { BACKEND_HOST_LOCAL } from '../api/UrlConfig';
import axios from 'axios';


type Page<T> = {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number; // current page number(0-based)
}

interface Group {
  id: number;
  groupName: string;
  description?: string;
  joinWay?: 'private' | 'invite' | 'public';
}
interface UserProfile {
  id: number;
  userName: string;
  email: string;
  password: string;
  avatar: string;
  GroupsNum: number;
  friendsCount: number;
  createdGroups: Page<Group>;
  userAccount: string;
}

const ProfilePage = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [tempProfile, setTempProfile] = useState<UserProfile | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [checkedPassword, setCheckedPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');
  const [joinWay, setJoinWay] = useState<'private' | 'invite' | 'public'>('private');
  const [currentPage, setCurrentPage] = useState(0);
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
      const response = await fetch(`${BACKEND_HOST_LOCAL}/api/user/get/profile`, {
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
        console.log('Fetched profile createGroups totalElements:', data.createdGroups.totalElements);
        console.log('Fetched profile createGroups totalPages:', data.createdGroups.totalPages);
        console.log('Fetched profile createdGroups size:', data.createdGroups.size);



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
          id: 1,
          userName: 'John Doe',
          userAccount: 'johndoe',
          email: 'john@example.com',
          password: '********',
          avatar: 'https://example.com/avatar.jpg',
          GroupsNum: 5,
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
    setNewPassword('');
    setCheckedPassword('');
    setPasswordError('');
  };

  const handleSave = async () => {
    // Validate passwords if they were entered
    if (newPassword || checkedPassword) {
      if (!newPassword) {
        setPasswordError('Please enter a new password');
        return;
      }
      if (!checkedPassword) {
        setPasswordError('Please confirm your password');
        return;
      }
      if (newPassword !== checkedPassword) {
        setPasswordError('Passwords do not match');
        return;
      }
    }

    setIsLoading(true);
    try {
      // Update tempProfile with new password if provided
      if (newPassword) {
        setTempProfile(prev => ({
          ...prev!,
          password: newPassword,
        }));
      }

      await axios.post(`${BACKEND_HOST_LOCAL}/api/user/update`, tempProfile );

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
      setNewPassword('');
      setCheckedPassword('');
      setPasswordError('');
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
    
    if (name === 'newPassword') {
      setNewPassword(value);
      setPasswordError(''); // Clear error when typing new password
    } else if (name === 'checkedPassword') {
      setCheckedPassword(value);
      // Check password match when user finishes typing in checkedPassword
      if (value && newPassword && value !== newPassword) {
        setPasswordError('Passwords do not match');
      } else {
        setPasswordError('');
      }
    } else {
      setTempProfile(prev => ({
        ...prev!,
        [name]: value,
      }));
    }
  };


  const handleDeleteGroup = async (groupId: number) => {
  const confirmDelete = window.confirm('Are you sure you want to delete this group?');
  if (confirmDelete) {
    try {
      await axios.delete(`${BACKEND_HOST_LOCAL}/api/group/delete/${groupId}`);
      toast({
        title: 'Success',
        description: 'Group deleted successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      // Refresh the profile data
    //  fetchProfile(); fetch groups again
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete group',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  }
};


const handleEditGroup = (group: Group) => {
  setEditingGroup(group);
  setGroupName(group.groupName);
  setDescription(group.description || '');
  setJoinWay(group.joinWay || 'private');
  setIsEditModalOpen(true);
};


const handleSaveGroup = async () => {
  if (!editingGroup) return;
  try {
    await axios.put(`${BACKEND_HOST_LOCAL}/api/group/update/${editingGroup.id}`, {
      groupName,
      description,
      joinWay,
    });
    toast({
      title: 'Success',
      description: 'Group updated successfully',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
    setIsEditModalOpen(false);
    // fetchProfile(); fetch groups again
  } catch (error) {
    toast({
      title: 'Error',
      description: 'Failed to update group',
      status: 'error',
      duration: 3000,
      isClosable: true,
    });
  }
};

const fetchGroupsPage = async (page: number) => {
  if (!profile) return;
  try {
    const response = await fetch(
      `${BACKEND_HOST_LOCAL}/api/user/get/groups?page=${page}&size=${profile.createdGroups.size}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      }
    );
    if (response.ok) {
      const data = await response.json();
      setProfile((prev) => prev ? { ...prev, createdGroups: data } : prev);
      setCurrentPage(page);
    }
  } catch (error) {
    console.error('Failed to fetch groups page:', error);
  }
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
                name="userName"
                value={tempProfile?.userName || ''}
                onChange={handleChange}
                mb={2}
                placeholder="input a new username"
              />
            ) : (
              <Text fontSize="xl" fontWeight="bold">Username: {profile?.userName}</Text>
            )}
            <Text color="gray.500" mt={2}>UserId: {profile?.id}</Text>
            <Text color="gray.500" mt={2}>UserAccount: {profile?.userAccount}</Text>
            <Text color="gray.500" mt={2}>Email: {profile?.email}</Text>
            {isEditing ? (
              <>
              <Input
                name="newPassword"
                type="password"
                value={newPassword}
                onChange={handleChange}
                mb={2}
                placeholder="input your new password"
              />
               <Input
                name="checkedPassword"
                type="password"
                value={checkedPassword}
                onChange={handleChange}
                mb={2}
                placeholder="input your new password again"
                borderColor={passwordError ? 'red.500' : 'gray.200'}
              />
              {passwordError && (
                <Text color="red.500" fontSize="sm" mb={2}>
                  {passwordError}
                </Text>
              )}
              </>
            ) : (
              <Text color="gray.500" mt={2}>Password: ********</Text>
            )}
            <Text mt={4}>Groups: {profile?.GroupsNum}</Text>
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
              {profile?.createdGroups?.content?.map((group) => (
              <Box key={group.id} p={4} borderWidth="1px" borderRadius="lg">
                <Text fontSize="lg">{group.groupName}</Text>
                <Button colorScheme="red" size="sm" onClick={() => handleDeleteGroup(group.id)}>
                  Delete
                </Button>
                <Button colorScheme="teal" size="sm" ml={2} onClick={() => handleEditGroup(group)}>
                  <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
                    <ModalOverlay />
                    <ModalContent>
                      <ModalHeader>Edit Group</ModalHeader>
                      <ModalCloseButton />
                      <ModalBody>
                        <FormControl>
                          <FormLabel>Group Name</FormLabel>
                          <Input value={groupName} onChange={(e) => setGroupName(e.target.value)} />
                        </FormControl>
                        <FormControl mt={4}>
                          <FormLabel>Description</FormLabel>
                          <Input value={description} onChange={(e) => setDescription(e.target.value)} />
                        </FormControl>
                        <FormControl mt={4}>
                          <FormLabel>Join Way</FormLabel>
                          <Select value={joinWay} onChange={(e) => setJoinWay(e.target.value as 'private' | 'invite' | 'public')}>
                            <option value="private">Private</option>
                            <option value="invite">Invite Only</option>
                            <option value="public">Public</option>
                          </Select>
                        </FormControl>
                      </ModalBody>
                      <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={handleSaveGroup}>
                          Save
                        </Button>
                        <Button variant="ghost" onClick={() => setIsEditModalOpen(false)}>
                          Cancel
                        </Button>
                      </ModalFooter>
                    </ModalContent>
                  </Modal>
                
                  Edit
                </Button>
              </Box>
            ))}
            {/* Pagination Controls */}
            {profile?.createdGroups && (
            <Flex mt={4} justify="center" align="center">
              <Button
                onClick={() => fetchGroupsPage(currentPage - 1)}
                isDisabled={currentPage === 0}
                mr={2}
              >
                Previous
              </Button>
              {Array.from({ length: profile.createdGroups.totalPages }, (_, index) => (
                <Button
                  key={index}
                  onClick={() => fetchGroupsPage(index)}
                  variant={currentPage === index ? 'solid' : 'outline'}
                  mx={1}
                >
                  {index + 1}
                </Button>
              ))}
              <Button
                onClick={() => fetchGroupsPage(currentPage + 1)}
                isDisabled={currentPage + 1 >= profile.createdGroups.totalPages}
                ml={2}
              >
                Next
              </Button>
            </Flex>
          )}
        </Box>
      </Flex>
    </Flex>
  );
};

export default ProfilePage;