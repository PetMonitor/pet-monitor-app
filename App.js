import './global.js'
import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { BottomTabNavigator } from './screens/BottomTabNavigator.js';
import { LoginScreen } from './screens/LoginScreen.js';
import { CreateUserScreen } from './screens/crud/users/CreateUserScreen';
import { CreatePetScreen } from './screens/crud/pets/CreatePetScreen';
import { AskCreatePetScreen } from './screens/crud/pets/AskCreatePetScreen';
import { EditUserDetailsScreen } from './screens/crud/users/EditUserDetailsScreen';
import ChangePasswordScreen from './screens/crud/users/ChangePasswordScreen';

import ImageSelectorScreen from './screens/ImageSelectorScreen';
import { ReportListFilterScreen } from './screens/ReportListFilterScreen';
import { ReportViewScreen } from './screens/ReportViewScreen';
import { FosteringVolunteerProfileScreen } from './screens/FosteringVolunteerProfileScreen';
import { FosteringVolunteerProfileSettingsScreen } from './screens/FosteringVolunteerProfileSettingsScreen';
import { FaceRecognitionResultsScreen } from './screens/FaceRecognitionResultsScreen';
import { ViewPetDetailsScreen } from './screens/crud/pets/ViewPetDetailsScreen.js';
import { EditReportScreen } from './screens/crud/reports/EditReportScreen';

import { LogBox } from 'react-native';

import colors from './config/colors';
import { EditPetDetailsScreen } from './screens/crud/pets/EditPetDetailsScreen.js';

LogBox.ignoreAllLogs(true);

const Stack = createNativeStackNavigator();

export default class App extends React.Component {

  render() {
    return <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
              <Stack.Screen name="Login" component={LoginScreen} options={{title: '', headerShown: false}} />
              <Stack.Screen name="BottomTabNavigator" component={BottomTabNavigator} options={{ headerShown: false, headerLeft: () => null }} />
              <Stack.Screen name="CreateUserScreen" component={CreateUserScreen} options={{headerShown: false}}/>
              <Stack.Screen name="EditUserScreen" component={EditUserDetailsScreen} options={{headerShown: false}}/>
              <Stack.Screen name="ChangeUserPasswordScreen" component={ChangePasswordScreen} options={{headerShown: false}}/>
              <Stack.Screen name="AskCreatePet" component={AskCreatePetScreen} options={{headerBackVisible: false, title: '', headerStyle: {backgroundColor: colors.primary}}} />
              <Stack.Screen name="CreatePet" component={CreatePetScreen} options={{title: '', headerShown: false }} initialParams={{ userInfo:{}, initialSetup:false, initPetType:'DOG'}} />
              <Stack.Screen name="EditPetDetails" component={EditPetDetailsScreen} options={{title: 'Editar Información', headerShown: true, headerBackTitle: 'Atrás' , headerTintColor: colors.white, headerStyle: {backgroundColor: colors.primary}}}/>
              <Stack.Screen name="ViewPet" component={ViewPetDetailsScreen} options={{title: 'Mascota', headerShown: true, headerBackTitle: 'Atrás', headerTintColor: colors.white, headerStyle: {backgroundColor: colors.primary}}} />
              <Stack.Screen name="ImageSelectorScreen" component={ImageSelectorScreen} options={{ headerShown: false}} />
              <Stack.Screen name="FosteringVolunteerProfile" component={FosteringVolunteerProfileScreen} options={{headerShown: false}} />
              <Stack.Screen name="FosteringVolunteerProfileSettings" component={FosteringVolunteerProfileSettingsScreen} options={{headerShown: false}} />
              <Stack.Screen name="ReportListFilter" component={ReportListFilterScreen} options={{headerShown: false}} />
              <Stack.Screen name="ReportView" component={ReportViewScreen} options={{title: 'Reporte', headerShown: true, headerBackTitle: 'Atrás' , headerTintColor: colors.white, headerStyle: {backgroundColor: colors.primary}}} />
              <Stack.Screen name="EditReportScreen" component={EditReportScreen} options={{title: 'Editar Reporte', headerShown: true, headerBackTitle: 'Atrás' , headerTintColor: colors.white, headerStyle: {backgroundColor: colors.primary}}} />
              <Stack.Screen name="FaceRecognitionResults" component={FaceRecognitionResultsScreen} options={{headerShown: false}} />
            </Stack.Navigator>
          </NavigationContainer>;
  }
}
