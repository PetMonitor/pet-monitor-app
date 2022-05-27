import React from 'react';

import { postJsonData } from '../../../utils/requests.js';
import { getSecureStoreValueFor } from '../../../utils/store';
import Loader  from '../../../utils/Loader.js';
import colors from '../../../config/colors';

import { Picker } from '@react-native-picker/picker';
import { EventRegister } from 'react-native-event-listeners';
import { Text, TextInput, TouchableOpacity, StatusBar, StyleSheet, ScrollView, View, Image } from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';

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

        const showCheckBoxItem = (optionIsSelected, checkBoxTitle) => (
            <>
                <MaterialIcon
                    name={optionIsSelected ? 'checkbox-marked' : 'checkbox-blank'}
                    size={25}
                    color={optionIsSelected ? colors.secondary : colors.inputGrey}
                    style={{marginLeft: 10}}
                />
                <Text style={styles.checkBoxOptionTitle}>{checkBoxTitle}</Text>
            </>
        );

        return (
            <View style={styles.container}> 
                <View style={{flexDirection: 'row', alignContent: 'center', paddingTop: 70, paddingBottom: 10, backgroundColor: colors.primary}}>
                    <MaterialIcon
                        name='arrow-left'
                        size={30}
                        color={colors.white}
                        style={{marginLeft: 10}}
                        onPress={() => this.props.navigation.goBack()} />
                    <Text style={{fontSize: 24, fontWeight: 'bold', marginLeft: 15, color: colors.white}}>Crear mascota</Text>
                </View>

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
                            <Picker
                                selectedValue={this.state.type}
                                itemStyle={{height: 88, fontSize: 18}}
                                onValueChange={(itemValue, itemIndex) => this.setState({ type: itemValue })}>
                                    <Picker.Item label="Gato" value="CAT" />
                                    <Picker.Item label="Perro" value="DOG" />
                            </Picker>
                            <Text style={styles.optionTitle}>Sexo</Text>
                            <Picker
                                selectedValue={this.state.sex}
                                itemStyle={{height: 88, fontSize: 18}}
                                onValueChange={(itemValue, itemIndex) => this.setState({ sex: itemValue })}>
                                    <Picker.Item label="Macho" value="MALE" />
                                    <Picker.Item label="Hembra" value="FEMALE" />
                            </Picker>
                            
                        </View>
                        <View style={{flex:1, flexDirection: 'column'}}>
                            <Text style={styles.optionTitle}>Etapa de la vida</Text>
                            <Picker
                                selectedValue={this.state.lifeStage}
                                itemStyle={{height: 88, fontSize: 18}}
                                onValueChange={(itemValue, itemIndex) => this.setState({ lifeStage: itemValue }) }>
                                    <Picker.Item label="Bebé" value="BABY" />
                                    <Picker.Item label="Adulto" value="ADULT" />
                                    <Picker.Item label="Mayor" value="SENIOR" />
                            </Picker>
                            <Text style={styles.optionTitle}>Tamaño</Text>
                            <Picker
                                selectedValue={this.state.size}
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
                    <TouchableOpacity style={[styles.buttonUpload, {flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}]} onPress={handleImagePickerPress} >
                        <FeatherIcon name={'upload'} size={20} color={colors.white} style={{marginRight: 10}} />
                        <Text style={styles.buttonFont}>Subir fotos</Text>
                    </TouchableOpacity>

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
                        <TouchableOpacity  style={styles.alignedContent} 
                            onPress={() => this.setState({ isMyPet: !this.state.isMyPet })}>
                            {showCheckBoxItem(this.state.isMyPet, "Es mi mascota")}
                        </TouchableOpacity>
                        
                        <TouchableOpacity onPress={createPet} style={[styles.button, {alignSelf: 'center', marginTop: 40, marginBottom: 60}]}>
                            <Text style={styles.buttonFont}>Guardar mascota</Text>
                        </TouchableOpacity> 
                    </> :
                    
                    /* Buttons for initial setup where user can
                        create user profile + add pets. 
                    */
                    <>
                        <TouchableOpacity onPress={handleNextPet} style={styles.button}>
                            <Text style={styles.buttonFont}>Nueva Mascota</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleFinishInitialSetup} style={[styles.button, {marginBottom: '30%'}]}>
                            <Text style={styles.buttonFont}>Finalizar</Text>
                        </TouchableOpacity>
                    </>
                    }
                </ScrollView>
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