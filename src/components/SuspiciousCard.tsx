import i18n from 'assets/i18n';
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Text } from 'react-native-paper';
import { ipctColors } from 'styles/index';

import NoSuspiciusBadgeOutlineSvg from './svg/NoSuspiciusBadgeOutlineSvg';
import WarningRedTriangle from './svg/WarningRedTriangle';

export default function SuspiciousCard(props: { suspectCounts: number }) {
    const { width } = Dimensions.get('screen');
    const [cardText, setCardText] = useState<string>();
    const [cardLogo, setCardLogo] = useState<JSX.Element>();

    useEffect(() => {
        const text = setTextSuspects(props.suspectCounts);
        const logo = setLogoSuspects(props.suspectCounts);

        setCardLogo(logo);
        setCardText(text);
    }, [props.suspectCounts]);

    const setLogoSuspects = (suspects: number) => {
        switch (true) {
            case suspects < 1:
                return (
                    <NoSuspiciusBadgeOutlineSvg
                        style={{ marginRight: 12, marginTop: 4 }}
                    />
                );

            case suspects < 4:
                return (
                    <WarningRedTriangle
                        color="#73839D"
                        style={{ marginRight: 12, marginTop: 4 }}
                    />
                );

            case suspects < 8:
                return (
                    <WarningRedTriangle
                        color="#FE9A22"
                        style={{ marginRight: 12, marginTop: 4 }}
                    />
                );

            case suspects > 7:
                return (
                    <WarningRedTriangle
                        color="#EB5757"
                        style={{ marginRight: 12, marginTop: 4 }}
                    />
                );

            default:
                return (
                    <NoSuspiciusBadgeOutlineSvg
                        style={{ marginRight: 12, marginTop: 4 }}
                    />
                );
        }
    };

    const setTextSuspects = (suspects: number) => {
        switch (true) {
            case suspects < 1:
                return i18n.t('noSuspiciousActivityDetected');

            case suspects < 4:
                return i18n.t('lowSuspiciousActivityDetected');

            case suspects < 8:
                return i18n.t('significantSuspiciousActivityDetected');

            case suspects > 7:
                return i18n.t('largeSuspiciousActivityDetected');

            default:
                return i18n.t('noSuspiciousActivityDetected');
        }
    };

    return (
        <View style={styles.cardWrap}>
            {cardLogo}
            <Text
                style={[
                    styles.cardText,
                    {
                        fontSize: width < 375 ? 12 : 15,
                        lineHeight: width < 375 ? 19 : 24,
                    },
                ]}
            >
                {cardText}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    cardWrap: {
        backgroundColor: ipctColors.softWhite,
        display: 'flex',
        flexDirection: 'row',
        minHeight: 88,
        padding: 22,
        alignItems: 'flex-start',
        justifyContent: 'center',
        borderTopRightRadius: 6,
        borderTopLeftRadius: 6,
    },
    cardText: {
        flexShrink: 1,
        fontFamily: 'Inter-Regular',
        fontSize: 15,
        fontWeight: '500',
        lineHeight: 24,
        textAlign: 'left',
    },
});
