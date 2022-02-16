import React from 'react';
import { Text, SafeAreaView, View, Modal, TextInput, StyleSheet, ScrollView, TouchableOpacity, Image, FlatList } from 'react-native';
import {Picker} from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/Feather';

import colors from '../../../config/colors';

/** Implements the report creation screen. */
export class CreateReportScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            reportType: '',
            province: '',
            city: '',
            location: '',
            date: new Date(),
            hour: new Date(),
            description: '',
            userPets: ["", "", "", "", ""],
            selectedPetIdx: null,
            operationResultModalVisible: false
        };
    }

    setModalVisible = (visible) => {
        this.setState({ operationResultModalVisible: visible });
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

    renderPet = (item) =>  {
        return (
            <TouchableOpacity onPress={() => console.log(item)}>
                <Image style={{height: 100, width: 100, borderRadius: 5, margin: 5}}
                        source={require('../../../assets/adorable-jack-russell-retriever-puppy-portrait.jpg')}
                />
            </TouchableOpacity>
        )
    }

    navigateToCreatePet = () => {
        this.props.navigation.navigate('CreatePet', {creatingNewPetFromReport: true}); 
    }

    createReport = () => {
        // POST method and retrieve result in modal
        this.setModalVisible(true);
    }

    navigateToReport = () => {
        this.props.navigation.navigate('ReportView'); 
    }

    render() {
        return (
            <SafeAreaView style={styles.container}> 
            <View>
                {/* We can use the modal only to notify an error, and redirect automatically when post succeeds */}
                <Modal 
                    animationType="slide"
                    transparent={true}
                    visible={this.state.operationResultModalVisible}
                    onRequestClose={() => {
                        Alert.alert("Modal has been closed.");
                        this.setModalVisible(!modalVisible);
                    }}>
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'stretch'}}>
                        <View style={styles.modalView}>
                        <Text style={styles.modalText}>Reporte creado!</Text>
                        <TouchableOpacity
                            style={[styles.button, {width: '50%', alignSelf: 'center', alignItems: 'center', marginRight: 20}]}
                            onPress={() => {
                                this.setModalVisible(!this.state.operationResultModalVisible);
                                this.navigateToReport();
                            }}>
                            <Text>Ok</Text>
                        </TouchableOpacity>
                        </View>
                    </View>
                </Modal>  
                </View>
                <View style={{alignItems: 'flex-start', backgroundColor: colors.primary}}>
                    <Text style={{fontSize: 24, fontWeight: 'bold', paddingLeft: 20, paddingTop: 40, paddingBottom: 20, color: colors.white}}>Crear reporte</Text>
                </View>
                <ScrollView style={{flex:1, padding: 20}}>
                    {/* Report type picker */}
                    <Text style={[styles.sectionTitle, {paddingTop: 10}]}>Tipo de reporte</Text>
                    <Picker
                        selectedValue={this.state.reportType}
                        itemStyle={{height: 88}}
                        onValueChange={(itemValue, itemIndex) =>
                            this.setState({ reportType: itemValue })
                        }>
                        <Picker.Item label="Mascota perdida" value="lostPet" />
                        <Picker.Item label="Mascota encontrada" value="petFound" />
                        <Picker.Item label="Mascota en adopción" value="petForAdoption" />
                        <Picker.Item label="Mascota robada" value="stolenPet" />
                    </Picker>
                    {/* Event section */}
                    <Text style={[styles.sectionTitle]}>Evento</Text>
                    <Text style={[styles.optionTitle, {paddingTop: 10}]}>Provincia</Text>
                    {this.showTextInput(text => { this.setState({ province: text })})}

                    <Text style={styles.optionTitle}>Ciudad</Text>
                    {this.showTextInput(text => { this.setState({ city: text })})}

                    <Text style={styles.optionTitle}>Ubicación aproximada</Text>
                    {this.showTextInput(text => { this.setState({ location: text })})}

                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <View style={{flexDirection: 'column', flex: 0.5}}>
                            <Text style={styles.optionTitle}>Fecha</Text>
                            <DateTimePicker
                                testID="dateTimePicker"
                                value={this.state.date}
                                mode='date'
                                // is24Hour={true}
                                display="default"
                                onChange={(event, selectedDate) => this.setState({ date: selectedDate })}
                                style={{paddingTop: 50}}
                            />

                        </View>    
                        <View style={{flexDirection: 'column', flex: 0.5}}>
                            <Text style={styles.optionTitle}>Hora</Text>
                            <DateTimePicker
                                testID='dateTimePicker'
                                value={this.state.hour}
                                mode='hour'
                                is24Hour={true}
                                display='default'
                                onChange={(event, selectedDate) => this.setState({ hour: selectedDate })}
                                style={{paddingTop: 50, marginRight: 10}}
                            />
                        </View>
                    </View>

                    <Text style={styles.optionTitle}>Descripción evento</Text>
                    {this.showTextInput(text => { this.setState({ description: text })}, true)}

                    {/* Pet section */}
                    <Text style={[styles.sectionTitle]}>Mascota</Text>
                    <Text style={{fontSize: 18, color: colors.secondary, fontWeight: '700', paddingLeft: 20, paddingTop: 10, paddingBottom: 10}}>Seleccionar mascota</Text>
                    <FlatList 
                        data={this.state.userPets} 
                        horizontal={true}
                        keyExtractor={(_, index) => index.toString()}
                        initialNumToRender={this.state.userPets.length}
                        renderItem={this.renderPet}
                        style={{paddingLeft: 20, marginRight: 10}}

                    />
                    <TouchableOpacity style={styles.button} onPress={() => this.navigateToCreatePet()}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Icon name='plus' size={20} color={colors.white} />
                            <Text style={[styles.buttonFont, {paddingLeft: 10}]}>Mascota nueva</Text>
                        </View>
                    </TouchableOpacity> 
                    <TouchableOpacity style={[styles.button, {alignSelf: 'center', backgroundColor: colors.primary, marginTop: 40, marginBottom: 60}]} onPress={() => this.createReport()}>
                        <Text style={styles.buttonFont}>Crear reporte</Text>
                    </TouchableOpacity>       
                </ScrollView>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        flexDirection: 'column',    // main axis: vertical
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    sectionTitle: {
        fontSize: 20, 
        color: colors.primary,
        paddingLeft: 20, 
        paddingTop: 25, 
        paddingBottom: 5, 
        fontWeight: 'bold',
    },
    optionTitle: {
        fontSize: 16, 
        color: colors.clearBlack,
        paddingLeft: 20, 
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
        marginLeft: 10, 
        marginTop: 10, 
        marginRight: 10
    },
    button: {
        backgroundColor: colors.secondary,
        marginTop: 10,
        marginLeft: 20,
        padding: 18, 
        borderRadius: 7, 
        width: '60%', 
        alignSelf: 'flex-start'
    },
    buttonFont: {
        fontSize: 16, 
        fontWeight: '500', 
        alignSelf: 'center',
        color: colors.white
    },
    modalView: {
        margin: 20,
        backgroundColor: colors.white,
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: colors.clearBlack,
        shadowOffset: {
        width: 0,
        height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    modalText: {
      marginBottom: 15,
      textAlign: "center"
    }
});
