import React from "react";

import { Text, Image, StyleSheet, View, ScrollView, FlatList, Dimensions, SafeAreaView, TouchableOpacity, TextInput } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import { getJsonData } from '../../../utils/requests.js';
import { getSecureStoreValueFor } from '../../../utils/store';
import { showHeader } from '../../../utils/headers';
import { mapPetSexToLabel, mapPetSizeToLabel, mapPetLifeStageToLabel, } from '../../../utils/mappers';

import commonStyles from '../../../utils/styles';
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

    showTextInput = (onChangeText, value = '', isMultiline = false ) => (
        <TextInput
            onChangeText = {onChangeText}
            autoCorrect = { false }
            style = {[styles.editableTextInput, isMultiline ? {paddingBottom: 90, paddingTop: 10} : {}]}
            maxLength = { isMultiline ? 100 : 50 }
            multiline = {isMultiline}
            placeholder = {isMultiline ? "Ingrese descripción" : ""}
            value = { value ? value : "" }
        />
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
            <SafeAreaView style={commonStyles.container}>
                {showHeader("Mascota", colors.secondary, colors.white, colors.secondary, () => this.props.navigation.goBack())}
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
                    <View style={{...commonStyles.alignedContent, paddingTop: 20 }}>
                            <Text style={{fontSize: 20, fontWeight: 'bold', color: colors.clearBlack}}>Información</Text>
                            {this.state.isMyPet ? 
                                    <TouchableOpacity onPress={() => this.changeToEditMode()}>
                                        <MaterialIcon name='pencil' size={20} color={colors.secondary} style={{paddingLeft: 10}}/> 
                                    </TouchableOpacity> : <></>}
                        </View>
                        {dividerLine}
                        </View>
                    <ScrollView style={{flex:1, paddingHorizontal: 35}}>
                        <View style={commonStyles.alignedContent}>
                            <View style={{flexDirection: 'column', flex: 0.5}}>
                                <Text style={styles.optionTitle}>Tipo</Text>
                                {/* <Text style={styles.textInput}>{mapPetTypeToLabel(this.state.petType)}</Text> */}
                                {/* <TextInput value={mapPetTypeToLabel(this.state.petType)}/> */}
                                {this.showTextInput(text => { this.setState({ petType: text })}, this.state.petType)}
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
                                <Text style={styles.optionTitle}>Etapa de la vida</Text>
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
    editableTextInput: {
        borderRadius: 8, 
        backgroundColor: colors.inputGrey, 
        padding: 10, 
        borderWidth: 1, 
        borderColor: colors.inputGrey, 
        fontSize: 16, 
        fontWeight: '500',
        width: '70%',
        marginTop: 10, 
        marginRight: 10
    },
  });
