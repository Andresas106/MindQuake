import React, { useEffect, useRef, useState } from 'react';
import AppNavigator from './navigation/AppNavigation';
import { useFonts } from 'expo-font';
import { Rubik_400Regular, Rubik_700Bold } from '@expo-google-fonts/rubik';
import { View, ActivityIndicator } from 'react-native';
import { Audio } from 'expo-av';

let sound = null;

const playMusic = async () => {
  if (sound) return; // ya está sonando
  try {
    sound = new Audio.Sound();
    await sound.loadAsync(require('./assets/audio/menu_music.mp3'));
    await sound.setIsLoopingAsync(true);
    await sound.playAsync();
  } catch (e) {
    console.log('Error playMusic:', e);
  }
};

const stopMusic = async () => {
  if (sound) {
    await sound.stopAsync();
    await sound.unloadAsync();
    sound = null;
  }
};

const App = () => {
  const [fontsLoaded] = useFonts({
    Rubik_400Regular,
    Rubik_700Bold,
  });

  const [currentRoute, setCurrentRoute] = useState(null);

  useEffect(() => {
    if (!currentRoute) return;

    if (currentRoute === 'Quiz') {
      stopMusic();
    } else {
      playMusic();
    }
  }, [currentRoute]);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const onNavigationStateChange = (state) => {
    if (!state) return;
    const route = state.routes[state.index].name;
    setCurrentRoute(route);
  };

  return <AppNavigator onStateChange={onNavigationStateChange} />;
};

export default App;
