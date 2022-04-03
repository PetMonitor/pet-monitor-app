import React from 'react';
import { Text, SafeAreaView, View, FlatList, Image, Dimensions, TouchableOpacity, StyleSheet } from 'react-native';
import { getJsonData } from '../utils/requests.js';
import { getSecureStoreValueFor } from '../utils/store';
import { Buffer } from 'buffer'

import SegmentedControlTab from "react-native-segmented-control-tab";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import colors from '../config/colors';

const { height, width } = Dimensions.get("screen")

/** Implements the screen that lists all the pets' reports. */
export class ReportListScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            notices: [],
            selectedIndex: 0,
            isLoading: true
        };
    }

    mapReportTypeToLabel = type => {
        type = type.toLowerCase();
        if (type == "lost" || type == "stolen") {
            return "Perdido";
        }
        if (type == "found") {
            return "Encontrado";
        }
        if (type == "for_adoption") {
            return "En adopción";
        }
    }

    getReportColorFromType = type => {
        type = type.toLowerCase();
        if (type == "lost" || type == "stolen") {
            return colors.pink;
        }
        if (type == "found") {
            return colors.primary;
        }
        if (type == "for_adoption") {
            return colors.secondary;
        }
    }

    navigateToReportView = (userId, noticeId) => {
        this.props.navigation.push('ReportView', { userId: userId, noticeId: noticeId, isMyReport: false });
    }

    renderItem = ({item}) =>  {
        return (
            <TouchableOpacity onPress={() => this.navigateToReportView(item.userId, item.noticeId)}>
                <Image style={{height: (width - 20) / 2, width:  (width - 20) / 2, borderRadius: 5, margin: 5}}
                        source={{uri:`data:image/png;base64,${Buffer.from(item.pet.photo).toString('base64')}`}}
                />
                <Text style={{fontSize: 16, fontWeight: 'bold', color: this.getReportColorFromType(item.noticeType), paddingLeft: 7, paddingBottom: 20}}>{this.mapReportTypeToLabel(item.noticeType)}</Text> 
            </TouchableOpacity>
        )
    }

    handleTabSegmenterIndexChange = index => {
        this.setState({
          selectedIndex: index
        });
    };

    navigateToFilterSettings = () => {
        // Navigate to filter settings page.
        this.props.navigation.navigate('ReportListFilter'); 
    }

    componentDidMount() {
        getSecureStoreValueFor('sessionToken').then((sessionToken) => {
            getJsonData(global.noticeServiceBaseUrl + '/notices', 
            {
                'Authorization': 'Basic ' + sessionToken 
            }
            ).then(response => {
                console.log(response);
                this.setState({ notices : response });
            }).catch(err => {
                console.log(err);
                alert(err)
            }).finally(() => this.setState({ isLoading : false }));
        });
    }
    
    render() {
        // const { user } = this.props.route.params;
        const mapTabTitle = "Mapa";
        const listTabTitle = "Lista";
        const segmentedTabTitles = [mapTabTitle, listTabTitle];

        return (
            <SafeAreaView style={styles.container}>
                <View style={{alignItems: 'flex-start'}}>
                    <Text style={{fontSize: 24, fontWeight: 'bold', paddingLeft: 20, paddingTop: 40, paddingBottom: 10, color: colors.primary}}>Reportes</Text>
                </View>
                <View>
                    <SegmentedControlTab 
                        values={segmentedTabTitles}
                        selectedIndex={this.state.selectedIndex}
                        onTabPress={this.handleTabSegmenterIndexChange}
                        tabsContainerStyle={{margin: 5}}
                        tabTextStyle={{color: colors.grey, fontWeight: 'bold', fontSize: 14, paddingVertical: 8}}
                        tabStyle={{backgroundColor: colors.transparent, borderColor: colors.transparent}}
                        activeTabStyle={{borderRadius: 5, backgroundColor: colors.white, shadowOpacity:0.2, shadowOffset: {width: 1, height: 1}}}
                        activeTabTextStyle={{color: colors.primary, fontWeight: 'bold', fontSize: 14}}
                    />
                </View>
                {this.state.selectedIndex == segmentedTabTitles.indexOf(listTabTitle) && 
                    <View style={{flex:1}}>
                        <View style={{padding: 10, alignItems:'flex-end', backgroundColor: colors.transparent}}>
                            <Icon
                                name='tune'
                                size={33}
                                color={colors.secondary}
                                onPress={() => this.navigateToFilterSettings()} />
                        </View>
                        <FlatList 
                            data={this.state.notices} 
                            numColumns={2}
                            keyExtractor={(_, index) => index.toString()}
                            initialNumToRender={this.state.notices.length}
                            renderItem={this.renderItem}
                        />
                    </View>
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
    }
  });
