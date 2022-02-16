import React from 'react';

import { postJsonData } from '../utils/requests.js';
import { secureStoreSave } from '../utils/store.js';

import { Image, Platform, Text, TextInput, TouchableOpacity, StatusBar, StyleSheet, View } from 'react-native';

import colors from '../config/colors';

export class LoginScreen extends React.Component {

    constructor(props) {
      super(props);

      this.state = {
        username: '',
        password: ''
      };
    }
    

    render() {
  
      const { navigation } = this.props;

      const handleLoginPress = () => { 
        // postJsonData(global.noticeServiceBaseUrl + '/users/login', 
        //   {
        //     'username': this.state.username, 
        //     'password': this.state.password 
        //   }).then(response => {
        //     console.log(response['sessionToken']);
        //     secureStoreSave('sessionToken', response['sessionToken']).then(() => {
        //       // Navigate to UserProfile inside the Home screen navigator.
        //       // Pass userId as parameter to the nested navigators.
        //       navigation.navigate('BottomTabNavigator', {
        //         screen: 'UserProfile',
        //         params: { userId: response['userId'] }
        //       });
        //     });
        //   }).catch(err => {
        //     alert(err)
        //   });
        navigation.navigate('BottomTabNavigator', {
          screen: 'UserProfile',
          // params: { userId: response['userId'] }
        });
      };
  
      const handleRegisterPress = () => { 
        this.props.navigation.navigate("CreateUserScreen");
      };
  
      return (
        <View style={styles.container}>
          <View style={styles.loginUpperContainer}>
            <Image style={{height: "60%", width: "60%", resizeMode: 'contain', position: 'absolute', bottom: "15%"}} source={require('../assets/complete_logo.png')} />
          </View>
          <View>
            <Text style={{color:colors.clearBlack, fontSize: 16, fontWeight: '500', left: "15%", marginTop: "5%"}}>Inicia sesión para continuar</Text>
            
            <View style={{left: "15%", width: "70%"}}>
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
            </View>
            <TouchableOpacity style={[styles.button, { marginTop: 40 }]} onPress={handleLoginPress}>
              <Text style={[styles.buttonFont, { color: colors.white }]}>Iniciar sesión</Text>
            </TouchableOpacity>
            <Text style={{color:colors.clearBlack, fontSize: 16, fontWeight: '500', alignSelf: 'center', marginTop: 5}}>¿No sos miembro? <Text style={{textDecorationLine: 'underline'}} onPress={handleRegisterPress}>Registrate</Text></Text>
            
            <TouchableOpacity style={[styles.button, { backgroundColor: colors.facebook, marginTop: 60 }]} onPress={() => console.log("Facebook login not implemented yet, do we need this?")}>
              <Text style={[styles.buttonFont, { color: colors.white }]}>Continuar con Facebook</Text>
            </TouchableOpacity>            
          </View>
        </View>
      )
    }
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    marginTop: "5%", 
    padding: 18, 
    borderRadius: 7, 
    left: "15%", 
    width: "70%", 
    alignSelf: 'flex-start'
  },
  buttonFont: {
    fontSize: 16, 
    fontWeight: '500', 
    alignSelf: 'center'
  },
  container: {
    flex: 1,
    backgroundColor: colors.white,
    flexDirection: 'column', // main axis: vertical
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
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
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
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
});
