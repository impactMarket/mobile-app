import ProfileSvg from 'components/svg/ProfileOutlineSvg';
import BackSvg from 'components/svg/header/BackSvg';
import FAQSvg from 'components/svg/header/FaqSvg';
import ImpactMarketHeaderLogoSVG from 'components/svg/header/ImpactMarketHeaderLogoSVG';
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { ipctFontSize, ipctLineHeight, ipctSpacing } from 'styles/index';

interface BaseHeaderProps {
    back?: boolean;
    screenTitle?: string;
}
function BaseHeader({ back, screenTitle }: BaseHeaderProps) {
    return (
        <View style={styles.container}>
            <View style={styles.innerBox}>
                {back ? (
                    <>
                        <BackSvg />
                        <Text style={styles.title}>{screenTitle}</Text>
                    </>
                ) : (
                    <ImpactMarketHeaderLogoSVG />
                )}
            </View>

            <View style={styles.innerBox}>
                <FAQSvg />
                <ProfileSvg />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 55,
        paddingHorizontal: ipctSpacing.regular,
        paddingVertical: ipctSpacing.small,
    },
    innerBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    title: {
        fontFamily: 'Manrope-Regular',
        fontSize: ipctFontSize.lowMedium,
        fontWeight: '800',
        lineHeight: ipctLineHeight.large,
        letterSpacing: 0,
        textAlign: 'left',
    },
});
export default BaseHeader;
