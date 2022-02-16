import './global.js'
import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { BottomTabNavigator } from './screens/BottomTabNavigator.js';
import { LoginScreen } from './screens/LoginScreen.js';
import { CreateUserScreen } from './screens/crud/users/CreateUserScreen';
import { CreatePetScreen } from './screens/crud/pets/CreatePetScreen';
import { AskCreatePetScreen } from './screens/crud/pets/AskCreatePetScreen';
import ImageSelectorScreen from './screens/ImageSelectorScreen';
import { ReportListFilterScreen } from './screens/ReportListFilterScreen';
import { ReportViewScreen } from './screens/ReportViewScreen';

import colors from './config/colors';

const Stack = createNativeStackNavigator();

export default class App extends React.Component {

  render() {
    return <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
              <Stack.Screen name="Login" component={LoginScreen} options={{title: '', headerShown: false}} />
              <Stack.Screen name="BottomTabNavigator" component={BottomTabNavigator} options={{ headerShown: false, headerLeft: () => null }} />
              <Stack.Screen name="CreateUserScreen" component={CreateUserScreen} options={{title: '', headerStyle: {backgroundColor: colors.primary}}}/>
              <Stack.Screen name="AskCreatePet" component={AskCreatePetScreen} options={{title: '', headerStyle: {backgroundColor: colors.primary}}} />
              <Stack.Screen name="CreatePet" component={CreatePetScreen} options={{title: 'Create Pet', headerStyle: {backgroundColor: colors.primary, color: colors.white, fontWeight:'bold'}}} initialParams={{ userInfo:{}, initialSetup:false, initPetType:'DOG'}} />
              <Stack.Screen name="ImageSelectorScreen" component={ImageSelectorScreen} />
              <Stack.Screen name="ReportListFilter" component={ReportListFilterScreen} options={{headerShown: false}} />
              <Stack.Screen name="ReportView" component={ReportViewScreen} options={{headerShown: false}} />
            </Stack.Navigator>
          </NavigationContainer>;
  }
}
