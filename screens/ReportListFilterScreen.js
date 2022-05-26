import React from 'react';

import { Text, SafeAreaView, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

import { showCheckBoxItem, showOptionTitle, showDogCatSelector, showTextInput } from '../utils/editionHelper'
import { showHeader } from '../utils/headers';
import { showButton } from '../utils/buttons';

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
                {showHeader("Filtros", colors.secondary, colors.white, colors.secondary, () => this.props.navigation.goBack(), cleanFilterLabel)}
                <ScrollView style={{flex:1, padding: 35}}>
                    {/* Report type filter */}
                    {showOptionTitle("Tipo de reporte", styles.filterTitle)}
                    {/* custom checkbox */}
                    {this.showReportTypeCheckboxes()}

                    {/* Pet filter */}
                    {showOptionTitle("Mascota", styles.filterTitle)}
                    {showDogCatSelector(() => this.setState({ dogIsSelected: !this.state.dogIsSelected }), () => this.setState({ catIsSelected: !this.state.catIsSelected }), this.state.dogIsSelected, this.state.catIsSelected)}

                    {/* Sex filter */}
                    {showOptionTitle("Sexo", styles.filterTitle)}
                    {this.showSexCheckboxes()}

                    {/* Breed filter */}
                    {showOptionTitle("Raza", styles.filterTitle)}
                    {showTextInput(text => this.setState({ breed: text }), this.state.breed)}

                    {/* Region filter */}
                    {showOptionTitle("Región", styles.filterTitle)}
                    {showTextInput(text => this.setState({ region: text }), this.state.region)}

                    {showButton("Aplicar filtros", () => this.saveFilters(), styles.button)}
                    
                </ScrollView>
            </SafeAreaView>
        )
    
    }

    showSexCheckboxes = () => {
        return [
            showCheckBoxItem(this.state.femaleIsSelected, "Hembra", () => this.setState({ femaleIsSelected: !this.state.femaleIsSelected })),
            showCheckBoxItem(this.state.maleIsSelected, "Macho", () => this.setState({ maleIsSelected: !this.state.maleIsSelected }))
        ];
    }

    showReportTypeCheckboxes = () => {
        return [
            showCheckBoxItem(this.state.lostPetIsSelected, "Mascotas perdidas", () => this.setState({ lostPetIsSelected: !this.state.lostPetIsSelected })),
            showCheckBoxItem(this.state.petFoundIsSelected, "Mascotas encontradas", () => this.setState({ petFoundIsSelected: !this.state.petFoundIsSelected })),
            showCheckBoxItem(this.state.petForAdoptionIsSelected, "Mascotas en adopción", () => this.setState({ petForAdoptionIsSelected: !this.state.petForAdoptionIsSelected }))
        ];
    }
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

