import React from 'react';

import { putJsonData, HttpStatusCodes } from '../../../utils/requests.js';

import { Modal, TextInput, TouchableOpacity, Text, StyleSheet, SafeAreaView, View } from 'react-native';
import { AppButton } from '../../../utils/buttons';
import { HeaderWithBackArrow } from '../../../utils/headers';
import { validateEmail } from '../../../utils/commons';

import commonStyles from '../../../utils/styles';
import colors from '../../../config/colors.js';


const RESET_PWD_SUCCESS = 'Contraseña blanqueada con éxito!'
const ENTER_VALID_EMAIL = 'Debe ingresar un email válido!'
const ENTERED_EMAIL_NOT_FOUND = 'No se encontró una cuenta registrada para este mail!'
const ERROR_RESETTING_PWD = 'Ocurrió un error!'

export class ResetPasswordScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            emailAddress: '',
            modalVisible: false,
            modalText: '',
            errorOcurred: false
        }
    }

    setModalVisible = (visible) => {
        this.setState({ modalVisible: visible });
    }

    render() {

        const { navigation } = this.props;

        const handleResetPassword = () => {
            if (!validateEmail(this.state.emailAddress)) {
                return this.setState({modalText:ENTER_VALID_EMAIL, errorOcurred: false, modalVisible: true})
            }

            console.log(`Resetting password for email ${this.state.emailAddress}.`);
            putJsonData(global.noticeServiceBaseUrl + '/users/password/reset', 
                { "emailAddress": this.state.emailAddress },
            ).then((response) => {
                console.log(`Password reset for${this.state.emailAddress}`);
                this.setState({modalText: RESET_PWD_SUCCESS, modalVisible: true})
            }).catch(error => {
                console.error(`Error resetting password for  ${this.state.emailAddress}: ${JSON.stringify(error)}`);
                if (error.statusCode == HttpStatusCodes.NOT_FOUND) {
                    this.setState({modalText: ENTERED_EMAIL_NOT_FOUND, modalVisible: true, errorOcurred: true})
                    console.error(`Error no user found for this email address`);
                    return;
                }
                this.setState({modalText: ERROR_RESETTING_PWD + `: ${error}`, modalVisible: true, errorOcurred: true})
            });   
            
        };


        return (
            <>
            <SafeAreaView
                edges={["top"]}
                style={{ flex: 0, backgroundColor: colors.white }}/>
            <SafeAreaView
                edges={["left", "right", "bottom"]}
                style={commonStyles.container} >
                <HeaderWithBackArrow headerText={""} headerTextColor={colors.primary} backgroundColor={colors.white} backArrowColor={colors.primary} onBackArrowPress={() => this.props.navigation.goBack()} />

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
                            {this.state.errorOcurred? 
                                <Text style={styles.titleError}>Error!</Text>
                                : null 
                            }    
                            <Text style={styles.modalText}>{this.state.modalText}</Text>
                            <TouchableOpacity
                                style={[styles.modalButton, {width: '50%', alignSelf: 'center', alignItems: 'center'}, this.state.errorOcurred? styles.modalButtonError : styles.modalButtonSuccess]}
                                onPress={() => {
                                    this.setModalVisible(!this.state.modalVisible);
                                    if (this.state.errorOcurred) {
                                        navigation.popToTop();
                                    }
                                }}>
                                <Text style={{color: colors.white, fontWeight: '500'}}>Ok</Text>
                            </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                </View>

                <View style={{paddingTop: 40}}>  
                    <Text style={styles.title}>¿Olvidaste tu contraseña?</Text>  
                </View> 
                <View style={{marginHorizontal:'5%', marginTop: 80, flexDirection: 'row', flexWrap: 'wrap',  textAlign: 'center'}}> 
                    <Text style={styles.subtitle}>Ingresá tu dirección de email y te asignaremos una nueva contraseña provisoria</Text>
                </View> 

                <TextInput 
                    placeholder = 'Email'
                    onChangeText = { emailInput => { this.setState({ emailAddress: emailInput })}}
                    autoCapitalize = 'none'
                    autoCorrect = { false }
                    style = {styles.textInput}
                    maxLength = { 30 }
                />

                <View style={{paddingTop: 30, paddingBottom: 50}}>
                    <AppButton
                        buttonText={'Blanquear contraseña'} 
                        onPress={handleResetPassword} 
                        additionalButtonStyles={[styles.button, { marginTop: 60, margin: 30 }]} />
                </View>
            </SafeAreaView>
            </>
        )
    }
}

const styles = StyleSheet.create({
    button: {
      backgroundColor: colors.primary,
      alignSelf: 'stretch',
    },
    modalButton: {
        margin: 0,
        marginTop: 10,
        padding: 18, 
        borderRadius: 7, 
        width: '55%', 
        alignSelf: 'flex-start'
    },
    modalButtonSuccess: {
        backgroundColor: colors.secondary,
    },
    modalButtonError: {
        backgroundColor: colors.pink,
    },
    title: {
        fontWeight: '500',
        color: colors.primary,
        fontSize: 24,
        alignSelf: 'center'
    },
    titleError: {
        fontWeight: '500',
        color: colors.pink,
        fontSize: 20,
        margin: 10,
        alignSelf: 'center'
    },
    subtitle: {
        textAlign: 'center', 
        color:colors.clearBlack, 
        fontSize: 16,
        paddingBottom: '5%',
        marginBottom: '5%',
        marginTop: '5%',
        paddingLeft: '3%',
    },
    text: {
        color:colors.darkGrey, 
        fontSize: 16,
        padding: '5%',
        marginLeft:'8%'
    },
    textInput: {
        borderRadius: 8, 
        backgroundColor: colors.inputGrey, 
        padding: 15, 
        borderWidth: 1, 
        borderColor: colors.inputGrey, 
        fontSize: 16, 
        fontWeight: '500',
        marginHorizontal: 30
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
})