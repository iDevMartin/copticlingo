import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Achievement } from '../types';

interface AchievementState {
  achievements: Achievement[];
  unlockAchievement: (achievementId: string) => void;
}

const initialAchievements: Achievement[] = [
  {
    id: 'first-lesson',
    title: 'First Steps',
    description: 'Complete your first lesson',
    icon: '🎯',
    unlocked: false,
  },
  {
    id: 'five-lessons',
    title: 'Getting Started',
    description: 'Complete 5 lessons',
    icon: '📚',
    unlocked: false,
  },
  {
    id: 'ten-lessons',
    title: 'Dedicated Learner',
    description: 'Complete 10 lessons',
    icon: '🌟',
    unlocked: false,
  },
  {
    id: 'first-unit',
    title: 'Unit Master',
    description: 'Complete your first unit',
    icon: '🏆',
    unlocked: false,
  },
  {
    id: 'three-day-streak',
    title: 'On Fire!',
    description: 'Maintain a 3-day streak',
    icon: '🔥',
    unlocked: false,
  },
  {
    id: 'seven-day-streak',
    title: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    icon: '⚡',
    unlocked: false,
  },
  {
    id: 'level-5',
    title: 'Rising Star',
    description: 'Reach level 5',
    icon: '⭐',
    unlocked: false,
  },
  {
    id: 'level-10',
    title: 'Expert',
    description: 'Reach level 10',
    icon: '💎',
    unlocked: false,
  },
  {
    id: 'perfect-lesson',
    title: 'Perfectionist',
    description: 'Complete a lesson with 100% accuracy',
    icon: '✨',
    unlocked: false,
  },
  {
    id: 'vocabulary-25',
    title: 'Word Collector',
    description: 'Learn 25 vocabulary words',
    icon: '📖',
    unlocked: false,
  },
  {
    id: 'vocabulary-50',
    title: 'Vocabulary Master',
    description: 'Learn 50 vocabulary words',
    icon: '📚',
    unlocked: false,
  },
  {
    id: 'vocabulary-100',
    title: 'Word Wizard',
    description: 'Learn 100 vocabulary words',
    icon: '🧙',
    unlocked: false,
  },
  {
    id: 'alphabet-master',
    title: 'Alphabet Master',
    description: 'Complete all alphabet lessons',
    icon: '🔤',
    unlocked: false,
  },
  {
    id: 'grammar-guru',
    title: 'Grammar Guru',
    description: 'Complete all grammar units',
    icon: '📝',
    unlocked: false,
  },
  {
    id: 'bible-scholar',
    title: 'Bible Scholar',
    description: 'Complete 10 Biblical passage lessons',
    icon: '📖',
    unlocked: false,
  },
];

const AchievementContext = createContext<AchievementState | undefined>(undefined);

export const AchievementProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [achievements, setAchievements] = useState<Achievement[]>(initialAchievements);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from AsyncStorage on mount
  useEffect(() => {
    const loadAchievements = async () => {
      try {
        const stored = await AsyncStorage.getItem('copticlingo-achievements');
        if (stored) {
          setAchievements(JSON.parse(stored));
        }
      } catch (error) {
        console.warn('Failed to load achievements:', error);
      } finally {
        setIsLoaded(true);
      }
    };
    loadAchievements();
  }, []);

  // Save to AsyncStorage whenever achievements change
  useEffect(() => {
    if (isLoaded) {
      AsyncStorage.setItem('copticlingo-achievements', JSON.stringify(achievements)).catch(error =>
        console.warn('Failed to save achievements:', error)
      );
    }
  }, [achievements, isLoaded]);

  const unlockAchievement = (achievementId: string) => {
    setAchievements(state =>
      state.map(achievement =>
        achievement.id === achievementId && !achievement.unlocked
          ? { ...achievement, unlocked: true, unlockedAt: new Date().toISOString() }
          : achievement
      )
    );
  };

  if (!isLoaded) {
    return null;
  }

  return (
    <AchievementContext.Provider value={{ achievements, unlockAchievement }}>
      {children}
    </AchievementContext.Provider>
  );
};

export const useAchievementStore = () => {
  const context = useContext(AchievementContext);
  if (!context) {
    throw new Error('useAchievementStore must be used within AchievementProvider');
  }
  return context;
};
