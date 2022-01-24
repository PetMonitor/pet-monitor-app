import React from "react";
import colors from '../../../config/colors';
import { Text, TouchableOpacity, View, Image, StyleSheet } from 'react-native';


export class UserPetListView extends React.PureComponent {


    constructor(props) {
        super(props);

        this.state = {
            petFrames: []
        }
    }

    componentDidMount() {

        if (this.props.pets.length > 0) {

            this.props.pets.map(async pet => {

                this.setState({ petFrames : [
                        ...this.state.petFrames, 
                        { 
                            key: pet.petId,
                            id: pet.petId, 
                            photoId: pet.photoId,
                            name: pet.name 
                        }
                    ] 
                });
            })
        }
    }

    render() {

        return(
            this.state.petFrames.map((pet, index) => {
                //console.log(`Rendering pet image ${JSON.stringify(this.state.pets)}`)
                return <View>
                    <TouchableOpacity onPress={()=>{alert('Get pet profile!')}}>
                        <Image key={'img_' + index} style={{width: 90, height: 90, margin: 10, padding: 10}} source={{ uri: global.noticeServiceBaseUrl + '/photos/' + pet.photoId }}/>
                    </TouchableOpacity>
                    <Text style={styles.text}>{pet.name}</Text>
                </View>
            })
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
});