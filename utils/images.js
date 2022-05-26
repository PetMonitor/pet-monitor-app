import React from 'react';

import { StyleSheet, FlatList, Text, View, Dimensions, Image } from 'react-native';

import colors from '../config/colors';

const { height, width } = Dimensions.get("screen")

export function showPetImagesHeader(petPhotos, petName) {
    return <View style={{flex: 1, justifyContent: 'flex-end'}}>
        <FlatList 
            data={petPhotos} 
            horizontal={true}
            keyExtractor={(_, index) => index.toString()}
            initialNumToRender={petPhotos.length}
            renderItem={renderPet}
        />
        <View style={{width: width, backgroundColor: colors.semiTransparent, position: 'absolute', height: 30, justifyContent: 'center'}}>
            <Text style={{paddingLeft: 35, fontSize: 24, fontWeight: 'bold', color: colors.clearBlack}}>{petName}</Text>
        </View>    
    </View>
}

function renderPet({item}) {
    return (
        <Image key={'img_' + item.photoId} resizeMode="cover" style={{aspectRatio: 1, height: height/3.5, borderRadius: 5, marginRight: 5}} source={{ uri: global.noticeServiceBaseUrl + '/photos/' + item.photoId }}/>
    )
}

const styles = StyleSheet.create({
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
    button: {
        backgroundColor: colors.secondary,
        marginTop: 10,
        padding: 18, 
        borderRadius: 7, 
    },
    buttonFont: {
        fontSize: 16, 
        fontWeight: '500', 
        alignSelf: 'center',
        color: colors.white
    },
    modalView: {
        margin: 20,
        backgroundColor: colors.white,
        borderRadius: 20,
        padding: 35,
        shadowColor: colors.clearBlack,
        shadowOffset: {
        width: 0,
        height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    modalTitle: {
        marginBottom: 15,
        color: colors.secondary,
        fontWeight: 'bold',
        fontSize: 18,
        textAlign: "center"
    },
    modalText: {
      marginBottom: 15,
      color: colors.clearBlack
    }
});
