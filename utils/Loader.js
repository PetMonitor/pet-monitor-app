import React from 'react';
import { StyleSheet, Text } from 'react-native';
import AnimatedLoader from 'react-native-animated-loader';
import colors from '../config/colors';

const PATH_ANIMATION = "../assets/18549-paws-animation.json";

export default class Loader extends React.Component {
  constructor(props) {
    super(props);
    this.state = { visible: false };
  }

  componentDidMount() {
    this.setState({
        visible: !this.state.visible
    });
  }

  render() {
    const { visible } = this.state;
    return (
      <AnimatedLoader
        visible={visible}
        overlayColor={colors.yellow}
        source={require(PATH_ANIMATION)}
        animationStyle={styles.lottie}
        speed={2}
      >
        <Text>Doing something imPAWtant...</Text>
      </AnimatedLoader>
    );
  }
}

const styles = StyleSheet.create({
  lottie: {
    width: 200,
    height: 200
  }
});