import React from 'react';

import { StyleSheet, TouchableOpacity, Text, View } from 'react-native';

import commonStyles from './styles'
import colors from '../config/colors';

export const AppButton = ({buttonText, onPress, additionalButtonStyles = {}, additionalTextStyles = {}, additionalElement = <></>, additionalContainerStyle = { justifyContent: 'center'}, isDisabled = false}) => {
    return (<TouchableOpacity style={[styles.button, additionalButtonStyles, isDisabled ? {backgroundColor: colors.inputGrey} : {}]} onPress={onPress} disabled={isDisabled}> 
        <View style={[commonStyles.alignedContent, additionalContainerStyle]}>
            {additionalElement}
            <Text style={[styles.buttonFont, additionalTextStyles]}>{buttonText}</Text>
        </View>
    </TouchableOpacity>
    );  
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
