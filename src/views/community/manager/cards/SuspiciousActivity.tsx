import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Headline, Paragraph } from 'react-native-paper';

// components
import Card from 'components/core/Card';
import WarningRedTriangle from 'components/svg/WarningRedTriangle';

// translation
import i18n from 'assets/i18n';

// colors
import { ipctColors } from 'styles/index';

// usage
// ----------------
// import SuspiciousActivity from '../cards/SuspiciousActivity';
// <SuspiciousActivity />

function SuspiciousActivity() {
    return (
        <Card style={styles.cardContainer}>
            <Card.Content>
                <View style={styles.headlineContainer}>
                    <WarningRedTriangle />
                    <Headline style={styles.headerTitle}>
                        {i18n.t('suspiciousActivityDetected')}
                    </Headline>
                </View>
                <Paragraph style={styles.paragraphContent}>
                    {i18n.t('suspiciousDescription')}
                </Paragraph>
            </Card.Content>
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
