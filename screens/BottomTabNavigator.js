import React from 'react';

import { ViewUserDetailsScreen } from './crud/users/ViewUserDetailsScreen';
import { ReportListScreen } from './ReportListScreen';
import { FaceRecognitionSearchScreen } from './FaceRecognitionSearchScreen';
import { CreateReportScreen } from './crud/reports/CreateReportScreen';
import { FosteringVolunteersScreen } from './FosteringVolunteersScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Dog, MapPin, PlusCircle, User, UsersThree, SignOut } from 'phosphor-react-native';
import { TouchableOpacity } from 'react-native';
import { clearStore } from '../utils/store';

import colors from '../config/colors';

const Tab = createBottomTabNavigator();

/** Defines the tabs located in the bottom navigation bar of the app. */
export class BottomTabNavigator extends React.Component {

    constructor(props) {
        super(props);
    }

    defineWeight = focused => {
        return focused ? 'fill' : 'regular';
    }

    logout = () => {
        clearStore();
        this.props.navigation.popToTop();
    }

    render() {
        const tabIconSize = 30;

        const headerTitlesStyle = {
            fontSize: 24, 
            fontWeight: 'bold',
            color: colors.white
        }

        const signOutButton = <TouchableOpacity onPress={() => this.logout()} style={{paddingRight:10}}>
            <SignOut 
                size={25} 
                color={colors.white}
                weight={'bold'}
            />
        </TouchableOpacity>;

        return (
            <Tab.Navigator screenOptions={{tabBarStyle: { height: 70 }}}>
                {/* Each tab screen represents a tab in the bottom tab navigation bar */}
                <Tab.Screen name='ReportList' component={ReportListScreen} options={{
                    tabBarActiveTintColor: colors.primary, 
                    tabBarInactiveTintColor: colors.grey,
                    tabBarShowLabel: false,
                    title: 'Mapa',
                    headerStyle: {
                        backgroundColor: colors.primary,
                    },
                    headerTitleStyle: {
                        ...headerTitlesStyle
                    },
                    headerRight: () => ( signOutButton ),
                    tabBarIcon: ({ color, focused }) => (
                        <MapPin size={tabIconSize} color={color} weight={this.defineWeight(focused)} />
                    )}}/>
                <Tab.Screen name='FaceRecognitionSearch' component={FaceRecognitionSearchScreen} options={{
                    tabBarActiveTintColor: colors.primary, 
                    tabBarInactiveTintColor: colors.grey, 
                    tabBarShowLabel: false,
                    title: 'Reconocimiento facial',
                    headerStyle: {
                        backgroundColor: colors.primary,
                    },
                    headerTitleStyle: {
                        ...headerTitlesStyle
                    },
                    headerRight: () => ( signOutButton ),
                    tabBarIcon: ({ color, focused }) => (
                        <Dog size={tabIconSize} color={color} weight={this.defineWeight(focused)} />
                )}}/>
                <Tab.Screen name='CreateReport' component={CreateReportScreen} options={{
                    tabBarActiveTintColor: colors.primary, 
                    tabBarInactiveTintColor: colors.grey, 
                    tabBarShowLabel: false,
                    title: 'Crear Reporte',
                    headerStyle: {
                        backgroundColor: colors.primary,
                    },
                    headerTitleStyle: {
                        ...headerTitlesStyle
                    },
                    headerRight: () => ( signOutButton ),
                    tabBarIcon: ({ color, focused }) => (
                        <PlusCircle size={tabIconSize} color={color} weight={this.defineWeight(focused)} />
                )}}/>
                <Tab.Screen name='TemporalFosterVolunteers' component={FosteringVolunteersScreen} options={{
                    tabBarActiveTintColor: colors.primary, 
                    tabBarInactiveTintColor: colors.grey, 
                    tabBarShowLabel: false,
                    title: 'Voluntarios para transitar',
                    headerStyle: {
                        backgroundColor: colors.primary,
                    },
                    headerTitleStyle: {
                        ...headerTitlesStyle
                    },
                    headerRight: () => ( signOutButton ),
                    tabBarIcon: ({ color, focused }) => (
                        <UsersThree size={tabIconSize} color={color} weight={this.defineWeight(focused)} />
                )}}/>  
                <Tab.Screen name='ViewUserDetails' component={ViewUserDetailsScreen} options={{   
                        tabBarActiveTintColor: colors.primary, 
                        tabBarInactiveTintColor: colors.grey, 
                        tabBarShowLabel: false,
                        tabBarIcon: ({ color, focused }) => (
                            <User size={tabIconSize} color={color} weight={this.defineWeight(focused)} />  
                        ),
                        title: 'Mi Perfil',
                        headerStyle: {
                            backgroundColor: colors.primary,
                        },
                        headerTitleStyle: {
                            ...headerTitlesStyle
                        },
                        headerRight: () => ( signOutButton ),
                    }}/>             
            </Tab.Navigator>
        )
    }
}
