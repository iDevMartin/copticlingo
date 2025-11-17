import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Exercise } from '../../types';
import { Button } from '../Button';
import { useTheme } from '../../theme/ThemeContext';

interface MatchingExerciseProps {
  exercise: Exercise;
  onComplete: (correct: boolean) => void;
  showResult: boolean;
  onMatchesChange?: (allMatched: boolean) => void;
}

// Colors for matched pairs (excluding red/green)
const PAIR_COLORS = [
  { bg: '#E3F2FD', border: '#2196F3' }, // Blue
  { bg: '#F3E5F5', border: '#9C27B0' }, // Purple
  { bg: '#FFF3E0', border: '#FF9800' }, // Orange
  { bg: '#E0F2F1', border: '#009688' }, // Teal
  { bg: '#FFF9C4', border: '#FBC02D' }, // Yellow
  { bg: '#FCE4EC', border: '#E91E63' }, // Pink
];

// Utility function to shuffle array
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export const MatchingExercise: React.FC<MatchingExerciseProps> = ({
  exercise,
  onComplete,
  showResult,
  onMatchesChange,
}) => {
  const [selectedCopticIndex, setSelectedCopticIndex] = useState<number | null>(null);
  const [selectedEnglishIndex, setSelectedEnglishIndex] = useState<number | null>(null);
  const [matches, setMatches] = useState<{ [copticIndex: number]: number }>({});
  const [hasCalledOnComplete, setHasCalledOnComplete] = useState(false);
  const { colors } = useTheme();

  // Shuffle both Coptic and English options once when exercise changes
  const shuffledCoptic = useMemo(() => {
    return shuffleArray(exercise.pairs?.map(p => p.coptic) || []);
  }, [exercise.id]);

  const shuffledEnglish = useMemo(() => {
    return shuffleArray(exercise.pairs?.map(p => p.english) || []);
  }, [exercise.id]);

  // Reset state when exercise changes
  useEffect(() => {
    setSelectedCopticIndex(null);
    setSelectedEnglishIndex(null);
    setMatches({});
    setHasCalledOnComplete(false);
  }, [exercise.id]);

  // Notify parent when all pairs are matched
  useEffect(() => {
    if (onMatchesChange) {
      const allMatched = Object.keys(matches).length === exercise.pairs?.length;
      onMatchesChange(allMatched);
    }
  }, [matches, onMatchesChange, exercise.pairs?.length]);

  // When showResult becomes true, check the answer and call onComplete ONCE
  useEffect(() => {
    if (showResult && !hasCalledOnComplete && Object.keys(matches).length === exercise.pairs?.length) {
      const allCorrect = Object.keys(matches).every(copticIdx => {
        const coptic = shuffledCoptic[Number(copticIdx)];
        const english = shuffledEnglish[matches[Number(copticIdx)]];
        return isCorrectMatch(coptic, english);
      });
      setHasCalledOnComplete(true);
      onComplete(allCorrect);
    }
  }, [showResult, hasCalledOnComplete]);

  const handleCopticPress = (copticIndex: number) => {
    if (showResult) return;

    // If this item is already matched, allow deselecting
    if (matches[copticIndex] !== undefined) {
      const newMatches = { ...matches };
      delete newMatches[copticIndex];
      setMatches(newMatches);
      setSelectedCopticIndex(null);
      setSelectedEnglishIndex(null);
      return;
    }

    // If another coptic is selected, deselect it first
    if (selectedCopticIndex !== null && selectedCopticIndex !== copticIndex) {
      setSelectedCopticIndex(copticIndex);
      return;
    }

    setSelectedCopticIndex(copticIndex);

    // If english is already selected, create the match
    if (selectedEnglishIndex !== null) {
      const newMatches = { ...matches, [copticIndex]: selectedEnglishIndex };
      setMatches(newMatches);
      setSelectedCopticIndex(null);
      setSelectedEnglishIndex(null);
    }
  };

  const handleEnglishPress = (englishIndex: number) => {
    if (showResult) return;

    // Check if this English index is already matched
    const matchedCopticIndex = Object.keys(matches).find(
      key => matches[Number(key)] === englishIndex
    );

    // If matched, allow deselecting by clicking the matched English
    if (matchedCopticIndex !== undefined) {
      const newMatches = { ...matches };
      delete newMatches[Number(matchedCopticIndex)];
      setMatches(newMatches);
      setSelectedCopticIndex(null);
      setSelectedEnglishIndex(null);
      return;
    }

    // If another english is selected, deselect it first
    if (selectedEnglishIndex !== null && selectedEnglishIndex !== englishIndex) {
      setSelectedEnglishIndex(englishIndex);
      return;
    }

    setSelectedEnglishIndex(englishIndex);

    // If coptic is already selected, create the match
    if (selectedCopticIndex !== null) {
      const newMatches = { ...matches, [selectedCopticIndex]: englishIndex };
      setMatches(newMatches);
      setSelectedCopticIndex(null);
      setSelectedEnglishIndex(null);
    }
  };

  const isCorrectMatch = (coptic: string, english: string) => {
    return exercise.pairs?.some(
      pair => pair.coptic === coptic && pair.english === english
    );
  };

  // Get the match number (0-5) for a coptic index
  const getMatchNumber = (copticIndex: number): number => {
    // Find the position of this coptic index in the sorted list of matched indices
    const sortedMatchedIndices = Object.keys(matches)
      .map(Number)
      .sort((a, b) => a - b);
    const position = sortedMatchedIndices.indexOf(copticIndex);
    return position % PAIR_COLORS.length;
  };

  const getMatchStyle = (copticIndex: number) => {
    if (matches[copticIndex] === undefined) return null;

    if (!showResult) {
      // Before checking, show each matched pair with a different color
      const colorIndex = getMatchNumber(copticIndex);
      const pairColor = PAIR_COLORS[colorIndex];
      return {
        backgroundColor: pairColor.bg,
        borderColor: pairColor.border,
        borderWidth: 2,
      };
    }

    // After checking, show green for correct, red for incorrect
    const coptic = shuffledCoptic[copticIndex];
    const english = shuffledEnglish[matches[copticIndex]];
    return isCorrectMatch(coptic, english) ? styles.correctMatch : styles.incorrectMatch;
  };

  const getEnglishMatchStyle = (englishIndex: number) => {
    const matchedCopticIndex = Object.keys(matches).find(
      key => matches[Number(key)] === englishIndex
    );

    if (matchedCopticIndex === undefined) return null;

    if (!showResult) {
      // Before checking, show each matched pair with a different color
      const colorIndex = getMatchNumber(Number(matchedCopticIndex));
      const pairColor = PAIR_COLORS[colorIndex];
      return {
        backgroundColor: pairColor.bg,
        borderColor: pairColor.border,
        borderWidth: 2,
      };
    }

    // After checking, show green for correct, red for incorrect
    const coptic = shuffledCoptic[Number(matchedCopticIndex)];
    const english = shuffledEnglish[englishIndex];
    return isCorrectMatch(coptic, english) ? styles.correctMatch : styles.incorrectMatch;
  };

  const getMatchTextStyle = (isMatched: boolean) => {
    if (!showResult && isMatched) {
      // Before checking, use dark text for matched pairs so it's readable
      return { color: '#1a1a1a' };
    }
    return undefined;
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    question: {
      fontSize: 22,
      fontWeight: '700',
      color: colors.textPrimary,
      marginBottom: 24,
      textAlign: 'center',
    },
    matchingContainer: {
      flexDirection: 'row',
      gap: 12,
    },
    column: {
      flex: 1,
      gap: 12,
    },
    matchButton: {
      minHeight: 60,
    },
    correctMatch: {
      backgroundColor: colors.successLight,
      borderColor: colors.primary,
      borderWidth: 2,
    },
    incorrectMatch: {
      backgroundColor: colors.errorLight,
      borderColor: colors.error,
      borderWidth: 2,
    },
    explanationBox: {
      marginTop: 24,
      paddingTop: 12,
      paddingBottom: 8,
      paddingHorizontal: 12,
      backgroundColor: colors.warningLight,
      borderRadius: 8,
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
  });

  return (
    <View style={styles.container}>
      <Text style={styles.question}>{exercise.question}</Text>

      <View style={styles.matchingContainer}>
        <View style={styles.column}>
          {shuffledCoptic.map((coptic, index) => {
            const isMatched = matches[index] !== undefined;
            const isSelected = selectedCopticIndex === index;
            return (
              <Button
                key={index}
                title={coptic}
                onPress={() => handleCopticPress(index)}
                variant={isSelected && !isMatched ? 'primary' : 'secondary'}
                disabled={showResult}
                style={[
                  styles.matchButton,
                  getMatchStyle(index),
                ]}
                textStyle={getMatchTextStyle(isMatched)}
              />
            );
          })}
        </View>

        <View style={styles.column}>
          {shuffledEnglish.map((english, index) => {
            const matchedCopticIndex = Object.keys(matches).find(
              key => matches[Number(key)] === index
            );
            const isMatched = matchedCopticIndex !== undefined;
            const isSelected = selectedEnglishIndex === index;
            return (
              <Button
                key={index}
                title={english}
                onPress={() => handleEnglishPress(index)}
                variant={isSelected && !isMatched ? 'primary' : 'secondary'}
                disabled={showResult}
                style={[
                  styles.matchButton,
                  getEnglishMatchStyle(index),
                ]}
                textStyle={getMatchTextStyle(isMatched)}
              />
            );
          })}
        </View>
      </View>

      {showResult && exercise.explanation && (
        <View style={styles.explanationBox}>
          <Text style={styles.explanationTitle}>Explanation:</Text>
          <Text style={styles.explanationText}>{exercise.explanation}</Text>
        </View>
      )}
    </View>
  );
};
