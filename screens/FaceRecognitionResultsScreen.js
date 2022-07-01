import React from 'react';

import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { Text, Button, StyleSheet, View, FlatList, Switch, TouchableOpacity, Image, Dimensions, SafeAreaView, ActivityIndicator } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Modal from "react-native-modal";
import { Buffer } from 'buffer'

import { getJsonData, postJsonData, deleteJsonData } from '../utils/requests.js';
import { getSecureStoreValueFor } from '../utils/store';
import { mapReportTypeToLabel, mapReportTypeToLabelColor } from '../utils/mappers';
import { HeaderWithBackArrow } from '../utils/headers';
import { AppButton } from "../utils/buttons.js";

import commonStyles from '../utils/styles';
import colors from '../config/colors';

const { height, width } = Dimensions.get("screen")

const MAX_ALERT_MONTHS = 3
const DAYS_PER_MONTH = 30
const MAX_DAYS_ALERT = MAX_ALERT_MONTHS * DAYS_PER_MONTH

/** Implements the Face Recognition results screen. */
export class FaceRecognitionResultsScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            pressedOK: false,
            notices: [],
            selectedIndex: 0,
            isLoading: true,
            contactInfoModalVisible: false,
            searchedNoticeId: props.route.params.noticeId,
            userId: props.route.params.userId,
            alertsActivated: false,
            alertFrequency: 1,
            alertLimitDate: new Date(),
            feedbackDisabled: false
        };
    }
    
    navigateToReportView = (userId, noticeId) => {
        this.props.navigation.push('ReportView', { noticeUserId: userId, noticeId: noticeId });
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
        this.setState({ isLoading : true })
        getSecureStoreValueFor('sessionToken').then((sessionToken) => {
            getJsonData(global.noticeServiceBaseUrl + '/similarPets/' + this.state.searchedNoticeId, 
            {
                'Authorization': 'Basic ' + sessionToken 
            }
            ).then(response => {
                this.setState({ notices: response });
            }).catch(err => {
                console.log(err);
                this.setState({ notices: [] });
            }).finally(() => this.setState({ isLoading : false }));
        });
    }
    
    handleToggleAlerts = () => {
        this.setState(prevState => ({ alertsActivated: !prevState.alertsActivated }))
    }

    async componentDidUpdate() {
        if (this.state.alertsActivated && this.state.pressedOK) {
            console.log(`Activating alerts for user ${this.state.userId}`);

            await postJsonData(global.noticeServiceBaseUrl + '/similarPets/alerts', {
                noticeId: this.state.searchedNoticeId,
                userId: this.state.userId,
                alertFrequency: this.state.alertFrequency,
                alertLimitDate: this.state.alertLimitDate.toISOString().split('T')[0]
            }).then(response => {
                console.log(response);
                setTimeout(() => alert("Alerta creada con éxito!", 3000));
              }).catch(err => {
                alert(err);
                return;
            });
        }

        if (!this.state.alertsActivated && this.state.pressedOK) {
            console.log(`Deactivating alerts for user ${this.state.userId}`);

            await deleteJsonData(global.noticeServiceBaseUrl + '/similarPets/alerts', {
                userId: this.state.userId
            }).then(response => {
                console.log(response);
            }).catch(err => {
                alert(err);
                return;
            });

        }
    }


    render() {

        const closeModalAndInit = async () => {
            this.setState({ contactInfoModalVisible: false, pressedOK: true });
        };

        const sendPredictionFeedback = async () => {
            if (this.state.notices.length == 0) {
                return;
            }

            noticeIdsList = this.state.notices.map(notice => notice.noticeId)
            console.log(`Sending feedback with notices ${noticeIdsList}`)

            postJsonData(global.noticeServiceBaseUrl + '/prediction/result/failure/' + this.state.searchedNoticeId, 
                { predictedNoticeIds: [...noticeIdsList] }
            )
            .then(response => {
                console.log(response);
                alert('Registramos tu respuesta! Sentimos no haber encontrado a tu mascota!')
                this.setState({ feedbackDisabled: true });
                this.props.navigation.goBack();
            }).catch(err => {
                console.error(err);
                this.props.navigation.goBack();
            });  
        };

        const closeModal = async () => {
            this.setState({ contactInfoModalVisible: false });
        };

        const showModal = () => {
            this.setState({ contactInfoModalVisible: true, pressedOK: false });
        };

        const addDaysToToday = (daysToAdd) => {
            var result = new Date();
            result.setDate(result.getDate() + daysToAdd);
            console.log(`MAX DATE ${result}`)
            return result;
        }

        return (<>
        <SafeAreaView
                edges={["top"]}
                style={{ flex: 0, backgroundColor: colors.primary }}/>
            <SafeAreaView
                edges={["left", "right", "bottom"]}
                style={commonStyles.container} >
                <HeaderWithBackArrow headerText={"Resultados"} headerTextColor={colors.white} backgroundColor={colors.primary} backArrowColor={colors.white} onBackArrowPress={() => this.props.navigation.goBack()}/>
                
                <View style={styles.alignedContent}>
                    <Text style={styles.titleText}>Mascotas similares</Text>
                    <MaterialIcon name='notifications' size={24} color={colors.secondary} style={{marginLeft: 5}} onPress={showModal}/>
                </View>

                <View style={styles.modalView}>
                    <Modal 
                        hideModalContentWhileAnimating={true}
                        isVisible={this.state.contactInfoModalVisible}
                        transparent={false}
                        onBackdropPress={closeModal}
                        >
                        <View style={{ backgroundColor: colors.white, padding: 15, borderRadius: 20 }}>
                            <View style={{flexDirection: 'row'}}>
                                <Text style={styles.modalTitle}>Búsquedas programadas</Text>
                                <Switch 
                                    trackColor={{ false: colors.grey, true: colors.yellow }}
                                    thumbColor={ colors.white }
                                    onValueChange={this.handleToggleAlerts}
                                    value={this.state.alertsActivated}
                                />
                            </View>
                            { this.state.alertsActivated ? 
                                <View>
                                    <Text>Serás notificado cada vez que encontremos un match para esta búsqueda!</Text>
                                    <Text style={styles.subtitleText}>Frecuencia de búsqueda</Text>
                                    <Picker selectedValue={this.state.alertFrequency}
                                        style={{ width: 150, marginLeft: '25%', marginRight: 30 }}
                                        itemStyle={{height: 88, fontSize: 16}}
                                        onValueChange={(itemValue, itemIndex) => this.setState({ alertFrequency: itemValue })}
                                        enabled={this.state.alertsActivated}
                                        >
                                        <Picker.Item label="Cada 1 hs" value={1} />
                                        <Picker.Item label="Cada 2 hs" value={2} />
                                        <Picker.Item label="Cada 4 hs" value={4} />
                                        <Picker.Item label="Cada 8 hs" value={8} />
                                        <Picker.Item label="Cada 12 hs" value={12} />
                                    </Picker>
                                    <Text style={styles.subtitleText}>Hasta</Text>
                                    <DateTimePicker
                                        minimumDate={addDaysToToday(1)}
                                        maximumDate={addDaysToToday(MAX_DAYS_ALERT)}
                                        display="spinner"
                                        value={this.state.alertLimitDate}
                                        onChange={(event, selectedDate) => {
                                            this.setState({ alertLimitDate: selectedDate })
                                        }}
                                    />
                                </View> 
                                : <Text>Puedes programar búsquedas para este reporte y te notificaremos cuando encontremos un match!</Text>
                            }
                            <View style={{flexDirection: 'column' }}>
                                <Button style={styles.titleText} color={colors.secondary} title="OK" onPress={closeModalAndInit} />
                            </View>
                        </View>
                    </Modal>
                </View>

                { this.state.isLoading?
                    <View style={{position: 'absolute', top: 100, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.semiTransparent}}>
                        <ActivityIndicator size="large" color={colors.clearBlack}/>
                    </View> : <>
                    { this.state.notices.length > 0 ? 
                        <View style={{flex: 6}}>
                            <View style={{flex: 5, marginTop: 10}}>
                            <FlatList 
                                data={this.state.notices} 
                                numColumns={2}
                                keyExtractor={(_, index) => index.toString()}
                                initialNumToRender={this.state.notices.length}
                                renderItem={this.renderItem}
                                style={{marginLeft: 15}}
                            />
                            </View>
                            <View style={{flex: 1}}>
                            <AppButton
                                buttonText={"Mi mascota no está en esta lista!"} 
                                onPress={sendPredictionFeedback} 
                                isDisabled={this.state.feedbackDisabled}
                                additionalButtonStyles={[styles.button, { backgroundColor: colors.pink, marginTop: 20}]} /> 
                            </View>
                        </View>: 
                        <View>
                            <Text style={{textAlign: 'center', color: colors.yellow, fontSize: 20 }}>
                                Oops!
                            </Text>
                            <Text style={{textAlign: 'center', color: colors.yellow, fontSize: 20, paddingBottom:'80%' }}>
                                No encontramos resultados para tu búsqueda!
                            </Text>
                        </View>
                    }</>
                }
                </SafeAreaView>
                </>
            )
    }
}

const styles = StyleSheet.create({
    button: {
        marginTop: 10,
        alignSelf: 'center',
        width: width - 60,
    },
    titleText: {
        color: colors.clearBlack, 
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 5,
        marginLeft: 20
    },
    subtitleText: {
        color: colors.clearBlack, 
        fontSize: 15,
        fontWeight: 'bold',
        padding: 10,
        marginTop: 10,
    },
    alignedContent: {
        ...commonStyles.alignedContent,
        marginTop: 10
    },
    modalView: {
        width: '90%',
    },
    modalTitle: {
        marginTop: 10,
        marginBottom: 15,
        marginRight: 20,
        color: colors.secondary,
        fontWeight: 'bold',
        fontSize: 18,
        textAlign: "center"
    },
    modalText: {
      marginBottom: 15,
      color: colors.clearBlack
    },
});
