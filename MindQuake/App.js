import React, { useEffect, useState, useRef } from 'react';
import AppNavigator from './navigation/AppNavigation';
import { useFonts } from 'expo-font';
import { Rubik_400Regular, Rubik_700Bold } from '@expo-google-fonts/rubik';
import { View, ActivityIndicator } from 'react-native';
import { Audio } from 'expo-av';

const menuMusicRef = { current: null };
const quizMusicRef = { current: null };

const App = () => {
  const [fontsLoaded] = useFonts({
    Rubik_400Regular,
    Rubik_700Bold,
  });

  const [currentRoute, setCurrentRoute] = useState(null);

  useEffect(() => {
    const handleMusic = async () => {
      if (!currentRoute) return;

      if (currentRoute === 'Quiz') {

        if (menuMusicRef.current) {
          await menuMusicRef.current.stopAsync();
          await menuMusicRef.current.unloadAsync();
          menuMusicRef.current = null;
        }


        if (!quizMusicRef.current) {
          const { sound } = await Audio.Sound.createAsync(
            require('./assets/audio/questions_music.mp3'),
            { isLooping: true }
          );
          quizMusicRef.current = sound;
          await sound.playAsync();
        }
      } else {

        if (quizMusicRef.current) {
          await quizMusicRef.current.stopAsync();
          await quizMusicRef.current.unloadAsync();
          quizMusicRef.current = null;
        }

        if (!menuMusicRef.current) {
          const { sound } = await Audio.Sound.createAsync(
            require('./assets/audio/menu_music.mp3'),
            { isLooping: true }
          );
          menuMusicRef.current = sound;
          await sound.playAsync();
        }
      }
    };

    handleMusic();
  }, [currentRoute]);

  const onNavigationStateChange = (state) => {
    if (!state) return;
    const route = state.routes[state.index].name;
    setCurrentRoute(route);
  };

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <AppNavigator onStateChange={onNavigationStateChange} />;
};

export default App;
