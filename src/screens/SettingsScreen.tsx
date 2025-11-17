import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import { Card, Button } from '../components';
import { useProgressStore } from '../store/progressStore';
import { useAchievementStore } from '../store/achievementStore';
import { useReviewStore } from '../store/reviewStore';
import { useSettingsStore } from '../store/settingsStore';
import { useTheme } from '../theme/ThemeContext';

interface SettingsScreenProps {
  onBack: () => void;
  onPrivacyPolicyPress: () => void;
  onTermsOfServicePress: () => void;
  initialScrollY?: number;
  onScrollPositionChange?: (scrollY: number) => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  onBack,
  onPrivacyPolicyPress,
  onTermsOfServicePress,
  initialScrollY = 0,
  onScrollPositionChange,
}) => {
  const { resetProgress, totalXP, level } = useProgressStore();
  const { achievements, resetAchievements } = useAchievementStore();
  const { reviewItems, resetReviews } = useReviewStore();
  const { colors } = useTheme();
  const {
    audioEnabled,
    soundEffectsEnabled,
    notificationsEnabled,
    dailyReminderEnabled,
    developerModeEnabled,
    darkModeEnabled,
    setAudioEnabled,
    setSoundEffectsEnabled,
    setNotificationsEnabled,
    setDailyReminderEnabled,
    setDeveloperModeEnabled,
    setDarkModeEnabled,
  } = useSettingsStore();

  const [versionTapCount, setVersionTapCount] = useState(0);
  const [lastTapTime, setLastTapTime] = useState(0);
  const [showResetConfirmation, setShowResetConfirmation] = useState(false);
  const [showImportConfirmation, setShowImportConfirmation] = useState(false);
  const [pendingImportData, setPendingImportData] = useState<any>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const currentScrollY = useRef(0);

  // Restore scroll position when component mounts
  React.useEffect(() => {
    if (initialScrollY > 0 && scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({ y: initialScrollY, animated: false });
      }, 100);
    }
  }, []);

  const handlePrivacyPress = () => {
    // Save current scroll position before navigating
    onScrollPositionChange?.(currentScrollY.current);
    onPrivacyPolicyPress();
  };

  const handleTermsPress = () => {
    // Save current scroll position before navigating
    onScrollPositionChange?.(currentScrollY.current);
    onTermsOfServicePress();
  };

  const handleVersionTap = () => {
    const now = Date.now();
    const timeSinceLastTap = now - lastTapTime;

    // Reset counter if more than 1 second has passed since last tap
    if (timeSinceLastTap > 1000) {
      setVersionTapCount(1);
    } else {
      const newCount = versionTapCount + 1;
      setVersionTapCount(newCount);

      if (newCount === 5) {
        // Toggle developer mode
        const newDevMode = !developerModeEnabled;
        setDeveloperModeEnabled(newDevMode);
        setVersionTapCount(0);

        Alert.alert(
          newDevMode ? 'Developer Mode Enabled' : 'Developer Mode Disabled',
          newDevMode
            ? 'All lessons are now unlocked for testing. Progress will not be saved and XP/achievements will not be earned.'
            : 'Developer mode has been disabled. Normal progress tracking resumed.',
          [{ text: 'OK' }]
        );
      }
    }

    setLastTapTime(now);
  };

  const handleResetProgress = () => {
    console.log('Reset button clicked');
    setShowResetConfirmation(true);
  };

  const confirmReset = async () => {
    console.log('Reset confirmed - starting reset');
    // Reset all stores
    resetProgress();
    resetAchievements();
    resetReviews();

    // Also reset onboarding flag
    try {
      await AsyncStorage.removeItem('copticlingo-onboarding-complete');
      console.log('Onboarding flag cleared');
    } catch (e) {
      console.warn('Failed to reset onboarding:', e);
    }
    console.log('All stores reset');
    setShowResetConfirmation(false);

    // Automatically reload the page/app
    if (typeof window !== 'undefined' && window.location) {
      // Web - reload the page
      window.location.reload();
    } else {
      // Mobile - show alert (can't auto-reload on native)
      Alert.alert('Progress Reset', 'Your progress has been reset successfully. Please restart the app.');
    }
  };

  const cancelReset = () => {
    console.log('Reset cancelled');
    setShowResetConfirmation(false);
  };

  const handleExportProgress = async () => {
    try {
      // Gather all data from AsyncStorage
      const progressData = await AsyncStorage.getItem('copticlingo-progress');
      const achievementsData = await AsyncStorage.getItem('copticlingo-achievements');
      const reviewsData = await AsyncStorage.getItem('copticlingo-reviews');
      const settingsData = await AsyncStorage.getItem('copticlingo-settings');
      const onboardingData = await AsyncStorage.getItem('copticlingo-onboarding-complete');
      const unitTestProgressData = await AsyncStorage.getItem('copticlingo-unit-test-progress');
      const unitTestHistoryData = await AsyncStorage.getItem('copticlingo-unit-test-history');

      const exportData = {
        version: '1.0.0',
        exportDate: new Date().toISOString(),
        progress: progressData ? JSON.parse(progressData) : null,
        achievements: achievementsData ? JSON.parse(achievementsData) : null,
        reviews: reviewsData ? JSON.parse(reviewsData) : null,
        settings: settingsData ? JSON.parse(settingsData) : null,
        onboardingComplete: onboardingData === 'true',
        unitTestProgress: unitTestProgressData ? JSON.parse(unitTestProgressData) : null,
        unitTestHistory: unitTestHistoryData ? JSON.parse(unitTestHistoryData) : null,
      };

      const jsonString = JSON.stringify(exportData, null, 2);
      const fileName = `copticlingo-backup-${new Date().toISOString().split('T')[0]}.json`;

      if (Platform.OS === 'web') {
        // Web: Download as file
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        Alert.alert('Export Successful', `Your progress has been downloaded as ${fileName}`);
      } else {
        // Mobile: Save to file system and share
        const fileUri = `${FileSystem.documentDirectory}${fileName}`;
        await FileSystem.writeAsStringAsync(fileUri, jsonString);

        const isAvailable = await Sharing.isAvailableAsync();
        if (isAvailable) {
          await Sharing.shareAsync(fileUri);
        } else {
          Alert.alert('Export Successful', `Progress saved to ${fileUri}`);
        }
      }
    } catch (error) {
      console.error('Export failed:', error);
      Alert.alert('Export Failed', 'Unable to export progress. Please try again.');
    }
  };

  const handleImportProgress = async () => {
    try {
      let jsonString: string | null = null;

      if (Platform.OS === 'web') {
        // Web: File input
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';

        input.onchange = async (e: any) => {
          const file = e.target.files[0];
          if (!file) return;

          const reader = new FileReader();
          reader.onload = async (event) => {
            jsonString = event.target?.result as string;
            await processImport(jsonString);
          };
          reader.readAsText(file);
        };

        input.click();
      } else {
        // Mobile: Document picker
        const result = await DocumentPicker.getDocumentAsync({
          type: 'application/json',
          copyToCacheDirectory: true,
        });

        if (result.assets && result.assets.length > 0) {
          const fileUri = result.assets[0].uri;
          jsonString = await FileSystem.readAsStringAsync(fileUri);
          await processImport(jsonString);
        }
      }
    } catch (error) {
      console.error('Import failed:', error);
      Alert.alert('Import Failed', 'Unable to import progress. Please check the file and try again.');
    }
  };

  const processImport = async (jsonString: string) => {
    try {
      console.log('Processing import, jsonString length:', jsonString?.length);
      const importData = JSON.parse(jsonString);
      console.log('Import data parsed:', Object.keys(importData));

      // Validate the import data
      if (!importData.version || !importData.exportDate) {
        console.error('Invalid import data:', importData);
        Alert.alert('Invalid File', 'The selected file is not a valid CopticLingo backup.');
        return;
      }

      console.log('Import data validated, showing confirmation...');

      // Store the import data and show confirmation modal
      setPendingImportData(importData);
      setShowImportConfirmation(true);
    } catch (error) {
      Alert.alert('Invalid File', 'The selected file is not valid JSON or is corrupted.');
    }
  };

  const handleConfirmImport = async () => {
    if (!pendingImportData) return;

    setShowImportConfirmation(false);

    try {
      console.log('User confirmed import, starting data restore...');
      // Import all data
      if (pendingImportData.progress) {
        await AsyncStorage.setItem('copticlingo-progress', JSON.stringify(pendingImportData.progress));
        console.log('Progress restored');
      }
      if (pendingImportData.achievements) {
        await AsyncStorage.setItem('copticlingo-achievements', JSON.stringify(pendingImportData.achievements));
        console.log('Achievements restored');
      }
      if (pendingImportData.reviews) {
        await AsyncStorage.setItem('copticlingo-reviews', JSON.stringify(pendingImportData.reviews));
        console.log('Reviews restored');
      }
      if (pendingImportData.settings) {
        await AsyncStorage.setItem('copticlingo-settings', JSON.stringify(pendingImportData.settings));
        console.log('Settings restored');
      }
      if (pendingImportData.onboardingComplete) {
        await AsyncStorage.setItem('copticlingo-onboarding-complete', 'true');
        console.log('Onboarding status restored');
      }
      if (pendingImportData.unitTestProgress) {
        await AsyncStorage.setItem('copticlingo-unit-test-progress', JSON.stringify(pendingImportData.unitTestProgress));
        console.log('Unit test progress restored');
      }
      if (pendingImportData.unitTestHistory) {
        await AsyncStorage.setItem('copticlingo-unit-test-history', JSON.stringify(pendingImportData.unitTestHistory));
        console.log('Unit test history restored');
      }

      console.log('All data restored successfully');

      // Reload the page
      if (typeof window !== 'undefined' && window.location) {
        window.location.reload();
      }
    } catch (error) {
      console.error('Import processing failed:', error);
      Alert.alert('Import Failed', 'An error occurred while importing your progress.');
    }
  };

  const handleCancelImport = () => {
    console.log('Import cancelled by user');
    setShowImportConfirmation(false);
    setPendingImportData(null);
  };

  const unlockedAchievementsCount = achievements.filter(a => a.unlocked).length;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingTop: 60,
      paddingBottom: 20,
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    backButton: {
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
    },
    backIcon: {
      fontSize: 24,
      color: colors.textPrimary,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.textPrimary,
    },
    placeholder: {
      width: 40,
    },
    content: {
      flex: 1,
    },
    scrollContent: {
      padding: 20,
    },
    section: {
      padding: 20,
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.textPrimary,
      marginBottom: 16,
    },
    infoRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 8,
    },
    infoLabel: {
      fontSize: 16,
      color: colors.textSecondary,
    },
    infoValue: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.textPrimary,
    },
    settingRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 8,
    },
    settingInfo: {
      flex: 1,
      marginRight: 16,
    },
    settingLabel: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.textPrimary,
      marginBottom: 4,
    },
    settingDescription: {
      fontSize: 14,
      color: colors.textTertiary,
      lineHeight: 18,
    },
    actionRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 8,
    },
    actionInfo: {
      flex: 1,
    },
    actionLabel: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.textPrimary,
      marginBottom: 4,
    },
    actionDescription: {
      fontSize: 14,
      color: colors.textTertiary,
    },
    actionArrow: {
      fontSize: 24,
      color: colors.textDisabled,
    },
    divider: {
      height: 1,
      backgroundColor: colors.border,
      marginVertical: 12,
    },
    dangerSection: {
      borderWidth: 2,
      borderColor: '#fecaca',
      backgroundColor: '#fef2f2',
    },
    dangerTitle: {
      color: '#dc2626',
    },
    dangerButton: {
      borderColor: '#ef4444',
      backgroundColor: colors.surface,
    },
    dangerWarning: {
      fontSize: 12,
      color: '#991b1b',
      textAlign: 'center',
      marginTop: 12,
      lineHeight: 16,
    },
    dataManagementInfo: {
      fontSize: 12,
      color: colors.textTertiary,
      textAlign: 'center',
      marginTop: 12,
      lineHeight: 16,
    },
    footerTextContainer: {
      alignItems: 'center',
      paddingVertical: 32,
      paddingHorizontal: 20,
    },
    footerText: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 22,
    },
    footer: {
      height: 40,
    },
    modalOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    },
    modalContent: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 24,
      width: '90%',
      maxWidth: 400,
      borderWidth: 2,
      borderColor: colors.border,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.textPrimary,
      marginBottom: 16,
      textAlign: 'center',
    },
    modalMessage: {
      fontSize: 15,
      color: colors.textPrimary,
      lineHeight: 22,
      marginBottom: 24,
    },
    modalButtons: {
      flexDirection: 'row',
      gap: 12,
    },
    modalButtonCancel: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 8,
      backgroundColor: colors.surface,
      borderWidth: 2,
      borderColor: colors.border,
    },
    modalButtonConfirm: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 8,
      backgroundColor: colors.error,
    },
    modalButtonTextCancel: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.textPrimary,
      textAlign: 'center',
    },
    modalButtonTextConfirm: {
      fontSize: 16,
      fontWeight: '600',
      color: '#FFFFFF',
      textAlign: 'center',
    },
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        onScroll={(event) => {
          currentScrollY.current = event.nativeEvent.contentOffset.y;
        }}
        scrollEventThrottle={16}
      >
        {/* Account Info */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Account Summary</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Current Level</Text>
            <Text style={styles.infoValue}>Level {level}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Total XP</Text>
            <Text style={styles.infoValue}>{totalXP} XP</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Achievements Unlocked</Text>
            <Text style={styles.infoValue}>
              {unlockedAchievementsCount} / {achievements.length}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Review Items</Text>
            <Text style={styles.infoValue}>{reviewItems.length}</Text>
          </View>
        </Card>

        {/* Audio & Sound */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Dark Mode</Text>
              <Text style={styles.settingDescription}>
                Use dark theme for reduced eye strain
              </Text>
            </View>
            <Switch
              value={darkModeEnabled}
              onValueChange={setDarkModeEnabled}
              trackColor={{ false: '#d1d5db', true: '#86efac' }}
              thumbColor={darkModeEnabled ? '#22c55e' : '#f3f4f6'}
            />
          </View>
        </Card>

        {/* Audio & Sound */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Audio & Sound</Text>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Audio Enabled</Text>
              <Text style={styles.settingDescription}>
                Enable audio for pronunciation and listening exercises
              </Text>
            </View>
            <Switch
              value={audioEnabled}
              onValueChange={setAudioEnabled}
              trackColor={{ false: '#d1d5db', true: '#86efac' }}
              thumbColor={audioEnabled ? '#22c55e' : '#f3f4f6'}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Sound Effects</Text>
              <Text style={styles.settingDescription}>Play sounds for correct/incorrect answers</Text>
            </View>
            <Switch
              value={soundEffectsEnabled}
              onValueChange={setSoundEffectsEnabled}
              trackColor={{ false: '#d1d5db', true: '#86efac' }}
              thumbColor={soundEffectsEnabled ? '#22c55e' : '#f3f4f6'}
            />
          </View>
        </Card>

        {/* Notifications */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Daily Reminders</Text>
              <Text style={styles.settingDescription}>
                Remind me to practice Coptic every day
              </Text>
            </View>
            <Switch
              value={dailyReminderEnabled}
              onValueChange={setDailyReminderEnabled}
              trackColor={{ false: '#d1d5db', true: '#86efac' }}
              thumbColor={dailyReminderEnabled ? '#22c55e' : '#f3f4f6'}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Achievement Notifications</Text>
              <Text style={styles.settingDescription}>
                Show notifications when unlocking achievements
              </Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#d1d5db', true: '#86efac' }}
              thumbColor={notificationsEnabled ? '#22c55e' : '#f3f4f6'}
            />
          </View>
        </Card>

        {/* Learning Settings */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Learning</Text>

          <TouchableOpacity style={styles.actionRow}>
            <View style={styles.actionInfo}>
              <Text style={styles.actionLabel}>Daily Goal</Text>
              <Text style={styles.actionDescription}>Set your daily XP target</Text>
            </View>
            <Text style={styles.actionArrow}>›</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.actionRow}>
            <View style={styles.actionInfo}>
              <Text style={styles.actionLabel}>Review Settings</Text>
              <Text style={styles.actionDescription}>Customize spaced repetition intervals</Text>
            </View>
            <Text style={styles.actionArrow}>›</Text>
          </TouchableOpacity>
        </Card>

        {/* Data Management */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Data Management</Text>

          <Button
            title="Export Progress"
            onPress={handleExportProgress}
            variant="secondary"
            fullWidth
            style={{ marginBottom: 12 }}
          />

          <Button
            title="Import Progress"
            onPress={handleImportProgress}
            variant="secondary"
            fullWidth
          />

          <Text style={styles.dataManagementInfo}>
            Export your progress to backup or transfer to another device. Import to restore from a previous backup.
          </Text>
        </Card>

        {/* Danger Zone */}
        <Card style={[styles.section, styles.dangerSection]}>
          <Text style={[styles.sectionTitle, styles.dangerTitle]}>Danger Zone</Text>

          <Button
            title="Reset All Progress"
            onPress={handleResetProgress}
            variant="secondary"
            fullWidth
            style={styles.dangerButton}
          />

          <Text style={styles.dangerWarning}>
            This will permanently delete all your progress, achievements, and data.
          </Text>
        </Card>

        {/* About */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>

          <TouchableOpacity style={styles.actionRow} onPress={handleVersionTap}>
            <View style={styles.actionInfo}>
              <Text style={styles.actionLabel}>Version</Text>
              <Text style={styles.actionDescription}>
                1.0.0{developerModeEnabled ? ' (Developer Mode)' : ''}
              </Text>
            </View>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.actionRow} onPress={handlePrivacyPress}>
            <View style={styles.actionInfo}>
              <Text style={styles.actionLabel}>Privacy Policy</Text>
            </View>
            <Text style={styles.actionArrow}>›</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.actionRow} onPress={handleTermsPress}>
            <View style={styles.actionInfo}>
              <Text style={styles.actionLabel}>Terms of Service</Text>
            </View>
            <Text style={styles.actionArrow}>›</Text>
          </TouchableOpacity>
        </Card>

        {/* Footer */}
        <View style={styles.footerTextContainer}>
          <Text style={styles.footerText}>Designed by Martin B.</Text>
          <Text style={styles.footerText}>Made with ❤️ in California</Text>
        </View>

        {/* Footer spacing */}
        <View style={styles.footer} />
      </ScrollView>

      {/* Reset Confirmation Modal */}
      {showResetConfirmation && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Reset All Progress?</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to reset all your progress? This will delete:{'\n\n'}
              • All completed lessons{'\n'}
              • XP and level{'\n'}
              • Streaks{'\n'}
              • Achievements{'\n'}
              • Review history{'\n'}
              • Onboarding status{'\n\n'}
              This action cannot be undone!
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButtonCancel} onPress={cancelReset}>
                <Text style={styles.modalButtonTextCancel}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButtonConfirm} onPress={confirmReset}>
                <Text style={styles.modalButtonTextConfirm}>Reset</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Import Confirmation Modal */}
      {showImportConfirmation && pendingImportData && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Import Progress?</Text>
            <Text style={styles.modalMessage}>
              This will replace your current progress with data from{'\n'}
              {new Date(pendingImportData.exportDate).toLocaleDateString()}.{'\n\n'}
              Your current progress will be lost. Continue?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButtonCancel} onPress={handleCancelImport}>
                <Text style={styles.modalButtonTextCancel}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButtonConfirm} onPress={handleConfirmImport}>
                <Text style={styles.modalButtonTextConfirm}>Import</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};
