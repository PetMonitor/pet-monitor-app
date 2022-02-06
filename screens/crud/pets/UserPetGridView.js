import React from "react";
import colors from '../../../config/colors';
import Icon from 'react-native-vector-icons/AntDesign';

import { Text, TouchableOpacity, View, Image, StyleSheet } from 'react-native';


export class UserPetGridView extends React.PureComponent {

    constructor(props) {
        super(props);
    }

    render() {

        const handleNavigateToPetProfile = (petId) => {
            alert('Redirect to create new pet!');
        }

        const handleCreateNewPet = () => {
            alert('Redirect to create new pet!');
        }

        return(
            <View style={styles.container}>
                {this.props.pets?.map((pet, index) => {
                    console.log(`PETS ${JSON.stringify(this.props.pets)}`)

                    //console.log(`Rendering pet image ${JSON.stringify(this.state.pets)}`)
                    return <View key={'view_' + index} >
                        <TouchableOpacity key={'img_btn_'+ index} onPress={()=>{alert('Get pet profile!')}}>
                            <Image key={'img_' + index} style={{width: 120, height: 120, margin: 20, padding: 20}} source={{ uri: global.noticeServiceBaseUrl + '/photos/' + pet.photoId }}/>
                        </TouchableOpacity>
                        <Text key={'text_' + index} style={styles.text}>{pet.name?.toUpperCase()}</Text>
                    </View>
                })}
                <Icon.Button
                    style={{margin: 10, padding: 10}}
                    size={120}
                    name="plus"
                    backgroundColor={colors.white}
                    color={colors.yellow}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    text: {
        color: colors.yellow,
        fontWeight: "bold",
        fontSize: 20,
        alignSelf: "center"
    },
    container: {
        flex: 1,
        backgroundColor: 'white',
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignContent: 'space-around',
    },
    column: {
        width: '50%'
    },
    line: {

    }
});