import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import i18n from 'assets/i18n';
import BaseCommunity from 'components/BaseCommunity';
import CommunityRules from 'components/core/CommunityRules';
import { Screens } from 'helpers/constants';
import { amountToCurrency } from 'helpers/currency';
import { IRootState, ICallerRouteParams } from 'helpers/types/state';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { ActivityIndicator } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { ipctColors } from 'styles/index';

function WelcomeRulesScreen() {
    const navigation = useNavigation();
    const route = useRoute<
        RouteProp<Record<string, ICallerRouteParams>, string>
    >();

    const { caller } = route.params;

    const community = useSelector(
        (state: IRootState) => state.user.community.metadata
    );

    const rates = useSelector((state: IRootState) => state.app.exchangeRates);

    const hasBeneficiaryAcceptedRulesAlready = useSelector(
        (state: IRootState) => state.app.hasBeneficiaryAcceptedRulesAlready
    );

    const hasManagerAcceptedRulesAlready = useSelector(
        (state: IRootState) => state.app.hasManagerAcceptedRulesAlready
    );

    useEffect(() => {
        if (caller === 'BENEFICIARY' && hasBeneficiaryAcceptedRulesAlready) {
            navigation.navigate(Screens.Beneficiary);
        } else if (caller === 'MANAGER' && hasManagerAcceptedRulesAlready) {
            navigation.navigate(Screens.CommunityManager);
        }
    }, [hasBeneficiaryAcceptedRulesAlready, hasManagerAcceptedRulesAlready]);

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
                            {caller === 'BENEFICIARY'
                                ? i18n.t('welcomeBeneficiayTitle', {
                                      communityName: community.name,
                                  })
                                : i18n.t('welcomeManagerTitle', {
                                      communityName: community.name,
                                  })}
                        </Text>
                        {caller === 'BENEFICIARY' && (
                            <Text style={styles.welcomeBeneficiayDescription}>
                                {i18n.t('welcomeBeneficiaryDecription', {
                                    claimXCCurrency: amountToCurrency(
                                        community.contract.claimAmount,
                                        community.currency,
                                        rates
                                    ),
                                    interval:
                                        community.contract.baseInterval ===
                                        86400
                                            ? '24h'
                                            : '168h',
                                    minIncrement:
                                        community.contract.incrementInterval /
                                        60,
                                })}
                            </Text>
                        )}
                    </View>
                    <CommunityRules caller={caller} />
                </View>
            </BaseCommunity>
        </ScrollView>
    );
}

WelcomeRulesScreen.navigationOptions = () => {
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
