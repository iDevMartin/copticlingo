import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Card, Button } from '../components';
import { useReviewStore } from '../store/reviewStore';
import { useProgressStore } from '../store/progressStore';
import { copticUnits } from '../data/lessons';
import { Exercise } from '../types';
import { useTheme } from '../theme/ThemeContext';

interface ReviewScreenProps {
  onStartReview: (exercises: Exercise[]) => void;
  onBack: () => void;
}

export const ReviewScreen: React.FC<ReviewScreenProps> = ({ onStartReview, onBack }) => {
  const { getDueReviews } = useReviewStore();
  const { completedLessons } = useProgressStore();
  const { colors } = useTheme();
  const [dueReviews, setDueReviews] = useState(getDueReviews());

  useEffect(() => {
    setDueReviews(getDueReviews());
  }, []);

  // Get exercises from completed lessons for review
  const getReviewExercises = () => {
    const allExercises: Exercise[] = [];

    copticUnits.forEach(unit => {
      unit.lessons.forEach(lesson => {
        if (completedLessons.includes(lesson.id)) {
          // Add some exercises from completed lessons
          const exercisesToReview = lesson.exercises.slice(0, 3); // Take first 3 exercises from each lesson
          allExercises.push(...exercisesToReview);
        }
      });
    });

    // Shuffle exercises for variety
    return allExercises.sort(() => Math.random() - 0.5).slice(0, 10); // Take 10 random exercises
  };

  const handleStartQuickReview = () => {
    const reviewExercises = getReviewExercises();
    if (reviewExercises.length > 0) {
      onStartReview(reviewExercises);
    }
  };

  const completedLessonsCount = completedLessons.length;
  const hasCompletedLessons = completedLessonsCount > 0;

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
    statsCard: {
      padding: 20,
      marginBottom: 20,
    },
    statRow: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
    },
    statItem: {
      alignItems: 'center',
      flex: 1,
    },
    statValue: {
      fontSize: 32,
      fontWeight: '700',
      color: colors.primary,
      marginBottom: 4,
    },
    statLabel: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: 'center',
    },
    statDivider: {
      width: 1,
      height: 40,
      backgroundColor: colors.border,
      marginHorizontal: 20,
    },
    practiceCard: {
      padding: 24,
      marginBottom: 20,
    },
    practiceHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    practiceIcon: {
      fontSize: 32,
      marginRight: 12,
    },
    practiceInfo: {
      flex: 1,
    },
    practiceTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.textPrimary,
      marginBottom: 4,
    },
    practiceDescription: {
      fontSize: 14,
      color: colors.textSecondary,
      lineHeight: 20,
    },
    dueInfo: {
      backgroundColor: colors.infoLight,
      padding: 12,
      borderRadius: 8,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: colors.info,
    },
    dueText: {
      fontSize: 14,
      color: colors.textPrimary,
      fontWeight: '600',
      textAlign: 'center',
    },
    emptyState: {
      alignItems: 'center',
      paddingVertical: 24,
    },
    emptyIcon: {
      fontSize: 48,
      marginBottom: 12,
    },
    emptyText: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 20,
    },
    categoryCard: {
      padding: 24,
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.textPrimary,
      marginBottom: 16,
    },
    categoryGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
    },
    categoryButton: {
      flex: 1,
      minWidth: '45%',
      backgroundColor: colors.surfaceSecondary,
      padding: 20,
      borderRadius: 12,
      alignItems: 'center',
      borderWidth: 2,
      borderColor: colors.border,
    },
    categoryDisabled: {
      opacity: 0.5,
    },
    categoryIcon: {
      fontSize: 32,
      marginBottom: 8,
    },
    categoryText: {
      fontSize: 14,
      color: colors.textPrimary,
      fontWeight: '600',
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
        <Text style={styles.headerTitle}>Practice & Review</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        {/* Stats Card */}
        <Card style={styles.statsCard}>
          <View style={styles.statRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{completedLessonsCount}</Text>
              <Text style={styles.statLabel}>Completed Lessons</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{dueReviews.length}</Text>
              <Text style={styles.statLabel}>Due for Review</Text>
            </View>
          </View>
        </Card>

        {/* Quick Practice */}
        <Card style={styles.practiceCard}>
          <View style={styles.practiceHeader}>
            <Text style={styles.practiceIcon}>⚡</Text>
            <View style={styles.practiceInfo}>
              <Text style={styles.practiceTitle}>Quick Practice</Text>
              <Text style={styles.practiceDescription}>
                Review 10 random exercises from your completed lessons
              </Text>
            </View>
          </View>

          {hasCompletedLessons ? (
            <Button
              title="Start Quick Review"
              onPress={handleStartQuickReview}
              variant="primary"
              fullWidth
            />
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>📚</Text>
              <Text style={styles.emptyText}>
                Complete some lessons first to unlock practice mode!
              </Text>
            </View>
          )}
        </Card>

        {/* Spaced Repetition */}
        <Card style={styles.practiceCard}>
          <View style={styles.practiceHeader}>
            <Text style={styles.practiceIcon}>🧠</Text>
            <View style={styles.practiceInfo}>
              <Text style={styles.practiceTitle}>Spaced Repetition</Text>
              <Text style={styles.practiceDescription}>
                Review exercises based on optimal timing for memory retention
              </Text>
            </View>
          </View>

          {dueReviews.length > 0 ? (
            <View>
              <View style={styles.dueInfo}>
                <Text style={styles.dueText}>
                  {dueReviews.length} {dueReviews.length === 1 ? 'item' : 'items'} due today
                </Text>
              </View>
              <Button
                title="Start Review Session"
                onPress={() => {
                  // TODO: Implement spaced repetition review session
                  // For now, fall back to quick review
                  handleStartQuickReview();
                }}
                variant="success"
                fullWidth
              />
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>✓</Text>
              <Text style={styles.emptyText}>
                {hasCompletedLessons
                  ? 'All caught up! Come back later for more reviews.'
                  : 'Complete lessons to start building your review queue'}
              </Text>
            </View>
          )}
        </Card>

        {/* Practice by Category */}
        <Card style={styles.categoryCard}>
          <Text style={styles.sectionTitle}>Practice by Category</Text>

          <View style={styles.categoryGrid}>
            <TouchableOpacity
              style={[styles.categoryButton, !hasCompletedLessons && styles.categoryDisabled]}
              disabled={!hasCompletedLessons}
            >
              <Text style={styles.categoryIcon}>🔤</Text>
              <Text style={styles.categoryText}>Alphabet</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.categoryButton, !hasCompletedLessons && styles.categoryDisabled]}
              disabled={!hasCompletedLessons}
            >
              <Text style={styles.categoryIcon}>📝</Text>
              <Text style={styles.categoryText}>Grammar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.categoryButton, !hasCompletedLessons && styles.categoryDisabled]}
              disabled={!hasCompletedLessons}
            >
              <Text style={styles.categoryIcon}>💬</Text>
              <Text style={styles.categoryText}>Vocabulary</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.categoryButton, !hasCompletedLessons && styles.categoryDisabled]}
              disabled={!hasCompletedLessons}
            >
              <Text style={styles.categoryIcon}>📖</Text>
              <Text style={styles.categoryText}>Bible</Text>
            </TouchableOpacity>
          </View>

          {!hasCompletedLessons && (
            <Text style={styles.categoryNote}>
              Complete lessons to unlock category practice
            </Text>
          )}
        </Card>
      </ScrollView>
    </View>
  );
};

