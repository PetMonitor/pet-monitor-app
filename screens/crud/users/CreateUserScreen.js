import React from 'react';
import { TouchableOpacity, Text, TextInput, StatusBar, StyleSheet, SafeAreaView, View } from 'react-native';

import colors from '../../../config/colors';

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
                borderRadius: 8, 
                backgroundColor: colors.inputGrey, 
                borderWidth: 1, 
                borderColor: colors.inputGrey, 
                fontSize: 16, 
                fontWeight: '500',
                padding: 10,
                margin: 10,
                width: '70%'
            },
            button: {
                backgroundColor: colors.primary,
                marginTop: "5%", 
                padding: 18, 
                borderRadius: 7, 
                left: "15%", 
                width: "70%", 
                alignSelf: 'flex-start'
            },
            buttonFont: {
                fontSize: 16, 
                fontWeight: '500', 
                alignSelf: 'center'
            }
        });

        return (
            <SafeAreaView style={styles.container}>
                <Text style={{ fontSize: 24, padding: 20 }}>Crear Cuenta</Text>            
                <TextInput 
                    placeholder = 'Usuario'
                    onChangeText = { usernameInput => { this.setState({ username: usernameInput })}}
                    autoCapitalize = 'none'
                    autoCorrect = { false }
                    style = {styles.textInput}
                    maxLength = { 30 }
                />
                <TextInput 
                    placeholder = 'Email'
                    onChangeText = { emailInput => { this.setState({ email: emailInput })}}
                    autoCapitalize = 'none'
                    autoCorrect = { false }
                    style = {styles.textInput}
                    maxLength = { 30 }
                />
                <TextInput 
                    placeholder = 'Contraseña'
                    onChangeText = { passwordInput => { this.setState({ password: passwordInput })}}
                    autoCapitalize = 'none'
                    autoCorrect = { false }
                    style = {styles.textInput}
                    maxLength = { 30 }
                    secureTextEntry = { true }   
                />
                <TextInput 
                    placeholder = 'Confirmar contraseña'
                    onChangeText = { passwordInput => { this.setState({ confirmPassword: passwordInput })}}
                    autoCapitalize = 'none'
                    autoCorrect = { false }
                    style = {styles.textInput}
                    maxLength = { 30 }
                    secureTextEntry = { true }   
                />
                <TouchableOpacity onPress={handleRegisterPress} style={styles.button}>
                    <Text style={[styles.buttonFont, { color: colors.white }]}>Registrarse</Text>
                </TouchableOpacity>
            </SafeAreaView>
        )
    }
}
