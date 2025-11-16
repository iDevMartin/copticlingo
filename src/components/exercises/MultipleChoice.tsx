import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Exercise } from '../../types';
import { useTheme } from '../../theme/ThemeContext';

interface MultipleChoiceProps {
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

export const MultipleChoice: React.FC<MultipleChoiceProps> = ({
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

  const styles = StyleSheet.create({
    container: {
      gap: 16,
    },
    question: {
      fontSize: 20,
      fontWeight: '600',
      color: colors.textPrimary,
      marginBottom: 8,
      textAlign: 'center',
    },
    questionCoptic: {
      fontSize: 32,
      fontWeight: '700',
      color: colors.primary,
      marginBottom: 24,
      textAlign: 'center',
    },
    optionsContainer: {
      gap: 12,
    },
    option: {
      padding: 16,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: colors.border,
      backgroundColor: colors.surfaceSecondary,
      minHeight: 56,
      justifyContent: 'center',
    },
    selectedOption: {
      borderColor: colors.info,
      backgroundColor: colors.infoLight,
      borderWidth: 3,
    },
    correctOption: {
      borderColor: colors.primary,
      backgroundColor: colors.successLight,
      borderWidth: 3,
    },
    incorrectOption: {
      borderColor: colors.error,
      backgroundColor: colors.errorLight,
      borderWidth: 3,
    },
    optionText: {
      fontSize: 16,
      color: colors.textPrimary,
      textAlign: 'center',
      fontWeight: '600',
    },
    selectedOptionText: {
      color: colors.info,
      fontWeight: '700',
    },
    correctOptionText: {
      color: colors.primary,
      fontWeight: '700',
    },
    incorrectOptionText: {
      color: colors.error,
      fontWeight: '700',
    },
    checkmark: {
      fontSize: 20,
      color: colors.primary,
      fontWeight: '700',
      position: 'absolute',
      right: 16,
    },
    crossmark: {
      fontSize: 20,
      color: colors.error,
      fontWeight: '700',
      position: 'absolute',
      right: 16,
    },
    explanationBox: {
      marginTop: 16,
      padding: 16,
      backgroundColor: colors.warningLight,
      borderRadius: 12,
      borderWidth: 1,
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

  const getOptionStyle = (option: string) => {
    if (!showResult) {
      return option === selectedAnswer ? [styles.option, styles.selectedOption] : styles.option;
    }

    if (option === exercise.correctAnswer) {
      return [styles.option, styles.correctOption];
    }

    if (option === selectedAnswer && option !== exercise.correctAnswer) {
      return [styles.option, styles.incorrectOption];
    }

    return styles.option;
  };

  const getOptionTextStyle = (option: string) => {
    if (!showResult && option === selectedAnswer) {
      return [styles.optionText, styles.selectedOptionText];
    }

    if (showResult) {
      if (option === exercise.correctAnswer) {
        return [styles.optionText, styles.correctOptionText];
      }
      if (option === selectedAnswer && option !== exercise.correctAnswer) {
        return [styles.optionText, styles.incorrectOptionText];
      }
    }

    return styles.optionText;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.question}>{exercise.question}</Text>
      {exercise.questionCoptic && (
        <Text style={styles.questionCoptic}>{exercise.questionCoptic}</Text>
      )}

      <View style={styles.optionsContainer}>
        {shuffledOptions.map((option, index) => (
          <Pressable
            key={index}
            style={getOptionStyle(option)}
            onPress={() => !showResult && onAnswerSelect(option)}
            disabled={showResult}
          >
            <Text style={getOptionTextStyle(option)}>{option}</Text>
            {showResult && option === exercise.correctAnswer && (
              <Text style={styles.checkmark}>✓</Text>
            )}
            {showResult && option === selectedAnswer && option !== exercise.correctAnswer && (
              <Text style={styles.crossmark}>✗</Text>
            )}
          </Pressable>
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

