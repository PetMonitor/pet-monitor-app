import React from 'react';

import { StyleSheet, Text, View, Modal } from 'react-native';
import { AppButton } from './buttons';
import { OptionTextInput } from './editionHelper';

import commonStyles from './styles';
import colors from '../config/colors';

const ContactInfo = ({name, email, phoneNumber, onContactUserPress, onChangeEmailMessage, emailMessage, onChangeName, onChangeEmail, onChangePhoneNumber, onCancelPress}) => {
    return (
        <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Contactar usuario</Text>
            <Text style={styles.modalText}>Si necesitás comunicarte con el dueño del reporte, escribile el mensaje que quieras a continuación y luego se podrá contactar con vos.</Text>
            <OptionTextInput 
                onChangeText={onChangeEmailMessage}
                value={emailMessage}
                isMultiline={true}
                autoCapitalize={false}
                placeholder={"Ingrese un mensaje"}
                multilineLength={1000}
                additionalStyle={{fontSize: 14, height: 200, marginTop: 0}}
                />
            <Text style={[styles.modalText, {fontSize: 15, fontWeight: 'bold', marginTop: 15}]}>Información de contacto</Text>
            <Text style={styles.modalText}>Ingresá tus datos de contacto para que pueda responderte.</Text>
            <OptionTextInput 
                onChangeText={onChangeName}
                value={name}
                autoCapitalize={true}
                placeholder={"Nombre"}
                additionalStyle={{fontSize: 14, marginTop: 0}}
                />
            <OptionTextInput 
                onChangeText={onChangeEmail}
                value={email}
                autoCapitalize={false}
                placeholder={"Email"}
                additionalStyle={{fontSize: 14}}
                />
            <OptionTextInput 
                onChangeText={onChangePhoneNumber}
                value={phoneNumber}
                autoCapitalize={false}
                placeholder={"Teléfono"}
                additionalStyle={{fontSize: 14, marginBottom: 10}}
                />
            <View style={commonStyles.alignedContent}>
                <AppButton buttonText={"Cancelar"} onPress={onCancelPress} additionalButtonStyles={{flex: 1, backgroundColor: colors.pink }}/>
                <AppButton buttonText={"Enviar"} onPress={onContactUserPress} additionalButtonStyles={{flex: 1, backgroundColor: colors.primary }}/>
            </View>
        </View>
    );
}

export const ContactInfoModal = ({isVisible, onModalClose, name, email, phoneNumber, onContactUserPress, emailMessage, onChangeEmailMessage, onChangeName, onChangeEmail, onChangePhoneNumber, onCancelPress}) => {
    return (
        <View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={isVisible}
                onRequestClose={onModalClose}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'stretch' }}>
                   <ContactInfo name={name} email={email} phoneNumber={phoneNumber} onContactUserPress={onContactUserPress} emailMessage={emailMessage} onChangeEmailMessage={onChangeEmailMessage} onChangeName={onChangeName} onChangeEmail={onChangeEmail} onChangePhoneNumber={onChangePhoneNumber} onCancelPress={onCancelPress} />
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    modalView: {
        margin: 20,
        backgroundColor: colors.white,
        borderRadius: 20,
        padding: 35,
        shadowColor: colors.clearBlack,
        shadowOffset: {
        width: 0,
        height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    modalTitle: {
        marginBottom: 15,
        color: colors.secondary,
        fontWeight: 'bold',
        fontSize: 18,
        textAlign: "center"
    },
    modalText: {
      marginBottom: 15,
      color: colors.clearBlack
    }
});
