import React from 'react';

import { Text, StyleSheet, View, FlatList, TouchableOpacity, Image, ScrollView } from 'react-native';
import { getJsonData } from '../utils/requests.js';
import { getSecureStoreValueFor } from '../utils/store';
import Icon from 'react-native-vector-icons/Feather';

import colors from '../config/colors';

/** Implements the Face Recognition search screen. */
export class FaceRecognitionSearchScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            userPets: [],
            userId: '',
            petId: ''
        };
    }

    setSelectedPhoto = (petId) => {
        this.setState({ petId: petId });
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

    navigateToSearchResults = () => {
        this.props.navigation.push('FaceRecognitionResults'); 
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
                 <View style={{alignItems: 'flex-start', backgroundColor: colors.primary}}>
                    <Text style={{fontSize: 24, fontWeight: 'bold', paddingLeft: 20, paddingTop: 70, paddingBottom: 20, color: colors.white}}>Reconocimiento facial</Text>
                </View>
                <ScrollView style={{flex:1, padding: 20}}>
                <Text style={{margin: 20, color: colors.clearBlack, fontSize: 15, marginTop: 30}}>Si perdiste o encontraste a una mascota podés iniciar una búsqueda por  reconocimiento facial para encontrar  mascotas similares.</Text>
                <Text style={styles.sectionTitle}>Seleccionar mascota</Text>
                <FlatList 
                    data={this.state.userPets} 
                    horizontal={true}
                    keyExtractor={(_, index) => index.toString()}
                    initialNumToRender={this.state.userPets.length}
                    renderItem={this.renderPet}
                    style={{paddingLeft: 15, marginRight: 10, marginTop: 10}}

                />
                {/* <TouchableOpacity style={styles.button} onPress={() => this.navigateToCreatePet()}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Icon name='plus' size={20} color={colors.white} />
                        <Text style={[styles.buttonFont, {paddingLeft: 10}]}>Mascota nueva</Text>
                    </View>
                </TouchableOpacity>  */}

                <TouchableOpacity style={styles.buttonSearch} onPress={() => this.navigateToSearchResults()}>
                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                        <Icon name='search' size={20} color={colors.white} />
                        <Text style={[styles.buttonFont, {paddingLeft: 10}]}>Buscar</Text>
                    </View>
                </TouchableOpacity> 
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        flexDirection: 'column',    // main axis: vertical
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
    },
    sectionTitle: {
        fontSize: 20, 
        color: colors.secondary,
        paddingLeft: 20, 
        paddingTop: 25, 
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
        marginTop: 30,
        padding: 18, 
        borderRadius: 7, 
        width: '50%', 
        alignSelf: 'center'
    },
    buttonFont: {
        fontSize: 16, 
        fontWeight: '500', 
        alignSelf: 'center',
        color: colors.white
    },
});
