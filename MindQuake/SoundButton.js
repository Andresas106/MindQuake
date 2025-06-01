import React from 'react';
import { TouchableOpacity, Vibration } from 'react-native';
import { Audio } from 'expo-av';
import { useAudio } from './AudioProvider';

const SoundButton = ({ onPress, children, style, ...props }) => {
  const { isSoundEnabled, soundVolume, vibrationEnabled } = useAudio();

  const playSound = async () => {
    if (!isSoundEnabled) return;

    try {
      const { sound } = await Audio.Sound.createAsync(
        require('./assets/audio/button_sound.wav')
      );
      await sound.setVolumeAsync(soundVolume);
      await sound.playAsync();

      sound.setOnPlaybackStatusUpdate((status) => {
        if (!status.isPlaying) {
          sound.unloadAsync();
        }
      });
    } catch (error) {
      console.log('Error playing sound:', error);
    }
  };

  const handlePress = () => {
    playSound();

    if (vibrationEnabled) {
      // Vibrar durante 50ms, puedes ajustar el tiempo
      Vibration.vibrate(50);
    }

    if (onPress) {
      onPress();
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={style}
      {...props}
      activeOpacity={0.7}
    >
      {children}
    </TouchableOpacity>
  );
};

export default SoundButton;
