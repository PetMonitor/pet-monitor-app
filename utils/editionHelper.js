import React from 'react';

import { Picker } from '@react-native-picker/picker';
import { StyleSheet, TextInput, Text, TouchableOpacity, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Dog, Cat } from 'phosphor-react-native';

import styles from './styles';
import colors from '../config/colors';

/********************* REPORTS *********************/

export function getReportTypeItems() {
    return [ 
        <Picker.Item label="Mascota perdida" value="LOST" />,
        <Picker.Item label="Mascota encontrada" value="FOUND" />,
        <Picker.Item label="Mascota en adopción" value="FOR_ADOPTION" />,
        <Picker.Item label="Mascota robada" value="STOLEN" /> 
    ]
}

export function getDatePicker(value, onValueChange) {
    return <DateTimePicker
        testID="dateTimePicker"
        value={value}
        mode='date'
        locale='es'
        display="default"
        maximumDate={Date.now()}
        onChange={(event, selectedDate) => onValueChange(selectedDate)}
        // style={{marginLeft: 10, paddingTop: 50}}
        style={{paddingTop: 50, marginRight: 10}}
    />
}

export function getTimePicker(value, onValueChange) {
    return <DateTimePicker
        testID='dateTimePicker'
        value={value}
        mode='hour'
        is24Hour={true}
        display='default'
        onChange={(event, selectedDate) => onValueChange(selectedDate)}
        style={{paddingTop: 50}}
        // style={{paddingTop: 50, marginRight: 10, marginLeft: 10}}
    />
}

/********************* PET *********************/

export function getPetTypeItems() {
    return [ <Picker.Item label="Gato" value="CAT" />, <Picker.Item label="Perro" value="DOG" /> ]
}

export function getSexTypeItems() {
    return [ <Picker.Item label="Macho" value="MALE" />, <Picker.Item label="Hembra" value="FEMALE" /> ]
}

export function getLifeStageItems() {
    return [ 
        <Picker.Item label="Bebé" value="BABY" />, 
        <Picker.Item label="Adulto" value="ADULT" />, 
        <Picker.Item label="Mayor" value="SENIOR" /> 
    ]
}

export function getSizeTypeItems() {
    return [ 
        <Picker.Item label="Pequeño" value="SMALL" />, 
        <Picker.Item label="Mediano" value="MEDIUM" />, 
        <Picker.Item label="Grande" value="LARGE" /> 
    ]
}

/********************* GENERAL *********************/

export function getPickerOnValue(value, onValueChange, getPickerItems) {
    return <Picker
        selectedValue={value}
        itemStyle={editionStyles.picker}
        onValueChange={(itemValue, itemIndex) => onValueChange(itemValue)}>
        {getPickerItems()}
    </Picker>;
}

export function showTextInput(onChangeText, value = '', isMultiline = false ) {
    return <TextInput
        onChangeText = {onChangeText}
        autoCorrect = { false }
        style = {[editionStyles.textInput, isMultiline ? {paddingBottom: 90, paddingTop: 10} : {}]}
        maxLength = { isMultiline ? 100 : 50 }
        multiline = {isMultiline}
        placeholder = {isMultiline ? "Ingrese descripción" : ""}
        value = { value ? value : "" }
    />
}

export function showCheckBoxItem(optionIsSelected, checkBoxTitle, onPress) {
    return <TouchableOpacity style={[styles.alignedContent, {marginTop: 10}]} 
        onPress={onPress}>
        <MaterialIcon
            name={optionIsSelected ? 'checkbox-marked' : 'checkbox-blank'}
            size={23}
            color={optionIsSelected ? colors.secondary : colors.inputGrey}
            // style={{marginLeft: 10}}
        />
        <Text style={editionStyles.checkBoxOptionTitle}>{checkBoxTitle}</Text>
    </TouchableOpacity>
}

export function showDogCatSelector(onPressDog, onPressCat, dogIsSelected, catIsSelected) {
    return <View style={[styles.alignedContent, {justifyContent:'space-evenly'}]}>
        <TouchableOpacity onPress={onPressDog}>
            <Dog color={dogIsSelected ? colors.secondary : colors.inputGrey} weight='regular' size={68} />
        </TouchableOpacity>
        <TouchableOpacity onPress={onPressCat}>
            <Cat color={catIsSelected ? colors.secondary : colors.inputGrey} weight='regular' size={68} />
        </TouchableOpacity>
    </View>
}

export function showOptionTitle(optionTitle, additionalStyle = {}) {
    return <Text style={[editionStyles.optionTitle, additionalStyle]}>{optionTitle}</Text>
}

export function showSectionTitle(sectionTitle) {
    return <Text style={editionStyles.sectionTitle}>{sectionTitle}</Text>
}

const editionStyles = StyleSheet.create({
    checkBoxOptionTitle: {
        marginLeft: 5, 
        fontSize: 15
    },
    sectionTitle: {
        fontSize: 20, 
        color: colors.primary,
        // paddingLeft: 10, 
        paddingTop: 25, 
        paddingBottom: 5, 
        fontWeight: 'bold',
    },
    optionTitle: {
        fontSize: 16, 
        color: colors.clearBlack,
        // paddingLeft: 10, 
        paddingTop: 15, 
        fontWeight: '500'
    },
    textInput: {
        borderRadius: 8, 
        backgroundColor: colors.inputGrey, 
        padding: 15, 
        borderWidth: 1, 
        borderColor: colors.inputGrey, 
        fontSize: 16, 
        fontWeight: '500',
        // marginLeft: 10, 
        marginTop: 10, 
        // marginRight: 10
    },
    picker: { 
        height: 88, 
        fontSize: 18 
    },
});
