import React from 'react';

import { Text, SafeAreaView, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

import { CheckBoxItem, OptionTitle, DogCatSelector, OptionTextInput } from '../utils/editionHelper'
import { HeaderWithBackArrow } from '../utils/headers';
import { AppButton } from '../utils/buttons';

import commonStyles from '../utils/styles';
import colors from '../config/colors';

/** Implements the screen that sets the filters for the reports that are shown. */
export class ReportListFilterScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            lostPetIsSelected: true,
            petFoundIsSelected: true,
            petForAdoptionIsSelected: true,
            dogIsSelected: true,
            catIsSelected: true,
            femaleIsSelected: true,
            maleIsSelected: true,
            breed: '',
            region: '',
        };
    }

    cleanFilters = () => {
        this.setState({
            lostPetIsSelected: true,
            petFoundIsSelected: true,
            petForAdoptionIsSelected: true,
            dogIsSelected: true,
            catIsSelected: true,
            femaleIsSelected: true,
            maleIsSelected: true,
            breed: '',
            region: '',
        });
    }

    saveFilters = () => {
        this.navigateToReportList()
    }

    navigateToReportList = () => {
        this.props.navigation.navigate('BottomTabNavigator', {
            screen: 'ReportList',
            params: { selectedIndex: 1, filters: this.state }
        });
    }

    componentDidMount() {
        let filters = this.props.route.params.filters
        if (filters) {
            this.setState({
                ...filters
            })
        }
    }

    render() {
        const cleanFilterLabel = <TouchableOpacity style={{ paddingRight: 20, alignSelf: 'flex-end', position: 'absolute' }} onPress={() => this.cleanFilters()}>
            <Text style={{ fontSize: 16, fontWeight: '500', color: colors.pink }}>Reestablecer</Text>
        </TouchableOpacity>;

        return (
            <SafeAreaView style={commonStyles.container}>
                <HeaderWithBackArrow headerText={"Filtros"} headerTextColor={colors.secondary} backgroundColor={colors.white} backArrowColor={colors.secondary} onBackArrowPress={() => this.props.navigation.goBack()} additionalElement={cleanFilterLabel}/>
                <ScrollView style={{flex:1, padding: 35}}>
                    {/* Report type filter */}
                    <OptionTitle text={"Tipo de reporte"} additionalStyle={styles.filterTitle} />
                    {/* custom checkbox */}
                    <ReportTypeCheckboxes 
                        lostPetIsSelected={this.state.lostPetIsSelected}
                        petFoundIsSelected={this.state.petFoundIsSelected}
                        petForAdoptionIsSelected={this.state.petForAdoptionIsSelected}
                        onLostCheckboxPress={() => this.setState({ lostPetIsSelected: !this.state.lostPetIsSelected })}
                        onFoundCheckboxPress={() => this.setState({ petFoundIsSelected: !this.state.petFoundIsSelected })}
                        onAdoptionCheckboxPress={() => this.setState({ petForAdoptionIsSelected: !this.state.petForAdoptionIsSelected })} />

                    {/* Pet filter */}
                    <OptionTitle text={"Mascota"} additionalStyle={styles.filterTitle} />
                    <DogCatSelector 
                        onPressDog={() => this.setState({ dogIsSelected: !this.state.dogIsSelected })} 
                        onPressCat={() => this.setState({ catIsSelected: !this.state.catIsSelected })}
                        dogIsSelected={this.state.dogIsSelected} 
                        catIsSelected={this.state.catIsSelected} />

                    {/* Sex filter */}
                    <OptionTitle text={"Sexo"} additionalStyle={styles.filterTitle} />
                    <PetSexCheckboxes 
                        femaleIsSelected={this.state.femaleIsSelected} 
                        maleIsSelected={this.state.maleIsSelected} 
                        onFemaleCheckboxPress={() => this.setState({ femaleIsSelected: !this.state.femaleIsSelected })} 
                        onMaleCheckboxPress={() => this.setState({ maleIsSelected: !this.state.maleIsSelected })}/>

                    {/* Breed filter */}
                    <OptionTitle text={"Raza"} additionalStyle={styles.filterTitle} />
                    <OptionTextInput onChangeText={text => this.setState({ breed: text })} value={this.state.breed} />

                    {/* Region filter */}
                    <OptionTitle text={"Región"} additionalStyle={styles.filterTitle} />
                    <OptionTextInput onChangeText={text => this.setState({ region: text })} value={this.state.region} />

                    <AppButton buttonText={"Aplicar filtros"} onPress={() => this.saveFilters()} additionalButtonStyles={styles.button}/>
                    
                </ScrollView>
            </SafeAreaView>
        )
    
    }
}

const PetSexCheckboxes = ({femaleIsSelected, maleIsSelected, onFemaleCheckboxPress, onMaleCheckboxPress}) => {
    return (<>
        <CheckBoxItem optionIsSelected={femaleIsSelected} checkBoxTitle={"Hembra"} onPress={onFemaleCheckboxPress}/>
        <CheckBoxItem optionIsSelected={maleIsSelected} checkBoxTitle={"Macho"} onPress={onMaleCheckboxPress}/>
    </>);
}

const ReportTypeCheckboxes = ({lostPetIsSelected, petFoundIsSelected, petForAdoptionIsSelected, onLostCheckboxPress, onFoundCheckboxPress, onAdoptionCheckboxPress}) => {
    return (<>
        <CheckBoxItem optionIsSelected={lostPetIsSelected} checkBoxTitle={"Mascotas perdidas"} onPress={onLostCheckboxPress}/>
        <CheckBoxItem optionIsSelected={petFoundIsSelected} checkBoxTitle={"Mascotas encontradas"} onPress={onFoundCheckboxPress}/>
        <CheckBoxItem optionIsSelected={petForAdoptionIsSelected} checkBoxTitle={"Mascotas en adopción"} onPress={onAdoptionCheckboxPress}/>
    </>);
}

const styles = StyleSheet.create({
    button: {
      marginTop: 50,
      marginBottom: 80,
      width: "70%", 
      alignSelf: 'center'
    },
    filterTitle: {
        paddingTop: 25, 
        paddingBottom: 5,
    },
});

