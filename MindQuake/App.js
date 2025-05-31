// App.js
import React from 'react';
import AppNavigator from './navigation/AppNavigation';
import { useFonts } from 'expo-font';
import { Rubik_400Regular, Rubik_700Bold } from '@expo-google-fonts/rubik';
import { View, ActivityIndicator } from 'react-native';

const App = () => {
  // Cargamos las fuentes
  const [fontsLoaded] = useFonts({
    Rubik_400Regular,
    Rubik_700Bold,
  });

  // Mientras carga la fuente, mostramos un loader
  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Una vez cargada la fuente, cargamos la navegación
  return <AppNavigator />;
};

export default App;
