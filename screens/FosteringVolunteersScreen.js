import React from 'react';
import { Text, StyleSheet, View, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

import commonStyles from '../utils/styles';
import colors from '../config/colors';
import { AppButton } from '../utils/buttons';
import { Rating } from '../utils/ratings';

import { getSecureStoreValueFor } from '../utils/store';
import { getJsonData } from '../utils/requests'

const { height, width } = Dimensions.get("screen")

/** Implements the screen that lists all the volunteers for fostering pets. */
export class FosteringVolunteersScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            volunteers: [],
            myVolunteerProfile: null,
            isLoading: true
            // volunteers: [{name: "Ingrid Lopez", canFoster: ["DOG", "CAT"], location: "Barracas", stars: 5}, {name: "Gabriel Ramirez", canFoster: ["DOG"], location: "Cordoba", stars: 3}, {name: "Juan Perez", canFoster: ["DOG", "CAT"], location: "La Plata", stars: 4}, {name: "Maria Gomez", canFoster: ["CAT"], location: "Belgrano", stars: 1}, {name: "Gabriel Ramirez", canFoster: ["DOG"], location: "Cordoba", stars: 3}]
        };
    }

    petFosteringMapper = (petTypesToFoster) => {
        if (petTypesToFoster.length == 1) {
            return this.petMapper(petTypesToFoster[0]);
        } else if (petTypesToFoster.includes("DOG") && petTypesToFoster.includes("CAT")) {
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

    showVolunteerData = ({item}) => {
        const dividerLine = <View style={{
            marginTop: 10,
            borderBottomColor: colors.secondary,
            borderBottomWidth: 2,
        }} />;
        return (
            <TouchableOpacity style={styles.volunteerBox} onPress={() => this.navigateToVolunteerProfileView(item)}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 15}}>
                    <Text style={[styles.text, {fontWeight: 'bold'}]}>{item.name}</Text>
                    <Rating starCount={item.averageRating} />
                </View>
                {dividerLine}
                <Text style={[styles.text, {marginTop: 10}]}>Puede transitar <Text style={{fontWeight: 'bold'}}>{this.petFosteringMapper(item.petTypesToFoster)}</Text></Text>
                <View style={{flexDirection: 'row', marginTop: 10, marginBottom: 15}}>
                    <MaterialIcon name='location-on' size={20} color={colors.secondary}/><Text style={[styles.text, {fontWeight: 'bold'}]}>{item.location + ', ' + item.province}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    navigateToVolunteerProfileView = (volunteerInfo) => {
        this.props.navigation.push('FosteringVolunteerProfile', { volunteer: volunteerInfo }); 
    }

    updateMyProfile = profile => {
        this.setState({ myVolunteerProfile: profile });
    }

    navigateToSettingsView = (myVolunteerProfile) => {
        this.props.navigation.push('FosteringVolunteerProfileSettings', { 
            myVolunteerProfile: myVolunteerProfile,
            updateProfiles: this.updateMyProfile 
        });
    }

    componentDidMount() {
        this.fetchFosterVolunteerProfiles()
    }

    fetchFosterVolunteerProfiles() {
        getSecureStoreValueFor('sessionToken').then((sessionToken) => {
            getSecureStoreValueFor("userId").then(userId => {
                getJsonData(global.noticeServiceBaseUrl + '/fosterVolunteerProfiles?available=true', { 'Authorization': 'Basic ' + sessionToken }
                ).then(profilesInfo => {
                    let volunteers = []
                    let promises = []
                    let myVolunteerProfile = null
                    for (let i = 0; i < profilesInfo.length; i++) {
                        promises.push(getJsonData(global.noticeServiceBaseUrl + '/users/' + profilesInfo[i].userId + '/contactInfo'
                        ).then(userInfo => {
                            let volunteerInfo = {
                                ...profilesInfo[i],
                                name: userInfo.name,
                                email: userInfo.email,
                                phoneNumber: userInfo.phoneNumber
                            }
                            if (userId === userInfo.userId) {
                                myVolunteerProfile = volunteerInfo
                            } else {
                                volunteers.push(volunteerInfo)
                            }
                        }).catch(err => {
                            console.log(err);
                            alert(err);
                        }))
                    }
                    Promise.all(promises)
                    .then(() => this.setState({ volunteers: volunteers, myVolunteerProfile: myVolunteerProfile }))
                    .catch(err => {
                        console.log(err);
                        alert(err);
                    }).finally(() => this.setState({ isLoading: false }));
                }).catch(err => {
                    console.log(err);
                    alert(err);
                });
            });
        });
    }

    render() {
        if (this.state.isLoading) {
            return null;
        }
        return (
            <View style={commonStyles.container}> 
                {this.state.volunteers.length == 0 ? 
                    <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
                        <Text style={{paddingLeft: 20, paddingRight: 20, fontSize: 16, color: colors.secondary, fontWeight: '500'}}>No hay voluntarios para transitar mascotas por el momento. Volvé a consultar en un rato!</Text>
                    </View> : 
                    <FlatList 
                        data={this.state.volunteers}
                        keyExtractor={(_, index) => index.toString()}
                        initialNumToRender={this.state.volunteers.length}
                        renderItem={this.showVolunteerData}
                        style={{marginLeft: 30, marginTop: 10, marginRight: 30}}

                    />
                }
                <AppButton
                        buttonText={this.state.myVolunteerProfile ? "Editar mi información" : "Quiero sumarme como voluntario"} 
                        onPress={() => this.navigateToSettingsView(this.state.myVolunteerProfile)} 
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
        paddingLeft: 10,
        paddingRight: 10,
    },
});
