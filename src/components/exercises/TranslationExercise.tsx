import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Exercise } from '../../types';
import { Button } from '../Button';
import { Card } from '../Card';
import { useTheme } from '../../theme/ThemeContext';

interface TranslationExerciseProps {
  exercise: Exercise;
  onAnswer: (isCorrect: boolean) => void;
  onCheckAnswer?: (isCorrect: boolean) => void;
}

// Utility function to shuffle array
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export const TranslationExercise: React.FC<TranslationExerciseProps> = ({
  exercise,
  onAnswer,
  onCheckAnswer,
}) => {
  const [userAnswer, setUserAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);
  const { colors } = useTheme();

  // Reset state when exercise changes
  useEffect(() => {
    setUserAnswer('');
    setShowResult(false);
    setIsCorrect(false);
    if (exercise.options) {
      setShuffledOptions(shuffleArray([...exercise.options]));
    }
  }, [exercise.id]);

  const handleSubmit = () => {
    // Normalize strings for comparison (trim, lowercase, remove extra spaces)
    const normalizedUserAnswer = userAnswer.trim().toLowerCase().replace(/\s+/g, ' ');
    const normalizedCorrect = exercise.correctAnswer.toLowerCase().trim().replace(/\s+/g, ' ');

    // Check if answer is correct (exact match or close enough)
    const correct = normalizedUserAnswer === normalizedCorrect;

    setIsCorrect(correct);
    setShowResult(true);

    // Call onCheckAnswer to play sound immediately
    if (onCheckAnswer) {
      onCheckAnswer(correct);
    }
  };

  const handleContinue = () => {
    // Call onAnswer when user presses Continue
    onAnswer(isCorrect);
    // State will reset when exercise prop changes to next question
  };

  const styles = StyleSheet.create({
    container: {
      padding: 20,
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 20,
      color: colors.textPrimary,
    },
    copticBox: {
      backgroundColor: colors.surfaceSecondary,
      padding: 16,
      borderRadius: 12,
      marginBottom: 16,
      alignItems: 'center',
    },
    copticText: {
      fontSize: 28,
      fontWeight: 'bold',
      color: colors.primary,
      textAlign: 'center',
    },
    question: {
      fontSize: 16,
      marginBottom: 20,
      color: colors.textSecondary,
    },
    input: {
      borderWidth: 2,
      borderColor: colors.border,
      borderRadius: 12,
      padding: 16,
      fontSize: 16,
      marginBottom: 20,
      minHeight: 60,
      color: colors.textPrimary,
      backgroundColor: colors.surface,
    },
    button: {
      marginBottom: 16,
    },
    hintBox: {
      backgroundColor: colors.warningLight,
      padding: 16,
      borderRadius: 12,
      marginTop: 8,
    },
    hintTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.warning,
      marginBottom: 8,
    },
    hintOption: {
      paddingVertical: 4,
    },
    hintText: {
      fontSize: 14,
      color: colors.warning,
    },
    resultContainer: {
      marginTop: 20,
    },
    resultBox: {
      padding: 20,
      borderRadius: 12,
      marginBottom: 20,
    },
    correct: {
      backgroundColor: '#E8F5E9',
      borderWidth: 2,
      borderColor: colors.primary,
    },
    incorrect: {
      backgroundColor: colors.errorLight,
      borderWidth: 2,
      borderColor: colors.error,
    },
    resultTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 12,
    },
    resultTitleCorrect: {
      color: colors.primary,
    },
    resultTitleIncorrect: {
      color: colors.error,
    },
    answerBox: {
      marginBottom: 16,
    },
    answerLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.textSecondary,
      marginTop: 8,
      marginBottom: 4,
    },
    userAnswerText: {
      fontSize: 16,
      color: colors.error,
      marginBottom: 8,
    },
    correctAnswerText: {
      fontSize: 16,
      color: colors.primary,
      fontWeight: '600',
    },
    explanationBox: {
      marginTop: 12,
      paddingTop: 12,
      paddingBottom: 8,
      paddingHorizontal: 12,
      backgroundColor: colors.warningLight,
      borderRadius: 8,
      borderTopWidth: 0,
    },
    explanationTitle: {
      fontSize: 15,
      fontWeight: '700',
      color: colors.warning,
      marginBottom: 6,
    },
    explanationText: {
      fontSize: 15,
      fontWeight: '500',
      color: colors.textPrimary,
      lineHeight: 22,
    },
    continueButton: {
      marginTop: 8,
    },
  });

  return (
    <Card style={styles.container}>
      <Text style={styles.title}>Translate to English:</Text>

      {exercise.questionCoptic && (
        <View style={styles.copticBox}>
          <Text style={styles.copticText}>{exercise.questionCoptic}</Text>
        </View>
      )}

      <Text style={styles.question}>{exercise.question}</Text>

      {!showResult ? (
        <>
          <TextInput
            style={styles.input}
            value={userAnswer}
            onChangeText={setUserAnswer}
            placeholder="Type your answer in English..."
            placeholderTextColor="#999"
            autoCapitalize="none"
            autoCorrect={false}
            multiline
          />

          <Button
            title="Check Answer"
            onPress={handleSubmit}
            disabled={!userAnswer.trim()}
            style={styles.button}
          />

          {shuffledOptions.length > 0 && (
            <View style={styles.hintBox}>
              <Text style={styles.hintTitle}>Hint - Choose from:</Text>
              {shuffledOptions.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.hintOption}
                  onPress={() => setUserAnswer(option)}
                >
                  <Text style={styles.hintText}>• {option}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </>
      ) : (
        <View style={styles.resultContainer}>
          <View style={[styles.resultBox, isCorrect ? styles.correct : styles.incorrect]}>
            <Text style={[styles.resultTitle, isCorrect ? styles.resultTitleCorrect : styles.resultTitleIncorrect]}>
              {isCorrect ? '✓ Correct!' : '✗ Not quite right'}
            </Text>

            {!isCorrect && (
              <View style={styles.answerBox}>
                <Text style={styles.answerLabel}>Your answer:</Text>
                <Text style={styles.userAnswerText}>{userAnswer}</Text>

                <Text style={styles.answerLabel}>Correct answer:</Text>
                <Text style={styles.correctAnswerText}>{exercise.correctAnswer}</Text>
              </View>
            )}

            {exercise.explanation && (
              <View style={styles.explanationBox}>
                <Text style={styles.explanationTitle}>Explanation:</Text>
                <Text style={styles.explanationText}>{exercise.explanation}</Text>
              </View>
            )}
          </View>

          <Button title="Continue" onPress={handleContinue} style={styles.continueButton} />
        </View>
      )}
    </Card>
  );
};
