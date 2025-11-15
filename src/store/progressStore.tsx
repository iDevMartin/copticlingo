import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProgress } from '../types';

interface ProgressState extends UserProgress {
  completeLesson: (lessonId: string, xpGained: number) => void;
  addVocabulary: (word: string) => void;
  addMistake: (word: string) => void;
  updateStreak: () => void;
  resetProgress: () => void;
}

const initialProgress: UserProgress = {
  userId: 'user-1',
  completedLessons: [],
  currentStreak: 0,
  longestStreak: 0,
  totalXP: 0,
  level: 1,
  lastPracticeDate: null,
  vocabularyLearned: [],
  mistakeWords: [],
};

const ProgressContext = createContext<ProgressState | undefined>(undefined);

export const ProgressProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [progress, setProgress] = useState<UserProgress>(initialProgress);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from AsyncStorage on mount
  useEffect(() => {
    const loadProgress = async () => {
      try {
        const stored = await AsyncStorage.getItem('copticlingo-progress');
        if (stored) {
          setProgress(JSON.parse(stored));
        }
      } catch (error) {
        console.warn('Failed to load progress:', error);
      } finally {
        setIsLoaded(true);
      }
    };
    loadProgress();
  }, []);

  // Save to AsyncStorage whenever progress changes
  useEffect(() => {
    if (isLoaded) {
      AsyncStorage.setItem('copticlingo-progress', JSON.stringify(progress)).catch(error =>
        console.warn('Failed to save progress:', error)
      );
    }
  }, [progress, isLoaded]);

  const completeLesson = (lessonId: string, xpGained: number) => {
    setProgress(state => {
      const newCompletedLessons = [...new Set([...state.completedLessons, lessonId])];
      const newTotalXP = state.totalXP + xpGained;
      const newLevel = Math.floor(newTotalXP / 100) + 1;

      return {
        ...state,
        completedLessons: newCompletedLessons,
        totalXP: newTotalXP,
        level: newLevel,
      };
    });
  };

  const addVocabulary = (word: string) => {
    setProgress(state => ({
      ...state,
      vocabularyLearned: [...new Set([...state.vocabularyLearned, word])],
    }));
  };

  const addMistake = (word: string) => {
    setProgress(state => ({
      ...state,
      mistakeWords: [...new Set([...state.mistakeWords, word])],
    }));
  };

  const updateStreak = () => {
    setProgress(state => {
      const today = new Date().toISOString().split('T')[0];
      const lastPractice = state.lastPracticeDate;

      // First time practicing
      if (!lastPractice) {
        return {
          ...state,
          currentStreak: 1,
          longestStreak: Math.max(1, state.longestStreak),
          lastPracticeDate: today,
        };
      }

      const lastDate = new Date(lastPractice);
      const currentDate = new Date(today);
      const diffTime = currentDate.getTime() - lastDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      // Same day - no change to streak
      if (diffDays === 0) {
        return state;
      }
      // Next day - increment streak
      else if (diffDays === 1) {
        const newStreak = state.currentStreak + 1;
        return {
          ...state,
          currentStreak: newStreak,
          longestStreak: Math.max(newStreak, state.longestStreak),
          lastPracticeDate: today,
        };
      }
      // Missed days - reset to 1
      else {
        return {
          ...state,
          currentStreak: 1,
          longestStreak: state.longestStreak,
          lastPracticeDate: today,
        };
      }
    });
  };

  const resetProgress = () => {
    setProgress(initialProgress);
  };

  if (!isLoaded) {
    return null;
  }

  return (
    <ProgressContext.Provider
      value={{
        ...progress,
        completeLesson,
        addVocabulary,
        addMistake,
        updateStreak,
        resetProgress,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgressStore = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgressStore must be used within ProgressProvider');
  }
  return context;
};
