import React from 'react';
import { Menu, MenuButton, MenuList, MenuItem, MenuDivider, Button } from '@chakra-ui/react';

export type SimpleMenuItem = {
  key: string;
  label: React.ReactNode;
  type?: 'divider';
};

export type HeaderDropdownProps = {
  menu?: {
    selectedKeys?: string[];
    onClick?: (e: { key: string }) => void;
    items?: SimpleMenuItem[];
  };
  children?: React.ReactNode;
};

const HeaderDropdown: React.FC<HeaderDropdownProps> = ({ menu, children }) => {
  const items = menu?.items || [];
  return (
    <Menu>
      <MenuButton as={Button} variant="ghost">
        {children}
      </MenuButton>
      <MenuList>
        {items.map((it) => {
          if (it.type === 'divider') return <MenuDivider key={it.key} />;
          return (
            <MenuItem key={it.key} onClick={() => menu?.onClick?.({ key: it.key })}>
              {it.label}
            </MenuItem>
          );
        })}
      </MenuList>
    </Menu>
  );
};

export default HeaderDropdown;
