export type ExerciseType = 'multiple_choice' | 'fill_blank' | 'translation' | 'matching' | 'sentence_building' | 'listening' | 'speaking';

export interface Exercise {
  id: string;
  type: ExerciseType;
  question: string;
  questionCoptic?: string;
  correctAnswer: string;
  options?: string[];
  pairs?: { coptic: string; english: string }[];
  wordBank?: string[];
  explanation?: string;
  audioUrl?: string;
}

export interface Lesson {
  id: string;
  unitId: string;
  title: string;
  description: string;
  order: number;
  exercises: Exercise[];
  xpReward: number;
  isLocked: boolean;
  completed: boolean;
}

export interface Unit {
  id: string;
  title: string;
  description: string;
  order: number;
  lessons: Lesson[];
  color: string;
}

export interface UserProgress {
  userId: string;
  completedLessons: string[];
  currentStreak: number;
  longestStreak: number;
  totalXP: number;
  level: number;
  lastPracticeDate: string | null;
  vocabularyLearned: string[];
  mistakeWords: string[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastPracticeDate: string | null;
}
