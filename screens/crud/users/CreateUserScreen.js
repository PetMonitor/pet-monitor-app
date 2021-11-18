import React from 'react';
import { TouchableOpacity, Text, TextInput, StatusBar, StyleSheet, SafeAreaView, View } from 'react-native';
import { postJsonData } from '../../../utils/requests.js'

export class CreateUserScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            email: '',
            password: '',
            confirmPassword: ''
        }
    }

    render() {
        
        const { navigation } = this.props;

        const validateEmail = (email) => {
            var emailValidationRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return emailValidationRegex.test(email);
        };

        const handleRegisterPress = () => {

            if(!validateEmail(this.state.email)) {
                alert('Please enter a valid email address!');
                return;
            }

            if (this.state.password != this.state.confirmPassword) {
                alert('Password entries did not match!');
                return;
            }

            navigation.push('AskCreatePet', { 
              user: {
                'username': this.state.username, 
                'email': this.state.email,
                'password': this.state.password,
                'pets': []
              }
            });

        };

        const styles = StyleSheet.create({
            container: {
                flex: 1,
                backgroundColor: 'white',
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
                borderRadius: 10,
                backgroundColor: '#72b1a1',
                width: '60%',
                alignItems: 'center'
            },
            buttonFont: {
                fontSize:18, 
                color: 'white',
                fontWeight: 'bold'
            }
        });

        return (
            <SafeAreaView style={styles.container}>
                <Text>Create your account</Text>            
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
                <TextInput 
                    placeholder = 'confirm password'
                    onChangeText = { passwordInput => { this.setState({ confirmPassword: passwordInput })}}
                    autoCapitalize = 'none'
                    autoCorrect = { false }
                    style = {styles.textInput}
                    maxLength = { 30 }
                    secureTextEntry = { true }   
                />
                <TouchableOpacity onPress={handleRegisterPress} style={styles.button}>
                    <Text style={styles.buttonFont}>Sign Up</Text>
                </TouchableOpacity>
            </SafeAreaView>
        )
    }
}
