import React from 'react';
import { Image, StyleSheet, View, Text, TouchableOpacity, SafeAreaView, StatusBar, Platform } from 'react-native';

import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { HomeScreen } from './screens/HomeScreen.js';



class LoginScreen extends React.Component {
   
  render() {

    const { navigation } = this.props;

    const handleLoginPress = () => { 
      this.props.navigation.navigate('Home');
   };

    const handleRegisterPress = () => { 
      alert("Please register!")
    };

    const styles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: '#fbdc14',
        flexDirection: 'column', // main axis: vertical
        alignItems: 'center', // align items across secondary axis (horizontal)
        justifyContent: 'center', // justify along main axis (vertical)
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
      }
    });
    

    return (
      <SafeAreaView style={styles.container}>
        <View style={{flex:1, width:'100%',  backgroundColor:'tomato', flexDirection:'row', justifyContent: 'center', paddingTop:80}}>
          <Image style={{height:120, width:120}} source={require('./assets/LOGO.jpeg')} />
          <Text style={{position:'absolute', paddingLeft:90, paddingTop:180}}>et Monitor</Text>
        </View>
        <View style={{flex:1,  width:'100%', backgroundColor:'dodgerblue', justifyContent: 'center', alignItems: 'center'}}>
          <Text>The username text box</Text>
          <Text>The password text box</Text>
          <TouchableOpacity onPress={handleLoginPress}>
            <Text>Login</Text>
          </TouchableOpacity>
        </View>
        <View style={{flex:1, justifyContent: 'center'}}>
          <TouchableOpacity onPress={handleRegisterPress}>
            <Text>Register</Text>
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
  },
  {
    initialRouteName: 'Login'
  }
);

const AppContainer = createAppContainer(RootStack);

export default class App extends React.Component {
  render() {
    return <AppContainer/>;
  }
}
















