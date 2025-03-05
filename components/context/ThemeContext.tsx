import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  setTheme: (theme: Theme) => void;
  colors: typeof lightColors;
}

const lightColors = {
  primary: '#00A86B',
  background: '#F7F7F7',
  card: '#E5E5E5',
  text: '#111111',
  border: '#D1D1D1',
  notification: '#FF3B30',
  secondaryText: '#444444',
  success: '#00A86B',
  primaryLight: '#33C17C',
  error: '#FF3B30',
  warning: '#FF9500',
  info: '#5B7FFF',
  overlay: 'rgba(0, 0, 0, 0.5)',
  cardHighlight: '#F0F9F6',
};

const darkColors = {
  primary: '#00C17C',
  background: '#121212',
  card: '#1E1E1E',
  text: '#FFFFFF',
  border: '#2C2C2C',
  notification: '#FF453A',
  secondaryText: '#A0A0A0',
  success: '#00C17C',
  primaryLight: '#33C1AF',
  error: '#FF453A',
  warning: '#FFB340',
  info: '#6E8FFF',
  overlay: 'rgba(0, 0, 0, 0.7)',
  cardHighlight: '#263B33',
};

const ThemeContext = createContext<ThemeContextType>({
  theme: 'system',
  isDark: false,
  setTheme: () => {},
  colors: lightColors,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [theme, setTheme] = useState<Theme>('system');

  const isDark =
    theme === 'dark' || (theme === 'system' && systemColorScheme === 'dark');
  const colors = isDark ? darkColors : lightColors;

  useEffect(() => {
    // Load saved theme preference from storage
    // For now, we'll just use system default
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, isDark, setTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
