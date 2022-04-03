import React from 'react';

import { Text, SafeAreaView, StyleSheet, View, FlatList, TouchableOpacity, Image, Dimensions } from 'react-native';
import { getJsonData } from '../utils/requests.js';
import { getSecureStoreValueFor } from '../utils/store';
import { Buffer } from 'buffer'

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

import colors from '../config/colors';

const { height, width } = Dimensions.get("screen")

/** Implements the Face Recognition results screen. */
export class FaceRecognitionResultsScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            notices: [],
            selectedIndex: 0,
            isLoading: true
        };
    }

    renderPet = (item) =>  {
        return (
            <TouchableOpacity onPress={() => console.log(item)}>
                <Image style={{height: 100, width: 100, borderRadius: 5, margin: 5}}
                        source={require('../assets/adorable-jack-russell-retriever-puppy-portrait.jpg')}
                />
            </TouchableOpacity>
        )
    }

    navigateToReportView = (userId, noticeId) => {
        this.props.navigation.push('ReportView', { userId: userId, noticeId: noticeId, isMyReport: false });
    }

    renderItem = ({item}) =>  {
        return (
            <TouchableOpacity onPress={() => this.navigateToReportView(item.userId, item.noticeId)}>
                <Image style={{height: (width - 50) / 2, width:  (width - 50) / 2, borderRadius: 5, margin: 5}}
                        source={{uri:`data:image/png;base64,${Buffer.from(item.pet.photo).toString('base64')}`}}
                />
                <Text style={{fontSize: 16, fontWeight: 'bold', color: this.getReportColorFromType(item.noticeType), paddingLeft: 7, paddingBottom: 20}}>{this.mapReportTypeToLabel(item.noticeType)}</Text> 
            </TouchableOpacity>
        )
    }

    mapReportTypeToLabel = type => {
        type = type.toLowerCase();
        if (type == "lost" || type == "stolen") {
            return "Perdido";
        }
        if (type == "found") {
            return "Encontrado";
        }
        if (type == "for_adoption") {
            return "En adopción";
        }
    }

    getReportColorFromType = type => {
        type = type.toLowerCase();
        if (type == "lost" || type == "stolen") {
            return colors.pink;
        }
        if (type == "found") {
            return colors.primary;
        }
        if (type == "for_adoption") {
            return colors.secondary;
        }
    }

    componentDidMount() {
        getSecureStoreValueFor('sessionToken').then((sessionToken) => {
            // TODO: change it to similar-pets request
            getJsonData(global.noticeServiceBaseUrl + '/notices', 
            {
                'Authorization': 'Basic ' + sessionToken 
            }
            ).then(response => {
                console.log(response);
                this.setState({ notices : response });
            }).catch(err => {
                console.log(err);
                alert(err)
            }).finally(() => this.setState({ isLoading : false }));
        });
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                 <View style={{justifyContent: 'center', alignItems: 'flex-start', marginBottom: 20, backgroundColor: colors.primary}}>
                    <Icon
                        name='arrow-left'
                        size={33}
                        color={colors.white}
                        style={{marginLeft: 10, paddingTop: 30, paddingBottom: 15}}
                        onPress={() => this.props.navigation.goBack()} />
                    <Text style={{fontSize: 24, fontWeight: 'bold', marginLeft: 60, color: colors.white, paddingTop: 10, position: 'absolute'}}>Resultados</Text>

                </View>
                <View style={styles.alignedContent}>
                    <Text style={styles.titleText}>Mascotas similares</Text>
                    <MaterialIcon name='notifications' size={24} color={colors.secondary} style={{marginLeft: 5}}/>
                </View>

                <FlatList 
                    data={this.state.notices} 
                    numColumns={2}
                    keyExtractor={(_, index) => index.toString()}
                    initialNumToRender={this.state.notices.length}
                    renderItem={this.renderItem}
                    style={{margin: 20}}
                />
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        flexDirection: 'column',    // main axis: vertical
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    titleText: {
        color: colors.clearBlack, 
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 5,
        marginLeft: 20
    },
    alignedContent: {
        alignItems:'center', 
        flexDirection: 'row', 
        marginTop: 10
    },
});
