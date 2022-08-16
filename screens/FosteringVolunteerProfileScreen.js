import React from 'react';

import { Text, StyleSheet, View, ScrollView, SafeAreaView, Alert } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { Dog, Cat } from 'phosphor-react-native';

import { Rating } from '../utils/ratings';
import { HeaderWithBackArrow } from '../utils/headers';
import { postJsonData } from '../utils/requests.js';

import commonStyles from '../utils/styles';
import colors from '../config/colors';
import { ContactInfoModal } from '../utils/contactInfoModal';
import { AppButton } from '../utils/buttons';
import { validateEmail } from '../utils/commons';


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

    constructor(props) {
        super(props);
        this.state = {
            contactInfo: {
                name: '',
                email: '',
                phoneNumber: ''
            },
            contactInfoModalVisible: false,
            emailMessage: ""
        };
    }    

    setContactModalVisible = (visible) => {
        this.setState({ contactInfoModalVisible: visible });
    }

    showContactInfo = () => {
        this.setContactModalVisible(true);
    }

    sendEmailToVolunteer = (volunteer) => {
        postJsonData(global.noticeServiceBaseUrl + '/emails',
            {
                sendTo: volunteer.email,
                message: this.state.emailMessage,
                contactEmail: this.state.contactInfo.email,
                contactPhoneNumber: this.state.contactInfo.phoneNumber
            }).then(response => {
                Alert.alert('', `Mensaje enviado!`);
            }).catch(err => {
                console.log(err);
                alert(err);
            });
    }

    render() {
        const { navigation } = this.props
        const { volunteer } = this.props.route.params

        // Contact modal related logic
        const changeContactModalVisibility = () => this.setContactModalVisible(!this.state.contactInfoModalVisible);
        const changeEmailMessage = (value) => this.setState({ emailMessage: value });
        const changeContactName = (value) => this.setState({ contactInfo: {...this.state.contactInfo, name: value} });
        const changeContactEmail = (value) => this.setState({ contactInfo: {...this.state.contactInfo, email: value} });
        const changeContactPhoneNumber = (value) => this.setState({ contactInfo: {...this.state.contactInfo, phoneNumber: value} });
        const onContactUserPress = () => {
            if (this.state.contactInfo.name == "" || this.state.contactInfo.email == "" || this.state.contactInfo.phoneNumber == "") {
                alert('Ingrese la información de contacto por favor!');
                return;  
            }
            if (!validateEmail(this.state.contactInfo.email)) {
                alert('Ingrese un email válido por favor!');
                return;  
            } 
            if (this.state.emailMessage == "") {
                alert('No podemos mandar un email vacío!');
                return;  
            }
            this.sendEmailToVolunteer(volunteer)
            this.setState({ 
                contactInfo: {
                    name: '',
                    email: '',
                    phoneNumber: ''
                },
                emailMessage: ''
            }, () => changeContactModalVisibility());
        }

        const onCancelPress = () => {
            this.setState({ 
                contactInfo: {
                    name: '',
                    email: '',
                    phoneNumber: ''
                },
                emailMessage: ''
            }, () => changeContactModalVisibility());
        }

        return ( <>
            <SafeAreaView
                edges={["top"]}
                style={{ flex: 0, backgroundColor: colors.primary }}/>
            <SafeAreaView
                edges={["left", "right", "bottom"]}
                style={commonStyles.container} >
                <HeaderWithBackArrow headerText={""} backgroundColor={colors.primary} backArrowColor={colors.white} onBackArrowPress={() => navigation.goBack()}/>
                <ContactInfoModal 
                    isVisible={this.state.contactInfoModalVisible}
                    onModalClose={changeContactModalVisibility}
                    name={this.state.contactInfo.name}
                    email={this.state.contactInfo.email}
                    phoneNumber={this.state.contactInfo.phoneNumber}
                    onContactUserPress={onContactUserPress}
                    emailMessage={this.state.emailMessage}
                    onChangeEmailMessage={changeEmailMessage}
                    onChangeName={changeContactName}
                    onChangeEmail={changeContactEmail} 
                    onChangePhoneNumber={changeContactPhoneNumber}
                    onCancelPress={onCancelPress} /> 

                <ProfileDataHeader name={volunteer.name} averageRating={volunteer.averageRating} location={volunteer.location} province={volunteer.province} />

                <ScrollView style={{marginLeft: 20, marginRight: 20}}>
                    <Text style={[styles.titleText, {marginTop: 15}]}>Puede transitar</Text>
                    <PetsToFosterView petTypesToFoster={volunteer.petTypesToFoster} />

                    <Text style={styles.titleText}>Información adicional</Text>
                    <Text style={styles.text}>{volunteer.additionalInformation}</Text>

                    <Text style={styles.titleText}>Tamaño mascota a transitar</Text>
                    {volunteer.petSizesToFoster.map(size => <Text key={size} style={styles.text}>{this.mapPetSizeToLabel(size)}</Text>)}

                    <Text style={styles.titleText}>Disponibilidad</Text>
                    <Text style={styles.text}>{volunteer.available ? "Disponible" : "No disponible"}</Text>

                    <AppButton 
                        buttonText={"Enviar mensaje"} 
                        onPress={this.showContactInfo} 
                        additionalButtonStyles={{ ...styles.button, marginHorizontal: 0, marginTop: 60, marginBottom: 60 }} />
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
    button: {
        backgroundColor: colors.secondary,
        alignSelf: 'stretch',
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
