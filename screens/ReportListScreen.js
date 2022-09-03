import React from 'react';

import { Text, SafeAreaView, View, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import SegmentedControlTab from "react-native-segmented-control-tab";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MapView, { Callout, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { Buffer } from 'buffer'

import { ReportImagesList } from '../utils/images.js';
import { getJsonData } from '../utils/requests.js';
import { getSecureStoreValueFor } from '../utils/store';
import { mapReportTypeToLabel, mapReportTypeToLabelColor, mapReportTypeToMapMarkerColor, mapReportTypeToMapMarker } from '../utils/mappers';

import commonStyles from '../utils/styles';
import colors from '../config/colors';

const mapTabTitle = "Mapa";
const listTabTitle = "Lista";
const segmentedTabTitles = [mapTabTitle, listTabTitle];

/** Implements the screen that lists all the pets' reports. */
export class ReportListScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            notices: [],
            selectedIndex: this.props.selectedIndex ? this.props.selectedIndex : 0,
            isLoading: true,
            location: null,
            page: 1,
            moreDataLoading: false
        };
    }

    objectIsEmpty = (object) => {
        return Object.keys(object).length === 0
    }

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
                let queryParams = this.getQueryParamsBasedOnFilters(filters);
                this.setState({
                    notices: [],
                    page: 1,
                    moreDataLoading: false,
                    isLoading: true
                })
                this.loadReports(queryParams);
            }
        }
    }

    componentDidMount() {
        this.fetchUserLocation();
        this.loadReports()
    }

    loadReports(queryParams='') {
        getSecureStoreValueFor('sessionToken').then((sessionToken) => {
            if (queryParams === '') {
                queryParams += "?"
            }
            queryParams += `size=10&page=${this.state.page}`
            console.log(queryParams)
            getJsonData(global.noticeServiceBaseUrl + '/notices' + queryParams, { 'Authorization': 'Basic ' + sessionToken }
            ).then(response => {
                this.setState({ 
                    notices: this.state.page === 1 ? response : [...this.state.notices, ...response],                    
                });
            }).catch(err => {
                console.log(err);
                alert(err);
            }).finally(() => this.setState({ moreDataLoading: false, isLoading: false }));
        });
    }

    loadMoreData = () => {
        this.setState({ page: this.state.page + 1, moreDataLoading: true }, () => {
            let filters = ''
            if (this.props.route.params) {
                filters = this.props.route.params.filters ? this.props.route.params.filters : ''
            }
            this.loadReports(this.getQueryParamsBasedOnFilters(filters))
        })        
    }
    
    fetchUserLocation() {
        Location.requestForegroundPermissionsAsync()
            .then(response => {
                if (response.status !== 'granted') {
                    alert('Permission to access location was denied');
                    return;
                }

                Location.getCurrentPositionAsync({})
                    .then(location => {
                        this.setState({ location: location });
                    });
            });
    }

    render() {

        return (
            <SafeAreaView style={commonStyles.container}>
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
                <FilterBar onFilterPress={this.navigateToFilterSettings} />
                {this.state.selectedIndex == segmentedTabTitles.indexOf(listTabTitle) && 
                     (this.state.isLoading ?
                        <View style={{position: 'absolute', top: 100, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.semiTransparent}}>
                            <ActivityIndicator size="large" color={colors.clearBlack}/>
                        </View> : <>
                    <ReportImagesList 
                        notices={this.state.notices}
                        onItemPress={(item) => this.navigateToReportView(item.userId, item.noticeId)}
                        withLabel={true}
                        loadMoreData={this.loadMoreData}/>

                    {this.state.moreDataLoading ? 
                        <View style={{justifyContent: 'center', alignItems: 'center', backgroundColor: colors.transparent}}>
                            <ActivityIndicator size="large" color={colors.clearBlack}/>
                        </View> : <></> } 
                    </>)
                }

                {this.state.selectedIndex == segmentedTabTitles.indexOf(mapTabTitle) && this.state.location &&
                     <ReportsMap 
                        userLatitude={this.state.location.coords.latitude}
                        userLongitude={this.state.location.coords.longitude}
                        notices={this.state.notices}
                        onMarkerPreviewPress={(notice) => this.navigateToReportView(notice.userId, notice.noticeId)}
                        />
                }
            </SafeAreaView>
        )
    }

    getQueryParamsBasedOnFilters(filters) {
        let queryParams = '';

        if (!this.objectIsEmpty(filters)) {
            queryParams = '?';

            const filtersToApply = this.getFilters();
            queryParams += filtersToApply.petSex ? "petSex=" + filtersToApply.petSex + "&" : "";
            queryParams += filtersToApply.petType ? "petType=" + filtersToApply.petType + "&" : "";
            queryParams += filtersToApply.breed ? "petBreed=" + filtersToApply.breed + "&" : "";
            queryParams += filtersToApply.reportType ? "noticeType=" + filtersToApply.reportType + "&" : "";
            queryParams += filtersToApply.region ? "noticeRegion=" + filtersToApply.region + "&" : "";
        }
        return queryParams;
    }

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
            addReportTypeFilters();
        }
        if (!(filters.catIsSelected && filters.dogIsSelected)) {
            addPetTypeFilters();
        }
        if (!(filters.femaleIsSelected && filters.maleIsSelected)) {
            addPetSexFilters();
        }
        return filtersToApply

        function addPetSexFilters() {
            if (filters.femaleIsSelected) {
                filtersToApply.petSex = 'FEMALE';
            }
            if (filters.maleIsSelected) {
                filtersToApply.petSex = 'MALE';
            }
        }

        function addPetTypeFilters() {
            if (filters.catIsSelected) {
                filtersToApply.petType = 'CAT';
            }
            if (filters.dogIsSelected) {
                filtersToApply.petType = 'DOG';
            }
        }

        function addReportTypeFilters() {
            var reportTypes = [];
            if (filters.lostPetIsSelected) {
                reportTypes.push('LOST');
                reportTypes.push('STOLEN');
            }
            if (filters.petForAdoptionIsSelected) {
                reportTypes.push('FOR_ADOPTION');
            }
            if (filters.petFoundIsSelected) {
                reportTypes.push('FOUND');
            }
            if (reportTypes.length > 0) {
                filtersToApply.reportType = reportTypes.join(",");
            }
        }
    }
}

const FilterBar = ({onFilterPress}) => {
    return (
        <View style={{padding: 10, alignItems:'flex-end', backgroundColor: colors.transparent}}>
            <Icon
                name='tune'
                size={33}
                color={colors.secondary}
                onPress={onFilterPress} />
        </View>
    );
}

const ReportMarker = ({notice, onMarkerPreviewPress}) => {
    const markerAsset = mapReportTypeToMapMarker(notice.noticeType);
    const markerColor = mapReportTypeToLabelColor(notice.noticeType);
    const markerLabel = mapReportTypeToLabel(notice.noticeType);

    return (
        <Marker 
            key={'notice_' + notice.noticeId} 
            identifier={notice.noticeId} 
            coordinate={{latitude: notice.eventLocation.lat, longitude: notice.eventLocation.long}}
            image={markerAsset}>
            <Callout >
                <TouchableOpacity style={styles.bubble} onPress={() => onMarkerPreviewPress(notice)}>
                    <Text style={[styles.name, {color: markerColor}]}>{markerLabel}</Text>
                    <Text style={{color: colors.clearBlack}}>{truncate(notice.description, 50)}</Text>
                    <Image style={styles.image}
                        source={{uri:`data:image/png;base64,${Buffer.from(notice.pet.photo).toString('base64')}`}} />
                </TouchableOpacity>
            </Callout>
        </Marker>
    );
}

const ReportMarkers = ({notices, onMarkerPreviewPress}) => {
    return notices ? 
        notices.map(notice => <ReportMarker notice={notice} key={notice.noticeId} onMarkerPreviewPress={onMarkerPreviewPress} />) : null;
}

const ReportsMap = ({userLatitude, userLongitude, notices, onMarkerPreviewPress}) => {
    return (<>
        <MapView style={{width: "100%", height: "100%"}}
            // provider={PROVIDER_GOOGLE}
            region={{
            latitude: userLatitude,
            longitude: userLongitude,
            latitudeDelta: 0.0622,
            longitudeDelta: 0.0221,
            }}
            showsUserLocation={true}
        >
            <ReportMarkers notices={notices} onMarkerPreviewPress={onMarkerPreviewPress} />
        </MapView>
        <MarkerReferenceBox />
    </>);
}

const MarkerReferenceBox = () => {
    return (
        <View style={{paddingVertical: 5, backgroundColor: colors.whiteWithOpacity, position: 'absolute', left: 20, bottom: 20}}>
            <View  style={styles.alignedContent}>
                <ReportMarkerReference checkBoxTitle={"Mascotas perdidas"} color={mapReportTypeToMapMarkerColor("lost")} />
            </View>
            <View  style={styles.alignedContent}>
                <ReportMarkerReference checkBoxTitle={"Mascotas encontradas"} color={mapReportTypeToMapMarkerColor("found")} />
            </View>
            <View  style={styles.alignedContent}>
                <ReportMarkerReference checkBoxTitle={"Mascotas en adopción"} color={mapReportTypeToMapMarkerColor("for_adoption")} />
            </View>  
            <View  style={styles.alignedContent}>
                <ReportMarkerReference checkBoxTitle={"Mascotas robadas"} color={mapReportTypeToMapMarkerColor("stolen")} />
            </View>  
        </View>
    );
}

const ReportMarkerReference = ({checkBoxTitle, color}) => {
    return (<>
        <Icon
            name={'checkbox-blank'}
            size={20}
            color={color}
            style={{marginLeft: 5}}
        />
        <Text style={styles.checkBoxOptionTitle}>{checkBoxTitle}</Text>
    </>);
}

function truncate(str, maxLength) {
    return (str.length > maxLength) ? str.substr(0, maxLength - 1) + '...' : str;
};

const styles = StyleSheet.create({
    alignedContent: {
        ...commonStyles.alignedContent,
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
