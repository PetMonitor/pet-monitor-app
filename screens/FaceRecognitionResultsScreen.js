import React from 'react';

import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { Text, Button, StyleSheet, View, FlatList, Switch, TouchableOpacity, Image, Dimensions } from 'react-native';
import { getJsonData, postJsonData, deleteJsonData } from '../utils/requests.js';
import { getSecureStoreValueFor } from '../utils/store';
import { Buffer } from 'buffer'
import { mapReportTypeToLabel, mapReportTypeToLabelColor } from '../utils/mappers';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

import colors from '../config/colors';

import Modal from "react-native-modal";

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
            alertLimitDate: new Date()
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
        getSecureStoreValueFor('sessionToken').then((sessionToken) => {
            getJsonData(global.noticeServiceBaseUrl + '/similarPets/' + this.state.searchedNoticeId, 
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

        return (
            <View style={styles.container}>
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
                                <Text style={styles.modalTitle}>Búsquedas Programadas</Text>
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
                                    <Text style={styles.subtitleText}>Frecuencia de Búsqueda</Text>
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
                                <Button style={styles.titleText} title="OK" onPress={closeModalAndInit} />
                            </View>
                        </View>
                    </Modal>
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
    subtitleText: {
        color: colors.clearBlack, 
        fontSize: 15,
        fontWeight: 'bold',
        padding: 10,
    },
    alignedContent: {
        alignItems:'center', 
        flexDirection: 'row', 
        marginTop: 10
    },
    modalView: {
        flex: 1,
        margin: 20,
        padding: 35,
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
