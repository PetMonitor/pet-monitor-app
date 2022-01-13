import React, { useMemo, useEffect }  from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Platform, StatusBar, StyleSheet } from 'react-native';
import { AssetsSelector } from 'expo-images-picker';
import { MediaType } from 'expo-media-library';
import PageContainer from '../utils/PageContainer';
import * as ImagePicker from 'expo-image-picker';
import { EventRegister } from 'react-native-event-listeners'

const ImageSelectorScreen = ({ route, navigation }) => {

  useEffect(() => {
    (async () => {
      const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if(status !== 'granted'){
        alert('Sorry, we need camera roll permissions to make this work!')
      }
    })();
  }, []);

  const onImagePickSuccess = async (data) => {
    const images = data.map((image, index) => { 
        return image["base64"];
    });
    //console.log(`Set selected images to ${JSON.stringify(images)}`);

    EventRegister.emit("SET_IMAGES", images);

    navigation.goBack();
  }


  const widgetErrors = useMemo(
    () => ({
      errorTextColor: 'black',
      errorMessages: {
        hasErrorWithPermissions: 'Please Allow media gallery permissions.',
        hasErrorWithLoading: 'There was an error while loading images.',
        hasErrorWithResizing: 'There was an error while loading images.',
        hasNoAssets: 'No images found.',
      },
    }),
    [],
  );

  const widgetSettings = useMemo(
    () => ({
      getImageMetaData: false, // true might perform slower results but gives meta data and absolute path for ios users
      initialLoad: 100,
      assetsType: [MediaType.photo],
      minSelection: 1,
      maxSelection: 10,
      portraitCols: 4,
      landscapeCols: 4,
    }),
    [],
  );

  const widgetNavigator = useMemo(
    () => ({
      Texts: {
        finish: 'finish',
        back: 'back',
        selected: 'selected',
      },
      midTextColor: 'black',
      minSelection: 1,
      buttonTextStyle: { color: 'white' },
      buttonStyle: { backgroundColor: 'orange', borderRadius: 5 },
      onBack: () => {
        navigation.pop();
      },
      onSuccess: (data) => onImagePickSuccess(data),
    }),
    [],
  );

  const widgetResize = useMemo(
    () => ({
        base64: true,
        saveTo: 'png',
    }),
    []
  );

  const widgetStyles = useMemo(
    () => ({
      margin: 2,
      bgColor: 'white',
      spinnerColor: 'blue',
      widgetWidth: 99,
      videoIcon: {
        Component: Ionicons,
        iconName: 'ios-videocam',
        color: 'tomato',
        size: 20,
      },
      selectedIcon: {
        Component: Ionicons,
        iconName: 'ios-checkmark-circle-outline',
        color: 'white',
        bg: '#0eb14970',
        size: 26,
      },
    }),
    [],
  );

  return (
        <PageContainer>
          <AssetsSelector
            Settings={widgetSettings}
            Errors={widgetErrors}
            Styles={widgetStyles}
            Resize={widgetResize}
            Navigator={widgetNavigator} 
          />
        </PageContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    flexDirection: 'column', // main axis: vertical
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  textStyle: {
    color: "#FFFFFF",
  },
  buttonStyle: {
    backgroundColor: "#73B1A2",
    borderRadius: 5,
  }
});


export default ImageSelectorScreen;