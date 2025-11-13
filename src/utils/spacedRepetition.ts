import { Exercise } from '../types';

interface ReviewItem {
  exerciseId: string;
  nextReviewDate: string;
  interval: number; // days
  easeFactor: number;
  repetitions: number;
}

export class SpacedRepetitionService {
  private static readonly INITIAL_INTERVAL = 1;
  private static readonly INITIAL_EASE_FACTOR = 2.5;

  static calculateNextReview(
    correct: boolean,
    previousInterval: number = this.INITIAL_INTERVAL,
    previousEaseFactor: number = this.INITIAL_EASE_FACTOR,
    repetitions: number = 0
  ): { interval: number; easeFactor: number; repetitions: number } {
    if (!correct) {
      return {
        interval: this.INITIAL_INTERVAL,
        easeFactor: Math.max(1.3, previousEaseFactor - 0.2),
        repetitions: 0,
      };
    }

    let newInterval: number;
    let newRepetitions = repetitions + 1;

    if (newRepetitions === 1) {
      newInterval = 1;
    } else if (newRepetitions === 2) {
      newInterval = 6;
    } else {
      newInterval = Math.round(previousInterval * previousEaseFactor);
    }

    const newEaseFactor = Math.max(1.3, previousEaseFactor);

    return {
      interval: newInterval,
      easeFactor: newEaseFactor,
      repetitions: newRepetitions,
    };
  }

  static getNextReviewDate(intervalDays: number): string {
    const date = new Date();
    date.setDate(date.getDate() + intervalDays);
    return date.toISOString().split('T')[0];
  }

  static isDueForReview(nextReviewDate: string): boolean {
    const today = new Date().toISOString().split('T')[0];
    return today >= nextReviewDate;
  }

  static createReviewItem(exerciseId: string): ReviewItem {
    return {
      exerciseId,
      nextReviewDate: this.getNextReviewDate(this.INITIAL_INTERVAL),
      interval: this.INITIAL_INTERVAL,
      easeFactor: this.INITIAL_EASE_FACTOR,
      repetitions: 0,
    };
  }

  static updateReviewItem(item: ReviewItem, correct: boolean): ReviewItem {
    const { interval, easeFactor, repetitions } = this.calculateNextReview(
      correct,
      item.interval,
      item.easeFactor,
      item.repetitions
    );

    return {
      ...item,
      nextReviewDate: this.getNextReviewDate(interval),
      interval,
      easeFactor,
      repetitions,
    };
  }
}
