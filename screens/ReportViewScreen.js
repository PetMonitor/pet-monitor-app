import React from 'react';

import { Text, SafeAreaView, View, FlatList, Image, Dimensions, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import SegmentedControlTab from "react-native-segmented-control-tab";

import colors from '../config/colors';

const { height, width } = Dimensions.get("screen")

/** Implements the screen that shows a pet's report. */
export class ReportViewScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            // TODO: change this for request data
            reportType: 'Mascota encontrada',
            name: 'Pepe',
            province: 'Buenos Aires',
            city: 'CABA',
            location: 'Av Independencia 400',
            date: new Date(),
            hour: new Date(),
            eventDescription: 'this is a description, a very very long description with bunch of details about the event',
            petPhotos: ["", "", "", "", ""],
            sex: 'Macho',
            type: 'Perro',
            furColor: 'Marrón',
            breed: 'Mestizo',
            size: 'Chico',
            lifeStage: 'Cachorro',
            petDescription: 'this is a description, a very very long description with bunch of details about the pet',
            isMyReport: true,
            selectedIndex: 0,
        };
    }

    getReportColorFromType = type => {
        if (type == "Mascota encontrada") {
            return colors.primary;
        } else if (type == "Mascota en adopción") {
            return colors.secondary;
        } 
        return colors.pink
    }

    renderPet = (item) =>  {
        return (
            // TODO; check how to handle images that are not squared
            // <View style={{ aspectRatio: 1 }}>
            //     <Image resizeMode="cover" style={{ aspectRatio: 1, height: 100 }} />
            // </View>
            <Image style={{width: height/3, height: height/3, borderRadius: 5, margin: 5}}
                    source={require('../assets/adorable-jack-russell-retriever-puppy-portrait.jpg')}
            />
        )
    }

    handleTabSegmenterIndexChange = index => {
        this.setState({
          selectedIndex: index
        });
    };

    showContactInfo = () => {
        // TODO: show modal with info
    }

    resolveReport = () => {
        // TODO
    }

    suspendReport = () => {
        // TODO: suspend or remove?
    }

    changeToEditMode = () => {
        // TODO: edit event/pet page or history depending on the index
    }

    render() {


        const infoTitle = "Información";
        const historyTitle = "Historial";
        const segmentedTabTitles = [infoTitle, historyTitle];

        return (
            <SafeAreaView style={styles.container}>
                <View style={{flex: 1, justifyContent: 'flex-end'}}>
                    <FlatList 
                        data={this.state.petPhotos} 
                        horizontal={true}
                        keyExtractor={(_, index) => index.toString()}
                        initialNumToRender={this.state.petPhotos.length}
                        renderItem={this.renderPet}
                    />
                    <View style={{width: width, backgroundColor: colors.semiTransparent, position: 'absolute', height: 30, justifyContent: 'center'}}>
                        <Text style={{paddingLeft: 35, fontSize: 24, fontWeight: 'bold', color: colors.clearBlack}}>{this.state.name}</Text>
                    </View>    
                </View>
                <View style={{flex: 2}}>
                    <View style={{alignItems: 'flex-start'}}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Text style={{fontSize: 24, fontWeight: 'bold', paddingLeft: 35, paddingTop: 20, paddingBottom: 20, color: this.getReportColorFromType(this.state.reportType)}}>{this.state.reportType}</Text>
                            {this.state.isMyReport ? 
                                <TouchableOpacity onPress={() => this.changeToEditMode()}>
                                    <MaterialIcon name='pencil' size={20} color={colors.secondary} style={{paddingLeft: 10}}/> 
                                </TouchableOpacity> : <></>}
                        </View> 
                        {this.state.reportType == 'Mascota encontrada' ?
                            <SegmentedControlTab 
                                values={segmentedTabTitles}
                                selectedIndex={this.state.selectedIndex}
                                onTabPress={this.handleTabSegmenterIndexChange}
                                tabsContainerStyle={{marginLeft: 35, marginRight: 35, marginBottom: 25}}
                                tabTextStyle={{color: colors.grey, fontWeight: 'bold', fontSize: 14, paddingVertical: 8}}
                                tabStyle={{backgroundColor: colors.inputGrey, borderColor: colors.transparent}}
                                activeTabStyle={{borderRadius: 5, backgroundColor: colors.white, shadowOpacity:0.2, shadowOffset: {width: 1, height: 1}}}
                                activeTabTextStyle={{color: colors.primary, fontWeight: 'bold', fontSize: 14}}
                            />
                            : <></>}
                    </View>
                    <ScrollView style={{flex:1, paddingLeft: 35, paddingRight: 35}}>
                        { this.state.selectedIndex == segmentedTabTitles.indexOf(infoTitle) ?
                            // Show information tab data: event and pet details
                            <>
                                <Text style={[styles.optionTitle, {paddingTop: 0}]}>Se perdió en</Text>
                                <Text style={styles.textInput}>{this.state.location}</Text>
                                <Text style={[styles.textInput, {paddingTop: 5}]}>{this.state.city + ", " + this.state.province}</Text>

                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <View style={{flexDirection: 'column', flex: 0.5}}>
                                        <Text style={styles.optionTitle}>Fecha</Text>
                                        <Text style={styles.textInput}>{this.state.date.getDate() + '/' + parseInt(this.state.date.getMonth() + 1) + '/' + this.state.date.getFullYear()}</Text>
                                    </View>
                                    <View style={{flexDirection: 'column', flex: 0.5}}>
                                        <Text style={styles.optionTitle}>Hora</Text>
                                        <Text style={styles.textInput}>{("0" + this.state.hour.getHours()).slice(-2) + ':' + ("0" + this.state.hour.getMinutes()).slice(-2)}</Text>
                                    </View>
                                </View>

                                <Text style={styles.optionTitle}>Descripción</Text>
                                <Text style={styles.textInput}>{this.state.eventDescription}</Text>
                                <Text style={[styles.optionTitle, {fontSize: 20, fontWeight: 'bold', paddingTop: 25}]}>Mascota</Text>
                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <View style={{flexDirection: 'column', flex: 0.5}}>
                                        <Text style={styles.optionTitle}>Tipo</Text>
                                        <Text style={styles.textInput}>{this.state.type}</Text>
                                        <Text style={styles.optionTitle}>Sexo</Text>
                                        <Text style={styles.textInput}>{this.state.sex}</Text>
                                        <Text style={styles.optionTitle}>Tamaño</Text>
                                        <Text style={styles.textInput}>{this.state.size}</Text>
                                
                                    </View>
                                    <View style={{flexDirection: 'column', flex: 0.5}}>
                                        <Text style={styles.optionTitle}>Raza</Text>
                                        <Text style={styles.textInput}>{this.state.breed}</Text>
                                        <Text style={styles.optionTitle}>Color pelaje</Text>
                                        <Text style={styles.textInput}>{this.state.furColor}</Text>
                                        <Text style={styles.optionTitle}>Etapa</Text>
                                        <Text style={styles.textInput}>{this.state.lifeStage}</Text>
                                    </View>
                                </View>

                                <Text style={styles.optionTitle}>Descripción de la mascota</Text>
                                <Text style={styles.textInput}>{this.state.petDescription}</Text>

                                {this.state.isMyReport ? 
                                <>
                                <TouchableOpacity style={[styles.button, {alignSelf: 'stretch', backgroundColor: colors.primary, marginTop: 40}]} onPress={() => this.resolveReport()}>
                                    <Text style={styles.buttonFont}>Resolver reporte</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.button, {alignSelf: 'stretch', backgroundColor: colors.pink, marginTop: 15, marginBottom: 60}]} onPress={() => this.suspendReport()}>
                                    <Text style={styles.buttonFont}>Suspender reporte</Text>
                                </TouchableOpacity>
                                </> :
                                <TouchableOpacity style={[styles.button, {alignSelf: 'stretch', backgroundColor: colors.secondary, marginTop: 40, marginBottom: 60}]} onPress={() => this.showContactInfo()}>
                                    <Text style={styles.buttonFont}>Contacto</Text>
                                </TouchableOpacity>   
                                }
                            </> :
                            // Show history tab data: places where the pet has been fostered
                            <>
                                <Text style={{fontSize: 18, color: colors.secondary, paddingBottom: 5, fontWeight: 'bold'}}>Hogares en los que estuvo la mascota</Text>
                                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                    <View style={{flexDirection: 'column', flex: 1, alignSelf: 'stretch'}}>
                                        <Text style={styles.optionTitle}>Desde</Text>
                                        <Text style={[styles.textInput, {fontSize: 14}]}>{this.state.date.getDate() + '/' + parseInt(this.state.date.getMonth() + 1) + '/' + this.state.date.getFullYear()}</Text>
                                    </View>
                                    <View style={{flexDirection: 'column', flex: 1, alignSelf: 'stretch'}}>
                                        <Text style={styles.optionTitle}>Hasta</Text>
                                        <Text style={[styles.textInput, {fontSize: 14}]}>20/11/2023</Text>
                                    </View>
                                    <View style={{flexDirection: 'column', flex: 2.3, alignSelf: 'stretch'}}>
                                        <Text style={styles.optionTitle}>Contacto</Text>
                                        <Text style={[styles.textInput, {fontSize: 14}]}>email_example@gmail.com</Text>
                                    </View>
                                </View>
                            </>
                        }
                    </ScrollView>
                </View>
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
    optionTitle: {
        fontSize: 16, 
        color: colors.clearBlack,
        paddingTop: 20, 
        fontWeight: 'bold'
    },
    textInput: {
        paddingTop: 10, 
        color: colors.clearBlack, 
        fontSize: 16, 
    },
    button: {
        backgroundColor: colors.secondary,
        marginTop: 10,
        padding: 18, 
        borderRadius: 7, 
    },
    buttonFont: {
        fontSize: 16, 
        fontWeight: '500', 
        alignSelf: 'center',
        color: colors.white
    },
  });
