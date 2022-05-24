import React from "react";
import colors from '../../../config/colors';
import Icon from 'react-native-vector-icons/AntDesign';
import { getSecureStoreValueFor } from '../../../utils/store';
import { getJsonData } from '../../../utils/requests.js';

import { Text, TouchableOpacity, View, Image, StyleSheet, FlatList, Dimensions } from 'react-native';

const { height, width } = Dimensions.get("screen")

export class UserPetGridView extends React.Component {

    constructor(props) {
        super(props);
        console.log(`PROPS FOR GRID ARE ${JSON.stringify(this.props)}`)


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
            <View style={styles.container}>
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
    container: {
        flex: 1,
        backgroundColor: 'white',
        flexDirection: 'column',    // main axis: vertical
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    }
});
