import React from 'react';
import { Button, Text, TextInput, StatusBar, StyleSheet, SafeAreaView, View } from 'react-native';
import { postJsonData } from '../utils/requests.js'

export class RegisterUserScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            email: '',
            password: ''
        }
    }

    render() {
        
        const { navigation } = this.props;

        const handleRegisterPress = () => {
            postJsonData(global.noticeServiceBaseUrl + '/users', 
              {
                'username': this.state.username, 
                'email': this.state.email,
                'password': this.state.password 
              }
            ).then(response => {
                console.log(response);
                alert('Successfully created user!')
                // go back to login page
                navigation.popToTop();
            }).catch(err => {
                alert(err)
            });
        };

        const styles = StyleSheet.create({
            container: {
                flex: 1,
                backgroundColor: '#fbdc14',
                flexDirection: 'column', // main axis: vertical
                alignItems: 'center', // align items across secondary axis (horizontal)
                justifyContent: 'center', // justify along main axis (vertical)
                paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
            },
            textInput: {
                height: 40,
                backgroundColor: 'white',
                borderWidth: 1,
                padding: 10,
                margin: 10,
                width: 250
            },
            button: {
                padding: 10,
                margin: 10,
            }
        });

        return (
            <SafeAreaView style={styles.container}>            
                <TextInput 
                    placeholder = 'username'
                    onChangeText = { usernameInput => { this.setState({ username: usernameInput })}}
                    autoCapitalize = 'none'
                    autoCorrect = { false }
                    style = {styles.textInput}
                    maxLength = { 30 }
                />
                <TextInput 
                    placeholder = 'email'
                    onChangeText = { emailInput => { this.setState({ email: emailInput })}}
                    autoCapitalize = 'none'
                    autoCorrect = { false }
                    style = {styles.textInput}
                    maxLength = { 30 }
                />
                <TextInput 
                    placeholder = 'password'
                    onChangeText = { passwordInput => { this.setState({ password: passwordInput })}}
                    autoCapitalize = 'none'
                    autoCorrect = { false }
                    style = {styles.textInput}
                    maxLength = { 30 }
                    secureTextEntry = { true }   
                />
                <Button
                    title="Register"
                    onPress={handleRegisterPress} //TODO: change this to TouchableOpacity and fix styles
                    />
            </SafeAreaView>
        )
    }
}