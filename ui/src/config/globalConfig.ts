// src/config/globalConfig.ts
export type AppSettings = {
  colorPrimary?: string;
  token?: {
    header?: { colorTextMenuSelected?: string };
    sider?: { colorTextMenuSelected?: string };
  };
  title?: string;
  logo?: string;
  pwa?: boolean;
  // any other runtime flags you want to keep
  layout?: string;
  fixedHeader?: boolean;
};

const Settings: AppSettings = {
  colorPrimary: '#FFA768',
  token: {
    header: { colorTextMenuSelected: '#FFA768' },
    sider: { colorTextMenuSelected: '#FFA768' },
  },
  title: '微狗🐶',
  logo: 'https://img0.baidu.com/it/u=1455188211,4132484470&fm=253&app=138&size=w931&n=0&f=JPEG',
  pwa: true,
  layout: 'top',
  fixedHeader: false,
};

export default Settings;

/** Call this after DOM is ready (e.g. inside useEffect in main.tsx) */
export function applySettingsToCssVars(s: AppSettings = Settings, root: HTMLElement = document.documentElement) {
  if (!root || typeof root.style === 'undefined') return;
  if (s.colorPrimary) root.style.setProperty('--color-primary', s.colorPrimary);
  const headerColor = s.token?.header?.colorTextMenuSelected ?? s.colorPrimary;
  if (headerColor) root.style.setProperty('--header-selected-color', headerColor);
  if (s.title) root.style.setProperty('--app-title', s.title);
  if (s.logo) root.style.setProperty('--logo-url', `url('${s.logo}')`);
  // optional:
  // root.style.setProperty('--header-height', '64px');
}