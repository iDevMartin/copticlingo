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

interface LessonProps {
  exercises: Exercise[];
  onComplete: (correctCount: number, totalCount: number) => void;
  onExit: () => void;
}

export const LessonExercises: React.FC<LessonProps> = ({ exercises, onComplete, onExit }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [hearts, setHearts] = useState(3);
  const [exerciseCompleted, setExerciseCompleted] = useState(false);

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
    } else {
      setHearts(prev => prev - 1);
    }
  };

  const handleMatchingComplete = (correct: boolean) => {
    setShowResult(true);
    setExerciseCompleted(true);
    if (correct) {
      setCorrectAnswers(prev => prev + 1);
    } else {
      setHearts(prev => prev - 1);
    }
  };

  const handleSelfContainedExercise = (correct: boolean) => {
    // For Translation, SentenceBuilding, Listening, Speaking exercises
    // that handle their own state and just report results
    if (correct) {
      setCorrectAnswers(prev => prev + 1);
    } else {
      setHearts(prev => prev - 1);
    }

    // Auto-advance after a short delay
    setTimeout(() => {
      handleContinue();
    }, 2000);
  };

  const handleContinue = () => {
    if (hearts <= 0) {
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
          />
        );
      case 'sentence_building':
        return (
          <SentenceBuildingExercise
            exercise={currentExercise}
            onAnswer={handleSelfContainedExercise}
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
        <View style={styles.heartsContainer}>
          {Array.from({ length: 3 }).map((_, i) => (
            <Text key={i} style={styles.heart}>
              {i < hearts ? '❤️' : '🤍'}
            </Text>
          ))}
        </View>
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
                  <Text style={styles.resultText}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
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
    borderTopColor: '#E5E5E5',
  },
  resultContainer: {
    gap: 12,
  },
  resultBanner: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  correctBanner: {
    backgroundColor: '#E8F5E9',
  },
  incorrectBanner: {
    backgroundColor: '#FFEBEE',
  },
  resultText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#3C3C3C',
  },
});
