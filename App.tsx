import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { WelcomeScreen } from './src/screens/WelcomeScreen';
import { OnboardingScreen } from './src/screens/OnboardingScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { LessonScreen } from './src/screens/LessonScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { ReviewScreen } from './src/screens/ReviewScreen';
import { ReviewLessonScreen } from './src/screens/ReviewLessonScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { audioService } from './src/utils/audioService';
import { Exercise } from './src/types';
import { ProgressProvider } from './src/store/progressStore.tsx';
import { AchievementProvider } from './src/store/achievementStore.tsx';
import { ReviewProvider } from './src/store/reviewStore.tsx';

type Screen = 'welcome' | 'onboarding' | 'home' | 'lesson' | 'profile' | 'review' | 'settings' | 'reviewLesson';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [reviewExercises, setReviewExercises] = useState<Exercise[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await audioService.initialize();
      } catch (e) {
        console.warn('Failed to initialize audio:', e);
      } finally {
        setIsReady(true);
      }
    }

    prepare();

    return () => {
      audioService.cleanup();
    };
  }, []);

  if (!isReady) {
    return null;
  }

  const handleWelcomeComplete = () => {
    setCurrentScreen('onboarding');
  };

  const handleOnboardingComplete = () => {
    setCurrentScreen('home');
  };

  const handleLessonPress = (lessonId: string) => {
    setSelectedLessonId(lessonId);
    setCurrentScreen('lesson');
  };

  const handleLessonComplete = () => {
    setSelectedLessonId(null);
    setCurrentScreen('home');
  };

  const handleLessonExit = () => {
    setSelectedLessonId(null);
    setCurrentScreen('home');
  };

  const handleProfilePress = () => {
    setCurrentScreen('profile');
  };

  const handleProfileBack = () => {
    setCurrentScreen('home');
  };

  const handleReviewPress = () => {
    setCurrentScreen('review');
  };

  const handleReviewBack = () => {
    setCurrentScreen('home');
  };

  const handleStartReview = (exercises: Exercise[]) => {
    setReviewExercises(exercises);
    setCurrentScreen('reviewLesson');
  };

  const handleReviewLessonComplete = () => {
    setReviewExercises([]);
    setCurrentScreen('review');
  };

  const handleReviewLessonExit = () => {
    setReviewExercises([]);
    setCurrentScreen('review');
  };

  const handleSettingsPress = () => {
    setCurrentScreen('settings');
  };

  const handleSettingsBack = () => {
    setCurrentScreen('home');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'welcome':
        return <WelcomeScreen onComplete={handleWelcomeComplete} />;
      case 'onboarding':
        return <OnboardingScreen onComplete={handleOnboardingComplete} />;
      case 'home':
        return (
          <HomeScreen
            onLessonPress={handleLessonPress}
            onProfilePress={handleProfilePress}
            onReviewPress={handleReviewPress}
            onSettingsPress={handleSettingsPress}
          />
        );
      case 'lesson':
        return selectedLessonId ? (
          <LessonScreen
            lessonId={selectedLessonId}
            onComplete={handleLessonComplete}
            onExit={handleLessonExit}
          />
        ) : null;
      case 'profile':
        return (
          <ProfileScreen
            onBack={handleProfileBack}
            onSettingsPress={handleSettingsPress}
          />
        );
      case 'review':
        return (
          <ReviewScreen
            onStartReview={handleStartReview}
            onBack={handleReviewBack}
          />
        );
      case 'reviewLesson':
        return reviewExercises.length > 0 ? (
          <ReviewLessonScreen
            exercises={reviewExercises}
            onComplete={handleReviewLessonComplete}
            onExit={handleReviewLessonExit}
          />
        ) : null;
      case 'settings':
        return <SettingsScreen onBack={handleSettingsBack} />;
      default:
        return <WelcomeScreen onComplete={handleWelcomeComplete} />;
    }
  };

  return (
    <SafeAreaProvider>
      <ProgressProvider>
        <AchievementProvider>
          <ReviewProvider>
            <StatusBar style="auto" />
            {renderScreen()}
          </ReviewProvider>
        </AchievementProvider>
      </ProgressProvider>
    </SafeAreaProvider>
  );
}
