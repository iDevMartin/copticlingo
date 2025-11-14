import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { LessonNode, Card } from '../components';
import { copticUnits } from '../data/lessons';
import { useProgressStore } from '../store/progressStore';
import { useSettingsStore } from '../store/settingsStore';
import { useTheme } from '../theme/ThemeContext';

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
  const { developerModeEnabled } = useSettingsStore();
  const { colors } = useTheme();
  const [isSmallScreen, setIsSmallScreen] = useState(Dimensions.get('window').width < 500);

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setIsSmallScreen(window.width < 500);
    });
    return () => subscription?.remove();
  }, []);

  const handleDevModePress = () => {
    Alert.alert(
      'Developer Mode',
      'Developer/Debug mode is currently enabled.\n\n' +
      '• All lessons and units are unlocked\n' +
      '• Completed lessons do NOT count towards XP progress\n' +
      '• Achievements will NOT be unlocked\n\n' +
      'This mode is intended for testing and development purposes only. ' +
      'Disable it in Settings to track your real progress.',
      [{ text: 'OK' }]
    );
  };

  const getLessonStatus = (lessonId: string, lessonOrder: number, unitLessons: any[]) => {
    const isCompleted = completedLessons.includes(lessonId);

    // In developer mode, unlock all lessons
    if (developerModeEnabled) {
      return { locked: false, completed: isCompleted };
    }

    if (lessonOrder === 1) {
      return { locked: false, completed: isCompleted };
    }

    const previousLesson = unitLessons[lessonOrder - 2];
    const isPreviousCompleted = completedLessons.includes(previousLesson.id);

    return { locked: !isPreviousCompleted, completed: isCompleted };
  };

  const getUnitLocked = (unitOrder: number) => {
    // In developer mode, unlock all units
    if (developerModeEnabled) {
      return false;
    }

    if (unitOrder === 1) return false;

    const previousUnit = copticUnits[unitOrder - 2];
    const allPreviousLessonsCompleted = previousUnit.lessons.every(lesson =>
      completedLessons.includes(lesson.id)
    );

    return !allPreviousLessonsCompleted;
  };

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
    headerTitle: {
      fontSize: 24,
      fontWeight: '700',
      color: colors.primary,
    },
    headerSubtitle: {
      fontSize: 14,
      color: colors.textSecondary,
      marginTop: 2,
    },
    headerActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    headerActionsScroll: {
      flexGrow: 0,
      flexShrink: 1,
    },
    card: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 16,
      borderWidth: 2,
      borderColor: colors.border,
    },
    devModeCard: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      backgroundColor: '#6B46C1',
      borderColor: '#7C3AED',
    },
    devModeContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      minHeight: 40,
    },
    devModeIcon: {
      fontSize: 20,
    },
    devModeText: {
      fontSize: 18,
      fontWeight: '700',
      color: '#FFFFFF',
    },
    streakCard: {
      paddingHorizontal: 16,
      paddingVertical: 8,
    },
    streakContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      minHeight: 40,
    },
    streakEmoji: {
      fontSize: 20,
    },
    streakText: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.primary,
    },
    practiceCard: {
      paddingHorizontal: 16,
      paddingVertical: 8,
    },
    practiceContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      minHeight: 40,
    },
    practiceIcon: {
      fontSize: 20,
    },
    practiceLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.textPrimary,
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
      color: colors.textSecondary,
      fontWeight: '600',
    },
    xpValue: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.primary,
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
      color: colors.textPrimary,
      marginBottom: 4,
    },
    unitDescription: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    lessonsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 16,
      justifyContent: 'space-evenly',
    },
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>CopticLingo</Text>
          <Text style={styles.headerSubtitle}>ⲙⲁⲣⲓ ⲉⲣϩⲱⲃ!</Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.headerActions}
          style={styles.headerActionsScroll}
        >
          {developerModeEnabled && (
            <TouchableOpacity onPress={handleDevModePress} activeOpacity={0.8}>
              <View style={[styles.card, styles.devModeCard]}>
                <View style={styles.devModeContent}>
                  <Text style={styles.devModeIcon}>🛠️</Text>
                  {!isSmallScreen && <Text style={styles.devModeText}>Dev</Text>}
                </View>
              </View>
            </TouchableOpacity>
          )}
          {currentStreak > 0 && (
            <Card style={styles.streakCard}>
              <View style={styles.streakContent}>
                <Text style={styles.streakEmoji}>🔥</Text>
                <Text style={styles.streakText}>{currentStreak}</Text>
              </View>
            </Card>
          )}
          <Card style={styles.practiceCard} onPress={onReviewPress}>
            <View style={styles.practiceContent}>
              <Text style={styles.practiceIcon}>⚡</Text>
              {!isSmallScreen && <Text style={styles.practiceLabel}>Practice</Text>}
            </View>
          </Card>
          <Card style={styles.xpCard} onPress={onProfilePress}>
            <View style={styles.xpContent}>
              <Text style={styles.xpLabel}>Level {level}</Text>
              <Text style={styles.xpValue}>{totalXP} XP</Text>
            </View>
          </Card>
        </ScrollView>
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
