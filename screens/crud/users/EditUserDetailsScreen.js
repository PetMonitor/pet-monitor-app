import React from "react";
import colors from '../../../config/colors';
import { Picker } from '@react-native-picker/picker';
import { putJsonData } from '../../../utils/requests';
import { getSecureStoreValueFor } from '../../../utils/store';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as ImagePicker from 'expo-image-picker';
import uuid from 'react-native-uuid';

import { Text, TextInput , TouchableOpacity, Switch, StyleSheet, View, ImageBackground, SafeAreaView, ScrollView } from 'react-native';

export class EditUserDetailsScreen extends React.Component {

    

    constructor(props) {
        super(props);
        this.state = Object.assign({ }, 
            { 
                ...this.props.route.params.userData,
                profilePicture: null
            }
        );
    }

    render() {

        const handleToggleAlerts = () => {
            this.setState(prevState => ({ alertsActivated: !prevState.alertsActivated }) )
        }

        const handleEditProfile = () => {
            const updatedUserData = Object.assign({ }, this.state);
                
            delete updatedUserData.userId;
            updatedUserData._ref = uuid.v4();

            getSecureStoreValueFor('sessionToken').then((sessionToken) => {
                console.log(`Updating user state to ${JSON.stringify(updatedUserData)}`)


                putJsonData(global.noticeServiceBaseUrl + '/users/' + this.state.userId, updatedUserData, {
                    'Authorization': 'Basic ' + sessionToken 
                }).then(response => {
                    console.log(response);
                    alert('Successfully updated user data!')
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
              alert("You've refused to allow this appp to access your photos!");
              return;
            }
        
            const result = await ImagePicker.launchImageLibraryAsync();
        
            // Explore the result
            console.log(result);
        
            if (!result.cancelled) {
              //this.setState({profilePicture: result.base64});
              console.log(result.uri);
            }
        }

        const handleChangePassword = () => {
            this.props.navigation.push('ChangeUserPasswordScreen', { ref: this.state._ref, userId: this.state.userId });
        }


        return (
            <SafeAreaView style={styles.container}>   
                <ScrollView style={styles.scrollView} >
                    <View style={styles.topContainer}>
                        {/* TODO: image source should be conditional to profilePicture value, this is just the default in case of null */}
                        <ImageBackground source={require('../../../assets/adorable-jack-russell-retriever-puppy-portrait.jpg')}  
                            style={{width: 130, height: 130, marginTop: 10}} 
                            imageStyle={{borderRadius: 130/2}}>
                                <View style={{position: 'absolute', top: 45, left:45}}>
                                    <Icon.Button
                                        onPress={handlePickNewImage}
                                        size={30}
                                        name="edit"
                                        backgroundColor='transparent'
                                        color={colors.white}/>
                                </View>
                        </ImageBackground>
                        <Text style={{color: colors.primary, fontWeight: 'bold', fontSize: 18, marginLeft: 15 , marginTop: 10}}>Información Básica</Text>
                        
                    </View>

                    <View style={{flex: 1, flexDirection:'row' }}>
                        <View style={[{flex: 1}, styles.column]}>
                            <Text style={styles.textLabel}>Nombre</Text>
                            <Text style={styles.textLabel}>Usuario</Text>
                            <Text style={styles.textLabel}>Email</Text>
                            <Text style={styles.textLabel}>Teléfono</Text>
                        </View>

                        <View style={[{flex: 2}, styles.column]}>
                            <TextInput 
                                value={this.state.name}
                                onChangeText = { inputName => { this.setState({ name: inputName })}}
                                autoCapitalize = 'none'
                                autoCorrect = { false }
                                style = {styles.textInput}
                                maxLength = { 30 }
                            />

                            <TextInput 
                                value={this.state.username}
                                onChangeText = { inputUsername => { this.setState({ username: inputUsername })}}
                                autoCapitalize = 'none'
                                autoCorrect = { false }
                                style = {styles.textInput}
                                maxLength = { 30 }
                            />

                            <TextInput 
                                value={this.state.email}
                                onChangeText = { inputEmail => { this.setState({ email: inputEmail })}}
                                autoCapitalize = 'none'
                                autoCorrect = { false }
                                style = {styles.textInput}
                                maxLength = { 30 }
                            />

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

                    <View style={[{flex: 1}, styles.column]}>
                        <Text style={[styles.textLabel, {textDecorationLine: 'underline'} ]}
                            onPress={handleChangePassword}>
                            Cambiar contraseña
                        </Text>
                    </View>

                    <View style={styles.lowerContainer}>

                        <View style={{flexDirection:'row', marginLeft: 10}}>
                            <Text style={{fontWeight: 'bold', fontSize: 18, color: colors.pink, margin:15}}>Alertas</Text>
                            <Switch 
                                style={{margin: 10}}
                                trackColor={{ false: colors.grey, true: colors.pink }}
                                thumbColor={ colors.white }
                                onValueChange={handleToggleAlerts}
                                value={!this.state.alertsActivated}
                            />
                        </View>

                        <View style={{flexDirection:'row', marginLeft: 20}}>
                            <Text style={styles.textLabel}>Radio</Text>
                            <Picker selectedValue={this.state.alertRadius}
                                style={{ height: 44, width: 150, marginLeft: 40 }}
                                itemStyle={{height: 88}}
                                onValueChange={(itemValue, itemIndex) => this.setState({ alertRadius:itemValue })}
                                enabled={this.state.alertsActivated}
                                >
                                <Picker.Item label="1 km" value="1" />
                                <Picker.Item label="3 km" value="3" />
                                <Picker.Item label="5 km" value="5" />
                                <Picker.Item label="10 km" value="10" />
                            </Picker>
                        </View>
                        
                        
                    </View>
                    <View style={{flex: 1, alignItems: 'center', marginTop: 40}}>
                        <TouchableOpacity 
                            style={[styles.button]}
                            onPress={handleEditProfile}>
                            <Text style={[styles.buttonFont, { color: colors.white }]}>Guardar Cambios</Text>
                        </TouchableOpacity>
                    </View>
                    {/* This next view is a workaround because scrollview won't go 
                        all the way to the bottom of the page 
                    */}
                    <View style={{flex:1, paddingTop:'20%'}}/> 
                </ScrollView>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    scrollView: {
        flex: 1,
        width:'100%',
        backgroundColor: colors.white,
    },
    topContainer: {
        flex: 1,
        backgroundColor: colors.white,
        flexDirection: 'column',
        alignItems: 'center'
    },
    column: {
        
        backgroundColor: colors.white,
        flexDirection: 'column',
        alignItems: 'baseline'
    },
    lowerContainer: {
        flex: 2,
        backgroundColor: colors.white,
        flexDirection: 'column',
        flexWrap: 'wrap',
        alignItems: 'flex-start'
    },
    textLabel: {
        color: colors.darkGery,
        fontSize: 20,
        marginTop: 40,
        marginLeft: 10,
        marginBottom: 18,
    },
    textInput: {
        color: colors.darkGery,
        borderRadius: 8, 
        backgroundColor: colors.inputGrey, 
        borderWidth: 1, 
        borderColor: colors.inputGrey, 
        fontSize: 18, 
        fontWeight: '500',
        marginTop: 17,
        marginBottom: 15,
        width: '90%',
        height: '15%',
        padding: 15
    },
    buttonFont: {
        fontSize: 18, 
        fontWeight: "bold", 
        alignSelf: "center",
    },
    button: {
        padding: 10,
        margin: 10,
        borderRadius: 7,
        backgroundColor: colors.primary,
        width: '80%',
        alignItems: 'center'
    },
});