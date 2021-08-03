import i18n from 'assets/i18n';
import BackSvg from 'components/svg/header/BackSvg';
import * as React from 'react';
import { Trans } from 'react-i18next';
import { Text, ScrollView, StyleSheet } from 'react-native';
import { ipctColors } from 'styles/index';

function ClaimExplainedScreen() {
    return (
        <>
            <ScrollView style={styles.contentView}>
                <Text style={styles.textInfo}>
                    <Trans
                        i18nKey="claimExplained1"
                        components={{
                            bold: (
                                <Text
                                    style={{
                                        fontFamily: 'Inter-Bold',
                                        fontSize: 14,
                                        color: ipctColors.almostBlack,
                                    }}
                                />
                            ),
                        }}
                    />
                </Text>
                <Text style={styles.textInfo}>
                    <Trans
                        i18nKey="claimExplained2"
                        components={{
                            bold: (
                                <Text
                                    style={{
                                        fontFamily: 'Inter-Bold',
                                        fontSize: 14,
                                        color: ipctColors.almostBlack,
                                    }}
                                />
                            ),
                        }}
                    />
                </Text>
                <Text style={styles.textInfo}>
                    <Trans
                        i18nKey="claimExplained3"
                        components={{
                            bold: (
                                <Text
                                    style={{
                                        fontFamily: 'Inter-Bold',
                                        fontSize: 14,
                                        color: ipctColors.almostBlack,
                                    }}
                                />
                            ),
                        }}
                    />
                </Text>
            </ScrollView>
        </>
    );
}
ClaimExplainedScreen.navigationOptions = () => {
    return {
        headerLeft: () => <BackSvg />,
        headerTitle: i18n.t('howClaimWorks'),
    };
};

const styles = StyleSheet.create({
    contentView: {
        marginHorizontal: 30,
    },
    textInfo: {
        fontFamily: 'Gelion-Regular',
        textAlign: 'left',
        marginVertical: 20,
        fontSize: 18,
    },
});

export default ClaimExplainedScreen;
