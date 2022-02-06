import React from "react";
import { getJsonData } from '../../../utils/requests';
import { getSecureStoreValueFor } from '../../../utils/store';
import colors from '../../../config/colors';
import { UserPetGridView } from '../pets/UserPetGridView';

import { Text, TouchableOpacity, StyleSheet, SafeAreaView, View, Image, LogBox } from 'react-native';
LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message

export class ViewUserDetailsScreen extends React.Component {


    constructor(props) {
        super(props);

        this.state = {
            petView: true,
            userData: { },
            pets: []
        }
    }

    updateUserData = (newUserData) => {
        this.setState({ userData: newUserData })
    }

    fetchUserPetsDetails = () => {
        getSecureStoreValueFor('sessionToken').then((sessionToken) => {
            getJsonData(global.noticeServiceBaseUrl + '/users/' + this.props.route.params.userId + '/pets', 
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

                    this.setState({ pets : [...this.state.pets, pet] });
                })
                console.log(`User ${this.state.userData.username} has pets ${JSON.stringify(this.state.pets)}`);

            }).catch(err => {
                console.log(err);
                alert(err)
            });
        });
    };

    componentDidMount() {
        getSecureStoreValueFor('sessionToken').then((sessionToken) => {
            getJsonData(global.noticeServiceBaseUrl + '/users/' + this.props.route.params.userId, 
            {
                'Authorization': 'Basic ' + sessionToken 
            }
            ).then(response => {
                this.setState({ userData : response }, this.fetchUserPetsDetails());
            }).catch(err => {
                console.log(err);
                alert(err)
            });
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


        return (
            <SafeAreaView style={styles.container}>   
                <View style={{flexDirection:'row', alignItems:'stretch', flex: 1}}>
                    <View style={{marginLeft:'7%', flex: 2}}>
                        <Image source={require('../../../assets/adorable-jack-russell-retriever-puppy-portrait.jpg')}  
                                        style={{width: 130, height: 130, borderRadius: 130/2}} />
                    </View>
                    <View style={{flexDirection:'column-reverse', justifyContent:'left', flex: 3}}>
                        <TouchableOpacity 
                            style={[styles.button]}
                            onPress={handleEditProfile}
                        >
                            <Text style={[styles.buttonFont, { color: colors.white }]}>Editar Perfil</Text>
                        </TouchableOpacity>
                        <Text style={{color: colors.darkGery, fontSize:16}}>{this.state.userData.username}</Text>
                        <Text style={{color: colors.darkGery, fontSize:24}}>{this.state.userData.name}</Text>
                    </View>
                </View>
                <View style={styles.bottomContainer}>
                    <View style={styles.toggleButtonContainer}>
                        <TouchableOpacity style={ this.state.petView ? styles.pressedToggleButton : styles.unpressedToggleButton} onPress={handleToggleViewToPets}>
                            <Text style={ this.state.petView ? styles.pressedToggleButtonText : styles.unpressedToggleButtonText }>Mis Mascotas</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={ this.state.petView ? styles.unpressedToggleButton : styles.pressedToggleButton } onPress={handleToggleViewToReports}>
                            <Text style={ this.state.petView ? styles.unpressedToggleButtonText : styles.pressedToggleButtonText }>Mis Reportes</Text>
                        </TouchableOpacity>
                    </View>


                    { this.state.pets.length > 0 ? <UserPetGridView pets={this.state.pets} /> : null }
                                
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
    scrollView: {
        flex: 1,
        width: "100%",
        backgroundColor: colors.white,
        marginHorizontal: 20,
        paddingLeft: "7%",
    },
    buttonFont: {
        fontSize: 16, 
        fontWeight: "bold", 
        alignSelf: "center"
    },
    button: {
        backgroundColor: colors.primary,
        marginTop: "5%", 
        padding: 18, 
        borderRadius: 7, 
        width: "80%", 
        alignSelf: "flex-start"
    },
    bottomContainer: {
        flex: 4, 
        paddingTop: 20, 
        marginTop: 20, 
        marginLeft: "7%", 
        marginRight: "10%",
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
        width: "49%",
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
        width: "48%",
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