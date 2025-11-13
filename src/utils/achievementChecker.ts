import { useProgressStore } from '../store/progressStore';
import { useAchievementStore } from '../store/achievementStore';
import { copticUnits } from '../data/lessons';

/**
 * Check and unlock achievements based on current progress
 * Call this after lesson completion or progress updates
 */
export const checkAchievements = (
  completedLessons: string[],
  currentStreak: number,
  level: number,
  vocabularyCount: number,
  lessonAccuracy?: number
) => {
  const { unlockAchievement } = useAchievementStore.getState();

  // First lesson achievement
  if (completedLessons.length >= 1) {
    unlockAchievement('first-lesson');
  }

  // Lesson count achievements
  if (completedLessons.length >= 5) {
    unlockAchievement('five-lessons');
  }

  if (completedLessons.length >= 10) {
    unlockAchievement('ten-lessons');
  }

  // Perfect lesson achievement
  if (lessonAccuracy === 100) {
    unlockAchievement('perfect-lesson');
  }

  // Streak achievements
  if (currentStreak >= 3) {
    unlockAchievement('three-day-streak');
  }

  if (currentStreak >= 7) {
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
  if (vocabularyCount >= 25) {
    unlockAchievement('vocabulary-25');
  }

  if (vocabularyCount >= 50) {
    unlockAchievement('vocabulary-50');
  }

  if (vocabularyCount >= 100) {
    unlockAchievement('vocabulary-100');
  }

  // Check if completed a full unit
  checkUnitCompletion(completedLessons, unlockAchievement);

  // Check special category achievements
  checkCategoryAchievements(completedLessons, unlockAchievement);
};

/**
 * Check if user has completed any full units
 */
const checkUnitCompletion = (
  completedLessons: string[],
  unlockAchievement: (id: string) => void
) => {
  let completedUnits = 0;

  for (const unit of copticUnits) {
    const unitLessonIds = unit.lessons.map(l => l.id);
    const allCompleted = unitLessonIds.every(id => completedLessons.includes(id));

    if (allCompleted) {
      completedUnits++;
    }
  }

  // Unlock first unit achievement
  if (completedUnits >= 1) {
    unlockAchievement('first-unit');
  }
};

/**
 * Check category-specific achievements (alphabet, grammar, Bible, etc.)
 */
const checkCategoryAchievements = (
  completedLessons: string[],
  unlockAchievement: (id: string) => void
) => {
  // Check alphabet lessons (Units 1-2)
  const alphabetUnits = copticUnits.filter(u => u.order <= 2);
  const alphabetLessonIds = alphabetUnits.flatMap(u => u.lessons.map(l => l.id));
  const alphabetComplete = alphabetLessonIds.every(id => completedLessons.includes(id));

  if (alphabetComplete) {
    unlockAchievement('alphabet-master');
  }

  // Check grammar lessons (Units 3-15)
  const grammarUnits = copticUnits.filter(u => u.order >= 3 && u.order <= 15);
  const grammarLessonIds = grammarUnits.flatMap(u => u.lessons.map(l => l.id));
  const grammarComplete = grammarLessonIds.every(id => completedLessons.includes(id));

  if (grammarComplete) {
    unlockAchievement('grammar-guru');
  }

  // Check Bible lessons (Units 16-22) - count individual lessons
  const bibleLessonIds = copticUnits
    .filter(u => u.order >= 16)
    .flatMap(u => u.lessons.map(l => l.id));

  const completedBibleLessons = bibleLessonIds.filter(id =>
    completedLessons.includes(id)
  );

  if (completedBibleLessons.length >= 10) {
    unlockAchievement('bible-scholar');
  }
};

/**
 * Get newly unlocked achievements to show notifications
 * Returns achievements that were just unlocked
 */
export const getNewlyUnlockedAchievements = (
  previousAchievements: any[],
  currentAchievements: any[]
) => {
  return currentAchievements.filter(current => {
    const previous = previousAchievements.find(p => p.id === current.id);
    return current.unlocked && (!previous || !previous.unlocked);
  });
};
