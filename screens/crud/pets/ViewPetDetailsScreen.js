import React from "react";

import {
  Text,
  Image,
  StyleSheet,
  Modal,
  View,
  ScrollView,
  FlatList,
  Dimensions,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import MaterialIcon from "react-native-vector-icons/MaterialCommunityIcons";

import {
  getJsonData,
  postJsonData,
  getLocationFromCoordinates,
  fetchFosterVolunteerProfilesByRegion,
  HttpStatusCodes,
} from "../../../utils/requests.js";
import { getSecureStoreValueFor } from "../../../utils/store";
import { HeaderWithBackArrow } from "../../../utils/headers";
import {
  mapPetSexToLabel,
  mapPetSizeToLabel,
  mapPetLifeStageToLabel,
  mapPetTypeToLabel,
} from "../../../utils/mappers";
import { AppButton } from "../../../utils/buttons.js";
import { OptionTextInput } from "../../../utils/editionHelper.js";

import commonStyles from "../../../utils/styles";
import colors from "../../../config/colors";

import { selectedLocation } from "../../../utils/commons.js";

import * as Location from "expo-location";
import DropDownPicker from "react-native-dropdown-picker";

const { height, width } = Dimensions.get("screen");

export class ViewPetDetailsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      petId: this.props.route.params.petId,
      name: "",
      petPhotos: [],
      sex: "",
      petType: "",
      furColor: "",
      breed: "",
      size: "",
      lifeStage: "",
      petDescription: "",
      isMyPet: false,
      volunteers: [],
      searchRegion: "",
      dropdownValue: null,
      filterByRegion: true,
      openDropdown: false,
      transferInProgress: false,
      transferData: null,
      newFosteringHomeModalVisible: false,
    };
  }

  renderPet = ({ item }) => {
    return (
      <Image
        key={"img_" + item.photoId}
        resizeMode="cover"
        style={{
          aspectRatio: 1,
          height: height / 3.5,
          borderRadius: 5,
          marginRight: 5,
        }}
        source={{
          uri: global.noticeServiceBaseUrl + "/photos/" + item.photoId,
        }}
      />
    );
  };

  onPetDataUpdated = () => {
    this.getPetDetails();
  };

  editPetsDetails = () => {
    this.props.navigation.push("EditPetDetails", {
      petData: this.state,
      userId: this.props.route.params.userId,
      onPetDeleted: this.props.route.params.onPetDeleted,
      onUpdate: this.onPetDataUpdated,
    });
  };

  getPetDetails = () => {
    getSecureStoreValueFor("sessionToken").then((sessionToken) => {
      getJsonData(
        global.noticeServiceBaseUrl +
          "/users/" +
          this.props.route.params.userId +
          "/pets/" +
          this.props.route.params.petId,
        {
          Authorization: "Basic " + sessionToken,
        }
      )
        .then((responsePet) => {
          this.setState({
            name: responsePet.name,
            petPhotos: responsePet.photos,
            sex: responsePet.sex,
            petType: responsePet.type,
            furColor: responsePet.furColor,
            breed: responsePet.breed,
            size: responsePet.size,
            lifeStage: responsePet.lifeStage,
            petDescription: responsePet.description,
          });
        })
        .catch((err) => {
          console.log(err);
          alert(err);
        });
    });
    getSecureStoreValueFor("userId").then((userId) =>
      this.setState({ isMyPet: userId === this.props.route.params.userId })
    );
  };

  getPetTransfers = () => {
    getJsonData(
      global.noticeServiceBaseUrl +
        "/pets/" +
        this.props.route.params.petId +
        "/transfer"
    )
      .then((transferData) => {
        // console.log(`TRANSFER DATA WAS ${JSON.stringify(transferData)}`)
        this.setState({ transferData: transferData, transferInProgress: true });
      })
      .catch((err) => {
        if (err.statusCode == HttpStatusCodes.NOT_FOUND) {
          this.setState({ transferData: null, transferInProgress: false });
          return;
        }
        console.log(err);
        alert(err);
      });
  };

  setFosteringHomeModalVisible = (visible) => {
    this.setState({ newFosteringHomeModalVisible: visible });
  };

  cancelTransferAction = () => {
    console.log("Cancel pressed");
    this.setFosteringHomeModalVisible(false);
  };

  transferPet = () => {
    if (this.state.transferInProgress) {
      console.error("Cannot transfer pet: transference already in progress");
      this.setFosteringHomeModalVisible(false);
      this.getPetTransfers();
      return;
    }

    if (!this.state.dropdownValue) {
      console.error("Cannot transfer pet: must select a volunteer first");
      alert("Debes seleccionar un voluntario!");
      return;
    }

    let newHome = {
      transferToUser: this.state.dropdownValue,
    };

    console.log(`Requested to transfer pet to ${JSON.stringify(newHome)}`);

    postJsonData(
      global.noticeServiceBaseUrl + "/pets/" + this.state.petId + "/transfer",
      newHome
    )
      .then((response) => {
        console.log(`Pet transfer successfully created!`);
        this.setState({ transferInProgress: true });
        alert("Transferencia iniciada con éxito!");
        this.getPetTransfers();
      })
      .catch((err) => {
        console.error(err);
      });
    this.setFosteringHomeModalVisible(false);
  };

  onTransferCancelled = () => {
    this.setState({ transferInProgress: false, transferData: null })
  }

  fillLocationInfo = (latitude, longitude) => {
    getLocationFromCoordinates(latitude, longitude)
      .then((response) => {
        let eventLocation = selectedLocation(response.data);
        let userRegion = null;
        if (eventLocation.neighbourhood) {
          userRegion = eventLocation.neighbourhood;
        } else if (eventLocation.locality) {
          userRegion = eventLocation.locality;
        }
        this.setState(
          {
            filterByRegion: userRegion != "" ? true : false,
            searchRegion: userRegion,
          },
          () => this.searchVolunteers()
        );
      })
      .catch((err) => {
        alert(err);
      });
  };

  setDropdownValues = (searchResults) => {
    //console.log(`RESPONSE WAS ${JSON.stringify(searchResults)}`);
    this.setState({
      volunteers: searchResults.volunteers,
      dropdownValue: searchResults.dropdownValue,
    });
  };

  searchVolunteers = () => {
    fetchFosterVolunteerProfilesByRegion(
      this.state.filterByRegion,
      this.state.searchRegion,
      this.setDropdownValues
    );
  };

  async componentDidMount() {
    await this.getPetDetails();
    await this.getPetTransfers();

    Location.requestForegroundPermissionsAsync().then((response) => {
      if (response.status !== "granted") {
        alert("Permission to access location was denied");
        return;
      }

      Location.getCurrentPositionAsync({}).then((userLocation) => {
        this.fillLocationInfo(
          userLocation.coords.latitude,
          userLocation.coords.longitude
        );
      });
    });
  }

  render() {
    const dividerLine = (
      <View
        style={{
          marginTop: 10,
          borderBottomColor: colors.secondary,
          borderBottomWidth: 1,
        }}
      />
    );

    const changeNewHomeModalVisibility = () =>
      this.setFosteringHomeModalVisible(
        !this.state.newFosteringHomeModalVisible
      );

    return (
      <SafeAreaView style={commonStyles.container}>
        <HeaderWithBackArrow
          headerText={"Mascota"}
          headerTextColor={colors.secondary}
          backgroundColor={colors.white}
          backArrowColor={colors.secondary}
          onBackArrowPress={() => this.props.navigation.goBack()}
        />
        <View style={{ flex: 1, justifyContent: "flex-end" }}>
          <FlatList
            data={this.state.petPhotos}
            horizontal={true}
            keyExtractor={(_, index) => index.toString()}
            initialNumToRender={this.state.petPhotos.length}
            renderItem={this.renderPet}
          />
          <View
            style={{
              width: width,
              backgroundColor: colors.semiTransparent,
              position: "absolute",
              height: 30,
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                paddingLeft: 35,
                fontSize: 24,
                fontWeight: "bold",
                color: colors.clearBlack,
              }}
            >
              {this.state.name}
            </Text>
          </View>
        </View>
        <NewFosteringHomeModal
          isVisible={this.state.newFosteringHomeModalVisible}
          onModalClose={changeNewHomeModalVisibility}
          cancelTransferAction={changeNewHomeModalVisibility}
          transferPetAction={this.transferPet}
          openDropdown={this.state.openDropdown}
          onSetOpen={(open) => this.setState({ openDropdown: open })}
          dropdownValue={this.state.dropdownValue}
          onSetValue={(callback) =>
            this.setState((state) => ({
              dropdownValue: callback(state.dropdownValue),
            }))
          }
          volunteers={this.state.volunteers}
          searchRegion={this.state.searchRegion}
          onSearchRegionChange={(text) => this.setState({ searchRegion: text })}
          onSearchPress={() => this.searchVolunteers()}
        />

        <View style={{ flex: 2 }}>
          <View style={{ paddingHorizontal: 35 }}>
            <View style={{ ...commonStyles.alignedContent, paddingTop: 20 }}>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  color: colors.clearBlack,
                }}
              >
                Información
              </Text>
              {this.state.isMyPet ? (
                <TouchableOpacity onPress={() => this.editPetsDetails()}>
                  <MaterialIcon
                    name="pencil"
                    size={20}
                    color={colors.secondary}
                    style={{ paddingLeft: 10 }}
                  />
                </TouchableOpacity>
              ) : (
                <></>
              )}
            </View>
            {dividerLine}
          </View>
          <ScrollView style={{ flex: 1, paddingHorizontal: 35 }}>
            <View style={commonStyles.alignedContent}>
              <View style={{ flexDirection: "column", flex: 0.5 }}>
                <Text style={styles.optionTitle}>Tipo</Text>
                <Text style={styles.textInput}>
                  {mapPetTypeToLabel(this.state.petType)}
                </Text>
                <Text style={styles.optionTitle}>Sexo</Text>
                <Text style={styles.textInput}>
                  {mapPetSexToLabel(this.state.sex)}
                </Text>
                <Text style={styles.optionTitle}>Tamaño</Text>
                <Text style={styles.textInput}>
                  {mapPetSizeToLabel(this.state.size)}
                </Text>
              </View>
              <View style={{ flexDirection: "column", flex: 0.5 }}>
                <Text style={styles.optionTitle}>Raza</Text>
                <Text style={styles.textInput}>{this.state.breed}</Text>
                <Text style={styles.optionTitle}>Color pelaje</Text>
                <Text style={styles.textInput}>{this.state.furColor}</Text>
                <Text style={styles.optionTitle}>Etapa de la vida</Text>
                <Text style={styles.textInput}>
                  {mapPetLifeStageToLabel(this.state.lifeStage)}
                </Text>
              </View>
            </View>

            <Text style={styles.optionTitle}>Descripción</Text>
            <Text style={styles.textInput}>{this.state.petDescription}</Text>

            {this.state.isMyPet && !this.state.transferInProgress ? (
              <AppButton
                buttonText={"Transferir"}
                onPress={() => {
                  this.setFosteringHomeModalVisible(true);
                }}
                additionalButtonStyles={{
                  alignItems: "center",
                  flex: 1,
                  width: "90%",
                  backgroundColor: colors.primary,
                }}
              />
            ) : null}

            {this.state.isMyPet && this.state.transferInProgress && this.state.transferData != null ? (
              <AppButton
                buttonText={"Estado de Transferencia"}
                onPress={() => {
                  this.props.navigation.push('CancelPetTransfer', { transferData: this.state.transferData, onTransferCancelled: this.onTransferCancelled });
                }}
                additionalButtonStyles={{
                  alignItems: "center",
                  flex: 1,
                  width: "90%",
                  backgroundColor: colors.yellow,
                }}
              />
            ) : null}
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }
}

const NewFosteringHomeModal = ({
  isVisible,
  cancelTransferAction,
  transferPetAction,
  openDropdown,
  onSetOpen,
  dropdownValue,
  onSetValue,
  volunteers,
  searchRegion,
  onSearchRegionChange,
  onSearchPress,
}) => {
  return (
    <View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isVisible}
        onRequestClose={() => {
          this.setFosteringHomeModalVisible(false);
        }}
      >
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "stretch" }}
        >
          <FosterEntryForTransferInfo
            onCancelPress={cancelTransferAction}
            onTransferPress={transferPetAction}
            openDropdown={openDropdown}
            onSetOpen={onSetOpen}
            dropdownValue={dropdownValue}
            onSetValue={onSetValue}
            volunteers={volunteers}
            searchRegion={searchRegion}
            onSearchRegionChange={onSearchRegionChange}
            onSearchPress={onSearchPress}
          />
        </View>
      </Modal>
    </View>
  );
};

const FosterEntryForTransferInfo = ({
  onCancelPress,
  onTransferPress,
  openDropdown,
  onSetOpen,
  dropdownValue,
  onSetValue,
  volunteers,
  searchRegion,
  onSearchRegionChange,
  onSearchPress,
}) => {
  return (
    <View style={styles.modalView}>
      <Text style={[styles.modalTitle, { marginBottom: 25 }]}>
        {"Transferir Mascota"}
      </Text>
      <Text
        style={[
          styles.modalText,
          { fontWeight: "bold", marginTop: 20, marginBottom: 5 },
        ]}
      >
        Voluntario para alojamiento transitorio
      </Text>
      <View>
        <Text style={{ color: colors.clearBlack, marginTop: 10 }}>
          Filtrar voluntarios por región
        </Text>
        <View style={commonStyles.alignedContent}>
          <OptionTextInput
            value={searchRegion}
            placeholder={"Región"}
            onChangeText={onSearchRegionChange}
            additionalStyle={{ flex: 2, marginTop: 0, padding: 8 }}
          />
          <AppButton
            buttonText={"Filtrar"}
            onPress={onSearchPress}
            additionalButtonStyles={{ flex: 1, marginTop: 10, padding: 8 }}
            isDisabled={searchRegion === ""}
          />
        </View>
      </View>

      <DropDownPicker
        open={openDropdown}
        value={dropdownValue}
        items={volunteers}
        setValue={onSetValue}
        setOpen={onSetOpen}
        onSelectItem={(item) => console.log(item)}
        style={{
          borderColor: colors.secondary,
          marginBottom: 10,
        }}
        textStyle={{
          color: colors.clearBlack,
          fontWeight: "bold",
        }}
        dropDownContainerStyle={{
          borderColor: colors.secondary,
        }}
        disabledStyle={{
          opacity: 0.5,
        }}
      />

      <View style={[commonStyles.alignedContent, { marginTop: 20 }]}>
        <AppButton
          buttonText={"Cancelar"}
          onPress={onCancelPress}
          additionalButtonStyles={{
            alignItems: "center",
            flex: 1,
            width: "50%",
            backgroundColor: colors.pink,
          }}
        />
        <AppButton
          buttonText={"Transferir"}
          onPress={onTransferPress}
          additionalButtonStyles={{
            alignItems: "center",
            flex: 1,
            width: "50%",
            backgroundColor: colors.primary,
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  optionTitle: {
    fontSize: 16,
    color: colors.clearBlack,
    paddingTop: 20,
    fontWeight: "bold",
  },
  textInput: {
    paddingTop: 10,
    color: colors.clearBlack,
    fontSize: 16,
  },
  button: {
    backgroundColor: colors.secondary,
    margin: 0,
    marginTop: 10,
    alignSelf: "stretch",
  },
  editableTextInput: {
    borderRadius: 8,
    backgroundColor: colors.inputGrey,
    padding: 10,
    borderWidth: 1,
    borderColor: colors.inputGrey,
    fontSize: 16,
    fontWeight: "500",
    width: "70%",
    marginTop: 10,
    marginRight: 10,
  },
  modalView: {
    margin: 20,
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 35,
    shadowColor: colors.clearBlack,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    marginBottom: 15,
    color: colors.secondary,
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    color: colors.clearBlack,
  },
});
