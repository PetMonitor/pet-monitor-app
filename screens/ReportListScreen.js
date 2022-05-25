import React from 'react';
import { Text, SafeAreaView, View, FlatList, Image, Dimensions, TouchableOpacity, StyleSheet } from 'react-native';
import { getJsonData } from '../utils/requests.js';
import { getSecureStoreValueFor } from '../utils/store';
import { Buffer } from 'buffer'
import { mapReportTypeToLabel, mapReportTypeToLabelColor, mapReportTypeToMapMarkerColor, mapReportTypeToMapMarker } from '../utils/mappers';

import SegmentedControlTab from "react-native-segmented-control-tab";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import MapView, { Callout, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';

import colors from '../config/colors';

const { height, width } = Dimensions.get("screen")

/** Implements the screen that lists all the pets' reports. */
export class ReportListScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            notices: [],
            selectedIndex: this.props.selectedIndex ? this.props.selectedIndex : 0,
            isLoading: true,
            location: null,
        };
    }

    objectIsEmpty = (object) => {
        return Object.keys(object).length === 0
    }

    truncate = (str, maxLength) => {
        return (str.length > maxLength) ? str.substr(0, maxLength - 1) + '...' : str;
    };

    getFilters = () => {
        const filters = this.props.route.params.filters
        var filtersToApply = {}


        if (!filters || (filters && this.objectIsEmpty(filters))) {
            return filtersToApply
        }

        if (filters.breed != '') {
            filtersToApply.breed = filters.breed
        }

        if (filters.region != '') {
            filtersToApply.region = filters.region
        }
        
        if (!(filters.lostPetIsSelected && filters.petForAdoptionIsSelected && filters.petFoundIsSelected)) {
            var reportTypes = []
            if (filters.lostPetIsSelected) {
                reportTypes.push('LOST')
                reportTypes.push('STOLEN')
            }
            if (filters.petForAdoptionIsSelected) {
                reportTypes.push('FOR_ADOPTION')
            }
            if (filters.petFoundIsSelected) {
                reportTypes.push('FOUND')
            }
            if (reportTypes.length > 0) {
                filtersToApply.reportType = reportTypes.join(",")
            }
        }
        if (!(filters.catIsSelected && filters.dogIsSelected)) {
            if (filters.catIsSelected) {
                filtersToApply.petType = 'CAT'
            }
            if (filters.dogIsSelected) {
                filtersToApply.petType = 'DOG'
            }
        }
        if (!(filters.femaleIsSelected && filters.maleIsSelected)) {
            if (filters.femaleIsSelected) {
                filtersToApply.petSex = 'FEMALE'
            }
            if (filters.maleIsSelected) {
                filtersToApply.petSex = 'MALE'
            }
        }
        return filtersToApply
    }

    renderItem = ({item}) =>  {
        return (
            <TouchableOpacity onPress={() => this.navigateToReportView(item.userId, item.noticeId)}>
                <Image style={{height: (width - 20) / 2, width:  (width - 20) / 2, borderRadius: 5, margin: 5}}
                        source={{uri:`data:image/png;base64,${Buffer.from(item.pet.photo).toString('base64')}`}}
                />
                <Text style={{fontSize: 16, fontWeight: 'bold', color: mapReportTypeToLabelColor(item.noticeType), paddingLeft: 7, paddingBottom: 20}}>{mapReportTypeToLabel(item.noticeType)}</Text> 
            </TouchableOpacity>
        )
    }

    showBoxItem = (checkBoxTitle, color) => (
        <>
            <Icon
                name={'checkbox-blank'}
                size={20}
                color={color}
                style={{marginLeft: 5}}
            />
            <Text style={styles.checkBoxOptionTitle}>{checkBoxTitle}</Text>
        </>
    )

    handleTabSegmenterIndexChange = index => {
        this.setState({
          selectedIndex: index
        });
    };

    navigateToReportView = (userId, noticeId) => {
        this.props.navigation.push('ReportView', { noticeUserId: userId, noticeId: noticeId, isMyReport: false });
    }

    navigateToFilterSettings = () => {
        // Navigate to filter settings page.
        this.props.navigation.navigate('ReportListFilter', {filters: this.props.route.params ? this.props.route.params.filters : undefined}); 
    }

    componentDidUpdate(prevProps) {
        if (this.props.route.params) {
            let filters = this.props.route.params.filters
            if ((filters && !prevProps.route.params) || (filters != prevProps.route.params.filters)) {
                let queryParams = ''
                
                if (!this.objectIsEmpty(filters)) {
                    queryParams = '?'
                    
                    const filtersToApply = this.getFilters()
                    queryParams += filtersToApply.petSex ? "petSex=" + filtersToApply.petSex + "&" : ""
                    queryParams += filtersToApply.petType ? "petType=" + filtersToApply.petType + "&" : ""
                    queryParams += filtersToApply.breed ? "petBreed=" + filtersToApply.breed + "&" : ""
                    queryParams += filtersToApply.reportType ? "noticeType=" + filtersToApply.reportType + "&" : ""
                    queryParams += filtersToApply.region ? "noticeRegion=" + filtersToApply.region + "&" : ""
                }

                getSecureStoreValueFor('sessionToken').then((sessionToken) => {
                    getJsonData(global.noticeServiceBaseUrl + '/notices' + queryParams, 
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
        }
    }

    componentDidMount() {
        Location.requestForegroundPermissionsAsync()
        .then( response => {
            if (response.status !== 'granted') {
                alert('Permission to access location was denied');
                return;
            }

            Location.getCurrentPositionAsync({})
            .then(location => {
                this.setState({ location: location })
            });
        });
        getSecureStoreValueFor('sessionToken').then((sessionToken) => {
            getJsonData(global.noticeServiceBaseUrl + '/notices', 
            {
                'Authorization': 'Basic ' + sessionToken 
            }
            ).then(response => {
                this.setState({ notices: response });
            }).catch(err => {
                console.log(err);
                alert(err)
            }).finally(() => this.setState({ isLoading : false }));
        });
    }
    
    render() {
        const mapTabTitle = "Mapa";
        const listTabTitle = "Lista";
        const segmentedTabTitles = [mapTabTitle, listTabTitle];

        return (
            <SafeAreaView style={styles.container}>
                <View>
                    <SegmentedControlTab 
                        values={segmentedTabTitles}
                        selectedIndex={this.state.selectedIndex}
                        onTabPress={this.handleTabSegmenterIndexChange}
                        tabsContainerStyle={{marginHorizontal: 3, marginVertical: 2}}
                        tabTextStyle={{color: colors.grey, fontWeight: 'bold', fontSize: 14, paddingVertical: 8}}
                        tabStyle={{backgroundColor: colors.transparent, borderColor: colors.transparent}}
                        activeTabStyle={{borderRadius: 5, backgroundColor: colors.white, shadowOpacity:0.2, shadowOffset: {width: 1, height: 1}}}
                        activeTabTextStyle={{color: colors.primary, fontWeight: 'bold', fontSize: 14}}
                    />
                </View>
                <View style={{padding: 10, alignItems:'flex-end', backgroundColor: colors.transparent}}>
                            <Icon
                                name='tune'
                                size={33}
                                color={colors.secondary}
                                onPress={() => this.navigateToFilterSettings()} />
                        </View>
                {this.state.selectedIndex == segmentedTabTitles.indexOf(listTabTitle) && 
                    <View style={{flex:1}}>
                        <FlatList 
                            data={this.state.notices} 
                            numColumns={2}
                            keyExtractor={(_, index) => index.toString()}
                            initialNumToRender={this.state.notices.length}
                            renderItem={this.renderItem}
                        />
                    </View>
                }

                {this.state.selectedIndex == segmentedTabTitles.indexOf(mapTabTitle) && this.state.location &&
                     
                    <>
                    <MapView style={{width: "100%", height: "100%"}}
                        // provider={PROVIDER_GOOGLE}
                        region={{
                        latitude: this.state.location.coords.latitude,
                        longitude: this.state.location.coords.longitude,
                        latitudeDelta: 0.0622,
                        longitudeDelta: 0.0221,
                        }}
                        showsUserLocation={true}
                    >
                      {this.state.notices && this.state.notices.map(notice => {
                            return <Marker 
                                key={'notice_' + notice.noticeId} 
                                identifier={notice.noticeId} 
                                coordinate={{latitude: notice.eventLocation.lat, longitude: notice.eventLocation.long}}
                                onPress={e => console.log(e.nativeEvent)}
                                image={mapReportTypeToMapMarker(notice.noticeType)}>
                                <Callout >
                                    <TouchableOpacity style={styles.bubble} onPress={() => this.navigateToReportView(notice.userId, notice.noticeId)}>
                                        <Text style={[styles.name, {color: mapReportTypeToLabelColor(notice.noticeType)}]}>{mapReportTypeToLabel(notice.noticeType)}</Text>
                                        <Text style={{color: colors.clearBlack}}>{this.truncate(notice.description, 50)}</Text>
                                        <Image style={styles.image}
                                            source={{uri:`data:image/png;base64,${Buffer.from(notice.pet.photo).toString('base64')}`}} />
                                    </TouchableOpacity>
                                </Callout>
                            </Marker>})}
                        
                    </MapView>
                    <View style={{paddingVertical: 5, backgroundColor: colors.whiteWithOpacity, position: 'absolute', left: 20, bottom: 20}}>
                        <View  style={styles.alignedContent}>
                            {this.showBoxItem("Mascotas perdidas", mapReportTypeToMapMarkerColor("lost"))}
                        </View>
                        <View  style={styles.alignedContent}>
                            {this.showBoxItem("Mascotas encontradas", mapReportTypeToMapMarkerColor("found"))}
                        </View>
                        <View  style={styles.alignedContent}>
                            {this.showBoxItem("Mascotas en adopción", mapReportTypeToMapMarkerColor("for_adoption"))}
                        </View>  
                        <View  style={styles.alignedContent}>
                            {this.showBoxItem("Mascotas robadas", mapReportTypeToMapMarkerColor("stolen"))}
                        </View>  
                    </View> 
                    </>

                }
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
    alignedContent: {
        alignItems:'center', 
        flexDirection: 'row', 
        margin: 5
    },
    checkBoxOptionTitle: {
        marginLeft: 5, 
        fontSize: 12,
    },
    bubble: {
        flexDirection: 'column',
        alignSelf: 'flex-start',
        backgroundColor: colors.white,
        borderRadius: 6,
        width: 200,
    },
    name: {
        fontSize: 16,
        marginBottom: 5,
        fontWeight: 'bold',
    },
    image: {
        marginTop: 10,
        width: "100%",
        height: 150,
        borderRadius: 5
    },
  });
