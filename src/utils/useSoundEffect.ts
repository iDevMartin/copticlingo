import { useSettingsStore } from '../store/settingsStore';
import { audioService } from './audioService';

export const useSoundEffect = () => {
  const { soundEffectsEnabled } = useSettingsStore();

  const playCorrectSound = async () => {
    if (soundEffectsEnabled) {
      await audioService.playCorrectSound();
    }
  };

  return { playCorrectSound };
};
