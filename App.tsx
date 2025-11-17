import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Analytics } from '@vercel/analytics/react';
import { WelcomeScreen } from './src/screens/WelcomeScreen';
import { OnboardingScreen } from './src/screens/OnboardingScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { LessonScreen } from './src/screens/LessonScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { ReviewScreen } from './src/screens/ReviewScreen';
import { ReviewLessonScreen } from './src/screens/ReviewLessonScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { PrivacyPolicyScreen } from './src/screens/PrivacyPolicyScreen';
import { TermsOfServiceScreen } from './src/screens/TermsOfServiceScreen';
import { UnitTestScreen } from './src/screens/UnitTestScreen';
import { audioService } from './src/utils/audioService';
import { Exercise } from './src/types';
import { ProgressProvider } from './src/store/progressStore.tsx';
import { AchievementProvider } from './src/store/achievementStore.tsx';
import { ReviewProvider } from './src/store/reviewStore.tsx';
import { SettingsProvider } from './src/store/settingsStore.tsx';
import { UnitTestProvider } from './src/store/unitTestStore.tsx';
import { ThemeProvider } from './src/theme/ThemeContext.tsx';
import { ThemeColorUpdater } from './src/components/ThemeColorUpdater';

type Screen = 'welcome' | 'onboarding' | 'home' | 'lesson' | 'profile' | 'review' | 'settings' | 'reviewLesson' | 'unitTest' | 'privacyPolicy' | 'termsOfService';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [selectedUnitTestId, setSelectedUnitTestId] = useState<string | null>(null);
  const [reviewExercises, setReviewExercises] = useState<Exercise[]>([]);
  const [isReady, setIsReady] = useState(false);
  const [isCheckingOnboarding, setIsCheckingOnboarding] = useState(true);
  const [homeScrollY, setHomeScrollY] = useState(0);
  const [settingsScrollY, setSettingsScrollY] = useState(0);
  const [settingsScrollKey, setSettingsScrollKey] = useState(0);

  useEffect(() => {
    async function prepare() {
      try {
        await audioService.initialize();

        // Check if user has completed onboarding
        const hasCompletedOnboarding = await AsyncStorage.getItem('copticlingo-onboarding-complete');
        if (hasCompletedOnboarding === 'true') {
          setCurrentScreen('home');
        }
      } catch (e) {
        console.warn('Failed to initialize:', e);
      } finally {
        setIsReady(true);
        setIsCheckingOnboarding(false);
      }
    }

    prepare();

    return () => {
      audioService.cleanup();
    };
  }, []);

  if (!isReady || isCheckingOnboarding) {
    return null;
  }

  const handleWelcomeComplete = () => {
    setCurrentScreen('onboarding');
  };

  const handleOnboardingComplete = async () => {
    // Mark onboarding as complete
    try {
      await AsyncStorage.setItem('copticlingo-onboarding-complete', 'true');
    } catch (e) {
      console.warn('Failed to save onboarding status:', e);
    }
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

  const handlePrivacyPolicyPress = () => {
    setCurrentScreen('privacyPolicy');
  };

  const handlePrivacyPolicyBack = () => {
    setCurrentScreen('settings');
    setSettingsScrollKey(prev => prev + 1); // Trigger scroll restoration
  };

  const handleTermsOfServicePress = () => {
    setCurrentScreen('termsOfService');
  };

  const handleTermsOfServiceBack = () => {
    setCurrentScreen('settings');
    setSettingsScrollKey(prev => prev + 1); // Trigger scroll restoration
  };

  const handleUnitTestPress = (testId: string) => {
    setSelectedUnitTestId(testId);
    setCurrentScreen('unitTest');
  };

  const handleUnitTestComplete = () => {
    setSelectedUnitTestId(null);
    setCurrentScreen('home');
  };

  const handleUnitTestExit = () => {
    setSelectedUnitTestId(null);
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
            onUnitTestPress={handleUnitTestPress}
            initialScrollY={homeScrollY}
            onScrollPositionChange={setHomeScrollY}
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
        return (
          <SettingsScreen
            key={settingsScrollKey}
            onBack={handleSettingsBack}
            onPrivacyPolicyPress={handlePrivacyPolicyPress}
            onTermsOfServicePress={handleTermsOfServicePress}
            initialScrollY={settingsScrollY}
            onScrollPositionChange={setSettingsScrollY}
          />
        );
      case 'privacyPolicy':
        return <PrivacyPolicyScreen onBack={handlePrivacyPolicyBack} />;
      case 'termsOfService':
        return <TermsOfServiceScreen onBack={handleTermsOfServiceBack} />;
      case 'unitTest':
        return selectedUnitTestId ? (
          <UnitTestScreen
            testId={selectedUnitTestId}
            onComplete={handleUnitTestComplete}
            onExit={handleUnitTestExit}
          />
        ) : null;
      default:
        return <WelcomeScreen onComplete={handleWelcomeComplete} />;
    }
  };

  return (
    <SafeAreaProvider>
      <SettingsProvider>
        <ThemeProvider>
          <ThemeColorUpdater />
          <ProgressProvider>
            <AchievementProvider>
              <ReviewProvider>
                <UnitTestProvider>
                  <StatusBar style="auto" />
                  {renderScreen()}
                  <Analytics />
                </UnitTestProvider>
              </ReviewProvider>
            </AchievementProvider>
          </ProgressProvider>
        </ThemeProvider>
      </SettingsProvider>
    </SafeAreaProvider>
  );
}
