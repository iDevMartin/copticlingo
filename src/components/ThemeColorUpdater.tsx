import { useEffect } from 'react';
import { useTheme } from '../theme/ThemeContext';

export const ThemeColorUpdater = () => {
  const { colors } = useTheme();

  useEffect(() => {
    // Update theme-color meta tag for web PWA
    if (typeof document !== 'undefined') {
      const metaThemeColor = document.querySelector('meta[name="theme-color"]');
      if (metaThemeColor) {
        metaThemeColor.setAttribute('content', colors.surface);
      }
    }
  }, [colors.surface]);

  return null;
};
