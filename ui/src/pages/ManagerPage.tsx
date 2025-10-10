import React, { useState } from 'react';
import { Box, Button, Menu, MenuButton, MenuItem, MenuList, Text, useToast, Flex
, Container, Heading, Stack
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BACKEND_HOST } from '../api/UrlConfig';
import { current } from '@reduxjs/toolkit';

interface goupListResponse {
    id: string;
    groupName: string;
    createTime: string;
    updateTime: string;
    groupType: string;
    userId: string;
}


 interface Pageable<T> {
  content: T[];           // 当前页的数据
  totalElements: number;  // 总条数
  totalPages: number;     // 总页数
  number: number;         // 当前页码（从0开始）
  size: number;           // 每页条数
  // 其它分页相关字段
}


interface FetuchUserResponse {
    id: string;
    username: string;
    email: string;
    userPassword: string;
    userAccount: string;
    createTime: string;
    updateTime: string;
}


const ManagerPage = () => {

        const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1); // Start from page 1


const [groups, setGroups] = useState<Pageable<goupListResponse>>({
    content: [],
    totalElements: 0,
    totalPages: 0,
    number: 0,
    size: 10, // 默认每页条数
    });

    const [users, setUsers] = useState<Pageable<FetuchUserResponse>>({
    content: [],
    totalElements: 0,
    totalPages: 0,
    number: 0,
    size: 10, // 默认每页条数
    });

  const fetchGroups = async (page: number) => {
    try {
      console.log(`Fetching groups for page ${page}...`);
      const response = await axios.get(
        `${BACKEND_HOST}/api/group/page?pageNum=${page - 1}&size=${groups.size}`
      ); // Backend pages are 0-indexed
      const data = response.data;
      console.log('Fetched groups data:', data);
      setGroups(data);
    } catch (error) {
      console.error('Error fetching groups:', error);
    }
  };


  const fetchUsers = async (page: number) => {
    try {
        const response = await axios.get(
        `${BACKEND_HOST}/api/user/page?pageNum=${page - 1}&size=${users.size}`
      );
        const data = response.data;
        setUsers(data);
    } catch (error) {
        console.error('Error fetching users:', error);
    }
  };
    React.useEffect(() => {
        console.log('Fetching all groups...');
        fetchGroups(currentPage);
        fetchUsers(currentPage);
    }, [currentPage]);



  const handleNextPage = () => {
    if (currentPage < groups.totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

    // 状态管理

    // Define a new type for selectedItem to include the `type` field
type SelectedItem = (goupListResponse | FetuchUserResponse) & { type: 'group' | 'user' };

// Update the state type for selectedItem
const [selectedItem, setSelectedItem] = React.useState<SelectedItem | null>(null);
    const [contextMenu, setContextMenu] = React.useState({
        isOpen: false,
        x: 0,
        y: 0,
    });

    const toast = useToast(); // Ensure toast is defined in the scope

    // 右键菜单逻辑
    const handleContextMenu = (e: React.MouseEvent, item: goupListResponse | FetuchUserResponse) => {
        if (!e || !item) return;
        e.preventDefault();

        // Determine if the item is a group or a user
        const isGroup = 'groupName' in item;
        console.log('Context menu triggered:', {
            item,
            isGroup,
            x: e.clientX,
            y: e.clientY,
        });

        setSelectedItem({ ...item, type: isGroup ? 'group' : 'user' }); // Add type to distinguish
        setContextMenu({
            isOpen: true,
            x: e.clientX,
            y: e.clientY,
        });
    };

    const handleCloseContextMenu = () => {
        setContextMenu({ ...contextMenu, isOpen: false });
    };

    const handleDeleteGroup = (id?: string) => {
        if (!id) return;
        setGroups({
            ...groups,
            content: groups.content.filter(group => group.id !== id),
            totalElements: groups.totalElements - 1,
        });
        handleCloseContextMenu();
    };

    const handleInactiveGroup = (id?: string) => {
        if (!id) return;
        const group = groups.content.find(g => g.id === id);
        if (!group) return;
        toast({
            title: 'Group Inactivated',
            description: `Group ${group.groupName} has been inactivated`,
            status: 'info',
            duration: 3000,
            isClosable: true,
        });
        handleCloseContextMenu();
    };

    const handleGroupDetails = async (id?: string) => {
        if (!id) return;
        const group = await axios.get(`${BACKEND_HOST}/api/group/details/${id}`).then((res) => res.data);


        console.log('Group details response:', group);
        if (!group) return;
        toast({
            title: 'Group Details',
            description: `Group Name: ${group.groupName}\nCreated At: ${group.createTime}\nUpdated At: ${group.updateTime}`,
            status: 'info',
            duration: 5000,
            isClosable: true,
            position: 'top', // Set the toast to appear at the top of the page
        });
        handleCloseContextMenu();
    };

       const handleUserDetails = async (id?: string) => {
        if (!id) return;
        const response = await axios.get(`${BACKEND_HOST}/api/group/details/${id}`);
     

        const user = users.content.find(g => g.id === id);
        if (!user) return;
        toast({
            title: 'User Details',
            description: `User Name: ${user.userAccount}\nCreated At: ${user.createTime}\nUpdated At: ${user.updateTime}`,
            status: 'info',
            duration: 5000,
            isClosable: true,
            position: 'top', // Set the toast to appear at the top of the page
        });
        handleCloseContextMenu();
    };

         const handleDeleteUser = (id?: string) => {
        if (!id) return;}

       const  handleInactiveUser = (id?: string) => {
        if (!id) return;
       }

    return (
        <Flex className="h-screen flex-col">
                {/* Navbar */}
                <Box as="nav" bg="gray.50" px={6} py={3} boxShadow="sm">
                  <Container maxW="7xl" display="flex" alignItems="center" justifyContent="space-between">
                    <Heading as="h1" size="md">Manager Page</Heading>
                    <Stack direction="row" spacing={6} align="center">
                         <Link to="/chatnav">
                        <Button colorScheme="teal" variant="solid" size="sm">Chat</Button>
                      </Link>    
                        <Menu>
                            <MenuButton as={Button} variant="ghost" borderRadius="full" p={2} bg="blue.500" color="white" _hover={{ bg: "blue.600" }}>
                                user
                            </MenuButton>
                            <MenuList>
                            <MenuItem as={Link} to="/profile">Profile</MenuItem>
                            <MenuItem  onClick={() => navigate('/logout')}>Logout</MenuItem>
                            </MenuList>
                        </Menu>
            
                    </Stack>

                  </Container>
                </Box>

            {/* Main Content */}
            <Flex className="flex-1">
                {/* grouplist */}
                <Box className="w-1/2 p-4 border-r border-gray-300 text-center">
                    <Text className="text-xl font-bold mb-4">GroupList</Text>
                    <Box as="table" width="100%" border="1px solid #ccc" borderRadius="8px" overflow="hidden">
                        <Box as="thead" bg="gray.200">
                            <Box as="tr">
                                <Box as="th" p="8px" textAlign="left">Group Name</Box>
                                <Box as="th" p="8px" textAlign="left">Create Time</Box>
                                <Box as="th" p="8px" textAlign="left">Update Time</Box>
                            </Box>
                        </Box>
                        <Box as="tbody">
                            {groups.content.map((group) => (
                                <Box
                                    as="tr"
                                    key={group.id}
                                    className="hover:bg-gray-100 cursor-pointer"
                                    onClick={() => setSelectedItem({ ...group, type: 'group' })} // Add `type` dynamically
                                    onContextMenu={(e: React.MouseEvent) => handleContextMenu(e, group)} // Explicitly type `e`
                                >
                                    <Box as="td" p="8px" border="1px solid #ccc">{group.groupName}</Box>
                                    <Box as="td" p="8px" border="1px solid #ccc">{group.createTime}</Box>
                                    <Box as="td" p="8px" border="1px solid #ccc">{group.updateTime}</Box>
                                </Box>
                            ))}
                        </Box>
                    </Box>
   
              
                    {/* Pagination Controls */}
                    <Flex justifyContent="space-between" mt={4}>
                        <Button
                            onClick={handlePreviousPage}
                            isDisabled={currentPage === 1}
                            colorScheme="teal"
                        >
                            Previous
                        </Button>
                        <Text>
                            Page {currentPage} of {groups.totalPages}
                        </Text>
                        <Button
                            onClick={handleNextPage}
                            isDisabled={currentPage === groups.totalPages}
                            colorScheme="teal"
                        >
                            Next
                        </Button>
                    </Flex>
     
                </Box>

                {/* 好友列表 */}
                <Box className="w-1/2 p-4">
                    <Text fontSize="xl" fontWeight="bold" mb={4} textAlign="center">好友列表</Text>
                     {users.content.map((user) => (
                        <Box
                            key={user.id}
                            className="p-2 bg-gray-100 rounded hover:bg-gray-200 cursor-pointer"
                            onContextMenu={(e) => handleContextMenu(e, user)}
                        >
                            <Text>{user.userAccount}</Text>
                        </Box>
                    ))} 
                </Box>
            </Flex>
                                      {/* 右键菜单 */}
                        <Menu isOpen={contextMenu.isOpen} onClose={handleCloseContextMenu} placement="right-start">
    <MenuList
        style={{
            position: 'absolute',
            top: contextMenu.y,
            left: contextMenu.x,
            transform: 'translate(-50%, -50%)',
        }}
    >
        {selectedItem?.type === 'group' && (
            <>
                <MenuItem onClick={() => handleGroupDetails(selectedItem?.id)}>Group Details</MenuItem>
                <MenuItem onClick={() => handleInactiveGroup(selectedItem?.id)}>Inactive Group</MenuItem>
                <MenuItem onClick={() => handleDeleteGroup(selectedItem?.id)}>Delete Group</MenuItem>
            </>
        )}
        {selectedItem?.type === 'user' && (
            <>
                <MenuItem onClick={() => handleUserDetails(selectedItem?.id)}>User Details</MenuItem>
                <MenuItem onClick={() => handleInactiveUser(selectedItem?.id)}>Inactive User</MenuItem>
                <MenuItem onClick={() => handleDeleteUser(selectedItem?.id)}>Delete User</MenuItem>
            </>
        )}
    </MenuList>
</Menu>


            
        </Flex>
    );
};

export default ManagerPage;
