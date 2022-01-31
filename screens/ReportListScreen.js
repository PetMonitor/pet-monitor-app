import React from 'react';
import { Text, SafeAreaView, View, FlatList, Image, Dimensions, TouchableOpacity, StyleSheet } from 'react-native';
import SegmentedControlTab from "react-native-segmented-control-tab";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import colors from '../config/colors';

const { heigh, width } = Dimensions.get("screen")

/** Implements the screen that lists all the pets' reports. */
export class ReportListScreen extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            images: [{photo: "w", type: "Encontrado"}, {photo: "w", type: "Perdido"}, {photo: "w", type: "En adopción"}, {photo: "w", type: "Encontrado"}, {photo: "w", type: "Perdido"}, {photo: "w", type: "Perdido"}, {photo: "w", type: "Encontrado"}, {photo: "w", type: "En adopción"}, {photo: "w", type: "Encontrado"}, {photo: "w", type: "En adopción"}, {photo: "w", type: "Perdido"}, {photo: "w", type: "Perdido"}],
            selectedIndex: 0
        };
    }

    getReportColorFromType = type => {
        if (type == "Encontrado") {
            return colors.primary;
        } else if (type == "En adopción") {
            return colors.secondary;
        } 
        return colors.pink
    }

    renderItem = ({item}) =>  {
        return (
            <TouchableOpacity onPress={() => console.log(item.photo)}>
                <Image style={{height: (width - 20) / 2, width: (width - 20) / 2, borderRadius: 5, margin: 5}}
                        source={require('../assets/adorable-jack-russell-retriever-puppy-portrait.jpg')}
                />
                <Text style={{fontSize: 16, fontWeight: 'bold', color: this.getReportColorFromType(item.type), paddingLeft: 7, paddingBottom: 20}}>{item.type}</Text>
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
    
    render() {

        const { navigation } = this.props;
        // const { user } = this.props.route.params;
        const mapTabTitle = "Mapa";
        const listTabTitle = "Lista";
        const segmentedTabTitles = [mapTabTitle, listTabTitle];

        return (
            <SafeAreaView style={styles.container}>
                <View style={{justifyContent: 'center', alignItems: 'flex-start'}}>
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
                            data={this.state.images} 
                            numColumns={2}
                            keyExtractor={(_, index) => index.toString()}
                            initialNumToRender={this.state.images.length}
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
