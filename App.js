import './global.js'
import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { HomeScreen } from './screens/HomeScreen.js';
import { RegisterUserScreen } from './screens/RegisterUserScreen.js';
import { LoginScreen } from './screens/LoginScreen.js';

const Stack = createNativeStackNavigator();

export default class App extends React.Component {

  render() {
    return <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
              <Stack.Screen name="Login" component={LoginScreen} options={{title: ''}} />
              <Stack.Screen name="Home" component={HomeScreen} options={{ headerLeft: () => null }} />
              <Stack.Screen name="CreateUser" component={RegisterUserScreen} />
            </Stack.Navigator>
          </NavigationContainer>;
  }
}
















