import React from 'react';
import { Text, SafeAreaView, View, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Dog, Cat } from 'phosphor-react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import colors from '../config/colors';

/** Implements the screen that sets the filters for the reports that are shown. */
export class ReportListFilterScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            lostPetIsSelected: false,
            petFoundIsSelected: false,
            petForAdoptionIsSelected: false,
            dogIsSelected: false,
            catIsSelected: false,
            femaleIsSelected: false,
            maleIsSelected:false,
            breed: '',
            province: '',
            city: ''
        };
    }

    cleanFilters = () => {
        // TODO: implement this logic
        console.log("Filters should be cleaned here")
    }

    saveFilters = () => (
        // TODO: implement this logic
        console.log("Filters should be saved here")
    )

    showFiltersHeader = () => (
        <>
            <View style={{justifyContent: 'center', alignItems: 'flex-start', marginTop: 40, marginBottom: 20}}>
                <Icon
                    name='arrow-left'
                    size={33}
                    color={colors.secondary}
                    style={{marginLeft: 10}}
                    onPress={() => this.props.navigation.goBack()} />
                <Text style={{fontSize: 24, fontWeight: 'bold', marginLeft: 60, color: colors.secondary, position: 'absolute'}}>Filtros</Text>
                <TouchableOpacity style={{paddingRight: 20, alignSelf: 'flex-end', position: 'absolute'}} onPress={() => this.cleanFilters()}>
                    <Text style={{fontSize: 16, fontWeight: '500', color: colors.pink}}>Reestablecer</Text>
                </TouchableOpacity>
            </View>
            <View style={{borderBottomWidth: 1, borderBottomColor: colors.inputGrey}}></View>
        </>
    )

    showCheckBoxItem = (optionIsSelected, checkBoxTitle) => (
        <>
            <Icon
                name={optionIsSelected ? 'checkbox-marked' : 'checkbox-blank'}
                size={25}
                color={optionIsSelected ? colors.secondary : colors.inputGrey}
                style={{marginLeft: 10}}
            />
            <Text style={styles.checkBoxOptionTitle}>{checkBoxTitle}</Text>
        </>
    )

    showTextInput = (onChangeText) => (
        <TextInput
            onChangeText = {onChangeText}
            autoCorrect = { false }
            style = {styles.textInput}
            maxLength = { 50 }
        />
    )

    render() {
        return (
            <SafeAreaView style={styles.container}>
                {this.showFiltersHeader()}
                <ScrollView style={{flex:1, padding: 20}}>
                    {/* Report type filter */}
                    <Text style={[styles.filterTitle, {paddingTop: 10}]}>Tipo de reporte</Text>
                    {/* custom checkbox */}
                    <TouchableOpacity  style={styles.alignedContent} 
                        onPress={() => this.setState({ lostPetIsSelected: !this.state.lostPetIsSelected })}>
                        {this.showCheckBoxItem(this.state.lostPetIsSelected, "Mascotas perdidas")}
                    </TouchableOpacity>
                    <TouchableOpacity  style={styles.alignedContent} 
                        onPress={() => this.setState({ petFoundIsSelected: !this.state.petFoundIsSelected })}>
                        {this.showCheckBoxItem(this.state.petFoundIsSelected, "Mascotas encontradas")}
                    </TouchableOpacity>
                    <TouchableOpacity  style={styles.alignedContent} 
                        onPress={() => this.setState({ petForAdoptionIsSelected: !this.state.petForAdoptionIsSelected })}>
                        {this.showCheckBoxItem(this.state.petForAdoptionIsSelected, "Mascotas en adopción")}
                    </TouchableOpacity>    

                    {/* Pet filter */}
                    <Text style={styles.filterTitle}>Mascota</Text>
                    <View style={[styles.alignedContent, {justifyContent:'space-evenly'}]}>
                        <TouchableOpacity onPress={() => this.setState({ dogIsSelected: !this.state.dogIsSelected })}>
                            <Dog color={this.state.dogIsSelected ? colors.secondary : colors.inputGrey} weight='regular' size={68} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.setState({ catIsSelected: !this.state.catIsSelected })}>
                            <Cat color={this.state.catIsSelected ? colors.secondary : colors.inputGrey} weight='regular' size={68} />
                        </TouchableOpacity>
                    </View>

                    {/* Sex filter */}
                    <Text style={styles.filterTitle}>Sexo</Text>
                    <TouchableOpacity  style={styles.alignedContent} 
                        onPress={() => this.setState({ femaleIsSelected: !this.state.femaleIsSelected })}>
                        {this.showCheckBoxItem(this.state.femaleIsSelected, "Hembra")}
                    </TouchableOpacity>
                    <TouchableOpacity  style={styles.alignedContent} 
                        onPress={() => this.setState({ maleIsSelected: !this.state.maleIsSelected })}>
                        {this.showCheckBoxItem(this.state.maleIsSelected, "Macho")}
                    </TouchableOpacity>

                    {/* Breed filter */}
                    <Text style={styles.filterTitle}>Raza</Text>
                    {this.showTextInput(text => { this.setState({ breed: text })})}

                    {/* Province filter */}
                    <Text style={styles.filterTitle}>Provincia</Text>
                    {this.showTextInput(text => { this.setState({ province: text })})}

                    {/* City filter */}
                    <Text style={styles.filterTitle}>Ciudad</Text>
                    {this.showTextInput(text => { this.setState({ city: text })})}

                    <TouchableOpacity style={styles.button} onPress={() => this.saveFilters()}>
                        <Text style={styles.buttonFont}>Aplicar filtros</Text>
                    </TouchableOpacity>  
                    
                </ScrollView>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    button: {
      backgroundColor: colors.secondary,
      marginTop: 60,
      marginBottom: 90,
      padding: 18, 
      borderRadius: 7, 
      left: "15%", 
      width: "70%", 
      alignSelf: 'flex-start'
    },
    buttonFont: {
      fontSize: 16, 
      fontWeight: '500', 
      alignSelf: 'center',
      color: colors.white
    },
    container: {
      flex: 1,
      backgroundColor: colors.white,
      flexDirection: 'column', // main axis: vertical
      paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    alignedContent: {
        alignItems:'center', 
        flexDirection: 'row', 
        marginTop: 10
    },
    filterTitle: {
        fontSize: 16, 
        color: colors.clearBlack, 
        paddingLeft: 20, 
        paddingTop: 25, 
        paddingBottom: 5, 
        fontWeight: '500'
    },
    checkBoxOptionTitle: {
        marginLeft: 5, 
        fontSize: 15
    },
    textInput: {
      borderRadius: 8, 
      backgroundColor: colors.inputGrey, 
      padding: 15, 
      borderWidth: 1, 
      borderColor: colors.inputGrey, 
      fontSize: 16, 
      fontWeight: '500',
      marginLeft: 10, 
      marginTop: 10, 
      marginRight: 10
    },
  });

