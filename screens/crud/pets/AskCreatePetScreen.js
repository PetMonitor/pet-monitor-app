import React from 'react';

import { postJsonData } from '../../../utils/requests.js';

import { Text, TouchableOpacity, StatusBar, StyleSheet, SafeAreaView, View } from 'react-native';
import { Dog, Cat } from 'phosphor-react-native';

import commonStyles from '../../../utils/styles';
import colors from '../../../config/colors.js';

export class AskCreatePetScreen extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {

        const { navigation } = this.props;

        const { user } = this.props.route.params;

        const tabIconSize = 60;

        const styles = StyleSheet.create({
            container: {
                alignItems: 'center', // align items across secondary axis (horizontal)
                justifyContent: 'center', // justify along main axis (vertical)
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
            navigation.push('CreatePet', { userInfo: user, initialSetup: true, initPetType: petType, onGoBack: null }); 
        };

        const handleSkipStep = () => {
            // User should be registered and redirected to login page.
            postJsonData(global.noticeServiceBaseUrl + '/users', user).then(response => {
                console.log(response);
                alert('Successfully created user!')
                // go back to login page
                navigation.popToTop();
            }).catch(err => {
                alert(err)
            });
        };

        return (
            <SafeAreaView style={[commonStyles.container, styles.container]}>
                <View style={{flex:2, paddingTop:50, paddingBottom:50}}>  
                    <Text style={styles.title}>Presentanos a tus mascotas!</Text>  
                </View> 
                <View style={{flex:1, alignItems: 'center'}}> 
                    <Text style={{paddingTop:20, paddingBottom:20, fontSize: 16}}>Recomendamos registrar a todas tus mascotas.</Text>
                    <Text style={{paddingTop:20, paddingBottom:20, fontSize: 16}}>¿Empezamos con la primera?</Text>  
                </View> 
                <View style={{flex:2, flexDirection:'row', paddingTop:20, paddingBottom:50}} >
                    <TouchableOpacity onPress={() => handleCreatePet('CAT')}>
                        <Cat size={tabIconSize} color={colors.yellow} weight='regular' />
                    </TouchableOpacity>    
                    <TouchableOpacity onPress={() => handleCreatePet('DOG')}>
                        <Dog size={tabIconSize} color={colors.yellow} weight='regular' />
                    </TouchableOpacity>
                </View>
                <View style={{flex:1}}>
                    <Text style={{textDecorationLine: 'underline', paddingBottom:20, fontSize: 16}} onPress={handleSkipStep}>Saltear este paso</Text>
                </View>
            </SafeAreaView>
        )
    }
}
