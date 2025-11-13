import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Exercise } from '../../types';
import { Button } from '../Button';
import { Card } from '../Card';

interface TranslationExerciseProps {
  exercise: Exercise;
  onAnswer: (isCorrect: boolean) => void;
}

export const TranslationExercise: React.FC<TranslationExerciseProps> = ({
  exercise,
  onAnswer,
}) => {
  const [userAnswer, setUserAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleSubmit = () => {
    // Normalize strings for comparison (trim, lowercase, remove extra spaces)
    const normalizedUserAnswer = userAnswer.trim().toLowerCase().replace(/\s+/g, ' ');
    const normalizedCorrect = exercise.correctAnswer.toLowerCase().trim().replace(/\s+/g, ' ');

    // Check if answer is correct (exact match or close enough)
    const correct = normalizedUserAnswer === normalizedCorrect;

    setIsCorrect(correct);
    setShowResult(true);
    onAnswer(correct);
  };

  const handleContinue = () => {
    setUserAnswer('');
    setShowResult(false);
  };

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

          {exercise.options && exercise.options.length > 0 && (
            <View style={styles.hintBox}>
              <Text style={styles.hintTitle}>Hint - Choose from:</Text>
              {exercise.options.map((option, index) => (
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
            <Text style={styles.resultTitle}>
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

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#1f2937',
  },
  copticBox: {
    backgroundColor: '#f3f4f6',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  copticText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#58CC02',
    textAlign: 'center',
  },
  question: {
    fontSize: 16,
    marginBottom: 20,
    color: '#4b5563',
  },
  input: {
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 20,
    minHeight: 60,
    color: '#1f2937',
    backgroundColor: '#fff',
  },
  button: {
    marginBottom: 16,
  },
  hintBox: {
    backgroundColor: '#fef3c7',
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  hintTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400e',
    marginBottom: 8,
  },
  hintOption: {
    paddingVertical: 4,
  },
  hintText: {
    fontSize: 14,
    color: '#78350f',
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
    backgroundColor: '#d1fae5',
    borderWidth: 2,
    borderColor: '#10b981',
  },
  incorrect: {
    backgroundColor: '#fee2e2',
    borderWidth: 2,
    borderColor: '#ef4444',
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#1f2937',
  },
  answerBox: {
    marginBottom: 16,
  },
  answerLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    marginTop: 8,
    marginBottom: 4,
  },
  userAnswerText: {
    fontSize: 16,
    color: '#ef4444',
    marginBottom: 8,
  },
  correctAnswerText: {
    fontSize: 16,
    color: '#10b981',
    fontWeight: '600',
  },
  explanationBox: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#d1d5db',
  },
  explanationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 4,
  },
  explanationText: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
  },
  continueButton: {
    marginTop: 8,
  },
});
