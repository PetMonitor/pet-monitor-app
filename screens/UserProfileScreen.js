import React from 'react';
import { Button, Text, TextInput, StatusBar, StyleSheet, SafeAreaView } from 'react-native';
import { getJsonData } from '../utils/requests';
import { getSecureStoreValueFor } from '../utils/store';

export class UserProfileScreen extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            editing: false,
            userData: { username: '', email: '' }
        }
    }

    componentDidMount() {
        getSecureStoreValueFor('sessionToken').then((sessionToken) => {
            getJsonData(global.noticeServiceBaseUrl + '/users/' + this.props.route.params.userId, 
            {
                'Authorization': 'Basic ' + sessionToken 
            }
            ).then(response => {
                console.log(response);
                this.setState({ userData : response });
            }).catch(err => {
                console.log(err);
                alert(err)
            });
        });
    }

    render() {

        const styles = StyleSheet.create({
            container: {
                flex: 1,
                backgroundColor: 'white',
                flexDirection: 'column', // main axis: vertical
                alignItems: 'center', // align items across secondary axis (horizontal)
                justifyContent: 'center', // justify along main axis (vertical)
                paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
            }
        });

        return (
            <SafeAreaView style={styles.container}>   
                <Text>username:</Text>  
                <TextInput editable={this.state.editing}>{this.state.userData.username}</TextInput>
                <Text>email:</Text>
                <TextInput editable={this.state.editing}>{this.state.userData.email}</TextInput>
                <Button title='Edit' onPress={() => this.setState({ editing: true }) } />
            </SafeAreaView>
        )
    }
}