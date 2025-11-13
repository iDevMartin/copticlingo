import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { copticUnits } from '../data/lessons';
import { LessonExercises } from '../components/exercises/LessonExercises';
import { LessonResultScreen } from './LessonResultScreen';
import { useProgressStore } from '../store/progressStore';
import { useAchievementStore } from '../store/achievementStore';
import { checkAchievements } from '../utils/achievementChecker';
import { AchievementModal } from '../components';
import { Achievement } from '../types';

interface LessonScreenProps {
  lessonId: string;
  onComplete: () => void;
  onExit: () => void;
}

export const LessonScreen: React.FC<LessonScreenProps> = ({ lessonId, onComplete, onExit }) => {
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState({ correctCount: 0, totalCount: 0 });
  const { completeLesson, updateStreak, completedLessons, currentStreak, level, vocabularyLearned } = useProgressStore();
  const { achievements, unlockAchievement } = useAchievementStore();
  const [unlockedAchievement, setUnlockedAchievement] = useState<Achievement | null>(null);
  const [showAchievementModal, setShowAchievementModal] = useState(false);

  const lesson = copticUnits
    .flatMap(unit => unit.lessons)
    .find(l => l.id === lessonId);

  if (!lesson) {
    return null;
  }

  const handleLessonComplete = (correctCount: number, totalCount: number) => {
    setResults({ correctCount, totalCount });
    setShowResults(true);

    const percentage = (correctCount / totalCount) * 100;
    if (percentage >= 60) {
      // Store previous achievements state
      const previousAchievements = [...achievements];

      // Calculate the updated progress values
      const updatedCompletedLessons = [...new Set([...completedLessons, lessonId])];

      // Update progress
      completeLesson(lessonId, lesson.xpReward);
      updateStreak();

      // Directly check and unlock achievements
      // First lesson
      if (updatedCompletedLessons.length >= 1) {
        unlockAchievement('first-lesson');
      }
      // Five lessons
      if (updatedCompletedLessons.length >= 5) {
        unlockAchievement('five-lessons');
      }
      // Ten lessons
      if (updatedCompletedLessons.length >= 10) {
        unlockAchievement('ten-lessons');
      }
      // Perfect lesson
      if (percentage === 100) {
        unlockAchievement('perfect-lesson');
      }
      // Streak achievements
      if (currentStreak + 1 >= 3) {
        unlockAchievement('three-day-streak');
      }
      if (currentStreak + 1 >= 7) {
        unlockAchievement('seven-day-streak');
      }
      // Level achievements
      if (level >= 5) {
        unlockAchievement('level-5');
      }
      if (level >= 10) {
        unlockAchievement('level-10');
      }
      // Vocabulary achievements
      if (vocabularyLearned.length >= 25) {
        unlockAchievement('vocabulary-25');
      }
      if (vocabularyLearned.length >= 50) {
        unlockAchievement('vocabulary-50');
      }
      if (vocabularyLearned.length >= 100) {
        unlockAchievement('vocabulary-100');
      }

      // Check for newly unlocked achievements to show modal
      setTimeout(() => {
        const newlyUnlocked = achievements.find(current => {
          const previous = previousAchievements.find(p => p.id === current.id);
          return current.unlocked && (!previous || !previous.unlocked);
        });

        if (newlyUnlocked) {
          setUnlockedAchievement(newlyUnlocked);
          setShowAchievementModal(true);
        }
      }, 200);
    }
  };

  const handleResultsContinue = () => {
    onComplete();
  };

  if (showResults) {
    return (
      <LessonResultScreen
        correctCount={results.correctCount}
        totalCount={results.totalCount}
        xpEarned={lesson.xpReward}
        onContinue={handleResultsContinue}
      />
    );
  }

  return (
    <View style={styles.container}>
      <LessonExercises
        exercises={lesson.exercises}
        onComplete={handleLessonComplete}
        onExit={onExit}
      />

      <AchievementModal
        achievement={unlockedAchievement}
        visible={showAchievementModal}
        onClose={() => setShowAchievementModal(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});
