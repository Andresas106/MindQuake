import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

// Importa tus pantallas
import HomeScreen from '../screens/HomeScreen';
import VerificationScreen from '../db/verification'

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Verification" component={VerificationScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
