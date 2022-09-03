import React from "react";

import { Text, TextInput, Switch, StyleSheet, View, ImageBackground, SafeAreaView, ScrollView, Alert, Modal, TouchableOpacity } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import SelectMultiple from 'react-native-select-multiple'
import * as Location from 'expo-location';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as ImagePicker from 'expo-image-picker';
import uuid from 'react-native-uuid';

import { putJsonData, getLocationFromCoordinates } from '../../../utils/requests';
import { getSecureStoreValueFor } from '../../../utils/store';
import { HeaderWithBackArrow } from "../../../utils/headers";

import commonStyles from '../../../utils/styles';
import colors from '../../../config/colors';
import { AppButton } from "../../../utils/buttons";
import { OptionTitle } from "../../../utils/editionHelper";


const ALERTS_FOR_REPORT_TYPES = [
      { label: 'Mascotas perdidas', value: 'LOST' },
      { label: 'Mascotas robadas', value: 'STOLEN' },
      { label: 'Mascotas encontradas', value: 'FOUND' },
      { label: 'Mascotas en adopción', value: 'FOR_ADOPTION' }
 ]
const ERROR_MUST_SELECT_REPORT_TYPE = 'Debe seleccionar al menos un tipo de reporte!';
const ERROR_MUST_SELECT_AREA_TYPE = 'Debe seleccionar una ubicación en el mapa!';
const ERROR_MUST_GIVE_LOC_ACCESS = 'Debe permitir acceso para acceder a su ubicación!';

export class EditUserDetailsScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = Object.assign({ }, 
            { 
                ...this.props.route.params.userData,
                profilePicture: null,
                userLocation: null,
                modalVisible: false,
                modalText: ''
            }
        );
    }

    getRegion() {
        return this.state.alertRegion ? ` ${this.state.alertRegion},` : '';
    }

    onSelectionsChange = (selectedReportTypes) => {
        this.setState({ alertsForReportTypes: selectedReportTypes.map(item => item.value) })
    }

    componentDidMount() {
        Location.requestForegroundPermissionsAsync()
        .then( response => {
            if (response.status !== 'granted') {
                this.setState({ modalVisible: true, modalText: ERROR_MUST_GIVE_LOC_ACCESS });
                return;
            }

            Location.getCurrentPositionAsync({})
            .then(userLocation => {
                this.setState({ userLocation: userLocation })
            });
        });
    }

    setModalVisible = (visible) => {
        this.setState({ modalVisible: visible });
    }

    render() {

        const handleToggleAlerts = () => {
            this.setState(prevState => ({ alertsActivated: !prevState.alertsActivated }) )
        }

        const handleEditProfile = () => {
            const updatedUserData = Object.assign({ }, this.state);
                
            delete updatedUserData.userId;
            delete updatedUserData.userLocation;
            delete updatedUserData.modalVisible;
            delete updatedUserData.modalText;

            updatedUserData._ref = uuid.v4();


            if (this.state.alertsActivated && this.state.alertsForReportTypes.length <= 0) {
                this.setState({ modalVisible: true, modalText: ERROR_MUST_SELECT_REPORT_TYPE });
                return;
            }

            if (this.state.alertsActivated && (!this.state.alertLocation.lat || !this.state.alertLocation.long)) {
                this.setState({ modalVisible: true, modalText: ERROR_MUST_SELECT_AREA_TYPE });
                return;               
            }

            getSecureStoreValueFor('sessionToken').then((sessionToken) => {
                console.log(`Updating user state to ${JSON.stringify(updatedUserData)}`)

                putJsonData(global.noticeServiceBaseUrl + '/users/' + this.state.userId, updatedUserData, {
                    'Authorization': 'Basic ' + sessionToken 
                }).then(response => {
                    console.log(response);
                    alert('Perfil actualizado correctamente!')
                    // go back and return user data to parent component
                    updatedUserData.userId = this.state.userId;
                    this.props.navigation.pop();
                    this.props.route.params.updateUser(updatedUserData);
                }).catch(err => {
                    alert(err)
                });      
            });
        }

        const handlePickNewImage = async () => {
            // Ask the user for the permission to access the media library 
            const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        
            if (permissionResult.granted === false) {
              alert("You've refused to allow this app to access your photos!");
              return;
            }
        
            const result = await ImagePicker.launchImageLibraryAsync();
        
            // Explore the result
            console.log(result);
        
            if (!result.cancelled) {
              console.log(result.uri);
            }
        }

        const handleChangePassword = () => {
            this.props.navigation.push('ChangeUserPasswordScreen', { ref: this.state._ref, userId: this.state.userId });
        }


        const dividerLine = <View style={{
            marginTop: 10,
            borderBottomColor: colors.inputGrey,
            borderBottomWidth: 1,
        }} />;

        console.log(this.state)
        
        return ( <>
            <SafeAreaView
                edges={["top"]}
                style={{ flex: 0, backgroundColor: colors.primary }}/>
            <SafeAreaView
                edges={["left", "right", "bottom"]}
                style={commonStyles.container} >                
                <HeaderWithBackArrow headerText={"Editar perfil"} headerTextColor={colors.white} backgroundColor={colors.primary} backArrowColor={colors.white} onBackArrowPress={() => this.props.navigation.goBack()}/> 
                <ScrollView>
                    <View style={styles.topContainer}>
                        {/* TODO: image source should be conditional to profilePicture value, this is just the default in case of null */}
                        <ImageBackground source={require('../../../assets/adorable-jack-russell-retriever-puppy-portrait.jpg')}  
                            style={{width: 130, height: 130, marginTop: 10, alignSelf: 'center'}} 
                            imageStyle={{borderRadius: 130/2}}>
                                <View style={{position: 'absolute', top: 45, left: 45}}>
                                    <Icon.Button
                                        onPress={handlePickNewImage}
                                        size={30}
                                        name="edit"
                                        backgroundColor='transparent'
                                        color={colors.white}/>
                                </View>
                        </ImageBackground>
                        {dividerLine}
                        <Text style={{color: colors.primary, fontWeight: 'bold', fontSize: 20, marginLeft: 30, marginTop: 10, marginBottom: 10, alignSelf: 'flex-start'}}>Información básica</Text>
                    </View>

                    <View style={{flex: 1,  marginHorizontal: 30 }}>
                        <View style={styles.alignedContent}>
                            <Text style={styles.textLabel}>Nombre</Text>
                            <TextInput 
                                value={this.state.name}
                                onChangeText = { inputName => { this.setState({ name: inputName })}}
                                autoCapitalize = 'none'
                                autoCorrect = { false }
                                style = {styles.textInput}
                                maxLength = { 30 }
                            />
                        </View>
                        <View style={styles.alignedContent}>
                            <Text style={styles.textLabel}>Usuario</Text>
                            <TextInput 
                                value={this.state.username}
                                onChangeText = { inputUsername => { this.setState({ username: inputUsername })}}
                                autoCapitalize = 'none'
                                autoCorrect = { false }
                                style = {styles.textInput}
                                maxLength = { 30 }
                            />
                        </View>
                        <View style={styles.alignedContent}>
                            {/* Email edit disabled until email confirmation step can be added here */}
                            <Text style={styles.textLabel}>Email</Text>
                            <TextInput 
                                editable={false}
                                value={this.state.email}
                                onChangeText = { inputEmail => { this.setState({ email: inputEmail })}}
                                autoCapitalize = 'none'
                                autoCorrect = { false }
                                style = {styles.textInput}
                                maxLength = { 30 }
                            />
                        </View>
                        <View style={styles.alignedContent}>
                            <Text style={styles.textLabel}>Teléfono</Text>
                            <TextInput 
                                value={this.state.phoneNumber}
                                onChangeText = { inputPhoneNumber => { this.setState({ phoneNumber: inputPhoneNumber })}}
                                autoCapitalize = 'none'
                                autoCorrect = { false }
                                style = {styles.textInput}
                                maxLength = { 30 }
                            />
                        </View>
                    </View>

                    <View style={[{flex: 1, marginLeft: 30, marginBottom: 10}, styles.column]}>
                        <Text style={[styles.textLabel, {textDecorationLine: 'underline'} ]}
                            onPress={handleChangePassword}>
                            Cambiar contraseña
                        </Text>
                    </View>

                    <Modal 
                        animationType="slide"
                        transparent={true}
                        visible={this.state.modalVisible}
                        onRequestClose={() => {
                        Alert.alert("Modal has been closed.");
                        this.setModalVisible(!modalVisible);
                        }}>
                        <View style={{flex: 1, justifyContent: 'center', alignItems: 'stretch'}}>
                        <View style={styles.modalView}>
                        <Text style={styles.titleError}>Error!</Text>
                        <Text style={styles.modalText}>{this.state.modalText}</Text>
                            <TouchableOpacity
                            style={[styles.errorModalButton, {width: '50%', alignSelf: 'center', alignItems: 'center'}]}
                                onPress={() => {
                                this.setModalVisible(!this.state.modalVisible);
                            }}>
                            <Text style={{color: colors.white, fontWeight: '500'}}>Ok</Text>
                            </TouchableOpacity>
                        </View>
                        </View>
                    </Modal>

                    <View style={{flexDirection:'row', marginLeft: 30}}>
                        <Text style={{fontWeight: 'bold', fontSize: 18, color: colors.pink, marginTop: 15, marginRight: 10}}>Alertas</Text>
                        <Switch 
                            style={{ marginTop: 10, transform: [{ scaleX: .8 }, { scaleY: .8 }] }}
                            trackColor={{ false: colors.grey, true: colors.pink }}
                            thumbColor={ colors.white }
                            onValueChange={handleToggleAlerts}
                            value={this.state.alertsActivated}
                            
                        />
                    </View>
                    <Text style={[styles.textLabel, {marginHorizontal: 30, fontSize: 14, marginTop: 10}]}>Se pueden activar alertas para recibir un mail por cada reporte creado en la zona seleccionada y en zonas cercanas a la última ubicación.</Text>

                    {this.state.alertsActivated ?
                    this.state.userLocation && <>

                    <OptionTitle text={"Quiero que me notifiquen sobre:"} additionalStyle={{marginLeft: 30}}/>
 
                    <View style={{paddingLeft:20, paddingTop: 5}}>
                    <SelectMultiple
                        items={ALERTS_FOR_REPORT_TYPES}
                        selectedItems={this.state.alertsForReportTypes}
                        rowStyle={{ borderBottomColor: colors.transparent, padding: 10, borderBottomWidth: 0 }}
                        selectedLabelStyle={{ fontWeight: '500' }}
                        selectedRowStyle={{}}
                        labelStyle={{fontSize: 15}}
                        checkboxStyle={{width: 23, height: 23, tintColor: colors.clearBlack}}
                        selectedCheckboxStyle={{tintColor: colors.clearBlack}}
                        onSelectionsChange={this.onSelectionsChange} />
                    </View>
                    <OptionTitle text={"Seleccionar la ubicación aproximada"} additionalStyle={{marginLeft: 30}}/>
                    {this.showLocationMapSelector()}
                    {this.state.alertLocation.lat && this.state.alertLocation.long &&
                    <Text style={[styles.textLabel, {marginHorizontal: 30, fontSize: 14, marginTop: 10}]}>Alertas configuradas sobre<Text style={{fontWeight: 'bold'}}>{this.getRegion() + " Argentina"}</Text></Text>}
                    </> : null }
                        
                    <View style={{flex: 1, alignItems: 'center', marginTop: 10, marginBottom: 40}}>
                        <AppButton
                            buttonText={"Guardar cambios"} 
                            onPress={handleEditProfile} 
                            additionalButtonStyles={styles.button} /> 
                    </View>
                </ScrollView>
            </SafeAreaView>
        </>);
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
            if (eventLocation.country != "Argentina") {
                Alert.alert("Solamente podemos configurar alertas en Argentina");
                return
            }

            let region = null
            if (eventLocation.neighbourhood) {
                region = eventLocation.neighbourhood;
            } else if (eventLocation.locality) {
                region = eventLocation.locality;
            }
            this.setState({
                alertRegion: region,
                alertLocation: { lat: latitude, long: longitude }
            })
        }).catch(err => {
            alert(err)
        })
    }

    showLocationMapSelector() {
        return <MapView 
            style={{ height: 300, marginVertical: 10, marginHorizontal: 30 }}
            // provider={PROVIDER_GOOGLE}
            region={{
                latitude: this.state.alertLocation.lat ? this.state.alertLocation.lat : this.state.userLocation.coords.latitude,
                longitude: this.state.alertLocation.long ? this.state.alertLocation.long : this.state.userLocation.coords.longitude,
                latitudeDelta: 0.0022,
                longitudeDelta: 0.0121,
            }}
            showsUserLocation={true}
            onPress={(e) => {
                if (e.nativeEvent.coordinate) {
                    this.fillLocationInfo(e.nativeEvent.coordinate.latitude, e.nativeEvent.coordinate.longitude);
                }
            } }>
            {this.state.alertLocation.lat && this.state.alertLocation.long &&
                <Marker coordinate={{ latitude: this.state.alertLocation.lat, longitude: this.state.alertLocation.long }} image={require('../../../assets/eventMarker.png')} />}
        </MapView>;
    }
}

const styles = StyleSheet.create({
    topContainer: {
        flex: 1,
        backgroundColor: colors.white,
        flexDirection: 'column',
    },
    column: {
        backgroundColor: colors.white,
        flexDirection: 'column',
        alignItems: 'baseline'
    },
    textLabel: {
        marginTop: 20,
        marginBottom: 15,
        fontSize: 16, 
        color: colors.clearBlack,
        fontWeight: '500',
        flex: 1
    },
    textInput: {
        color: colors.clearBlack,
        borderRadius: 8, 
        backgroundColor: colors.inputGrey, 
        borderWidth: 1, 
        borderColor: colors.inputGrey, 
        fontSize: 16, 
        fontWeight: '500',
        alignSelf: 'flex-end',
        padding: 15,
        flex: 3
    },
    button: {
        backgroundColor: colors.primary,
        width: '55%',
        alignItems: 'center'
    },
    alignedContent: {
        ...commonStyles.alignedContent,
        marginTop: 10
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
      },
      errorModalButton: {
        backgroundColor: colors.pink,
        margin: 0,
        marginTop: 10,
        padding: 18, 
        borderRadius: 7, 
        width: '55%', 
        alignSelf: 'flex-start'
      },
      titleError: {
          fontWeight: '500',
          color: colors.pink,
          fontSize: 20,
          margin: 10,
          alignSelf: 'center'
      }
});