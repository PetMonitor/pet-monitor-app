import React from 'react';

import { ViewUserDetailsScreen } from './crud/users/ViewUserDetailsScreen';
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
        const tabIconSize = 30;

        const bottomNavigatorConfigs = {
            screenOptions: {
                tabBarStyle: { height: 300 },
            },
        };
        return (
            <Tab.Navigator screenOptions={{tabBarStyle: { height: 70 }}}>
                {/* Each tab screen represents a tab in the bottom tab navigation bar */}
                <Tab.Screen name='ReportList' component={ReportListScreen} options={{headerShown: false, tabBarActiveTintColor: colors.primary, tabBarInactiveTintColor: colors.grey, tabBarShowLabel: false,
                    tabBarIcon: ({ color, focused }) => (
                        <MapPin size={tabIconSize} color={color} weight={this.defineWeight(focused)} />
                    )}}/>
                <Tab.Screen name='FaceRecognitionSearch' component={FaceRecognitionSearchScreen} options={{headerShown: false, tabBarActiveTintColor: colors.primary, tabBarInactiveTintColor: colors.grey, tabBarShowLabel: false,
                    tabBarIcon: ({ color, focused }) => (
                        <Dog size={tabIconSize} color={color} weight={this.defineWeight(focused)} />
                )}}/>
                <Tab.Screen name='CreateReport' component={CreateReportScreen} options={{headerShown: false, tabBarActiveTintColor: colors.primary, tabBarInactiveTintColor: colors.grey, tabBarShowLabel: false,
                    tabBarIcon: ({ color, focused }) => (
                        <PlusCircle size={tabIconSize} color={color} weight={this.defineWeight(focused)} />
                )}}/>
                <Tab.Screen name='TemporalFosterVolunteers' component={FosteringVolunteersScreen} options={{headerShown: false, tabBarActiveTintColor: colors.primary, tabBarInactiveTintColor: colors.grey, tabBarShowLabel: false,
                    tabBarIcon: ({ color, focused }) => (
                        <UsersThree size={tabIconSize} color={color} weight={this.defineWeight(focused)} />
                )}}/>  
                <Tab.Screen name='ViewUserDetails' component={ViewUserDetailsScreen} options={{headerShown: false, tabBarActiveTintColor: colors.primary, tabBarInactiveTintColor: colors.grey, tabBarShowLabel: false,
                    tabBarIcon: ({ color, focused }) => (
                        <User size={tabIconSize} color={color} weight={this.defineWeight(focused)} />  
                )}}/>             
            </Tab.Navigator>
        )
    }
}
