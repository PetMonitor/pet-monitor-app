import React from 'react';

import { UserProfileScreen } from './UserProfileScreen';
import { MapScreen } from './MapScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

export class HomeScreen extends React.Component {

    render() {
        return (
            <Tab.Navigator>
                <Tab.Screen name="UserProfile" component={UserProfileScreen} />
                <Tab.Screen name="OtherTab" component={MapScreen}/>
            </Tab.Navigator>
        )
    }
}
