import React from 'react';

import { getSecureStoreValueFor } from '../utils/store';
import { getJsonData, deleteJsonData, postJsonData} from '../utils/requests.js';
import { CheckBoxItem, getDatePicker, OptionTextInput, OptionTitle } from '../utils/editionHelper.js';
import { HeaderWithBackArrow } from '../utils/headers';
import { PetImagesHeader } from '../utils/images.js';
import { AppButton } from '../utils/buttons.js';

import {  Alert, Text, SafeAreaView, View, Image, Dimensions, TouchableOpacity, StyleSheet, ScrollView, Modal } from 'react-native';

import FeatherIcon from 'react-native-vector-icons/Feather';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import SegmentedControlTab from "react-native-segmented-control-tab";

import { mapReportTypeToLabelColor, mapPetTypeToLabel, mapPetSexToLabel, mapPetSizeToLabel, mapPetLifeStageToLabel, mapReportTypeToPetLocationTitle, mapReportTypeToReportLabel } from '../utils/mappers';

import commonStyles from '../utils/styles';
import colors from '../config/colors';
import DropDownPicker from 'react-native-dropdown-picker';
import { validateEmail } from '../utils/commons';
var HttpStatus = require('http-status-codes');

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
            petId: '',
            latitude: '',
            longitude: '',
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
            newFosteringHomeModalVisible: false,
            isMyReport: this.props.route.params.isMyReport,
            noticeId: this.props.route.params.noticeId,
            newHomeSinceSelectedDate: new Date(),
            newHomeUntilSelectedDate: new Date(),
            volunteers: [],
            openDropdown: false,
            dropdownValue: null,
            existingVolunteer: true,
            fosterHistory: [],
            manualVolunteerData: {
                name: '',
                email: '',
                phoneNumber: ''
            }
        };
    }

    renderPet = ({item}) => {
        return (
            <Image key={'img_' + item.photoId} resizeMode="cover" style={{aspectRatio: 1, height: height/3.5, borderRadius: 5, marginRight: 5}} source={{ uri: global.noticeServiceBaseUrl + '/photos/' + item.photoId }}/>
        )
    }

    setContactModalVisible = (visible) => {
        this.setState({ contactInfoModalVisible: visible });
    }

    setFosteringHomeModalVisible = (visible) => {
        this.setState({ newFosteringHomeModalVisible: visible });
    }

    handleTabSegmenterIndexChange = index => {
        this.setState({
          selectedIndex: index
        });
    };

    showContactInfo = () => {
        this.setContactModalVisible(true);
    }

    resolveReport = () => {
        getSecureStoreValueFor('sessionToken').then((sessionToken) => {
            deleteJsonData(global.noticeServiceBaseUrl + '/users/' + this.props.route.params.noticeUserId + '/notices/' + this.state.noticeId, 
            {},
            {
                'Authorization': 'Basic ' + sessionToken 
            }).then(response => {

                if (response.status != HttpStatus.StatusCodes.OK) {
                    console.log(`Delete pet endpoint returned error ${response}`)
                    alert('Error occured attempting to delete pet!')
                }
                
                this.props.navigation.navigate('ViewUserDetails');
            }).catch(err => {
                console.log(err);
                alert(err)
                this.props.navigation.goBack();
            });
        })
    }

    confirmResolveReport = () =>
        Alert.alert(
        "Atención!",
        "Si presionás OK este reporte será eliminado, y no aparecerá en ninguna búsqueda!",
        [
            {
                text: "Cancelar",
                onPress: () => console.log("Cancel delete report pressed"),
                style: "cancel"
            },
            { 
                text: "OK", 
                onPress: () => this.resolveReport()
            }
        ]
    );

    onReportDataUpdated = () => {
        getSecureStoreValueFor('sessionToken').then((sessionToken) => {
            this.fetchReportInfo(sessionToken);
        });
    }

    goToEdit = () => {
        this.props.navigation.push('EditReportScreen', { reportState: this.state, onUpdate: this.onReportDataUpdated })
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

    showHistoryInfo = () => {
        const reportType = this.state.reportType.toLowerCase();
        return (reportType == 'found') || (reportType == 'for_adoption');
    }

    addNewHome = () => {
        this.setFosteringHomeModalVisible(true);
    }

    fetchFosterVolunteerProfiles() {
        getSecureStoreValueFor('sessionToken').then((sessionToken) => {
            getSecureStoreValueFor("userId").then(userId => {
                getJsonData(global.noticeServiceBaseUrl + '/fosterVolunteerProfiles', { 'Authorization': 'Basic ' + sessionToken }
                ).then(profilesInfo => {
                    let volunteers = []
                    let promises = []
                    for (let i = 0; i < profilesInfo.length; i++) {
                        promises.push(getJsonData(global.noticeServiceBaseUrl + '/users/' + profilesInfo[i].userId + '/contactInfo',
                        ).then(userInfo => {
                            let volunteerInfo = {
                                label: userInfo.name,
                                value: userInfo
                            }
                            if (userId !== userInfo.userId) {
                                volunteers.push(volunteerInfo)
                            } 
                        }).catch(err => {
                            console.log(err);
                            alert(err);
                        }))
                    }
                    Promise.all(promises)
                    .then(() => {
                        let dropdownValue = null
                        if (volunteers.length > 0) {
                            dropdownValue = volunteers[0].value
                        }
                        this.setState({ 
                            volunteers: volunteers,
                            dropdownValue: dropdownValue
                        })
                    })
                    .catch(err => {
                        console.log(err);
                        alert(err);
                    });
                }).catch(err => {
                    console.log(err);
                    alert(err);
                });
            });
        });
    }


    componentDidMount() {
        getSecureStoreValueFor('sessionToken').then((sessionToken) => {
            this.fetchReportInfo(sessionToken);
            this.fetchContactInfo();
        });
        getSecureStoreValueFor("userId").then(userId => this.setState({ isMyReport: userId === this.props.route.params.noticeUserId}));
        this.fetchFosterVolunteerProfiles();
    }

    fetchReportInfo(sessionToken) {
        getJsonData(global.noticeServiceBaseUrl + '/users/' + this.props.route.params.noticeUserId + '/notices/' + this.props.route.params.noticeId,
            {
                'Authorization': 'Basic ' + sessionToken
            }
        ).then(notice => {
            let datetime = new Date(notice.eventTimestamp)
            console.log(notice)
            this.setState({
                reportType: notice.noticeType,
                eventDescription: notice.description,
                date: datetime,
                hour: datetime,
                province: notice.locality,
                city: notice.neighbourhood,
                location: notice.street,
                petId: notice.pet.id,
                latitude:  notice.eventLocation.lat,
                longitude: notice.eventLocation.long
            });
            this.fetchPetInfo(notice, sessionToken);
            this.fetchFosteringInfo(notice.pet.id, sessionToken);
        }).catch(err => {
            console.log(err);
            alert(err);
        });
    }

    fetchPetInfo(notice, sessionToken) {
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

    fetchFosteringInfo(petId, sessionToken) {
        getJsonData(global.noticeServiceBaseUrl + '/pets/' + petId + '/fosterHistory',
            {
                'Authorization': 'Basic ' + sessionToken
            }
        ).then(history => {
            this.setState({
                fosterHistory: history
            });
        }).catch(err => {
            console.log(err);
            alert(err);
        });
    }

    fetchContactInfo() {
        getJsonData(global.noticeServiceBaseUrl + '/users/' + this.props.route.params.noticeUserId + '/contactInfo')
        .then(user => {
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

    changeNewHomeModalVisibility = () => {
        this.setFosteringHomeModalVisible(!this.state.newFosteringHomeModalVisible);
    }

    cleanNewHomeParams = () => {
        this.setState({
            manualVolunteerData: {
                name: '',
                email: '',
                phoneNumber: ''
            },
            existingVolunteer: true,
        });
    }

    cancelAddHomeAction = () => {
        this.changeNewHomeModalVisibility();
        this.cleanNewHomeParams();
    }

    addFosterHome = () => {
        let petId = this.state.petId;
        let name, email, phoneNumber;
        if (this.state.existingVolunteer) {
            let volunteer = this.state.dropdownValue
            name = volunteer.name
            email = volunteer.email
            phoneNumber = volunteer.phoneNumber
        } else {
            name = this.state.manualVolunteerData.name
            email = this.state.manualVolunteerData.email
            phoneNumber = this.state.manualVolunteerData.phoneNumber

            if (!validateEmail(email)) {
                alert('Ingrese un email válido por favor!');
                return;
            }
        }

        postJsonData(global.noticeServiceBaseUrl + '/pets/' + petId + '/fosterHistory', {
            petId: petId,
            contactEmail: email,
            contactPhone: phoneNumber,
            contactName: name,
            sinceDate: this.state.newHomeSinceSelectedDate.toISOString()
        }).then(response => {
            console.log(response);
          }).catch(err => {
            alert(err);
            return;
        });
    }

    addHomeAction = () => {
        this.addFosterHome()
        this.changeNewHomeModalVisibility();
    }

    render() {
        const reportTypeText = mapReportTypeToReportLabel(this.state.reportType);
        const reportTypeLabel = mapReportTypeToLabelColor(this.state.reportType);
        const showHistoryInfo = this.showHistoryInfo();
        const changeContactModalVisibility = () => this.setContactModalVisible(!this.state.contactInfoModalVisible);
        const changeNewHomeModalVisibility = () => this.setFosteringHomeModalVisible(!this.state.newFosteringHomeModalVisible);
        const changeExistingVolunteer = (value) => this.setState({ existingVolunteer: value });

        return (
            <SafeAreaView style={commonStyles.container}>
                <ContactInfoModal 
                    isVisible={this.state.contactInfoModalVisible}
                    onModalClose={changeContactModalVisibility}
                    name={this.state.contactInfo.name}
                    email={this.state.contactInfo.email}
                    phoneNumber={this.state.contactInfo.phoneNumber}
                    onContactInfoOk={changeContactModalVisibility}/> 
                <NewFosteringHomeModal 
                    isVisible={this.state.newFosteringHomeModalVisible} 
                    onModalClose={changeNewHomeModalVisibility}
                    onAddHomePress={this.addHomeAction}
                    onCancelPress={this.cancelAddHomeAction}
                    sinceDate={this.state.newHomeSinceSelectedDate}
                    onSinceDateSelect={(selectedDate) => this.setState({ newHomeSinceSelectedDate: selectedDate })}
                    untilDate={this.state.newHomeUntilSelectedDate}
                    onUntilDateSelect={(selectedDate) => this.setState({ newHomeUntilSelectedDate: selectedDate })} 
                    openDropdown={this.state.openDropdown}
                    onSetOpen={(open) => this.setState({ openDropdown: open })}
                    dropdownValue={this.state.dropdownValue}
                    onSetValue={(callback) => this.setState(state => ({ dropdownValue: callback(state.dropdownValue) }))}
                    volunteers={this.state.volunteers}
                    existingVolunteer={this.state.existingVolunteer}
                    onButtonPress={changeExistingVolunteer}
                    name={this.state.manualVolunteerData.name}
                    phoneNumber={this.state.manualVolunteerData.phoneNumber}
                    email={this.state.manualVolunteerData.email}
                    onNameChange={text => { this.setState({ manualVolunteerData: {
                        ...this.state.manualVolunteerData,
                        name: text
                    }})}}
                    onEmailChange={text => { this.setState({ manualVolunteerData: {
                        ...this.state.manualVolunteerData,
                        email: text
                    }})}}
                    onPhoneNumberChange={text => { this.setState({ manualVolunteerData: {
                        ...this.state.manualVolunteerData,
                        phoneNumber: text
                    }})}} />
                <HeaderWithBackArrow headerText={"Reporte"} headerTextColor={colors.secondary} backgroundColor={colors.white} backArrowColor={colors.secondary} onBackArrowPress={this.navigateToReports} />
                <PetImagesHeader petPhotos={this.state.petPhotos} petName={this.state.name} />

                <View style={{flex: 2}}>
                    <View style={{alignItems: 'flex-start', paddingHorizontal: 35}}>
                        <Title 
                            text={reportTypeText} 
                            textColor={reportTypeLabel}
                            isMyReport={this.state.isMyReport}
                            onEditModePress={this.goToEdit}/>
                        <FosteringHistoryTabSeletor 
                            segmentedTabTitles={segmentedTabTitles} 
                            selectedIndex={this.state.selectedIndex} 
                            onSelectedTabPress={this.handleTabSegmenterIndexChange}
                            showHistoryInfo={showHistoryInfo}/>
                    </View>
                    <ScrollView style={{flex:1, paddingHorizontal: 35}} showsVerticalScrollIndicator={false}>
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
                                fosterHistory: this.state.fosterHistory
                            }}/>
                        <ActionButtons 
                            selectedIndex={this.state.selectedIndex}
                            isMyReport={this.state.isMyReport}
                            guestButtonHandler={{
                                showContactInfo: this.showContactInfo
                            }}
                            myReportButtonHandler={{
                                resolveReport: this.confirmResolveReport
                            }} 
                            fosterInfoButtonHandler={{
                                addNewHome: this.addNewHome
                            }}
                        />
                    </ScrollView>
                </View>
            </SafeAreaView>
        )
    }
}

const EditModePencil = ({isMyReport, onEditModePress}) => {
    return isMyReport ? (
        <TouchableOpacity onPress={onEditModePress}>
            <MaterialIcon name='pencil' size={20} color={colors.secondary} style={{ paddingLeft: 10 }} />
        </TouchableOpacity>
    ) : null;
}

const Title = ({text, textColor, isMyReport, onEditModePress}) => {
    return (
        <View style={{ ...commonStyles.alignedContent, paddingTop: 20, paddingBottom: 10 }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: textColor }}>{text}</Text>
            <EditModePencil isMyReport={isMyReport} onEditModePress={onEditModePress}/>
        </View>
    );
}

const FosteringHistoryTabSeletor = ({segmentedTabTitles, selectedIndex, onSelectedTabPress, showHistoryInfo}) => {
    return showHistoryInfo && (
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

const NewFosteringHomeModal = ({isVisible, onModalClose, onAddHomePress, onCancelPress, sinceDate, onSinceDateSelect, untilDate, onUntilDateSelect, openDropdown, onSetOpen, dropdownValue, onSetValue, volunteers, existingVolunteer, onButtonPress, name, email, phoneNumber, onNameChange, onPhoneNumberChange, onEmailChange}) => {
    return (
        <View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={isVisible}
                onRequestClose={onModalClose}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'stretch' }}>
                   <FosterEntryInfo sinceDate={sinceDate} onSinceDateSelect={onSinceDateSelect} onAddHomePress={onAddHomePress} onCancelPress={onCancelPress} untilDate={untilDate} onUntilDateSelect={onUntilDateSelect} openDropdown={openDropdown} onSetOpen={onSetOpen} dropdownValue={dropdownValue} onSetValue={onSetValue} volunteers={volunteers} existingVolunteer={existingVolunteer} onButtonPress={onButtonPress} name={name} email={email} phoneNumber={phoneNumber} onNameChange={onNameChange} onPhoneNumberChange={onPhoneNumberChange} onEmailChange={onEmailChange}/>
                </View>
            </Modal>
        </View>
    );
}

const FosterEntryInfo = ({sinceDate, onSinceDateSelect, onAddHomePress, onCancelPress, untilDate, onUntilDateSelect, openDropdown, onSetOpen, dropdownValue, onSetValue, volunteers, existingVolunteer, onButtonPress, name, email, phoneNumber, onNameChange, onEmailChange, onPhoneNumberChange}) => {
    return (
        <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Crear nuevo hogar</Text>
            {/* <View style={commonStyles.alignedContent}> */}
                {/* <View style={{flex: 1}}> */}
                    <Text style={[styles.modalText, {fontWeight: 'bold', marginBottom: 0}]}>Fecha de entrada</Text>
                    <View style={{alignItems: 'center', width: '100%'}}>
                        {getDatePicker(sinceDate, onSinceDateSelect, {width: 230})}
                    </View>
                {/* </View> */}
                {/* <View style={{flex: 1}}>
                    <Text style={[styles.modalText, {fontWeight: 'bold'}]}>Fecha de salida</Text>
                    {getDatePicker(untilDate, onUntilDateSelect)}
                </View> */}
            {/* </View> */}
            <Text style={[styles.modalText, {fontWeight: 'bold', marginTop: 10, marginBottom: 5}]}>Voluntario para alojamiento transitorio</Text>
            
            <CheckBoxItem 
                optionIsSelected={existingVolunteer} 
                checkBoxTitle={"Elegir voluntario"} 
                onPress={() => onButtonPress(true)} 
                additionalStyle={{marginBottom: 10}}/>
            
            <DropDownPicker
                open={openDropdown}
                value={dropdownValue}
                items={volunteers}
                setOpen={onSetOpen}
                setValue={onSetValue}
                onSelectItem={item => console.log(item)}
                disabled={!existingVolunteer}
                style={{
                    borderColor: colors.secondary,
                    marginBottom: 10
                }}
                textStyle={{
                    color: colors.clearBlack,
                    fontWeight: 'bold'
                }}
                dropDownContainerStyle={{
                    borderColor: colors.secondary,
                }}
                disabledStyle={{
                    opacity: 0.5
                }}
            />
            <CheckBoxItem 
                optionIsSelected={!existingVolunteer} 
                checkBoxTitle={"Ingresar voluntario manualmente"} 
                onPress={() => onButtonPress(false)} />
            {!existingVolunteer && <>
                <Text style={styles.optionTitle}>Nombre</Text>           
                <OptionTextInput onChangeText={onNameChange} value={name} />
                <Text style={styles.optionTitle}>Teléfono</Text>
                <OptionTextInput onChangeText={onPhoneNumberChange} value={phoneNumber} />
                <Text style={styles.optionTitle}>Correo electrónico</Text>
                <OptionTextInput onChangeText={onEmailChange} value={email} autoCapitalize={"none"} />
            </>}

            <View style={[commonStyles.alignedContent, {marginTop: 10}]}>
                <AppButton buttonText={"Cancelar"} onPress={onCancelPress} additionalButtonStyles={{ alignItems: 'center', flex: 1, width: '50%', backgroundColor: colors.pink }}/>
                <AppButton buttonText={"Agregar"} onPress={onAddHomePress} additionalButtonStyles={{ alignItems: 'center', flex: 1, width: '50%', backgroundColor: colors.primary }}/>
            </View>
        </View>
    );
}

const FosteringInfo = ({historyData}) => {
    let row = []
    row.push(<FosterInfoRow key={"title"}
        sinceDate={<OptionTitle text={"Desde"} additionalStyle={styles.optionTitle} />}
        untilDate={<OptionTitle text={"Hasta"} additionalStyle={styles.optionTitle} />}
        contactInfo={<OptionTitle text={"Contacto"} additionalStyle={styles.optionTitle} />} />
    )
    for (let i = 0; i < historyData.length; i++) {
        row.push(<FosterInfoRow key={"row" + i}
            sinceDate={<DateToDisplay date={historyData[i].sinceDate} />} 
            untilDate={historyData[i].untilDate ? <DateToDisplay date={historyData[i].untilDate} /> : <Text style={[styles.textInput, { fontSize: 13, alignSelf: 'center' }]}>-</Text>} 
            contactInfo={<ContactInfoText data={historyData[i]} />} />)
    }
    return row;
}

const DateToDisplay = ({date}) => {
    return (
        <Text style={[styles.textInput, { fontSize: 13 }]}>{getDate(new Date(date))}</Text>
    );
}

const FosterInfoRow = ({sinceDate, untilDate, contactInfo}) => {
    return (<>
        <View style={[commonStyles.alignedContent]}>
            <View style={{ flexDirection: 'column', flex: 1, alignSelf: 'stretch' }}>
                {sinceDate}
            </View>
            <View style={{ flexDirection: 'column', flex: 1, alignSelf: 'stretch', paddingLeft: 2 }}>
                {untilDate}
            </View>
            <View style={{ flexDirection: 'column', flex: 2, alignSelf: 'stretch', paddingLeft: 10}}>
            {/* <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} > */}

                {contactInfo}
               
            {/* </ScrollView> */}
            </View>
        </View>
        <View style={{
            marginTop: 3,
            borderBottomColor: colors.secondary,
            borderBottomWidth: 1,
        }} />
    </>);
}


const ContactInfoText = ({data}) => {
    return (<>
        <Text style={[styles.textInput, { fontSize: 13 }]}>{data.contactName}</Text>
        <Text style={[styles.textInput, { fontSize: 13 }]} numberOfLines={1} ellipsizeMode="tail">{data.contactEmail}</Text>
        <Text style={[styles.textInput, { fontSize: 13 }]}>{data.contactPhone}</Text>
    </>);
}

function getDate(date) {
    return fillDateWithZero(date.getDate()) + '/' + fillDateWithZero(parseInt(date.getMonth() + 1)) + '/' + date.getFullYear();
}

function fillDateWithZero(date) {
    return ("0" + date).slice(-2);
}

const EventInfo = ({petLocationTitle, eventLocation, eventCity, eventProvince, eventDate, eventHour, eventDescription}) => {
    return (<>
        <OptionTitle text={petLocationTitle} additionalStyle={{ ...styles.optionTitle, paddingTop: 0 }} />
        <Text style={styles.textInput}>{eventLocation}</Text>
        <Text style={[styles.textInput, { paddingTop: 5 }]}>{(eventCity != '' ? eventCity + ", " : "") + eventProvince}</Text>

        <View style={[commonStyles.alignedContent, {justifyContent: 'center'}]}>
            <View style={{ flexDirection: 'column', flex: 0.5 }}>
                <OptionTitle text={"Fecha"} additionalStyle={styles.optionTitle} />
                <Text style={styles.textInput}>{eventDate.getDate() + '/' + fillDateWithZero(parseInt(eventDate.getMonth() + 1)) + '/' + eventDate.getFullYear()}</Text>
            </View>
            <View style={{ flexDirection: 'column', flex: 0.5 }}>
                <OptionTitle text={"Hora"} additionalStyle={styles.optionTitle} />
                <Text style={styles.textInput}>{fillDateWithZero(eventHour.getHours()) + ':' + fillDateWithZero(eventHour.getMinutes())}</Text>
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
        let historyData = fosterInfo.fosterHistory

        const title = <Text style={{fontSize: 16, color: colors.secondary, paddingTop: 10, fontWeight: 'bold'}}>
            {historyData.length == 0 ? "No hay hogares registrados para esta mascota por el momento": "Hogares de tránsito de la mascota"}
            </Text>;

        let history = []
        history.push(title)
        history.push(<FosteringInfo historyData={historyData}/>)
        return history;
    }
    return null;
}

const ContactButton = ({showContactInfo}) => {
    return <AppButton buttonText={"Contacto"} onPress={showContactInfo} additionalButtonStyles={{ ...styles.button, marginHorizontal: 0, marginTop: 40, marginBottom: 60 }}/>;
}

const MyReportButtons = ({resolveReport}) => {
    return (<>
        <AppButton buttonText={"Resolver reporte"} onPress={resolveReport} additionalButtonStyles={{ ...styles.button, backgroundColor: colors.primary, marginHorizontal: 0, marginTop: 40, marginBottom: 60 }}/>
    </>);
}

const ReportButtons = ({isMyReport, guestButtonHandler, myReportButtonHandler}) => {
    if (!isMyReport) {
        return <ContactButton showContactInfo={guestButtonHandler.showContactInfo}/>;
    } else {
        return <MyReportButtons resolveReport={myReportButtonHandler.resolveReport} />
    }
}

const FosterButtons = ({isMyReport, fosterInfoButtonHandler}) => {
    if (isMyReport) {
        return (
            <AppButton 
                buttonText={"Nuevo hogar"} 
                onPress={fosterInfoButtonHandler.addNewHome} 
                additionalButtonStyles={[styles.button, {alignSelf: 'center', marginTop: 30, marginBottom: 50}]} 
                additionalTextStyles={{ paddingLeft: 10 }}
                additionalElement={<FeatherIcon name='plus' size={20} color={colors.white} />} />
        );
    }
    return null;
}

const ActionButtons = ({selectedIndex, isMyReport, guestButtonHandler, myReportButtonHandler, fosterInfoButtonHandler}) => {
    if (selectedIndex == segmentedTabTitles.indexOf(infoTitle)) {
        return <ReportButtons isMyReport={isMyReport} guestButtonHandler={guestButtonHandler} myReportButtonHandler={myReportButtonHandler}/>
    } else if (selectedIndex == segmentedTabTitles.indexOf(historyTitle)) {
        return <FosterButtons isMyReport={isMyReport} fosterInfoButtonHandler={fosterInfoButtonHandler} />
    }
    return null;
}

const styles = StyleSheet.create({
    optionTitle: {
        paddingTop: 20, 
        fontWeight: 'bold',
        color: colors.clearBlack
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
