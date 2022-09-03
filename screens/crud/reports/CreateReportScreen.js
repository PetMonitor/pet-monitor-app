import React from 'react';

import { Text, View, Modal, StyleSheet, ScrollView, TouchableOpacity, Image, FlatList, ActivityIndicator } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Icon from 'react-native-vector-icons/Feather';
import * as Location from 'expo-location';

import { getJsonData, postJsonData, getLocationFromCoordinates } from '../../../utils/requests.js';
import { getSecureStoreValueFor } from '../../../utils/store';
import { getReportTypePickerItems, PickerOnValue, getDatePicker, getTimePicker, OptionTextInput, OptionTitle, showSectionTitle } from '../../../utils/editionHelper';

import commonStyles from '../../../utils/styles';
import colors from '../../../config/colors';
import { AppButton } from '../../../utils/buttons.js';

/** Implements the report creation screen. */
export class CreateReportScreen extends React.Component {

    constructor(props) {
        super(props);
        this.scrollRef = React.createRef();
        this.state = {
            reportType: 'LOST',
            country: '',
            province: '',
            city: '',
            location: '',
            date: new Date(),
            hour: new Date(),
            description: '',
            userPets: [],
            operationResultModalVisible: false,
            petId: '',
            userId: '',
            isLoading: false,
            createdNoticeId: '',
            userLocation: null,
            eventMarker: null
        };
    }

    setModalVisible = (visible) => {
        this.setState({ operationResultModalVisible: visible });
    }

    setSelectedPhoto = (petId) => {
        let selectedPet = petId
        if (petId == this.state.petId) {
            selectedPet = ''
        }
        this.setState({ petId: selectedPet });
    }

    cleanState = () => {
        this.setState({
            reportType: 'LOST',
            country: '',
            province: '',
            city: '',
            location: '',
            date: new Date(),
            hour: new Date(),
            description: '',
            petId: '',
            eventMarker: null
        })
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
    
    createFosterHistoryEntry = (userId) => {
        let petId = this.state.petId;

        postJsonData(global.noticeServiceBaseUrl + '/pets/' + petId + '/fosterHistory', {
            petId: petId,
            userId: userId,
            sinceDate: new Date().toISOString()
        }).then(response => {
            console.log(`History data successfully created!`);
        }).catch(err => {
            alert(err);
        });
    }

    createReport = () => {

        if (this.state.petId.length == 0) {
            alert("Debes seleccionar al menos una mascota!")
            return;
        }

        if (this.state.eventMarker == null) {
            alert("Debes marcar una ubicación aproximada en el mapa!")
            return;
        }

        this.setState({ isLoading : true });
        getSecureStoreValueFor("userId").then(userId => {
            let hour = this.state.hour
            let timestamp = new Date(this.state.date)
            timestamp.setHours(hour.getHours(), hour.getMinutes())

            postJsonData(global.noticeServiceBaseUrl + '/users/' + userId + '/notices', {
                noticeType: this.state.reportType,
                description: this.state.description,
                petId: this.state.petId,
                eventLocation: { lat: this.state.eventMarker.latitude, long: this.state.eventMarker.longitude},
                street: this.state.location,
                neighbourhood: this.state.city,
                locality: this.state.province,
                country: this.state.country,
                eventTimestamp: timestamp.toISOString(),
            }).then(response => {
                this.setState({ createdNoticeId: response.noticeId });
                let reportType = this.state.reportType.toLowerCase();
                if (reportType == "found" || reportType == "for_adoption") {
                    this.createFosterHistoryEntry(userId);
                }
                this.setModalVisible(true);
                this.cleanState();
            }).catch(err => {
                alert(err)
            }).finally(() => this.setState({ isLoading : false }));
        })
    }

    navigateToReport = () => {
        if (this.props.route.params) {
            this.props.route.params.onReportCreated();
        }
        this.props.navigation.navigate('ViewUserDetails');
    }

    
    // Called when our screen is focused
    onScreenFocus = () => {
        this.initializeScreen();
        this.cleanState();
        this.scrollRef.current?.scrollTo({
            y: 0,
            animated: true,
        });
    }

    initializeScreen = () => {
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

    componentDidMount() {
        // Listen for screen focus event
        this.props.navigation.addListener('focus', this.onScreenFocus)

        this.initializeScreen();
    }

    render() {
        return (
            <View style={commonStyles.container}> 
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
                            <Text style={{color: colors.white, fontWeight: '500'}}>Ok</Text>
                        </TouchableOpacity>
                        </View>
                    </View>
                </Modal>  
                </View>
                <ScrollView style={{flex:1, paddingHorizontal: 35}} ref={this.scrollRef} >
                    {/* Report type picker */}
                    {showSectionTitle("Tipo de reporte")}
                    <PickerOnValue 
                        value={this.state.reportType} 
                        onValueChange={(itemValue) => this.setState({ reportType: itemValue })} 
                        pickerItems={getReportTypePickerItems} />

                    {/* Event section */}
                    {showSectionTitle("Evento")}
                    {this.state.userLocation && <>
                        <OptionTitle text={"Seleccionar la ubicación aproximada"} />
                        {this.showLocationMapSelector()}</>}

                    <OptionTitle text={"Provincia"} />
                    <OptionTextInput onChangeText={text => { this.setState({ province: text })}} value={this.state.province} />

                    <OptionTitle text={"Ciudad"} />
                    <OptionTextInput onChangeText={text => { this.setState({ city: text })}} value={this.state.city} />

                    <OptionTitle text={"Ubicación aproximada"} />
                    <OptionTextInput onChangeText={text => { this.setState({ location: text })}} value={this.state.location} />

                    <View style={commonStyles.alignedContent}>
                        <View style={{flexDirection: 'column', flex: 0.5}}>
                            <OptionTitle text={"Fecha"} />
                            {getDatePicker(this.state.date, (selectedDate) => this.setState({ date: selectedDate }))}

                        </View>    
                        <View style={{flexDirection: 'column', flex: 0.5}}>
                            <OptionTitle text={"Hora"} />
                            {getTimePicker(this.state.hour, (selectedDate) => this.setState({ hour: selectedDate }))}
                        </View>
                    </View>

                    <OptionTitle text={"Descripción del evento"} />
                    <OptionTextInput onChangeText={text => { this.setState({ description: text })}} value={this.state.description} isMultiline={true} />

                    {/* Pet section */}
                    {showSectionTitle("Mascota")}
                    {this.state.userPets.length > 0 && this.showPetSelector()}
                    <AppButton
                        buttonText={"Mascota nueva"} 
                        onPress={this.navigateToCreatePet} 
                        additionalButtonStyles={styles.button} 
                        additionalTextStyles={{ paddingLeft: 10 }}
                        additionalElement={<Icon name='plus' size={20} color={colors.white} />} /> 
                    <AppButton
                        buttonText={"Crear reporte"} 
                        onPress={this.createReport} 
                        additionalButtonStyles={[styles.button, {alignSelf: 'center', backgroundColor: colors.primary, marginTop: 40, marginBottom: 60}]} />     
                </ScrollView>
                {this.state.isLoading && 
                    <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.semiTransparent}}>
                        <ActivityIndicator size="large" color={colors.clearBlack}/>
                    </View> }
            </View>
        )
    }

    showLocationMapSelector() {
        return <MapView style={{ height: 300, marginVertical: 10 }}
            // provider={PROVIDER_GOOGLE}
            region={{
                latitude: this.state.eventMarker ? this.state.eventMarker.latitude : this.state.userLocation.coords.latitude,
                longitude: this.state.eventMarker ? this.state.eventMarker.longitude : this.state.userLocation.coords.longitude,
                latitudeDelta: 0.0022,
                longitudeDelta: 0.0121,
            }}
            showsUserLocation={true}
            onPress={(e) => {
                if (e.nativeEvent.coordinate) {
                    this.setState({ eventMarker: e.nativeEvent.coordinate });
                    this.fillLocationInfo(e.nativeEvent.coordinate.latitude, e.nativeEvent.coordinate.longitude);
                }
            } }>
            {this.state.eventMarker &&
                <Marker coordinate={this.state.eventMarker} image={require('../../../assets/eventMarker.png')} />}
        </MapView>;
    }

    showPetSelector() {
        return <>
            <Text style={{ fontSize: 18, color: colors.secondary, fontWeight: '700', paddingTop: 10, paddingBottom: 10 }}>Seleccionar mascota</Text>
            <FlatList
                data={this.state.userPets}
                horizontal={true}
                keyExtractor={(_, index) => index.toString()}
                initialNumToRender={this.state.userPets.length}
                renderItem={this.renderPet} />
            </>;
    }
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: colors.secondary,
        margin: 0,
        marginTop: 10,
        padding: 18, 
        borderRadius: 7, 
        width: '55%', 
        alignSelf: 'flex-start'
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
