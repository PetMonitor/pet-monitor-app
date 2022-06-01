import React from 'react';

import { Text, StyleSheet, View, ScrollView, SafeAreaView } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { Dog, Cat } from 'phosphor-react-native';

import { Rating } from '../utils/ratings';
import { HeaderWithBackArrow } from '../utils/headers';

import commonStyles from '../utils/styles';
import colors from '../config/colors';


/** Implements the screen that shows the profile of a given pet fostering volunteer. */
export class FosteringVolunteerProfileScreen extends React.Component {

    mapPetSizeToLabel = (size) => {
        if (size == "SMALL") {
            return "- Pequeñas"
        } else if (size == "MEDIUM") {
            return "- Medianas"
        } else if (size == "LARGE") {
            return "- Grandes"
        }
    }

    render() {
        const { navigation } = this.props
        const { volunteer } = this.props.route.params
        return ( <>
            <SafeAreaView
                edges={["top"]}
                style={{ flex: 0, backgroundColor: colors.primary }}/>
            <SafeAreaView
                edges={["left", "right", "bottom"]}
                style={commonStyles.container} >
                <HeaderWithBackArrow headerText={""} backgroundColor={colors.primary} backArrowColor={colors.white} onBackArrowPress={() => navigation.goBack()}/>
                <ProfileDataHeader name={volunteer.name} averageRating={volunteer.averageRating} location={volunteer.location} province={volunteer.province} />

                <ScrollView style={{marginLeft: 20, marginRight: 20}}>
                    <Text style={[styles.titleText, {marginTop: 15}]}>Puede transitar</Text>
                    <PetsToFosterView petTypesToFoster={volunteer.petTypesToFoster} />

                    <Text style={styles.titleText}>Información adicional</Text>
                    <Text style={styles.text}>{volunteer.additionalInformation}</Text>

                    <Text style={styles.titleText}>Tamaño mascota a transitar</Text>
                    {volunteer.petSizesToFoster.map(size => <Text style={styles.text}>{this.mapPetSizeToLabel(size)}</Text>)}

                    <Text style={styles.titleText}>Disponibilidad</Text>
                    <Text style={styles.text}>{volunteer.available ? "Disponible" : "No disponible"}</Text>

                    <Text style={styles.titleText}>Contacto</Text>
                    <Text style={styles.text}>{volunteer.email}</Text>
                    <Text style={styles.text}>{volunteer.phoneNumber}</Text>
                </ScrollView>               
            </SafeAreaView>
            </>
        )
    }
}

const ProfileDataHeader = ({name, averageRating, location, province}) => {
    return (<>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 15, marginLeft: 20, marginRight: 20}}><Text style={[styles.text, {fontWeight: 'bold', fontSize: 24, color: colors.primary, marginTop: 0}]}>{name}</Text><Rating starCount={averageRating} /></View>
        <View style={{flexDirection: 'row', marginTop: 20, marginLeft: 20, marginBottom: 10}}><MaterialIcon name='location-on' size={20} color={colors.secondary}/><Text style={[styles.text, {fontWeight: 'bold', marginTop: 0}]}>{location + ", " + province}</Text></View>

        <View
            style={{
                marginTop: 10,
                marginLeft: 20, 
                marginRight: 20,
                borderBottomColor: colors.secondary,
                borderBottomWidth: 2,
            }}
        />
    </>);
}

const PetsToFosterView = ({petTypesToFoster}) => {
    var pets = []
    if (petTypesToFoster.includes("DOG")) {
        pets.push(<Dog color={colors.secondary} weight='regular' size={68} key={"dog"}/>) 
    }  
    if  (petTypesToFoster.includes("CAT")) {
        pets.push(<Cat color={colors.secondary} weight='regular' size={68} key={"cat"} />)
    }
    return (
        <View style={[styles.alignedContent, {justifyContent:'space-evenly'}]}>
            {pets}
        </View>
    );
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
        fontSize: 16,
        marginTop: 10
    },
    alignedContent: {
        ...commonStyles.alignedContent, 
        marginTop: 8
    },
});
