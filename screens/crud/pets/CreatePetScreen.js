import React from 'react';

import { EventRegister } from 'react-native-event-listeners';
import { Text, TextInput, StyleSheet, ScrollView, View, Image, SafeAreaView } from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';

import { postJsonData } from '../../../utils/requests.js';
import { getSecureStoreValueFor } from '../../../utils/store';
import { CheckBoxItem, getLifeStagePickerItems, getPetTypePickerItems, getSexTypePickerItems, getSizeTypePickerItems, PickerOnValue } from '../../../utils/editionHelper';
import Loader  from '../../../utils/Loader.js';
import { HeaderWithBackArrow } from '../../../utils/headers';

import commonStyles from '../../../utils/styles';
import colors from '../../../config/colors';
import { AppButton } from '../../../utils/buttons.js';

export class CreatePetScreen extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            name: '',
            type: props.route.params.initPetType,
            size: 'SMALL',
            lifeStage: 'PUPPY',
            breed: '',
            sex: 'MALE',
            furColor: '',
            description: '',
            photos: [],
            isMyPet: false,
            isLoading: false
        }
    }

    componentDidMount() {
        this.listener = EventRegister.addEventListener("SET_IMAGES",(selectedImages) => {
            // console.log(`Setting pet images to ${JSON.stringify(selectedImages)}`);
            this.setState({ photos: selectedImages });
        })
    }

    componentWillUnmount() {
      EventRegister.removeEventListener(this.listener);
    }

    render() {
        const numberOfLines = 7;
        const { userInfo, initialSetup, initPetType } = this.props.route.params;

        const handleNextPet = () => {
            if (!initialSetup) {
                alert('Method not allowed outside initial setup context!');
            }

            if (this.state.photos.length == 0) {
                alert('Se requiere al menos una foto de la mascota!');
                return;
            }


            const newPet = Object.assign({}, this.state) 
            delete newPet.isLoading

            // Add pet to user's list of pets
            userInfo['pets'] = [
                ...userInfo['pets'],
                newPet
            ]

            console.log('Navigating to create pet screen');
            console.log(JSON.stringify(userInfo));

            this.props.navigation.push('CreatePet', { userInfo: userInfo, initialSetup: true, initPetType: initPetType, onGoBack: null }); 
        };

        const handleFinishInitialSetup = () => {
            this.setState({ isLoading: true });

            if (!initialSetup) {
                alert('Method not allowed outside initial setup context!');
            }

            if (this.state.photos.length == 0) {
                alert('At least one photo is required!');
                return;
            }

            const newPet = Object.assign({}, this.state) 
            delete newPet.isLoading

            // Add pet to user's list of pets
            userInfo['pets'] = [
                ...userInfo['pets'],
                newPet
            ]
            
            postJsonData(global.noticeServiceBaseUrl + '/users', userInfo).then(response => {
                console.log(response);
                alert('Successfully created user!')
                // go back to login page
                this.props.navigation.popToTop();
            }).catch(err => {
                console.error(err);
                alert(`Failed to create user profile!`);
                this.props.navigation.popToTop();
            });      
        };

        const createPet = () => {
            this.setState({ isLoading: true })
            const petData = {
                name: this.state.name,
                type: this.state.type,
                size: this.state.size,
                lifeStage: this.state.lifeStage,
                breed: this.state.breed,
                sex: this.state.sex,
                furColor: this.state.furColor,
                description: this.state.description,
                photos: this.state.photos,
                isMyPet: this.state.isMyPet,
            }
 
            getSecureStoreValueFor("userId").then(userId => {
                postJsonData(global.noticeServiceBaseUrl + '/users/' + userId + '/pets', petData)
                .then(response => {
                    console.log(response);
                    alert('Mascota creada!')
                    // go back to previous page
                    if (this.props.route.params.onGoBack) {
                        this.props.route.params.onGoBack()
                    }
                    this.props.navigation.goBack();
                }).catch(err => {
                    alert(err)
                }).finally(() => this.setState({ isLoading : false }));
            })
        }

        const handleImagePickerPress = () => {
            this.props.navigation.navigate('ImageSelectorScreen');
        };

        return (<>
            <SafeAreaView
                edges={["top"]}
                style={{ flex: 0, backgroundColor: colors.primary }}/>
            <SafeAreaView
                edges={["left", "right", "bottom"]}
                style={commonStyles.container} >
                <HeaderWithBackArrow headerText={"Crear mascota"} headerTextColor={colors.white} backgroundColor={colors.primary} backArrowColor={colors.white} onBackArrowPress={() => this.props.navigation.goBack()} />
            { this.state.isLoading ? 
                <Loader /> :
                <ScrollView style={styles.scrollView} >
                    <Text style={styles.optionTitle}>Nombre</Text>
                    <TextInput 
                        onChangeText = { petName => { this.setState( { name: petName }) }}
                        autoCapitalize = 'none'
                        autoCorrect = { false }
                        style = { styles.textInput }
                        maxLength = { 100 } />
                    <View style={{flex:1, flexDirection: 'row'}}>
                        <View style={{flex:1, flexDirection: 'column'}}>
                            <Text style={styles.optionTitle}>Tipo</Text>
                            <PickerOnValue 
                                value={this.state.type} 
                                onValueChange={(itemValue) => this.setState({ type: itemValue })} 
                                pickerItems={getPetTypePickerItems} />
                            <Text style={styles.optionTitle}>Sexo</Text>
                            <PickerOnValue 
                                value={this.state.sex} 
                                onValueChange={(itemValue) => this.setState({ sex: itemValue })} 
                                pickerItems={getSexTypePickerItems} />
                        </View>
                        <View style={{flex:1, flexDirection: 'column'}}>
                            <Text style={styles.optionTitle}>Etapa de la vida</Text>
                            <PickerOnValue 
                                value={this.state.lifeStage} 
                                onValueChange={(itemValue) => this.setState({ lifeStage: itemValue })} 
                                pickerItems={getLifeStagePickerItems} />
                            <Text style={styles.optionTitle}>Tamaño</Text>
                            <PickerOnValue 
                                value={this.state.size} 
                                onValueChange={(itemValue) => this.setState({ size: itemValue })} 
                                pickerItems={getSizeTypePickerItems} />
                        </View>
                    </View>
                    <Text style={styles.optionTitle}>Raza</Text>
                    <TextInput 
                        onChangeText = { breed => { this.setState({ breed: breed }) }}
                        autoCapitalize = 'none'
                        autoCorrect = { false }
                        style = { styles.textInput }
                        maxLength = { 100 } />
                    <Text style={styles.optionTitle}>Color de pelaje</Text>
                    <TextInput 
                        onChangeText = { furColor => { this.setState({ furColor: furColor }) }}
                        autoCapitalize = 'none'
                        autoCorrect = { false }
                        style = { styles.textInput }
                        maxLength = { 100 } />

                    <Text style={styles.optionTitle}>Fotos</Text>
                    <AppButton
                        buttonText={"Subir fotos"} 
                        onPress={handleImagePickerPress} 
                        additionalButtonStyles={[styles.buttonUpload, {...commonStyles.alignedContent, justifyContent: 'center'}]} 
                        additionalElement={<FeatherIcon name={'upload'} size={20} color={colors.white} style={{marginRight: 10}} />} />

                    {/* Render uploaded images here */}
                    <View style={{flexDirection:'row', marginTop: 10, marginLeft: 10}}>
                        {this.state.photos.map((imageBase64, index) => {
                            return <Image key={index} style={{width: 60, height: 60, margin: 2}} source={{ uri: "data:image/png;base64," + imageBase64 }}/>
                        })}
                    </View>

                    <Text style={styles.optionTitle}>Descripción de la mascota</Text>
                    <TextInput 
                        multiline={true}
                        placeholder = {"Ingrese descripción"}
                        numberOfLines={Platform.OS === 'ios' ? null : numberOfLines}
                        minHeight={(Platform.OS === 'ios' && numberOfLines) ? (20 * numberOfLines) : null}
                        onChangeText = { description => { this.setState( { description: description } ) }}
                        autoCorrect = { false }
                        style = { [styles.textInput, {paddingBottom: 90, paddingTop: 10}] }
                        maxLength = { 100 } />

                    { (!initialSetup) ? 
                    <>
                        <CheckBoxItem 
                            optionIsSelected={this.state.isMyPet} 
                            checkBoxTitle={"Es mi mascota"} 
                            onPress={() => this.setState({ isMyPet: !this.state.isMyPet })}
                            additionalStyle={{marginLeft: 10}} />
                        
                        <AppButton
                            buttonText={"Guardar mascota"} 
                            onPress={createPet} 
                            additionalButtonStyles={[styles.button, {alignSelf: 'center', marginTop: 40, marginBottom: 60}]} />
                    </> :
                    
                    /* Buttons for initial setup where user can
                        create user profile + add pets. 
                    */
                    <>
                        <AppButton
                            buttonText={"Nueva mascota"} 
                            onPress={handleNextPet} 
                            additionalButtonStyles={[styles.button, {alignSelf: 'center', marginTop: 40}]} 
                            additionalTextStyles={{ paddingLeft: 10 }}
                            additionalElement={<FeatherIcon name='plus' size={20} color={colors.white} />} />
                        <AppButton
                            buttonText={"Finalizar"} 
                            onPress={handleFinishInitialSetup} 
                            additionalButtonStyles={[styles.button, {alignSelf: 'center', marginTop: 20, marginBottom: 60, backgroundColor: colors.primary}]} />
                    </>
                    }
                </ScrollView>
            }
            </SafeAreaView>
            </>
        )
    }
}

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        marginHorizontal: 20,
    },
    alignedContent: {
        ...commonStyles.alignedContent,
        marginTop: 10
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
        alignSelf: 'flex-start'
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
});