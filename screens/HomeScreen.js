import React from 'react';

import { ViewUserDetailsScreen } from './crud/users/ViewUserDetailsScreen';
import { MapScreen } from './MapScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

export class HomeScreen extends React.Component {

    render() {
        return (
            <Tab.Navigator>
                <Tab.Screen name="ViewUserDetailsScreen" component={ViewUserDetailsScreen} options={{title: '', headerStyle:{ borderBottomWidth: 0, elevation: 0, shadowOpacity: 0}}}/>
                <Tab.Screen name="OtherTab" component={MapScreen}/>
            </Tab.Navigator>
        )
    }
}
