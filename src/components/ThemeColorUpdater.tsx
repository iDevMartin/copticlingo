import { useEffect } from 'react';
import { useTheme } from '../theme/ThemeContext';

export const ThemeColorUpdater = () => {
  const { colors, isDark } = useTheme();

  useEffect(() => {
    // Update theme-color meta tags for web PWA
    if (typeof document !== 'undefined') {
      // Update both light and dark theme-color meta tags
      const metaThemeColorDark = document.querySelector('meta[name="theme-color"][media="(prefers-color-scheme: dark)"]');
      const metaThemeColorLight = document.querySelector('meta[name="theme-color"][media="(prefers-color-scheme: light)"]');

      if (metaThemeColorDark) {
        metaThemeColorDark.setAttribute('content', isDark ? colors.surface : '#1f2937');
      }
      if (metaThemeColorLight) {
        metaThemeColorLight.setAttribute('content', isDark ? '#FFFFFF' : colors.surface);
      }

      console.log(`[ThemeColorUpdater] Updated theme-color to: ${colors.surface} (isDark: ${isDark})`);
    }
  }, [colors.surface, isDark]);

  return null;
};
