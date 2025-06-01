import React, { createContext, useContext, useEffect, useState } from 'react';
import { Audio } from 'expo-av';

const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
  const [soundVolume, setSoundVolume] = useState(1);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);

  // Alternar sonido general
  const toggleSoundEnabled = () => {
    setIsSoundEnabled(prev => !prev);
  };

  // Alternar vibración
  const toggleVibration = () => {
    setVibrationEnabled(prev => !prev);
  };

  return (
    <AudioContext.Provider
  value={{
    isSoundEnabled,
    toggleSoundEnabled,    
    vibrationEnabled,
    toggleVibration,
    soundVolume,
    setSoundVolume,
    
  }}
>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => useContext(AudioContext);
