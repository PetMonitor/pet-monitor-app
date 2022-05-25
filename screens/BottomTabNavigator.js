import React from 'react';

import { ViewUserDetailsScreen } from './crud/users/ViewUserDetailsScreen';
import { ReportListScreen } from './ReportListScreen';
import { FaceRecognitionSearchScreen } from './FaceRecognitionSearchScreen';
import { CreateReportScreen } from './crud/reports/CreateReportScreen';
import { FosteringVolunteersScreen } from './FosteringVolunteersScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Dog, MapPin, PlusCircle, User, UsersThree, SignOut } from 'phosphor-react-native';
import { TouchableOpacity } from 'react-native';
import { getSecureStoreValueFor, clearStore } from '../utils/store';
import { postJsonData } from '../utils/requests'
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
        getSecureStoreValueFor('sessionToken')
        .then(sessionToken =>  {
            if (sessionToken != null) {
                postJsonData(global.noticeServiceBaseUrl + '/users/logout', 
                    {},
                    {
                        'Authorization': 'Basic ' + sessionToken 
                    }
                ).then(() =>{
                    clearStore();
                    this.props.navigation.popToTop();
                })
            }  
        });
    }

    signOutButton = (color) => {
        return <TouchableOpacity onPress={() => this.logout()} style={{paddingRight:10}}>
            <SignOut 
                size={25} 
                color={color}
                weight={'bold'}
            />
        </TouchableOpacity>
    };

    getHeaderStyle = (backgroundColor) => {
        return {
            backgroundColor: backgroundColor,
            height: 110,
        };
    }

    render() {
        const tabIconSize = 30;

        const headerTitlesStyle = {
            fontSize: 24, 
            fontWeight: 'bold',
            color: colors.white
        }

        const headerTitleContainerStyle = {
            paddingLeft: 10
        }

        return (
            <Tab.Navigator screenOptions={{tabBarStyle: { height: 70 }}}>
                {/* Each tab screen represents a tab in the bottom tab navigation bar */}
                <Tab.Screen name='ReportList' component={ReportListScreen} options={{
                    tabBarActiveTintColor: colors.primary, 
                    tabBarInactiveTintColor: colors.grey,
                    tabBarShowLabel: false,
                    title: 'Reportes',
                    headerStyle: this.getHeaderStyle(colors.white),
                    headerTitleAlign: 'left',
                    headerTitleContainerStyle: headerTitleContainerStyle,
                    headerTitleStyle: {
                        ...headerTitlesStyle,
                        color: colors.primary,
                    },
                    headerRight: () => this.signOutButton(colors.primary),
                    tabBarIcon: ({ color, focused }) => (
                        <MapPin size={tabIconSize} color={color} weight={this.defineWeight(focused)} />
                    )}}/>
                <Tab.Screen name='FaceRecognitionSearch' component={FaceRecognitionSearchScreen} options={{
                    tabBarActiveTintColor: colors.primary, 
                    tabBarInactiveTintColor: colors.grey, 
                    tabBarShowLabel: false,
                    title: 'Reconocimiento facial',
                    headerStyle: this.getHeaderStyle(colors.primary),
                    headerTitleAlign: 'left',
                    headerTitleContainerStyle: headerTitleContainerStyle,
                    headerTitleStyle: {
                        ...headerTitlesStyle
                    },
                    headerRight: () => this.signOutButton(colors.white),
                    tabBarIcon: ({ color, focused }) => (
                        <Dog size={tabIconSize} color={color} weight={this.defineWeight(focused)} />
                )}}/>
                <Tab.Screen name='CreateReport' component={CreateReportScreen} options={{
                    tabBarActiveTintColor: colors.primary, 
                    tabBarInactiveTintColor: colors.grey, 
                    tabBarShowLabel: false,
                    title: 'Crear reporte',
                    headerStyle: this.getHeaderStyle(colors.primary),
                    headerTitleAlign: 'left',
                    headerTitleContainerStyle: headerTitleContainerStyle,
                    headerTitleStyle: {
                        ...headerTitlesStyle
                    },
                    headerRight: () => this.signOutButton(colors.white),
                    tabBarIcon: ({ color, focused }) => (
                        <PlusCircle size={tabIconSize} color={color} weight={this.defineWeight(focused)} />
                )}}/>
                <Tab.Screen name='TemporalFosterVolunteers' component={FosteringVolunteersScreen} options={{
                    tabBarActiveTintColor: colors.primary, 
                    tabBarInactiveTintColor: colors.grey, 
                    tabBarShowLabel: false,
                    title: 'Voluntarios para transitar',
                    headerStyle: this.getHeaderStyle(colors.primary),
                    headerTitleAlign: 'left',
                    headerTitleContainerStyle: headerTitleContainerStyle,
                    headerTitleStyle: {
                        ...headerTitlesStyle
                    },
                    headerRight: () => this.signOutButton(colors.white),
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
                        title: 'Mi perfil',
                        headerStyle: this.getHeaderStyle(colors.white),
                        headerTitleAlign: 'left',
                        headerTitleContainerStyle: headerTitleContainerStyle,
                        headerTitleStyle: {
                            ...headerTitlesStyle,
                            color: colors.primary
                        },
                        headerRight: () => this.signOutButton(colors.primary),
                    }}/>             
            </Tab.Navigator>
        )
    }
}
