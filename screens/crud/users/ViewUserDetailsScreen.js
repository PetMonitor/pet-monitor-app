import React, { Component } from "react";

import { Text, TouchableOpacity, StyleSheet, SafeAreaView, View, Image, LogBox } from 'react-native';
import * as FileSystem from 'expo-file-system';

import { UserPetGridView } from '../pets/UserPetGridView';
import { UserReportGridView } from "../reports/UserReportGridView";

import { getJsonData } from '../../../utils/requests';
import { getSecureStoreValueFor } from '../../../utils/store';

import commonStyles from '../../../utils/styles';
import colors from '../../../config/colors';
import { AppButton } from "../../../utils/buttons";

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
            facebookLogin: false,
            mounted: false
        }
    }

    updateUserData = (newUserData) => {
        this.setState({ userData: newUserData, userProfilePictureUrl: undefined}, () => this.fetchProfilePicture());     
    }

    fetchUserDetails = async (sessionToken, userId) => {
        getJsonData(global.noticeServiceBaseUrl + '/users/' + userId + '/pets', 
        {
            'Authorization': 'Basic ' + sessionToken 
        }).then(response => {
            this.fetchUserPetsDetails(response);
            this.fetchUserReportsDetails(sessionToken, userId)
        }).catch(err => {
            console.log(err);
            alert(err);
            this.props.navigation.popToTop();
        });
    };

    fetchProfilePicture = () => {
        FileSystem.downloadAsync(
            global.noticeServiceBaseUrl + '/photos/profile/' + this.state.userData.userId, 
            FileSystem.documentDirectory + global.PROFILE_PIC_TMP_FILE
        ).then(response => {
            if (response.status == 200) {
                this.setState({ userProfilePictureUrl: FileSystem.documentDirectory + global.PROFILE_PIC_TMP_FILE });
                console.log(`SETTING USER PROFILE PICTURE URL TO ${this.state.userProfilePictureUrl}`)
            }
        
            this.setState({ mounted : true })
        }).catch(error => {
            console.log(`No profile picture found ${error}`)
        })
    }

    fetchUserReportsDetails = (sessionToken, userId) => {
        getJsonData(global.noticeServiceBaseUrl + '/users/' + userId + '/notices', 
        {
            'Authorization': 'Basic ' + sessionToken 
        }).then(response => {

            const reports = response.map(r => {
                return { 
                    key: r.noticeId,
                    id: r.noticeId, 
                    petId: r.pet.id,
                    photoId: this.state.photoByPet[r.pet.id], 
                    reportType: r.noticeType 
                };
            })

            this.setState({ reports : reports });

        }).catch(err => {
            console.log(err);
            alert(err)
        });
    };

    async fetchUserPetsDetails(response) {
        const pets = response.map(r => {
            return {
                key: r.petId,
                id: r.petId,
                photoId: r.photos[0].photoId,
                name: r.name
            };
        });

        photoByPetMap = {} 

        pets.forEach(pet => {
            photoByPetMap[pet.id] = pet.photoId
        });

        this.setState({ pets: pets, photoByPet: photoByPetMap });
    }

    fetchUserData = () => {
        getSecureStoreValueFor('sessionToken').then((sessionToken) => {
            getSecureStoreValueFor("userId").then(userId => {
                getJsonData(global.noticeServiceBaseUrl + '/users/' + userId, 
                {
                    'Authorization': 'Basic ' + sessionToken 
                }
                ).then(response => {
                    this.setState({ userData : response });
                    this.fetchUserDetails(sessionToken, userId);
                    this.fetchProfilePicture();
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

    componentDidMount() {
        this.fetchUserData();
    }

    onReportDeleted = (deletedNoticeId) => {
        const remainingNotices = this.state.reports.filter(report => report.id != deletedNoticeId)
        this.setState({ reports: remainingNotices })
    }

    onReportCreated = () => {
        getSecureStoreValueFor('sessionToken').then((sessionToken) => {
            getSecureStoreValueFor("userId").then(userId => {
                this.fetchUserDetails(sessionToken, userId);
            })
        })
    }

    onPetDeleted = (deletedPetId) => {
        const remainingPets = this.state.pets.filter(pet => pet.id != deletedPetId);
        const remainingNotices = this.state.reports.filter(report => report.petId != deletedPetId);
        delete this.state.photoByPet[deletedPetId]

        this.setState({ reports: remainingNotices, pets: remainingPets })
    }

    onPetCreated = () => {
        getSecureStoreValueFor('sessionToken').then((sessionToken) => {
            getSecureStoreValueFor("userId").then(userId => {
                this.fetchUserDetails(sessionToken, userId);
            })
        })
    }

    onReportCreated = () => {
        getSecureStoreValueFor('sessionToken').then((sessionToken) => {
            getSecureStoreValueFor("userId").then(userId => {
                this.fetchUserDetails(sessionToken, userId);
            })
        })
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
            navigation.push('EditUserScreen', { userData: {...this.state.userData, userProfilePictureUrl: this.state.userProfilePictureUrl} , updateUser: this.updateUserData });
        }

        let profilePictureSource = require('../../../assets/adorable-jack-russell-retriever-puppy-portrait.jpg')

        if (this.state.userProfilePictureUrl) {
            profilePictureSource = { uri: `${this.state.userProfilePictureUrl}` }
        }

        const dividerLine = <View style={{
            marginTop: 25,
            borderBottomColor: colors.lightGrey,
            borderBottomWidth: 1,
        }} />;

        return (
            <SafeAreaView style={commonStyles.container}>   
                <View style={{flexDirection:'row', alignItems:'stretch', flex: 1, marginTop: 15}}>
                    <View style={{marginLeft: 30, flex: 2}}>
                        <Image source={profilePictureSource} style={{width:130, height:130, borderRadius:130/2}}/>
                    </View>
                    <View style={{flexDirection:'column-reverse', justifyContent:'left', flex: 3, marginLeft: 20}}>
                        { this.state.facebookLogin ? 
                            null :
                            <AppButton
                                buttonText={"Editar perfil"} 
                                onPress={handleEditProfile} 
                                additionalButtonStyles={styles.button} /> 
                        }
                        <Text style={{color: colors.clearBlack, fontSize: 16}}>{this.state.userData.username}</Text>
                        <Text style={{color: colors.clearBlack, fontSize: 24, marginBottom: 5, fontWeight: '500'}}>{this.state.userData.name ? this.state.userData.name : this.state.userData.username}</Text>
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
                        ? <UserPetGridView userId={this.state.userData.userId} pets={this.state.pets} onPetDeleted={this.onPetDeleted} onPetCreated={this.onPetCreated} navigation={navigation} /> 
                        : <UserReportGridView userId={this.state.userData.userId} reports={this.state.reports} onReportCreated={this.onReportCreated} onReportDeleted={this.onReportDeleted} navigation={navigation}/> }
                                
                </View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: colors.primary,
        margin: 0,
        marginTop: "5%", 
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