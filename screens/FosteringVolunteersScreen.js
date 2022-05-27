import React from 'react';
import { Text, StyleSheet, View, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

import commonStyles from '../utils/styles';
import colors from '../config/colors';
import { AppButton } from '../utils/buttons';

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
        const dividerLine = <View style={{
            marginTop: 10,
            marginLeft: 10,
            marginRight: 10,
            borderBottomColor: colors.secondary,
            borderBottomWidth: 2,
        }} />;
        return (
            <TouchableOpacity style={styles.volunteerBox} onPress={() => this.navigateToVolunteerProfileView(item)}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 15, marginLeft: 10}}><Text style={[styles.text, {fontWeight: 'bold'}]}>{item.name}</Text>{this.renderRating(item.stars)}</View>
                {dividerLine}
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
            <View style={commonStyles.container}> 
                <FlatList 
                    data={this.state.volunteers}
                    keyExtractor={(_, index) => index.toString()}
                    initialNumToRender={this.state.volunteers.length}
                    renderItem={this.showVolunteerData}
                    style={{marginLeft: 30, marginTop: 10, marginRight: 30}}

                />
                <AppButton
                        buttonText={"Quiero sumarme como voluntario"} 
                        onPress={this.navigateToSettingsView} 
                        additionalButtonStyles={{width: width - 60, alignSelf: 'center', marginBottom: 20, marginTop: 10}} />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    text: {
        color: colors.clearBlack, 
        fontSize: 16
    },
    volunteerBox: {
        marginTop: 20, 
        borderWidth: 0.9,
        borderColor: colors.inputGrey,
    },
});
