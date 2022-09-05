import React, { useMemo, useEffect }  from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Alert, StyleSheet } from 'react-native';
import { AssetsSelector } from 'expo-images-picker';
import { MediaType } from 'expo-media-library';
import PageContainer from '../utils/PageContainer';
import * as ImagePicker from 'expo-image-picker';
import { EventRegister } from 'react-native-event-listeners'

import colors from '../config/colors';

const LOW_RES_PHOTO_DIMENSION = 160

const ImageSelectorScreen = ({ route, navigation }) => {

  useEffect(() => {
    (async () => {
      const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if(status !== 'granted'){
        Alert.alert('', 'Se necesitan permisos de acceso a las imágenes de la galería para poder continuar')
      }
    })();
  }, []);

  const onImagePickSuccess = async (data) => {
    const images = data.map((image, index) => { 
        return image["base64"];
    });

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
        finish: 'Finalizar',
        back: 'Volver',
        selected: 'seleccionados',
      },
      midTextColor: colors.clearBlack,
      minSelection: 1,
      buttonTextStyle: { color: 'white' },
      buttonStyle: { backgroundColor: colors.secondary, borderRadius: 5 },
      onBack: () => {
        navigation.pop();
      },
      onSuccess: (data) => onImagePickSuccess(data),
    }),
    [],
  );

  const widgetResize = useMemo(
    () => ({
        height: LOW_RES_PHOTO_DIMENSION,
        width: LOW_RES_PHOTO_DIMENSION,
        base64: true,
        saveTo: 'png',
    }),
    []
  );

  const widgetStyles = useMemo(
    () => ({
      margin: 2,
      bgColor: 'white',
      spinnerColor: colors.primary,
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
        bg: colors.primaryWithOpacity,
        size: 26,
      },
    }),
    [],
  );

  return (
        <PageContainer style={{paddingTop: 100, backgroundColor: colors.white}}>
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
  textStyle: {
    color: colors.white,
  },
  buttonStyle: {
    backgroundColor: colors.yellow,
    borderRadius: 5,
  }
});


export default ImageSelectorScreen;