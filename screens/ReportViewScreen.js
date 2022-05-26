import React from 'react';

import { Text, SafeAreaView, View, Image, Dimensions, TouchableOpacity, StyleSheet, ScrollView, Modal } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import SegmentedControlTab from "react-native-segmented-control-tab";

import { getJsonData } from '../utils/requests.js';
import { getSecureStoreValueFor } from '../utils/store';
import { showOptionTitle } from '../utils/editionHelper.js';
import { mapReportTypeToLabel, mapReportTypeToLabelColor, mapPetTypeToLabel, mapPetSexToLabel, mapPetSizeToLabel, mapPetLifeStageToLabel, mapReportTypeToPetLocationTitle, mapReportTypeToReportLabel } from '../utils/mappers';
import { showHeader } from '../utils/headers';
import { showPetImagesHeader } from '../utils/images.js';
import { showButton } from '../utils/buttons.js';

import commonStyles from '../utils/styles';
import colors from '../config/colors';

const { height, width } = Dimensions.get("screen")

/** Implements the screen that shows a pet's report. */
export class ReportViewScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
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

    componentDidMount() {
        getSecureStoreValueFor('sessionToken').then((sessionToken) => {
            this.getReportInfo(sessionToken);
            this.getContactInfo(sessionToken);
        });
        getSecureStoreValueFor("userId").then(userId => this.setState({ isMyReport: userId === this.props.route.params.noticeUserId}));
    }

    getReportInfo(sessionToken) {
        getJsonData(global.noticeServiceBaseUrl + '/users/' + this.props.route.params.noticeUserId + '/notices/' + this.props.route.params.noticeId,
            {
                'Authorization': 'Basic ' + sessionToken
            }
        ).then(notice => {
            this.setState({
                reportType: notice.noticeType,
                eventDescription: notice.description,
                province: notice.locality,
                city: notice.neighbourhood,
                location: notice.street,
            });
            this.getPetInfo(notice, sessionToken);
        }).catch(err => {
            console.log(err);
            alert(err);
        });
    }

    getPetInfo(notice, sessionToken) {
        getJsonData(global.noticeServiceBaseUrl + '/users/' + this.props.route.params.noticeUserId + '/pets/' + notice.pet.id,
            {
                'Authorization': 'Basic ' + sessionToken
            }
        ).then(pet => {
            this.setState({
                name: pet.name,
                petPhotos: pet.photos,
                sex: pet.sex,
                petType: pet.type,
                furColor: pet.furColor,
                breed: pet.breed,
                size: pet.size,
                lifeStage: pet.lifeStage,
                petDescription: pet.description,
            });

        }).catch(err => {
            console.log(err);
            alert(err);
        });
    }

    getContactInfo(sessionToken) {
        getJsonData(global.noticeServiceBaseUrl + '/users/' + this.props.route.params.noticeUserId,
            {
                'Authorization': 'Basic ' + sessionToken
            }
        ).then(user => {
            this.setState({
                contactInfo: {
                    name: user.name,
                    email: user.email,
                    phoneNumber: user.phoneNumber,
                }
            });
        }).catch(err => {
            console.log(err);
            alert(err);
        });
    }

    render() {
        const infoTitle = "Información";
        const historyTitle = "Historial";
        const segmentedTabTitles = [infoTitle, historyTitle];
        
        return (
            <SafeAreaView style={commonStyles.container}>
                {this.showContactInfoModal()}  
                {showHeader("Reporte", colors.secondary, colors.white, colors.secondary, () => this.navigateToReports())}
                {showPetImagesHeader(this.state.petPhotos, this.state.name)}

                <View style={{flex: 2}}>
                    <View style={{alignItems: 'flex-start', paddingHorizontal: 35}}>
                        {this.showTitle()} 
                        {mapReportTypeToLabel(this.state.reportType) == 'Encontrado' && 
                            this.showFosteringHistoryTabSelector(segmentedTabTitles) }
                    </View>
                    <ScrollView style={{flex:1, paddingHorizontal: 35}}>
                        { this.state.selectedIndex == segmentedTabTitles.indexOf(infoTitle) ?
                            // Show information tab data: event and pet details
                            this.showReportInfo() :
                            // Show history tab data: places where the pet has been fostered
                            this.showFosterInfo()   
                        }
                    </ScrollView>
                </View>
            </SafeAreaView>
        )
    }

    showReportInfo() {
        const dividerLine = <View style={{
            marginTop: 10,
            borderBottomColor: colors.secondary,
            borderBottomWidth: 1,
        }} />;
        
        return [
            this.showEventInfo(),
            <Text style={{ fontSize: 20, fontWeight: 'bold', paddingTop: 25, color: colors.secondary }}>Mascota</Text>,
            dividerLine,
            this.showPetInfo(),
            this.showActionButtons()
        ];
    }

    showFosterInfo() {
        return <>
        <Text style={{fontSize: 16, color: colors.secondary, paddingTop: 10, fontWeight: 'bold'}}>Información de tránsito</Text>
        <View style={[commonStyles.alignedContent]}>
            <View style={{ flexDirection: 'column', flex: 1, alignSelf: 'stretch' }}>
                {showOptionTitle("Desde", styles.optionTitle)}
                <Text style={[styles.textInput, { fontSize: 13 }]}>{this.state.date.getDate() + '/' + parseInt(this.state.date.getMonth() + 1) + '/' + this.state.date.getFullYear()}</Text>
            </View>
            <View style={{ flexDirection: 'column', flex: 1, alignSelf: 'stretch' }}>
                {showOptionTitle("Hasta", styles.optionTitle)}
                <Text style={[styles.textInput, { fontSize: 13 }]}>20/11/2023</Text>
            </View>
            <View style={{ flexDirection: 'column', flex: 2.3, alignSelf: 'stretch' }}>
                {showOptionTitle("Contacto", styles.optionTitle)}
                <Text style={[styles.textInput, { fontSize: 13 }]}>email_example@gmail.com</Text>
            </View>
        </View>
        </>;
    }

    showActionButtons() {
        if (!this.state.isMyReport) {
            return this.showGuestButton();
        } else {
            if (!this.state.isInEditMode) {
                return this.showMyReportButtons();
            }

            if (this.state.isInEditMode) {
                return this.showEditModeButtons();
            }
        }
    }

    showGuestButton() {
        return showButton("Contacto", () => this.showContactInfo(), { ...styles.button, marginHorizontal: 0, marginTop: 40, marginBottom: 60 });
    }

    showMyReportButtons() {
        return [
            showButton("Resolver reporte", () => this.resolveReport(), { ...styles.button, backgroundColor: colors.primary, marginHorizontal: 0, marginTop: 40 }),
            showButton("Suspender reporte", () => this.suspendReport(), { ...styles.button, backgroundColor: colors.pink, margin: 0, marginBottom: 60 })
        ];
    }

    showEditModeButtons() {
        return [
            showButton("Guardar cambios", () => this.saveChanges(), { ...styles.button, backgroundColor: colors.primary, marginHorizontal: 0, marginTop: 40 }),
            showButton("Descartar cambios", () => this.discardChanges(), { ...styles.button, backgroundColor: colors.grey, margin: 0, marginBottom: 60 })
        ];
    }

    showPetInfo() {
        return <>
            <View style={commonStyles.alignedContent}>
                <View style={{ flexDirection: 'column', flex: 0.5 }}>
                    {showOptionTitle("Tipo", styles.optionTitle)}
                    <Text style={styles.textInput}>{mapPetTypeToLabel(this.state.petType)}</Text>
                    {showOptionTitle("Sexo", styles.optionTitle)}
                    <Text style={styles.textInput}>{mapPetSexToLabel(this.state.sex)}</Text>
                    {showOptionTitle("Tamaño", styles.optionTitle)}
                    <Text style={styles.textInput}>{mapPetSizeToLabel(this.state.size)}</Text>

                </View>
                <View style={{ flexDirection: 'column', flex: 0.5 }}>
                    {showOptionTitle("Raza", styles.optionTitle)}
                    <Text style={styles.textInput}>{this.state.breed}</Text>
                    {showOptionTitle("Color de pelaje", styles.optionTitle)}
                    <Text style={styles.textInput}>{this.state.furColor}</Text>
                    {showOptionTitle("Etapa de la vida", styles.optionTitle)}
                    <Text style={styles.textInput}>{mapPetLifeStageToLabel(this.state.lifeStage)}</Text>
                </View>
            </View>
            {showOptionTitle("Descripción de la mascota", styles.optionTitle)}
            <Text style={styles.textInput}>{this.state.petDescription}</Text>
        </>;
    }

    showEventInfo() {
        return <>
            {showOptionTitle(mapReportTypeToPetLocationTitle(this.state.reportType), { ...styles.optionTitle, paddingTop: 0 })}
            <Text style={styles.textInput}>{this.state.location}</Text>
            <Text style={[styles.textInput, { paddingTop: 5 }]}>{(this.state.city != '' ? this.state.city + ", " : "") + this.state.province}</Text>

            <View style={[commonStyles.alignedContent, {justifyContent: 'center'}]}>
                <View style={{ flexDirection: 'column', flex: 0.5 }}>
                    {showOptionTitle("Fecha", styles.optionTitle)}
                    <Text style={styles.textInput}>{this.state.date.getDate() + '/' + parseInt(this.state.date.getMonth() + 1) + '/' + this.state.date.getFullYear()}</Text>
                </View>
                <View style={{ flexDirection: 'column', flex: 0.5 }}>
                    {showOptionTitle("Hora", styles.optionTitle)}
                    <Text style={styles.textInput}>{("0" + this.state.hour.getHours()).slice(-2) + ':' + ("0" + this.state.hour.getMinutes()).slice(-2)}</Text>
                </View>
            </View>

            {showOptionTitle("Descripción", styles.optionTitle)}
            <Text style={styles.textInput}>{this.state.eventDescription}</Text>
        </>;
    }

    showFosteringHistoryTabSelector(segmentedTabTitles) {
        return <SegmentedControlTab
            values={segmentedTabTitles}
            selectedIndex={this.state.selectedIndex}
            onTabPress={this.handleTabSegmenterIndexChange}
            tabsContainerStyle={{ marginBottom: 10 }}
            tabTextStyle={{ color: colors.grey, fontWeight: 'bold', fontSize: 14, paddingVertical: 8 }}
            tabStyle={{ backgroundColor: colors.inputGrey, borderColor: colors.transparent }}
            activeTabStyle={{ borderRadius: 5, backgroundColor: colors.white, shadowOpacity: 0.2, shadowOffset: { width: 1, height: 1 } }}
            activeTabTextStyle={{ color: colors.primary, fontWeight: 'bold', fontSize: 14 }} />;
    }

    showTitle() {
        return <View style={{ ...commonStyles.alignedContent, paddingTop: 20, paddingBottom: 10 }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: mapReportTypeToLabelColor(this.state.reportType) }}>{mapReportTypeToReportLabel(this.state.reportType)}</Text>
            {this.state.isMyReport &&
                <TouchableOpacity onPress={() => this.changeToEditMode()}>
                    <MaterialIcon name='pencil' size={20} color={colors.secondary} style={{ paddingLeft: 10 }} />
                </TouchableOpacity>}
        </View>;
    }

    showContactInfoModal() {
        return <View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={this.state.contactInfoModalVisible}
                onRequestClose={() => {
                    Alert.alert("Modal has been closed.");
                    this.setModalVisible(!modalVisible);
                } }>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'stretch' }}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalTitle}>Datos de contacto</Text>
                        {this.state.contactInfo.name ? <Text style={styles.modalText}><Text style={{ fontWeight: 'bold' }}>Nombre: </Text>{this.state.contactInfo.name}</Text> : <></>}
                        {this.state.contactInfo.email ? <Text style={styles.modalText}><Text style={{ fontWeight: 'bold' }}>e-mail: </Text>{this.state.contactInfo.email}</Text> : <></>}
                        {this.state.contactInfo.phoneNumber ? <Text style={styles.modalText}><Text style={{ fontWeight: 'bold' }}>Teléfono: </Text>{this.state.contactInfo.phoneNumber}</Text> : <></>}
                        {showButton("Ok", () => this.setModalVisible(!this.state.contactInfoModalVisible), { alignItems: 'center', alignSelf: 'center', width: '50%', backgroundColor: colors.secondary })}
                    </View>
                </View>
            </Modal>
        </View>;
    }
}

const styles = StyleSheet.create({
    optionTitle: {
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
        alignSelf: 'stretch',
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
