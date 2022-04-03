import React from 'react';
import { Text, SafeAreaView, StyleSheet, View, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

import colors from '../config/colors';

const { height, width } = Dimensions.get("screen")

/** Implements the screen that lists all the volunteers for fostering pets. */
export class FosteringVolunteersScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            volunteers: [{name: "Ingrid Lopez", canFoster: ["DOG", "CAT"], location: "Barracas", stars: 5}, {name: "Gabriel Ramirez", canFoster: ["DOG"], location: "Cordoba", stars: 3}, {name: "Juan Perez", canFoster: ["DOG", "CAT"], location: "La Plata", stars: 4}, {name: "Maria Gomez", canFoster: ["CAT"], location: "Belgrano", stars: 1}, {name: "Gabriel Ramirez", canFoster: ["DOG"], location: "Cordoba", stars: 3}]
        };
    }

    joinAsVolunteer = () => {
        
    }

    petFosteringMapper = (canFoster) => {
        if (canFoster.length == 1) {
            return this.petMapper(canFoster[0]);
        } else if (canFoster.includes("DOG") && canFoster.includes("CAT")) {
            return "perros y gatos";
        }
    }

    petMapper = (petType) => {
        if (petType == "DOG") {
            return "perros"
        } else if (petType == "CAT") {
            return "gatos"
        } else {
            ""
        }
    }

    renderRating = (starCount) => {
        var stars = [];
        for (let i = 0; i < starCount; i++) {
            stars.push(<FontAwesomeIcon key={'full-' + i} name='star' size={20} color={colors.secondary}/>)
        }
        var emptyStars = 5 - starCount
        if (emptyStars > 0) {
            for (let i = 0; i < emptyStars; i++) {
                stars.push(<FontAwesomeIcon key={'empty-' + i} name='star-o' size={20} color={colors.secondary}/>)
            }
        }
        return (
            <View style={{flexDirection: 'row', marginRight: 10}} >{stars}</View>
        )
    }

    showVolunteerData = ({item}) => {
        return (
            <TouchableOpacity style={styles.volunteerBox} onPress={() => this.navigateToVolunteerProfileView(item)}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 15, marginLeft: 10}}><Text style={[styles.text, {fontWeight: 'bold'}]}>{item.name}</Text>{this.renderRating(item.stars)}</View>
                <View style={{
                    marginTop: 10,
                    marginLeft: 10, 
                    marginRight: 10,
                    borderBottomColor: colors.secondary,
                    borderBottomWidth: 2,
                }}
                />
                <Text style={[styles.text, {marginTop: 10, marginLeft: 10}]}>Puede transitar <Text style={{fontWeight: 'bold'}}>{this.petFosteringMapper(item.canFoster)}</Text></Text>
                <View style={{flexDirection: 'row', marginTop: 10, marginLeft: 10, marginBottom: 15}}><MaterialIcon name='location-on' size={20} color={colors.secondary}/><Text style={[styles.text, {fontWeight: 'bold'}]}>{item.location}</Text></View>
            </TouchableOpacity>
        )
    }

    navigateToVolunteerProfileView = () => {
        this.props.navigation.push('FosteringVolunteerProfile'); 
    }

    navigateToSettingsView = () => {
        this.props.navigation.push('FosteringVolunteerProfileSettings');
    }

    render() {
        return (
            <SafeAreaView style={styles.container}> 
                <View style={{alignItems: 'flex-start', backgroundColor: colors.primary}}>
                    <Text style={{fontSize: 24, fontWeight: 'bold', paddingLeft: 20, paddingTop: 40, paddingBottom: 20, color: colors.white}}>Voluntarios para transitar</Text>
                </View>
                <FlatList 
                    data={this.state.volunteers}
                    keyExtractor={(_, index) => index.toString()}
                    initialNumToRender={this.state.volunteers.length}
                    renderItem={this.showVolunteerData}
                    style={{marginLeft: 30, marginTop: 10, marginRight: 30}}

                />
                <TouchableOpacity style={[styles.button, {marginBottom: 20, marginTop: 10}]} onPress={() => this.navigateToSettingsView()}>
                    <Text style={styles.buttonFont}>Quiero sumarme como voluntario</Text>
                </TouchableOpacity>       
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
    text: {
        color: colors.clearBlack, 
        fontSize: 16
    },
    volunteerBox: {
        marginTop: 20, 
        borderWidth: 0.9,
        borderColor: colors.inputGrey
    },
    button: {
        backgroundColor: colors.secondary,
        padding: 18, 
        width: width - 60,
        borderRadius: 7, 
        alignSelf: 'center'
    },
    buttonFont: {
        fontSize: 16, 
        fontWeight: '500', 
        alignSelf: 'center',
        color: colors.white
    },
});
