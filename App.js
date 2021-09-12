import React from 'react';
import './global.js'

import { Image, Platform, Text, TextInput, TouchableOpacity, SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';

import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { HomeScreen } from './screens/HomeScreen.js';
import { CreateUserScreen } from './screens/CreateUserScreen.js';
import { postJsonData } from './utils/requests.js'


class LoginScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: ''
    };
  }

  static navigationOptions = ({ navigation }) => {
    return {
        title: ''
    }
  }
  
  render() {

    const { navigation } = this.props;

    const handleLoginPress = () => { 
      postJsonData(global.noticeServiceBaseUrl + '/users/login', 
        {
          'username': this.state.username, 
          'password': this.state.password 
        }).then(response => {
          console.log(response);
          this.props.navigation.navigate('Home');
        }).catch(err => {
          alert(err)
        });
    };

    const handleRegisterPress = () => { 
      this.props.navigation.navigate('CreateUser');
    };

    return (
      <SafeAreaView style={styles.container}>
        <View style={[styles.section, { paddingTop: 80 } ]}> 
          <Image style={{height:120, width:120}} source={require('./assets/LOGO.jpeg')} />
          <Text style={{position:'absolute', paddingLeft:110, paddingTop:180, fontSize:20}}>et Monitor</Text>
        </View>
        <View style={[styles.section, {flexDirection: 'column'}]}>
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
            <Text style={{fontSize:18}}>Login</Text>
          </TouchableOpacity>
        </View>
        <View style={{flex:1, justifyContent: 'center'}}>
          <TouchableOpacity onPress={handleRegisterPress} style={styles.button}>
            <Text style={{fontSize:18}}>Register</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }
}


const RootStack = createStackNavigator (
  {
    Login: LoginScreen,
    Home: HomeScreen,
    CreateUser: CreateUserScreen,
  },
  {
    initialRouteName: 'Login'
  }
);

const AppContainer = createAppContainer(RootStack);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fbdc14',
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
    width: 250
  },
  button: {
    padding: 10,
    margin: 10,
  },
  section: {
    flex: 1,
    width:'100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  }
});


export default class App extends React.Component {
  render() {
    return <AppContainer/>;
  }
}
















