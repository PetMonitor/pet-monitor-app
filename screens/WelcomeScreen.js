import React from 'react';

// import { postJsonData } from '../utils/requests.js';
// import { secureStoreSave } from '../utils/store.js';

import { Image, StyleSheet, View, Dimensions } from 'react-native';

import colors from '../config/colors';

export class WelcomeScreen extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      username: '',
      loaded: false
    };
  }
  

  render() {
// const WelcomeScreen = () => {
  const win = Dimensions.get('window');
  var loaded = false;
  return (
      <View style={styles.container}>
        <Image style={{height: win.height /2.5, width: win.width, resizeMode: 'cover', position: 'absolute', top:0}} source={require('../assets/grey-kitty-with-monochrome-wall-her.jpg')} />
        <Image style={{height: "60%", width: "60%", resizeMode: 'contain'}} source={require('../assets/complete_logo.png')} />
        <Image style={{height: win.height /2.5, width: win.width, resizeMode: 'cover', position: 'absolute', bottom: 0}} source={require('../assets/adorable-jack-russell-retriever-puppy-portrait.jpg')} />
      </View>
    );
  }
}

// export default WelcomeScreen;


const styles = StyleSheet.create({
  button: {
    padding: 10,
    margin: 10,
  },
  container: {
    flex: 1,
    backgroundColor: colors.white,
    flexDirection: 'column', // main axis: vertical
    alignItems: 'center', // align items across secondary axis (horizontal)
    justifyContent: 'center', // justify along main axis (vertical)
    // paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  loginUpperContainer: {
    height: "30%",
    width: "100%",
    backgroundColor: colors.primary,
    // flexDirection: 'column', // main axis: vertical
    alignItems: 'center', // align items across secondary axis (horizontal)
    // justifyContent: 'center', // justify along main axis (vertical)
    // paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  // loginLowerContainer: {
  //   flex: 2,
  //   backgroundColor: colors.white,
  //   // flexDirection: 'column', // main axis: vertical
  //   // alignItems: 'center', // align items across secondary axis (horizontal)
  //   // justifyContent: 'center', // justify along main axis (vertical)
  //   // paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  // },
  section: {
    flex: 1,
    width:'100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  textInput: {
    height: 40,
    backgroundColor: 'white',
    borderWidth: 1,
    padding: 10,
    margin: 10,
    width: 250
  },
});