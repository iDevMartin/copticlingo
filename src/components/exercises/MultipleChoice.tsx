import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Exercise } from '../../types';

interface MultipleChoiceProps {
  exercise: Exercise;
  selectedAnswer: string | null;
  onAnswerSelect: (answer: string) => void;
  showResult: boolean;
}

export const MultipleChoice: React.FC<MultipleChoiceProps> = ({
  exercise,
  selectedAnswer,
  onAnswerSelect,
  showResult,
}) => {
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

  return (
    <View style={styles.container}>
      <Text style={styles.question}>{exercise.question}</Text>
      {exercise.questionCoptic && (
        <Text style={styles.questionCoptic}>{exercise.questionCoptic}</Text>
      )}

      <View style={styles.optionsContainer}>
        {exercise.options?.map((option, index) => (
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
            {showResult && option === selectedAnswer && option !== exercise.correctAnswer && (
              <Text style={styles.crossmark}>✗</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  question: {
    fontSize: 22,
    fontWeight: '700',
    color: '#3C3C3C',
    marginBottom: 12,
    textAlign: 'center',
  },
  questionCoptic: {
    fontSize: 36,
    fontWeight: '700',
    color: '#58CC02',
    marginBottom: 32,
    textAlign: 'center',
  },
  optionsContainer: {
    gap: 12,
  },
  option: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedOption: {
    backgroundColor: '#E3F2FD',
    borderWidth: 2,
    borderColor: '#2196F3',
    borderRadius: 12,
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  correctOption: {
    backgroundColor: '#E8F5E9',
    borderWidth: 2,
    borderColor: '#58CC02',
    borderRadius: 12,
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  incorrectOption: {
    backgroundColor: '#FFEBEE',
    borderWidth: 2,
    borderColor: '#FF4B4B',
    borderRadius: 12,
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    color: '#3C3C3C',
    fontWeight: '600',
    flex: 1,
  },
  checkmark: {
    fontSize: 24,
    color: '#58CC02',
  },
  crossmark: {
    fontSize: 24,
    color: '#FF4B4B',
  },
  explanationBox: {
    marginTop: 24,
    backgroundColor: '#FFF9C4',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#FDD835',
  },
  explanationTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#3C3C3C',
    marginBottom: 8,
  },
  explanationText: {
    fontSize: 14,
    color: '#3C3C3C',
    lineHeight: 20,
  },
});
