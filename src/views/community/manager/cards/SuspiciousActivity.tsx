import i18n from 'assets/i18n';
import Card from 'components/core/Card';
import WarningTriangle from 'components/svg/WarningTriangle';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Headline, Paragraph } from 'react-native-paper';
import { ipctColors } from 'styles/index';

function SuspiciousActivity() {
    return (
        <Card style={styles.cardContainer}>
            <View style={styles.headlineContainer}>
                <WarningTriangle />
                <Headline style={styles.headerTitle}>
                    {i18n.t('community.suspiciousActivityDetected')}
                </Headline>
            </View>
            <Paragraph style={styles.paragraphContent}>
                {i18n.t('community.suspiciousDescription')}
            </Paragraph>
        </Card>
    );
}

export default SuspiciousActivity;

const styles = StyleSheet.create({
    cardContainer: {
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderStyle: 'solid',
        borderColor: '#EB5757',
        borderWidth: 2,
        borderRadius: 8,
        marginTop: 6,
        elevation: 0,
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
        marginLeft: 10,
    },
    paragraphContent: {
        textAlign: 'auto',
        marginTop: 8,
        color: ipctColors.nileBlue,
        fontFamily: 'Inter-Regular',
        fontSize: 14,
        lineHeight: 24,
    },
});
