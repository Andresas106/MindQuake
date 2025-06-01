import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

// Importa tus pantallas
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
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Main" component={MainScreen} options={{ headerShown: false }}/>
        <Stack.Screen name='Profile' component={ProfileScreen} options={{headerShown: false}}/>
        <Stack.Screen name='EditProfile' component={EditProfileScreen} options={{headerShown: false}}/>
        <Stack.Screen name='GameSettings' component={GameSettingsScreen} options={{headerShown: false}}/>
        <Stack.Screen name='Quiz' component={QuizScreen} options={{headerShown: false}}/>
        <Stack.Screen name='Results' component={ResultsScreen} options={{headerShown: false}}/>
        <Stack.Screen name='AchievementsOverview' component={AchievementsOverviewScreen} options={{headerShown: false}}/>
        <Stack.Screen name='Leaderboard' component={LeaderboardScreen} options={{headerShown: false}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
