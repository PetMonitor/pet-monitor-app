import React from 'react';
import { Text, SafeAreaView, View, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Dog, Cat } from 'phosphor-react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import colors from '../config/colors';

/** Implements the screen that sets the filters for the reports that are shown. */
export class ReportListFilterScreen extends React.Component {

    constructor(props) {
        super(props)
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

    _cleanFilters = () => {
        // TODO: implement this logic
        console.log("Filters should be cleaned here")
    }

    _saveFilters = () => (
        // TODO: implement this logic
        console.log("Filters should be saved here")
    )

    render() {
        const { navigation } = this.props;
        // const { user } = this.props.route.params;

        return (
            <SafeAreaView style={{flex:1, backgroundColor: colors.white}}>
                <View style={{justifyContent: 'center', alignItems: 'flex-start', marginTop: 40, marginBottom: 20}}>
                    <Icon
                        name='arrow-left'
                        size={33}
                        color={colors.secondary}
                        style={{marginLeft: 10}}
                        onPress={() => navigation.goBack()} />
                    <Text style={{fontSize: 24, fontWeight: 'bold', marginLeft: 60, color: colors.secondary, position: 'absolute'}}>Filtros</Text>
                    <TouchableOpacity style={{paddingRight: 20, alignSelf: 'flex-end', position: 'absolute'}} onPress={() => this._cleanFilters()}>
                        <Text style={{fontSize: 16, fontWeight: '500', color: colors.pink}}>Reestablecer</Text>
                    </TouchableOpacity>
                </View>
                <View style={{borderBottomWidth: 1, borderBottomColor: colors.inputGrey}}></View>
                <ScrollView style={{flex:1, padding: 20}}>
                    {/* Report type filter */}
                    <Text style={{fontSize: 16, color: colors.clearBlack, paddingTop: 10, paddingLeft: 20, paddingBottom: 5, fontWeight: '500'}}>Tipo de reporte</Text>
                    {/* custom checkbox */}
                    <TouchableOpacity  style={{alignItems:'center', flexDirection: 'row', marginTop: 10}} 
                        onPress={() => this.setState({ lostPetIsSelected: !this.state.lostPetIsSelected })}>
                        <Icon
                            name={this.state.lostPetIsSelected ? 'checkbox-marked' : 'checkbox-blank'}
                            size={25}
                            color={this.state.lostPetIsSelected ? colors.secondary : colors.inputGrey}
                            style={{marginLeft: 10}}
                        />
                        <Text style={{marginLeft: 5, fontSize: 15}}>Mascotas perdidas</Text>
                    </TouchableOpacity>
                    <TouchableOpacity  style={{alignItems:'center', flexDirection: 'row', marginTop: 10}} 
                        onPress={() => this.setState({ petFoundIsSelected: !this.state.petFoundIsSelected })}>
                        <Icon
                            name={this.state.petFoundIsSelected ? 'checkbox-marked' : 'checkbox-blank'}
                            size={25}
                            color={this.state.petFoundIsSelected ? colors.secondary : colors.inputGrey}
                            style={{marginLeft: 10}}
                        />
                        <Text style={{marginLeft: 5, fontSize: 15}}>Mascotas encontradas</Text>
                    </TouchableOpacity>
                    <TouchableOpacity  style={{alignItems:'center', flexDirection: 'row', marginTop: 10}} 
                        onPress={() => this.setState({ petForAdoptionIsSelected: !this.state.petForAdoptionIsSelected })}>
                        <Icon
                            name={this.state.petForAdoptionIsSelected ? 'checkbox-marked' : 'checkbox-blank'}
                            size={25}
                            color={this.state.petForAdoptionIsSelected ? colors.secondary : colors.inputGrey}
                            style={{marginLeft: 10}}
                        />
                        <Text style={{marginLeft: 5, fontSize: 15}}>Mascotas en adopción</Text>
                    </TouchableOpacity>    

                    {/* Pet filter */}
                    <Text style={{fontSize: 16, color: colors.clearBlack, paddingLeft: 20, paddingTop: 25, paddingBottom: 5, fontWeight: '500'}}>Mascota</Text>
                    <View style={{alignItems:'center', flexDirection: 'row', marginTop: 10, justifyContent:'space-evenly'}}>
                        <TouchableOpacity onPress={() => this.setState({ dogIsSelected: !this.state.dogIsSelected })}>
                            <Dog color={this.state.dogIsSelected ? colors.secondary : colors.inputGrey} weight='regular' size={68} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.setState({ catIsSelected: !this.state.catIsSelected })}>
                            <Cat color={this.state.catIsSelected ? colors.secondary : colors.inputGrey} weight='regular' size={68} />
                        </TouchableOpacity>
                    </View>

                    {/* Sex filter */}
                    <Text style={{fontSize: 16, color: colors.clearBlack, paddingLeft: 20, paddingTop: 25, paddingBottom: 5, fontWeight: '500'}}>Sexo</Text>
                    <TouchableOpacity  style={{alignItems:'center', flexDirection: 'row', marginTop: 10}} 
                        onPress={() => this.setState({ femaleIsSelected: !this.state.femaleIsSelected })}>
                        <Icon
                            name={this.state.femaleIsSelected ? 'checkbox-marked' : 'checkbox-blank'}
                            size={25}
                            color={this.state.femaleIsSelected ? colors.secondary : colors.inputGrey}
                            style={{marginLeft: 10}}
                        />
                        <Text style={{marginLeft: 5, fontSize: 15}}>Hembra</Text>
                    </TouchableOpacity>
                    <TouchableOpacity  style={{alignItems:'center', flexDirection: 'row', marginTop: 10}} 
                        onPress={() => this.setState({ maleIsSelected: !this.state.maleIsSelected })}>
                        <Icon
                            name={this.state.maleIsSelected ? 'checkbox-marked' : 'checkbox-blank'}
                            size={25}
                            color={this.state.maleIsSelected ? colors.secondary : colors.inputGrey}
                            style={{marginLeft: 10}}
                        />
                        <Text style={{marginLeft: 5, fontSize: 15}}>Macho</Text>
                    </TouchableOpacity>

                    {/* Breed filter */}
                    <Text style={{fontSize: 16, color: colors.clearBlack, paddingLeft: 20, paddingTop: 25, paddingBottom: 5, fontWeight: '500'}}>Raza</Text>
                    <TextInput
                        placeholder = 'Mestizo'
                        onChangeText = {text => { this.setState({ breed: text })}}
                        autoCapitalize = 'none'
                        autoCorrect = { false }
                        style = {[styles.textInput, { marginLeft: 10, marginTop: 10, marginRight: 10 }]}
                        maxLength = { 30 }
                    />

                    {/* Province filter */}
                    <Text style={{fontSize: 16, color: colors.clearBlack, paddingLeft: 20, paddingTop: 25, paddingBottom: 5, fontWeight: '500'}}>Provincia</Text>
                    <TextInput
                        placeholder = 'Buenos Aires'
                        onChangeText = {text => { this.setState({ province: text })}}
                        autoCapitalize = 'none'
                        autoCorrect = { false }
                        style = {[styles.textInput, { marginLeft: 10, marginTop: 10, marginRight: 10 }]}
                        maxLength = { 30 }
                    />

                    {/* City filter */}
                    <Text style={{fontSize: 16, color: colors.clearBlack, paddingLeft: 20, paddingTop: 25, paddingBottom: 5, fontWeight: '500'}}>Ciudad</Text>
                    <TextInput
                        placeholder = 'CABA'
                        onChangeText = {text => { this.setState({ province: text })}}
                        autoCapitalize = 'none'
                        autoCorrect = { false }
                        style = {[styles.textInput, { marginLeft: 10, marginTop: 10, marginRight: 10 }]}
                        maxLength = { 30 }
                    />

                    <TouchableOpacity style={styles.button} onPress={() => this._saveFilters()}>
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
    textInput: {
      borderRadius: 8, 
      backgroundColor: colors.inputGrey, 
      padding: 15, 
      borderWidth: 1, 
      borderColor: colors.inputGrey, 
      fontSize: 16, 
      fontWeight: '500'
    },
  });

