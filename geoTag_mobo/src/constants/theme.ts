import { useAppSelector } from '../store/hooks';

export type ThemeColors = {
  bg: string;
  card: string;
  cardBorder: string;
  text: string;
  textMuted: string;
  tealText: string;
  iconBg: string;
  divider: string;
  notifBtnBg: string;
  pillBg: string;
  inputBg: string;
  inputBorder: string;
  itemThumBg: string;
  headerBg: string;
  btnSec: string;
  btnSecText: string;
};

export const LIGHT_THEME: ThemeColors = {
  bg: '#f8f9fa',
  card: '#ffffff',
  cardBorder: '#e2e8f0',
  text: '#0f172a',
  textMuted: '#64748b',
  tealText: '#006767',
  iconBg: 'rgba(0, 103, 103, 0.05)',
  divider: '#e2e8f0',
  notifBtnBg: '#ffffff',
  pillBg: '#f0fdfa',
  inputBg: '#f1f5f9',
  inputBorder: '#cbd5e1',
  itemThumBg: '#f8f9fa',
  headerBg: '#ffffff',
  btnSec: '#f8f9fa',
  btnSecText: '#334155',
};

export const DARK_THEME: ThemeColors = {
  bg: '#081212',
  card: '#0f2020',
  cardBorder: 'rgba(45, 212, 191, 0.12)',
  text: '#ffffff',
  textMuted: '#7a9393',
  tealText: '#2dd4bf',
  iconBg: 'rgba(45, 212, 191, 0.08)',
  divider: 'rgba(45, 212, 191, 0.15)',
  notifBtnBg: '#0f2020',
  pillBg: 'rgba(45, 212, 191, 0.08)',
  inputBg: '#142a2a',
  inputBorder: 'rgba(45, 212, 191, 0.2)',
  itemThumBg: '#091515',
  headerBg: '#081212',
  btnSec: '#0f2020',
  btnSecText: '#ffffff',
};

export function getThemeColors(isDark: boolean): ThemeColors {
  return isDark ? DARK_THEME : LIGHT_THEME;
}

export function useTheme() {
  const theme = useAppSelector((state) => state?.preferences?.theme ?? 'light');
  const isDark = theme === 'dark';
  const colors = getThemeColors(isDark);
  return { theme, isDark, colors };
}
