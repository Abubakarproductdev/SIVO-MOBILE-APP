import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const THEME_STORAGE_KEY = '@sivo/color-mode';

const shared = {
  primary: '#CD2019',
  primaryEnd: '#CD2019',
  accent: '#CD2019',
  accentEnd: '#CD2019',
  coral: '#CD2019',
  violet: '#CD2019',
  primaryLight: 'rgba(205, 32, 25, 0.15)',
  primaryMuted: 'rgba(205, 32, 25, 0.08)',
  success: '#34C759',
  error: '#CD2019',
  warning: '#FF9500',
};

export const DARK_COLORS = {
  ...shared,
  bgDark: '#0D0D0D', bgCard: '#1A1A1A', bgElevated: '#222222', bgInput: '#1A1A1A',
  textPrimary: '#FFFFFF', textSecondary: '#A0A0A0', textMuted: '#666666',
  border: 'rgba(255, 255, 255, 0.06)', borderLight: 'rgba(255, 255, 255, 0.10)',
  onPrimary: '#FFFFFF', overlay: 'rgba(13, 13, 13, 0.45)', subtleOnPrimary: 'rgba(255,255,255,0.80)',
  statCardBg: '#FFFFFF', statCardText: '#1A1A1A',
};

export const LIGHT_COLORS = {
  ...shared,
  // Light mode intentionally swaps the app's black surfaces to distinct light surfaces
  // and white foregrounds to black/dark foregrounds.
  bgDark: '#FFFFFF', 
  bgCard: '#F2F2F2', // Distinct card background for light mode
  bgElevated: '#E8E8E8', 
  bgInput: '#F5F5F5',
  textPrimary: '#000000', 
  textSecondary: '#5F5F5F', 
  textMuted: '#999999',
  border: 'rgba(0, 0, 0, 0.12)', 
  borderLight: 'rgba(0, 0, 0, 0.06)',
  onPrimary: '#FFFFFF', // Text on primary (crimson) should remain white for readability
  overlay: 'rgba(255, 255, 255, 0.7)', 
  subtleOnPrimary: 'rgba(255, 255, 255, 0.80)',
  statCardBg: '#000000', // Black card in light mode
  statCardText: '#FFFFFF', // White text on the black card
};

const ThemeContext = createContext({
  colorMode: 'dark',
  colors: DARK_COLORS,
  setColorMode: () => {},
  toggleColorMode: () => {},
});

export function ThemeProvider({ children }) {
  const [colorMode, setColorModeState] = useState('dark');

  useEffect(() => {
    AsyncStorage.getItem(THEME_STORAGE_KEY)
      .then((savedMode) => {
        if (savedMode === 'light' || savedMode === 'dark') setColorModeState(savedMode);
      })
      .catch(() => {});
  }, []);

  const setColorMode = (mode) => {
    const nextMode = mode === 'light' ? 'light' : 'dark';
    setColorModeState(nextMode);
    AsyncStorage.setItem(THEME_STORAGE_KEY, nextMode).catch(() => {});
  };

  const value = useMemo(() => ({
    colorMode,
    colors: colorMode === 'light' ? LIGHT_COLORS : DARK_COLORS,
    setColorMode,
    toggleColorMode: () => setColorMode(colorMode === 'light' ? 'dark' : 'light'),
  }), [colorMode]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
