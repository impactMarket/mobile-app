import { useNavigation } from '@react-navigation/native';
import i18n from 'assets/i18n';
import BigNumber from 'bignumber.js';
import BaseCommunity from 'components/BaseCommunity';
import CommuntyStatus from 'components/CommuntyStatus';
import Modal from 'components/Modal';
import Button from 'components/core/Button';
import CommunityRules from 'components/core/CommunityRules';
import ManageSvg from 'components/svg/ManageSvg';
import { Screens } from 'helpers/constants';
import { amountToCurrency } from 'helpers/currency';
import { updateCommunityInfo } from 'helpers/index';
import { setAppHasManagerAcceptedTerms } from 'helpers/redux/actions/app';
import { setCommunityMetadata } from 'helpers/redux/actions/user';
import { ITabBarIconProps } from 'helpers/types/common';
import {
    CommunityAttributes,
    UbiRequestChangeParams,
} from 'helpers/types/models';
import { IRootState } from 'helpers/types/state';
import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    RefreshControl,
    Alert,
    Dimensions,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
// services
import { ActivityIndicator, Portal, Paragraph } from 'react-native-paper';
import { WebView } from 'react-native-webview';
import { useDispatch, useSelector } from 'react-redux';
import * as Sentry from 'sentry-expo';
import Api from 'services/api';
import { celoWalletRequest } from 'services/celoWallet';
import { ipctColors } from 'styles/index';

// redux Actions

import Beneficiaries from './cards/Beneficiaries';
import Managers from './cards/Managers';

function CommunityManagerScreen() {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const [openHelpCenter, setOpenHelpCenter] = useState(false);
    const kit = useSelector((state: IRootState) => state.app.kit);
    const userCurrency = useSelector(
        (state: IRootState) => state.user.metadata.currency
    );
    const userAddress = useSelector(
        (state: IRootState) => state.user.wallet.address
    );
    const rates = useSelector((state: IRootState) => state.app.exchangeRates);
    const communityContract = useSelector(
        (state: IRootState) => state.user.community.contract
    );
    const community = useSelector(
        (state: IRootState) => state.user.community.metadata
    );

    const hasManagerAcceptedRulesAlready = useSelector(
        (state: IRootState) => state.app.hasManagerAcceptedRulesAlready
    );

    const [refreshing, setRefreshing] = useState(false);
    const [hasFundsToNewBeneficiary, setHasFundsToNewBeneficiary] = useState(
        true
    );
    const [
        requiredUbiToChange,
        setRequiredUbiToChange,
    ] = useState<UbiRequestChangeParams | null>();

    const [editInProgress, setEditInProgress] = useState(false);

    useEffect(() => {
        if (kit !== undefined && community.status === 'valid') {
            const loadCommunityBalance = async () => {
                const stableToken = await kit.contracts.getStableToken();
                const cUSDBalanceBig = await stableToken.balanceOf(
                    communityContract._address
                );
                // at least five cents
                setHasFundsToNewBeneficiary(
                    new BigNumber(cUSDBalanceBig.toString()).gte(
                        '50000000000000000'
                    )
                );
            };
            const verifyRequestToChangeUbiParams = () => {
                Api.community
                    .getRequestChangeUbi(community.id)
                    .then(setRequiredUbiToChange);
            };
            loadCommunityBalance();
            verifyRequestToChangeUbiParams();
        }
    }, [community, kit]);

    useEffect(() => {
        async function loadCommunityRulesStats() {
            if (!hasManagerAcceptedRulesAlready) {
                dispatch(setAppHasManagerAcceptedTerms(false));
                navigation.navigate(Screens.WelcomeRulesScreen, {
                    caller: 'MANAGER',
                });
            }
        }
        loadCommunityRulesStats();
    }, []);

    const onRefresh = () => {
        updateCommunityInfo(community.id, dispatch).then(async () => {
            const stableToken = await kit.contracts.getStableToken();
            const cUSDBalanceBig = await stableToken.balanceOf(
                communityContract._address
            );
            // at least five cents
            setHasFundsToNewBeneficiary(
                new BigNumber(cUSDBalanceBig.toString()).gte(
                    '50000000000000000'
                )
            );
            setRefreshing(false);
        });
    };

    const handleAcceptNewUbiParams = async () => {
        if (requiredUbiToChange === null || requiredUbiToChange === undefined) {
            return;
        }
        celoWalletRequest(
            userAddress,
            communityContract.options.address,
            await communityContract.methods.edit(
                requiredUbiToChange.claimAmount,
                requiredUbiToChange.maxClaim,
                requiredUbiToChange.baseInterval,
                requiredUbiToChange.incrementInterval
            ),
            'editcommunity',
            kit
        )
            .then((tx) => {
                if (tx === undefined) {
                    return;
                }
                // refresh community details
                setTimeout(() => {
                    Api.community
                        .findById(community.id)
                        .then((c) => dispatch(setCommunityMetadata(c!)));
                }, 2500);

                Alert.alert(
                    i18n.t('success'),
                    i18n.t('ubiParamsUpdated'),
                    [{ text: 'OK' }],
                    { cancelable: false }
                );
            })
            .catch((e) => {
                Sentry.Native.captureException(e);
                Alert.alert(
                    i18n.t('failure'),
                    i18n.t('anErroHappenedTryAgain'),
                    [{ text: i18n.t('close') }],
                    { cancelable: false }
                );
            })
            .finally(() => {
                setEditInProgress(false);
            });
    };

    const communityStatus = (_community: CommunityAttributes) => {
        if (
            _community.status === 'valid' &&
            _community.contract !== undefined &&
            _community.state !== undefined
        ) {
            return (
                <>
                    <ScrollView
                        refreshControl={
                            <RefreshControl
                                //refresh control used for the Pull to Refresh
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                            />
                        }
                    >
                        <BaseCommunity community={_community}>
                            <View style={styles.container}>
                                <Beneficiaries
                                    beneficiaries={
                                        _community.state.beneficiaries
                                    }
                                    removedBeneficiaries={
                                        _community.state.removedBeneficiaries
                                    }
                                    hasFundsToNewBeneficiary={
                                        hasFundsToNewBeneficiary
                                    }
                                    isSuspeciousDetected={
                                        _community.suspect !== undefined &&
                                        _community.suspect.length > 0
                                    }
                                />
                                <Managers
                                    managers={_community.state.managers}
                                />
                                <CommuntyStatus community={_community} />
                            </View>
                        </BaseCommunity>
                    </ScrollView>
                    {requiredUbiToChange !== undefined &&
                        requiredUbiToChange !== null && (
                            <Portal>
                                <Modal
                                    title={i18n.t('ubiParams')}
                                    visible
                                    buttons={
                                        <>
                                            <Button
                                                modeType="green"
                                                bold
                                                onPress={
                                                    handleAcceptNewUbiParams
                                                }
                                                loading={editInProgress}
                                            >
                                                {i18n.t('acceptNewUbiParams')}
                                            </Button>
                                        </>
                                    }
                                >
                                    <Paragraph
                                        style={styles.ubiChangeModalText}
                                    >
                                        {i18n.t('ubiParamsChanged')}
                                    </Paragraph>
                                    <Paragraph
                                        style={styles.ubiChangeModalText}
                                    >
                                        {i18n.t('claimAmount')}:{' '}
                                        {amountToCurrency(
                                            requiredUbiToChange.claimAmount,
                                            userCurrency,
                                            rates
                                        )}
                                    </Paragraph>
                                    <Paragraph
                                        style={styles.ubiChangeModalText}
                                    >
                                        {i18n.t('totalClaimPerBeneficiary')}:{' '}
                                        {amountToCurrency(
                                            requiredUbiToChange.maxClaim,
                                            userCurrency,
                                            rates
                                        )}
                                    </Paragraph>
                                    <Paragraph
                                        style={styles.ubiChangeModalText}
                                    >
                                        {i18n.t('frequency')}:{' '}
                                        {requiredUbiToChange.baseInterval ===
                                        86400
                                            ? i18n.t('day')
                                            : i18n.t('week')}
                                    </Paragraph>
                                    <Paragraph
                                        style={styles.ubiChangeModalText}
                                    >
                                        {i18n.t('timeIncrementAfterClaim')} (
                                        {i18n.t('timeInMinutes')}):{' '}
                                        {requiredUbiToChange.incrementInterval /
                                            60}{' '}
                                    </Paragraph>
                                </Modal>
                            </Portal>
                        )}
                </>
            );
        }

        const renderHelpCenter = () => {
            if (openHelpCenter) {
                return (
                    <WebView
                        originWhitelist={['*']}
                        source={{ uri: 'https://docs.impactmarket.com/' }}
                        style={{
                            height: Dimensions.get('screen').height * 0.85,
                        }}
                    />
                );
            }
        };
        return (
            <ScrollView
            // style={{ flex: 1 }}
            // contentContainerStyle={{
            //     flexDirection: 'column',
            //     alignItems: 'center',
            //     justifyContent: 'space-around',
            // }}
            >
                <Text
                    style={{
                        fontFamily: 'Inter-Regular',
                        fontSize: 15,
                        lineHeight: 24,
                        marginHorizontal: 18,
                        letterSpacing: 0,
                        textAlign: 'left',
                    }}
                >
                    {i18n.t('pendingApprovalMessage')}{' '}
                </Text>
                <Button
                    modeType="gray"
                    style={{
                        marginHorizontal: 18,
                        marginTop: 16,
                        marginBottom: 16,
                        // width: '100%',
                    }}
                    labelStyle={{
                        fontSize: 18,
                        lineHeight: 18,
                        letterSpacing: 0.3,
                    }}
                    onPress={() => {
                        setOpenHelpCenter(true);
                    }}
                >
                    {i18n.t('openHelpCenter')}
                </Button>
                {!hasManagerAcceptedRulesAlready && (
                    <CommunityRules caller="MANAGER" />
                )}
            </ScrollView>
        );
    };

    if (
        community === undefined ||
        community.contract === undefined ||
        community.state === undefined
    ) {
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

    return communityStatus(community);
}

CommunityManagerScreen.navigationOptions = () => {
    return {
        title: i18n.t('manage'),
        tabBarLabel: i18n.t('manage'),
        headerTitleStyle: {
            fontFamily: 'Manrope-Bold',
            fontSize: 22,
            lineHeight: 28,
            color: '#333239',
        },
        headerTitleContainerStyle: {
            left: 58,
        },
        tabBarIcon: (props: ITabBarIconProps) => (
            <ManageSvg focused={props.focused} />
        ),
    };
};

const styles = StyleSheet.create({
    ubiChangeModalText: {
        marginBottom: 8,
        fontSize: 16,
        lineHeight: 24,
    },
    container: {
        marginHorizontal: 16,
        marginBottom: 30,
    },
    imageBackground: {
        width: '100%',
        height: 147,
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
    },
    communityName: {
        fontSize: 25,
        fontFamily: 'Gelion-Bold',
        color: 'white',
        textAlign: 'center',
    },
    communityLocation: {
        fontSize: 20,
        color: 'white',
    },
});

export default CommunityManagerScreen;
