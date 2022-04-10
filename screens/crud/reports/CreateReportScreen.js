import React from 'react';
import { Text, View, Modal, TextInput, StyleSheet, ScrollView, TouchableOpacity, Image, FlatList, ActivityIndicator } from 'react-native';

import { getJsonData } from '../../../utils/requests.js';
import { postJsonData } from '../../../utils/requests.js';
import { getSecureStoreValueFor } from '../../../utils/store';
import colors from '../../../config/colors';

import {Picker} from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/Feather';

/** Implements the report creation screen. */
export class CreateReportScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            reportType: 'LOST',
            province: '',
            city: '',
            location: '',
            date: new Date(),
            hour: new Date(),
            description: '',
            userPets: [],
            selectedPetIdx: null,
            operationResultModalVisible: false,
            petId: '',
            userId: '',
            isLoading: false,
            createdNoticeId: ''
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
            maxLength = { isMultiline ? 100 : 50 }
            multiline = {isMultiline}
            placeholder = {isMultiline ? "Ingrese descripción" : ""}
        />
    )

    setSelectedPhoto = (petId) => {
        let selectedPet = petId
        if (petId == this.state.petId) {
            selectedPet = ''
        }
        this.setState({ petId: selectedPet });
    }

    renderPet = ({item}) =>  {
        const petId = item.petId
        const photoId = item.photos[0].photoId
        return (
            <TouchableOpacity onPress={() => this.setSelectedPhoto(petId)} style={{borderColor: this.state.petId == petId ? colors.secondary : colors.white, borderWidth: 3, borderRadius: 5}}>
                <View style={{ aspectRatio: 1 }}>
                <Image key={'img_' + photoId} resizeMode="cover" style={{aspectRatio: 1, height: 100, borderRadius: 5, margin: 3}} source={{ uri: global.noticeServiceBaseUrl + '/photos/' + photoId }}/>
            </View>
            </TouchableOpacity>
        )
    }

    navigateToCreatePet = () => {
        this.setState({ petId: '' })
        this.props.navigation.navigate('CreatePet', {creatingNewPetFromReport: true}); 
    }

    createReport = () => {
        this.setState({ isLoading : true });
        getSecureStoreValueFor("userId").then(userId => {
            let hour = this.state.hour
            let timestamp = new Date(this.state.date)
            timestamp.setHours(hour.getHours(), hour.getMinutes())

            postJsonData(global.noticeServiceBaseUrl + '/users/' + userId + '/notices', {
                noticeType: this.state.reportType,
                description: this.state.description,
                petId: this.state.petId,
                eventLocation: { lat: '123', long: '456'},
                eventTimestamp: timestamp.toISOString(),
            }).then(response => {
                console.log(response);
                this.setState({ createdNoticeId: response.noticeId })
                this.setModalVisible(true);
                // go back to previous page
                // this.props.navigation.goBack();
            }).catch(err => {
                alert(err)
            }).finally(() => this.setState({ isLoading : false }));
        })
    }

    navigateToReport = () => {
        this.props.navigation.push('ReportView', { noticeUserId: this.state.userId, noticeId: this.state.createdNoticeId, isMyReport: true, goToUserProfile: true }); 
    }

    componentDidMount() {
        getSecureStoreValueFor('sessionToken').then(sessionToken =>  
            getSecureStoreValueFor("userId").then(userId => {
                getJsonData(global.noticeServiceBaseUrl + '/users/' + userId + '/pets', 
                {
                    'Authorization': 'Basic ' + sessionToken 
                }
                ).then(pets => {
                    this.setState({ 
                        userPets: pets,
                        userId: userId
                    });
                    
                }).catch(err => {
                    console.log(err);
                    alert(err)
                });
            })
        )
    }

    render() {
        return (
            <View style={styles.container}> 
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
                            style={[styles.button, {width: '50%', alignSelf: 'center', alignItems: 'center'}]}
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
                    <Text style={{fontSize: 24, fontWeight: 'bold', paddingLeft: 20, paddingTop: 70, paddingBottom: 20, color: colors.white}}>Crear reporte</Text>
                </View>
                <ScrollView style={{flex:1, padding: 20}}>
                    {/* Report type picker */}
                    <Text style={[styles.sectionTitle, {paddingTop: 10}]}>Tipo de reporte</Text>
                    <Picker
                        selectedValue={this.state.reportType}
                        itemStyle={{height: 88, fontSize: 18}}
                        onValueChange={(itemValue, itemIndex) =>
                            this.setState({ reportType: itemValue })
                        }>
                        <Picker.Item label="Mascota perdida" value="LOST" />
                        <Picker.Item label="Mascota encontrada" value="FOUND" />
                        <Picker.Item label="Mascota en adopción" value="FOR_ADOPTION" />
                        <Picker.Item label="Mascota robada" value="STOLEN" />
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
                                locale='es'
                                // is24Hour={true}
                                display="default"
                                onChange={(event, selectedDate) => this.setState({ date: selectedDate })}
                                style={{marginLeft: 10, paddingTop: 50}}
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
                                style={{paddingTop: 50, marginRight: 10, marginLeft: 10}}
                            />
                        </View>
                    </View>

                    <Text style={styles.optionTitle}>Descripción del evento</Text>
                    {this.showTextInput(text => { this.setState({ description: text })}, true)}

                    {/* Pet section */}
                    <Text style={[styles.sectionTitle]}>Mascota</Text>
                    { this.state.userPets.length > 0 ?
                        <>
                        <Text style={{fontSize: 18, color: colors.secondary, fontWeight: '700', paddingLeft: 10, paddingTop: 10, paddingBottom: 10}}>Seleccionar mascota</Text>
                        <FlatList 
                            data={this.state.userPets} 
                            horizontal={true}
                            keyExtractor={(_, index) => index.toString()}
                            initialNumToRender={this.state.userPets.length}
                            renderItem={this.renderPet}
                            style={{paddingLeft: 5, marginRight: 10}}
                        /></> : <></>}
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
                {this.state.isLoading ? 
                    <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.semiTransparent}}>
                        <ActivityIndicator size="large" color={colors.clearBlack}/>
                    </View>
                : <></>}
            </View>
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
        paddingLeft: 10, 
        paddingTop: 25, 
        paddingBottom: 5, 
        fontWeight: 'bold',
    },
    optionTitle: {
        fontSize: 16, 
        color: colors.clearBlack,
        paddingLeft: 10, 
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
        marginLeft: 10,
        padding: 18, 
        borderRadius: 7, 
        width: '55%', 
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
      textAlign: "center",
    }
});
