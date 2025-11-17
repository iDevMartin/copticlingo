import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { SwipeBackScreen } from '../components/SwipeBackScreen';

interface PrivacyPolicyScreenProps {
  onBack: () => void;
}

export const PrivacyPolicyScreen: React.FC<PrivacyPolicyScreenProps> = ({ onBack }) => {
  const { colors } = useTheme();

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
    title: {
      fontSize: 28,
      fontWeight: '700',
      color: colors.textPrimary,
      marginBottom: 8,
    },
    lastUpdated: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 24,
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.textPrimary,
      marginBottom: 12,
    },
    paragraph: {
      fontSize: 16,
      color: colors.textPrimary,
      lineHeight: 24,
      marginBottom: 12,
    },
    bulletPoint: {
      fontSize: 16,
      color: colors.textPrimary,
      lineHeight: 24,
      marginBottom: 8,
      paddingLeft: 16,
    },
    footer: {
      height: 40,
    },
  });

  return (
    <SwipeBackScreen onSwipeBack={onBack}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Privacy Policy</Text>
        <Text style={styles.lastUpdated}>Last Updated: November 16, 2025</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Introduction</Text>
          <Text style={styles.paragraph}>
            CopticLingo is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our language learning application.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Information We Collect</Text>
          <Text style={styles.paragraph}>
            CopticLingo collects and stores the following information locally on your device:
          </Text>
          <Text style={styles.bulletPoint}>• Learning Progress: Completed lessons, XP points, current level, and lesson completion dates</Text>
          <Text style={styles.bulletPoint}>• Practice Data: Review history, spaced repetition schedules, and performance on exercises</Text>
          <Text style={styles.bulletPoint}>• Achievements: Unlocked badges, streaks, and milestones</Text>
          <Text style={styles.bulletPoint}>• Settings: Audio preferences, notification settings, theme preferences, and other app configurations</Text>
          <Text style={styles.bulletPoint}>• Unit Test Results: Performance and completion status of unit assessments</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How We Use Your Information</Text>
          <Text style={styles.paragraph}>
            Your information is used exclusively to:
          </Text>
          <Text style={styles.bulletPoint}>• Track your learning progress and maintain your lesson history</Text>
          <Text style={styles.bulletPoint}>• Provide personalized learning experiences through spaced repetition</Text>
          <Text style={styles.bulletPoint}>• Display your achievements, level, and XP</Text>
          <Text style={styles.bulletPoint}>• Remember your preferences and settings</Text>
          <Text style={styles.bulletPoint}>• Enable progress export and import functionality</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Storage</Text>
          <Text style={styles.paragraph}>
            All your data is stored locally on your device using AsyncStorage. We do not transmit your personal learning data to external servers. Your progress and settings remain private and under your control.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Analytics</Text>
          <Text style={styles.paragraph}>
            We use Vercel Analytics to collect anonymous usage statistics for the web version of CopticLingo. This helps us understand how the app is used and improve the user experience. Analytics data does not include any personally identifiable information or your learning progress.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Export and Import</Text>
          <Text style={styles.paragraph}>
            CopticLingo provides tools to export your progress data as a JSON file. This file contains all your learning data and can be used to:
          </Text>
          <Text style={styles.bulletPoint}>• Create backups of your progress</Text>
          <Text style={styles.bulletPoint}>• Transfer your progress between devices</Text>
          <Text style={styles.bulletPoint}>• Keep a personal record of your learning journey</Text>
          <Text style={styles.paragraph}>
            Exported files are stored locally on your device and are only accessible to you. We recommend keeping these files secure.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Third-Party Services</Text>
          <Text style={styles.paragraph}>
            CopticLingo may use the following third-party services:
          </Text>
          <Text style={styles.bulletPoint}>• Vercel Analytics (web version only) - for anonymous usage analytics</Text>
          <Text style={styles.bulletPoint}>• Expo - for mobile app framework and updates</Text>
          <Text style={styles.paragraph}>
            These services have their own privacy policies and may collect limited, anonymous data.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Children's Privacy</Text>
          <Text style={styles.paragraph}>
            CopticLingo is suitable for all ages. We do not knowingly collect personal information from children. All data is stored locally on the device and is not transmitted to external servers.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Retention and Deletion</Text>
          <Text style={styles.paragraph}>
            You have complete control over your data:
          </Text>
          <Text style={styles.bulletPoint}>• Your data remains on your device until you choose to delete it</Text>
          <Text style={styles.bulletPoint}>• You can reset all progress through Settings → Danger Zone → Reset All Progress</Text>
          <Text style={styles.bulletPoint}>• Uninstalling the app will remove all locally stored data</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Changes to This Privacy Policy</Text>
          <Text style={styles.paragraph}>
            We may update this Privacy Policy from time to time. We will notify you of any changes by updating the "Last Updated" date at the top of this policy. Continued use of CopticLingo after changes constitutes acceptance of the updated policy.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Us</Text>
          <Text style={styles.paragraph}>
            If you have any questions about this Privacy Policy, please contact us through our GitHub repository or email.
          </Text>
        </View>

        <View style={styles.footer} />
      </ScrollView>
    </View>
    </SwipeBackScreen>
  );
};
