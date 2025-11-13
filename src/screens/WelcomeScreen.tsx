import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Button } from '../components';

interface WelcomeScreenProps {
  onComplete: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onComplete }) => {
  const [name, setName] = useState('');

  const handleStart = () => {
    if (name.trim()) {
      onComplete();
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text style={styles.title}>Welcome to CopticLingo!</Text>
          <Text style={styles.copticTitle}>ⲙⲁⲣⲓ ⲉⲣϩⲱⲃ!</Text>

          <View style={styles.infoBox}>
            <Text style={styles.emoji}>📚</Text>
            <Text style={styles.infoText}>
              Learn the ancient Coptic language through interactive lessons
            </Text>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.emoji}>🎯</Text>
            <Text style={styles.infoText}>
              Practice with fun exercises and track your progress
            </Text>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.emoji}>🔥</Text>
            <Text style={styles.infoText}>
              Build daily streaks and earn achievements
            </Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>What should we call you?</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your name"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              autoCorrect={false}
            />
          </View>

          <Button
            title="Start Learning"
            onPress={handleStart}
            disabled={!name.trim()}
            fullWidth
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  content: {
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#3C3C3C',
    textAlign: 'center',
    marginBottom: 8,
  },
  copticTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#58CC02',
    textAlign: 'center',
    marginBottom: 40,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  emoji: {
    fontSize: 32,
    marginRight: 16,
  },
  infoText: {
    flex: 1,
    fontSize: 16,
    color: '#3C3C3C',
    lineHeight: 22,
  },
  inputContainer: {
    marginVertical: 32,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3C3C3C',
    marginBottom: 8,
  },
  input: {
    borderWidth: 2,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
  },
});
