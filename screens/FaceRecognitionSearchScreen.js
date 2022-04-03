import React from 'react';

import { Text, SafeAreaView, StyleSheet, View, FlatList, TouchableOpacity, Image, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

import colors from '../config/colors';

/** Implements the Face Recognition search screen. */
export class FaceRecognitionSearchScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            userPets: ["", "", "", "", ""],
        };
    }

    renderPet = (item) =>  {
        return (
            <TouchableOpacity onPress={() => console.log(item)}>
                <Image style={{height: 100, width: 100, borderRadius: 5, margin: 5}}
                        source={require('../assets/adorable-jack-russell-retriever-puppy-portrait.jpg')}
                />
            </TouchableOpacity>
        )
    }

    navigateToSearchResults = () => {
        this.props.navigation.push('FaceRecognitionResults'); 
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                 <View style={{alignItems: 'flex-start', backgroundColor: colors.primary}}>
                    <Text style={{fontSize: 24, fontWeight: 'bold', paddingLeft: 20, paddingTop: 40, paddingBottom: 20, color: colors.white}}>Reconocimiento facial</Text>
                </View>
                <ScrollView style={{flex:1, padding: 20}}>
                <Text style={{margin: 20, color: colors.clearBlack, fontSize: 15, marginTop: 30}}>Si perdiste o encontraste a una mascota podés iniciar una búsqueda por  reconocimiento facial para encontrar  mascotas similares.</Text>
                <Text style={styles.sectionTitle}>Seleccionar mascota</Text>
                <FlatList 
                    data={this.state.userPets} 
                    horizontal={true}
                    keyExtractor={(_, index) => index.toString()}
                    initialNumToRender={this.state.userPets.length}
                    renderItem={this.renderPet}
                    style={{paddingLeft: 15, marginRight: 10, marginTop: 10}}

                />
                {/* <TouchableOpacity style={styles.button} onPress={() => this.navigateToCreatePet()}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Icon name='plus' size={20} color={colors.white} />
                        <Text style={[styles.buttonFont, {paddingLeft: 10}]}>Mascota nueva</Text>
                    </View>
                </TouchableOpacity>  */}

                <TouchableOpacity style={styles.buttonSearch} onPress={() => this.navigateToSearchResults()}>
                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                        <Icon name='search' size={20} color={colors.white} />
                        <Text style={[styles.buttonFont, {paddingLeft: 10}]}>Buscar</Text>
                    </View>
                </TouchableOpacity> 
                </ScrollView>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        flexDirection: 'column',    // main axis: vertical
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    sectionTitle: {
        fontSize: 20, 
        color: colors.secondary,
        paddingLeft: 20, 
        paddingTop: 25, 
        paddingBottom: 5, 
        fontWeight: 'bold',
    },
    button: {
        backgroundColor: colors.secondary,
        marginTop: 10,
        marginLeft: 10,
        padding: 18, 
        borderRadius: 7, 
        width: '55%', 
        alignSelf: 'flex-start'
    },
    buttonSearch: {
        backgroundColor: colors.secondary,
        marginTop: 30,
        // marginLeft: 10,
        padding: 18, 
        borderRadius: 7, 
        width: '50%', 
        alignSelf: 'center'
    },
    buttonFont: {
        // flexDirection: 'column',
        fontSize: 16, 
        fontWeight: '500', 
        alignSelf: 'center',
        color: colors.white
    },
});
