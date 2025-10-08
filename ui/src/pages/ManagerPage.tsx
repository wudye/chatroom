import React, { useState } from 'react';
import { Box, Button, Menu, MenuButton, MenuItem, MenuList, Text, useToast, Flex } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

interface Item {
    id: string;
    name: string;
    type: 'group' | 'friend';
}

const ManagerPage = () => {
    // 状态管理
    const [groups, setGroups] = React.useState<Item[]>([
        { id: '1', name: 'Group 1', type: 'group' },
        { id: '2', name: 'Group 2', type: 'group' },
    ]);
    const [friends, setFriends] = React.useState<Item[]>([
        { id: '3', name: 'Friend 1', type: 'friend' },
        { id: '4', name: 'Friend 2', type: 'friend' },
    ]);
    const [selectedItem, setSelectedItem] = React.useState(null);
    const [contextMenu, setContextMenu] = React.useState({
        isOpen: false,
        x: 0,
        y: 0,
    });

    // 右键菜单逻辑
    const handleContextMenu = (e: React.MouseEvent, item: any) => {
        if (!e || !item) return;
        e.preventDefault();
        setSelectedItem(item);
        setContextMenu({
            isOpen: true,
            x: e.clientX,
            y: e.clientY,
        });
    };

    const handleCloseContextMenu = () => {
        setContextMenu({ ...contextMenu, isOpen: false });
    };

    // 删除和屏蔽逻辑
    const handleDeleteItem = (item:any) => {
        if (item.type === 'group') {
            setGroups(groups.filter(group => group.id !== item.id));
        } else {
            setFriends(friends.filter(friend => friend.id !== item.id));
        }
        handleCloseContextMenu();
    };

    const toast = useToast();
    const handleBlockItem = (item:any) => {
        if (!item) return;
        toast({
            title: '操作成功',
            description: `已屏蔽 ${item.name}`,
            status: 'success',
            duration: 3000,
            isClosable: true,
        });
        handleCloseContextMenu();
    };

    return (
        <Flex className="h-screen flex-col">
            {/* Navbar */}
            <nav className="navbar bg-gray-800 text-white p-4 flex justify-between">
                <div className="nav-links flex space-x-4">
                    <Link to="/chatnav" className="hover:underline">ChatNav</Link>
                    <Link to="/user" className="hover:underline">User</Link>
                </div>
            </nav>

            {/* Main Content */}
            <Flex className="flex-1">
                {/* 群组列表 */}
                <Box className="w-1/2 p-4 border-r border-gray-300">
                    <Text className="text-xl font-bold mb-4">群组列表</Text>
                    {groups.map((group) => (
                        <Box
                            key={group.id}
                            className="p-2 bg-gray-100 rounded hover:bg-gray-200 cursor-pointer"
                            onContextMenu={(e) => handleContextMenu(e, group)}
                        >
                            <Text>{group.name}</Text>
                        </Box>
                    ))}
                </Box>

                {/* 好友列表 */}
                <Box className="w-1/2 p-4">
                    <Text className="text-xl font-bold mb-4">好友列表</Text>
                    {friends.map((friend) => (
                        <Box
                            key={friend.id}
                            className="p-2 bg-gray-100 rounded hover:bg-gray-200 cursor-pointer"
                            onContextMenu={(e) => handleContextMenu(e, friend)}
                        >
                            <Text>{friend.name}</Text>
                        </Box>
                    ))}
                </Box>
            </Flex>

            {/* 右键菜单 */}
            <Menu isOpen={contextMenu.isOpen} onClose={handleCloseContextMenu}>
                <MenuButton
                    as={Button}
                    className="hidden"
                />
                <MenuList>
                    <MenuItem onClick={() => {
                        if (!selectedItem) return;
                        toast({
                            title: '信息',
/*                             description: `名称: ${selectedItem.name}`,
 */                            status: 'info',
                            duration: 3000,
                            isClosable: true,
                        });
                    }}>信息</MenuItem>
                    <MenuItem onClick={() => handleDeleteItem(selectedItem)}>删除</MenuItem>
                    <MenuItem onClick={() => handleBlockItem(selectedItem)}>屏蔽</MenuItem>
                </MenuList>
            </Menu>
        </Flex>
    );
};

export default ManagerPage;
