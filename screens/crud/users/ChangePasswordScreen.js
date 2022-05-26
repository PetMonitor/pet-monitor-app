import React, {useState} from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, TextInput , TouchableOpacity, StyleSheet, View } from 'react-native';

import { putJsonData } from "../../../utils/requests";
import { getSecureStoreValueFor } from '../../../utils/store';

import commonStyles from '../../../utils/styles';
import colors from '../../../config/colors';


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
    
    return (
        <SafeAreaView style={commonStyles.container}>
            <View style={styles.topContainer}>
                <Text style={styles.textLabel}>Contraseña actual</Text>
                <TextInput 
                    onChangeText = { passwordInput => { setOldPassword(passwordInput) }}
                    autoCapitalize = 'none'
                    autoCorrect = { false }
                    style = {styles.textInput}
                    maxLength = { 30 }
                    secureTextEntry = { true }   
                />
                    
                <Text style={styles.textLabel}>Nueva contraseña</Text>
                <TextInput 
                    onChangeText = { passwordInput => { setNewPassword(passwordInput) }}
                    autoCapitalize = 'none'
                    autoCorrect = { false }
                    style = {styles.textInput}
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
                <TouchableOpacity 
                    style={[styles.button]}
                    onPress={handleSetNewPassword}>
                    <Text style={[styles.buttonFont, { color: colors.white }]}>Guardar Cambios</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );

}

const styles = StyleSheet.create({
    topContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'baseline',
        marginLeft: 15,
    },
    textLabel: {
        color: colors.darkGrey,
        fontSize: 20,
        marginTop: 10,
        marginBottom: 10,
        marginLeft: '10%',
    },
    textInput: {
        color: colors.darkGrey,
        borderRadius: 8, 
        backgroundColor: colors.inputGrey, 
        borderWidth: 1, 
        borderColor: colors.inputGrey, 
        fontSize: 18, 
        fontWeight: '500',
        height: '10%',
        padding: 10,
        margin: 10,
        width: '70%',
        marginLeft: '10%',
    },
    buttonFont: {
        fontSize: 18, 
        fontWeight: "bold", 
        alignSelf: "center",
    },
    button: {
        padding: 10,
        borderRadius: 7,
        backgroundColor: colors.primary,
        width: '70%',
        marginLeft:'10%'
    },
});


export default ChangePasswordScreen;