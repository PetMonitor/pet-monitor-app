import React from 'react';

import { Text, StyleSheet, View, TextInput, TouchableOpacity, Switch, ScrollView, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Dog, Cat } from 'phosphor-react-native';

import { HeaderWithBackArrow } from '../utils/headers';
import { AppButton } from '../utils/buttons';

import commonStyles from '../utils/styles';
import colors from '../config/colors';

/** Implements the screen that shows the settings of a given pet fostering volunteer. */
export class FosteringVolunteerProfileSettingsScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            dogIsSelected: false,
            catIsSelected: false,
            city: "",
            province: "",
            available: true,
            smallSizeIsSelected: false,
            mediumSizeIsSelected: false,
            largeSizeIsSelected: false,
            additionalInfo: ""
        };
    }

    petFosteringMapper = (canFoster) => {
        if (canFoster.length == 1) {    
            return this.petMapper(canFoster[0]);
        } else if (canFoster.includes("DOG") && canFoster.includes("CAT")) {
            return "perros y gatos";
        }
    }

    petMapper = (petType) => {
        if (petType == "DOG") {
            return "perros"
        } else if (petType == "CAT") {
            return "gatos"
        } else {
            ""
        }
    }

    mapPetSizeToLabel = (size) => {
        if (size == "SMALL") {
            return "Pequeña"
        } else if (size == "MEDIUM") {
            return "Mediana"
        } else if (size == "LARGE") {
            return "Grande"
        }
    }

    saveSettings = () => {

    }

    showTextInput = (onChangeText, isMultiline = false ) => (
        <TextInput
            onChangeText = {onChangeText}
            autoCorrect = { false }
            style = {[styles.textInput, isMultiline ? {paddingBottom: 90, paddingTop: 10} : {}]}
            maxLength = { isMultiline ? 200 : 50 }
            multiline = {isMultiline}
            placeholder = {isMultiline ? "Ingrese descripción" : ""}
        />
    )

    showTextInput = (onChangeText, isMultiline = false ) => (
        <TextInput
            onChangeText = {onChangeText}
            autoCorrect = { false }
            style = {[styles.textInput, isMultiline ? {paddingBottom: 90, paddingTop: 10} : {}]}
            maxLength = { isMultiline ? 200 : 50 }
            multiline = {isMultiline}
            placeholder = {isMultiline ? "Ingrese descripción" : ""}
        />
    )

    showCheckBoxItem = (optionIsSelected, checkBoxTitle) => (
        <>
            <Icon
                name={optionIsSelected ? 'checkbox-marked' : 'checkbox-blank'}
                size={25}
                color={optionIsSelected ? colors.secondary : colors.inputGrey}
            />
            <Text style={styles.checkBoxOptionTitle}>{checkBoxTitle}</Text>
        </>
    )

    render() {
        return ( <>
            <SafeAreaView
                edges={["top"]}
                style={{ flex: 0, backgroundColor: colors.primary }}/>
            <SafeAreaView
                edges={["left", "right", "bottom"]}
                style={commonStyles.container} >
                <HeaderWithBackArrow headerText={"Información voluntariado"} backgroundColor={colors.primary} backArrowColor={colors.white} onBackArrowPress={() => this.props.navigation.goBack()}/>
               
                <ScrollView style={{marginLeft: 20, marginRight: 20}}>
                    <Text style={[styles.titleText, {marginTop: 15}]}>Puedo transitar</Text>
                    <View style={[styles.alignedContent, {justifyContent:'space-evenly'}]}>
                        <TouchableOpacity onPress={() => this.setState({ dogIsSelected: !this.state.dogIsSelected })}>
                            <Dog color={this.state.dogIsSelected ? colors.secondary : colors.inputGrey} weight='regular' size={68} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.setState({ catIsSelected: !this.state.catIsSelected })}>
                            <Cat color={this.state.catIsSelected ? colors.secondary : colors.inputGrey} weight='regular' size={68} />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.titleText}>Zona</Text>
                    <Text style={[styles.optionTitle, {paddingTop: 10}]}>Provincia</Text>
                    {this.showTextInput(text => { this.setState({ province: text })})}

                    <Text style={styles.optionTitle}>Ciudad</Text>
                    {this.showTextInput(text => { this.setState({ city: text })})}

                    <Text style={styles.titleText}>Información adicional</Text>
                    {this.showTextInput(text => { this.setState({ additionalInfo: text })}, true)}

                    <Text style={styles.titleText}>Tamaño mascota a transitar</Text>
                    <TouchableOpacity  style={styles.alignedContent} 
                        onPress={() => this.setState({ smallSizeIsSelected: !this.state.smallSizeIsSelected })}>
                        {this.showCheckBoxItem(this.state.smallSizeIsSelected, "Pequeña")}
                    </TouchableOpacity>
                    <TouchableOpacity  style={styles.alignedContent} 
                        onPress={() => this.setState({ mediumSizeIsSelected: !this.state.mediumSizeIsSelected })}>
                        {this.showCheckBoxItem(this.state.mediumSizeIsSelected, "Mediana")}
                    </TouchableOpacity>
                    <TouchableOpacity  style={styles.alignedContent} 
                        onPress={() => this.setState({ largeSizeIsSelected: !this.state.largeSizeIsSelected })}>
                        {this.showCheckBoxItem(this.state.largeSizeIsSelected, "Grande")}
                    </TouchableOpacity>  

                    <Text style={styles.titleText}>Disponible</Text>
                    <Switch
                        trackColor={{ false: colors.grey, true: colors.secondary }}
                        thumbColor={colors.white}
                        onValueChange={() => this.setState({ available: !this.state.available })}
                        value={this.state.available}
                        style={{ transform: [{ scaleX: .8 }, { scaleY: .8 }] }}
                    />

                    <AppButton
                        buttonText={"Guardar Información"} 
                        onPress={this.saveSettings} 
                        additionalButtonStyles={{alignSelf: 'center', marginBottom: 30, marginTop: 30}} />
                </ScrollView>               
            </SafeAreaView>
            </>
        )
    }
}

const styles = StyleSheet.create({
    titleText: {
        color: colors.clearBlack, 
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 25, 
        marginBottom: 5
    },
    text: {
        color: colors.clearBlack, 
        fontSize: 16
    },
    alignedContent: {
        ...commonStyles.alignedContent,
        marginTop: 10
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
        marginRight: 10
    },
    optionTitle: {
        fontSize: 16, 
        color: colors.clearBlack,
        paddingTop: 15, 
        fontWeight: '500'
    },
    checkBoxOptionTitle: {
        marginLeft: 5, 
        fontSize: 15
    },
});
