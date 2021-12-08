import React from 'react';

import { postJsonData } from '../../../utils/requests.js';
import colors from '../../../config/colors';

import { Picker, Text, TextInput, TouchableOpacity, StatusBar, StyleSheet, SafeAreaView, ScrollView, View } from 'react-native';

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
            description: ''
        }
    }

    render() {

        const { userInfo, initialSetup, initPetType } = this.props.route.params;
        const numberOfLines = 7;

        const handleNextPet = () => {
            if (!initialSetup) {
                alert('Method not allowed outside initial setup context!');
            }

            // Add pet to user's list of pets
            userInfo['pets'] = [
                ...userInfo['pets'],
                this.state
            ]

            console.log('Navigating to create pet screen');
            console.log(JSON.stringify(userInfo));

            this.props.navigation.push('CreatePet', { userInfo: userInfo, initialSetup: true, initPetType: initPetType}); 
        };

        const handleFinishInitialSetup = () => {
            if (!initialSetup) {
                alert('Method not allowed outside initial setup context!');
            }

            // Add pet to user's list of pets
            userInfo['pets'] = [
                ...userInfo['pets'],
                this.state
            ]
            
            console.log('Create user:');
            console.log(JSON.stringify(userInfo));  

            postJsonData(global.noticeServiceBaseUrl + '/users', userInfo).then(response => {
                console.log(response);
                alert('Successfully created user!')
                // go back to login page
                this.props.navigation.popToTop();
            }).catch(err => {
                alert(err)
            });      
        };

        return (
            <SafeAreaView style={styles.container}>   
                <ScrollView style={styles.scrollView} >
                    <Text style={styles.label}>Nombre</Text>
                    <TextInput 
                        onChangeText = { petName => { this.setState({ name: petName })}}
                        autoCapitalize = 'none'
                        autoCorrect = { false }
                        style = { styles.textInput }
                        maxLength = { 100 } />
                    <View style={{flex:1, flexDirection: 'row'}}>
                        <View style={{flex:1, flexDirection: 'column'}}>
                            <Text style={styles.label}>Tipo</Text>
                            <Picker
                                selectedValue={this.state.type}
                                style={{ height: 44, width: 150, marginBottom: 15, marginTop: 5}}
                                itemStyle={{height: 88}}
                                onValueChange={(itemValue, itemIndex) => this.setState({ type: itemValue })}>
                                    <Picker.Item label="CAT" value="CAT" />
                                    <Picker.Item label="DOG" value="DOG" />
                            </Picker>
                            <Text style={styles.label}>Sexo</Text>
                            <Picker
                                selectedValue={this.state.sex}
                                style={{ height: 64, width: 150 }}
                                itemStyle={{height: 88}}
                                onValueChange={(itemValue, itemIndex) => this.setState({ sex: itemValue })}>
                                    <Picker.Item label="Macho" value="MALE" />
                                    <Picker.Item label="Hembra" value="FEMALE" />
                            </Picker>
                            
                        </View>
                        <View style={{flex:1, flexDirection: 'column'}}>
                            <Text style={styles.label}>Etapa de la vida</Text>
                            <Picker
                                selectedValue={this.state.lifeStage}
                                style={{ height: 44, width: 150, marginBottom: 15, marginTop: 5 }}
                                itemStyle={{height: 88}}
                                onValueChange={(itemValue, itemIndex) => this.setState({ lifeStage: itemValue })}>
                                    <Picker.Item label="Bebé" value="BABY" />
                                    <Picker.Item label="Adulto" value="ADULT" />
                                    <Picker.Item label="Mayor" value="SENIOR" />
                            </Picker>
                            <Text style={styles.label}>Size</Text>
                            <Picker
                                selectedValue={this.state.size}
                                style={{ height: 44, width: 150 }}
                                itemStyle={{height: 88}}
                                onValueChange={(itemValue, itemIndex) => this.setState({ size: itemValue })}>
                                    <Picker.Item label="Pequeño" value="SMALL" />
                                    <Picker.Item label="Mediano" value="MEDIUM" />
                                    <Picker.Item label="Grande" value="LARGE" />
                            </Picker>
                        </View>
                    </View>
                    <Text style={styles.label}>Raza</Text>
                    <TextInput 
                        onChangeText = { breed => { this.setState({ breed: breed })}}
                        autoCapitalize = 'none'
                        autoCorrect = { false }
                        style = { styles.textInput }
                        maxLength = { 100 } />
                    <Text style={styles.label}>Color de Pelaje</Text>
                    <TextInput 
                        onChangeText = { furColor => { this.setState({ furColor: furColor })}}
                        autoCapitalize = 'none'
                        autoCorrect = { false }
                        style = { styles.textInput }
                        maxLength = { 100 } />
                    <TouchableOpacity  style={styles.button}>
                        <Text style={styles.buttonFont}>Subir Foto</Text>
                    </TouchableOpacity>
                    <Text style={styles.label}>Descripción</Text>
                    <TextInput 
                        multiline={true}
                        numberOfLines={Platform.OS === 'ios' ? null : numberOfLines}
                        minHeight={(Platform.OS === 'ios' && numberOfLines) ? (20 * numberOfLines) : null}
                        onChangeText = { description => { this.setState({ description: description })}}
                        autoCapitalize = 'none'
                        autoCorrect = { false }
                        style = { styles.textInput }
                        maxLength = { 100 } />

                    {/* Buttons for initial setup where user can
                        create user profile + add pets. 
                    */}
                    <TouchableOpacity onPress={handleNextPet}  style={styles.button}>
                        <Text style={styles.buttonFont}>Nueva Mascota</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleFinishInitialSetup} style={styles.button}>
                        <Text style={styles.buttonFont}>Finalizar</Text>
                    </TouchableOpacity>
                    {/* This next view is a workaround because scrollview won't go 
                        all the way to the bottom of the page 
                    */}
                    <View style={{flex:1, paddingTop:'30%'}}/> 
                </ScrollView>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        flexDirection: 'column', // main axis: vertical
        alignItems: 'center', // align items across secondary axis (horizontal)
        justifyContent: 'center', // justify along main axis (vertical)
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    scrollView: {
        flex: 1,
        width:'100%',
        backgroundColor: 'white',
        marginHorizontal: 20,
        paddingLeft: '7%',
    },
    textInput: {
        borderRadius: 8, 
        backgroundColor: colors.inputGrey, 
        padding: 15, 
        borderWidth: 1, 
        borderColor: colors.inputGrey, 
        fontSize: 16, 
        fontWeight: '500',
        margin: 10,
        width: '80%',
    },
    label: {
        fontSize: 18,
        paddingTop: 10,
        marginTop: 20,
    },
    button: {
        padding: 10,
        margin: 10,
        borderRadius: 7,
        backgroundColor: '#e1ad01',
        width: '80%',
        alignItems: 'center'
    },
    buttonFont: {
        fontSize:18, 
        color: 'white',
        fontWeight: 'bold'
    }
});