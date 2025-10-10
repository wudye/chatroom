import React from 'react';
import { Box, Button, Flex, Text } from '@chakra-ui/react';

interface Group {
  id: number;
  groupName: string;
  description?: string;
  joinWay?: 'private' | 'invite' | 'public';
}

const groupList: Group[] = [
  { id: 1, groupName: 'Group 1', description: 'This is group 1', joinWay: 'public' },
  { id: 2, groupName: 'Group 2', description: 'This is group 2', joinWay: 'invite' },
  { id: 3, groupName: 'Group 3', description: 'This is group 3', joinWay: 'private' },
  { id: 4, groupName: 'Group 4', description: 'This is group 4', joinWay: 'public' },
  { id: 5, groupName: 'Group 5', description: 'This is group 5', joinWay: 'invite' },
  { id: 6, groupName: 'Group 6', description: 'This is group 6', joinWay: 'private' },
  { id: 7, groupName: 'Group 7', description: 'This is group 7', joinWay: 'public' },
  { id: 8, groupName: 'Group 8', description: 'This is group 8', joinWay: 'invite' },
  { id: 9, groupName: 'Group 9', description: 'This is group 9', joinWay: 'private' },
  { id: 10, groupName: 'Group 10', description: 'This is group 10', joinWay: 'public' },
  { id: 11, groupName: 'Group 11', description: 'This is group 11', joinWay: 'invite' },
  { id: 12, groupName: 'Group 12', description: 'This is group 12', joinWay: 'private' },
  { id: 13, groupName: 'Group 13', description: 'This is group 13', joinWay: 'public' },
  { id: 14, groupName: '  Group 14', description: 'This is group 14', joinWay: 'invite' },
  { id: 15, groupName: 'Group 15', description: 'This is group 15', joinWay: 'private' },
];


export default function PageShow() {
  const [currentPage, setCurrentPage] = React.useState(0);
  const [selectedGroupId, setSelectedGroupId] = React.useState<number | null>(null);
  const [showButtons, setShowButtons] = React.useState(false);
  const itemsPerPage = 10;
const paginatedGroups = groupList.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);
console.log('Current Page:', currentPage, 'Data:', paginatedGroups);
console.log('paginatedGroups:', paginatedGroups);
  return (
<>
  {paginatedGroups.map((group) => (
    <Box key={group.id} p={4} borderWidth="1px" borderRadius="lg">
      <Text fontSize="lg">{group.groupName}</Text>
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
      Page {currentPage + 1} of {Math.ceil(groupList.length / itemsPerPage)}
    </Text>
    <Button
      isDisabled={currentPage === Math.ceil(groupList.length / itemsPerPage) - 1}
      onClick={() => setCurrentPage(currentPage + 1)}
      ml={2}
    >
      Next
    </Button>
  </Flex>
</>
    
    )
  };