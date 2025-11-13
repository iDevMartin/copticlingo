import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LessonNode, Card } from '../components';
import { copticUnits } from '../data/lessons';
import { useProgressStore } from '../store/progressStore';

interface HomeScreenProps {
  onLessonPress: (lessonId: string) => void;
  onProfilePress: () => void;
  onReviewPress: () => void;
  onSettingsPress: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onLessonPress,
  onProfilePress,
  onReviewPress,
  onSettingsPress,
}) => {
  const { completedLessons, totalXP, currentStreak, level } = useProgressStore();

  const getLessonStatus = (lessonId: string, lessonOrder: number, unitLessons: any[]) => {
    const isCompleted = completedLessons.includes(lessonId);

    if (lessonOrder === 1) {
      return { locked: false, completed: isCompleted };
    }

    const previousLesson = unitLessons[lessonOrder - 2];
    const isPreviousCompleted = completedLessons.includes(previousLesson.id);

    return { locked: !isPreviousCompleted, completed: isCompleted };
  };

  const getUnitLocked = (unitOrder: number) => {
    if (unitOrder === 1) return false;

    const previousUnit = copticUnits[unitOrder - 2];
    const allPreviousLessonsCompleted = previousUnit.lessons.every(lesson =>
      completedLessons.includes(lesson.id)
    );

    return !allPreviousLessonsCompleted;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>CopticLingo</Text>
          <Text style={styles.headerSubtitle}>ⲙⲁⲣⲓ ⲉⲣϩⲱⲃ!</Text>
        </View>
        <Card style={styles.xpCard} onPress={onProfilePress}>
          <View style={styles.xpContent}>
            <Text style={styles.xpLabel}>Level {level}</Text>
            <Text style={styles.xpValue}>{totalXP} XP</Text>
          </View>
        </Card>
      </View>

      {/* Streak Banner */}
      {currentStreak > 0 && (
        <View style={styles.streakBanner}>
          <Text style={styles.streakEmoji}>🔥</Text>
          <Text style={styles.streakText}>{currentStreak} day streak!</Text>
        </View>
      )}

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.actionButton} onPress={onReviewPress}>
          <Text style={styles.actionIcon}>⚡</Text>
          <Text style={styles.actionLabel}>Practice</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={onSettingsPress}>
          <Text style={styles.actionIcon}>⚙️</Text>
          <Text style={styles.actionLabel}>Settings</Text>
        </TouchableOpacity>
      </View>

      {/* Skill Tree */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {copticUnits.map((unit) => {
          const unitLocked = getUnitLocked(unit.order);

          return (
            <View key={unit.id} style={styles.unitContainer}>
              <View style={styles.unitHeader}>
                <Text style={styles.unitTitle}>{unit.title}</Text>
                <Text style={styles.unitDescription}>{unit.description}</Text>
              </View>

              <View style={styles.lessonsContainer}>
                {unit.lessons.map((lesson) => {
                  const { locked, completed } = getLessonStatus(
                    lesson.id,
                    lesson.order,
                    unit.lessons
                  );

                  const isLocked = locked || unitLocked;
                  const isCurrent = !isLocked && !completed;

                  return (
                    <LessonNode
                      key={lesson.id}
                      title={lesson.title}
                      color={unit.color}
                      locked={isLocked}
                      completed={completed}
                      current={isCurrent}
                      onPress={() => !isLocked && onLessonPress(lesson.id)}
                    />
                  );
                })}
              </View>
            </View>
          );
        })}

        <View style={styles.bottomPadding} />
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
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#58CC02',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#777777',
    marginTop: 2,
  },
  xpCard: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  xpContent: {
    alignItems: 'center',
  },
  xpLabel: {
    fontSize: 12,
    color: '#777777',
    fontWeight: '600',
  },
  xpValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#58CC02',
  },
  streakBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFD700',
    paddingVertical: 12,
  },
  streakEmoji: {
    fontSize: 20,
    marginRight: 8,
  },
  streakText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#3C3C3C',
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
    backgroundColor: '#FFFFFF',
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  actionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  unitContainer: {
    marginBottom: 32,
  },
  unitHeader: {
    marginBottom: 16,
  },
  unitTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#3C3C3C',
    marginBottom: 4,
  },
  unitDescription: {
    fontSize: 14,
    color: '#777777',
  },
  lessonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  bottomPadding: {
    height: 40,
  },
});
