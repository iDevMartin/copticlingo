import { Audio } from 'expo-av';

class AudioService {
  private sound: Audio.Sound | null = null;
  private correctSound: Audio.Sound | null = null;

  async initialize() {
    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
      });

      // Preload the correct answer sound effect
      const { sound } = await Audio.Sound.createAsync(
        require('../../assets/audio/correct.mp3')
      );
      this.correctSound = sound;
    } catch (error) {
      console.error('Error initializing audio:', error);
    }
  }

  async playAudio(uri: string) {
    try {
      if (this.sound) {
        await this.sound.unloadAsync();
      }

      const { sound } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: true }
      );

      this.sound = sound;
      await sound.playAsync();
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  }

  async playCorrectSound() {
    try {
      if (this.correctSound) {
        await this.correctSound.replayAsync();
      }
    } catch (error) {
      console.error('Error playing correct sound:', error);
    }
  }

  async stopAudio() {
    try {
      if (this.sound) {
        await this.sound.stopAsync();
        await this.sound.unloadAsync();
        this.sound = null;
      }
    } catch (error) {
      console.error('Error stopping audio:', error);
    }
  }

  async cleanup() {
    await this.stopAudio();
    if (this.correctSound) {
      await this.correctSound.unloadAsync();
      this.correctSound = null;
    }
  }
}

export const audioService = new AudioService();
