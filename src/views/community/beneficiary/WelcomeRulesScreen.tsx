import i18n from 'assets/i18n';
import BaseCommunity from 'components/BaseCommunity';
import { amountToCurrency } from 'helpers/currency';
import { IRootState } from 'helpers/types/state';
import React from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { ActivityIndicator } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { ipctColors } from 'styles/index';

import CommunityRules from './CommunityRules';

function WelcomeRulesScreen() {
    const { metadata, beneficiary } = useSelector(
        (state: IRootState) => state.user.community
    );
    const community = metadata;

    const rates = useSelector((state: IRootState) => state.app.exchangeRates);

    if (community === undefined || community.contract === undefined) {
        return (
            <View
                style={{
                    width: '100%',
                    height: '100%',
                    justifyContent: 'center',
                }}
            >
                <ActivityIndicator
                    animating
                    size="large"
                    color={ipctColors.blueRibbon}
                />
            </View>
        );
    }

    if (
        beneficiary !== null &&
        beneficiary !== undefined &&
        !beneficiary.readRules
    ) {
        return (
            <ScrollView>
                <BaseCommunity community={community} full>
                    <View
                        style={{
                            flex: 1,
                            justifyContent: 'space-between',
                            width: Dimensions.get('window').width,
                            marginTop: 16,
                        }}
                    >
                        <View style={styles.welcomeBeneficiayContainer}>
                            <Text style={styles.welcomeBeneficiayTitle}>
                                {i18n.t('beneficiary.welcomeBeneficiayTitle', {
                                    communityName: community.name,
                                })}
                            </Text>
                            <Text style={styles.welcomeBeneficiayDescription}>
                                {i18n.t(
                                    'beneficiary.welcomeBeneficiaryDecription',
                                    {
                                        claimXCCurrency: amountToCurrency(
                                            community.contract.claimAmount,
                                            community.currency,
                                            rates
                                        ),
                                        interval:
                                            community.contract.baseInterval ===
                                                86400 ||
                                            community.contract.baseInterval ===
                                                17280
                                                ? '24h'
                                                : '168h',
                                        minIncrement:
                                            community.contract
                                                .incrementInterval / 60,
                                    }
                                )}
                            </Text>
                        </View>
                        <CommunityRules caller="beneficiary" />
                    </View>
                </BaseCommunity>
            </ScrollView>
        );
    }

    return (
        <ScrollView>
            <BaseCommunity community={community} full>
                <View
                    style={{
                        flex: 1,
                        justifyContent: 'space-between',
                        width: Dimensions.get('window').width,
                        marginTop: 16,
                    }}
                >
                    <View style={styles.welcomeBeneficiayContainer}>
                        <Text style={styles.welcomeBeneficiayTitle}>
                            {i18n.t('manager.welcomeManagerTitle', {
                                communityName: community.name,
                            })}
                        </Text>
                    </View>
                    <CommunityRules caller="manager" />
                </View>
            </BaseCommunity>
        </ScrollView>
    );
}

WelcomeRulesScreen.navigationOptions = () => {
    return {
        headerLeft: () => null,
        headerTitle: i18n.t('generic.welcome'),
    };
};

const styles = StyleSheet.create({
    welcomeBeneficiayContainer: {
        flex: 1,
        alignSelf: 'center',
        paddingHorizontal: 20,
    },
    welcomeBeneficiayDescription: {
        fontFamily: 'Inter-Regular',
        fontSize: 15,
        letterSpacing: 0.3,
        color: ipctColors.almostBlack,
    },
    welcomeBeneficiayTitle: {
        fontFamily: 'Manrope-Bold',
        fontSize: 18,
        lineHeight: 28,
        letterSpacing: 0.25,
        textAlign: 'left',
        color: ipctColors.almostBlack,
        marginBottom: 8,
    },
});

export default WelcomeRulesScreen;
