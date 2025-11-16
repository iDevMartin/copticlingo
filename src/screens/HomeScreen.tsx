import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { LessonNode, Card } from '../components';
import { copticUnits } from '../data/lessons';
import { copticUnitTests } from '../data/tests/unit-tests';
import { useProgressStore } from '../store/progressStore';
import { useUnitTestStore } from '../store/unitTestStore';
import { useSettingsStore } from '../store/settingsStore';
import { useTheme } from '../theme/ThemeContext';

interface HomeScreenProps {
  onLessonPress: (lessonId: string) => void;
  onProfilePress: () => void;
  onReviewPress: () => void;
  onSettingsPress: () => void;
  onUnitTestPress: (testId: string) => void;
  initialScrollY?: number;
  onScrollPositionChange?: (scrollY: number) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onLessonPress,
  onProfilePress,
  onReviewPress,
  onSettingsPress,
  onUnitTestPress,
  initialScrollY = 0,
  onScrollPositionChange,
}) => {
  const { completedLessons, totalXP, currentStreak, level } = useProgressStore();
  const { hasPassedTest, getTestProgress } = useUnitTestStore();
  const { developerModeEnabled } = useSettingsStore();
  const { colors } = useTheme();
  const [isSmallScreen, setIsSmallScreen] = useState(Dimensions.get('window').width < 500);
  const [showDevModeModal, setShowDevModeModal] = useState(false);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const currentScrollY = useRef(0);
  const screenHeight = Dimensions.get('window').height;

  // Restore scroll position when returning to home screen
  useEffect(() => {
    if (initialScrollY > 0 && scrollViewRef.current) {
      // Small delay to ensure layout is complete
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({ y: initialScrollY, animated: false });
      }, 100);
    }
  }, [initialScrollY]);

  // Debug: Log test data on mount
  useEffect(() => {
    console.log('Total copticUnitTests loaded:', copticUnitTests.length);
    console.log('Unit IDs in tests:', copticUnitTests.map(t => t.unitId));
    console.log('Unit IDs in units:', copticUnits.map(u => u.id));
  }, []);

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setIsSmallScreen(window.width < 500);
    });
    return () => subscription?.remove();
  }, []);

  const handleDevModePress = () => {
    setShowDevModeModal(true);
  };

  const handleLessonPress = (lessonId: string) => {
    // Save current scroll position before navigating
    onScrollPositionChange?.(currentScrollY.current);
    onLessonPress(lessonId);
  };

  const handleUnitTestPress = (testId: string) => {
    // Save current scroll position before navigating
    onScrollPositionChange?.(currentScrollY.current);
    onUnitTestPress(testId);
  };

  const handleScrollToTop = () => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  const handleProfilePress = () => {
    // Save current scroll position before navigating
    onScrollPositionChange?.(currentScrollY.current);
    onProfilePress();
  };

  const handleReviewPress = () => {
    // Save current scroll position before navigating
    onScrollPositionChange?.(currentScrollY.current);
    onReviewPress();
  };

  const getLessonStatus = (lessonId: string, lessonOrder: number, unitLessons: any[]) => {
    const isCompleted = completedLessons.includes(lessonId);

    // In developer mode, unlock all lessons
    if (developerModeEnabled) {
      return { locked: false, completed: isCompleted };
    }

    // If lesson is already completed (e.g., via unit test), it should be unlocked
    if (isCompleted) {
      return { locked: false, completed: true };
    }

    // First lesson is always unlocked
    if (lessonOrder === 1) {
      return { locked: false, completed: false };
    }

    // Check if previous lesson is completed
    const previousLesson = unitLessons[lessonOrder - 2];
    const isPreviousCompleted = completedLessons.includes(previousLesson.id);

    return { locked: !isPreviousCompleted, completed: false };
  };

  const getUnitLocked = (unitOrder: number) => {
    // In developer mode, unlock all units
    if (developerModeEnabled) {
      return false;
    }

    if (unitOrder === 1) return false;

    // Check if previous unit test was passed
    const previousUnit = copticUnits[unitOrder - 2];
    const previousUnitTest = copticUnitTests.find(t => t.unitId === previousUnit.id);

    if (previousUnitTest) {
      return !hasPassedTest(previousUnitTest.id);
    }

    // Fallback: check if all previous lessons completed
    const allPreviousLessonsCompleted = previousUnit.lessons.every(lesson =>
      completedLessons.includes(lesson.id)
    );

    return !allPreviousLessonsCompleted;
  };

  const getUnitTestStatus = (unitId: string) => {
    const unitTest = copticUnitTests.find(t => t.unitId === unitId);
    if (!unitTest) return { visible: false, locked: true, passed: false };

    const testProgress = getTestProgress(unitTest.id);

    // Unit tests are ALWAYS unlocked for everyone (not just developer mode)
    // This allows users to skip ahead by proving proficiency
    return {
      visible: true,
      locked: false,
      passed: testProgress?.passed || false,
    };
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
      paddingHorizontal: 20,
      paddingTop: 30,
      paddingBottom: 16,
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
    unitTestButton: {
      width: '100%',
      marginTop: 16,
      padding: 16,
      borderRadius: 12,
      backgroundColor: colors.surface,
      borderWidth: 2,
      borderColor: colors.primary,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
    },
    unitTestButtonLocked: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
      opacity: 0.5,
    },
    unitTestButtonPassed: {
      backgroundColor: '#10B98120',
      borderColor: '#10B981',
    },
    unitTestIcon: {
      fontSize: 24,
    },
    unitTestText: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.primary,
    },
    unitTestTextLocked: {
      color: colors.textSecondary,
    },
    unitTestTextPassed: {
      color: '#10B981',
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
    modalButton: {
      paddingVertical: 12,
      borderRadius: 8,
      backgroundColor: colors.primary,
    },
    modalButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#FFFFFF',
      textAlign: 'center',
    },
    scrollToTopButton: {
      position: 'absolute',
      bottom: 24,
      right: 24,
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
      zIndex: 999,
    },
    scrollToTopIcon: {
      fontSize: 24,
      color: '#FFFFFF',
    },
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>CopticLingo</Text>
          <Text style={styles.headerSubtitle}>Ⲙⲁⲣⲉⲛϭⲓⲥⲃⲱ!</Text>
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
          <Card style={styles.practiceCard} onPress={handleReviewPress}>
            <View style={styles.practiceContent}>
              <Text style={styles.practiceIcon}>⚡</Text>
              {!isSmallScreen && <Text style={styles.practiceLabel}>Practice</Text>}
            </View>
          </Card>
          <Card style={styles.xpCard} onPress={handleProfilePress}>
            <View style={styles.xpContent}>
              <Text style={styles.xpLabel}>Level {level}</Text>
              <Text style={styles.xpValue}>{totalXP} XP</Text>
            </View>
          </Card>
        </ScrollView>
      </View>

      {/* Skill Tree */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        onScroll={(event) => {
          // Just track in ref, don't update state during scroll
          currentScrollY.current = event.nativeEvent.contentOffset.y;
          // Show scroll to top button when scrolled more than one screen height
          const shouldShow = event.nativeEvent.contentOffset.y > screenHeight;
          if (shouldShow !== showScrollToTop) {
            setShowScrollToTop(shouldShow);
          }
        }}
        scrollEventThrottle={16}
      >
        {copticUnits.map((unit) => {
          const unitLocked = getUnitLocked(unit.order);
          const unitTest = copticUnitTests.find(t => t.unitId === unit.id);
          const testStatus = getUnitTestStatus(unit.id);

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

                  // If lesson is completed (via unit test), ignore unit lock
                  const isLocked = completed ? false : (locked || unitLocked);
                  const isCurrent = !isLocked && !completed;

                  return (
                    <LessonNode
                      key={lesson.id}
                      title={lesson.title}
                      color={unit.color}
                      locked={isLocked}
                      completed={completed}
                      current={isCurrent}
                      onPress={() => !isLocked && handleLessonPress(lesson.id)}
                    />
                  );
                })}

                {/* Unit Test as a Lesson Node */}
                {testStatus.visible && unitTest && (
                  <LessonNode
                    key={`test-${unit.id}`}
                    title={`Unit ${unit.order} Test`}
                    color={testStatus.passed ? '#10B981' : unit.color}
                    locked={testStatus.locked}
                    completed={testStatus.passed}
                    current={!testStatus.locked && !testStatus.passed}
                    icon={testStatus.passed ? '⭐' : '📝'}
                    onPress={() => !testStatus.locked && handleUnitTestPress(unitTest.id)}
                  />
                )}

                {/* Debug: Show if test is missing */}
                {!unitTest && developerModeEnabled && (
                  <LessonNode
                    key={`test-missing-${unit.id}`}
                    title={`⚠️ No test for ${unit.id}`}
                    color="#EF4444"
                    locked={true}
                    completed={false}
                    current={false}
                    onPress={() => {}}
                  />
                )}
              </View>
            </View>
          );
        })}

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Developer Mode Info Modal */}
      {showDevModeModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Developer Mode</Text>
            <Text style={styles.modalMessage}>
              Developer/Debug mode is currently enabled.{'\n\n'}
              • All lessons and units are unlocked{'\n'}
              • Completed lessons do NOT count towards XP progress{'\n'}
              • Achievements will NOT be unlocked{'\n\n'}
              This mode is intended for testing and development purposes only. Disable it in Settings to track your real progress.
            </Text>
            <TouchableOpacity style={styles.modalButton} onPress={() => setShowDevModeModal(false)}>
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Scroll to Top Button */}
      {showScrollToTop && (
        <TouchableOpacity
          style={styles.scrollToTopButton}
          onPress={handleScrollToTop}
          activeOpacity={0.8}
        >
          <Text style={styles.scrollToTopIcon}>↑</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
