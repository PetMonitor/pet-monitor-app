import React from "react";

import { postJsonData } from "../../../utils/requests.js";
import { mapPetSizeToLabel, mapPetTypeToLabel } from "../../../utils/mappers.js";

import {
  Modal,
  TouchableOpacity,
  Text,
  StyleSheet,
  SafeAreaView,
  View,
} from "react-native";
import { AppButton } from "../../../utils/buttons";
import { HeaderWithBackArrow } from "../../../utils/headers";
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

import commonStyles from "../../../utils/styles";
import colors from "../../../config/colors.js";
import moment from "moment";
import "moment/locale/es";

const PET_TRANSFER_CANCELLED = "Transferencia cancelada!";

export class CancelPetTransferScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalText: PET_TRANSFER_CANCELLED,
      cancellationConfirmedModalVisible: false,
      userDetails: null,
    };
  }

  render() {
    const { navigation } = this.props;
    const { transferData, onTransferCancelled } = this.props.route.params;

    const handleCancelPetTransfer = () => {
      postJsonData(
        global.noticeServiceBaseUrl +
          "/pets/" +
          transferData.petId +
          "/transfer/" +
          transferData.uuid +
          "/cancel"
      )
        .then((response) => {
          console.log(`Cancelled pet transfer for pet ${transferData.petId}`);
          onTransferCancelled()
          this.setState({ cancellationConfirmedModalVisible: true });
        })
        .catch((error) => {
          console.error(
            `Error cancelling pet transfer for pet ${transferData.petId}: ${error}`
          );
          navigation.navigate("ViewPet");
        });
    };

    const handleCancellationConfirmed = () => {
      this.setState({ cancellationConfirmedModalVisible: false });
      navigation.pop();
    };

    const formatDate = (date) => {
      const m = moment(date);
      m.locale("es");
      return m.format("DD MMM YYYY");
    };

    const formatLocation = (userLocation) => {
        if (userLocation.province.length == 0 && userLocation.location.length == 0) {
            return null;
        }

        let locText = userLocation.province;
        locText += userLocation.province.length > 0 ? ', ' : '';
        locText += userLocation.location;

        return <View
            style={{
              flex: 0.5,
              flexDirection: "row",
              flexWrap: "wrap",
              textAlign: "center",
            }}
          >
            <MaterialIcon name='location-on' size={30} style={{paddingLeft:20, paddingRight: 0, paddingTop:10}} color={colors.secondary}/><Text style={[styles.text, {fontWeight: 'bold'}]}>{ locText }</Text>
        </View>
    }

    const formatUserName = (userData) => {

        let name = userData.name.length > 0 ? userData.name : userData.username

        return <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          textAlign: "center",
        }}
      >
        <Text style={[styles.text, { fontWeight: 'bold', marginTop: 15, marginLeft: 15 }]}>
          {name.charAt(0).toUpperCase() + name.slice(1)}
        </Text>
      </View>
    }

    const formatPetTypeLabels = (volunteerData) => {
        let petTypes = volunteerData.petTypesToFoster.map(petType => mapPetTypeToLabel(petType)).join(", ")
        petTypes = petTypes.length > 0 ? petTypes : "no aclara";

        return <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          textAlign: "center",
        }}
      >
        <Text style={[styles.text, { fontWeight: 'bold', marginLeft: 15 }]}>Tipo: </Text>
        <Text style={[styles.text, { marginLeft:0, paddingLeft:0 }]}>
          {petTypes}
        </Text>
      </View>
    }

    const formatPetSizeLabels = (volunteerData) => {
        let petSizes = volunteerData.petSizesToFoster.map(petSize => mapPetSizeToLabel(petSize)).join(", ")
        petSizes = petSizes.length > 0 ? petSizes : "no aclara";

        return <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          textAlign: "center",
        }}
      >
        <Text style={[styles.text, {fontWeight: 'bold', marginLeft: 15}]}>Tamaño: </Text>
        <Text style={[styles.text,{ marginLeft:0, paddingLeft:0 }]}>
         {petSizes}
        </Text>
      </View>
    }

    return (
      <>
        <SafeAreaView
          edges={["top"]}
          style={{ flex: 0, backgroundColor: colors.white }}
        />
        <SafeAreaView
          edges={["left", "right", "bottom"]}
          style={commonStyles.container}
        >
          <HeaderWithBackArrow
            headerText={"Transferencia de Mascota"}
            headerTextColor={colors.primary}
            backgroundColor={colors.white}
            backArrowColor={colors.primary}
            onBackArrowPress={() => this.props.navigation.goBack()}
          />

          <View >
            <Modal
              animationType="slide"
              transparent={true}
              visible={this.state.cancellationConfirmedModalVisible}
              onRequestClose={() => {
                handleCancellationConfirmed();
              }}
            >
              <View
                style={{
                  flex: 0.3,
                  justifyContent: "center",
                  alignItems: "stretch",
                }}
              >
                <View style={styles.modalView}>
                  <Text style={styles.modalText}>{this.state.modalText}</Text>
                  <TouchableOpacity
                    style={[
                      styles.modalButton,
                      {
                        width: "50%",
                        alignSelf: "center",
                        alignItems: "center",
                      },
                    ]}
                    onPress={() => {
                      handleCancellationConfirmed();
                    }}
                  >
                    <Text>Ok</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </View>

          <View style={{ flex: 0.5, paddingTop: 40 }}>
            <Text style={styles.title}>Estado de Tansferencia</Text>
          </View>
          
          <View
            style={{
              flex: 0.5,
              marginLeft: "5%",
              flexDirection: "row",
              flexWrap: "wrap",
              textAlign: "center",
            }}
          >
            <Text style={[styles.text, { fontWeight: "bold" }]}>Iniciada:</Text>
            <Text
              style={[styles.text, { marginLeft: "0%", paddingLeft: "0%" }]}
            >
              {formatDate(transferData.activeFrom)}
            </Text>
          </View>

          <View
            style={{
              flex: 0.5,
              marginLeft: "5%",
              flexDirection: "row",
              flexWrap: "wrap",
              textAlign: "center",
            }}
          >
            <Text style={[styles.text, { fontWeight: "bold" }]}>
              Válida hasta:
            </Text>
            <Text
              style={[styles.text, { marginLeft: "0%", paddingLeft: "0%" }]}
            >
              {formatDate(transferData.activeUntil)}
            </Text>
          </View>

          <View
            style={{
              marginTop: 20,
              marginLeft: "5%",
              width: "90%",
              borderBottomColor: colors.grey,
              borderBottomWidth: 1,
            }}
          />

          <View
            style={{
              flex: 0.5,
              flexDirection: "row",
              flexWrap: "wrap",
              textAlign: "center",
            }}
          >
            <Text style={styles.subtitle}>Datos del destinatario</Text>
          </View>

          {formatUserName(transferData.transferToUser)}

          {formatLocation(transferData.transferToUser.volunteerData)}

          <View
            style={{
              flex: 0.5,
              flexDirection: "row",
              flexWrap: "wrap",
              textAlign: "center",
              paddingTop: 15,
              paddingBottom: 15
            }}
          >
            <Text style={styles.subtitle}>
              Puede transitar mascotas ...
            </Text>
          </View>

          {formatPetTypeLabels(transferData.transferToUser.volunteerData)}

          {formatPetSizeLabels(transferData.transferToUser.volunteerData)}

          <View
            style={{
              flex: 2,
              paddingTop: 30,
              paddingBottom: 50,
              marginHorizontal: 20,
            }}
          >
            <AppButton
              buttonText={"Cancelar Transferencia"}
              onPress={handleCancelPetTransfer}
              additionalButtonStyles={[styles.button, { marginTop: 40 }]}
            />
          </View>
        </SafeAreaView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.pink,
    alignSelf: "center",
    width: "70%",
    marginHorizontal: 0,
  },
  modalButton: {
    backgroundColor: colors.secondary,
    margin: 0,
    marginTop: 10,
    padding: 18,
    borderRadius: 7,
    width: "55%",
    height: "50%",
    alignSelf: "flex-start",
  },
  title: {
    textAlign: "center",
    color: colors.yellow,
    fontSize: 22,
    fontWeight: "bold",
  },
  subtitle: {
    fontWeight: "bold",
    color: colors.grey,
    fontSize: 18,
    paddingBottom: "5%",
    marginBottom: "5%",
    marginTop: "5%",
    paddingLeft: "7%",
  },
  text: {
    color: colors.darkGrey,
    fontSize: 16,
    padding: "5%",
  },
  modalView: {
    margin: 20,
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: colors.clearBlack,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation:3,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});
