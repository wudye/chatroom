import React, { useState, useEffect } from 'react';
import { Flex, Box, Avatar, Text, Input, Button, useToast, Spinner, Menu, MenuButton, MenuList, MenuItem, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, FormControl, FormLabel, Select } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { BACKEND_HOST_LOCAL } from '../api/UrlConfig';
import axios from 'axios';




interface EditGroup {
  id: number;
  groupName: string;
  description?: string;
  joinWay?: 'private' | 'invite' | 'public';
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
  createdGroups: Group[];
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
  const [editingGroup, setEditingGroup] = useState<EditGroup | null>(null);
  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');
  const [joinWay, setJoinWay] = useState<'private' | 'invite' | 'public'>('private');
  const toast = useToast();
  const navigate = useNavigate();

  const [paginatedGroups, setPaginatedGroups] = useState<Group[]>([]);
  const [showButtons, setShowButtons] = useState(false);

   const [currentPage, setCurrentPage] = React.useState(0);
    const itemsPerPage = 10;


      const fetchProfile = async () => {
              setIsLoading(true);

   
      const response = await axios.get(`${BACKEND_HOST_LOCAL}/api/user/get/profile`);
  
      if (response.data) {
        setProfile(response.data);
        setTempProfile(response.data);


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
  useEffect(() => {
    // Fetch user profile from backend

    fetchProfile();
  }, []);


  useEffect(() => {
  if (profile?.createdGroups) {
    const paginatedGroupsSet = profile.createdGroups.slice(
      currentPage * itemsPerPage,
      (currentPage + 1) * itemsPerPage
    );
    setPaginatedGroups(paginatedGroupsSet || []);
  }
}, [profile, currentPage, itemsPerPage]);

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


  const handleDeleteGroup =  async (groupid:any) => {
    const confirmDelete = window.confirm('Do you really want to delete this group?');
    if (confirmDelete) {
      try {
        await axios.delete(`${BACKEND_HOST_LOCAL}/api/group/delete/${groupid}`);
        toast({
          title: 'Success',
          description: 'Group deleted successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        // Refresh the groups list
       fetchProfile();
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
  }


  const handleEditGroupUpdate = async () => {
    try {

      console.log('Editing group:', editingGroup);
      await axios.post( `${BACKEND_HOST_LOCAL}/api/group/update/${editingGroup?.id}`, editingGroup);
      toast({
        title: 'Success',
        description: 'Group updated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      // Refresh the groups list


    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update group',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      } finally {
        setIsEditModalOpen(false)
        fetchProfile()
        ;
    }
  }
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
               {paginatedGroups.map((group) => (
                 <Box 
                   key={group.id} 
                   p={4} 
                   borderWidth="1px" 
                   borderRadius="lg"
                   bg={selectedGroupId === group.id ? "blue.100" : "white"}
                   onClick={() => {
                     setSelectedGroupId(group.id);
                     setShowButtons(true);
                   }}
                 >
                   <Text fontSize="lg">{group.groupName}</Text>
                   {showButtons && selectedGroupId === group.id && (
                     <Flex mt={2} gap={2}>
                       <Button 
                     size="sm" 
                     colorScheme="red"
                     onClick={() => handleDeleteGroup(group.id)}
                      >
                     Delete
                   </Button>
                       <Button 
                     size="sm" 
                     colorScheme="blue"
                     onClick={() => {
               
                       setEditingGroup(group);
                       setGroupName(group.groupName);
                       setDescription(group.description || '');
                       setJoinWay(group.joinWay || 'private');
                       setIsEditModalOpen(true);
                     }}
                   >
                     Edit
                   </Button>
                   <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
                     <ModalOverlay />
                     <ModalContent>
                       <ModalHeader>Edit Group</ModalHeader>
                       <ModalCloseButton />
                       <ModalBody>
                         <FormControl mb={4}>
                           <FormLabel>Group Name</FormLabel>
                           <Input 
                             value={groupName} 
                             onChange={(e) => {
                               setGroupName(e.target.value);
                               setEditingGroup(prev => ({
                                 ...prev!,
                                 groupName: e.target.value,
                               }));
                             }} 
                           />
                         </FormControl>
                         <FormControl mb={4}>
                           <FormLabel>Description</FormLabel>
                           <Input 
                             value={description} 
                             onChange={(e) => setDescription(e.target.value)} 
                           />
                         </FormControl>
                         <FormControl mb={4}>
                           <FormLabel>Group Type</FormLabel>
                           <Select 
                             value={joinWay} 
                             onChange={(e) => setJoinWay(e.target.value as 'private' | 'public')}
                           >
                             <option value="private">Private</option>
                             <option value="public">Public</option>
                           </Select>
                         </FormControl>
                       </ModalBody>
                       <ModalFooter>
                         <Button 
                           colorScheme="blue" 
                           mr={3} 
                           onClick={() => handleEditGroupUpdate()}
                         >
                           Save
                         </Button>
                         <Button onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
                       </ModalFooter>
                     </ModalContent>
                   </Modal>
                     </Flex>
                   )}
                 </Box>
               ))}
               <Flex justify="center" mt={4}>
                 <Button
                   isDisabled={currentPage === 0}
                   onClick={() => setCurrentPage(currentPage - 1)}
                   mr={2}
                 >
                   Previous
                 </Button>
                 <Text mx={2}>
                   Page {currentPage + 1} of {Math.max(1, Math.ceil((profile?.createdGroups?.length || 0) / itemsPerPage))}
                 </Text>
                 <Button
                   isDisabled={
                     currentPage >= Math.max(1, Math.ceil((profile?.createdGroups?.length || 0) / itemsPerPage)) - 1
                   }
                   onClick={() => setCurrentPage(currentPage + 1)}
                   ml={2}
                 >
                   Next
                 </Button>
               </Flex>
             
        </Box>
      </Flex>
    </Flex>
  );
};

export default ProfilePage;