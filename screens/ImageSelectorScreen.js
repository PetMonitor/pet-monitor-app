import React, { Component }  from 'react';
import { Ionicons } from '@expo/vector-icons';
import {  Platform, StatusBar, StyleSheet, Text } from 'react-native';
import { AssetsSelector } from 'expo-images-picker';
import styled from "styled-components";

import colors from '../config/colors';

export default class ImageSelectorScreen extends Component {

  constructor(props){
    super(props);
    this.state={
        visible:false,
    }
  }

  open = () => {
      this.setState({visible:true});
  }

  close = () => {
      this.setState({visible:false});
  }

  render() {

      const emptyStayComponent = () => <Text>No Images Found</Text>;

      return (
        <Container>
          <AssetsSelector 
              options={{
                    assetsType: ["photo"],
                    maxSelections: 5,
                    margin: 3,
                    portraitCols: 4,
                    landscapeCols: 5,
                    manipulate: {
                        width: 512,
                        compress: 0.7,
                        base64: true,
                        saveTo: 'jpeg',
                    },
                    widgetWidth: 100,
                    widgetBgColor: 'white',
                    selectedBgColor: 'rgba(0,0,0,0.5)',
                    portraitCols: 4,
                    videoIcon: {
                        Component: Ionicons,
                        iconName: 'ios-videocam',
                        color: 'white',
                        size: 20,
                    },
                    selectedIcon: {
                        Component: Ionicons,
                        iconName: 'ios-checkmark-circle-outline',
                        color: 'white',
                        bg: 'rgba(0,0,0,0.5)',
                        size: 20,
                    },
                    defaultTopNavigator: {
                        continueText: 'Done',
                        goBackText: 'Back',
                        backFunction: () => this.close(),
                        doneFunction: (data) => {
                            this.close();
                            //this.props.onChange(data);
                            console.log(data);
                            //Pass data to Create Pet Screen
                            this.props.navigation.navigate({
                              name: 'CreatePet',
                              params: { images: data.map((image, index) => { 
                                  return <Text>id: {image["id"]}, base64: {image["base64"]}</Text>
                                }
                              )},
                              merge: true
                            });
                        },
                    },
                    noAssets: {
                        Component: emptyStayComponent,
                    },
              }}
          />
        </Container>
    );
  }
}

const Container = styled.View`
  flex: 1;
`;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    flexDirection: 'column', // main axis: vertical
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  textStyle: {
    color: colors.white,
  },
  buttonStyle: {
    backgroundColor: colors.primary,
    borderRadius: 5,
  }
});
