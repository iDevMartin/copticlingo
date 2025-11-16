import React from 'react';
import { LessonExercises } from '../components/exercises/LessonExercises';
import { Exercise } from '../types';

interface ReviewLessonScreenProps {
  exercises: Exercise[];
  onComplete: (correctCount: number, totalCount: number) => void;
  onExit: () => void;
}

export const ReviewLessonScreen: React.FC<ReviewLessonScreenProps> = ({
  exercises,
  onComplete,
  onExit,
}) => {
  return (
    <LessonExercises
      exercises={exercises}
      onComplete={onComplete}
      onExit={onExit}
      isPracticeMode={true}
    />
  );
};
