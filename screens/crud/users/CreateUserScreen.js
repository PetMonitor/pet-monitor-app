import React from 'react';
import { Text, TextInput, StyleSheet, SafeAreaView, View } from 'react-native';
import { User, Envelope, Lock } from 'phosphor-react-native';

import { HeaderWithBackArrow } from '../../../utils/headers';
import commonStyles from '../../../utils/styles';
import colors from '../../../config/colors';
import { AppButton } from '../../../utils/buttons';
import { validateEmail } from '../../../utils/commons';

import { postJsonData } from '../../../utils/requests.js';

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

        const handleRegisterPress = () => {

            if(!validateEmail(this.state.email)) {
                alert('Please enter a valid email address!');
                return;
            }

            if (this.state.password != this.state.confirmPassword) {
                alert('Password entries did not match!');
                return;
            }

            postJsonData(global.noticeServiceBaseUrl + '/emails/confirmation', 
                { "emailAddress": this.state.email },
            ).then((response) => {
                navigation.push('ConfirmEmail', { 
                    user: {
                      'username': this.state.username, 
                      'email': this.state.email,
                      'password': this.state.password,
                      'pets': []
                    }
                  });
            }).catch(error => {
                console.error(`Error sending confirmation email to ${this.state.email}: ${error}`)
            });
        };

        const styles = StyleSheet.create({
            container: {
                alignItems: 'center', // align items across secondary axis (horizontal)
                justifyContent: 'center', // justify along main axis (vertical)
                marginLeft: 60,
                marginRight: 60
            },
            textInput: {
                color: colors.darkGrey,
                borderRadius: 8, 
                backgroundColor: colors.inputGrey, 
                borderWidth: 1, 
                borderColor: colors.inputGrey, 
                fontSize: 16, 
                fontWeight: '500',
                padding: 15,
                marginTop: 18,
                alignSelf: 'stretch',
                marginVertical: 20,
                marginLeft: 10,
                flex: 4
            },
            button: {
                marginHorizontal: 0,
                marginVertical: 40,
                backgroundColor: colors.primary,
                alignSelf: 'stretch'
            },
        });

        return ( <>
            <SafeAreaView
                edges={["top"]}
                style={{ flex: 0, backgroundColor: colors.primary }}/>
            <SafeAreaView
                edges={["left", "right", "bottom"]}
                style={[commonStyles.container]} >                
                <HeaderWithBackArrow headerText={""} backgroundColor={colors.primary} backArrowColor={colors.white} onBackArrowPress={() => this.props.navigation.goBack()}/> 
                <View style={styles.container}>
            
                    <Text style={{ fontSize: 24, marginTop: 60, marginBottom: 20, fontWeight: '500', color: colors.clearBlack, alignSelf: 'flex-start' }}>Crear cuenta</Text>            
                    <View style={commonStyles.alignedContent}>
                        <User style={{flex: 1}} color={colors.clearBlack} weight='regular' size={24} />
                        <TextInput 
                            placeholder = 'Usuario'
                            onChangeText = { usernameInput => { this.setState({ username: usernameInput })}}
                            autoCapitalize = 'none'
                            autoCorrect = { false }
                            style = {styles.textInput}
                            maxLength = { 30 }
                        />
                    </View>
                    <View style={commonStyles.alignedContent}>
                        <Envelope style={{flex: 1}} color={colors.clearBlack} weight='regular' size={24} />
                        <TextInput 
                            placeholder = 'Email'
                            onChangeText = { emailInput => { this.setState({ email: emailInput })}}
                            autoCapitalize = 'none'
                            autoCorrect = { false }
                            style = {styles.textInput}
                            maxLength = { 30 }
                        />
                    </View>
                    <View style={commonStyles.alignedContent}>
                        <Lock style={{flex: 1}} color={colors.clearBlack} weight='regular' size={24} />
                        <TextInput 
                            placeholder = 'Contraseña'
                            onChangeText = { passwordInput => { this.setState({ password: passwordInput })}}
                            autoCapitalize = 'none'
                            autoCorrect = { false }
                            style = {styles.textInput}
                            maxLength = { 30 }
                            secureTextEntry = { true }   
                        />
                    </View>
                    <View style={commonStyles.alignedContent}>
                        <Lock style={{flex: 1}} color={colors.clearBlack} weight='regular' size={24} />
                        <TextInput 
                            placeholder = 'Confirmar contraseña'
                            onChangeText = { passwordInput => { this.setState({ confirmPassword: passwordInput })}}
                            autoCapitalize = 'none'
                            autoCorrect = { false }
                            style = {styles.textInput}
                            maxLength = { 30 }
                            secureTextEntry = { true }   
                        />
                    </View>
                    <AppButton
                            buttonText={"Registrarse"} 
                            onPress={handleRegisterPress} 
                            additionalButtonStyles={styles.button} /> 
                </View>
            </SafeAreaView>
        </>)
    }
}
