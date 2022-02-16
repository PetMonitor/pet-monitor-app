import { Text, TextInput , TouchableOpacity, Switch, StyleSheet, View, ImageBackground, SafeAreaView, ScrollView } from 'react-native';


const ViewPetDetailsScreen = ({ route, navigation }) => {


    fetchPetsDetails = (petId) => {
        getSecureStoreValueFor('sessionToken').then((sessionToken) => {
            getJsonData(global.noticeServiceBaseUrl + '/users/' + this.props.userId + '/pets/' + petId, 
            {
                'Authorization': 'Basic ' + sessionToken 
            }).then(response => {
                this.setState({ petData : response });
            }).catch(err => {
                console.log(err);
                alert(err)
            });
        });
    };


    return (
        <View style={styles.container}>
            <View style={{flex: 1}}>
                <ImageBackground source={require('../../../assets/adorable-jack-russell-retriever-puppy-portrait.jpg')}></ImageBackground>
            </View>
            {/* TODO: this lower part should perhaps be a separate component*/}

            <ScrollView></ScrollView>
            <View>
                {/* TODO: buttons should only be visible while editing*/}

                <TouchableOpacity 
                        style={[styles.button]}
                        onPress={handleSetNewPassword}>
                        <Text style={[styles.buttonFont, { color: colors.white }]}>Guardar Cambios</Text>
                </TouchableOpacity>                
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        flexDirection: 'column',
        alignItems: 'baseline'
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


export default ViewPetDetailsScreen;