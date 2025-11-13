import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Card, Button } from '../components';
import { useReviewStore } from '../store/reviewStore';
import { useProgressStore } from '../store/progressStore';
import { copticUnits } from '../data/lessons';
import { Exercise } from '../types';

interface ReviewScreenProps {
  onStartReview: (exercises: Exercise[]) => void;
  onBack: () => void;
}

export const ReviewScreen: React.FC<ReviewScreenProps> = ({ onStartReview, onBack }) => {
  const { getDueReviews } = useReviewStore();
  const { completedLessons } = useProgressStore();
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
  statsCard: {
    padding: 20,
    marginBottom: 16,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#58CC02',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#e5e7eb',
    marginHorizontal: 16,
  },
  practiceCard: {
    padding: 20,
    marginBottom: 16,
  },
  practiceHeader: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  practiceIcon: {
    fontSize: 40,
    marginRight: 16,
  },
  practiceInfo: {
    flex: 1,
  },
  practiceTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
  },
  practiceDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  dueInfo: {
    backgroundColor: '#fef3c7',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#fbbf24',
  },
  dueText: {
    fontSize: 14,
    color: '#92400e',
    fontWeight: '600',
    textAlign: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  categoryCard: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 16,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 12,
  },
  categoryButton: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#f3f4f6',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e5e7eb',
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
    fontWeight: '600',
    color: '#1f2937',
  },
  categoryNote: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
