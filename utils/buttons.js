import React from 'react';

import { StyleSheet, TouchableOpacity, Text } from 'react-native';

import colors from '../config/colors';


export function showButton(buttonText, onPress, additionalButtonStyles = {}, additionalTextStyles = {}) {
    return <TouchableOpacity style={[styles.button, additionalButtonStyles]} onPress={onPress}>
        <Text style={[styles.buttonFont, additionalTextStyles]}>{buttonText}</Text>
    </TouchableOpacity>;  
}

const styles = StyleSheet.create({
    buttonFont: {
        fontSize: 16, 
        fontWeight: '500', 
        alignSelf: 'center',
        color: colors.white
    },
    button: {
        margin: 10,
        padding: 18, 
        borderRadius: 7,
        backgroundColor: colors.secondary
    },
});
