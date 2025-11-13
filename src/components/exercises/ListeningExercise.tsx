import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Exercise } from '../../types';
import { Button } from '../Button';
import { Card } from '../Card';

interface ListeningExerciseProps {
  exercise: Exercise;
  onAnswer: (isCorrect: boolean) => void;
}

/**
 * Listening Exercise Component - PLACEHOLDER
 *
 * This is a placeholder component that will be enhanced with audio functionality later.
 * Currently provides a visual interface similar to what the final component will look like.
 *
 * TODO: Integrate audio playback when audio files are available
 */
export const ListeningExercise: React.FC<ListeningExerciseProps> = ({
  exercise,
  onAnswer,
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleSubmit = () => {
    const correct = selectedAnswer === exercise.correctAnswer;
    setIsCorrect(correct);
    setShowResult(true);
    onAnswer(correct);
  };

  const handleContinue = () => {
    setSelectedAnswer(null);
    setShowResult(false);
  };

  // Placeholder audio playback function
  const handlePlayAudio = () => {
    // TODO: Implement audio playback with expo-av or react-native-sound
    // For now, this is just a visual placeholder
    console.log('Audio playback will be implemented later');
  };

  return (
    <Card style={styles.container}>
      <Text style={styles.title}>Listen and Select:</Text>
      <Text style={styles.subtitle}>{exercise.question}</Text>

      {/* Audio player placeholder */}
      <View style={styles.audioContainer}>
        <TouchableOpacity
          style={styles.playButton}
          onPress={handlePlayAudio}
          disabled={showResult}
        >
          <Text style={styles.playIcon}>🔊</Text>
        </TouchableOpacity>
        <Text style={styles.audioLabel}>Tap to play audio</Text>

        {/* Development notice */}
        <View style={styles.placeholderBadge}>
          <Text style={styles.placeholderText}>Audio feature coming soon</Text>
        </View>
      </View>

      {/* Options */}
      {!showResult ? (
        <View style={styles.optionsContainer}>
          {exercise.options?.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                selectedAnswer === option && styles.selectedOption,
              ]}
              onPress={() => setSelectedAnswer(option)}
            >
              <Text
                style={[
                  styles.optionText,
                  selectedAnswer === option && styles.selectedOptionText,
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <View style={styles.resultContainer}>
          <View style={[styles.resultBox, isCorrect ? styles.correct : styles.incorrect]}>
            <Text style={styles.resultTitle}>
              {isCorrect ? '✓ Correct!' : '✗ Not quite right'}
            </Text>

            {!isCorrect && (
              <View style={styles.answerBox}>
                <Text style={styles.answerLabel}>Your answer:</Text>
                <Text style={styles.userAnswerText}>{selectedAnswer}</Text>

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

      {!showResult && (
        <Button
          title="Check Answer"
          onPress={handleSubmit}
          disabled={!selectedAnswer}
          style={styles.button}
        />
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
    marginBottom: 8,
    color: '#1f2937',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
    color: '#4b5563',
  },
  audioContainer: {
    backgroundColor: '#f3f4f6',
    padding: 24,
    borderRadius: 16,
    marginBottom: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#58CC02',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  playIcon: {
    fontSize: 36,
  },
  audioLabel: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '600',
  },
  placeholderBadge: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#fbbf24',
  },
  placeholderText: {
    fontSize: 12,
    color: '#92400e',
    fontWeight: '600',
  },
  optionsContainer: {
    gap: 12,
    marginBottom: 20,
  },
  optionButton: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
  },
  selectedOption: {
    borderColor: '#58CC02',
    backgroundColor: '#f0fdf4',
  },
  optionText: {
    fontSize: 16,
    color: '#1f2937',
    textAlign: 'center',
    fontWeight: '500',
  },
  selectedOptionText: {
    color: '#58CC02',
    fontWeight: '600',
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
