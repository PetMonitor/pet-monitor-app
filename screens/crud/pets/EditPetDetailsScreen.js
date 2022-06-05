import React from "react";

import Icon from 'react-native-vector-icons/Feather';
import { putJsonData, deleteJsonData } from '../../../utils/requests.js';
import { getSecureStoreValueFor } from '../../../utils/store';
import { Image, ImageBackground, Text, TextInput, TouchableOpacity, StyleSheet, View, ScrollView, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { AppButton } from "../../../utils/buttons.js";
import { EventRegister } from 'react-native-event-listeners';

import uuid from 'react-native-uuid';
import colors from '../../../config/colors';


export class EditPetDetailsScreen extends React.Component {

    MIN_PROFILE_PHOTOGRAPHS = 2

    constructor(props) {
        super(props);
        this.state = { 
            ...this.props.route.params.petData,
            photos: this.props.route.params.petData.petPhotos,
            newPhotos: [],
            deletedPhotos: []
        }     
    }

    componentDidMount() {
        this.listener = EventRegister.addEventListener("SET_IMAGES",(selectedImages) => {
            //console.log(`Selected images ${selectedImages}`)
            const addedPhotos = [
                ...this.state.newPhotos,
                selectedImages
            ].flat()
            this.setState({ newPhotos: addedPhotos })
        })
    }

    componentWillUnmount() {
        EventRegister.removeEventListener(this.listener);
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
                    console.log(`Delete pet endpoint returned ${JSON.stringify(response)}`)
                    this.props.navigation.navigate('ViewUserDetails');
                    this.props.route.params.onPetDeleted(this.state.petId);
                }).catch(err => {
                    console.log(err);
                    alert(err)
                    this.props.navigation.goBack();
                });
            })
        }

        const handleEditPetDetails = () => {

            // check at least two photos remain
            const remainingPhotosCount = this.state.photos.length + this.state.newPhotos.length
            if (remainingPhotosCount < this.MIN_PROFILE_PHOTOGRAPHS) {
                alert(`El perfil debe contener al menos ${this.MIN_PROFILE_PHOTOGRAPHS} fotografías!`);
                return;
            }

            const editedPet = Object.assign({}, { 
                petData: {
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
                },
                newPhotos: this.state.newPhotos,
                deletedPhotos: this.state.deletedPhotos 
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

        const handleDeleteImage = (deletedPhotoId) => {
            const deleted = [
                ...this.state.deletedPhotos,
                deletedPhotoId
            ]
            const photos = this.state.photos.filter(photo => photo.photoId != deletedPhotoId)
            this.setState({ deletedPhotos: deleted, photos: photos })
        }

        const handleDeleteRecentlyAddedImage = (deletedPhotoIndex) => {
            var addedPhotos = [ ...this.state.newPhotos ]
            addedPhotos.splice(deletedPhotoIndex, 1);
            this.setState({ newPhotos: addedPhotos })
        }

        confirmDeletePet = () =>
            Alert.alert(
            "Atención!",
            "Si presionás OK se eliminará el perfil de esta mascota!",
            [
                {
                    text: "Cancelar",
                    onPress: () => console.log("Cancel delete pet pressed"),
                    style: "cancel"
                },
                { 
                    text: "OK", 
                    onPress: () => handleDeletePet()
                }
            ]
        );

        return (
            <View style={styles.container}>
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
                    <View style={{flexDirection:'row', flexWrap: 'wrap', marginTop: 10, marginLeft: 10}}>
                        {this.state.photos.map((item, index) => {

                            return <ImageBackground key={item.photoId} source={{ uri: global.noticeServiceBaseUrl + '/photos/' + item.photoId }}  
                                style={{width: 60, height: 60, margin: 4}}>
                                    <View>
                                        <Icon.Button
                                            onPress={() => handleDeleteImage(item.photoId)}
                                            size={30}
                                            name='x'
                                            backgroundColor='transparent'
                                            color={colors.white}/>
                                    </View>
                            </ImageBackground>
                        })}

                        {this.state.newPhotos.map((imageBase64, index) => {
                            return <ImageBackground key={index} source={{ uri: "data:image/png;base64," + imageBase64 }}  
                                style={{width: 60, height: 60, margin: 4}}>
                                    <View>
                                        <Icon.Button
                                            onPress={() => handleDeleteRecentlyAddedImage(index)}
                                            size={30}
                                            name='x'
                                            backgroundColor='transparent'
                                            color={colors.white}/>
                                    </View>
                            </ImageBackground>
                        })}

                        <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}} onPress={handleImagePickerPress} >
                            <Icon
                                style={{margin: 4}}
                                size={60}
                                name='plus'
                                color={colors.yellow}
                                backgroundColor={colors.white}
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
                        buttonText={"Guardar Cambios"} 
                        onPress={handleEditPetDetails} 
                        additionalButtonStyles={[styles.button, {backgroundColor: colors.primary, marginTop: 40}]} /> 
                    <AppButton
                        buttonText={"Eliminar mascota"} 
                        onPress={handleDeletePet} 
                        additionalButtonStyles={[styles.button, {backgroundColor: colors.pink, marginTop: 20, marginBottom: 60}]} /> 
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