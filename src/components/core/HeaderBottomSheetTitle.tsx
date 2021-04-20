import BackSvg from 'components/svg/BackSvg';
import CloseStorySvg from 'components/svg/CloseStorySvg';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const renderHeader = (
    title: string,
    ref: React.RefObject<any>,
    cb?: React.SetStateAction<any>,
    leftIcon?: boolean
) => {
    return (
        <View style={styles.bottomSheetHeaderContainer}>
            {leftIcon && (
                <BackSvg
                    onPress={() => {
                        ref.current?.close();
                        cb && cb();
                    }}
                />
            )}
            <Text style={styles.bottomSheetHeaderText}>{title}</Text>
            {!leftIcon && (
                <CloseStorySvg
                    onPress={() => {
                        ref.current?.close();
                        cb && cb();
                    }}
                />
            )}
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
