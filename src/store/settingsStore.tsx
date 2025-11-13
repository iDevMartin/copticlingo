import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SettingsState {
  audioEnabled: boolean;
  soundEffectsEnabled: boolean;
  notificationsEnabled: boolean;
  dailyReminderEnabled: boolean;
  setAudioEnabled: (enabled: boolean) => void;
  setSoundEffectsEnabled: (enabled: boolean) => void;
  setNotificationsEnabled: (enabled: boolean) => void;
  setDailyReminderEnabled: (enabled: boolean) => void;
}

const initialSettings = {
  audioEnabled: true,
  soundEffectsEnabled: true,
  notificationsEnabled: true,
  dailyReminderEnabled: true,
};

const SettingsContext = createContext<SettingsState | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState(initialSettings);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from AsyncStorage on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const stored = await AsyncStorage.getItem('copticlingo-settings');
        if (stored) {
          setSettings(JSON.parse(stored));
        }
      } catch (error) {
        console.warn('Failed to load settings:', error);
      } finally {
        setIsLoaded(true);
      }
    };
    loadSettings();
  }, []);

  // Save to AsyncStorage whenever settings change
  useEffect(() => {
    if (isLoaded) {
      AsyncStorage.setItem('copticlingo-settings', JSON.stringify(settings)).catch(error =>
        console.warn('Failed to save settings:', error)
      );
    }
  }, [settings, isLoaded]);

  const setAudioEnabled = (enabled: boolean) => {
    setSettings(prev => ({ ...prev, audioEnabled: enabled }));
  };

  const setSoundEffectsEnabled = (enabled: boolean) => {
    setSettings(prev => ({ ...prev, soundEffectsEnabled: enabled }));
  };

  const setNotificationsEnabled = (enabled: boolean) => {
    setSettings(prev => ({ ...prev, notificationsEnabled: enabled }));
  };

  const setDailyReminderEnabled = (enabled: boolean) => {
    setSettings(prev => ({ ...prev, dailyReminderEnabled: enabled }));
  };

  if (!isLoaded) {
    return null;
  }

  return (
    <SettingsContext.Provider
      value={{
        ...settings,
        setAudioEnabled,
        setSoundEffectsEnabled,
        setNotificationsEnabled,
        setDailyReminderEnabled,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettingsStore = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettingsStore must be used within SettingsProvider');
  }
  return context;
};
