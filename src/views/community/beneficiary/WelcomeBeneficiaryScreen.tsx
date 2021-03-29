import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { ActivityIndicator } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { RouteProp, useNavigation } from '@react-navigation/native';
import i18n from 'assets/i18n';

import BaseCommunity from 'components/BaseCommunity';

import { amountToCurrency } from 'helpers/currency';
import { IRootState } from 'helpers/types/state';
import CommunityRules from 'components/core/CommunityRules';

import { ipctColors } from 'styles/index';
import { Screens } from 'helpers/constants';

function WelcomeBeneficiaryScreen() {
    const navigation = useNavigation();

    const community = useSelector(
        (state: IRootState) => state.user.community.metadata
    );

    const rates = useSelector((state: IRootState) => state.app.exchangeRates);

    const hasAcceptedRulesAlready = useSelector(
        (state: IRootState) => state.app.hasAcceptedRulesAlready
    );

    useEffect(() => {
        if (hasAcceptedRulesAlready) {
            navigation.navigate(Screens.Beneficiary);
        }
    }, [hasAcceptedRulesAlready]);

    if (community === undefined) {
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

    return (
        <ScrollView>
            <BaseCommunity community={community} full>
                <View
                    style={{
                        flex: 1,
                        justifyContent: 'space-between',
                        width: Dimensions.get('window').width,
                    }}
                >
                    <View style={styles.welcomeBeneficiayContainer}>
                        <Text style={styles.welcomeBeneficiayTitle}>
                            {i18n.t('welcomeBeneficiayTitle', {
                                communityName: community.name,
                            })}
                        </Text>
                        <Text style={styles.welcomeBeneficiayDescription}>
                            {i18n.t('welcomeBeneficiaryDecription', {
                                claimXCCurrency: amountToCurrency(
                                    community.contract.claimAmount,
                                    community.currency,
                                    rates
                                ),
                                interval:
                                    community.contract.baseInterval === 86400
                                        ? '24h'
                                        : '168h',
                                minIncrement:
                                    community.contract.incrementInterval / 60,
                            })}
                        </Text>
                    </View>
                    <CommunityRules />
                </View>
            </BaseCommunity>
        </ScrollView>
    );
}

WelcomeBeneficiaryScreen.navigationOptions = () => {
    return {
        headerLeft: () => null,
        headerTitle: i18n.t('welcome'),
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
        marginBottom: 22,
    },
    welcomeBeneficiayTitle: {
        fontFamily: 'Manrope-Bold',
        fontSize: 18,
        lineHeight: 28,
        letterSpacing: 0.25,
        textAlign: 'left',
        color: ipctColors.almostBlack,
        marginTop: 22,
        marginBottom: 8,
    },
});

export default WelcomeBeneficiaryScreen;
