import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Card } from '../components';
import { useProgressStore } from '../store/progressStore';
import { useAchievementStore } from '../store/achievementStore';

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

  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const xpToNextLevel = (level * 100) - (totalXP % 100);

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  backButton: {
    padding: 8,
  },
  backText: {
    fontSize: 16,
    color: '#58CC02',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#3C3C3C',
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
  },
  levelContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  levelEmoji: {
    fontSize: 48,
    marginRight: 16,
  },
  levelInfo: {
    flex: 1,
  },
  levelTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#3C3C3C',
  },
  levelSubtitle: {
    fontSize: 16,
    color: '#58CC02',
    fontWeight: '600',
    marginTop: 4,
  },
  levelProgress: {
    fontSize: 14,
    color: '#777777',
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    padding: 20,
  },
  statEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#3C3C3C',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#777777',
    fontWeight: '600',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#3C3C3C',
    marginBottom: 16,
  },
  achievementsGrid: {
    gap: 12,
  },
  achievementCard: {
    position: 'relative',
    padding: 20,
  },
  lockedAchievement: {
    opacity: 0.5,
  },
  achievementIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#3C3C3C',
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 14,
    color: '#777777',
  },
  unlockedBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#58CC02',
    alignItems: 'center',
    justifyContent: 'center',
  },
  unlockedText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
