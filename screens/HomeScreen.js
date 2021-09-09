import React from 'react';
import { Button, View, Text } from 'react-native';

export class HomeScreen extends React.Component {

    static navigationOptions = ({ navigation }) => {
        return {
            // User cannot navigate back to login screen from here
            headerLeft: () => null
        }
    }

    render() {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Welcome to the Home Screen</Text>
            <Button
                title="Go to Details... again"
                onPress={() =>
                    alert("Button Pressed!")
                }
                />
            </View>
        )
    }
}
