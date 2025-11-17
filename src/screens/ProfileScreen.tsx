import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Card } from '../components';
import { useProgressStore } from '../store/progressStore';
import { useAchievementStore } from '../store/achievementStore';
import { useTheme } from '../theme/ThemeContext';

interface ProfileScreenProps {
  onBack: () => void;
  onSettingsPress: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ onBack, onSettingsPress }) => {
  const {
    totalXP,
    level,
    currentStreak,
    longestStreak,
    completedLessons,
    vocabularyLearned,
  } = useProgressStore();
  const { achievements } = useAchievementStore();
  const { colors } = useTheme();

  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const xpToNextLevel = (level * 100) - (totalXP % 100);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 20,
      paddingTop: 60,
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    backButton: {
      padding: 8,
    },
    backText: {
      fontSize: 16,
      color: colors.primary,
      fontWeight: '600',
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.textPrimary,
    },
    settingsButton: {
      padding: 8,
    },
    settingsIcon: {
      fontSize: 24,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      padding: 20,
    },
    levelCard: {
      marginBottom: 20,
      padding: 24,
    },
    levelContent: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    levelEmoji: {
      fontSize: 60,
      marginRight: 20,
    },
    levelInfo: {
      flex: 1,
    },
    levelTitle: {
      fontSize: 32,
      fontWeight: '700',
      color: colors.textPrimary,
      marginBottom: 4,
    },
    levelSubtitle: {
      fontSize: 16,
      color: colors.primary,
      fontWeight: '600',
      marginBottom: 4,
    },
    levelProgress: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    statsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
      marginBottom: 32,
    },
    statCard: {
      flex: 1,
      minWidth: '45%',
      alignItems: 'center',
      padding: 20,
    },
    statEmoji: {
      fontSize: 36,
      marginBottom: 8,
    },
    statValue: {
      fontSize: 28,
      fontWeight: '700',
      color: colors.textPrimary,
      marginBottom: 4,
    },
    statLabel: {
      fontSize: 14,
      color: colors.textSecondary,
      fontWeight: '600',
    },
    section: {
      marginBottom: 32,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.textPrimary,
      marginBottom: 16,
    },
    achievementsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
    },
    achievementCard: {
      flex: 1,
      minWidth: '45%',
      padding: 16,
      alignItems: 'center',
      position: 'relative',
    },
    lockedAchievement: {
      opacity: 0.5,
    },
    achievementIcon: {
      fontSize: 40,
      marginBottom: 8,
    },
    achievementTitle: {
      fontSize: 14,
      fontWeight: '700',
      color: colors.textPrimary,
      textAlign: 'center',
      marginBottom: 4,
    },
    achievementDescription: {
      fontSize: 12,
      color: colors.textSecondary,
      textAlign: 'center',
    },
    unlockedBadge: {
      position: 'absolute',
      top: 8,
      right: 8,
      backgroundColor: colors.success,
      borderRadius: 12,
      width: 24,
      height: 24,
      justifyContent: 'center',
      alignItems: 'center',
    },
    unlockedText: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: '700',
    },
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity onPress={onSettingsPress} style={styles.settingsButton}>
          <Text style={styles.settingsIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Level Card */}
        <Card style={styles.levelCard}>
          <View style={styles.levelContent}>
            <Text style={styles.levelEmoji}>🎓</Text>
            <View style={styles.levelInfo}>
              <Text style={styles.levelTitle}>Level {level}</Text>
              <Text style={styles.levelSubtitle}>{totalXP} XP Total</Text>
              <Text style={styles.levelProgress}>{xpToNextLevel} XP to next level</Text>
            </View>
          </View>
        </Card>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <Card style={styles.statCard}>
            <Text style={styles.statEmoji}>🔥</Text>
            <Text style={styles.statValue}>{currentStreak}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </Card>

          <Card style={styles.statCard}>
            <Text style={styles.statEmoji}>📚</Text>
            <Text style={styles.statValue}>{completedLessons.length}</Text>
            <Text style={styles.statLabel}>Lessons</Text>
          </Card>

          <Card style={styles.statCard}>
            <Text style={styles.statEmoji}>⚡</Text>
            <Text style={styles.statValue}>{longestStreak}</Text>
            <Text style={styles.statLabel}>Best Streak</Text>
          </Card>

          <Card style={styles.statCard}>
            <Text style={styles.statEmoji}>📖</Text>
            <Text style={styles.statValue}>{vocabularyLearned.length}</Text>
            <Text style={styles.statLabel}>Words</Text>
          </Card>
        </View>

        {/* Achievements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Achievements ({unlockedAchievements.length}/{achievements.length})
          </Text>

          <View style={styles.achievementsGrid}>
            {achievements.map(achievement => (
              <Card
                key={achievement.id}
                style={[
                  styles.achievementCard,
                  !achievement.unlocked && styles.lockedAchievement,
                ]}
              >
                <Text style={styles.achievementIcon}>{achievement.icon}</Text>
                <Text style={styles.achievementTitle}>{achievement.title}</Text>
                <Text style={styles.achievementDescription}>{achievement.description}</Text>
                {achievement.unlocked && (
                  <View style={styles.unlockedBadge}>
                    <Text style={styles.unlockedText}>✓</Text>
                  </View>
                )}
              </Card>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

