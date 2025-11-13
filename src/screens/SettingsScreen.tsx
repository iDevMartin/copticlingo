import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { Card, Button } from '../components';
import { useProgressStore } from '../store/progressStore';
import { useAchievementStore } from '../store/achievementStore';
import { useReviewStore } from '../store/reviewStore';

interface SettingsScreenProps {
  onBack: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ onBack }) => {
  const { resetProgress, totalXP, level } = useProgressStore();
  const { achievements } = useAchievementStore();
  const { reviewItems } = useReviewStore();
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleResetProgress = () => {
    Alert.alert(
      'Reset All Progress',
      'Are you sure you want to reset all your progress? This will delete:\n\n• All completed lessons\n• XP and level\n• Streaks\n• Achievements\n• Review history\n\nThis action cannot be undone!',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            resetProgress();
            Alert.alert('Progress Reset', 'Your progress has been reset successfully.');
          },
        },
      ]
    );
  };

  const unlockedAchievementsCount = achievements.filter(a => a.unlocked).length;

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

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
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
              value={audioEnabled}
              onValueChange={setAudioEnabled}
              trackColor={{ false: '#d1d5db', true: '#86efac' }}
              thumbColor={audioEnabled ? '#22c55e' : '#f3f4f6'}
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
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#d1d5db', true: '#86efac' }}
              thumbColor={notificationsEnabled ? '#22c55e' : '#f3f4f6'}
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

        {/* About */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>

          <TouchableOpacity style={styles.actionRow}>
            <View style={styles.actionInfo}>
              <Text style={styles.actionLabel}>Version</Text>
              <Text style={styles.actionDescription}>1.0.0</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.actionRow}>
            <View style={styles.actionInfo}>
              <Text style={styles.actionLabel}>Privacy Policy</Text>
            </View>
            <Text style={styles.actionArrow}>›</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.actionRow}>
            <View style={styles.actionInfo}>
              <Text style={styles.actionLabel}>Terms of Service</Text>
            </View>
            <Text style={styles.actionArrow}>›</Text>
          </TouchableOpacity>
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

        {/* Footer spacing */}
        <View style={styles.footer} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 24,
    color: '#1f2937',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
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
    color: '#1f2937',
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
    color: '#4b5563',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
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
    color: '#1f2937',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#6b7280',
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
    color: '#1f2937',
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
  actionArrow: {
    fontSize: 24,
    color: '#9ca3af',
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
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
    backgroundColor: '#fff',
  },
  dangerWarning: {
    fontSize: 12,
    color: '#991b1b',
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 16,
  },
  footer: {
    height: 40,
  },
});
