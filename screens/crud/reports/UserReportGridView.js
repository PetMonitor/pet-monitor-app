import React from "react";

import { Text, TouchableOpacity, View, Image, StyleSheet, FlatList, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';

import { mapReportTypeToLabel, mapReportTypeToLabelColor } from '../../../utils/mappers';

import commonStyles from '../../../utils/styles';
import colors from '../../../config/colors';

const { height, width } = Dimensions.get("screen")

export class UserReportGridView extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            reports: this.props.reports
        }

        console.log(`REPORT GRID ${JSON.stringify(this.state)}`)

    }

    onReportCreated = (createdNoticeId) => {
        this.props.onReportCreated(createdNoticeId);
    }

    render() {

        const { navigation } = this.props;

        const handleNavigateToReportView = (noticeId) => {
            navigation.push("ReportView", { noticeUserId: this.props.userId, noticeId: noticeId });
        }

        const handleCreateNewReport = () => {
            navigation.navigate('BottomTabNavigator', {
                screen: 'CreateReport',
                params: { onReportCreated: this.onReportCreated }
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
            <View style={commonStyles.container}>
                {this.props.reports.length == 0 ? <Text style={{fontSize: 15, fontWeight: '500', color: colors.secondary, marginTop: 20}}>Podés crear un reporte en caso de encontrar o perder una mascota.</Text> : null}
                <FlatList 
                    data={[...this.state.reports, {action: "add-report"}]} 
                    numColumns={2}
                    keyExtractor={(_, index) => index.toString()}
                    initialNumToRender={this.state.reports.length + 1}
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
});
