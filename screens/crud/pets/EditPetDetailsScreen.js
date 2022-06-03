import React from "react";

import Icon from 'react-native-vector-icons/AntDesign';
import { putJsonData, deleteJsonData } from '../../../utils/requests.js';
import { getSecureStoreValueFor } from '../../../utils/store';
import { Image, Text, TextInput, TouchableOpacity, StyleSheet, View, ScrollView, Alert, SafeAreaView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { AppButton } from "../../../utils/buttons.js";

import uuid from 'react-native-uuid';
import commonStyles from '../../../utils/styles';
import colors from '../../../config/colors';
import { HeaderWithBackArrow } from "../../../utils/headers.js";


export class EditPetDetailsScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = { 
            ...this.props.route.params.petData
        }     
    }

    render() {
        const numberOfLines = 7;

        const handleImagePickerPress = () => {
            this.props.navigation.navigate('ImageSelectorScreen');
        };

        const handleDeletePet = () => {
            getSecureStoreValueFor('sessionToken').then((sessionToken) => {
                deleteJsonData(global.noticeServiceBaseUrl + '/users/' + this.props.route.params.userId + '/pets/' + this.state.petId, {},
                {
                    'Authorization': 'Basic ' + sessionToken 
                }).then(response => {
                    console.log(`Delete pet endpoint returned error ${response}`)
                    this.props.navigation.navigate('ViewUserDetails');
                }).catch(err => {
                    console.log(err);
                    alert(err)
                    this.props.navigation.goBack();
                });
            })
        }

        const handleEditPetDetails = () => {
            const editedPet = Object.assign({}, { 
                _ref: uuid.v4(),
                userId: this.props.route.params.userId,
                name: this.state.name,
                sex: this.state.sex,
                type: this.state.type,
                furColor: this.state.furColor,
                age: undefined,
                breed: this.state.breed,
                size: this.state.size,
                lifeStage: this.state.lifeStage,
                description: this.state.petDescription,
            })


            getSecureStoreValueFor('sessionToken').then((sessionToken) => {
                putJsonData(global.noticeServiceBaseUrl + '/users/' + this.props.route.params.userId + '/pets/' + this.state.petId, 
                editedPet,
                {
                    'Authorization': 'Basic ' + sessionToken 
                }).then(responsePet => {
                    console.log(`Edit pet endpoint returned error ${responsePet}`);
                    this.props.navigation.pop();
                    this.props.route.params.onUpdate(this.state);
                }).catch(err => {
                    console.error(err);
                    alert(err);
                    this.props.navigation.goBack();
                });
            });
        }

        return (
            <SafeAreaView style={commonStyles.container}>
                <HeaderWithBackArrow headerText={"Editar mascota"} headerTextColor={colors.secondary} backgroundColor={colors.white} backArrowColor={colors.secondary} onBackArrowPress={() => this.props.navigation.goBack()} />
                <ScrollView style={styles.scrollView} >
                    <Text style={styles.optionTitle}>Nombre</Text>
                    <TextInput 
                        value={this.state.name}
                        onChangeText = { petName => { this.setState( { name: petName }) }}
                        autoCapitalize = 'none'
                        autoCorrect = { false }
                        style = { styles.textInput }
                        maxLength = { 100 } />
                    <View style={{flex:1, flexDirection: 'row'}}>
                        <View style={{flex:1, flexDirection: 'column'}}>
                            <Text style={styles.optionTitle}>Tipo</Text>
                            <Picker
                                selectedValue={this.state.petType.toUpperCase()}
                                itemStyle={{height: 88, fontSize: 18}}
                                onValueChange={(itemValue, itemIndex) => this.setState({ type: itemValue })}>
                                    <Picker.Item label="Gato" value="CAT" />
                                    <Picker.Item label="Perro" value="DOG" />
                            </Picker>
                            <Text style={styles.optionTitle}>Sexo</Text>
                            <Picker
                                selectedValue={this.state.sex.toUpperCase()}
                                itemStyle={{height: 88, fontSize: 18}}
                                onValueChange={(itemValue, itemIndex) => this.setState({ sex: itemValue })}>
                                    <Picker.Item label="Macho" value="MALE" />
                                    <Picker.Item label="Hembra" value="FEMALE" />
                            </Picker>
                            
                        </View>
                        <View style={{flex:1, flexDirection: 'column'}}>
                            <Text style={styles.optionTitle}>Etapa de la vida</Text>
                            <Picker
                                selectedValue={this.state.lifeStage.toUpperCase()}
                                itemStyle={{height: 88, fontSize: 18}}
                                onValueChange={(itemValue, itemIndex) => this.setState({ lifeStage: itemValue }) }>
                                    <Picker.Item label="Cachorro" value="BABY" />
                                    <Picker.Item label="Adulto" value="ADULT" />
                                    <Picker.Item label="Mayor" value="SENIOR" />
                            </Picker>
                            <Text style={styles.optionTitle}>Tamaño</Text>
                            <Picker
                                selectedValue={this.state.size.toUpperCase()}
                                itemStyle={{height: 88, fontSize: 18}}
                                onValueChange={(itemValue, itemIndex) => this.setState({ size: itemValue }) }>
                                    <Picker.Item label="Pequeño" value="SMALL" />
                                    <Picker.Item label="Mediano" value="MEDIUM" />
                                    <Picker.Item label="Grande" value="LARGE" />
                            </Picker>
                        </View>
                    </View>
                    <Text style={styles.optionTitle}>Raza</Text>
                    <TextInput 
                        value={this.state.breed}
                        onChangeText = { breed => { this.setState({ breed: breed }) }}
                        autoCapitalize = 'none'
                        autoCorrect = { false }
                        style = { styles.textInput }
                        maxLength = { 100 } />
                    <Text style={styles.optionTitle}>Color de pelaje</Text>
                    <TextInput 
                        value={this.state.furColor}
                        onChangeText = { furColor => { this.setState({ furColor: furColor }) }}
                        autoCapitalize = 'none'
                        autoCorrect = { false }
                        style = { styles.textInput }
                        maxLength = { 100 } />

                    <Text style={styles.optionTitle}>Fotos</Text>
                    
                    {/* Render uploaded images here */}
                    <View style={{flexDirection:'row', marginTop: 10, marginLeft: 10}}>
                        {this.state.petPhotos.map((item, index) => {
                            return <Image key={index} style={{width: 60, height: 60, margin: 2}} source={{ uri: global.noticeServiceBaseUrl + '/photos/' + item.photoId }}/>
                        })}
                        <TouchableOpacity style={[styles.buttonUpload, {flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}]} onPress={handleImagePickerPress} >
                            <Icon
                                style={{margin: 10, padding: 10}}
                                size={4}
                                name="add"
                                backgroundColor={colors.white}
                                color={colors.secondary}
                            />
                        </TouchableOpacity>
                    </View>
                    
                    <Text style={styles.optionTitle}>Descripción de la mascota</Text>
                    <TextInput 
                        value={this.state.petDescription}
                        multiline={true}
                        placeholder = {"Ingrese descripción"}
                        numberOfLines={Platform.OS === 'ios' ? null : numberOfLines}
                        minHeight={(Platform.OS === 'ios' && numberOfLines) ? (20 * numberOfLines) : null}
                        onChangeText = { description => { this.setState( { petDescription: description } ) }}
                        autoCorrect = { false }
                        style = { [styles.textInput, {paddingBottom: 90, paddingTop: 10}] }
                        maxLength = { 100 } />
                    

                    <AppButton
                        buttonText={"Guardar cambios"} 
                        onPress={handleEditPetDetails} 
                        additionalButtonStyles={[styles.button, {backgroundColor: colors.primary, marginTop: 40}]} /> 
                    <AppButton
                        buttonText={"Eliminar mascota"} 
                        onPress={handleDeletePet} 
                        additionalButtonStyles={[styles.button, {backgroundColor: colors.pink, marginTop: 20, marginBottom: 60}]} /> 
                </ScrollView>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        marginHorizontal: 20,
    },
    alignedContent: {
        alignItems:'center', 
        flexDirection: 'row', 
        marginTop: 10
    },
    checkBoxOptionTitle: {
        marginLeft: 5, 
        fontSize: 15
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
    buttonUpload: {
        backgroundColor: colors.secondary,
        marginTop: 10,
        marginLeft: 10,
        paddingHorizontal: 15, 
        paddingVertical: 10,
        borderRadius: 7, 
        alignSelf: 'flex-start'
    },
    button: {
        backgroundColor: colors.secondary,
        margin: 0,
        marginTop: 10,
        alignSelf: 'stretch',
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