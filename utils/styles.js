import { StyleSheet } from 'react-native';

import colors from '../config/colors';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
        flexDirection: 'column', // main axis: vertical
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    alignedContent: {
        alignItems:'center', 
        flexDirection: 'row',
    },
});
