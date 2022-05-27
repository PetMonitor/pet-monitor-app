import React from "react";

import { Text, Image, StyleSheet, View, ScrollView, FlatList, Dimensions, SafeAreaView, TouchableOpacity } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import { getJsonData } from '../../../utils/requests.js';
import { getSecureStoreValueFor } from '../../../utils/store';
import { mapPetTypeToLabel, mapPetSexToLabel, mapPetSizeToLabel, mapPetLifeStageToLabel, } from '../../../utils/mappers';

import colors from '../../../config/colors';

const { height, width } = Dimensions.get("screen")

export class ViewPetDetailsScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            petPhotos: [],
            sex: '',
            petType: '',
            furColor: '',
            breed: '',
            size: '',
            lifeStage: '',
            petDescription: '',
            isMyPet: false,
            isInEditMode: false,
        };
    }

    renderPet = ({item}) => {
        return (
            <Image key={'img_' + item.photoId} resizeMode="cover" style={{aspectRatio: 1, height: height/3.5, borderRadius: 5, marginRight: 5}} source={{ uri: global.noticeServiceBaseUrl + '/photos/' + item.photoId }}/>
        )
    }

    showHeader = () => (
        <>
            <View style={{justifyContent: 'center', alignItems: 'flex-start', marginTop: 20, marginBottom: 10}}>
                <MaterialIcon
                    name='arrow-left'
                    size={33}
                    color={colors.secondary}
                    style={{marginLeft: 10}}
                    onPress={() => this.props.navigation.goBack()} />
                <Text style={{fontSize: 24, fontWeight: 'bold', marginLeft: 60, color: colors.secondary, position: 'absolute'}}>Mascota</Text>
            </View>
            <View style={{borderBottomWidth: 1, borderBottomColor: colors.inputGrey}}></View>
        </>
    )

    changeToEditMode = () => {
        // TODO: edit event/pet page or history depending on the index
        this.setState({ isInEditMode: true });
    }

    saveChanges = () => {
        // TODO: add logic
        this.setState({ isInEditMode: false });
    }

    discardChanges = () => {
        // TODO: add logic
        this.setState({ isInEditMode: false });
    }

    deletePet = () => {
        // TODO: add logic
    }

    componentDidMount() {
        getSecureStoreValueFor('sessionToken').then((sessionToken) => {
            getJsonData(global.noticeServiceBaseUrl + '/users/' + this.props.route.params.userId + '/pets/' + this.props.route.params.petId, 
            {
                'Authorization': 'Basic ' + sessionToken 
            }
            ).then(responsePet => {
                this.setState({ 
                    name : responsePet.name,
                    petPhotos: responsePet.photos,
                    sex: responsePet.sex,
                    petType: responsePet.type,
                    furColor: responsePet.furColor,
                    breed: responsePet.breed,
                    size: responsePet.size,
                    lifeStage: responsePet.lifeStage,
                    petDescription: responsePet.description,
                });
                
            }).catch(err => {
                console.log(err);
                alert(err)
            });
        });
        getSecureStoreValueFor("userId").then(userId => this.setState({ isMyPet: userId === this.props.route.params.userId}));
    }

    render() {
        const dividerLine = <View style={{
            marginTop: 10,
            borderBottomColor: colors.secondary,
            borderBottomWidth: 1,
        }} />;

        return (
            <SafeAreaView style={styles.container}>
                {this.showHeader()}
                <View style={{flex: 1, justifyContent: 'flex-end'}}>
                    <FlatList 
                        data={this.state.petPhotos} 
                        horizontal={true}
                        keyExtractor={(_, index) => index.toString()}
                        initialNumToRender={this.state.petPhotos.length}
                        renderItem={this.renderPet}
                    />
                    <View style={{width: width, backgroundColor: colors.semiTransparent, position: 'absolute', height: 30, justifyContent: 'center'}}>
                        <Text style={{paddingLeft: 35, fontSize: 24, fontWeight: 'bold', color: colors.clearBlack}}>{this.state.name}</Text>
                    </View>    
                </View>
                <View style={{flex: 2}}>
                    <View style={{paddingHorizontal: 35}}>
                    <View style={{flexDirection: 'row', alignItems: 'center', paddingTop: 20 }}>
                            <Text style={{fontSize: 20, fontWeight: 'bold', color: colors.clearBlack}}>Información</Text>
                            {this.state.isMyPet ? 
                                    <TouchableOpacity onPress={() => this.changeToEditMode()}>
                                        <MaterialIcon name='pencil' size={20} color={colors.secondary} style={{paddingLeft: 10}}/> 
                                    </TouchableOpacity> : <></>}
                        </View>
                        {dividerLine}
                        </View>
                    <ScrollView style={{flex:1, paddingHorizontal: 35}}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <View style={{flexDirection: 'column', flex: 0.5}}>
                                <Text style={styles.optionTitle}>Tipo</Text>
                                <Text style={styles.textInput}>{mapPetTypeToLabel(this.state.petType)}</Text>
                                <Text style={styles.optionTitle}>Sexo</Text>
                                <Text style={styles.textInput}>{mapPetSexToLabel(this.state.sex)}</Text>
                                <Text style={styles.optionTitle}>Tamaño</Text>
                                <Text style={styles.textInput}>{mapPetSizeToLabel(this.state.size)}</Text>
                        
                            </View>
                            <View style={{flexDirection: 'column', flex: 0.5}}>
                                <Text style={styles.optionTitle}>Raza</Text>
                                <Text style={styles.textInput}>{this.state.breed}</Text>
                                <Text style={styles.optionTitle}>Color pelaje</Text>
                                <Text style={styles.textInput}>{this.state.furColor}</Text>
                                <Text style={styles.optionTitle}>Etapa</Text>
                                <Text style={styles.textInput}>{mapPetLifeStageToLabel(this.state.lifeStage)}</Text>
                            </View>
                        </View>

                        <Text style={styles.optionTitle}>Descripción</Text>
                        <Text style={styles.textInput}>{this.state.petDescription}</Text>

                        {this.state.isInEditMode && 
                                <>
                                <TouchableOpacity style={[styles.button, {alignSelf: 'stretch', backgroundColor: colors.primary, marginTop: 40}]} onPress={() => this.saveChanges()}>
                                    <Text style={styles.buttonFont}>Guardar cambios</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.button, {alignSelf: 'stretch', backgroundColor: colors.grey, marginTop: 15, marginBottom: 60}]} onPress={() => this.discardChanges()}>
                                    <Text style={styles.buttonFont}>Descartar cambios</Text>
                                </TouchableOpacity>
                                </> }

                        {this.state.isMyPet && !this.state.isInEditMode &&
                        <TouchableOpacity style={[styles.button, {alignSelf: 'stretch', backgroundColor: colors.pink, marginTop: 15, marginTop: 40, marginBottom: 60}]} onPress={() => this.deletePet()}>
                            <Text style={styles.buttonFont}>Eliminar mascota</Text>
                        </TouchableOpacity>}
                    </ScrollView>
                </View>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.white,
      flexDirection: 'column', // main axis: vertical
      paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    optionTitle: {
        fontSize: 16, 
        color: colors.clearBlack,
        paddingTop: 20, 
        fontWeight: 'bold'
    },
    textInput: {
        paddingTop: 10, 
        color: colors.clearBlack, 
        fontSize: 16, 
    },
    button: {
        backgroundColor: colors.secondary,
        marginTop: 10,
        padding: 18, 
        borderRadius: 7, 
    },
    buttonFont: {
        fontSize: 16, 
        fontWeight: '500', 
        alignSelf: 'center',
        color: colors.white
    },
  });
