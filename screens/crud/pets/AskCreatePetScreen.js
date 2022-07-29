import React from 'react';

import { postJsonData } from '../../../utils/requests.js';

import { Text, TouchableOpacity, StatusBar, StyleSheet, SafeAreaView, View } from 'react-native';
import { Dog, Cat } from 'phosphor-react-native';

import commonStyles from '../../../utils/styles';
import { HeaderWithBackArrow } from '../../../utils/headers';

import colors from '../../../config/colors.js';

export class AskCreatePetScreen extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {

        const { navigation } = this.props;

        const { user, onUserCreatedSuccessfully, onUserCreatedError  } = this.props.route.params;

        const tabIconSize = 60;

        const handleCreatePet = (petType) => {
            // Navigate to pet creation page.
            // Pass user info, and indicate that we are coming from the initial setup page,
            // so the whole user info structure will be passed for the user to be created
            // along with an initial set of pets.
            navigation.push('CreatePet', 
            {   
                userInfo: user, 
                initialSetup: true, 
                initPetType: petType, 
                onGoBack: null,
                onUserCreatedSuccessfully: onUserCreatedSuccessfully, 
                onUserCreatedError: onUserCreatedError
            }); 
        };

        const handleSkipStep = () => {
            //console.log(`Skip create pets ${JSON.stringify(user)}`)
            // User should be registered and redirected to login page.
            postJsonData(global.noticeServiceBaseUrl + '/users', user).then(response => {
                console.log(response);
                // go back to login page
                onUserCreatedSuccessfully()
                navigation.popToTop();
            }).catch(err => {
                console.error(err);
                onUserCreatedError();
                navigation.popToTop();
            });
        };

        return (
            <>
            <SafeAreaView
                edges={["top"]}
                style={{ flex: 0, backgroundColor: colors.primary }}/>
            <SafeAreaView
                edges={["left", "right", "bottom"]}
                style={commonStyles.container} >
                <HeaderWithBackArrow headerText={""} headerTextColor={colors.white} backgroundColor={colors.primary} backArrowColor={colors.white} onBackArrowPress={() => this.props.navigation.goBack()} />

                <View style={{flex:2, paddingTop:50, paddingBottom:30}}>  
                    <Text style={styles.title}>Presentanos a tus mascotas!</Text>  
                </View> 
                <View style={{flex:1, alignItems: 'center'}}> 
                    <Text style={styles.text}>Recomendamos registrar a todas tus mascotas.</Text>
                    <Text style={styles.text}>¿Empezamos con la primera?</Text>  
                </View> 
                <View style={{flex:2, paddingTop:30, paddingBottom:50, marginHorizontal: 20}}>
                    <View style={[commonStyles.alignedContent, {justifyContent: 'space-evenly'}]} >
                        <TouchableOpacity onPress={() => handleCreatePet('CAT')}>
                            <Cat size={tabIconSize} color={colors.pink} weight='regular' />
                        </TouchableOpacity>    
                        <TouchableOpacity onPress={() => handleCreatePet('DOG')}>
                            <Dog size={tabIconSize} color={colors.secondary} weight='regular' />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{flex:1}}>
                    <Text style={{textDecorationLine: 'underline', paddingBottom:20, fontSize: 16, color: colors.clearBlack, alignSelf: 'center'}} onPress={handleSkipStep}>Saltear este paso</Text>
                </View>
            </SafeAreaView>
            </>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
        flexDirection: 'column', // main axis: vertical
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        justifyContent: 'center', // justify along main axis (vertical)
    },
    title: {
        fontWeight: '500',
        color: colors.primary,
        fontSize: 24,
        alignSelf: 'center'
    },
    text: {
        paddingTop:20,
        paddingBottom:20, 
        fontSize: 16, 
        color: colors.clearBlack,
        marginHorizontal: 20,
        alignSelf: 'center'
    }
});
