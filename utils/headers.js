import React from 'react';

import { View, Text, TouchableOpacity } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import colors from '../config/colors';


export const HeaderWithBackArrow = ({headerText = "", headerTextColor = colors.primary, backgroundColor, backArrowColor, onBackArrowPress, additionalElement = <></>}) => {
    return (
        <View style={{backgroundColor: backgroundColor}}>
            <View style={{justifyContent: 'center', alignItems: 'flex-start', marginTop: 20, marginBottom: 10}}>
                <TouchableOpacity onPress={onBackArrowPress}>
                    <MaterialIcon
                        name='arrow-left'
                        size={30}
                        color={backArrowColor}
                        style={{marginLeft: 10}} />
                </TouchableOpacity>
                <Text style={{fontSize: 24, fontWeight: 'bold', marginLeft: 60, color: headerTextColor, position: 'absolute'}}>{headerText}</Text>
                {additionalElement}
            </View>
            <View style={{borderBottomWidth: 1, borderBottomColor: colors.inputGrey}}></View>
        </View>
    );
}

