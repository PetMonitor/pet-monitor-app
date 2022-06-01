import React from 'react';

import Loader  from '../../../utils/Loader.js';
import { Text, View, TextInput, StyleSheet, ScrollView, TouchableOpacity, Image, FlatList } from 'react-native';

import Icon from 'react-native-vector-icons/Feather';

import { getJsonData, putJsonData, getLocationFromCoordinates } from '../../../utils/requests.js';
import { getSecureStoreValueFor } from '../../../utils/store';
import colors from '../../../config/colors';

import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Location from 'expo-location';

import uuid from 'react-native-uuid';
var HttpStatus = require('http-status-codes');

/** Implements the report edit screen. */
export class EditReportScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            petId: this.props.route.params.reportState.petId,
            reportType: this.props.route.params.reportState.reportType,
            date: new Date(this.props.route.params.reportState.date),
            hour: new Date(this.props.route.params.reportState.hour),
            description: this.props.route.params.reportState.eventDescription,
            isMyReport: this.props.route.params.reportState.isMyReport,
            noticeId: this.props.route.params.reportState.noticeId,
            city: this.props.route.params.reportState.city,
            province: this.props.route.params.reportState.province,
            location: this.props.route.params.reportState.location,
            country: this.props.route.params.reportState.country,
            userId: this.props.route.params.reportState.userId,
            eventMarker: { 
                latitude: this.props.route.params.reportState.latitude,  
                longitude: this.props.route.params.reportState.longitude, 
            }, 
            userPets: [],
            isLoading: false
        };

    }

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
                <Image key={'img_' + photoId} resizeMode="cover" style={{aspectRatio: 1, height: 100, borderRadius: 5, margin: 3}} source={{ uri: global.noticeServiceBaseUrl + '/photos/' + photoId }}/>
            </TouchableOpacity>
        )
    }

    selectedLocation = (locations) => {
        let maxConfidence = 0
        let selected = 0
        for (let i = 0; i < locations.length; i++) {
            if (locations[i].confidence > maxConfidence) {
                maxConfidence = locations[i].confidence
                selected = i
            }
        }
        return locations[selected]
    }

    fillLocationInfo = (latitude, longitude) => {
        getLocationFromCoordinates(latitude, longitude)
        .then(response => {
            let eventLocation = this.selectedLocation(response.data)

            this.setState({
                location: eventLocation.street ? eventLocation.street : '',
                city: eventLocation.neighbourhood ? eventLocation.neighbourhood : '',
                province: eventLocation.locality ? eventLocation.locality : '',
                country: eventLocation.country ? eventLocation.country : '',
            })
        }).catch(err => {
            alert(err)
        })
    }

    navigateToCreatePet = () => {
        this.setState({ petId: '' })
        this.props.navigation.navigate('CreatePet', { initialSetup: false }); 
    }

    navigateToReport = () => {
        this.props.navigation.push('ReportView', { noticeUserId: this.state.userId, noticeId: this.state.createdNoticeId, isMyReport: true, goToUserProfile: true }); 
    }


    handleEditReportDetails = () => {
        let hour = this.state.hour
        let timestamp = new Date(this.state.date)
        timestamp.setHours(hour.getHours(), hour.getMinutes())

        let editedReport = Object.assign({}, { 
            _ref: uuid.v4(),
            petId: this.state.petId,
            noticeType: this.state.reportType,
            street: this.state.location,
            neighbourhood: this.state.city,
            locality: this.state.province,
            country: this.state.country,
            description: this.state.description,
            eventTimestamp: timestamp.toISOString(),
        })

        if (this.state.eventMarker) {
            editedReport = {
                ...editedReport,
                eventLocation: { lat: this.state.eventMarker.latitude, long: this.state.eventMarker.longitude},
            }
        }

        //console.log(`EDIT REPORT ${JSON.stringify(editedReport)}`)

        getSecureStoreValueFor('sessionToken').then((sessionToken) => {
            putJsonData(global.noticeServiceBaseUrl + '/users/' + this.state.userId + '/notices/' + this.state.noticeId, 
            editedReport,
            {
                'Authorization': 'Basic ' + sessionToken 
            }).then(response => {
                console.log(response);
                this.props.navigation.pop();

                if (this.props.route.params.reportState.petId == this.state.petId) {
                    console.log(`PET WAS NOT UPDATED FOR THIS NOTICE`)
                    return this.props.route.params.onUpdate({
                        ...this.state,
                        eventDescription: this.state.description
                    });
                }

                this.props.route.params.onUpdate();
            }).catch(err => {
                console.error(err);
                alert(err);
                this.props.navigation.goBack();
            });
        });
    }

    componentDidMount() {
        console.log("Running ComponentDidMount in EditReportScreen")
        Location.requestForegroundPermissionsAsync()
        .then( response => {
            if (response.status !== 'granted') {
                alert('Permission to access location was denied');
                return;
            }

            Location.getCurrentPositionAsync({})
            .then(userLocation => {
                this.setState({ userLocation: userLocation })
            });
        });
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
                    {this.state.userLocation && <>
                        <Text style={[styles.optionTitle, {paddingTop: 10}]}>Seleccionar la ubicación aproximada</Text>
                        <MapView style={{height: 300, margin: 10}}
                            // provider={PROVIDER_GOOGLE}
                            region={{
                                latitude: this.state.eventMarker.latitude,
                                longitude: this.state.eventMarker.longitude,
                                latitudeDelta: 0.0022,
                                longitudeDelta: 0.0121,
                            }}
                            showsUserLocation={true}
                            onPress={(e) => {
                                    if (e.nativeEvent.coordinate) {
                                        this.setState({ eventMarker: e.nativeEvent.coordinate }) 
                                        this.fillLocationInfo(e.nativeEvent.coordinate.latitude, e.nativeEvent.coordinate.longitude)
                                    }
                            }}>
                            {this.state.eventMarker &&
                                <Marker coordinate={this.state.eventMarker} image={require('../../../assets/eventMarker.png')} />}
                        </MapView></>}
                    <Text style={[styles.optionTitle, {paddingTop: 10}]}>Provincia</Text>
                    <TextInput 
                        value={this.state.province}
                        onChangeText = { province => { this.setState({ province: province }) }}
                        autoCapitalize = 'none'
                        autoCorrect = { false }
                        style = { styles.textInput }
                        maxLength = { 100 } />

                    <Text style={styles.optionTitle}>Ciudad</Text>
                    <TextInput 
                        value={this.state.city}
                        onChangeText = { city => { this.setState({ city: city }) }}
                        autoCapitalize = 'none'
                        autoCorrect = { false }
                        style = { styles.textInput }
                        maxLength = { 100 } />


                    <Text style={styles.optionTitle}>Ubicación aproximada</Text>
                    <TextInput 
                        value={this.state.location}
                        onChangeText = { location => { this.setState({ location: location }) }}
                        autoCapitalize = 'none'
                        autoCorrect = { false }
                        style = { styles.textInput }
                        maxLength = { 100 } />

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
                    <TextInput
                        value={this.state.description}
                        onChangeText = { eventDescription => this.setState({ description: eventDescription }) }
                        autoCorrect = { false }
                        style = {[styles.textInput, {paddingBottom: 90, paddingTop: 10}]}
                        maxLength = { 300 }
                        multiline = { true }
                        placeholder = { "Ingrese descripción" }
                    />

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
                    <TouchableOpacity style={[styles.button, {marginBottom: 30}]} onPress={() => this.navigateToCreatePet()}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Icon name='plus' size={20} color={colors.white} />
                            <Text style={[styles.buttonFont, {paddingLeft: 10}]}>Mascota nueva</Text>
                        </View>
                    </TouchableOpacity> 
                    <TouchableOpacity style={[styles.button, {alignSelf: 'stretch', width: '92%', backgroundColor: colors.primary,marginLeft: 10, marginTop: 10, marginBottom: 50}]} onPress={() => this.handleEditReportDetails()}>
                        <Text style={styles.buttonFont}>Guardar Cambios</Text>
                    </TouchableOpacity>  
                </ScrollView>
                {this.state.isLoading ? 
                    <Loader /> 
                    : <></>
                }
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
