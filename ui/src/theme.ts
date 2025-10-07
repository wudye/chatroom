import { extendTheme, type ThemeConfig } from '@chakra-ui/react';

// 1. 定义主题配置（如颜色模式、全局样式等）
const config: ThemeConfig = {
  initialColorMode: 'light', // 默认颜色模式（light/dark）
  useSystemColorMode: false, // 是否跟随系统颜色模式
};

// 2. 扩展主题
const theme = extendTheme({
  config,
  colors: {
    primary: {
      50: '#e0f2ff',
      100: '#b3d9ff',
      200: '#80c0ff',
      300: '#4da6ff',
      400: '#1a8dff',
      500: '#0074e8', // 主色调
      600: '#005cb6',
      700: '#004483',
      800: '#002d51',
      900: '#00151f',
    },
    secondary: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#0ea5e9', // 次要色调
      600: '#0284c7',
      700: '#0369a1',
      800: '#075985',
      900: '#0c4a6e',
    },
  },
  fonts: {
    heading: 'Inter, sans-serif', // 标题字体
    body: 'Inter, sans-serif', // 正文字体
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'semibold', // 按钮默认字体粗细
        borderRadius: 'md', // 按钮圆角
      },
      variants: {
        solid: {
          bg: 'primary.500', // 主色调按钮背景
          color: 'white', // 按钮文字颜色
          _hover: {
            bg: 'primary.600', // 悬停状态背景色
          },
        },
        outline: {
          borderColor: 'primary.500', // 边框颜色
          color: 'primary.500', // 文字颜色
          _hover: {
            bg: 'primary.50', // 悬停状态背景色
          },
        },
      },
    },
    Input: {
      baseStyle: {
        field: {
          borderRadius: 'md', // 输入框圆角
        },
      },
    },
  },
  styles: {
    global: {
      body: {
        bg: 'gray.50', // 页面背景色
        color: 'gray.800', // 默认文字颜色
      },
    },
  },
});

export default theme;
