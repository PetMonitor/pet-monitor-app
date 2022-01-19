import './global.js'
import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { HomeScreen } from './screens/HomeScreen.js';
import { RegisterUserScreen } from './screens/RegisterUserScreen.js';
import { LoginScreen } from './screens/LoginScreen.js';
import { WelcomeScreen } from './screens/WelcomeScreen.js';

const Stack = createNativeStackNavigator();

const App = () => {
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 5000)
  }, []);

  if (isLoading) {
    return <WelcomeScreen />;
  }

  return (<NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Login">
              <Stack.Screen name="Login" component={LoginScreen} options={{title: ''}} />
              <Stack.Screen name="Home" component={HomeScreen} options={{ headerLeft: () => null }} />
              <Stack.Screen name="CreateUser" component={RegisterUserScreen} />
            </Stack.Navigator>
          </NavigationContainer>);
}

export default App;

















