import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { AudioProvider } from '../AudioProvider';

import HomeScreen from '../screens/HomeScreen';
import MainScreen from '../screens/MainScreen';
import ProfileScreen from '../screens/ProfileScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import GameSettingsScreen from '../screens/GameSettingsScreen';
import QuizScreen from '../screens/QuizScreen';
import ResultsScreen from '../screens/ResultsScreen';
import AchievementsOverviewScreen from '../screens/AchievementsOverviewScreen';
import LeaderboardScreen from '../screens/LeaderboardScreen';

const Stack = createStackNavigator();

const AppNavigator = ({ onStateChange }) => {
  return (
    <NavigationContainer onStateChange={onStateChange}>
      <AudioProvider>
        <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Main" component={MainScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="EditProfile" component={EditProfileScreen} />
          <Stack.Screen name="GameSettings" component={GameSettingsScreen} />
          <Stack.Screen name="Quiz" component={QuizScreen} />
          <Stack.Screen name="Results" component={ResultsScreen} />
          <Stack.Screen name="AchievementsOverview" component={AchievementsOverviewScreen} />
          <Stack.Screen name="Leaderboard" component={LeaderboardScreen} />
        </Stack.Navigator>
      </AudioProvider>
    </NavigationContainer>
  );
};

export default AppNavigator;
