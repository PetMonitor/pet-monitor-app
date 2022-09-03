import React from 'react';

import { postJsonData } from '../../../utils/requests.js';

import { Modal, Image, TouchableOpacity, Text, StyleSheet, SafeAreaView, View } from 'react-native';
import { AppButton } from '../../../utils/buttons';
import { HeaderWithBackArrow } from '../../../utils/headers';

import commonStyles from '../../../utils/styles';
import colors from '../../../config/colors.js';

const MAIL_IMG_PATH = '../../../assets/mail_640.png';
const MAIL_RESENT_TEXT = 'Hemos enviado un correo a tu dirección de email. Recordá verificar la carpeta de Spam!';
const MAIL_NOT_CONFIRMED_TEXT = 'No hemos podido confirmar tu email. Por favor, revisá haberlo ingresado correctalemte!';

export class ConfirmEmailScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            modalText: ''
        }
    }

    setModalVisible = (visible) => {
        this.setState({ modalVisible: visible });
    }

    render() {

        const { navigation } = this.props;

        const { user, onUserCreatedSuccessfully, onUserCreatedError } = this.props.route.params;


        const handleCheckEmailConfirmed = () => {
            console.log(`Checking if email ${user.email} confirmed.`);
            postJsonData(global.noticeServiceBaseUrl + '/emails/confirmation/check', 
                { "emailAddress": user.email },
            ).then((response) => {
                console.log(`Received email confirmed ${JSON.stringify(response)}`)

                if (response.confirmed) {
                    this.setState({ emailConfirmed: response.emailConfirmed });

                    console.log(`Continue user setup ${JSON.stringify(user)}`)
                    return navigation.push('AskCreatePet', { 
                        user: {
                          'username': user.username, 
                          'email': user.email,
                          'password': user.password,
                          'pets': []
                        },
                        onUserCreatedSuccessfully: onUserCreatedSuccessfully,
                        onUserCreatedError: onUserCreatedError
                      });
                } else {
                    this.setState({modalVisible: true, modalText: MAIL_NOT_CONFIRMED_TEXT})
                    console.info(`Email ${user.email} not confirmed. Cannot continue setup`);
                }
            }).catch(error => {
                 console.error(`Error checking email confirmation for ${user.email}: ${error}`);
                 onUserCreatedError();
                 navigation.navigate('Login');
            });   
            
        };

        const handleResendConfirmationEmail = () => {
            console.log(`Resend confirmation email to ${user.email}.`);
            postJsonData(global.noticeServiceBaseUrl + '/emails/confirmation', 
                { "emailAddress": user.email },
            ).then((response) => {
                this.setState({modalVisible: true, modalText: MAIL_RESENT_TEXT})
                console.log(`Resent confirmation email to ${user.email}`)
            }).catch(error => {
                console.error(`Error sending confirmation email to ${user.email}: ${error}`)
            });        
        };


        return (
            <>
            <SafeAreaView
                edges={["top"]}
                style={{ flex: 0, backgroundColor: colors.primary }}/>
            <SafeAreaView
                edges={["left", "right", "bottom"]}
                style={commonStyles.container} >
                <HeaderWithBackArrow headerText={""} headerTextColor={colors.primary} backgroundColor={colors.primary} backArrowColor={colors.white} onBackArrowPress={() => this.props.navigation.goBack()} />

                <View>
                    <Modal 
                        animationType="slide"
                        transparent={true}
                        visible={this.state.modalVisible}
                        onRequestClose={() => {
                            Alert.alert("Modal has been closed.");
                            this.setModalVisible(!modalVisible);
                        }}>
                        <View style={{flex: 1, justifyContent: 'center', alignItems: 'stretch'}}>
                            <View style={styles.modalView}>
                            <Text style={styles.modalText}>{this.state.modalText}</Text>
                            <TouchableOpacity
                                style={[styles.modalButton, {width: '50%', alignSelf: 'center', alignItems: 'center'}]}
                                onPress={() => {
                                    this.setModalVisible(!this.state.modalVisible);
                                }}>
                                <Text style={{color: colors.white, fontWeight: '500'}}>Ok</Text>
                            </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                </View>
                <View style={{flex: 1}}>
                    <Text style={[{flex: 1, marginTop: 50}, styles.title]}>Chequeá tu casilla de mail!</Text>  
                    <Text style={[styles.subtitle, {flex: 2}]}>Te enviamos un mensaje para confirmar tu dirección de correo</Text>
                    <View style={{flex:3}}>
                        <Image key={'img_email'} resizeMode="cover" style={{resizeMode: 'contain', width: null, height: 80}} source={require(MAIL_IMG_PATH)}/>
                        <Text style={[styles.text, {marginTop: 60}]}>Confirmá tu email antes de continuar</Text>
                    </View>
                    <View style={{marginHorizontal: 20}}>
                        <AppButton
                            buttonText={'Continuar'} 
                            onPress={handleCheckEmailConfirmed} 
                            additionalButtonStyles={[styles.button, { marginTop: 10 }]} />
                    </View>
                    <View style={{flex:1}}>
                        <Text style={{color:colors.clearBlack, fontSize: 16, fontWeight: '500', alignSelf: 'center', marginTop: 5}}>
                            ¿No recibiste un email? 
                        </Text>
                        <Text style={{color:colors.clearBlack, fontSize: 16, fontWeight: '500', textDecorationLine: 'underline', alignSelf: 'center', marginTop: 5}} onPress={handleResendConfirmationEmail}>Reenviar</Text>
                    </View>
                </View>
            </SafeAreaView>
            </>
        )
    }
}

const styles = StyleSheet.create({
    button: {
      backgroundColor: colors.primary,
      alignSelf: 'center',
      width: '70%',
    },
    modalButton: {
        backgroundColor: colors.secondary,
        margin: 0,
        marginTop: 10,
        padding: 18, 
        borderRadius: 7, 
        width: '55%', 
        alignSelf: 'flex-start'
    },
    title: {
        fontWeight: '500',
        color: colors.primary,
        fontSize: 24,
        alignSelf: 'center'
    },
    subtitle: {
        textAlign: 'center', 
        color:colors.clearBlack, 
        fontSize: 18,
    },
    text: {
        color:colors.darkGrey, 
        fontSize: 16,
        textAlign: 'center',
    },
    modalView: {
        margin: 20,
        backgroundColor: colors.white,
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: colors.clearBlack,
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    modalText: {
      marginBottom: 15,
      textAlign: "center",
    }
})
