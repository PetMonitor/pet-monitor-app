import React from 'react';
import {Image, Text, TouchableOpacity, StatusBar, StyleSheet, SafeAreaView, View } from 'react-native';

export class AskCreatePetScreen extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {

        const { navigation } = this.props;

        const { user } = this.props.route.params;

        const styles = StyleSheet.create({
            container: {
                flex: 1,
                backgroundColor: 'white',
                flexDirection: 'column', // main axis: vertical
                alignItems: 'center', // align items across secondary axis (horizontal)
                justifyContent: 'center', // justify along main axis (vertical)
                paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
            },
            title: {
                fontWeight: 'bold',
                color: '#72b1a1',
                fontSize: 24
            }
        });

        const handleCreatePet = (petType) => {
            // Navigate to pet creation page.
            // Pass user info, and indicate that we are coming from the initial setup page,
            // so the whole user info structure will be passed for the user to be created
            // along with an initial set of pets.
            navigation.push('CreatePet', { userInfo: user, initialSetup: true, initPetType: petType}); 
        };

        const handleSkipStep = () => {
            alert('Create user with no pets');
            // User should be registered and redirected to login page.
            /*postJsonData(global.noticeServiceBaseUrl + '/users', 
              {
                'username': this.state.username, 
                'email': this.state.email,
                'password': this.state.password 
              }
            ).then(response => {
                console.log(response);
                alert('Successfully created user!')
                // go back to login page
                //navigation.popToTop();
                navigation.navigate('CreatePet');
            }).catch(err => {
                alert(err)
            });*/
            navigation.popToTop();
        };

        return (
            <SafeAreaView style={styles.container}>
                <View style={{flex:2}} style={{paddingTop:50, paddingBottom:50}}>  
                    <Text style={styles.title}>Introduce us to your pets!</Text>  
                </View> 
                <View style={{flex:1, alignItems: 'center'}}> 
                    <Text style={{paddingTop:20, paddingBottom:20, fontSize: 16}}>We recommend that you create a profile for all your pets.</Text>
                    <Text style={{paddingTop:20, paddingBottom:20, fontSize: 16}}>Shall we start with the first one?</Text>  
                </View> 
                <View style={{flex:2,flexDirection:'row',paddingTop:20, paddingBottom:50}} >
                    <TouchableOpacity onPress={() => handleCreatePet('cat')}>
                        <Image source={require('../../../assets/kitten_paw_1.png')} style={{opacity:0.8}}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleCreatePet('dog')}>
                        <Image source={require('../../../assets/dog_paw_1.png')} style={{opacity:0.8}} />
                    </TouchableOpacity>
                </View>
                <View style={{flex:1}}>
                    <Text style={{textDecorationLine: 'underline', paddingBottom:20, fontSize: 16}} onPress={handleSkipStep}>Skip this step</Text>
                </View>
            </SafeAreaView>
        )
    }
}