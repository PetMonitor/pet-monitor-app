import React from 'react';
import { Picker, Text, TextInput, TouchableOpacity, StatusBar, StyleSheet, SafeAreaView, ScrollView, View } from 'react-native';

export class CreatePetScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            petName: '',
            petType: props.route.params.initPetType,
            size: 'small',
            lifeStage: 'puppy',
            breed: '',
            sex: 'male',
            furColour: '',
            description: ''
        }
    }

    render() {

        const { userInfo, initialSetup, initPetType } = this.props.route.params;
        const numberOfLines = 7;

        const handleNextPet = () => {
            if (!initialSetup) {
                alert('Method not allowed outside initial setup context!');
            }

            // Add pet to user's list of pets
            userInfo['pets'] = [
                ...userInfo['pets'],
                this.state
            ]

            console.log('Navigating to create pet screen');
            console.log(JSON.stringify(userInfo));

            this.props.navigation.push('CreatePet', { userInfo: userInfo, initialSetup: true, initPetType: initPetType}); 
        };

        const handleFinishInitialSetup = () => {
            if (!initialSetup) {
                alert('Method not allowed outside initial setup context!');
            }

            // Add pet to user's list of pets
            userInfo['pets'] = [
                ...userInfo['pets'],
                this.state
            ]
            
            console.log('Create user:');
            console.log(JSON.stringify(userInfo));        
        };

        return (
            <SafeAreaView style={styles.container}>   
                <ScrollView style={styles.scrollView} >
                    <Text style={styles.label}>Name</Text>
                    <TextInput 
                        onChangeText = { petName => { this.setState({ petName: petName })}}
                        autoCapitalize = 'none'
                        autoCorrect = { false }
                        style = { styles.textInput }
                        maxLength = { 100 } />
                    <View style={{flex:1, flexDirection: 'row'}}>
                        <View style={{flex:1, flexDirection: 'column'}}>
                            <Text style={styles.label}>Type</Text>
                            <Picker
                                selectedValue={this.state.petType}
                                style={{ height: 44, width: 100, marginBottom: 15, marginTop: 5}}
                                itemStyle={{height: 88}}
                                onValueChange={(itemValue, itemIndex) => this.setState({ petType: itemValue })}>
                                    <Picker.Item label="Cat" value="cat" />
                                    <Picker.Item label="Dog" value="dog" />
                            </Picker>
                            <Text style={styles.label}>Sex</Text>
                            <Picker
                                selectedValue={this.state.sex}
                                style={{ height: 64, width: 100 }}
                                itemStyle={{height: 88}}
                                onValueChange={(itemValue, itemIndex) => this.setState({ sex: itemValue })}>
                                    <Picker.Item label="Male" value="male" />
                                    <Picker.Item label="Female" value="female" />
                            </Picker>
                            
                        </View>
                        <View style={{flex:1, flexDirection: 'column'}}>
                            <Text style={styles.label}>Life Stage</Text>
                            <Picker
                                selectedValue={this.state.lifeStage}
                                style={{ height: 44, width: 150, marginBottom: 15, marginTop: 5 }}
                                itemStyle={{height: 88}}
                                onValueChange={(itemValue, itemIndex) => this.setState({ lifeStage: itemValue })}>
                                    <Picker.Item label="Puppy" value="puppy" />
                                    <Picker.Item label="Middle Age" value="middleAge" />
                                    <Picker.Item label="Old" value="old" />
                            </Picker>
                            <Text style={styles.label}>Size</Text>
                            <Picker
                                selectedValue={this.state.size}
                                style={{ height: 44, width: 150 }}
                                itemStyle={{height: 88}}
                                onValueChange={(itemValue, itemIndex) => this.setState({ size: itemValue })}>
                                    <Picker.Item label="Small" value="small" />
                                    <Picker.Item label="Medium" value="medium" />
                                    <Picker.Item label="Large" value="large" />
                            </Picker>
                        </View>
                    </View>
                    <Text style={styles.label}>Breed</Text>
                    <TextInput 
                        onChangeText = { breed => { this.setState({ breed: breed })}}
                        autoCapitalize = 'none'
                        autoCorrect = { false }
                        style = { styles.textInput }
                        maxLength = { 100 } />
                    <Text style={styles.label}>Fur Colour</Text>
                    <TextInput 
                        onChangeText = { furColour => { this.setState({ furColour: furColour })}}
                        autoCapitalize = 'none'
                        autoCorrect = { false }
                        style = { styles.textInput }
                        maxLength = { 100 } />
                    <TouchableOpacity  style={styles.button}>
                        <Text style={styles.buttonFont}>Upload Photo</Text>
                    </TouchableOpacity>
                    <Text style={styles.label}>Description</Text>
                    <TextInput 
                        multiline={true}
                        numberOfLines={Platform.OS === 'ios' ? null : numberOfLines}
                        minHeight={(Platform.OS === 'ios' && numberOfLines) ? (20 * numberOfLines) : null}
                        onChangeText = { description => { this.setState({ description: description })}}
                        autoCapitalize = 'none'
                        autoCorrect = { false }
                        style = { styles.textInput }
                        maxLength = { 100 } />

                    {/* Buttons for initial setup where user can
                        create user profile + add pets. 
                    */}
                    <TouchableOpacity onPress={handleNextPet}  style={styles.button}>
                        <Text style={styles.buttonFont}>Next Pet</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleFinishInitialSetup} style={styles.button}>
                        <Text style={styles.buttonFont}>Finish</Text>
                    </TouchableOpacity>
                    {/* This next view is a workaround because scrollview won't go 
                        all the way to the bottom of the page 
                    */}
                    <View style={{flex:1, paddingTop:'30%'}}/> 
                </ScrollView>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        flexDirection: 'column', // main axis: vertical
        alignItems: 'center', // align items across secondary axis (horizontal)
        justifyContent: 'center', // justify along main axis (vertical)
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    scrollView: {
        flex: 1,
        width:'100%',
        backgroundColor: 'white',
        marginHorizontal: 20,
        paddingLeft: '7%',
    },
    textInput: {
        height: '4%',
        backgroundColor: 'white',
        borderWidth: 1,
        margin: 10,
        width: '80%',
    },
    label: {
        fontSize: 18,
        paddingTop: 10,
        marginTop: 20,
    },
    button: {
        padding: 10,
        margin: 10,
        borderRadius: 7,
        backgroundColor: '#e1ad01',
        width: '80%',
        alignItems: 'center'
    },
    buttonFont: {
        fontSize:18, 
        color: 'white',
        fontWeight: 'bold'
    }
});