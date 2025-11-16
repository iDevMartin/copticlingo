import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import { Button } from '../components';
import { useTheme } from '../theme/ThemeContext';

interface WelcomeScreenProps {
  onComplete: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onComplete }) => {
  const { colors } = useTheme();
  const [isMobileWeb, setIsMobileWeb] = useState(false);
  const [browserName, setBrowserName] = useState<'safari' | 'chrome' | 'other'>('other');

  useEffect(() => {
    // Detect if on mobile web
    if (Platform.OS === 'web') {
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobile = /iphone|ipad|ipod|android/.test(userAgent);
      setIsMobileWeb(isMobile);

      // Detect browser
      if (/safari/.test(userAgent) && !/chrome/.test(userAgent)) {
        setBrowserName('safari');
      } else if (/chrome/.test(userAgent)) {
        setBrowserName('chrome');
      }
    }
  }, []);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContent: {
      flexGrow: 1,
      justifyContent: 'center',
      padding: 24,
    },
    content: {
      alignItems: 'center',
    },
    title: {
      fontSize: 32,
      fontWeight: '700',
      color: colors.textPrimary,
      textAlign: 'center',
      marginBottom: 8,
    },
    copticTitle: {
      fontSize: 28,
      fontWeight: '700',
      color: colors.primary,
      textAlign: 'center',
      marginBottom: 48,
    },
    infoBox: {
      flexDirection: 'row',
      alignItems: 'center',
      width: '100%',
      backgroundColor: colors.surface,
      padding: 20,
      borderRadius: 16,
      marginBottom: 16,
      borderWidth: 2,
      borderColor: colors.border,
    },
    emoji: {
      fontSize: 32,
      marginRight: 16,
    },
    infoText: {
      flex: 1,
      fontSize: 16,
      color: colors.textPrimary,
      lineHeight: 22,
    },
    pwaBox: {
      width: '100%',
      backgroundColor: '#10B98120',
      padding: 20,
      borderRadius: 16,
      marginBottom: 16,
      borderWidth: 2,
      borderColor: colors.primary,
    },
    pwaTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.primary,
      marginBottom: 12,
      textAlign: 'center',
    },
    pwaText: {
      fontSize: 14,
      color: colors.textPrimary,
      lineHeight: 20,
      marginBottom: 8,
    },
    pwaHighlight: {
      fontWeight: '700',
      color: colors.primary,
    },
    pwaSteps: {
      marginTop: 12,
      paddingLeft: 8,
    },
    pwaStep: {
      fontSize: 14,
      color: colors.textPrimary,
      lineHeight: 22,
      marginBottom: 4,
    },
  });

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text style={styles.title}>Welcome to CopticLingo!</Text>
          <Text style={styles.copticTitle}>Ⲙⲁⲣⲉⲛϭⲓⲥⲃⲱ!</Text>

          {/* PWA Installation Banner for Mobile Web */}
          {isMobileWeb && (
            <View style={styles.pwaBox}>
              <Text style={styles.pwaTitle}>📱 Install for Offline Access!</Text>
              <Text style={styles.pwaText}>
                Add CopticLingo to your home screen to:{'\n'}
                • <Text style={styles.pwaHighlight}>Use the app offline</Text>{'\n'}
                • Launch like a native app{'\n'}
                • Get faster loading times
              </Text>
              <View style={styles.pwaSteps}>
                {browserName === 'safari' ? (
                  <>
                    <Text style={styles.pwaStep}>1. Tap the Share button <Text style={styles.pwaHighlight}>⎆</Text></Text>
                    <Text style={styles.pwaStep}>2. Scroll and tap <Text style={styles.pwaHighlight}>"Add to Home Screen"</Text></Text>
                    <Text style={styles.pwaStep}>3. Tap <Text style={styles.pwaHighlight}>"Add"</Text></Text>
                  </>
                ) : browserName === 'chrome' ? (
                  <>
                    <Text style={styles.pwaStep}>1. Tap the menu <Text style={styles.pwaHighlight}>⋮</Text></Text>
                    <Text style={styles.pwaStep}>2. Tap <Text style={styles.pwaHighlight}>"Add to Home screen"</Text></Text>
                    <Text style={styles.pwaStep}>3. Tap <Text style={styles.pwaHighlight}>"Add"</Text></Text>
                  </>
                ) : (
                  <Text style={styles.pwaStep}>Look for <Text style={styles.pwaHighlight}>"Add to Home screen"</Text> in your browser menu</Text>
                )}
              </View>
            </View>
          )}

          <View style={styles.infoBox}>
            <Text style={styles.emoji}>📚</Text>
            <Text style={styles.infoText}>
              Learn the ancient Coptic language through interactive lessons
            </Text>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.emoji}>🎯</Text>
            <Text style={styles.infoText}>
              Practice with fun exercises and track your progress
            </Text>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.emoji}>🔥</Text>
            <Text style={styles.infoText}>
              Build daily streaks and earn achievements
            </Text>
          </View>

          <Button
            title="Start Learning"
            onPress={onComplete}
            fullWidth
            style={{ marginTop: 32 }}
          />
        </View>
      </ScrollView>
    </View>
  );
};

