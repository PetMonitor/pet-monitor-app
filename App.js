import './global.js'
import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { BottomTabNavigator } from './screens/BottomTabNavigator.js';
import { LoginScreen } from './screens/LoginScreen.js';
import { CreateUserScreen } from './screens/crud/users/CreateUserScreen';
import { ConfirmEmailScreen } from './screens/crud/users/ConfirmEmailScreen';
import { ResetPasswordScreen } from './screens/crud/users/ResetPasswordScreen';
import { CreatePetScreen } from './screens/crud/pets/CreatePetScreen';
import { AskCreatePetScreen } from './screens/crud/pets/AskCreatePetScreen';
import { EditUserDetailsScreen } from './screens/crud/users/EditUserDetailsScreen';
import ChangePasswordScreen from './screens/crud/users/ChangePasswordScreen';

import ImageSelectorScreen from './screens/ImageSelectorScreen';
import { ReportListFilterScreen } from './screens/ReportListFilterScreen';
import { ReportViewScreen } from './screens/ReportViewScreen';
import { CancelPetTransferScreen } from './screens/crud/pets/CancelPetTransferScreen.js';
import { FosteringVolunteerProfileScreen } from './screens/FosteringVolunteerProfileScreen';
import { FosteringVolunteerProfileSettingsScreen } from './screens/FosteringVolunteerProfileSettingsScreen';
import { FaceRecognitionResultsScreen } from './screens/FaceRecognitionResultsScreen';
import { ViewPetDetailsScreen } from './screens/crud/pets/ViewPetDetailsScreen.js';
import { EditReportScreen } from './screens/crud/reports/EditReportScreen';
import { EditPetDetailsScreen } from './screens/crud/pets/EditPetDetailsScreen.js';
import { LogBox, Text } from 'react-native';
import colors from './config/colors';

import * as Linking from 'expo-linking';

LogBox.ignoreAllLogs(true);
const prefix = Linking.createURL('/');

const Stack = createNativeStackNavigator();

export default class App extends React.Component {

  render() {
    linking = {
      prefixes: [prefix],
      config: {
        screens: {
          ReportView: "users/:noticeUserId/reports/:noticeId"
        },
        screens: {
          ViewPet: "users/:userId/pets/:petId"
        }
      }
    };

    return <NavigationContainer linking={linking} fallback={<Text>Loading...</Text>}>
            <Stack.Navigator initialRouteName="Login">
              <Stack.Screen name="Login" component={LoginScreen} options={{title: '', headerShown: false}} />
              <Stack.Screen name="BottomTabNavigator" component={BottomTabNavigator} options={{ headerShown: false, headerLeft: () => null }} />
              <Stack.Screen name="CreateUserScreen" component={CreateUserScreen} options={{headerShown: false}}/>
              <Stack.Screen name="ConfirmEmail" component={ConfirmEmailScreen} options={{title: '', headerShown: false}}/>
              <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} options={{title: '', headerShown: false}}/>
              <Stack.Screen name="EditUserScreen" component={EditUserDetailsScreen} options={{headerShown: false}}/>
              <Stack.Screen name="ChangeUserPasswordScreen" component={ChangePasswordScreen} options={{headerShown: false}}/>
              <Stack.Screen name="AskCreatePet" component={AskCreatePetScreen} options={{headerShown: false,headerBackVisible: false, title: '', headerStyle: {backgroundColor: colors.primary}}} />
              <Stack.Screen name="CreatePet" component={CreatePetScreen} options={{title: '', headerShown: false }} initialParams={{ userInfo:{}, initialSetup:false, initPetType:'DOG'}} />
              <Stack.Screen name="EditPetDetails" component={EditPetDetailsScreen} options={{ headerShown: false }}/>
              <Stack.Screen name="ViewPet" component={ViewPetDetailsScreen} options={{ headerShown: false }} />
              <Stack.Screen name="ImageSelectorScreen" component={ImageSelectorScreen} options={{ headerShown: false}} />
              <Stack.Screen name="FosteringVolunteerProfile" component={FosteringVolunteerProfileScreen} options={{headerShown: false}} />
              <Stack.Screen name="FosteringVolunteerProfileSettings" component={FosteringVolunteerProfileSettingsScreen} options={{headerShown: false}} />
              <Stack.Screen name="ReportListFilter" component={ReportListFilterScreen} options={{headerShown: false}} />
              <Stack.Screen name="ReportView" component={ReportViewScreen} options={{headerShown: false}} />
              <Stack.Screen name="EditReportScreen" component={EditReportScreen} options={{ headerShown: false }} />
              <Stack.Screen name="FaceRecognitionResults" component={FaceRecognitionResultsScreen} options={{headerShown: false}} />
              <Stack.Screen name="CancelPetTransfer" component={CancelPetTransferScreen} options={{headerShown: false}} />
            </Stack.Navigator>
          </NavigationContainer>;
  }
}
