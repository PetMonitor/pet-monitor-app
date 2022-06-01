import React from "react";

import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import { getJsonData } from '../../../utils/requests.js';
import { getSecureStoreValueFor } from '../../../utils/store';
import { mapPetTypeToLabel, mapPetSexToLabel, mapPetSizeToLabel, mapPetLifeStageToLabel, } from '../../../utils/mappers';
import { TouchableOpacity, Text, Image, StyleSheet, View, ScrollView, FlatList, Dimensions } from 'react-native';
import { PencilSimple } from 'phosphor-react-native';

import colors from '../../../config/colors';

const { height, width } = Dimensions.get("screen")

export class ViewPetDetailsScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            petId: this.props.route.params.petId,
            name: '',
            petPhotos: [],
            sex: '',
            petType: '',
            furColor: '',
            breed: '',
            size: '',
            lifeStage: '',
            petDescription: '',
        };
    }

    renderPet = ({item}) => {
        return (
            <Image key={'img_' + item.photoId} resizeMode="cover" style={{aspectRatio: 1, height: height/3.5, borderRadius: 5, marginRight: 5}} source={{ uri: global.noticeServiceBaseUrl + '/photos/' + item.photoId }}/>
        )
    }

    onPetDataUpdated = (updatedPetData) => {
        this.setState({
            ...updatedPetData
        });
    };

    editPetsDetails = () => {
        this.props.navigation.push('EditPetDetails', { 
            petData: this.state, 
            userId: this.props.route.params.userId, 
            onUpdate: this.onPetDataUpdated
        })
    }

    componentDidMount() {
        getSecureStoreValueFor('sessionToken').then((sessionToken) => {
            getJsonData(global.noticeServiceBaseUrl + '/users/' + this.props.route.params.userId + '/pets/' + this.props.route.params.petId, 
            {
                'Authorization': 'Basic ' + sessionToken 
            }
            ).then(responsePet => {
                console.log(responsePet)
                this.setState({ 
                    name : responsePet.name,
                    petPhotos: responsePet.photos,
                    sex: responsePet.sex,
                    petType: responsePet.type,
                    furColor: responsePet.furColor,
                    breed: responsePet.breed,
                    size: responsePet.size,
                    lifeStage: responsePet.lifeStage,
                    petDescription: responsePet.description,
                });
                
            }).catch(err => {
                console.log(err);
                alert(err)
            });
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={{flex: 1, justifyContent: 'flex-end'}}>
                    <FlatList 
                        data={this.state.petPhotos} 
                        horizontal={true}
                        keyExtractor={(_, index) => index.toString()}
                        initialNumToRender={this.state.petPhotos.length}
                        renderItem={this.renderPet}
                    />
                    <View style={{width: width, backgroundColor: colors.semiTransparent, position: 'absolute', height: 30, justifyContent: 'center'}}>
                        <Text style={{paddingLeft: 35, fontSize: 24, fontWeight: 'bold', color: colors.clearBlack}}>{this.state.name}</Text>
                    </View>    
                </View>
                <View style={{flex: 2}}>
                    <ScrollView style={{flex:1, paddingLeft: 35, paddingRight: 35}}>
                        <View style={{flexDirection: 'row' }}>
                            <Text style={[styles.optionTitle, {fontSize: 20, fontWeight: 'bold', paddingTop: 25}]}>Información</Text>
                            <TouchableOpacity onPress={() => this.editPetsDetails()} style={{paddingLeft:10, paddingRight:10, paddingTop:15}}>
                                <PencilSimple  color={colors.yellow} size={32} weight={'fill'} />
                            </TouchableOpacity>
                        </View>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <View style={{flexDirection: 'column', flex: 0.5}}>
                                <Text style={styles.optionTitle}>Tipo</Text>
                                <Text style={styles.textInput}>{mapPetTypeToLabel(this.state.petType)}</Text>
                                <Text style={styles.optionTitle}>Sexo</Text>
                                <Text style={styles.textInput}>{mapPetSexToLabel(this.state.sex)}</Text>
                                <Text style={styles.optionTitle}>Tamaño</Text>
                                <Text style={styles.textInput}>{mapPetSizeToLabel(this.state.size)}</Text>
                        
                            </View>
                            <View style={{flexDirection: 'column', flex: 0.5}}>
                                <Text style={styles.optionTitle}>Raza</Text>
                                <Text style={styles.textInput}>{this.state.breed}</Text>
                                <Text style={styles.optionTitle}>Color pelaje</Text>
                                <Text style={styles.textInput}>{this.state.furColor}</Text>
                                <Text style={styles.optionTitle}>Etapa</Text>
                                <Text style={styles.textInput}>{mapPetLifeStageToLabel(this.state.lifeStage)}</Text>
                            </View>
                        </View>

                        <Text style={styles.optionTitle}>Descripción</Text>
                        <Text style={styles.textInput}>{this.state.petDescription}</Text>
                    </ScrollView>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.white,
      flexDirection: 'column', // main axis: vertical
      paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    optionTitle: {
        fontSize: 16, 
        color: colors.clearBlack,
        paddingTop: 20, 
        fontWeight: 'bold'
    },
    textInput: {
        paddingTop: 10, 
        color: colors.clearBlack, 
        fontSize: 16, 
    },
  });
