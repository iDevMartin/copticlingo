import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Exercise } from '../../types';
import { Button, ProgressBar } from '../';
import { MultipleChoice } from './MultipleChoice';
import { MatchingExercise } from './MatchingExercise';
import { FillBlank } from './FillBlank';
import { TranslationExercise } from './TranslationExercise';
import { SentenceBuildingExercise } from './SentenceBuildingExercise';
import { ListeningExercise } from './ListeningExercise';
import { SpeakingExercise } from './SpeakingExercise';
import { useSoundEffect } from '../../utils/useSoundEffect';
import { useTheme } from '../../theme/ThemeContext';

interface LessonProps {
  exercises: Exercise[];
  onComplete: (correctCount: number, totalCount: number) => void;
  onExit: () => void;
  isPracticeMode?: boolean; // Practice mode disables hearts
}

export const LessonExercises: React.FC<LessonProps> = ({ exercises, onComplete, onExit, isPracticeMode = false }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [hearts, setHearts] = useState(3);
  const [exerciseCompleted, setExerciseCompleted] = useState(false);
  const { playCorrectSound } = useSoundEffect();
  const { colors } = useTheme();

  const currentExercise = exercises[currentIndex];
  const progress = (currentIndex + 1) / exercises.length;

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleCheckAnswer = () => {
    setShowResult(true);
    const isCorrect = selectedAnswer === currentExercise.correctAnswer;

    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
      playCorrectSound();
    } else if (!isPracticeMode) {
      // Only deduct hearts in non-practice mode
      setHearts(prev => prev - 1);
    }
  };

  const handleMatchingComplete = (correct: boolean) => {
    setShowResult(true);
    setExerciseCompleted(true);
    if (correct) {
      setCorrectAnswers(prev => prev + 1);
      playCorrectSound();
    } else if (!isPracticeMode) {
      // Only deduct hearts in non-practice mode
      setHearts(prev => prev - 1);
    }
  };

  const handleSelfContainedExercise = (correct: boolean) => {
    // For Translation, SentenceBuilding, Listening, Speaking exercises
    // that handle their own state and just report results
    if (correct) {
      setCorrectAnswers(prev => prev + 1);
    } else if (!isPracticeMode) {
      // Only deduct hearts in non-practice mode
      setHearts(prev => prev - 1);
    }

    // Auto-advance after a short delay
    setTimeout(() => {
      handleContinue();
    }, 2000);
  };

  const handleSoundOnCheck = (correct: boolean) => {
    // Play sound immediately when answer is checked (not on Continue)
    if (correct) {
      playCorrectSound();
    }
  };

  const handleContinue = () => {
    // In practice mode, never end early due to hearts
    if (!isPracticeMode && hearts <= 0) {
      onComplete(correctAnswers, exercises.length);
      return;
    }

    if (currentIndex < exercises.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setExerciseCompleted(false);
    } else {
      onComplete(correctAnswers + (selectedAnswer === currentExercise.correctAnswer ? 0 : 0), exercises.length);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.surface,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingTop: 60,
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    exitButton: {
      width: 44,
      height: 44,
      padding: 0,
      minHeight: 44,
    },
    progressContainer: {
      flex: 1,
      marginHorizontal: 16,
    },
    heartsContainer: {
      flexDirection: 'row',
      gap: 4,
    },
    heart: {
      fontSize: 20,
    },
    content: {
      flex: 1,
    },
    contentContainer: {
      padding: 24,
      paddingBottom: 40,
    },
    footer: {
      padding: 20,
      paddingBottom: 40,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      backgroundColor: colors.surface,
    },
    resultContainer: {
      gap: 16,
    },
    resultBanner: {
      padding: 16,
      borderRadius: 12,
      borderWidth: 2,
    },
    correctBanner: {
      backgroundColor: '#E8F5E9',
      borderColor: colors.primary,
    },
    incorrectBanner: {
      backgroundColor: colors.errorLight,
      borderColor: colors.error,
    },
    resultText: {
      fontSize: 18,
      fontWeight: '700',
      textAlign: 'center',
    },
    correctText: {
      color: colors.primary,
    },
    incorrectText: {
      color: colors.error,
    },
  });

  const renderExercise = () => {
    switch (currentExercise.type) {
      case 'multiple_choice':
        return (
          <MultipleChoice
            exercise={currentExercise}
            selectedAnswer={selectedAnswer}
            onAnswerSelect={handleAnswerSelect}
            showResult={showResult}
          />
        );
      case 'fill_blank':
        return (
          <FillBlank
            exercise={currentExercise}
            selectedAnswer={selectedAnswer}
            onAnswerSelect={handleAnswerSelect}
            showResult={showResult}
          />
        );
      case 'matching':
        return (
          <MatchingExercise
            exercise={currentExercise}
            onComplete={handleMatchingComplete}
            showResult={showResult}
          />
        );
      case 'translation':
        return (
          <TranslationExercise
            exercise={currentExercise}
            onAnswer={handleSelfContainedExercise}
            onCheckAnswer={handleSoundOnCheck}
          />
        );
      case 'sentence_building':
        return (
          <SentenceBuildingExercise
            exercise={currentExercise}
            onAnswer={handleSelfContainedExercise}
            onCheckAnswer={handleSoundOnCheck}
          />
        );
      case 'listening':
        return (
          <ListeningExercise
            exercise={currentExercise}
            onAnswer={handleSelfContainedExercise}
          />
        );
      case 'speaking':
        return (
          <SpeakingExercise
            exercise={currentExercise}
            onAnswer={handleSelfContainedExercise}
          />
        );
      default:
        return (
          <MultipleChoice
            exercise={currentExercise}
            selectedAnswer={selectedAnswer}
            onAnswerSelect={handleAnswerSelect}
            showResult={showResult}
          />
        );
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Button title="✕" onPress={onExit} variant="secondary" style={styles.exitButton} />
        <View style={styles.progressContainer}>
          <ProgressBar progress={progress} />
        </View>
        {!isPracticeMode && (
          <View style={styles.heartsContainer}>
            {Array.from({ length: 3 }).map((_, i) => (
              <Text key={i} style={styles.heart}>
                {i < hearts ? '❤️' : '🤍'}
              </Text>
            ))}
          </View>
        )}
      </View>

      {/* Exercise Content */}
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {renderExercise()}
      </ScrollView>

      {/* Bottom Action */}
      <View style={styles.footer}>
        {/* Only show check/continue buttons for exercises that need them */}
        {!['translation', 'sentence_building', 'listening', 'speaking'].includes(currentExercise.type) && (
          <>
            {!showResult ? (
              <Button
                title="Check"
                onPress={handleCheckAnswer}
                disabled={!selectedAnswer && currentExercise.type !== 'matching'}
                fullWidth
              />
            ) : (
              <View style={styles.resultContainer}>
                <View
                  style={[
                    styles.resultBanner,
                    selectedAnswer === currentExercise.correctAnswer ||
                    currentExercise.type === 'matching'
                      ? styles.correctBanner
                      : styles.incorrectBanner,
                  ]}
                >
                  <Text
                    style={[
                      styles.resultText,
                      selectedAnswer === currentExercise.correctAnswer ||
                      currentExercise.type === 'matching'
                        ? styles.correctText
                        : styles.incorrectText,
                    ]}
                  >
                    {selectedAnswer === currentExercise.correctAnswer ||
                    (currentExercise.type === 'matching' && exerciseCompleted)
                      ? '✓ Correct!'
                      : '✗ Incorrect'}
                  </Text>
                </View>
                <Button
                  title={currentIndex < exercises.length - 1 ? 'Continue' : 'Finish'}
                  onPress={handleContinue}
                  variant="success"
                  fullWidth
                />
              </View>
            )}
          </>
        )}
      </View>
    </View>
  );
};

