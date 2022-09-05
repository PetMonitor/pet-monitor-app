import React from 'react';

import { Text, StyleSheet, View, FlatList, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { encode as btoa } from 'base-64'
import * as Location from 'expo-location';

import { getJsonData, getLocationFromCoordinates } from '../utils/requests.js';
import { getSecureStoreValueFor } from '../utils/store';
import { AppButton } from '../utils/buttons.js';

import commonStyles from '../utils/styles';
import colors from '../config/colors';
import { CheckBoxItem, OptionTextInput } from '../utils/editionHelper.js';

/** Implements the Face Recognition search screen. */
export class FaceRecognitionSearchScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            userNotices: [],
            userId: '',
            noticeId: '',
            filterByRegion: true,
            searchRegion: ''
        };
    }

    setSelectedPhoto = (noticeId) => {
        this.setState({ noticeId: noticeId });
    }

    renderPet = ({item}) =>  {
        const noticeId = item.noticeId
        return (
            <TouchableOpacity onPress={() => this.setSelectedPhoto(noticeId)} style={{borderColor: this.state.noticeId == noticeId ? colors.secondary : colors.white, borderWidth: 3, borderRadius: 5}}>
                <Image key={'img_' + noticeId} resizeMode="cover" style={{aspectRatio: 1, height: 100, borderRadius: 5, margin: 3}} source={{ uri:
                    'data:image/jpeg;base64,' + this.arrayBufferToBase64(item.pet.photo),}}/>
            </TouchableOpacity>
        )
    }

    navigateToSearchResults = () => {
        if (this.state.userNotices.length == 0) {
            Alert.alert("", "Debes tener al menos un reporte abierto!")
            return;
        }

        if (this.state.noticeId.length == 0) {
            Alert.alert("", "Debes seleccionar un reporte!")
            return;
        }
        this.props.navigation.push('FaceRecognitionResults', { noticeId: this.state.noticeId, userId: this.state.userId, region: this.state.filterByRegion ? this.state.searchRegion : null }); 
    }

    arrayBufferToBase64 = buffer => {
        let binary = '';
        let bytes = new Uint8Array(buffer);
        let len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
    };

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
            let userRegion = ""
            if (eventLocation.neighbourhood) {
                userRegion = eventLocation.neighbourhood;
            } else if (eventLocation.locality) {
                userRegion = eventLocation.locality;
            }
            this.setState({
                filterByRegion: userRegion != "" ? true : false,
                searchRegion: userRegion
            })
        }).catch(err => {
            alert(err)
        })
    }

    componentDidMount() {
        getSecureStoreValueFor('sessionToken').then(sessionToken =>  
            getSecureStoreValueFor("userId").then(userId => {
                getJsonData(global.noticeServiceBaseUrl + '/users/' + userId + '/notices', 
                {
                    'Authorization': 'Basic ' + sessionToken 
                }
                ).then(notices => {
                    this.setState({ 
                        userNotices: notices,
                        userId: userId
                    });
                    
                }).catch(err => {
                    console.log(err);
                    alert(err)
                });
            })
        )
        Location.requestForegroundPermissionsAsync()
        .then( response => {
            if (response.status !== 'granted') {
                Alert.alert('', 'Permiso para acceder a la ubicación del dispositivo denegado');
                return;
            }

            Location.getCurrentPositionAsync({})
            .then(userLocation => {
                this.fillLocationInfo(userLocation.coords.latitude, userLocation.coords.longitude);
            });
        });
    }

    render() {
        return (
            <View style={commonStyles.container}>
                <ScrollView style={{flex:1, padding: 20}}>
                <Text style={{margin: 20, color: colors.clearBlack, fontSize: 16, marginTop: 30}}>Si perdiste o encontraste a una mascota podés iniciar una búsqueda por  reconocimiento facial para encontrar  mascotas similares.</Text>
                <Text style={styles.sectionTitle}>Seleccionar mascota</Text>
                {this.state.userNotices.length > 0 ? <>
                    <FlatList 
                        data={this.state.userNotices} 
                        horizontal={true}
                        keyExtractor={(_, index) => index.toString()}
                        initialNumToRender={this.state.userNotices.length}
                        renderItem={this.renderPet}
                        style={{paddingLeft: 15, marginRight: 10, marginTop: 10}}
                    /> 
                    <CheckBoxItem
                        optionIsSelected={this.state.filterByRegion} 
                        checkBoxTitle={"Filtrar por región"} 
                        onPress={() => this.setState({ filterByRegion: !this.state.filterByRegion})}
                        additionalTextStyle={{color: colors.secondary, fontWeight: '500', fontSize: 16}} 
                        additionalStyle={{marginLeft: 20, marginTop: 15}}/>
                    {this.state.filterByRegion && <OptionTextInput value={this.state.searchRegion} placeholder={"Región"} onChangeText={text => this.setState({ searchRegion: text })} additionalStyle={{marginLeft: 20, marginRight: 20, padding: 12}} /> }
                </> : <Text style={{margin: 20, color: colors.clearBlack, fontSize: 15, marginTop: 20}}>No hay reportes creados aún. Para realizar una búsqueda, se requiere tener al menos reporte activo de la mascota de interés. </Text>}
                {/* <TouchableOpacity style={styles.button} onPress={() => this.navigateToCreatePet()}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Icon name='plus' size={20} color={colors.white} />
                        <Text style={[styles.buttonFont, {paddingLeft: 10}]}>Mascota nueva</Text>
                    </View>
                </TouchableOpacity>  */}

                <AppButton 
                    buttonText={"Buscar"} 
                    onPress={this.navigateToSearchResults} 
                    additionalButtonStyles={styles.buttonSearch} 
                    additionalTextStyles={{paddingLeft: 10}}
                    additionalElement={<Icon name='search' size={20} color={colors.white} />}
                    isDisabled={this.state.userNotices.length == 0 || (this.state.filterByRegion && this.state.searchRegion == '') } />

                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    sectionTitle: {
        fontSize: 20, 
        color: colors.secondary,
        paddingLeft: 20, 
        paddingTop: 20, 
        paddingBottom: 5, 
        fontWeight: 'bold',
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
    buttonSearch: {
        backgroundColor: colors.secondary,
        marginTop: 50,
        width: '50%', 
        alignSelf: 'center'
    },
});
