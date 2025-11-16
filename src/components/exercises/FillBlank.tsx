import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Exercise } from '../../types';
import { useTheme } from '../../theme/ThemeContext';

interface FillBlankProps {
  exercise: Exercise;
  selectedAnswer: string | null;
  onAnswerSelect: (answer: string) => void;
  showResult: boolean;
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

export const FillBlank: React.FC<FillBlankProps> = ({
  exercise,
  selectedAnswer,
  onAnswerSelect,
  showResult,
}) => {
  const { colors } = useTheme();
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);

  // Shuffle options when exercise changes
  useEffect(() => {
    if (exercise.options) {
      setShuffledOptions(shuffleArray([...exercise.options]));
    }
  }, [exercise.id]);

  const getOptionStyle = (option: string) => {
    if (!showResult) {
      return option === selectedAnswer ? styles.selectedOption : styles.option;
    }

    if (option === exercise.correctAnswer) {
      return styles.correctOption;
    }

    if (option === selectedAnswer && option !== exercise.correctAnswer) {
      return styles.incorrectOption;
    }

    return styles.option;
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    question: {
      fontSize: 22,
      fontWeight: '700',
      color: colors.textPrimary,
      marginBottom: 32,
      textAlign: 'center',
    },
    optionsContainer: {
      gap: 12,
    },
    option: {
      backgroundColor: colors.surface,
      borderWidth: 2,
      borderColor: colors.border,
      borderRadius: 12,
      padding: 18,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    selectedOption: {
      backgroundColor: colors.infoLight,
      borderWidth: 2,
      borderColor: colors.info,
      borderRadius: 12,
      padding: 18,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    correctOption: {
      backgroundColor: colors.successLight,
      borderWidth: 2,
      borderColor: colors.primary,
      borderRadius: 12,
      padding: 18,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    incorrectOption: {
      backgroundColor: colors.errorLight,
      borderWidth: 2,
      borderColor: colors.error,
      borderRadius: 12,
      padding: 18,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    optionText: {
      fontSize: 16,
      color: colors.textPrimary,
      fontWeight: '600',
    },
    checkmark: {
      fontSize: 24,
      color: colors.primary,
    },
    explanationBox: {
      marginTop: 24,
      backgroundColor: colors.warningLight,
      borderRadius: 12,
      padding: 16,
      borderWidth: 2,
      borderColor: colors.warning,
    },
    explanationTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.textPrimary,
      marginBottom: 8,
    },
    explanationText: {
      fontSize: 14,
      color: colors.textPrimary,
      lineHeight: 20,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.question}>{exercise.question}</Text>

      <View style={styles.optionsContainer}>
        {shuffledOptions.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={getOptionStyle(option)}
            onPress={() => !showResult && onAnswerSelect(option)}
            disabled={showResult}
            activeOpacity={0.7}
          >
            <Text style={styles.optionText}>{option}</Text>
            {showResult && option === exercise.correctAnswer && (
              <Text style={styles.checkmark}>✓</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {showResult && exercise.explanation && (
        <View style={styles.explanationBox}>
          <Text style={styles.explanationTitle}>💡 Explanation</Text>
          <Text style={styles.explanationText}>{exercise.explanation}</Text>
        </View>
      )}
    </View>
  );
};
