import React from 'react';

import { Text, StyleSheet, View, FlatList, TouchableOpacity, Image, Dimensions, Modal } from 'react-native';
import { getJsonData } from '../utils/requests.js';
import { getSecureStoreValueFor } from '../utils/store';
import { Buffer } from 'buffer'
import { mapReportTypeToLabel, mapReportTypeToLabelColor } from '../utils/mappers';

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
            isLoading: true,
            checksSettingsModalVisible: false
        };
    }

    setModalVisible = (visible) => {
        this.setState({ contactInfoModalVisible: visible });
    }

    navigateToReportView = (userId, noticeId) => {
        this.props.navigation.push('ReportView', { noticeUserId: userId, noticeId: noticeId, isMyReport: false });
    }

    renderItem = ({item}) =>  {
        return (
            <TouchableOpacity onPress={() => this.navigateToReportView(item.userId, item.noticeId)}>
                <Image style={{height: (width - 50) / 2, width:  (width - 50) / 2, borderRadius: 5, margin: 5}}
                        source={{uri:`data:image/png;base64,${Buffer.from(item.pet.photo).toString('base64')}`}}
                />
                <Text style={{fontSize: 16, fontWeight: 'bold', color: mapReportTypeToLabelColor(item.noticeType), paddingLeft: 7, paddingBottom: 20}}>{mapReportTypeToLabel(item.noticeType)}</Text> 
            </TouchableOpacity>
        )
    }

    componentDidMount() {
        getSecureStoreValueFor('sessionToken').then((sessionToken) => {
            // TODO: change it to similar-pets request
            getJsonData(global.noticeServiceBaseUrl + '/notices', 
            {
                'Authorization': 'Basic ' + sessionToken 
            }
            ).then(response => {
                this.setState({ notices : response });
            }).catch(err => {
                console.log(err);
                alert(err)
            }).finally(() => this.setState({ isLoading : false }));
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <View>
                <Modal 
                    animationType="slide"
                    transparent={true}
                    visible={this.state.checksSettingsModalVisible}
                    onRequestClose={() => {
                        Alert.alert("Modal has been closed.");
                        this.setModalVisible(!modalVisible);
                    }}>
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'stretch'}}>
                        <View style={styles.modalView}>
                            <Text style={styles.modalTitle}>Chequeos</Text>
                            {/* {this.state.contactInfo.name ? <Text style={styles.modalText}><Text style={{fontWeight: 'bold'}}>Nombre: </Text>{this.state.contactInfo.name}</Text> : <></>}
                            {this.state.contactInfo.email ? <Text style={styles.modalText}><Text style={{fontWeight: 'bold'}}>e-mail: </Text>{this.state.contactInfo.email}</Text> : <></>}
                            {this.state.contactInfo.phoneNumber ? <Text style={styles.modalText}><Text style={{fontWeight: 'bold'}}>Teléfono: </Text>{this.state.contactInfo.phoneNumber}</Text> : <></>} */}
                            <TouchableOpacity
                                style={[styles.button, {width: '50%', alignSelf: 'center', alignItems: 'center'}]}
                                onPress={() => {
                                    this.setModalVisible(!this.state.checksSettingsModalVisible);
                                }}>
                                <Text>Ok</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>  
                </View>
                <View style={{flexDirection: 'row', alignContent: 'center', paddingTop: 70, paddingBottom: 10, backgroundColor: colors.primary}}>
                    <Icon
                        name='arrow-left'
                        size={30}
                        color={colors.white}
                        style={{marginLeft: 10}}
                        onPress={() => this.props.navigation.goBack()} />
                    <Text style={{fontSize: 24, fontWeight: 'bold', marginLeft: 15, color: colors.white}}>Resultados</Text>
                </View>
                <View style={styles.alignedContent}>
                    <Text style={styles.titleText}>Mascotas similares</Text>
                    <MaterialIcon name='notifications' size={24} color={colors.secondary} style={{marginLeft: 5}} onPress={() => this.setModalVisible(true)}/>
                </View>

                <FlatList 
                    data={this.state.notices} 
                    numColumns={2}
                    keyExtractor={(_, index) => index.toString()}
                    initialNumToRender={this.state.notices.length}
                    renderItem={this.renderItem}
                    style={{margin: 20}}
                />
            </View>
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
