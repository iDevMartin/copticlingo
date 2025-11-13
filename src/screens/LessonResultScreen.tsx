import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from '../components';

interface LessonResultScreenProps {
  correctCount: number;
  totalCount: number;
  xpEarned: number;
  onContinue: () => void;
}

export const LessonResultScreen: React.FC<LessonResultScreenProps> = ({
  correctCount,
  totalCount,
  xpEarned,
  onContinue,
}) => {
  const percentage = Math.round((correctCount / totalCount) * 100);
  const passed = percentage >= 60;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.emoji}>{passed ? '🎉' : '😔'}</Text>
        <Text style={styles.title}>{passed ? 'Great Job!' : 'Keep Practicing!'}</Text>

        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{percentage}%</Text>
            <Text style={styles.statLabel}>Accuracy</Text>
          </View>

          <View style={styles.statBox}>
            <Text style={styles.statValue}>
              {correctCount}/{totalCount}
            </Text>
            <Text style={styles.statLabel}>Correct</Text>
          </View>

          <View style={styles.statBox}>
            <Text style={[styles.statValue, styles.xpValue]}>+{xpEarned}</Text>
            <Text style={styles.statLabel}>XP Earned</Text>
          </View>
        </View>

        {!passed && (
          <View style={styles.encouragementBox}>
            <Text style={styles.encouragementText}>
              Don't worry! Practice makes perfect. Review the material and try again.
            </Text>
          </View>
        )}

        <Button title="Continue" onPress={onContinue} fullWidth variant="success" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
  },
  content: {
    padding: 24,
    alignItems: 'center',
  },
  emoji: {
    fontSize: 80,
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#3C3C3C',
    marginBottom: 40,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 32,
  },
  statBox: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#3C3C3C',
    marginBottom: 8,
  },
  xpValue: {
    color: '#58CC02',
  },
  statLabel: {
    fontSize: 14,
    color: '#777777',
    fontWeight: '600',
  },
  encouragementBox: {
    backgroundColor: '#FFF9C4',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#FDD835',
  },
  encouragementText: {
    fontSize: 14,
    color: '#3C3C3C',
    textAlign: 'center',
    lineHeight: 20,
  },
});
