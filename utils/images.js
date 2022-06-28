import React from 'react';

import { StyleSheet, FlatList, Text, View, Dimensions, Image, TouchableOpacity } from 'react-native';
import { Buffer } from 'buffer'

import { mapReportTypeToLabel, mapReportTypeToLabelColor, } from '../utils/mappers';

import colors from '../config/colors';

const { height, width } = Dimensions.get("screen")

export const PetImagesHeader = ({petPhotos, petName}) => {
    return (
        <View style={{flex: 1, justifyContent: 'flex-end'}}>
            <FlatList 
                data={petPhotos} 
                horizontal={true}
                keyExtractor={(_, index) => index.toString()}
                initialNumToRender={petPhotos.length}
                renderItem={renderPet}
            />
            {petName && petName != "" ?
            <View style={{width: width, backgroundColor: colors.semiTransparent, position: 'absolute', height: 30, justifyContent: 'center'}}>
                <Text style={{paddingLeft: 35, fontSize: 24, fontWeight: 'bold', color: colors.clearBlack}}>{petName}</Text>
            </View> : <></>}
        </View>
    );
}

export const ReportImagesList = ({notices, onItemPress, withLabel, loadMoreData}) => {
    return (
        <View style={{flex: 1}}>
            <FlatList 
                data={notices} 
                numColumns={2}
                keyExtractor={(_, index) => index.toString()}
                initialNumToRender={notices.length}
                renderItem={(item) => renderReportItem(item, onItemPress, withLabel)}
                onEndReachedThreshold={0}
                onEndReached={loadMoreData}
            />
        </View>
    );
}

function renderPet({item}) {
    return (
        <Image key={'img_' + item.photoId} resizeMode="cover" style={{aspectRatio: 1, height: height/3.5, borderRadius: 5, marginRight: 5}} source={{ uri: global.noticeServiceBaseUrl + '/photos/' + item.photoId }}/>
    )
}

function renderReportItem({item}, onItemPress, withLabel) {
    return (
        <TouchableOpacity onPress={() => onItemPress(item)}>
            <Image style={{height: (width - 20) / 2, width:  (width - 20) / 2, borderRadius: 5, margin: 5}}
                    source={{uri:`data:image/png;base64,${Buffer.from(item.pet.photo).toString('base64')}`}}
            />
            {withLabel ? 
                <Text style={{fontSize: 16, fontWeight: 'bold', color: mapReportTypeToLabelColor(item.noticeType), paddingLeft: 7, paddingBottom: 20}}>{mapReportTypeToLabel(item.noticeType)}</Text> : null }
        </TouchableOpacity>
    )
}

