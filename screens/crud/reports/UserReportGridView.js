import React from "react";
import colors from '../../../config/colors';
import Icon from 'react-native-vector-icons/AntDesign';

import { Text, TouchableOpacity, View, Image, StyleSheet, FlatList, Dimensions } from 'react-native';
import { mapReportTypeToLabel, mapReportTypeToLabelColor } from '../../../utils/mappers';

const { height, width } = Dimensions.get("screen")

export class UserReportGridView extends React.PureComponent {

    constructor(props) {
        super(props);
    }

    render() {

        const { navigation } = this.props;

        const handleNavigateToReportView = (petId) => {
            navigation.push("ReportView", { noticeUserId: userId, noticeId: noticeId, isMyReport: true });
        }

        const handleCreateNewReport = () => {
            navigation.navigate('BottomTabNavigator', {
                screen: 'CreateReport'
            });
        }

        const renderReport = ({item}) => {
            if (item.action == "add-report") {
                return (
                    <TouchableOpacity onPress={handleCreateNewReport} >
                    <Icon
                        style={{margin: 10, padding: 10}}
                        size={120}
                        name="plus"
                        backgroundColor={colors.white}
                        color={colors.secondary}
                    />
                    </TouchableOpacity>

                )
            } else {
                return (                    
                    <TouchableOpacity onPress={() => handleNavigateToReportView(item.id)} >
                        <Image key={'img_' + item.photoId} resizeMode="cover" style={{aspectRatio: 1, height: (width - 70) / 2, borderRadius: 5, marginHorizontal: 3, marginVertical: 5}} source={{ uri: global.noticeServiceBaseUrl + '/photos/' + item.photoId }}/>
                        <Text key={'text_' + item.id} style={[styles.text, {color: mapReportTypeToLabelColor(item.reportType)}]}>{mapReportTypeToLabel(item.reportType)}</Text>
                    </TouchableOpacity>
                )
            }
        }
        
        return(
            <View style={styles.container}>
                <FlatList 
                    data={[...this.props.reports, {action: "add-report"}]} 
                    numColumns={2}
                    keyExtractor={(_, index) => index.toString()}
                    initialNumToRender={this.props.reports.length + 1}
                    renderItem={renderReport}
                    style={{marginTop: 10}}

                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    text: {
        fontWeight: "bold",
        fontSize: 16,
        paddingLeft: 7, 
        paddingBottom: 20
    },
    container: {
        flex: 1,
        backgroundColor: 'white',
        flexDirection: 'column',    // main axis: vertical
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    }
});
