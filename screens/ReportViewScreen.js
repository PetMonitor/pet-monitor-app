import React from 'react';

import { Text, SafeAreaView, View, Image, Dimensions, TouchableOpacity, StyleSheet, ScrollView, Modal } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import SegmentedControlTab from "react-native-segmented-control-tab";

import { getJsonData } from '../utils/requests.js';
import { getSecureStoreValueFor } from '../utils/store';
import { OptionTitle } from '../utils/editionHelper.js';
import { mapReportTypeToLabel, mapReportTypeToLabelColor, mapPetTypeToLabel, mapPetSexToLabel, mapPetSizeToLabel, mapPetLifeStageToLabel, mapReportTypeToPetLocationTitle, mapReportTypeToReportLabel } from '../utils/mappers';
import { HeaderWithBackArrow } from '../utils/headers';
import { PetImagesHeader } from '../utils/images.js';
import { AppButton } from '../utils/buttons.js';

import commonStyles from '../utils/styles';
import colors from '../config/colors';

const { height, width } = Dimensions.get("screen")

const infoTitle = "Información";
const historyTitle = "Historial";
const segmentedTabTitles = [infoTitle, historyTitle];

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
            contactInfo: {
                name: '',
                email: '',
                phoneNumber: ''
            },
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
        
        const reportTypeText = mapReportTypeToReportLabel(this.state.reportType);
        const reportTypeLabel = mapReportTypeToLabelColor(this.state.reportType);
        const isFoundPet = mapReportTypeToLabel(this.state.reportType) == 'Encontrado';
        const changeModalVisibility = () => this.setModalVisible(!this.state.contactInfoModalVisible);
        
        return (
            <SafeAreaView style={commonStyles.container}>
                <ContactInfoModal 
                    isVisible={this.state.contactInfoModalVisible}
                    onModalClose={changeModalVisibility}
                    name={this.state.contactInfo.name}
                    email={this.state.contactInfo.email}
                    phoneNumber={this.state.contactInfo.phoneNumber}
                    onContactInfoOk={changeModalVisibility}/> 
                <HeaderWithBackArrow headerText={"Reporte"} headerTextColor={colors.secondary} backgroundColor={colors.white} backArrowColor={colors.secondary} onBackArrowPress={this.navigateToReports} />
                <PetImagesHeader petPhotos={this.state.petPhotos} petName={this.state.name} />

                <View style={{flex: 2}}>
                    <View style={{alignItems: 'flex-start', paddingHorizontal: 35}}>
                        <Title 
                            text={reportTypeText} 
                            textColor={reportTypeLabel}
                            isMyReport={this.state.isMyReport}
                            onEditModePress={this.changeToEditMode}/>
                        <FosteringHistoryTabSeletor 
                            segmentedTabTitles={segmentedTabTitles} 
                            selectedIndex={this.state.selectedIndex} 
                            onSelectedTabPress={this.handleTabSegmenterIndexChange}
                            isFoundPet={isFoundPet}/>
                    </View>
                    <ScrollView style={{flex:1, paddingHorizontal: 35}}>
                        <ReportContent
                            selectedIndex={this.state.selectedIndex}
                            reportInfo={{
                                eventInfo: {
                                    locationTitle: mapReportTypeToPetLocationTitle(this.state.reportType),
                                    location: this.state.location,
                                    city: this.state.city,
                                    province: this.state.province,
                                    date: this.state.date,
                                    hour: this.state.hour,
                                    description: this.state.eventDescription
                                },
                                petInfo: {
                                    type: this.state.petType,
                                    sex: this.state.sex,
                                    breed: this.state.breed,
                                    furColor: this.state.furColor,
                                    size: this.state.size,
                                    lifeStage: this.state.lifeStage,
                                    description: this.state.petDescription
                                }
                            }}
                            fosterInfo={{
                                // TODO: change this
                                sinceDate: this.state.date,
                                untilDate: this.state.date,
                                contactEmail: this.state.contactInfo.email
                            }}/>
                        <ActionButtons 
                            selectedIndex={this.state.selectedIndex}
                            isMyReport={this.state.isMyReport}
                            isInEditMode={this.state.isInEditMode}
                            guestButtonHandler={{
                                showContactInfo: this.showContactInfo
                            }}
                            myReportButtonHandler={{
                                resolveReport: this.resolveReport,
                                suspendReport: this.suspendReport
                            }}
                            editModeButtonHandler={{
                                saveChanges: this.saveChanges,
                                discardChanges: this.discardChanges
                            }}/>
                    </ScrollView>
                </View>
            </SafeAreaView>
        )
    }
}

const EditModePencil = ({isMyReport, onEditModePress}) => {
    return isMyReport && (
        <TouchableOpacity onPress={onEditModePress}>
            <MaterialIcon name='pencil' size={20} color={colors.secondary} style={{ paddingLeft: 10 }} />
        </TouchableOpacity>
    );
}

const Title = ({text, textColor, isMyReport, onEditModePress}) => {
    return (
        <View style={{ ...commonStyles.alignedContent, paddingTop: 20, paddingBottom: 10 }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: textColor }}>{text}</Text>
            <EditModePencil isMyReport={isMyReport} onEditModePress={onEditModePress}/>
        </View>
    );
}

const FosteringHistoryTabSeletor = ({segmentedTabTitles, selectedIndex, onSelectedTabPress, isFoundPet}) => {
    return isFoundPet && (
        <SegmentedControlTab
            values={segmentedTabTitles}
            selectedIndex={selectedIndex}
            onTabPress={onSelectedTabPress}
            tabsContainerStyle={{ marginBottom: 10 }}
            tabTextStyle={{ color: colors.grey, fontWeight: 'bold', fontSize: 14, paddingVertical: 8 }}
            tabStyle={{ backgroundColor: colors.inputGrey, borderColor: colors.transparent }}
            activeTabStyle={{ borderRadius: 5, backgroundColor: colors.white, shadowOpacity: 0.2, shadowOffset: { width: 1, height: 1 } }}
            activeTabTextStyle={{ color: colors.primary, fontWeight: 'bold', fontSize: 14 }} />
    );
}

const ConditionalContactText = ({textValue, label}) => {
    return textValue ? <Text style={styles.modalText}><Text style={{ fontWeight: 'bold' }}>{label}</Text>{textValue}</Text> : null;
}

const ContactInfo = ({name, email, phoneNumber, onContactInfoOk}) => {
    return (
        <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Datos de contacto</Text>
            <ConditionalContactText textValue={name} label="Nombre: "/>
            <ConditionalContactText textValue={email} label="Email: "/>
            <ConditionalContactText textValue={phoneNumber} label="Teléfono: "/>
            <AppButton buttonText={"Ok"} onPress={onContactInfoOk} additionalButtonStyles={{ alignItems: 'center', alignSelf: 'center', width: '50%', backgroundColor: colors.secondary }}/>
        </View>
    );
}

const ContactInfoModal = ({isVisible, onModalClose, name, email, phoneNumber, onContactInfoOk}) => {
    return (
        <View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={isVisible}
                onRequestClose={onModalClose}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'stretch' }}>
                   <ContactInfo name={name} email={email} phoneNumber={phoneNumber} onContactInfoOk={onContactInfoOk}/>
                </View>
            </Modal>
        </View>
    );
}

const FosteringInfo = ({sinceDate, untilDate, contactEmail}) => {
    return (<>
        <Text style={{fontSize: 16, color: colors.secondary, paddingTop: 10, fontWeight: 'bold'}}>Información de tránsito</Text>
        <View style={[commonStyles.alignedContent]}>
            <View style={{ flexDirection: 'column', flex: 1, alignSelf: 'stretch' }}>
                <OptionTitle text={"Desde"} additionalStyle={styles.optionTitle} />
                <Text style={[styles.textInput, { fontSize: 13 }]}>{sinceDate.getDate() + '/' + parseInt(sinceDate.getMonth() + 1) + '/' + sinceDate.getFullYear()}</Text>
            </View>
            <View style={{ flexDirection: 'column', flex: 1, alignSelf: 'stretch' }}>
                <OptionTitle text={"Hasta"} additionalStyle={styles.optionTitle} />
                <Text style={[styles.textInput, { fontSize: 13 }]}>20/11/2023</Text>
            </View>
            <View style={{ flexDirection: 'column', flex: 2.3, alignSelf: 'stretch' }}>
                <OptionTitle text={"Contacto"} additionalStyle={styles.optionTitle} />
                <Text style={[styles.textInput, { fontSize: 13 }]}>email_example@gmail.com</Text>
            </View>
        </View>
    </>);
}

const EventInfo = ({petLocationTitle, eventLocation, eventCity, eventProvince, eventDate, eventHour, eventDescription}) => {
    return (<>
        <OptionTitle text={petLocationTitle} additionalStyle={{ ...styles.optionTitle, paddingTop: 0 }} />
        <Text style={styles.textInput}>{eventLocation}</Text>
        <Text style={[styles.textInput, { paddingTop: 5 }]}>{(eventCity != '' ? eventCity + ", " : "") + eventProvince}</Text>

        <View style={[commonStyles.alignedContent, {justifyContent: 'center'}]}>
            <View style={{ flexDirection: 'column', flex: 0.5 }}>
                <OptionTitle text={"Fecha"} additionalStyle={styles.optionTitle} />
                <Text style={styles.textInput}>{eventDate.getDate() + '/' + parseInt(eventDate.getMonth() + 1) + '/' + eventDate.getFullYear()}</Text>
            </View>
            <View style={{ flexDirection: 'column', flex: 0.5 }}>
                <OptionTitle text={"Hora"} additionalStyle={styles.optionTitle} />
                <Text style={styles.textInput}>{("0" + eventHour.getHours()).slice(-2) + ':' + ("0" + eventHour.getMinutes()).slice(-2)}</Text>
            </View>
        </View>

        <OptionTitle text={"Descripción"} additionalStyle={styles.optionTitle} />
        <Text style={styles.textInput}>{eventDescription}</Text>
    </>);
}


const PetInfo = ({petType, sex, size, breed, furColor, lifeStage, petDescription}) => {
    return (<>
        <Text style={{ fontSize: 20, fontWeight: 'bold', paddingTop: 25, color: colors.secondary }}>Mascota</Text>
        <View style={{ marginTop: 10, borderBottomColor: colors.secondary, borderBottomWidth: 1}} />
        <View style={commonStyles.alignedContent}>
            <View style={{ flexDirection: 'column', flex: 0.5 }}>
                <OptionTitle text={"Tipo"} additionalStyle={styles.optionTitle} />
                <Text style={styles.textInput}>{mapPetTypeToLabel(petType)}</Text>
                <OptionTitle text={"Sexo"} additionalStyle={styles.optionTitle} />
                <Text style={styles.textInput}>{mapPetSexToLabel(sex)}</Text>
                <OptionTitle text={"Tamaño"} additionalStyle={styles.optionTitle} />
                <Text style={styles.textInput}>{mapPetSizeToLabel(size)}</Text>

            </View>
            <View style={{ flexDirection: 'column', flex: 0.5 }}>
                <OptionTitle text={"Raza"} additionalStyle={styles.optionTitle} />
                <Text style={styles.textInput}>{breed}</Text>
                <OptionTitle text={"Color de pelaje"} additionalStyle={styles.optionTitle} />
                <Text style={styles.textInput}>{furColor}</Text>
                <OptionTitle text={"Etapa de la vida"} additionalStyle={styles.optionTitle} />
                <Text style={styles.textInput}>{mapPetLifeStageToLabel(lifeStage)}</Text>
            </View>
        </View>
        <OptionTitle text={"Descripción de la mascota"} additionalStyle={styles.optionTitle} />
        <Text style={styles.textInput}>{petDescription}</Text>
    </>);
}

const ReportInfo = ({eventInfo, petInfo}) => {
    return (<>
        <EventInfo petLocationTitle={eventInfo.locationTitle} eventLocation={eventInfo.location} eventCity={eventInfo.city} eventProvince={eventInfo.province} eventDate={eventInfo.date} eventHour={eventInfo.hour} eventDescription={eventInfo.description}/>
        <PetInfo petType={petInfo.type} sex={petInfo.sex} size={petInfo.size} breed={petInfo.breed} furColor={petInfo.furColor} lifeStage={petInfo.lifeStage} petDescription={petInfo.description}/>
    </>);
}

const ReportContent = ({selectedIndex, reportInfo, fosterInfo}) => {
    if (selectedIndex == segmentedTabTitles.indexOf(infoTitle)) {
        // Show information tab data: event and pet details
        return <ReportInfo eventInfo={reportInfo.eventInfo} petInfo={reportInfo.petInfo} />;
    } else if (selectedIndex == segmentedTabTitles.indexOf(historyTitle)) {
        // Show history tab data: places where the pet has been fostered
        return <FosteringInfo sinceDate={fosterInfo.sinceDate} untilDate={fosterInfo.untilDate} contactEmail={fosterInfo.contactEmail}/>;
    }
    return null;
}

const ContactButton = ({showContactInfo}) => {
    return <AppButton buttonText={"Contacto"} onPress={showContactInfo} additionalButtonStyles={{ ...styles.button, marginHorizontal: 0, marginTop: 40, marginBottom: 60 }}/>;
}

const MyReportButtons = ({resolveReport, suspendReport}) => {
    return (<>
        <AppButton buttonText={"Resolver reporte"} onPress={resolveReport} additionalButtonStyles={{ ...styles.button, backgroundColor: colors.primary, marginHorizontal: 0, marginTop: 40 }}/>
        <AppButton buttonText={"Suspender reporte"} onPress={suspendReport} additionalButtonStyles={{ ...styles.button, backgroundColor: colors.pink, margin: 0, marginBottom: 60 }}/>
    </>);
}

const EditModeButtons = ({saveChanges, discardChanges}) => {
    return (<>
        <AppButton buttonText={"Guardar cambios"} onPress={saveChanges} additionalButtonStyles={{ ...styles.button, backgroundColor: colors.primary, marginHorizontal: 0, marginTop: 40 }}/>
        <AppButton buttonText={"Descartar cambios"} onPress={discardChanges} additionalButtonStyles={{ ...styles.button, backgroundColor: colors.grey, margin: 0, marginBottom: 60 }}/>
    </>);
}

const ReportButtons = ({isMyReport, isInEditMode, guestButtonHandler, editModeButtonHandler, myReportButtonHandler}) => {
    if (!isMyReport) {
        return <ContactButton showContactInfo={guestButtonHandler.showContactInfo}/>;
    } else {
        if (!isInEditMode) {
            return <MyReportButtons resolveReport={myReportButtonHandler.resolveReport} suspendReport={myReportButtonHandler.suspendReport} />
        }
        if (isInEditMode) {
            return <EditModeButtons saveChanges={editModeButtonHandler.saveChanges} discardChanges={editModeButtonHandler.discardChanges} />
        }
    }
}

const ActionButtons = ({selectedIndex, isMyReport, isInEditMode, guestButtonHandler, editModeButtonHandler, myReportButtonHandler}) => {
    if (selectedIndex == segmentedTabTitles.indexOf(infoTitle)) {
        return <ReportButtons isMyReport={isMyReport} isInEditMode={isInEditMode} guestButtonHandler={guestButtonHandler} editModeButtonHandler={editModeButtonHandler} myReportButtonHandler={myReportButtonHandler}/>
    }
    return null;
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
