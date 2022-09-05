import React from 'react';
import * as Facebook from 'expo-facebook';
import * as FileSystem from 'expo-file-system';

import commonStyles from '../utils/styles';
import colors from '../config/colors';
import * as config from '../config/config';

import { getJsonData, postJsonData } from '../utils/requests.js';
import { secureStoreSave } from '../utils/store.js';
import { Modal, Image, TouchableOpacity, Text, TextInput, StyleSheet, View, Alert } from 'react-native';
import { AppButton } from '../utils/buttons';

const USER_CREATED_SUCCESS_TEXT = "Perfil creado con éxito!";
const USER_CREATED_ERROR_TEXT = "Error al crear perfil!";
const USER_LOGIN_ERROR_TEXT = "Credenciales inválidas!";

export class LoginScreen extends React.Component {

    constructor(props) {
      super(props);

      this.state = {
        username: '',
        password: '',
        emailAddress: '',
        modalVisible: false,
        modalText: '',
        errorOcurred: false,
      };
    }

    setModalVisible = (visible) => {
      this.setState({ modalVisible: visible });
    }

    setUserCreatedSuccessModalVisible = () => {
      this.setState({ modalText: USER_CREATED_SUCCESS_TEXT, errorOcurred: false, modalVisible: true })
    }

    setErrorModalVisible = () => {
      this.setState({ modalText: USER_CREATED_ERROR_TEXT, errorOcurred: true, modalVisible: true  });
    }

    render() {
  
      const { navigation } = this.props;

      const loginWithFacebook = async () => {
        try {

          await Facebook.initializeAsync({
            appId: config.FACEBOOK_APP_ID,
          });
          
          const {type, token} = await Facebook.logInWithReadPermissionsAsync({ permissions:['public_profile', 'email'] });

          if (type == "success") {
            let facebookLoginResponse = await fetch(global.facebookGraphBaseUrl + `/me?access_token=${token}`);
            facebookLoginResponse = await facebookLoginResponse.json();

            let userInfo = await fetch(global.facebookGraphBaseUrl + `/${facebookLoginResponse.id}?fields=id,name,email&access_token=${token}`);
            userInfo = await userInfo.json();

            let userProfilePicture = await fetch(global.facebookGraphBaseUrl + `/${facebookLoginResponse.id}/picture?type=large&access_token=${token}`);
            console.log(`USER PROFILE PIC ${JSON.stringify(userProfilePicture.url)}!`);

            const facebookUsers = await getJsonData(global.noticeServiceBaseUrl + '/users/facebook/' + userInfo.id).catch(err => {
                alert(err);
            });


            if (facebookUsers.length == 0) {
              // If facebook user doesn't exist, create it in the database
              userInfo = {
                'username': userInfo.name, 
                'facebookId': userInfo.id,
                'name': userInfo.name, 
                'facebookId': facebookLoginResponse.id, 
                'email': userInfo.email,
                'profilePicture': await FileSystem.downloadAsync(
                  userProfilePicture.url, FileSystem.documentDirectory + global.PROFILE_PIC_TMP_FILE
                ).then(img => {
                  return FileSystem.readAsStringAsync(img.uri, { encoding: 'base64' })
                }).catch(error => {
                  console.error(error);
                  return null;
                })
              }

              console.log(`Creating profile for user ${userInfo.name}`)

              await postJsonData(global.noticeServiceBaseUrl + '/users', userInfo).then(response => {
                console.log(response);
                Alert.alert('', 'Usuario de Facebook registrado!')
              }).catch(err => {
                alert(err);
                return;
              });
            }

            const promises = []

            postJsonData(global.noticeServiceBaseUrl + '/users/login', {
                'facebookId': facebookLoginResponse.id
            }).then(response => {
                console.log(response['sessionToken']);
                promises.push(secureStoreSave('userId', response['userId']))
                promises.push(secureStoreSave('sessionToken', response['sessionToken']))
                promises.push(secureStoreSave('facebookToken', token))

                Promise.all(promises).then(() => {
                  // Navigate to UserProfile inside the Home screen navigator.
                  // Pass userId as parameter to the nested navigators.
                  navigation.navigate('BottomTabNavigator', {
                    screen: 'ViewUserDetails'
                  });
                });
            }).catch(err => {
              console.error(`Error at login ${err}`);
              this.setState({ modalText: USER_LOGIN_ERROR_TEXT, errorOcurred: true, modalVisible: true  });  
            });
            
          }
        } catch ({ message }) {
          alert(`Facebook Login Error: ${message}`);
        }
      }

      const handleLoginPress = () => { 
        postJsonData(global.noticeServiceBaseUrl + '/users/login', 
          {
            'username': this.state.username, 
            'password': this.state.password 
          }).then(response => {
            console.log(response['sessionToken']);
            let promises = []
            promises.push(secureStoreSave('userId', response['userId']))
            promises.push(secureStoreSave('sessionToken', response['sessionToken']))
            Promise.all(promises).then(() => {
              // Navigate to UserProfile inside the Home screen navigator.
              // Pass userId as parameter to the nested navigators.
              navigation.navigate('BottomTabNavigator', {
                screen: 'ViewUserDetails'
              });
            });
          }).catch(err => {
            console.error(`Error at login ${err}`);
            this.setState({ modalText: USER_LOGIN_ERROR_TEXT, errorOcurred: true, modalVisible: true  });
          });
      };
  
      const handleRegisterPress = () => { 
        this.props.navigation.navigate("CreateUserScreen", { 
          onUserCreatedSuccessfully: this.setUserCreatedSuccessModalVisible, 
          onUserCreatedError: this.setErrorModalVisible 
        });
      };
  
      const handleForgotPassword = () => { 
        navigation.navigate("ResetPassword");
      };

      return (
        <View style={commonStyles.container}>
          <View style={styles.loginUpperContainer}>
            <Image style={{height: "60%", width: "60%", resizeMode: 'contain', position: 'absolute', bottom: "15%"}} source={require('../assets/complete_logo.png')} />
          </View>
          <View style={{left: "15%"}}>
            <Text style={{color:colors.clearBlack, fontSize: 16, fontWeight: '500',  marginTop: "5%"}}>Inicia sesión para continuar</Text>
            
            <Modal 
                animationType="slide"
                transparent={true}
                visible={this.state.modalVisible}
                onRequestClose={() => {
                  this.setModalVisible(!modalVisible);
                }}>
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'stretch'}}>
                  <View style={styles.modalView}>
                  {this.state.errorOcurred? 
                      <Text style={styles.titleError}>Error!</Text>
                      : null 
                  }  
                    <Text style={styles.modalText}>{this.state.modalText}</Text>
                    <TouchableOpacity
                      style={[this.state.errorOcurred? styles.errorModalButton: styles.modalButton, {width: '50%', alignSelf: 'center', alignItems: 'center'}]}
                        onPress={() => {
                        this.setModalVisible(!this.state.modalVisible);
                      }}>
                      <Text style={{color: colors.white, fontWeight: '500'}}>Ok</Text>
                    </TouchableOpacity>
                  </View>
                </View>
            </Modal>

            <View style={{ width: "70%"}}>
              <TextInput
                placeholder = 'Usuario'
                onChangeText = {text => { this.setState({ username:text })}}
                autoCapitalize = 'none'
                autoCorrect = { false }
                style = {[styles.textInput, { marginTop: 20 }]}
                maxLength = { 30 }
              />
              <TextInput 
                placeholder = 'Contraseña'
                onChangeText = {password => { this.setState({ password:password })}}
                autoCapitalize = 'none'
                autoCorrect = { false }
                style = {[styles.textInput, { marginTop: 25 }]}
                maxLength = { 30 }
                secureTextEntry = { true } 
              />
              <Text style={{textDecorationLine: 'underline', color:colors.clearBlack, fontSize: 16, fontWeight: '500', marginTop: 10,textAlign: 'right'}} onPress={handleForgotPassword}>Olvidé mi contraseña!</Text>

            </View>
            <AppButton
              buttonText={"Iniciar sesión"} 
              onPress={handleLoginPress} 
              additionalButtonStyles={[styles.button, { marginTop: 40 }]} />
            <Text style={{left: "-15%", color:colors.clearBlack, fontSize: 16, fontWeight: '500', alignSelf: 'center', marginTop: 5}}>¿No sos miembro? <Text style={{textDecorationLine: 'underline'}} onPress={handleRegisterPress}>Registrate</Text></Text>
            <AppButton
              buttonText={"Continuar con Facebook"} 
              onPress={loginWithFacebook} 
              additionalButtonStyles={[styles.button, { backgroundColor: colors.facebook, marginTop: 60 }]} />
          </View>
        </View>
      )
    }
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    marginTop: "5%", 
    width: "70%",
    marginHorizontal: 0
  },
  loginUpperContainer: {
    height: "30%",
    width: "100%",
    backgroundColor: colors.primary,
    alignItems: 'center', // align items across secondary axis (horizontal)
  },
  section: {
    flex: 1,
    width:'100%',
    alignItems: 'center',
    ...commonStyles.alignedContent
  },
  textInput: {
    borderRadius: 8, 
    backgroundColor: colors.inputGrey, 
    padding: 15, 
    borderWidth: 1, 
    borderColor: colors.inputGrey, 
    fontSize: 16, 
    fontWeight: '500'
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
  modalButton: {
      backgroundColor: colors.secondary,
      margin: 0,
      marginTop: 10,
      padding: 18, 
      borderRadius: 7, 
      width: '55%', 
      alignSelf: 'flex-start'
  },
  errorModalButton: {
    backgroundColor: colors.pink,
    margin: 0,
    marginTop: 10,
    padding: 18, 
    borderRadius: 7, 
    width: '55%', 
    alignSelf: 'flex-start'
  },
  titleError: {
      fontWeight: '500',
      color: colors.pink,
      fontSize: 20,
      margin: 10,
      alignSelf: 'center'
  }
});
