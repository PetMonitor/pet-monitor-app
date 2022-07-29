import React from 'react';

import { Picker } from '@react-native-picker/picker';
import { StyleSheet, TextInput, Text, TouchableOpacity, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Dog, Cat } from 'phosphor-react-native';

import styles from './styles';
import colors from '../config/colors';

/********************* REPORTS *********************/

export function getReportTypePickerItems() {
    return [
        <Picker.Item label="Mascota perdida" value="LOST" key="lost" />,
        <Picker.Item label="Mascota encontrada" value="FOUND" key="found" />,
        <Picker.Item label="Mascota en adopción" value="FOR_ADOPTION" key="adoption" />,
        <Picker.Item label="Mascota robada" value="STOLEN" key="stolen" /> 
    ];
}

export function getDatePicker(value, onValueChange, additionalStyle = {}) {
    return <DateTimePicker
        testID="dateTimePicker"
        value={value}
        mode='date'
        locale='es'
        display="default"
        maximumDate={Date.now()}
        onChange={(event, selectedDate) => onValueChange(selectedDate)}
        style={{paddingTop: 50, marginRight: 10, ...additionalStyle}}
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
    />
}

/********************* PET *********************/

export function getPetTypePickerItems() {
    return [
        <Picker.Item label="Gato" value="CAT" key="cat" />,
        <Picker.Item label="Perro" value="DOG" key="dog" />
    ];
}

export function getSexTypePickerItems() {
    return [
        <Picker.Item label="Macho" value="MALE" key="male" />, 
        <Picker.Item label="Hembra" value="FEMALE" key="female" />
    ];
}

export function getLifeStagePickerItems() {
    return [
        <Picker.Item label="Bebé" value="BABY" key="baby" />,
        <Picker.Item label="Adulto" value="ADULT" key="adult" />,
        <Picker.Item label="Mayor" value="SENIOR" key="senior" /> 
    ];
}

export function getSizeTypePickerItems() {
    return [
        <Picker.Item label="Pequeño" value="SMALL" key="small" />,
        <Picker.Item label="Mediano" value="MEDIUM" key="medium" />,
        <Picker.Item label="Grande" value="LARGE" key="large" /> 
    ];
}

/********************* GENERAL *********************/

export const PickerOnValue = ({value, onValueChange, pickerItems}) => {
    return <Picker
        selectedValue={value}
        itemStyle={editionStyles.picker}
        onValueChange={(itemValue, itemIndex) => onValueChange(itemValue)}>
        {pickerItems()}
    </Picker>;
}

export const OptionTextInput = ({onChangeText, value = '', isMultiline = false, autoCapitalize = "sentences", placeholder = "", additionalStyle = {} }) => {
    return <TextInput
        onChangeText = {onChangeText}
        autoCorrect = { false }
        autoCapitalize={autoCapitalize}
        style = {[editionStyles.textInput, isMultiline ? {height: 120, paddingTop: 10, paddingBottom: 10} : {}, additionalStyle]}
        maxLength = { isMultiline ? 300 : 50 }
        multiline = {isMultiline}
        placeholder = {isMultiline ? "Ingrese descripción" : placeholder}
        value = { value ? value : "" }
    />
}

export const CheckBoxItem = ({optionIsSelected, checkBoxTitle, onPress, additionalStyle = {}, additionalTextStyle = {}}) => {
    return <TouchableOpacity style={[styles.alignedContent, {marginTop: 10}, additionalStyle]} 
        onPress={onPress}>
        <MaterialIcon
            name={optionIsSelected ? 'checkbox-marked' : 'checkbox-blank'}
            size={23}
            color={optionIsSelected ? colors.secondary : colors.inputGrey}
        />
        <Text style={[editionStyles.checkBoxOptionTitle, additionalTextStyle]}>{checkBoxTitle}</Text>
    </TouchableOpacity>
}

export const DogCatSelector = ({onPressDog, onPressCat, dogIsSelected, catIsSelected}) => {
    return <View style={[styles.alignedContent, {justifyContent:'space-evenly'}]}>
        <TouchableOpacity onPress={onPressDog}>
            <Dog color={dogIsSelected ? colors.secondary : colors.inputGrey} weight='regular' size={68} />
        </TouchableOpacity>
        <TouchableOpacity onPress={onPressCat}>
            <Cat color={catIsSelected ? colors.secondary : colors.inputGrey} weight='regular' size={68} />
        </TouchableOpacity>
    </View>
}

export const OptionTitle = ({text, additionalStyle = {}}) => {
    return <Text style={[editionStyles.optionTitle, additionalStyle]}>{text}</Text>
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
        paddingTop: 25, 
        paddingBottom: 5, 
        fontWeight: 'bold',
    },
    optionTitle: {
        fontSize: 16, 
        color: colors.clearBlack,
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
        marginTop: 10, 
    },
    picker: { 
        height: 88, 
        fontSize: 18 
    },
});
