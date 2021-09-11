import { StyleSheet } from 'react-native';
import { moderateScale } from 'react-native-size-matters';

// use https://chir.ag/projects/name-that-color
export const ipctColors = {
    greenishTeal: '#2DCE89',
    softGray: '#E9EDF4',
    regentGray: '#7E8DA6',
    almostBlack: '#1E3252',
    baliHai: '#8898AA',
    nileBlue: '#172B4D',
    blueRibbon: '#2362FB',
    ghost: '#CED4DA',
    borderGray: '#8A9FC2',
    darBlue: '#333239',
    white: '#FFFFFF',
    softWhite: '#DCDFE44F',
    blueGray: '#73839D',
    warningOrange: '#FE9A22',
    errorRed: '#EB5757',
    lynch: '#73839D',
    mirage: '#172032',
};

export const ipctFontSize = {
    tiny: moderateScale(11),
    xsmall: moderateScale(12),
    smaller: moderateScale(14),
    small: moderateScale(16),
    average: moderateScale(18),
    regular: moderateScale(20),
    lowMedium: moderateScale(22),
    medium: moderateScale(24),
    large: moderateScale(36),
    huge: moderateScale(50),
};

export const ipctSpacing = {
    none: 0,
    tiny: moderateScale(2),
    xsmall: moderateScale(4),
    small: moderateScale(8),
    medium: moderateScale(16),
    regular: moderateScale(22),
    big: moderateScale(24),
    large: moderateScale(32),
};

export const ipctLineHeight = {
    none: 0,
    tiny: moderateScale(2),
    xsmall: moderateScale(14),
    smaller: moderateScale(16),
    small: moderateScale(18),
    medium: moderateScale(20),
    big: moderateScale(22),
    bigger: moderateScale(24),
    large: moderateScale(28),
    xlarge: moderateScale(32),
};

export default StyleSheet.create({});
