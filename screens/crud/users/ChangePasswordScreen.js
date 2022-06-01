import React, {useState} from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, TextInput, StyleSheet, View } from 'react-native';

import { putJsonData } from "../../../utils/requests";
import { getSecureStoreValueFor } from '../../../utils/store';
import { HeaderWithBackArrow } from "../../../utils/headers";

import commonStyles from '../../../utils/styles';
import colors from '../../../config/colors';
import { AppButton } from "../../../utils/buttons";


const ChangePasswordScreen = ({ route, navigation }) => {

    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmedNewPassword, setConfirmedNewPassword] = useState('');

    const handleSetNewPassword = () => {

        if (!(newPassword && confirmedNewPassword && oldPassword)) {
            alert('Debe ingresar un valor para cada campo!');
        }

        if (newPassword != confirmedNewPassword) {
            alert('La constaseña nueva y la confirmación no son iguales! Intente nuevamente.');
            return;
        }
        alert('Set new password!');

        getSecureStoreValueFor('sessionToken').then((sessionToken) => {
            putJsonData(global.noticeServiceBaseUrl + '/users/' + route.params.userId + '/password', 
            {
                _ref: route.params.ref,
                oldPassword: oldPassword,
                newPassword: newPassword
            },
            {
                'Authorization': 'Basic ' + sessionToken 
            }).then(response => {
                console.log(`User password successfully updated!`);
                alert(`Password successfully updated!`);
                navigation.pop();
            }).catch(err => {
                console.log(err);
                alert(err)
            });
        });        
    }
    
    return ( <>
        <SafeAreaView
                edges={["top"]}
                style={{ flex: 0, backgroundColor: colors.primary }}/>
            <SafeAreaView
                edges={["left", "right", "bottom"]}
                style={commonStyles.container} >                
                <HeaderWithBackArrow headerText={"Cambiar contraseña"} headerTextColor={colors.white} backgroundColor={colors.primary} backArrowColor={colors.white} onBackArrowPress={() => navigation.goBack()}/> 
                
            <View style={styles.topContainer}>
                <Text style={styles.textLabel}>Contraseña actual</Text>
                <TextInput 
                    onChangeText = { passwordInput => { setOldPassword(passwordInput) }}
                    autoCapitalize = 'none'
                    autoCorrect = { false }
                    style = {[styles.textInput, , {marginBottom: 10}]}
                    maxLength = { 30 }
                    secureTextEntry = { true }   
                />
                    
                <Text style={styles.textLabel}>Nueva contraseña</Text>
                <TextInput 
                    onChangeText = { passwordInput => { setNewPassword(passwordInput) }}
                    autoCapitalize = 'none'
                    autoCorrect = { false }
                    style = {[styles.textInput, , {marginBottom: 10}]}
                    maxLength = { 30 }
                    secureTextEntry = { true }   
                />

                <Text style={styles.textLabel}>Repetir nueva contraseña</Text>
                <TextInput 
                    onChangeText = { passwordInput => { setConfirmedNewPassword(passwordInput) }}
                    autoCapitalize = 'none'
                    autoCorrect = { false }
                    style = {[styles.textInput, {marginBottom: 40}]}
                    maxLength = { 30 }
                    secureTextEntry = { true }   
                />
                <AppButton
                        buttonText={"Guardar cambios"} 
                        onPress={handleSetNewPassword} 
                        additionalButtonStyles={styles.button} /> 
            </View>
        </SafeAreaView>
   </>);

}

const styles = StyleSheet.create({
    topContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'baseline',
        marginLeft: 60,
        marginRight: 60
    },
    textLabel: {
        color: colors.darkGrey,
        fontSize: 18,
        marginTop: 20,
        marginBottom: 10,
        fontWeight: '500'
    },
    textInput: {
        color: colors.darkGrey,
        borderRadius: 8, 
        backgroundColor: colors.inputGrey, 
        borderWidth: 1, 
        borderColor: colors.inputGrey, 
        fontSize: 16, 
        fontWeight: '500',
        height: '10%',
        padding: 10,
        alignSelf: 'stretch',
    },
    button: {
        marginHorizontal: 0,
        backgroundColor: colors.primary,
        alignSelf: 'stretch'
    },
});

export default ChangePasswordScreen;
