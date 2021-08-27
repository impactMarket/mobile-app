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
};

export const ipctFontSize = {
    tiny: moderateScale(11),
    xsmall: moderateScale(12),
    smaller: moderateScale(14),
    small: moderateScale(16),
    average: moderateScale(18),
    medium: moderateScale(24),
    large: moderateScale(36),
    huge: moderateScale(54),
};

// export const ipctSpacing = {
//     none: 0,
//     tiny: 2,
//     xsmall: 4,
//     small: 8,
//     medium: 16,
//     big: 24,
//     large: 32
//   }

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
};

export default StyleSheet.create({});
