import React from 'react';

import { UserProfileScreen } from './UserProfileScreen';
import { ReportListScreen } from './ReportListScreen';
import { FaceRecognitionSearchScreen } from './FaceRecognitionSearchScreen';
import { CreateReportScreen } from './crud/reports/CreateReportScreen';
import { FosteringVolunteersScreen } from './FosteringVolunteersScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Dog, MapPin, PlusCircle, User, UsersThree } from 'phosphor-react-native';

import colors from '../config/colors';

const Tab = createBottomTabNavigator();

/** Defines the tabs located in the bottom navigation bar of the app. */
export class BottomTabNavigator extends React.Component {

    defineWeight = focused => {
        return focused ? 'fill' : 'regular';
    }

    render() {
        return (
            <Tab.Navigator>
                {/* Each tab screen represents a tab in the bottom tab navigation bar */}
                <Tab.Screen name='Reports' component={ReportListScreen} options={{headerShown: false, tabBarActiveTintColor: colors.primary, tabBarInactiveTintColor: colors.grey, tabBarShowLabel: false,
                    tabBarIcon: ({ color, focused }) => (
                        <MapPin size={30} color={color} weight={defineWeight(focused)} />
                    )}}/>
                <Tab.Screen name='Face Recognition Search' component={FaceRecognitionSearchScreen} options={{headerShown: false, tabBarActiveTintColor: colors.primary, tabBarInactiveTintColor: colors.grey, tabBarShowLabel: false,
                    tabBarIcon: ({ color, focused }) => (
                        <Dog size={30} color={color} weight={defineWeight(focused)} />
                )}}/>
                <Tab.Screen name='Create Report' component={CreateReportScreen} options={{headerShown: false, tabBarActiveTintColor: colors.primary, tabBarInactiveTintColor: colors.grey, tabBarShowLabel: false,
                    tabBarIcon: ({ color, focused }) => (
                        <PlusCircle size={30} color={color} weight={defineWeight(focused)} />
                )}}/>
                <Tab.Screen name='Temporal Foster Volunteers' component={FosteringVolunteersScreen} options={{headerShown: false, tabBarActiveTintColor: colors.primary, tabBarInactiveTintColor: colors.grey, tabBarShowLabel: false,
                    tabBarIcon: ({ color, focused }) => (
                        <UsersThree size={30} color={color} weight={defineWeight(focused)} />
                )}}/>  
                <Tab.Screen name='UserProfile' component={UserProfileScreen} options={{headerShown: false, tabBarActiveTintColor: colors.primary, tabBarInactiveTintColor: colors.grey, tabBarShowLabel: false,
                    tabBarIcon: ({ color, focused }) => (
                        <User size={30} color={color} weight={defineWeight(focused)} />  
                )}}/>             
            </Tab.Navigator>
        )
    }
}
