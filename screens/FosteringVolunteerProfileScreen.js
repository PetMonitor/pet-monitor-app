import React from 'react';

import { Text, StyleSheet, View, ScrollView, SafeAreaView } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { Dog, Cat } from 'phosphor-react-native';

import { showHeader } from '../utils/headers';

import commonStyles from '../utils/styles';
import colors from '../config/colors';


/** Implements the screen that shows the profile of a given pet fostering volunteer. */
export class FosteringVolunteerProfileScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            name: "Ingrid Lopez",
            canFoster: ["DOG", "CAT"],
            city: "CABA",
            province: "Buenos Aires",
            stars: 5,
            available: true,
            petSizeToFoster: "SMALL",
            additionalInfo: "Vivo con perros y con chicos. Tengo balcón en el depto.",
            contactInfo: {
                email: "email@gmail.com",
                phoneNumber: "112345678"
            }
        };
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

    mapPetSizeToLabel = (size) => {
        if (size == "SMALL") {
            return "Pequeña"
        } else if (size == "MEDIUM") {
            return "Mediana"
        } else if (size == "LARGE") {
            return "Grande"
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
            <View style={{flexDirection: 'row', marginRight: 20}} >{stars}</View>
        )
    }

    renderPetsToFoster = () => {
        var pets = []
        if (this.state.canFoster.includes("DOG")) {
            pets.push(<Dog color={colors.secondary} weight='regular' size={68} key={"dog"}/>) 
        }  
        if  (this.state.canFoster.includes("DOG")) {
            pets.push(<Cat color={colors.secondary} weight='regular' size={68} key={"cat"} />)
        }
        return pets
    }

    render() {
        return ( <>
            <SafeAreaView
                edges={["top"]}
                style={{ flex: 0, backgroundColor: colors.primary }}/>
            <SafeAreaView
                edges={["left", "right", "bottom"]}
                style={commonStyles.container} >
                {showHeader("", colors.white, colors.primary, colors.white, () => this.props.navigation.goBack())}

                <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 15, marginLeft: 20}}><Text style={[styles.text, {fontWeight: 'bold', fontSize: 24, color: colors.primary}]}>{this.state.name}</Text>{this.renderRating(this.state.stars)}</View>
                <View style={{flexDirection: 'row', marginTop: 20, marginLeft: 20, marginBottom: 10}}><MaterialIcon name='location-on' size={20} color={colors.secondary}/><Text style={[styles.text, {fontWeight: 'bold'}]}>{this.state.province + ", " + this.state.city}</Text></View>

                <View
                style={{
                    marginTop: 10,
                    marginLeft: 20, 
                    marginRight: 20,
                    borderBottomColor: colors.secondary,
                    borderBottomWidth: 2,
                }}
                />
                <ScrollView style={{marginLeft: 20, marginRight: 20}}>
                    <Text style={[styles.titleText, {marginTop: 15}]}>Puede transitar</Text>
                    <View style={[styles.alignedContent, {justifyContent:'space-evenly'}]}>
                        {this.renderPetsToFoster()}
                    </View>

                    <Text style={styles.titleText}>Información adicional</Text>
                    <Text style={styles.text}>{this.state.additionalInfo}</Text>

                    <Text style={styles.titleText}>Tamaño mascota a transitar</Text>
                    <Text style={styles.text}>{this.mapPetSizeToLabel(this.state.petSizeToFoster)}</Text>

                    <Text style={styles.titleText}>Disponibilidad</Text>
                    <Text style={styles.text}>{this.state.available ? "Disponible" : "No disponible"}</Text>

                    <Text style={styles.titleText}>Contacto</Text>
                    <Text style={styles.text}>{this.state.contactInfo.email}</Text>
                    <Text style={styles.text}>{this.state.contactInfo.phoneNumber}</Text>
                </ScrollView>               
            </SafeAreaView>
            </>
        )
    }
}

const styles = StyleSheet.create({
    titleText: {
        color: colors.clearBlack, 
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 25, 
        marginBottom: 5
    },
    text: {
        color: colors.clearBlack, 
        fontSize: 16
    },
    alignedContent: {
        ...commonStyles.alignedContent, 
        marginTop: 10
    },
});
