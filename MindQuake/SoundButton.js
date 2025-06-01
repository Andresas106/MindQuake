// SoundButton.js
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';

const SoundButton = ({ onPress, children, style, ...props }) => {
  const playSound = async () => {
    try {
      // Asegúrate que la ruta '../assets/audio/button_sound.wav' sea correcta
      const { sound } = await Audio.Sound.createAsync(
        require('./assets/audio/button_sound.wav')
      );
      
      await sound.playAsync();

      // Cuando el sonido termine, descargamos para liberar recursos
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
    // Reproducir sonido
    playSound();

    // Ejecutar función pasada como onPress
    if (onPress) {
      onPress();
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={style}
      {...props}
      activeOpacity={0.7} // Opcional: para mejor feedback táctil
    >
      {children}
    </TouchableOpacity>
  );
};

export default SoundButton;
