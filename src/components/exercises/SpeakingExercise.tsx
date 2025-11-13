import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Exercise } from '../../types';
import { Button } from '../Button';
import { Card } from '../Card';

interface SpeakingExerciseProps {
  exercise: Exercise;
  onAnswer: (isCorrect: boolean) => void;
}

/**
 * Speaking Exercise Component - PLACEHOLDER
 *
 * This is a placeholder component that will be enhanced with speech recognition later.
 * Currently provides a visual interface similar to what the final component will look like.
 *
 * TODO: Integrate speech recognition and recording when audio features are available
 * - expo-av for audio recording
 * - Speech recognition API for pronunciation checking
 */
export const SpeakingExercise: React.FC<SpeakingExerciseProps> = ({
  exercise,
  onAnswer,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // Placeholder recording function
  const handleStartRecording = () => {
    // TODO: Implement audio recording with expo-av
    setIsRecording(true);
    console.log('Recording will be implemented later');

    // Simulate recording for 2 seconds
    setTimeout(() => {
      setIsRecording(false);
      setHasRecorded(true);
    }, 2000);
  };

  const handleStopRecording = () => {
    // TODO: Stop recording and process audio
    setIsRecording(false);
    setHasRecorded(true);
  };

  const handleSubmit = () => {
    // TODO: Compare recorded audio with correct pronunciation
    // For now, simulate a correct answer
    const correct = true; // Placeholder - will be determined by speech recognition
    setIsCorrect(correct);
    setShowResult(true);
    onAnswer(correct);
  };

  const handleContinue = () => {
    setIsRecording(false);
    setHasRecorded(false);
    setShowResult(false);
  };

  const handlePlayExample = () => {
    // TODO: Play example pronunciation
    console.log('Example audio playback will be implemented later');
  };

  return (
    <Card style={styles.container}>
      <Text style={styles.title}>Speak in Coptic:</Text>
      <Text style={styles.subtitle}>{exercise.question}</Text>

      {/* Coptic text to read */}
      {exercise.questionCoptic && (
        <View style={styles.copticBox}>
          <Text style={styles.copticText}>{exercise.questionCoptic}</Text>
        </View>
      )}

      {/* Example pronunciation button */}
      <TouchableOpacity
        style={styles.exampleButton}
        onPress={handlePlayExample}
        disabled={showResult}
      >
        <Text style={styles.exampleIcon}>🔊</Text>
        <Text style={styles.exampleText}>Listen to example</Text>
      </TouchableOpacity>

      {!showResult ? (
        <>
          {/* Recording interface */}
          <View style={styles.recordingContainer}>
            <TouchableOpacity
              style={[
                styles.recordButton,
                isRecording && styles.recordingActive,
                hasRecorded && styles.recordingComplete,
              ]}
              onPress={isRecording ? handleStopRecording : handleStartRecording}
              onLongPress={handleStartRecording}
            >
              <Text style={styles.recordIcon}>
                {isRecording ? '⏹️' : hasRecorded ? '✓' : '🎤'}
              </Text>
            </TouchableOpacity>

            <Text style={styles.recordLabel}>
              {isRecording
                ? 'Recording... Tap to stop'
                : hasRecorded
                ? 'Recording complete'
                : 'Tap to record'}
            </Text>

            {/* Development notice */}
            <View style={styles.placeholderBadge}>
              <Text style={styles.placeholderText}>Speech recognition coming soon</Text>
            </View>
          </View>

          <View style={styles.instructionBox}>
            <Text style={styles.instructionTitle}>💡 Tips:</Text>
            <Text style={styles.instructionText}>
              • Tap the microphone to start recording{'\n'}
              • Speak clearly in Coptic{'\n'}
              • Tap again to stop recording
            </Text>
          </View>

          <Button
            title="Check Pronunciation"
            onPress={handleSubmit}
            disabled={!hasRecorded}
            style={styles.button}
          />
        </>
      ) : (
        <View style={styles.resultContainer}>
          <View style={[styles.resultBox, isCorrect ? styles.correct : styles.incorrect]}>
            <Text style={styles.resultTitle}>
              {isCorrect ? '✓ Great pronunciation!' : '✗ Try again'}
            </Text>

            {!isCorrect && (
              <View style={styles.answerBox}>
                <Text style={styles.answerLabel}>Expected pronunciation:</Text>
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
    marginBottom: 8,
    color: '#1f2937',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    color: '#4b5563',
  },
  copticBox: {
    backgroundColor: '#f3f4f6',
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  copticText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#58CC02',
    textAlign: 'center',
  },
  exampleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f3f4f6',
    padding: 12,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  exampleIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  exampleText: {
    fontSize: 14,
    color: '#4b5563',
    fontWeight: '600',
  },
  recordingContainer: {
    backgroundColor: '#f9fafb',
    padding: 32,
    borderRadius: 16,
    marginBottom: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  recordButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ef4444',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  recordingActive: {
    backgroundColor: '#f97316',
    transform: [{ scale: 1.1 }],
  },
  recordingComplete: {
    backgroundColor: '#10b981',
  },
  recordIcon: {
    fontSize: 40,
  },
  recordLabel: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '600',
    marginBottom: 12,
  },
  placeholderBadge: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fbbf24',
  },
  placeholderText: {
    fontSize: 12,
    color: '#92400e',
    fontWeight: '600',
  },
  instructionBox: {
    backgroundColor: '#eff6ff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#dbeafe',
  },
  instructionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e40af',
    marginBottom: 8,
  },
  instructionText: {
    fontSize: 14,
    color: '#1e3a8a',
    lineHeight: 20,
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
    marginBottom: 4,
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
