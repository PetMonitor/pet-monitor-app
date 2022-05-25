import React, { Component } from "react";
import * as FileSystem from 'expo-file-system';

import { getJsonData } from '../../../utils/requests';
import { getSecureStoreValueFor } from '../../../utils/store';
import colors from '../../../config/colors';
import { UserPetGridView } from '../pets/UserPetGridView';

import { Text, TouchableOpacity, StyleSheet, SafeAreaView, View, Image, LogBox } from 'react-native';
import { UserReportGridView } from "../reports/UserReportGridView";
LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message

export class ViewUserDetailsScreen extends Component {


    constructor(props) {
        super(props);

        this.state = {
            petView: true,
            userData: { },
            userProfilePictureUrl: undefined, 
            pets: [],
            reports: [],
            photoByPet: {},
            facebookLogin: false
        }
    }

    updateUserData = (newUserData) => {
        this.setState({ userData: newUserData })
    }

    fetchUserPetsDetails = () => {
        getSecureStoreValueFor('sessionToken').then((sessionToken) => {
            getSecureStoreValueFor("userId").then(userId => {
                getJsonData(global.noticeServiceBaseUrl + '/users/' + userId + '/pets', 
                {
                    'Authorization': 'Basic ' + sessionToken 
                }).then(response => {
                    response.map(async r => {
                        const pet = { 
                            key: r.petId,
                            id: r.petId, 
                            photoId: r.photos[0].photoId, 
                            name: r.name 
                        };
                        this.setState({ 
                            pets: [...this.state.pets, pet],
                            photoByPet: {
                                ...this.state.photoByPet,
                                [pet.id]: pet.photoId
                            }
                        });
                    })
                    this.fetchUserReportsDetails()
                    // console.log(`User ${this.state.userData.username} has pets ${JSON.stringify(this.state.pets)}`);
                }).catch(err => {
                    console.log(err);
                    alert(err);
                    this.props.navigation.popToTop();
                });
            });
        });
    };

    fetchUserReportsDetails = () => {
        getSecureStoreValueFor('sessionToken').then((sessionToken) => {
            getSecureStoreValueFor("userId").then(userId => {
                getJsonData(global.noticeServiceBaseUrl + '/users/' + userId + '/notices', 
                {
                    'Authorization': 'Basic ' + sessionToken 
                }).then(response => {
                    response.map(async r => {
                        const report = { 
                            key: r.noticeId,
                            id: r.noticeId, 
                            photoId: this.state.photoByPet[r.pet.id], 
                            reportType: r.noticeType 
                        };
                        this.setState({ reports : [...this.state.reports, report] });
                    })
                }).catch(err => {
                    console.log(err);
                    alert(err)
                });
            });
        });
    };

    componentDidMount() {
        getSecureStoreValueFor('sessionToken').then((sessionToken) => {
            getSecureStoreValueFor("userId").then(userId => {
                getJsonData(global.noticeServiceBaseUrl + '/users/' + userId, 
                {
                    'Authorization': 'Basic ' + sessionToken 
                }
                ).then(response => {
                    this.setState({ userData : response });
                    this.fetchUserPetsDetails();

                    FileSystem.downloadAsync(
                        global.noticeServiceBaseUrl + '/photos/profile/' + this.state.userData.userId, 
                        FileSystem.documentDirectory + global.PROFILE_PIC_TMP_FILE
                    ).then(response => {

                        if (response.status == 200) {
                            this.setState({ userProfilePictureUrl : FileSystem.documentDirectory + global.PROFILE_PIC_TMP_FILE });
                            console.log(`SETTING USER PROFILE PICTURE URL TO ${this.state.userProfilePictureUrl}`)
                        }
                    
                    }).catch(error => {
                        console.log(`No profile picture found ${error}`)
                    })

                }).catch(err => {
                    console.log(err);
                    alert(err)
                });
            });
        });

        getSecureStoreValueFor('facebookToken').then(facebookToken => {
            this.setState({ facebookLogin : facebookToken != null })
        });
        
    }

    render() {

        const { navigation } = this.props;

        const handleToggleViewToPets = () => {
            if (this.state.petView) {
                return;
            }

            this.setState({ petView: true });
            // change view
            return; 
        }

        const handleToggleViewToReports = () => {
            if (!this.state.petView) {
                return;
            }

            // change view
            this.setState({ petView: false });
        };
        
        const handleEditProfile = () => {
            navigation.push('EditUserScreen', { userData: this.state.userData , updateUser: this.updateUserData });
        }

        let profilePicture = <Image source={require('../../../assets/adorable-jack-russell-retriever-puppy-portrait.jpg')} style={{width:130, height:130, borderRadius:130/2}} />

        if (this.state.userProfilePictureUrl) {
            profilePicture = <Image source={{ uri: `${this.state.userProfilePictureUrl}` }} style={{width:130, height:130, borderRadius:130/2}}/>
        }

        const dividerLine = <View style={{
            marginTop: 25,
            borderBottomColor: colors.lightGrey,
            borderBottomWidth: 1,
        }} />;
        
        return (
            <SafeAreaView style={styles.container}>   
                <View style={{flexDirection:'row', alignItems:'stretch', flex: 1, marginTop: 15}}>
                    <View style={{marginLeft: 30, flex: 2}}>
                        {profilePicture}
                    </View>
                    <View style={{flexDirection:'column-reverse', justifyContent:'left', flex: 3, marginLeft: 20}}>
                        { this.state.facebookLogin ? 
                            null :
                            <TouchableOpacity style={[styles.button]} onPress={handleEditProfile}> 
                            	<Text style={styles.buttonFont}>Editar perfil</Text> 
                            </TouchableOpacity>
                        }
                        <Text style={{color: colors.clearBlack, fontSize: 16}}>{this.state.userData.username}</Text>
                        <Text style={{color: colors.clearBlack, fontSize: 24, marginBottom: 5, fontWeight: '500'}}>{this.state.userData.name}</Text>
                    </View>
                </View>
                {dividerLine}
                <View style={styles.bottomContainer}>
                    <View style={styles.toggleButtonContainer}>
                        <TouchableOpacity style={ this.state.petView ? styles.pressedToggleButton : styles.unpressedToggleButton} onPress={handleToggleViewToPets}>
                            <Text style={ this.state.petView ? styles.pressedToggleButtonText : styles.unpressedToggleButtonText }>Mis mascotas</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={ this.state.petView ? styles.unpressedToggleButton : styles.pressedToggleButton } onPress={handleToggleViewToReports}>
                            <Text style={ this.state.petView ? styles.unpressedToggleButtonText : styles.pressedToggleButtonText }>Mis reportes</Text>
                        </TouchableOpacity>
                    </View>
                    { this.state.petView 
                        ? <UserPetGridView userId={this.state.userData.userId} pets={this.state.pets} navigation={navigation}/> 
                        : <UserReportGridView userId={this.state.userData.userId} reports={this.state.reports} navigation={navigation}/> }
                                
                </View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
        flexDirection: "column", // main axis: vertical
    },
    buttonFont: {
        fontSize: 16, 
        fontWeight: '500', 
        alignSelf: 'center',
        color: colors.white
    },
    button: {
        backgroundColor: colors.primary,
        marginTop: "5%", 
        padding: 18, 
        borderRadius: 7, 
        marginRight: 30,
        alignSelf: 'stretch'
    },
    bottomContainer: {
        flex: 4, 
        marginTop: 20, 
        marginLeft: 30, 
        marginRight: 30,
        flexDirection: "column", 
        justifyContent: "flex-start"
    },
    toggleButtonContainer: {
        borderRadius: 5,
        width: "100%",
        height: "10%",
        flexDirection: "row",
        backgroundColor: colors.lightGrey,
        alignItems:"center"
    },
    pressedToggleButton: {
        width: "50%",
        height:"95%",
        borderRadius: 5,
        borderColor: colors.lightGrey,
        borderWidth: 1,
        backgroundColor: colors.white,
        justifyContent: 'center',
        alignItems: 'center',
        shadowOpacity: 0.1
    },
    pressedToggleButtonText: {
        color: colors.primary, 
        fontWeight: "bold",
    },
    unpressedToggleButton: {
        width: "50%",
        height:"95%",
        borderRadius: 5,
        backgroundColor: colors.lightGrey,
        justifyContent: 'center',
        alignItems: 'center',
    },
    unpressedToggleButtonText: {
        color: colors.grey, 
        fontWeight:'bold'
    }
})