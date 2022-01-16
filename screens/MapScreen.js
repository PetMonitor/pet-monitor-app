import React from 'react';
import { Text, StatusBar, StyleSheet, SafeAreaView } from 'react-native';

export class MapScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            email: ''
        }
    }

    render() {

        const styles = StyleSheet.create({
            container: {
                flex: 1,
                backgroundColor: 'white',
                flexDirection: 'column',    // main axis: vertical
                alignItems: 'center',       // align items across secondary axis (horizontal)
                justifyContent: 'center',   // justify along main axis (vertical)
                paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
            }
        });

        return (
            <SafeAreaView style={styles.container}>            
                <Text>This is a map</Text>
            </SafeAreaView>
        )
    }
}