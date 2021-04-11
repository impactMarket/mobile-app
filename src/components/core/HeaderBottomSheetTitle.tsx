import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import CloseStorySvg from 'components/svg/CloseStorySvg';

const renderHeader = (
    title: string,
    ref: React.RefObject<any>,
    cb?: React.SetStateAction<any>
) => {
    return (
        <View style={styles.bottomSheetHeaderContainer}>
            <Text style={styles.bottomSheetHeaderText}>{title}</Text>
            <CloseStorySvg
                onPress={() => {
                    ref.current?.close();
                    cb && cb();
                }}
            />
        </View>
    );
};

export default renderHeader;

const styles = StyleSheet.create({
    bottomSheetHeaderContainer: {
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 15,
        paddingHorizontal: 22,
    },
    bottomSheetHeaderText: {
        fontSize: 22,
        lineHeight: 28,
        fontFamily: 'Manrope-Bold',
    },
});
