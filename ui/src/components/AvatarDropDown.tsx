import { updateMyUserUsingPost, userLogoutUsingPost } from "../api/UserController";
import React, { useCallback, useState, useEffect } from 'react';
import { flushSync } from 'react-dom';
import { Link } from 'react-router-dom';
import {
  Avatar as ChakraAvatar,
  Button as ChakraButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input as ChakraInput,
  useDisclosure,
  useToast,
  HStack,
  Box,
  Text,
  Icon,
} from '@chakra-ui/react';
import { FaEdit } from 'react-icons/fa';

export type GlobalHeaderRightProps = {
  menu?: boolean;
};

export const AvatarDropdown: React.FC<GlobalHeaderRightProps> = ({ menu }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [formValues, setFormValues] = useState<{ id?: string; userName?: string; userAvatar?: string }>({});
  /**
   * 退出登录，并且将当前的 url 保存
   */
  const loginOut = async () => {
    await userLogoutUsingPost();
    const { search, pathname } = window.location;
    const urlParams = new URL(window.location.href).searchParams;
    /** 此方法会跳转到 redirect 参数所在的位置 */
    const redirect = urlParams.get('redirect');
    // Note: There may be security issues, please note
    if (window.location.pathname !== '/user/login' && !redirect) {
      const params = new URLSearchParams({ redirect: pathname + search });
      // use location.replace to navigate in a Vite/react app
      window.location.replace(`/user/login?${params.toString()}`);
    }
  };

  // Note: replaced Umi `useModel('@@initialState')` usage with localStorage-backed state

  // Replace Umi's global model with a simple localStorage-backed state so this
  // component can run without @umijs dependencies. Other parts of the app can
  // keep using their own global state; this is a minimal, compatible fallback.
  const [currentUserLocal, setCurrentUserLocal] = useState<any>(() => {
    try {
      const raw = localStorage.getItem('currentUser');
      return raw ? JSON.parse(raw) : undefined;
    } catch {
      return undefined;
    }
  });

  // Keep component in sync with localStorage across tabs/windows
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'currentUser') {
        try {
          setCurrentUserLocal(e.newValue ? JSON.parse(e.newValue) : undefined);
        } catch {
          setCurrentUserLocal(undefined);
        }
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const onFinish = async (values: any) => {
    const res = await updateMyUserUsingPost(values);
    if (res && (res as any).code === 0) {
      toast({ title: '更新成功啦', status: 'success', duration: 3000 });
      onClose();
    } else {
      toast({ title: '更新失败', status: 'error', duration: 3000 });
    }
  };

  const onMenuAction = useCallback(
    (key: string) => {
      if (key === 'logout') {
        // clear any app-global state if available (Umi users can keep setInitialState)
        try {
          // update local component state
          flushSync(() => setCurrentUserLocal(undefined));
          // persist removal to localStorage so other tabs see it
          localStorage.removeItem('currentUser');
        } catch {}
        loginOut();
        return;
      }
      if (key === 'edit') {
        const cur = currentUserLocal as any;
        setFormValues({ id: cur?.id, userName: cur?.userName, userAvatar: cur?.userAvatar });
        onOpen();
        return;
      }
      // navigate to account pages
      window.location.href = `/account/${key}`;
    },
    [onOpen, currentUserLocal],
  );
  // Use the local user state for rendering in this component.
  const currentUser = currentUserLocal;

  // If no user, show login button
  if (!currentUser) {
    return (
      <Link to="/user/login">
        <ChakraButton colorScheme="orange" size="sm">
          登录
        </ChakraButton>
      </Link>
    );
  }

  // menu items are declared inline in JSX below; no separate array needed

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>修改个人信息</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box className="py-2">
              <Text className="mb-2">账号：{currentUser.id}</Text>
              <FormControl className="mb-3">
                <FormLabel>名字</FormLabel>
                <ChakraInput
                  value={formValues.userName || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormValues((v) => ({ ...v, userName: e.target.value }))}
                />
              </FormControl>
              <FormControl className="mb-3">
                <FormLabel>头像（仅支持在线地址）</FormLabel>
                <ChakraInput
                  value={formValues.userAvatar || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormValues((v) => ({ ...v, userAvatar: e.target.value }))}
                />
              </FormControl>
            </Box>
          </ModalBody>
          <ModalFooter>
            <ChakraButton colorScheme="gray" mr={3} onClick={() => onClose()}>
              取消
            </ChakraButton>
            <ChakraButton
              colorScheme="orange"
              onClick={async () => {
                await onFinish(formValues);
              }}
            >
              确定
            </ChakraButton>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Menu>
        <MenuButton as={ChakraButton} variant="ghost">
          <HStack spacing={3}>
            {currentUser?.userAvatar ? (
              <ChakraAvatar size="sm" src={currentUser?.userAvatar} />
            ) : (
              <ChakraAvatar size="sm" name={currentUser?.userName} />
            )}
            <span className="hidden sm:inline">{currentUser?.userName}</span>
          </HStack>
        </MenuButton>
        <MenuList>
          {menu && (
            <>
              <MenuItem onClick={() => onMenuAction('center')}>个人中心</MenuItem>
              <MenuItem onClick={() => onMenuAction('settings')}>个人设置</MenuItem>
              <MenuDivider />
            </>
          )}
          <MenuItem onClick={() => onMenuAction('edit')}>
            <Icon as={FaEdit} boxSize="1em" aria-hidden />
            <span className="ml-2">修改信息</span>
          </MenuItem>
          <MenuItem onClick={() => onMenuAction('logout')}>退出登录</MenuItem>
        </MenuList>
      </Menu>
    </>
  );
};
