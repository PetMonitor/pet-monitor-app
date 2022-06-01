import React from 'react';

import { Text, StyleSheet, Switch, ScrollView, SafeAreaView, Alert } from 'react-native';

import { HeaderWithBackArrow } from '../utils/headers';
import { AppButton } from '../utils/buttons';
import { CheckBoxItem, OptionTextInput, DogCatSelector } from '../utils/editionHelper';
import { putJsonData, postJsonData, deleteJsonData } from "../utils/requests";
import { getSecureStoreValueFor } from '../utils/store';

import commonStyles from '../utils/styles';
import colors from '../config/colors';

/** Implements the screen that shows the settings of a given pet fostering volunteer. */
export class FosteringVolunteerProfileSettingsScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            dogIsSelected: false,
            catIsSelected: false,
            location: "",
            province: "",
            available: true,
            smallSizeIsSelected: false,
            mediumSizeIsSelected: false,
            largeSizeIsSelected: false,
            additionalInfo: "",
            profileId: null,
            _ref: null,
            userId: null,
            averageRating: null,
            ratingAmount: null
        };
    }

    getPetSizes = () => {
        let sizes = []
        if (this.state.smallSizeIsSelected) {
            sizes.push('SMALL')
        }
        if (this.state.mediumSizeIsSelected) {
            sizes.push('MEDIUM')
        }
        if (this.state.largeSizeIsSelected) {
            sizes.push('LARGE')
        }
        return sizes
    }

    getPetTypes = () => {
        let types = []
        if (this.state.dogIsSelected) {
            types.push('DOG')
        }
        if (this.state.catIsSelected) {
            types.push('CAT')
        }
        return types
    }

    saveSettings = () => {
        if (this.state.profileId) {
            this.saveData();  
        } else {
            this.createData();
        }
    }

    removeSettings = () => {
        deleteJsonData(global.noticeServiceBaseUrl + '/fosterVolunteerProfiles/' + this.state.profileId)
        .then(response => {
            console.log(response);
            Alert.alert('', `Perfil de voluntariado eliminado!`);
            this.props.navigation.pop();
            this.props.route.params.updateProfiles(null);
        }).catch(err => {
            alert(err);
            return;
        });
    }

    saveData() {
        getSecureStoreValueFor('sessionToken').then((sessionToken) => {
            putJsonData(global.noticeServiceBaseUrl + '/fosterVolunteerProfiles/' + this.state.profileId,
                {
                    _ref: this.state._ref,
                    userId: this.state.userId,
                    petTypesToFoster: this.getPetTypes(),
                    petSizesToFoster: this.getPetSizes(),
                    additionalInformation: this.state.additionalInfo,
                    location: this.state.location,
                    province: this.state.province,
                    available: this.state.available,
                    averageRating: this.state.averageRating,
                    ratingAmount: this.state.ratingAmount
                },
                {
                    'Authorization': 'Basic ' + sessionToken
                }).then(response => {
                    console.log(`Profile successfully updated!`);
                    Alert.alert('', `Perfil de voluntariado actualizado!`);
                    this.props.navigation.pop();
                    this.props.route.params.updateProfiles(response);
                }).catch(err => {
                    console.log(err);
                    alert(err);
                });
        });
    }

    createData() {
        getSecureStoreValueFor('sessionToken').then((sessionToken) => {
            getSecureStoreValueFor("userId").then(userId => {
                postJsonData(global.noticeServiceBaseUrl + '/fosterVolunteerProfiles',
                    {
                        userId: userId,
                        petTypesToFoster: this.getPetTypes(),
                        petSizesToFoster: this.getPetSizes(),
                        additionalInformation: this.state.additionalInfo,
                        location: this.state.location,
                        province: this.state.province,
                        available: this.state.available,
                        averageRating: 0,
                        ratingAmount: 0
                    },
                    {
                        'Authorization': 'Basic ' + sessionToken
                    }).then(response => {
                        console.log(`Profile successfully created!`);
                        Alert.alert('', `Perfil de voluntariado creado!`);
                        this.props.navigation.pop();
                        this.props.route.params.updateProfiles(response);
                    }).catch(err => {
                        console.log(err);
                        alert(err);
                    });
            });
        });
    }

    componentDidMount() {
        const myVolunteerProfile = this.props.route.params.myVolunteerProfile
        if (myVolunteerProfile) {
            this.setState({
                dogIsSelected: myVolunteerProfile.petTypesToFoster.includes('DOG'),
                catIsSelected: myVolunteerProfile.petTypesToFoster.includes('CAT'),
                location: myVolunteerProfile.location,
                province: myVolunteerProfile.province,
                available: myVolunteerProfile.available,
                smallSizeIsSelected: myVolunteerProfile.petSizesToFoster.includes('SMALL'),
                mediumSizeIsSelected: myVolunteerProfile.petSizesToFoster.includes('MEDIUM'),
                largeSizeIsSelected: myVolunteerProfile.petSizesToFoster.includes('LARGE'),
                additionalInfo: myVolunteerProfile.additionalInformation,
                profileId: myVolunteerProfile.profileId,
                _ref: myVolunteerProfile._ref,
                userId: myVolunteerProfile.userId,
                averageRating: myVolunteerProfile.averageRating,
                ratingAmount: myVolunteerProfile.ratingAmount
            });
        }
    }

    render() {
        return ( <>
            <SafeAreaView
                edges={["top"]}
                style={{ flex: 0, backgroundColor: colors.primary }}/>
            <SafeAreaView
                edges={["left", "right", "bottom"]}
                style={commonStyles.container} >
                <HeaderWithBackArrow headerText={"Perfil voluntariado"} headerTextColor={colors.white} backgroundColor={colors.primary} backArrowColor={colors.white} onBackArrowPress={() => this.props.navigation.goBack()}/>
               
                <ScrollView style={{paddingHorizontal: 20}}>
                    <Text style={[styles.titleText, {marginTop: 15, marginBottom: 10}]}>Puedo transitar</Text>
                    <DogCatSelector 
                        onPressDog={() => this.setState({ dogIsSelected: !this.state.dogIsSelected })} 
                        onPressCat={() => this.setState({ catIsSelected: !this.state.catIsSelected })}
                        dogIsSelected={this.state.dogIsSelected} 
                        catIsSelected={this.state.catIsSelected} />

                    <Text style={styles.titleText}>Zona</Text>
                    <Text style={[styles.optionTitle, {paddingTop: 10}]}>Provincia</Text>
                    <OptionTextInput onChangeText={text => { this.setState({ province: text })}} value={this.state.province} />

                    <Text style={styles.optionTitle}>Ciudad / Barrio</Text>
                    <OptionTextInput onChangeText={text => { this.setState({ location: text })}} value={this.state.location} />

                    <Text style={styles.titleText}>Información adicional</Text>
                    <OptionTextInput onChangeText={text => { this.setState({ additionalInfo: text })}} value={this.state.additionalInfo} isMultiline={true} />

                    <Text style={styles.titleText}>Tamaño mascota a transitar</Text>
                    <PetSizeCheckboxes 
                        smallSizeIsSelected={this.state.smallSizeIsSelected} 
                        mediumSizeIsSelected={this.state.mediumSizeIsSelected}
                        largeSizeIsSelected={this.state.largeSizeIsSelected}
                        onSmallCheckboxPress={() => this.setState({smallSizeIsSelected: !this.state.smallSizeIsSelected})} 
                        onMediumCheckboxPress={() => this.setState({mediumSizeIsSelected: !this.state.mediumSizeIsSelected})} 
                        onLargeCheckboxPress={() => this.setState({largeSizeIsSelected: !this.state.largeSizeIsSelected})} />

                    <Text style={styles.titleText}>Disponible</Text>
                    <Switch
                        trackColor={{ false: colors.grey, true: colors.secondary }}
                        thumbColor={colors.white}
                        onValueChange={() => this.setState({ available: !this.state.available })}
                        value={this.state.available}
                        style={{ transform: [{ scaleX: .8 }, { scaleY: .8 }] }}
                    />

                    <AppButton
                        buttonText={"Guardar información"} 
                        onPress={this.saveSettings} 
                        additionalButtonStyles={{alignSelf: 'center', marginTop: 30, width: "60%"}} />
                    {this.state.profileId &&
                        <AppButton
                            buttonText={"Eliminar perfil"} 
                            onPress={this.removeSettings} 
                            additionalButtonStyles={{alignSelf: 'center', marginBottom: 30, marginTop: 5, backgroundColor: colors.pink, width: "60%"}} />
                    }
                </ScrollView>               
            </SafeAreaView>
            </>
        )
    }
}

const PetSizeCheckboxes = ({smallSizeIsSelected, mediumSizeIsSelected, largeSizeIsSelected, onSmallCheckboxPress, onMediumCheckboxPress, onLargeCheckboxPress}) => {
    return (<>
        <CheckBoxItem 
            optionIsSelected={smallSizeIsSelected} 
            checkBoxTitle={"Pequeña"} 
            onPress={onSmallCheckboxPress} />
        <CheckBoxItem 
            optionIsSelected={mediumSizeIsSelected} 
            checkBoxTitle={"Mediana"} 
            onPress={onMediumCheckboxPress} />
        <CheckBoxItem 
            optionIsSelected={largeSizeIsSelected} 
            checkBoxTitle={"Grande"} 
            onPress={onLargeCheckboxPress} />
    </>);
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
    },
    optionTitle: {
        fontSize: 16, 
        color: colors.clearBlack,
        paddingTop: 15, 
        fontWeight: '500'
    },
});
