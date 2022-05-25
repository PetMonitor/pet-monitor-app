import React from 'react';

import { Text, SafeAreaView, View, FlatList, Image, Dimensions, TouchableOpacity, StyleSheet, ScrollView, Modal } from 'react-native';
import { getJsonData } from '../utils/requests.js';
import { getSecureStoreValueFor } from '../utils/store';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import SegmentedControlTab from "react-native-segmented-control-tab";

import { mapReportTypeToLabel, mapReportTypeToLabelColor, mapPetTypeToLabel, mapPetSexToLabel, mapPetSizeToLabel, mapPetLifeStageToLabel, mapReportTypeToPetLocationTitle, mapReportTypeToReportLabel } from '../utils/mappers';

import colors from '../config/colors';

const { height, width } = Dimensions.get("screen")

/** Implements the screen that shows a pet's report. */
export class ReportViewScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            // TODO: change this for request data
            reportType: '',
            name: '',
            province: '',
            city: '',
            location: '',
            date: new Date(),
            hour: new Date(),
            eventDescription: '',
            petPhotos: [],
            sex: '',
            petType: '',
            furColor: '',
            breed: '',
            size: '',
            lifeStage: '',
            petDescription: '',
            contactInfo: {},
            selectedIndex: 0,
            contactInfoModalVisible: false,
            isMyReport: false,
            isInEditMode: false,
        };
    }

    renderPet = ({item}) => {
        return (
            <Image key={'img_' + item.photoId} resizeMode="cover" style={{aspectRatio: 1, height: height/3.5, borderRadius: 5, marginRight: 5}} source={{ uri: global.noticeServiceBaseUrl + '/photos/' + item.photoId }}/>
        )
    }

    setModalVisible = (visible) => {
        this.setState({ contactInfoModalVisible: visible });
    }

    handleTabSegmenterIndexChange = index => {
        this.setState({
          selectedIndex: index
        });
    };

    showContactInfo = () => {
        this.setModalVisible(true);
    }

    resolveReport = () => {
        // TODO
    }

    suspendReport = () => {
        // TODO: suspend or remove?
    }

    changeToEditMode = () => {
        // TODO: edit event/pet page or history depending on the index
        this.setState({ isInEditMode: true });
    }

    saveChanges = () => {
        // TODO: edit event/pet page or history depending on the index
        this.setState({ isInEditMode: false });
    }

    discardChanges = () => {
        // TODO: edit event/pet page or history depending on the index
        this.setState({ isInEditMode: false });
    }

    navigateToReports = () => {
        if (this.props.goToUserProfile) {
            navigation.navigate('BottomTabNavigator', {
                screen: 'ViewUserDetails'
              });
        } else {
            this.props.navigation.goBack();
        }
    }

    showHeader = () => (
        <>
            <View style={{justifyContent: 'center', alignItems: 'flex-start', marginTop: 20, marginBottom: 10}}>
                <MaterialIcon
                    name='arrow-left'
                    size={33}
                    color={colors.secondary}
                    style={{marginLeft: 10}}
                    onPress={() => this.navigateToReports()} />
                <Text style={{fontSize: 24, fontWeight: 'bold', marginLeft: 60, color: colors.secondary, position: 'absolute'}}>Reporte</Text>
            </View>
            <View style={{borderBottomWidth: 1, borderBottomColor: colors.inputGrey}}></View>
        </>
    )

    componentDidMount() {
        getSecureStoreValueFor('sessionToken').then((sessionToken) => {
            getJsonData(global.noticeServiceBaseUrl + '/users/' + this.props.route.params.noticeUserId + '/notices/' + this.props.route.params.noticeId, 
            {
                'Authorization': 'Basic ' + sessionToken 
            }
            ).then(response => {
                this.setState({ 
                    reportType: response.noticeType,
                    eventDescription: response.description,
                    province: response.locality,
                    city: response.neighbourhood,
                    location: response.street,
                });
                getJsonData(global.noticeServiceBaseUrl + '/users/' + this.props.route.params.noticeUserId + '/pets/' + response.pet.id, 
                {
                    'Authorization': 'Basic ' + sessionToken 
                }
                ).then(responsePet => {
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
            }).catch(err => {
                console.log(err);
                alert(err)
            }).finally(() => this.setState({ isLoading : false }));
        });
        getSecureStoreValueFor('sessionToken').then((sessionToken) => {
            getJsonData(global.noticeServiceBaseUrl + '/users/' + this.props.route.params.noticeUserId, 
            {
                'Authorization': 'Basic ' + sessionToken 
            }
            ).then(response => {
                this.setState({ 
                    contactInfo: {
                        name: response.name,
                        email: response.email,
                        phoneNumber: response.phoneNumber,
                    }
                });
            }).catch(err => {
                console.log(err);
                alert(err)
            }).finally(() => this.setState({ isLoading : false }));
        });
        getSecureStoreValueFor("userId").then(userId => this.setState({ isMyReport: userId === this.props.route.params.noticeUserId}));
    }

    render() {
        const infoTitle = "Información";
        const historyTitle = "Historial";
        const segmentedTabTitles = [infoTitle, historyTitle];

        const dividerLine = <View style={{
            marginTop: 10,
            borderBottomColor: colors.secondary,
            borderBottomWidth: 1,
        }} />;
        
        return (
            <SafeAreaView style={styles.container}>
                <View>
                <Modal 
                    animationType="slide"
                    transparent={true}
                    visible={this.state.contactInfoModalVisible}
                    onRequestClose={() => {
                        Alert.alert("Modal has been closed.");
                        this.setModalVisible(!modalVisible);
                    }}>
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'stretch'}}>
                        <View style={styles.modalView}>
                            <Text style={styles.modalTitle}>Datos de contacto</Text>
                            {this.state.contactInfo.name ? <Text style={styles.modalText}><Text style={{fontWeight: 'bold'}}>Nombre: </Text>{this.state.contactInfo.name}</Text> : <></>}
                            {this.state.contactInfo.email ? <Text style={styles.modalText}><Text style={{fontWeight: 'bold'}}>e-mail: </Text>{this.state.contactInfo.email}</Text> : <></>}
                            {this.state.contactInfo.phoneNumber ? <Text style={styles.modalText}><Text style={{fontWeight: 'bold'}}>Teléfono: </Text>{this.state.contactInfo.phoneNumber}</Text> : <></>}
                            <TouchableOpacity
                                style={[styles.button, {width: '50%', alignSelf: 'center', alignItems: 'center'}]}
                                onPress={() => {
                                    this.setModalVisible(!this.state.contactInfoModalVisible);
                                }}>
                                <Text>Ok</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>  
                </View>
                {this.showHeader()}
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
                    <View style={{alignItems: 'flex-start'}}>
                        <View style={{flexDirection: 'row', alignItems: 'center', paddingTop: 20, paddingBottom: 10}}>
                            <Text style={{fontSize: 24, fontWeight: 'bold', paddingLeft: 35, color: mapReportTypeToLabelColor(this.state.reportType)}}>{mapReportTypeToReportLabel(this.state.reportType)}</Text>
                            {this.state.isMyReport ? 
                                <TouchableOpacity onPress={() => this.changeToEditMode()}>
                                    <MaterialIcon name='pencil' size={20} color={colors.secondary} style={{paddingLeft: 10}}/> 
                                </TouchableOpacity> : <></>}
                        </View> 
                        {mapReportTypeToLabel(this.state.reportType) == 'Encontrado' ?
                            <SegmentedControlTab 
                                values={segmentedTabTitles}
                                selectedIndex={this.state.selectedIndex}
                                onTabPress={this.handleTabSegmenterIndexChange}
                                tabsContainerStyle={{marginLeft: 35, marginRight: 35, marginBottom: 10}}
                                tabTextStyle={{color: colors.grey, fontWeight: 'bold', fontSize: 14, paddingVertical: 8}}
                                tabStyle={{backgroundColor: colors.inputGrey, borderColor: colors.transparent}}
                                activeTabStyle={{borderRadius: 5, backgroundColor: colors.white, shadowOpacity:0.2, shadowOffset: {width: 1, height: 1}}}
                                activeTabTextStyle={{color: colors.primary, fontWeight: 'bold', fontSize: 14}}
                            />
                            : <></>}
                    </View>
                    <ScrollView style={{flex:1, paddingLeft: 35, paddingRight: 35}}>
                        { this.state.selectedIndex == segmentedTabTitles.indexOf(infoTitle) ?
                            // Show information tab data: event and pet details
                            <>
                                <Text style={[styles.optionTitle, {paddingTop: 0}]}>{mapReportTypeToPetLocationTitle(this.state.reportType)}</Text>
                                <Text style={styles.textInput}>{this.state.location}</Text>
                                <Text style={[styles.textInput, {paddingTop: 5}]}>{(this.state.city != '' ? this.state.city + ", " : "") + this.state.province}</Text>

                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <View style={{flexDirection: 'column', flex: 0.5}}>
                                        <Text style={styles.optionTitle}>Fecha</Text>
                                        <Text style={styles.textInput}>{this.state.date.getDate() + '/' + parseInt(this.state.date.getMonth() + 1) + '/' + this.state.date.getFullYear()}</Text>
                                    </View>
                                    <View style={{flexDirection: 'column', flex: 0.5}}>
                                        <Text style={styles.optionTitle}>Hora</Text>
                                        <Text style={styles.textInput}>{("0" + this.state.hour.getHours()).slice(-2) + ':' + ("0" + this.state.hour.getMinutes()).slice(-2)}</Text>
                                    </View>
                                </View>

                                <Text style={styles.optionTitle}>Descripción</Text>
                                <Text style={styles.textInput}>{this.state.eventDescription}</Text>
                                <Text style={[styles.optionTitle, {fontSize: 20, fontWeight: 'bold', paddingTop: 25, color: colors.secondary}]}>Mascota</Text>
                                {dividerLine}
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

                                <Text style={styles.optionTitle}>Descripción de la mascota</Text>
                                <Text style={styles.textInput}>{this.state.petDescription}</Text>

                                {this.state.isInEditMode && 
                                <>
                                <TouchableOpacity style={[styles.button, {alignSelf: 'stretch', backgroundColor: colors.primary, marginTop: 40}]} onPress={() => this.saveChanges()}>
                                    <Text style={styles.buttonFont}>Guardar cambios</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.button, {alignSelf: 'stretch', backgroundColor: colors.grey, marginTop: 15, marginBottom: 60}]} onPress={() => this.discardChanges()}>
                                    <Text style={styles.buttonFont}>Descartar cambios</Text>
                                </TouchableOpacity>
                                </> }

                                {this.state.isMyReport && !this.state.isInEditMode && 
                                <>
                                <TouchableOpacity style={[styles.button, {alignSelf: 'stretch', backgroundColor: colors.primary, marginTop: 40}]} onPress={() => this.resolveReport()}>
                                    <Text style={styles.buttonFont}>Resolver reporte</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.button, {alignSelf: 'stretch', backgroundColor: colors.pink, marginTop: 15, marginBottom: 60}]} onPress={() => this.suspendReport()}>
                                    <Text style={styles.buttonFont}>Suspender reporte</Text>
                                </TouchableOpacity>
                                </> }

                                {!this.state.isMyReport && 
                                <TouchableOpacity style={[styles.button, {alignSelf: 'stretch', backgroundColor: colors.secondary, marginTop: 40, marginBottom: 60}]} onPress={() => this.showContactInfo()}>
                                    <Text style={styles.buttonFont}>Contacto</Text>
                                </TouchableOpacity> }
                            </> :
                            // Show history tab data: places where the pet has been fostered
                            <>
                                <Text style={{fontSize: 18, color: colors.secondary, paddingBottom: 5, fontWeight: 'bold'}}>Hogares en los que estuvo la mascota</Text>
                                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                    <View style={{flexDirection: 'column', flex: 1, alignSelf: 'stretch'}}>
                                        <Text style={styles.optionTitle}>Desde</Text>
                                        <Text style={[styles.textInput, {fontSize: 14}]}>{this.state.date.getDate() + '/' + parseInt(this.state.date.getMonth() + 1) + '/' + this.state.date.getFullYear()}</Text>
                                    </View>
                                    <View style={{flexDirection: 'column', flex: 1, alignSelf: 'stretch'}}>
                                        <Text style={styles.optionTitle}>Hasta</Text>
                                        <Text style={[styles.textInput, {fontSize: 14}]}>20/11/2023</Text>
                                    </View>
                                    <View style={{flexDirection: 'column', flex: 2.3, alignSelf: 'stretch'}}>
                                        <Text style={styles.optionTitle}>Contacto</Text>
                                        <Text style={[styles.textInput, {fontSize: 14}]}>email_example@gmail.com</Text>
                                    </View>
                                </View>
                            </>
                        }
                    </ScrollView>
                </View>
            </SafeAreaView>
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
