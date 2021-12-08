import './global.js'
import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { HomeScreen } from './screens/HomeScreen.js';
import { LoginScreen } from './screens/LoginScreen.js';
import { CreateUserScreen } from './screens/crud/users/CreateUserScreen';
import { CreatePetScreen } from './screens/crud/pets/CreatePetScreen';
import { AskCreatePetScreen } from './screens/crud/pets/AskCreatePetScreen';

const Stack = createNativeStackNavigator();

export default class App extends React.Component {

  render() {
    return <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
              <Stack.Screen name="Login" component={LoginScreen} options={{title: ''}} />
              <Stack.Screen name="Home" component={HomeScreen} options={{ headerLeft: () => null }} />
              <Stack.Screen name="CreateUser" component={CreateUserScreen} options={{title: '', headerStyle: {backgroundColor:'#72b1a1'}}}/>
              <Stack.Screen name="AskCreatePet" component={AskCreatePetScreen} options={{title: '', headerStyle: {backgroundColor:'#72b1a1'}}} />
              <Stack.Screen name="CreatePet" component={CreatePetScreen} options={{title: 'Create Pet', headerStyle: {backgroundColor:'#72b1a1', color:'white', fontWeight:'bold'}}} initialParams={{ userInfo:{}, initialSetup:false, initPetType:'DOG'}} />
            </Stack.Navigator>
          </NavigationContainer>;
  }
}
















