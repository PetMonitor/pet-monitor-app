import React from "react";

import { Text, TouchableOpacity, View, Image, StyleSheet, FlatList, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';

import { getSecureStoreValueFor } from '../../../utils/store';
import { getJsonData } from '../../../utils/requests.js';

import commonStyles from '../../../utils/styles';
import colors from '../../../config/colors';

const { height, width } = Dimensions.get("screen")

export class UserPetGridView extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            userId: this.props.userId,
            pets: this.props.pets
        }
    }

    fetchUserPetsDetails = () => {
        getSecureStoreValueFor('sessionToken').then((sessionToken) => {
            getSecureStoreValueFor("userId").then(userId => {
                getJsonData(global.noticeServiceBaseUrl + '/users/' + userId + '/pets', 
                    {
                        'Authorization': 'Basic ' + sessionToken 
                    }).then(response => {
                        var petList = response.map(r => {
                            return { 
                                key: r.petId,
                                id: r.petId, 
                                photoId: r.photos[0].photoId, 
                                name: r.name 
                            };
                        });

                        this.setState({ pets: petList });
                    }).catch(err => {
                        console.log(err);
                        alert(err);
                        this.props.navigation.popToTop();
                });
            });
        });
    };

    componentDidMount() {
        //TODO: works but if commented out it won't load pets from props
        console.log("Running componentDidMount in UserPetGridView")
        this.fetchUserPetsDetails()
    }


    render() {

        const { navigation } = this.props;

        const handleNavigateToPetProfile = (petId) => {
            navigation.push('ViewPet', { userId: this.props.userId, petId: petId });
        }

        const handleCreateNewPet = () => {
            navigation.push('CreatePet', { 
                initialSetup: false,
                onGoBack: () => this.fetchUserPetsDetails()
            });
        }

        const renderPet = ({item}) => {
            if (item.action == "add-pet") {
                return (
                    <TouchableOpacity onPress={handleCreateNewPet} >
                    <Icon
                        style={{margin: 10, padding: 10}}
                        size={120}
                        name="plus"
                        backgroundColor={colors.white}
                        color={colors.secondary}
                    />
                    </TouchableOpacity>

                )
            } else {
                return (                    
                    <TouchableOpacity onPress={() => handleNavigateToPetProfile(item.id)} >
                        <Image key={'img_' + item.photoId} resizeMode="cover" 
                        style={{aspectRatio: 1, height: (width - 70) / 2, borderRadius: 5, marginHorizontal: 3, marginVertical: 5}} 
                        source={{ uri: global.noticeServiceBaseUrl + '/photos/' + item.photoId }}/>
                        <Text key={'text_' + item.id} style={styles.text}>{item.name}</Text>
                    </TouchableOpacity>
                )
            }
        }
        
        return(
            <View style={commonStyles.container}>
                {this.state.pets.length == 0 ? <Text style={{fontSize: 15, fontWeight: '500', color: colors.secondary, marginTop: 20}}>Podés crear un perfil para tus mascotas.</Text> : null}
                <FlatList 
                    data={[...this.state.pets, {action: "add-pet"}]} 
                    numColumns={2}
                    keyExtractor={(_, index) => index.toString()}
                    initialNumToRender={this.state.pets.length + 1}
                    renderItem={renderPet}
                    style={{marginTop: 10}}

                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    text: {
        color: colors.secondary,
        fontWeight: "bold",
        fontSize: 16,
        paddingLeft: 7, 
        paddingBottom: 20
    },
});
