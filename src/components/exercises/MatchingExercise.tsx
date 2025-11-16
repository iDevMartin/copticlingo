import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Exercise } from '../../types';
import { Button } from '../Button';

interface MatchingExerciseProps {
  exercise: Exercise;
  onComplete: (correct: boolean) => void;
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

export const MatchingExercise: React.FC<MatchingExerciseProps> = ({
  exercise,
  onComplete,
  showResult,
}) => {
  const [selectedCoptic, setSelectedCoptic] = useState<string | null>(null);
  const [selectedEnglish, setSelectedEnglish] = useState<string | null>(null);
  const [matches, setMatches] = useState<{ [key: string]: string }>({});

  // Shuffle both Coptic and English options once when exercise changes
  const shuffledCoptic = useMemo(() => {
    return shuffleArray(exercise.pairs?.map(p => p.coptic) || []);
  }, [exercise.id]);

  const shuffledEnglish = useMemo(() => {
    return shuffleArray(exercise.pairs?.map(p => p.english) || []);
  }, [exercise.id]);

  const handleCopticPress = (coptic: string) => {
    if (showResult) return;

    // If clicking an already matched item, allow unmatching only if incorrect
    if (matches[coptic]) {
      // Check if it's a correct match
      if (isCorrectMatch(coptic, matches[coptic])) {
        // Don't allow unmatching correct matches
        return;
      }
      // Unmatch incorrect matches to try again
      const newMatches = { ...matches };
      delete newMatches[coptic];
      setMatches(newMatches);
      setSelectedCoptic(null);
      setSelectedEnglish(null);
      return;
    }

    setSelectedCoptic(coptic);

    if (selectedEnglish) {
      const newMatches = { ...matches, [coptic]: selectedEnglish };
      setMatches(newMatches);
      setSelectedCoptic(null);
      setSelectedEnglish(null);

      if (Object.keys(newMatches).length === exercise.pairs?.length) {
        const allCorrect = exercise.pairs?.every(
          pair => newMatches[pair.coptic] === pair.english
        );
        setTimeout(() => onComplete(allCorrect || false), 500);
      }
    }
  };

  const handleEnglishPress = (english: string) => {
    if (showResult) return;

    // Check if this English word is already correctly matched - if so, don't allow selection
    if (isEnglishCorrectlyMatched(english)) {
      return;
    }

    setSelectedEnglish(english);

    if (selectedCoptic) {
      const newMatches = { ...matches, [selectedCoptic]: english };
      setMatches(newMatches);
      setSelectedCoptic(null);
      setSelectedEnglish(null);

      if (Object.keys(newMatches).length === exercise.pairs?.length) {
        const allCorrect = exercise.pairs?.every(
          pair => newMatches[pair.coptic] === pair.english
        );
        setTimeout(() => onComplete(allCorrect || false), 500);
      }
    }
  };

  const isMatched = (item: string) => {
    return Object.keys(matches).includes(item) || Object.values(matches).includes(item);
  };

  const isCorrectMatch = (coptic: string, english: string) => {
    return exercise.pairs?.some(
      pair => pair.coptic === coptic && pair.english === english
    );
  };

  const isEnglishCorrectlyMatched = (english: string) => {
    // Check if this English word is matched and the match is correct
    const matchedCoptic = Object.keys(matches).find(key => matches[key] === english);
    if (!matchedCoptic) return false;
    return isCorrectMatch(matchedCoptic, english);
  };

  const getMatchStyle = (coptic: string, english: string) => {
    if (!matches[coptic]) return null;
    return isCorrectMatch(coptic, english) ? styles.correctMatch : styles.incorrectMatch;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.question}>{exercise.question}</Text>

      <View style={styles.matchingContainer}>
        <View style={styles.column}>
          {shuffledCoptic.map((coptic, index) => {
            const isMatchedLeft = matches[coptic] !== undefined;
            return (
              <Button
                key={index}
                title={coptic}
                onPress={() => handleCopticPress(coptic)}
                variant={selectedCoptic === coptic ? 'primary' : 'secondary'}
                disabled={showResult || isMatchedLeft}
                style={[
                  styles.matchButton,
                  isMatchedLeft && styles.matchedButton,
                  matches[coptic] && getMatchStyle(coptic, matches[coptic]),
                ]}
              />
            );
          })}
        </View>

        <View style={styles.column}>
          {shuffledEnglish.map((english, index) => {
            const correctlyMatched = isEnglishCorrectlyMatched(english);
            return (
              <Button
                key={index}
                title={english}
                onPress={() => handleEnglishPress(english)}
                variant={selectedEnglish === english ? 'primary' : 'secondary'}
                disabled={showResult || correctlyMatched}
                style={[
                  styles.matchButton,
                  correctlyMatched && styles.matchedButton,
                ]}
              />
            );
          })}
        </View>
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
  matchedButton: {
    opacity: 0.5,
  },
  correctMatch: {
    backgroundColor: '#58CC02',
  },
  incorrectMatch: {
    backgroundColor: '#FF4B4B',
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
