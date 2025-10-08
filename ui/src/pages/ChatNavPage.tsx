import React from 'react';
import { Flex, Box, Button, Menu, MenuButton, MenuList, MenuItem, Text, Input, Select } from '@chakra-ui/react';

const DiscordLikeUI: React.FC = () => {
    // 状态管理
    const [selectedView, setSelectedView] = React.useState<'friends' | 'gto'>('friends');
    const [selectedFriend, setSelectedFriend] = React.useState<any>(null);
    const [selectedFriendId, setSelectedFriendId] = React.useState<string | null>(null);
    const [selectedTopic, setSelectedTopic] = React.useState<string>('general');
    const [selectedTopicId, setSelectedTopicId] = React.useState<string | null>(null);
    const [selectedUserId, setSelectedUserId] = React.useState<string | null>(null);
    const [selectedUser, setSelectedUser] = React.useState<any>(null);
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);
    const [showSearchBox, setShowSearchBox] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [hasFriendRequests, setHasFriendRequests] = React.useState(false);
    const [showFriendRequests, setShowFriendRequests] = React.useState(false);
    const [unreadMessages, setUnreadMessages] = React.useState<Record<string, number>>({});
    const [unreadCountInFirstBar, setUnreadCountInFirstBar] = React.useState(0);
    const [isAdmin, setIsAdmin] = React.useState(false); // 普通用户
    const [friends, setFriends] = React.useState([
        { id: '1', name: 'Alice', bio: '喜欢编程和音乐' },
        { id: '2', name: 'Bob', bio: '热爱旅行和摄影' },
    ]);
    const [mockUsers, setMockUsers] = React.useState([
        { id: '3', name: 'Charlie', bio: '游戏开发者' },
        { id: '4', name: 'Diana', bio: '设计师' },
    ]);
    const [topics, setTopics] = React.useState([
        { id: '1', name: 'general' },
        { id: '2', name: 'random' },
    ]);
    const [friendMessages, setFriendMessages] = React.useState([
        { id: '1', friendId: '1', sender: 'Alice', content: '你好！', timestamp: '10:00' },
        { id: '2', friendId: '1', sender: 'You', content: '你好Alice！', timestamp: '10:01' },
    ]);
    const [messages, setMessages] = React.useState([
        { id: '1', topic: 'general', sender: 'Alice', content: '大家好！', timestamp: '10:00' },
        { id: '2', topic: 'general', sender: 'Bob', content: '欢迎！', timestamp: '10:01' },
    ]);
    const [showGroupSearchBox, setShowGroupSearchBox] = React.useState(false);
    const [groupSearchQuery, setGroupSearchQuery] = React.useState('');
    const [groups, setGroups] = React.useState([{ id: '1', name: 'gto' }]); // 初始包含 gto
    const [showCreateGroupDialog, setShowCreateGroupDialog] = React.useState(false);
    const [newGroupName, setNewGroupName] = React.useState('');
    const [newGroupDescription, setNewGroupDescription] = React.useState('');
    const [newGroupPermission, setNewGroupPermission] = React.useState('任何人都可加入');

    // 样式
    const listItemStyle = {
        color: 'white',
        fontSize: 'sm',
        cursor: 'pointer',
        _hover: { bg: 'gray.600' },
        p: 1,
        borderRadius: 'md',
    };

    const selectedItemStyle = {
        bg: 'blue.500',
        color: 'white',
        _hover: { bg: 'blue.600' },
    };

    // 创建新主题
    const handleCreateTopic = () => {
        const newTopic = { id: Date.now().toString(), name: `topic-${topics.length + 1}` };
        setTopics([...topics, newTopic]);
    };

    // 发送好友消息
    const handleSendFriendMessage = (content: string) => {
        if (!selectedFriend || !content.trim()) return;
        const newMessage = {
            id: Date.now().toString(),
            friendId: selectedFriend.id,
            sender: 'You',
            content,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setFriendMessages([...friendMessages, newMessage]);
    };

    // 发送群组消息
    const handleSendGroupMessage = (content: string) => {
        if (!content.trim()) return;
        const newMessage = {
            id: Date.now().toString(),
            topic: selectedTopic,
            sender: 'You',
            content,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages([...messages, newMessage]);
    };

    // 查看好友简介
    const handleViewFriendProfile = (friendId: string) => {
        const friend = friends.find(f => f.id === friendId);
        if (friend) {
            alert(`好友简介:\n姓名: ${friend.name}\nID: ${friend.id}\n简介: ${friend.bio}`);
        }
        setIsMenuOpen(false);
    };

    // 删除好友
    const handleRemoveFriend = (friendId: string) => {
        setFriends(friends.filter(friend => friend.id !== friendId));
        setFriendMessages(friendMessages.filter(msg => msg.friendId !== friendId));
        if (selectedFriendId === friendId) {
            setSelectedFriendId(null);
            setSelectedFriend(null);
        }
        setIsMenuOpen(false);
    };

    // 发送好友请求
    const handleSendFriendRequest = (username: string) => {
        const userExists = mockUsers.some(user => user.name === username);
        if (!userExists) {
            alert('用户名不存在');
            return;
        }

        const isAccepted = Math.random() > 0.5; // 模拟用户接受或拒绝
        if (isAccepted) {
            const newFriend = mockUsers.find(user => user.name === username);
            if (newFriend) {
                setFriends([...friends, newFriend]);
                alert(`已添加 ${username} 为好友`);
            }
        } else {
            alert('对方拒绝加为好友');
        }
    };

    // 查看用户消息
    const handleViewUserMessages = (userId: string) => {
        const user = mockUsers.find(u => u.id === userId);
        if (user) {
            alert(`查看 ${user.name} 的消息`);
        }
        setIsUserMenuOpen(false);
    };

    // 添加好友
    const handleAddFriend = (userId: string) => {
        const user = mockUsers.find(u => u.id === userId);
        if (user) {
            setFriends([...friends, user]);
            alert(`已添加 ${user.name} 为好友`);
        }
        setIsUserMenuOpen(false);
    };

    // 选择用户
    const handleSelectUser = (userId: string) => {
        setSelectedUserId(userId);
        setSelectedUser(mockUsers.find(u => u.id === userId));
    };

    // 选择好友
    const handleSelectFriend = (friendId: string) => {
        setSelectedFriendId(friendId);
        setSelectedFriend(friends.find(f => f.id === friendId));
    };

    // 加入群组
    const handleJoinGroup = () => {
        if (!groupSearchQuery.trim()) return;

        // 模拟检查群组是否存在
        const groupExists = Math.random() > 0.5; // 随机模拟存在或不存在
        if (groupExists) {
            const newGroup = { id: Date.now().toString(), name: groupSearchQuery };
            setGroups([...groups, newGroup]);
            setGroupSearchQuery('');
            setShowGroupSearchBox(false);
        } else {
            alert('此群组不存在');
        }
    };

    // 创建群组
    const handleCreateGroup = () => {
        if (!newGroupName.trim()) {
            alert('请输入群组名称');
            return;
        }

        const newGroup = {
            id: Date.now().toString(),
            name: newGroupName,
            description: newGroupDescription,
            permission: newGroupPermission,
        };

        setGroups([...groups, newGroup]);
        setNewGroupName('');
        setNewGroupDescription('');
        setNewGroupPermission('任何人都可加入');
        setShowCreateGroupDialog(false);
    };

    // 模拟收到好友申请
    React.useEffect(() => {
        const interval = setInterval(() => {
            const hasRequest = Math.random() > 0.7;
            setHasFriendRequests(hasRequest);
            if (hasRequest) {
                setUnreadCountInFirstBar(prev => prev + 1);
            }
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    // 模拟收到新消息
    React.useEffect(() => {
        const interval = setInterval(() => {
            const randomFriend = friends[Math.floor(Math.random() * friends.length)];
            if (randomFriend && selectedFriendId !== randomFriend.id) {
                const newMessage = {
                    id: Date.now().toString(),
                    friendId: randomFriend.id,
                    sender: randomFriend.name,
                    content: '这是一条新消息',
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                };
                setFriendMessages([...friendMessages, newMessage]);
                setUnreadMessages(prev => ({
                    ...prev,
                    [randomFriend.id]: (prev[randomFriend.id] || 0) + 1,
                }));
                setUnreadCountInFirstBar(prev => prev + 1);
            }
        }, 10000);
        return () => clearInterval(interval);
    }, [friends, selectedFriendId, friendMessages]);

    // 点击第一栏的「好友列表」按钮
    const handleClickFirstBarFriends = () => {
        setUnreadCountInFirstBar(0);
        setSelectedView('friends');
        setSelectedFriend(null);
        setSelectedFriendId(null);
    };

    return (
        <Flex className="h-screen w-screen">
            {/* 第一栏：小栏 */}
            <Box className="w-16 bg-gray-800 p-2 flex flex-col">
                {/* 好友列表按钮 */}
                <Box mb={4}>
                    <Text
                        sx={{
                            ...listItemStyle,
                            ...(selectedView === 'friends' ? selectedItemStyle : {}),
                        }}
                        onClick={handleClickFirstBarFriends}
                    >
                        好友列表
                        {unreadCountInFirstBar > 0 && (
                            <Box as="span" ml={2} color="red.500">
                                {unreadCountInFirstBar}
                            </Box>
                        )}
                    </Text>
                </Box>

                {/* gto按钮 */}
                <Box mb={4}>
                    <Text
                        sx={{
                            ...listItemStyle,
                            ...(selectedView === 'gto' ? selectedItemStyle : {}),
                        }}
                        onClick={() => {
                            setSelectedView('gto');
                            setSelectedTopic('general');
                            setSelectedTopicId('1');
                        }}
                    >
                        gto
                    </Text>
                </Box>

                {/* 动态生成的群组按钮 */}
                {groups.map((group) => (
                    <Text
                        key={group.id}
                        sx={{
                            ...listItemStyle,
                            ...(selectedView === 'gto' && selectedTopicId === group.id ? selectedItemStyle : {}),
                        }}
                        onClick={() => {
                            setSelectedView('gto');
                            setSelectedTopic(group.name);
                            setSelectedTopicId(group.id);
                        }}
                    >
                        {group.name}
                    </Text>
                ))}

                {/* 添加按钮 */}
                <Box mb={4}>
                    <Button size="sm" colorScheme="blue" w="full" onClick={() => setShowGroupSearchBox(!showGroupSearchBox)}>
                        添加
                    </Button>
                    {showGroupSearchBox && (
                        <Box mb={2}>
                            <Input
                                placeholder="输入群组名称..."
                                value={groupSearchQuery}
                                onChange={(e) => setGroupSearchQuery(e.target.value)}
                            />
                            <Button
                                size="sm"
                                colorScheme="blue"
                                w="full"
                                mt={1}
                                onClick={handleJoinGroup}
                            >
                                加入
                            </Button>
                        </Box>
                    )}
                </Box>

                {/* 创建群组按钮 */}
                <Box mb={4}>
                    <Button size="sm" colorScheme="blue" w="full" onClick={() => setShowCreateGroupDialog(true)}>
                        创建群组
                    </Button>
                </Box>

                {/* 用户菜单 */}
                <Box mt="auto">
                    <Menu>
                        <MenuButton as={Button} size="sm" colorScheme="gray">
                            用户
                        </MenuButton>
                        <MenuList>
                            <MenuItem>资料</MenuItem>
                            <MenuItem>注销</MenuItem>
                        </MenuList>
                    </Menu>
                </Box>
            </Box>

            {/* 第二栏：中栏 */}
            <Box className="w-60 bg-gray-700 p-2">
                {selectedView === 'friends' ? (
                    <Box>
                        <Flex justifyContent="space-between" alignItems="center" mb={2}>
                            <Text color="white" fontSize="lg">好友列表</Text>
                            <Button
                                size="sm"
                                colorScheme="blue"
                                onClick={() => setShowFriendRequests(!showFriendRequests)}
                                sx={{
                                    animation: hasFriendRequests ? 'pulse 1s infinite' : 'none',
                                }}
                            >
                                Info
                            </Button>
                        </Flex>
                        {friends.map((friend) => (
                            <React.Fragment key={friend.id}>
                                <Text
                                    sx={{
                                        ...listItemStyle,
                                        ...(selectedFriendId === friend.id ? selectedItemStyle : {}),
                                    }}
                                    onClick={() => friend.id && handleSelectFriend(friend.id)}
                                    onContextMenu={(e) => {
                                        if (friend.id) {
                                            e.preventDefault();
                                            setSelectedFriendId(friend.id);
                                            setSelectedFriend(friend);
                                            setIsMenuOpen(true);
                                        }
                                    }}
                                >
                                    {friend.name}
                                    {unreadMessages[friend.id] > 0 && (
                                        <Box as="span" ml={2} color="red.500">
                                            {unreadMessages[friend.id]}
                                        </Box>
                                    )}
                                </Text>
                                <Menu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)}>
                                    <MenuButton as={Box} style={{ display: 'none' }} />
                                    <MenuList>
                                        <MenuItem onClick={() => handleViewFriendProfile(friend.id)}>好友简介</MenuItem>
                                        <MenuItem onClick={() => handleRemoveFriend(friend.id)}>解除好友</MenuItem>
                                    </MenuList>
                                </Menu>
                            </React.Fragment>
                        ))}
                        <Button
                            size="sm"
                            colorScheme="blue"
                            w="full"
                            mb={2}
                            onClick={() => setShowSearchBox(!showSearchBox)}
                        >
                            添加好友
                        </Button>
                        {showSearchBox && (
                            <Box mb={2}>
                                <Input
                                    placeholder="输入用户名..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter' && searchQuery.trim()) {
                                            handleSendFriendRequest(searchQuery);
                                        }
                                    }}
                                />
                                <Button
                                    size="sm"
                                    colorScheme="blue"
                                    w="full"
                                    mt={1}
                                    onClick={() => handleSendFriendRequest(searchQuery)}
                                >
                                    发送请求
                                </Button>
                            </Box>
                        )}
                    </Box>
                ) : (
                    <Box>
                        <Text color="white" fontSize="lg" mb={2}>主题</Text>
                        {isAdmin && (
                            <Button size="sm" colorScheme="blue" mb={2} onClick={handleCreateTopic}>
                                创建主题
                            </Button>
                        )}
                        {topics.map((topic) => (
                            <Text
                                key={topic.id}
                                sx={{
                                    ...listItemStyle,
                                    ...(selectedTopicId === topic.id ? selectedItemStyle : {}),
                                }}
                                onClick={() => {
                                    setSelectedTopicId(topic.id);
                                    setSelectedTopic(topic.name);
                                }}
                            >
                                #{topic.name}
                            </Text>
                        ))}
                    </Box>
                )}
            </Box>

            {/* 第三栏：大栏 */}
            <Flex className="flex-1 bg-gray-600">
                {/* 用户列表（仅普通用户可见） */}
                {!isAdmin && (
                    <Box className="w-60 bg-gray-700 p-2">
                        <Text color="white" fontSize="lg" mb={2}>用户列表</Text>
                        {mockUsers.map((user) => (
                            <React.Fragment key={user.id}>
                                <Text
                                    sx={{
                                        ...listItemStyle,
                                        ...(selectedUserId === user.id ? selectedItemStyle : {}),
                                    }}
                                    onClick={() => handleSelectUser(user.id)}
                                    onContextMenu={(e) => {
                                        e.preventDefault();
                                        setSelectedUserId(user.id);
                                        setIsUserMenuOpen(true);
                                    }}
                                >
                                    {user.name}
                                </Text>
                                <Menu isOpen={isUserMenuOpen} onClose={() => setIsUserMenuOpen(false)}>
                                    <MenuButton as={Box} style={{ display: 'none' }} />
                                    <MenuList>
                                        <MenuItem onClick={() => handleViewUserMessages(user.id)}>用户消息</MenuItem>
                                        <MenuItem onClick={() => handleAddFriend(user.id)}>添加好友</MenuItem>
                                    </MenuList>
                                </Menu>
                            </React.Fragment>
                        ))}
                    </Box>
                )}

                {/* 聊天区域 */}
                <Box className="flex-1 flex flex-col">
                    {selectedView === 'friends' ? (
                        <>
                            {/* 好友聊天记录 */}
                            <Box flex={1} p={4} overflowY="auto">
                                <Text color="white" fontSize="lg" mb={2}>
                                    {selectedFriend ? selectedFriend.name : '选择好友'}
                                </Text>
                                {selectedFriend && friendMessages
                                    .filter((msg) => msg.friendId === selectedFriend.id)
                                    .map((message) => (
                                        <Box key={message.id} mb={2}>
                                            <Text color="white" fontSize="sm">
                                                {message.sender}: {message.content}
                                            </Text>
                                            <Text color="gray.400" fontSize="xs">
                                                {message.timestamp}
                                            </Text>
                                        </Box>
                                    ))}
                            </Box>

                            {/* 好友聊天输入框 */}
                            <Box p={2} borderTop="1px solid" borderColor="gray.500">
                                <Input
                                    placeholder="输入消息..."
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                                            handleSendFriendMessage(e.currentTarget.value);
                                            e.currentTarget.value = '';
                                        }
                                    }}
                                />
                            </Box>
                        </>
                    ) : (
                        <>
                            {/* 群组聊天记录 */}
                            <Box flex={1} p={4} overflowY="auto">
                                <Text color="white" fontSize="lg" mb={2}>#{selectedTopic}</Text>
                                {messages
                                    .filter((msg) => msg.topic === selectedTopic)
                                    .map((message) => (
                                        <Box key={message.id} mb={2}>
                                            <Text color="white" fontSize="sm">
                                                {message.sender}: {message.content}
                                            </Text>
                                            <Text color="gray.400" fontSize="xs">
                                                {message.timestamp}
                                            </Text>
                                        </Box>
                                    ))}
                            </Box>

                            {/* 群组聊天输入框 */}
                            <Box p={2} borderTop="1px solid" borderColor="gray.500">
                                <Input
                                    placeholder="输入消息..."
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                                            handleSendGroupMessage(e.currentTarget.value);
                                            e.currentTarget.value = '';
                                        }
                                    }}
                                />
                            </Box>
                        </>
                    )}
                </Box>
            </Flex>

            {/* 创建群组对话框 */}
            {showCreateGroupDialog && (
                <Box position="fixed" top="50%" left="50%" transform="translate(-50%, -50%)" bg="gray.700" p={4} borderRadius="md" zIndex={1000}>
                    <Text color="white" fontSize="lg" mb={2}>创建群组</Text>
                    <Input
                        placeholder="群组名称"
                        value={newGroupName}
                        onChange={(e) => setNewGroupName(e.target.value)}
                        mb={2}
                    />
                    <Input
                        placeholder="群组介绍"
                        value={newGroupDescription}
                        onChange={(e) => setNewGroupDescription(e.target.value)}
                        mb={2}
                    />
                    <Select
                        value={newGroupPermission}
                        onChange={(e) => setNewGroupPermission(e.target.value)}
                        mb={2}
                    >
                        <option value="任何人都可加入">任何人都可加入</option>
                        <option value="只有邀请">只有邀请</option>
                        <option value="管理员批准">管理员批准</option>
                    </Select>
                    <Flex justifyContent="flex-end">
                        <Button size="sm" colorScheme="gray" mr={2} onClick={() => setShowCreateGroupDialog(false)}>
                            取消
                        </Button>
                        <Button size="sm" colorScheme="blue" onClick={handleCreateGroup}>
                            确认
                        </Button>
                    </Flex>
                </Box>
            )}
        </Flex>
    );
};

export default DiscordLikeUI;
