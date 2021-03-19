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
                    <WarningRedTriangle style={{ width: 16, height: 16 }} />
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
        paddingHorizontal: 16,
        borderStyle: 'solid',
        borderColor: '#EB5757',
        borderWidth: 2,
        borderRadius: 8,
        marginTop: 6,
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
