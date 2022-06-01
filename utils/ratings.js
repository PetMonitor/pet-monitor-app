
import React from 'react';
import { View } from 'react-native';

import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

import colors from '../config/colors';

export const Rating = ({starCount}) => {
    var stars = [];

    var starCountFloor = Math.floor(starCount);
    for (let i = 0; i < starCountFloor; i++) {
        stars.push(<FontAwesomeIcon key={'full-' + i} name='star' size={20} color={colors.secondary}/>)
    }
    var emptyStars = 5 - starCountFloor
    if (starCount - starCountFloor > 0) {
        stars.push(<FontAwesomeIcon key={'half'} name='star-half-o' size={20} color={colors.secondary}/>)
        emptyStars -= 1
    }
    if (emptyStars > 0) {
        for (let i = 0; i < emptyStars; i++) {
            stars.push(<FontAwesomeIcon key={'empty-' + i} name='star-o' size={20} color={colors.secondary}/>)
        }
    }
    return (
        <View style={{flexDirection: 'row'}} >{stars}</View>
    )
};
