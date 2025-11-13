import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface LessonNodeProps {
  title: string;
  color: string;
  locked: boolean;
  completed: boolean;
  current?: boolean;
  onPress: () => void;
}

export const LessonNode: React.FC<LessonNodeProps> = ({
  title,
  color,
  locked,
  completed,
  current = false,
  onPress,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.node,
          { backgroundColor: locked ? '#E5E5E5' : color },
          current && styles.currentNode,
        ]}
        onPress={onPress}
        disabled={locked}
        activeOpacity={0.7}
      >
        <Text style={[styles.icon, locked && styles.lockedIcon]}>
          {completed ? '✓' : locked ? '🔒' : '📖'}
        </Text>
      </TouchableOpacity>
      <Text style={styles.title} numberOfLines={2}>
        {title}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 12,
    width: 100,
  },
  node: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'transparent',
  },
  currentNode: {
    borderColor: '#FFD700',
    borderWidth: 4,
  },
  icon: {
    fontSize: 32,
  },
  lockedIcon: {
    fontSize: 28,
  },
  title: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: '600',
    color: '#3C3C3C',
    textAlign: 'center',
  },
});
