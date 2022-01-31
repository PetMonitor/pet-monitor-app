import React from 'react';
import { Text, SafeAreaView, StyleSheet } from 'react-native';

/** Implements the report creation screen. */
export class CreateReportScreen extends React.Component {
    render() {
        return (
            <SafeAreaView style={styles.container}>            
                <Text>Not implemented yet :)</Text>
            </SafeAreaView>
        )
    }
}

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
