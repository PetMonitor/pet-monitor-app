import React, {useState} from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, TextInput , TouchableOpacity, StyleSheet, View } from 'react-native';
import { putJsonData } from "../../../utils/requests";
import { getSecureStoreValueFor } from '../../../utils/store';
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
        <SafeAreaView style={styles.container}>
                <Text>Contraseña actual</Text>
                    <TextInput 
                        onChangeText = { passwordInput => { setOldPassword(passwordInput) }}
                        autoCapitalize = 'none'
                        autoCorrect = { false }
                        style = {styles.textInput}
                        maxLength = { 30 }
                        secureTextEntry = { true }   
                    />
                    
                    <Text>Nueva contraseña</Text>
                    <TextInput 
                        onChangeText = { passwordInput => { setNewPassword(passwordInput) }}
                        autoCapitalize = 'none'
                        autoCorrect = { false }
                        style = {styles.textInput}
                        maxLength = { 30 }
                        secureTextEntry = { true }   
                    />

                    <Text>Repetir nueva contraseña</Text>
                    <TextInput 
                        onChangeText = { passwordInput => { setConfirmedNewPassword(passwordInput) }}
                        autoCapitalize = 'none'
                        autoCorrect = { false }
                        style = {styles.textInput}
                        maxLength = { 30 }
                        secureTextEntry = { true }   
                    />
                <TouchableOpacity 
                        style={[styles.button]}
                        onPress={handleSetNewPassword}>
                        <Text style={[styles.buttonFont, { color: colors.white }]}>Guardar Cambios</Text>
                </TouchableOpacity>
        </SafeAreaView>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.pink,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        flexDirection: 'column',
        alignItems: 'baseline'
    },
    textLabel: {
        color: colors.darkGery,
        fontSize: 20,
        marginTop: 24,
        marginLeft: 20,
        marginBottom: 18
    },
    textInput: {
        color: colors.darkGery,
        borderRadius: 8, 
        backgroundColor: colors.inputGrey, 
        borderWidth: 1, 
        borderColor: colors.inputGrey, 
        fontSize: 18, 
        fontWeight: '500',
        margin: 15,
        width: '80%',
        height: '8%',
        padding: 15,
    },
    buttonFont: {
        fontSize: 18, 
        fontWeight: "bold", 
        alignSelf: "center",
        marginTop: 15,
    },
    button: {
        backgroundColor: colors.primary,
        paddingBottom: 10, 
        borderRadius: 7, 
        width: "80%", 
        marginLeft: 40, 
        marginBottom: 20,
        marginTop: 25,
        height: "10%", 
    },
});


export default ChangePasswordScreen;