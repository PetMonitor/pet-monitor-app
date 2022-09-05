import React from 'react';

import { getSecureStoreValueFor } from '../utils/store';
import { getJsonData, deleteJsonData, postJsonData, putJsonData, getLocationFromCoordinates } from '../utils/requests.js';
import { CheckBoxItem, getDatePicker, OptionTextInput, OptionTitle } from '../utils/editionHelper.js';
import { HeaderWithBackArrow } from '../utils/headers';
import { PetImagesHeader } from '../utils/images.js';
import { AppButton } from '../utils/buttons.js';

import {  Alert, Text, SafeAreaView, View, Image, Dimensions, TouchableOpacity, StyleSheet, ScrollView, Modal } from 'react-native';

import FeatherIcon from 'react-native-vector-icons/Feather';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import SegmentedControlTab from "react-native-segmented-control-tab";
import * as Location from 'expo-location';

import { mapReportTypeToLabelColor, mapPetTypeToLabel, mapPetSexToLabel, mapPetSizeToLabel, mapPetLifeStageToLabel, mapReportTypeToPetLocationTitle, mapReportTypeToReportLabel } from '../utils/mappers';

import commonStyles from '../utils/styles';
import colors from '../config/colors';

import DropDownPicker from 'react-native-dropdown-picker';
import { validateEmail } from '../utils/commons';
import { ContactInfoModal } from '../utils/contactInfoModal';

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
            reportOwnerInfo: {
                name: '',
                email: '',
                phoneNumber: ''
            },
            userToContactInfo: {
                name: '',
                email: '',
                phoneNumber: ''
            },
            selectedIndex: 0,
            contactInfoModalVisible: false,
            newFosteringHomeModalVisible: false,
            isMyReport: this.props.route.params.isMyReport,
            noticeId: this.props.route.params.noticeId,
            homeSinceSelectedDate: new Date(),
            homeUntilSelectedDate: new Date(),
            volunteers: [],
            openDropdown: false,
            dropdownValue: null,
            existingVolunteer: true,
            fosterHistory: [],
            refresh: false,
            historyDataToEdit: null,
            manualVolunteerData: {
                name: '',
                email: '',
                phoneNumber: '',
                userId: ''
            },
            filterByRegion: true,
            searchRegion: "",
            emailMessage: ""
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

    showContactInfo = (userToContactData) => {
        this.setContactModalVisible(true);
        this.setState({
            userToContactInfo: {
                name: userToContactData.name,
                email: userToContactData.email,
                phoneNumber: userToContactData.phoneNumber
            },
        })
    }

    resolveReport = () => {
        getSecureStoreValueFor('sessionToken').then((sessionToken) => {
            deleteJsonData(global.noticeServiceBaseUrl + '/users/' + this.props.route.params.noticeUserId + '/notices/' + this.state.noticeId, 
            {},
            {
                'Authorization': 'Basic ' + sessionToken 
            }).then(response => {
                console.log(`Delete pet endpoint returned ${response}`)

                this.props.navigation.navigate('ViewUserDetails');
                this.props.route.params.onReportDeleted(this.state.noticeId);
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

    addNewHomeButton = () => {
        this.setState({
            homeSinceSelectedDate: new Date(),
            homeUntilSelectedDate: new Date(),
            manualVolunteerData: {
                name: '',
                email: '',
                phoneNumber: '',
                userId: ''
            },
        })
        this.setFosteringHomeModalVisible(true);
    }

    editHomeButton = (historyData) => {
        this.setFosteringHomeModalVisible(true);
        this.setState({ 
            historyDataToEdit: historyData,
            manualVolunteerData: {
                name: historyData.contactName,
                email: historyData.contactEmail,
                phoneNumber: historyData.contactPhone,
                userId: historyData.userId,
            },
            homeSinceSelectedDate: new Date(historyData.sinceDate),
            homeUntilSelectedDate: new Date(historyData.untilDate ? historyData.untilDate : new Date()),
         });
    }

    selectedLocation = (locations) => {
        let maxConfidence = 0
        let selected = 0
        for (let i = 0; i < locations.length; i++) {
            if (locations[i].confidence > maxConfidence) {
                maxConfidence = locations[i].confidence
                selected = i
            }
        }
        return locations[selected]
    }

    fillLocationInfo = (latitude, longitude) => {
        getLocationFromCoordinates(latitude, longitude)
        .then(response => {
            let eventLocation = this.selectedLocation(response.data)
            let userRegion = null
            if (eventLocation.neighbourhood) {
                userRegion = eventLocation.neighbourhood;
            } else if (eventLocation.locality) {
                userRegion = eventLocation.locality;
            }
            this.setState({
                filterByRegion: userRegion != "" ? true : false,
                searchRegion: userRegion
            }, () => this.fetchFosterVolunteerProfiles())
        }).catch(err => {
            alert(err)
        })
    }

    fetchFosterVolunteerProfiles() {
        let regionFilter = (this.state.filterByRegion && this.state.searchRegion != "") ? `?profileRegion=${this.state.searchRegion}` : ""
        getSecureStoreValueFor('sessionToken').then((sessionToken) => {
            getSecureStoreValueFor("userId").then(userId => {
                getJsonData(global.noticeServiceBaseUrl + '/fosterVolunteerProfiles' + regionFilter, { 'Authorization': 'Basic ' + sessionToken }
                ).then(profilesInfo => {
                    let volunteers = []
                    let promises = []
                    for (let i = 0; i < profilesInfo.length; i++) {
                        let profileUserId = profilesInfo[i].userId
                        promises.push(getJsonData(global.noticeServiceBaseUrl + '/users/' + profileUserId + '/contactInfo',
                        ).then(userInfo => {
                            let volunteerInfo = {
                                label: `--- ${userInfo.name} ---\n${profilesInfo[i].location}, ${profilesInfo[i].province}`,
                                value: profileUserId
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
                            volunteers.sort((a, b) => a.label.toLowerCase().localeCompare(b.label.toLowerCase()))
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
        Location.requestForegroundPermissionsAsync()
        .then( response => {
            if (response.status !== 'granted') {
                Alert.alert('', 'Permiso para acceder a la ubicación del dispositivo denegado');
                return;
            }

            Location.getCurrentPositionAsync({})
            .then(userLocation => {
                this.fillLocationInfo(userLocation.coords.latitude, userLocation.coords.longitude);
            });
        });
        // this.fetchFosterVolunteerProfiles();
    }

    componentDidUpdate() {
        if (this.state.refresh) {
            this.setState({ refresh: false });
            getSecureStoreValueFor('sessionToken').then((sessionToken) => {
                this.fetchReportInfo(sessionToken);
            });
        }
    }

    fetchReportInfo(sessionToken) {
        getJsonData(global.noticeServiceBaseUrl + '/users/' + this.props.route.params.noticeUserId + '/notices/' + this.props.route.params.noticeId,
            {
                'Authorization': 'Basic ' + sessionToken
            }
        ).then(notice => {
            let datetime = new Date(notice.eventTimestamp)
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
            history.sort((a, b) => {
                if (a.sinceDate > b.sinceDate) {
                    return 1;
                } else if (a.sinceDate < b.sinceDate) {
                    return -1;
                } else if (a.untilDate && b.untilDate) {
                    if (a.untilDate > b.untilDate) {
                        return 1;
                    }
                    return -1;
                } else if (b.untilDate) {
                    return 1;
                }
                return -1;
            });

            let promises = []

            for (let i = 0; i < history.length; i++) {
                let userId = history[i].userId

                if (!userId) {
                    continue;
                }

                promises.push(getJsonData(global.noticeServiceBaseUrl + '/users/' + userId + '/contactInfo',
                ).then(userInfo => {
                    history[i] = {
                        ...history[i],
                        contactName: userInfo.name,
                        contactPhone: userInfo.phoneNumber,
                        contactEmail: userInfo.email

                    }
                }).catch(err => {
                    console.log(err);
                    alert(err);
                }))
            }
            Promise.all(promises)
            .then(() => {
                this.setState({
                    fosterHistory: history
                });
            })
            .catch(err => {
                console.log(err);
                alert(err);
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
                reportOwnerInfo: {
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

    cleanHomeParams = () => {
        this.setState({
            manualVolunteerData: {
                name: '',
                email: '',
                phoneNumber: '',
                userId: ''
            },
            existingVolunteer: true,
            historyDataToEdit: null,
        });
    }

    cancelHomeAction = () => {
        this.changeNewHomeModalVisibility();
        this.cleanHomeParams();
    }

    updateLastHistoryEntryUntilDate = (lastHistoryEntry) => {
        let petId = this.state.petId;

        let updatedHome = {
            ...lastHistoryEntry,
            untilDate: new Date().toISOString()
        }
        delete updatedHome['historyId']
        console.log(updatedHome)
        console.log(lastHistoryEntry)

        getSecureStoreValueFor('sessionToken').then((sessionToken) => {
            putJsonData(global.noticeServiceBaseUrl + '/pets/' + petId + '/fosterHistory/' + lastHistoryEntry.historyId,
                updatedHome,
                {
                    'Authorization': 'Basic ' + sessionToken
                }).then(response => {
                    console.log(`History data successfully updated!`);
                }).catch(err => {
                    console.log(err);
                    alert(err);
                });
        });
    }

    addFosterHome = () => {
        let petId = this.state.petId;

        let newHome = {
            petId: petId,
            sinceDate: this.state.homeSinceSelectedDate.toISOString()
        }
        if (this.state.existingVolunteer) {
            newHome.userId = this.state.dropdownValue
        } else {
            let email = this.state.manualVolunteerData.email

            if (!validateEmail(email)) {
                Alert.alert('', 'Ingrese un email válido por favor!');
                return;
            }
            newHome.contactName = this.state.manualVolunteerData.name
            newHome.contactEmail = email
            newHome.contactPhone = this.state.manualVolunteerData.phoneNumber
            newHome.userId = null
        }
        
        postJsonData(global.noticeServiceBaseUrl + '/pets/' + petId + '/fosterHistory', newHome).then(response => {
            console.log(`History data successfully created!`);

            let fosterHistory = this.state.fosterHistory
            if (fosterHistory.length > 0) {
                let lastHistoryEntry = fosterHistory[fosterHistory.length - 1] 
                if (!lastHistoryEntry.untilDate) {
                    this.updateLastHistoryEntryUntilDate(lastHistoryEntry);
                }
            }
            this.setState({ refresh: true })
            Alert.alert('', `Hogar de tránsito agregado!`);
        }).catch(err => {
            alert(err);
        });
        this.changeNewHomeModalVisibility();
        this.cleanHomeParams();
    }

    editFosterHomeData(historyData) {
        let petId = this.state.petId;

        let existingProfileId = historyData.userId
        let updatedHome = {
            _ref: historyData._ref,
            petId: historyData.petId,
            sinceDate: this.state.homeSinceSelectedDate.toISOString(),
            untilDate: this.state.homeUntilSelectedDate.toISOString(),
        }

        if (existingProfileId) {
            updatedHome = {
                ...updatedHome,
                userId: historyData.userId,
            }
        } else {
            updatedHome = {
                ...updatedHome,
                contactEmail: this.state.manualVolunteerData.email,
                contactName: this.state.manualVolunteerData.name,
                contactPhone: this.state.manualVolunteerData.phoneNumber,
            }
        }

        getSecureStoreValueFor('sessionToken').then((sessionToken) => {
            putJsonData(global.noticeServiceBaseUrl + '/pets/' + petId + '/fosterHistory/' + historyData.historyId,
                updatedHome,
                {
                    'Authorization': 'Basic ' + sessionToken
                }).then(response => {
                    console.log(`History data successfully updated!`);
                    this.setState({ refresh: true })
                    Alert.alert('', `Hogar de tránsito actualizado!`);
                }).catch(err => {
                    console.log(err);
                    alert(err);
                });
        });
        this.cleanHomeParams();
        this.changeNewHomeModalVisibility();
    }

    sendEmailToUser = (user) => {
        postJsonData(global.noticeServiceBaseUrl + '/emails',
            {
                sendTo: user.email,
                message: this.state.emailMessage,
                contactEmail: this.state.contactInfo.email,
                contactPhoneNumber: this.state.contactInfo.phoneNumber
            }).then(response => {
                Alert.alert('', `Mensaje enviado!`);
            }).catch(err => {
                console.log(err);
                alert(err);
            });
    }

    render() {
        const reportTypeText = mapReportTypeToReportLabel(this.state.reportType);
        const reportTypeLabel = mapReportTypeToLabelColor(this.state.reportType);
        const showHistoryInfo = this.showHistoryInfo();
        const changeNewHomeModalVisibility = () => this.setFosteringHomeModalVisible(!this.state.newFosteringHomeModalVisible);
        const changeExistingVolunteer = (value) => this.setState({ existingVolunteer: value });
        // Contact modal related logic
        const changeContactModalVisibility = () => this.setContactModalVisible(!this.state.contactInfoModalVisible);
        const changeEmailMessage = (value) => this.setState({ emailMessage: value });
        const changeContactName = (value) => this.setState({ contactInfo: {...this.state.contactInfo, name: value} });
        const changeContactEmail = (value) => this.setState({ contactInfo: {...this.state.contactInfo, email: value} });
        const changeContactPhoneNumber = (value) => this.setState({ contactInfo: {...this.state.contactInfo, phoneNumber: value} });
        const onContactUserPress = () => {
            if (this.state.contactInfo.name == "" || this.state.contactInfo.email == "" || this.state.contactInfo.phoneNumber == "") {
                Alert.alert('', 'Ingrese la información de contacto por favor!');
                return;  
            }
            if (!validateEmail(this.state.contactInfo.email)) {
                Alert.alert('', 'Ingrese un email válido por favor!');
                return;  
            } 
            if (this.state.emailMessage == "") {
                Alert.alert('', 'No podemos mandar un email vacío!');
                return;  
            }
            // console.log(this.state.userToContactInfo)
            this.sendEmailToUser(this.state.userToContactInfo)
            this.setState({ 
                contactInfo: {
                    name: '',
                    email: '',
                    phoneNumber: ''
                },
                emailMessage: ''
            }, () => changeContactModalVisibility());
        }

        const onCancelPress = () => {
            this.setState({ 
                contactInfo: {
                    name: '',
                    email: '',
                    phoneNumber: ''
                },
                emailMessage: ''
            }, () => changeContactModalVisibility());
        }

        return (
            <SafeAreaView style={commonStyles.container}>
                <ContactInfoModal 
                    isVisible={this.state.contactInfoModalVisible}
                    onModalClose={changeContactModalVisibility}
                    name={this.state.contactInfo.name}
                    email={this.state.contactInfo.email}
                    phoneNumber={this.state.contactInfo.phoneNumber}
                    onContactUserPress={onContactUserPress}
                    emailMessage={this.state.emailMessage}
                    onChangeEmailMessage={changeEmailMessage}
                    onChangeName={changeContactName}
                    onChangeEmail={changeContactEmail} 
                    onChangePhoneNumber={changeContactPhoneNumber}
                    onCancelPress={onCancelPress} /> 
                <NewFosteringHomeModal 
                    isVisible={this.state.newFosteringHomeModalVisible} 
                    onModalClose={changeNewHomeModalVisibility}
                    onAddHomePress={this.addFosterHome}
                    onCancelPress={this.cancelHomeAction}
                    sinceDate={this.state.homeSinceSelectedDate}
                    onSinceDateSelect={(selectedDate) => this.setState({ homeSinceSelectedDate: selectedDate })}
                    untilDate={this.state.homeUntilSelectedDate}
                    onUntilDateSelect={(selectedDate) => this.setState({ homeUntilSelectedDate: selectedDate })} 
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
                    }})}}
                    dataToEdit={this.state.historyDataToEdit}
                    onEditHomePress={() => this.editFosterHomeData(this.state.historyDataToEdit)}
                    searchRegion={this.state.searchRegion}
                    onSearchRegionChange={text => this.setState({ searchRegion: text })}
                    onSearchPress={() => this.fetchFosterVolunteerProfiles()}
                    />
                <HeaderWithBackArrow headerText={"Reporte"} headerTextColor={colors.secondary} backgroundColor={colors.white} backArrowColor={colors.secondary} onBackArrowPress={this.navigateToReports} />
                <PetImagesHeader petPhotos={this.state.petPhotos} petName={this.state.name} />

                <View style={{flex: 2}}>
                    <View style={{alignItems: 'flex-start', paddingHorizontal: 35}}>
                        <Title 
                            text={reportTypeText} 
                            textColor={reportTypeLabel}
                            isMyReport={this.state.isMyReport && this.state.selectedIndex == segmentedTabTitles.indexOf(infoTitle)}
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
                            }}
                            onEditPress={(dataToEdit) => this.editHomeButton(dataToEdit)} 
                            isMyReport={this.state.isMyReport}
                            onContactUserPress={user => this.showContactInfo(user)} />
                        <ActionButtons 
                            selectedIndex={this.state.selectedIndex}
                            isMyReport={this.state.isMyReport}
                            guestButtonHandler={{
                                showContactInfo: () => this.showContactInfo(this.state.reportOwnerInfo)
                            }}
                            myReportButtonHandler={{
                                resolveReport: this.confirmResolveReport
                            }} 
                            fosterInfoButtonHandler={{
                                addNewHome: this.addNewHomeButton
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

const NewFosteringHomeModal = ({isVisible, onModalClose, onAddHomePress, onCancelPress, sinceDate, onSinceDateSelect, untilDate, onUntilDateSelect, openDropdown, onSetOpen, dropdownValue, onSetValue, volunteers, existingVolunteer, onButtonPress, name, email, phoneNumber, onNameChange, onPhoneNumberChange, onEmailChange, dataToEdit, onEditHomePress, searchRegion, onSearchRegionChange, onSearchPress}) => {
    return (
        <View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={isVisible}
                onRequestClose={onModalClose}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'stretch' }}>
                   <FosterEntryInfo sinceDate={sinceDate} onSinceDateSelect={onSinceDateSelect} onAddHomePress={onAddHomePress} onCancelPress={onCancelPress} untilDate={untilDate} onUntilDateSelect={onUntilDateSelect} openDropdown={openDropdown} onSetOpen={onSetOpen} dropdownValue={dropdownValue} onSetValue={onSetValue} volunteers={volunteers} existingVolunteer={existingVolunteer} onButtonPress={onButtonPress} name={name} email={email} phoneNumber={phoneNumber} onNameChange={onNameChange} onPhoneNumberChange={onPhoneNumberChange} onEmailChange={onEmailChange} dataToEdit={dataToEdit} onEditHomePress={onEditHomePress} searchRegion={searchRegion} onSearchRegionChange={onSearchRegionChange} onSearchPress={onSearchPress} />
                </View>
            </Modal>
        </View>
    );
}

const FosterEntryInfo = ({sinceDate, onSinceDateSelect, onAddHomePress, onCancelPress, untilDate, onUntilDateSelect, openDropdown, onSetOpen, dropdownValue, onSetValue, volunteers, existingVolunteer, onButtonPress, name, email, phoneNumber, onNameChange, onEmailChange, onPhoneNumberChange, dataToEdit, onEditHomePress, searchRegion, onSearchRegionChange, onSearchPress}) => {
    return (
        <View style={styles.modalView}>
            <Text style={[styles.modalTitle, {marginBottom: 25}]}>{dataToEdit ? "Editar hogar" : "Crear nuevo hogar"}</Text>
            {dataToEdit ? 
                <View style={commonStyles.alignedContent}>
                    <View style={{flex: 1}}>
                        <Text style={[styles.modalText, {fontWeight: 'bold', marginBottom: 0}]}>Fecha de entrada</Text>
                        {getDatePicker(sinceDate, onSinceDateSelect)}
                    </View>
                    <View style={{flex: 1}}>
                        <Text style={[styles.modalText, {fontWeight: 'bold', marginBottom: 0}]}>Fecha de salida</Text>
                        {getDatePicker(untilDate, onUntilDateSelect)}
                    </View>
                </View> 
                : <>
                <Text style={[styles.modalText, {fontWeight: 'bold', marginBottom: 0}]}>Fecha de entrada</Text>
                <View style={{alignItems: 'center', width: '100%'}}>
                    {getDatePicker(sinceDate, onSinceDateSelect, {width: 120, marginTop: 5})}
                </View>
            </> }
            
            {dataToEdit ? 
                dataToEdit.userId == null ? <>
                <Text style={[styles.modalText, {fontWeight: 'bold', marginTop: 20, marginBottom: 5}]}>Voluntario para alojamiento transitorio</Text>
                <Text style={[styles.optionTitle, {paddingTop: 5, fontWeight: '500'}]}>Nombre</Text>           
                <OptionTextInput onChangeText={onNameChange} value={name} />
                <Text style={[styles.optionTitle, {fontWeight: '500'}]}>Teléfono</Text>
                <OptionTextInput onChangeText={onPhoneNumberChange} value={phoneNumber} />
                <Text style={[styles.optionTitle, {fontWeight: '500'}]}>Correo electrónico</Text>
                <OptionTextInput onChangeText={onEmailChange} value={email} autoCapitalize={"none"} />
                </> : <></>
            : <>
            <Text style={[styles.modalText, {fontWeight: 'bold', marginTop: 20, marginBottom: 5}]}>Voluntario para alojamiento transitorio</Text>
            <CheckBoxItem 
                optionIsSelected={existingVolunteer} 
                checkBoxTitle={"Elegir voluntario"} 
                onPress={() => onButtonPress(true)} 
                additionalStyle={{marginBottom: 10}}/>
                {existingVolunteer ?
                <View>
                    <Text style={{color: colors.clearBlack, marginTop: 10}}>Filtrar voluntarios por región</Text>
                    <View style={commonStyles.alignedContent}>
                        <OptionTextInput value={searchRegion} placeholder={"Región"} 
                        onChangeText={onSearchRegionChange}
                        additionalStyle={{flex: 2, marginTop: 0, padding: 8}} />
                        <AppButton buttonText={"Filtrar"} onPress={onSearchPress} additionalButtonStyles={{flex: 1, marginTop: 10, padding: 8}} isDisabled={ searchRegion === ""} />
                    </View> 
                </View>
                : <></>}
            
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
            </>}

            <View style={[commonStyles.alignedContent, {marginTop: 20}]}>
                <AppButton buttonText={"Cancelar"} onPress={onCancelPress} additionalButtonStyles={{ alignItems: 'center', flex: 1, width: '50%', backgroundColor: colors.pink }}/>
                <AppButton buttonText={dataToEdit ? "Actualizar" : "Agregar"} onPress={dataToEdit ? onEditHomePress : onAddHomePress} additionalButtonStyles={{ alignItems: 'center', flex: 1, width: '50%', backgroundColor: colors.primary }}/>
            </View>
        </View>
    );
}

const FosteringInfo = ({historyData, onEditPress, isMyReport, onContactUserPress}) => {
    let row = []
    row.push(<FosterInfoRow key={"title"}
        sinceDate={<OptionTitle text={"Desde"} additionalStyle={[styles.optionTitle, {marginLeft: 0, paddingLeft: 20}]} />}
        untilDate={<OptionTitle text={"Hasta"} additionalStyle={[styles.optionTitle, {marginLeft: 0, paddingLeft: 20}]} />}
        contactInfo={<OptionTitle text={"Contacto"} additionalStyle={[styles.optionTitle, {alignSelf: 'center', paddingLeft: 30}]} />} />
    )
    for (let i = 0; i < historyData.length; i++) {
        row.push(<FosterInfoRow key={"row" + i}
            sinceDate={<DateToDisplay date={historyData[i].sinceDate} />} 
            untilDate={historyData[i].untilDate ? <DateToDisplay date={historyData[i].untilDate} /> : <Text style={[styles.textInput, { fontSize: 13, alignSelf: 'center' }]}>-</Text>} 
            contactInfo={<ContactButton showContactInfo={() => onContactUserPress({ name: historyData[i].contactName, email: historyData[i].contactEmail, phoneNumber: historyData[i].contactPhone })} additionalStyle={{margin: 0, marginTop: 7, marginBottom: 5, padding: 5, width: '80%', alignSelf: 'center', marginLeft: 15}} additionalTextStyles={{fontSize: 14}} />} 
            dataToEdit={historyData[i]} 
            onEditPress={onEditPress}
            isMyReport={isMyReport} />)
    }
    return row;
}

const DateToDisplay = ({date}) => {
    return (
        <Text style={[styles.textInput, { fontSize: 13, paddingTop: 0, alignSelf: 'center', marginLeft: 0, paddingLeft: 0}]}>{getDate(new Date(date))}</Text>
    );
}

const FosterInfoRow = ({sinceDate, untilDate, contactInfo, dataToEdit = null, onEditPress, isMyReport = false}) => {
    return (<>
        <View style={[commonStyles.alignedContent, {marginHorizontal: 0}]}>
            <View style={{ flexDirection: 'column', flex: 2, padding: 0}}>
                {sinceDate}
            </View>
            <View style={{ flexDirection: 'column', flex: 2, padding: 0}}>
                {untilDate}
            </View>
            <View style={{ flexDirection: 'column', flex: 3, padding: 0}}>
                <View style={commonStyles.alignedContent}>
                {contactInfo}
                {isMyReport &&
                    <View style={{ flexDirection: 'column', alignSelf: 'stretch', justifyContent: 'center', marginLeft: 10}}>
                        <TouchableOpacity onPress={() => onEditPress(dataToEdit)}>
                            <MaterialIcon name='pencil' size={20} color={colors.secondary} />
                        </TouchableOpacity>
                    </View>
                }
                </View>
            </View>
        </View>
        <View style={{
            marginTop: 3,
            borderBottomColor: colors.secondary,
            borderBottomWidth: 1,
            marginHorizontal: -25
        }} />
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

const ReportContent = ({selectedIndex, reportInfo, fosterInfo, onEditPress, isMyReport, onContactUserPress}) => {
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
        {historyData.length != 0 ? history.push(<FosteringInfo historyData={historyData} onEditPress={onEditPress} isMyReport={isMyReport} onContactUserPress={onContactUserPress} />) : <></>}
        return history;
    }
    return null;
}

const ContactButton = ({showContactInfo, additionalStyle = {}, additionalTextStyles = {}}) => {
    return <AppButton buttonText={"Enviar mensaje"} onPress={showContactInfo} additionalButtonStyles={{ ...styles.button, ...additionalStyle }} additionalTextStyles={additionalTextStyles} />;
}

const MyReportButtons = ({resolveReport}) => {
    return (<>
        <AppButton buttonText={"Resolver reporte"} onPress={resolveReport} additionalButtonStyles={{ ...styles.button, backgroundColor: colors.primary, marginHorizontal: 0, marginTop: 40, marginBottom: 60 }}/>
    </>);
}

const ReportButtons = ({isMyReport, guestButtonHandler, myReportButtonHandler}) => {
    if (!isMyReport) {
        return <ContactButton showContactInfo={guestButtonHandler.showContactInfo} additionalStyle={{marginHorizontal: 0, marginTop: 40, marginBottom: 60}}/>;
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
        return <ReportButtons isMyReport={isMyReport} guestButtonHandler={guestButtonHandler} myReportButtonHandler={myReportButtonHandler} />
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