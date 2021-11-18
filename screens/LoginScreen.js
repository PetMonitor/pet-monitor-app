import React from 'react';

import { postJsonData } from '../utils/requests.js';
import { secureStoreSave } from '../utils/store.js';

import { Image, Platform, Text, TextInput, TouchableOpacity, SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';

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
        postJsonData(global.noticeServiceBaseUrl + '/users/login', 
          {
            'username': this.state.username, 
            'password': this.state.password 
          }).then(response => {
            console.log(response['sessionToken']);
            secureStoreSave('sessionToken', response['sessionToken']).then(() => {
              // Navigate to UserProfile inside the Home screen navigator.
              // Pass userId as parameter to the nested navigators.
              navigation.navigate('Home', {
                screen: 'UserProfile',
                params: { userId: response['userId'] }
              });
            });
          }).catch(err => {
            alert(err)
          });
      };
  
      const handleRegisterPress = () => { 
        this.props.navigation.navigate('CreateUser');
      };
  
      return (
        <SafeAreaView style={styles.container}>
          <View style={[styles.section, { backgroundColor: '#72b1a1', paddingTop: 80, paddingBottom:20 } ]}> 
            <Image style={{justifyContent: 'center'}} source={require('../assets/LOGO.png')} />
          </View>
          <View style={[styles.section, {flex:2, flexDirection: 'column', backgroundColor: 'white'}]}>
            <Text>Login to get started</Text>

            <TextInput 
              placeholder = 'username'
              onChangeText = {text => { this.setState({ username:text })}}
              autoCapitalize = 'none'
              autoCorrect = { false }
              style = {styles.textInput}
              maxLength = { 30 }
            />
            <TextInput 
              placeholder = 'password'
              onChangeText = {password => { this.setState({ password:password })}}
              autoCapitalize = 'none'
              autoCorrect = { false }
              style = {styles.textInput}
              maxLength = { 30 }
              secureTextEntry = { true } 
            />
            <TouchableOpacity onPress={handleLoginPress} style={styles.button}>
              <Text style={styles.buttonFont}>Login</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.section, {flexDirection: 'column', backgroundColor: 'white'}]}>
            <Image source={require('../assets/kitten_paw_2.png')} style={{position:'absolute', left: 0, bottom:0, opacity: 0.5}}/>
            <Text>Not a member yet?</Text>
            <Text style={{textDecorationLine: 'underline', paddingBottom:20}} onPress={handleRegisterPress}>Sign up</Text>
            <TouchableOpacity style={[styles.button, {backgroundColor:'#4267B2'}]}>
              <Text style={styles.buttonFont}>Login with Facebook</Text>
            </TouchableOpacity>
          </View>
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
    textInput: {
      height: 40,
      backgroundColor: 'white',
      borderWidth: 1,
      padding: 10,
      margin: 10,
      width: '60%',
    },
    button: {
      padding: 10,
      margin: 10,
      borderRadius: 10,
      backgroundColor: '#72b1a1',
      width: '60%',
      alignItems: 'center'
    },
    buttonFont: {
      fontSize:18, 
      color: 'white',
      fontWeight: 'bold'
    },
    section: {
      flex: 1,
      width:'100%',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center'
    }
});