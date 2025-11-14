import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Exercise } from '../../types';
import { Button } from '../Button';
import { Card } from '../Card';
import { useTheme } from '../../theme/ThemeContext';

interface SentenceBuildingProps {
  exercise: Exercise;
  onAnswer: (isCorrect: boolean) => void;
}

export const SentenceBuildingExercise: React.FC<SentenceBuildingProps> = ({
  exercise,
  onAnswer,
}) => {
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [availableWords, setAvailableWords] = useState<string[]>(
    exercise.wordBank ? shuffleArray([...exercise.wordBank]) : []
  );
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const { colors } = useTheme();

  const handleWordSelect = (word: string, index: number, fromAvailable: boolean) => {
    if (showResult) return;

    if (fromAvailable) {
      // Move word from available to selected
      setSelectedWords([...selectedWords, word]);
      // Remove only the specific index from available words
      setAvailableWords(availableWords.filter((_, i) => i !== index));
    } else {
      // Move word from selected back to available
      // Remove only the specific index from selected words
      setSelectedWords(selectedWords.filter((_, i) => i !== index));
      setAvailableWords([...availableWords, word]);
    }
  };

  const handleSubmit = () => {
    // Join selected words with spaces and compare
    const userAnswer = selectedWords.join(' ');
    const correct = userAnswer === exercise.correctAnswer;

    setIsCorrect(correct);
    setShowResult(true);
    // Don't call onAnswer here - wait for user to press Continue
  };

  const handleContinue = () => {
    // Call onAnswer when user presses Continue
    onAnswer(isCorrect);
    setSelectedWords([]);
    setAvailableWords(exercise.wordBank ? shuffleArray([...exercise.wordBank]) : []);
    setShowResult(false);
  };

  const styles = StyleSheet.create({
    container: {
      padding: 20,
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 12,
      color: colors.textPrimary,
    },
    question: {
      fontSize: 16,
      marginBottom: 24,
      color: colors.textSecondary,
    },
    answerArea: {
      marginBottom: 24,
    },
    wordBankArea: {
      marginBottom: 24,
    },
    areaLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.textSecondary,
      marginBottom: 12,
    },
    wordsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      minHeight: 60,
      backgroundColor: colors.surfaceSecondary,
      padding: 12,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: colors.border,
    },
    placeholder: {
      fontSize: 14,
      color: colors.textTertiary,
      fontStyle: 'italic',
      alignSelf: 'center',
      textAlign: 'center',
      flex: 1,
    },
    wordChip: {
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 20,
      borderWidth: 2,
    },
    selectedWordChip: {
      backgroundColor: colors.infoLight,
      borderColor: colors.info,
    },
    availableWordChip: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
    },
    correctChip: {
      backgroundColor: '#E8F5E9',
      borderColor: colors.primary,
    },
    incorrectChip: {
      backgroundColor: colors.errorLight,
      borderColor: colors.error,
    },
    wordText: {
      fontSize: 16,
      color: colors.textPrimary,
      fontWeight: '500',
    },
    button: {
      marginTop: 8,
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
      marginBottom: 4,
    },
    correctAnswerText: {
      fontSize: 16,
      color: colors.primary,
      fontWeight: '600',
    },
    explanationBox: {
      marginTop: 12,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    explanationTitle: {
      fontSize: 14,
      fontWeight: '700',
      color: colors.warning,
      marginBottom: 4,
    },
    explanationText: {
      fontSize: 14,
      fontWeight: '500',
      color: colors.textPrimary,
      lineHeight: 20,
    },
    continueButton: {
      marginTop: 8,
    },
  });

  return (
    <Card style={styles.container}>
      <Text style={styles.title}>Build the Sentence:</Text>
      <Text style={styles.question}>{exercise.question}</Text>

      {/* Selected words area */}
      <View style={styles.answerArea}>
        <Text style={styles.areaLabel}>Your Answer:</Text>
        <View style={styles.wordsContainer}>
          {selectedWords.length === 0 ? (
            <Text style={styles.placeholder}>Tap words below to build your answer...</Text>
          ) : (
            selectedWords.map((word, index) => (
              <TouchableOpacity
                key={`selected-${index}`}
                style={[
                  styles.wordChip,
                  styles.selectedWordChip,
                  showResult && (isCorrect ? styles.correctChip : styles.incorrectChip),
                ]}
                onPress={() => handleWordSelect(word, index, false)}
                disabled={showResult}
              >
                <Text style={styles.wordText}>{word}</Text>
              </TouchableOpacity>
            ))
          )}
        </View>
      </View>

      {/* Available words */}
      {!showResult && (
        <View style={styles.wordBankArea}>
          <Text style={styles.areaLabel}>Available Words:</Text>
          <View style={styles.wordsContainer}>
            {availableWords.map((word, index) => (
              <TouchableOpacity
                key={`available-${index}`}
                style={[styles.wordChip, styles.availableWordChip]}
                onPress={() => handleWordSelect(word, index, true)}
              >
                <Text style={styles.wordText}>{word}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {!showResult ? (
        <Button
          title="Check Answer"
          onPress={handleSubmit}
          disabled={selectedWords.length === 0}
          style={styles.button}
        />
      ) : (
        <View style={styles.resultContainer}>
          <View style={[styles.resultBox, isCorrect ? styles.correct : styles.incorrect]}>
            <Text style={[styles.resultTitle, isCorrect ? styles.resultTitleCorrect : styles.resultTitleIncorrect]}>
              {isCorrect ? '✓ Perfect!' : '✗ Not quite right'}
            </Text>

            {!isCorrect && (
              <View style={styles.answerBox}>
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

// Utility function to shuffle array
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}
