import i18n from 'assets/i18n';
import Card from 'components/core/Card';
import LockSvg from 'components/svg/LockSvg';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Headline, Paragraph } from 'react-native-paper';
import { ipctColors } from 'styles/index';

function BlockedAccount() {
    return (
        <Card style={styles.cardContainer}>
            <View style={styles.headlineContainer}>
                <LockSvg />
                <Headline style={styles.headerTitle}>
                    {i18n.t('beneficiary.blockedAccountTitle')}
                </Headline>
            </View>
            <Paragraph style={styles.paragraphContent}>
                {i18n.t('beneficiary.blockedAccountDescription')}
            </Paragraph>
        </Card>
    );
}

export default BlockedAccount;

const styles = StyleSheet.create({
    cardContainer: {
        padding: 16,
        borderRadius: 8,
    },
    headlineContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerTitle: {
        color: ipctColors.nileBlue,
        fontFamily: 'Manrope-Bold',
        fontSize: 16,
        lineHeight: 22,
        letterSpacing: 0.7,
        marginLeft: 10,
    },
    paragraphContent: {
        textAlign: 'left',
        marginTop: 16,

        color: ipctColors.nileBlue,
        fontFamily: 'Inter-Regular',
        fontSize: 15,
        lineHeight: 24,
        letterSpacing: 0.7,
    },
});
