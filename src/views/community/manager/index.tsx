import i18n from 'assets/i18n';
import BigNumber from 'bignumber.js';
import BaseCommunity from 'components/BaseCommunity';
import CachedImage from 'components/CacheImage';
import CommuntyStatus from 'components/CommuntyStatus';
import Button from 'components/core/Button';
import Modal from 'components/Modal';
import ManageSvg from 'components/svg/ManageSvg';
import * as Linking from 'expo-linking';
import { amountToCurrency } from 'helpers/currency';
import { updateCommunityInfo } from 'helpers/index';
import { setCommunityMetadata } from 'helpers/redux/actions/user';
import { ITabBarIconProps } from 'helpers/types/common';
import { ICommunity } from 'helpers/types/endpoints';
import { UbiRequestChangeParams } from 'helpers/types/models';
import { IRootState } from 'helpers/types/state';
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, RefreshControl, Alert } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import CommunityRules from 'components/core/CommunityRules';

// services
import CacheStore from 'services/cacheStore';

import {
    Headline,
    ActivityIndicator,
    Portal,
    Paragraph,
} from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import Api from 'services/api';
import { celoWalletRequest } from 'services/celoWallet';
import { ipctColors } from 'styles/index';

// redux Actions
import { setAppHasAcceptedTerms } from 'helpers/redux/actions/app';

import Beneficiaries from './cards/Beneficiaries';
import Managers from './cards/Managers';

function CommunityManagerScreen() {
    const dispatch = useDispatch();

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

    const hasAcceptedRulesAlready = useSelector(
        (state: IRootState) => state.app.hasAcceptedRulesAlready
    );

    const [refreshing, setRefreshing] = useState(false);
    const [hasFundsToNewBeneficiary, setHasFundsToNewBeneficiary] = useState(
        true
    );
    const [requiredUbiToChange, setRequiredUbiToChange] = useState<
        UbiRequestChangeParams | undefined
    >();

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
                    .getRequestChangeUbi(community.publicId)
                    .then(setRequiredUbiToChange);
            };
            loadCommunityBalance();
            verifyRequestToChangeUbiParams();
        }
    }, [community, kit]);

    // useEffect(() => {
    //     async function loadCommunityRulesStats() {
    //         const _hasAcceptedRulesAlready = await CacheStore.getAcceptCommunityRules();

    //         if (_hasAcceptedRulesAlready) {
    //             setHasAcceptedTerms(true);
    //         }
    //     }
    //     loadCommunityRulesStats();
    // }, []);

    useEffect(() => {
        async function loadCommunityRulesStats() {
            if (hasAcceptedRulesAlready == null) {
                const _hasAcceptedRulesAlready = await CacheStore.getAcceptCommunityRules();

                if (!_hasAcceptedRulesAlready) {
                    dispatch(setAppHasAcceptedTerms(false));
                }
            }
        }
        loadCommunityRulesStats();
    }, []);

    const onRefresh = () => {
        updateCommunityInfo(community.publicId, dispatch).then(async () => {
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
        if (requiredUbiToChange === undefined) {
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
                        .getByPublicId(community.publicId)
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
                Alert.alert(
                    i18n.t('failure'),
                    i18n.t('anErroHappenedTryAgain'),
                    [{ text: i18n.t('close') }],
                    { cancelable: false }
                );
                Api.system.uploadError(userAddress, 'edit_ubi_params', e);
            })
            .finally(() => {
                setEditInProgress(false);
            });
    };

    const communityStatus = (_community: ICommunity) => {
        if (_community.status === 'valid') {
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
                        <BaseCommunity community={community}>
                            {hasAcceptedRulesAlready ? (
                                <View style={styles.container}>
                                    <Beneficiaries
                                        beneficiaries={
                                            _community.state.beneficiaries
                                        }
                                        removedBeneficiaries={
                                            _community.state
                                                .removedBeneficiaries
                                        }
                                        hasFundsToNewBeneficiary={
                                            hasFundsToNewBeneficiary
                                        }
                                        isSuspeciousDetected={
                                            _community?.suspect.length > 0
                                        }
                                    />
                                    <Managers
                                        managers={_community.state.managers}
                                    />
                                    <CommuntyStatus community={_community} />
                                </View>
                            ) : (
                                <View style={styles.container}>
                                    <CommunityRules />
                                </View>
                            )}
                        </BaseCommunity>
                    </ScrollView>
                    {requiredUbiToChange !== undefined && (
                        <Portal>
                            <Modal
                                title={i18n.t('ubiParams')}
                                visible={true}
                                buttons={
                                    <>
                                        <Button
                                            modeType="green"
                                            bold
                                            onPress={handleAcceptNewUbiParams}
                                            loading={editInProgress}
                                        >
                                            {i18n.t('acceptNewUbiParams')}
                                        </Button>
                                    </>
                                }
                            >
                                <Paragraph style={styles.ubiChangeModalText}>
                                    {i18n.t('ubiParamsChanged')}
                                </Paragraph>
                                <Paragraph style={styles.ubiChangeModalText}>
                                    {i18n.t('claimAmount')}:{' '}
                                    {amountToCurrency(
                                        requiredUbiToChange.claimAmount,
                                        userCurrency,
                                        rates
                                    )}
                                </Paragraph>
                                <Paragraph style={styles.ubiChangeModalText}>
                                    {i18n.t('totalClaimPerBeneficiary')}:{' '}
                                    {amountToCurrency(
                                        requiredUbiToChange.maxClaim,
                                        userCurrency,
                                        rates
                                    )}
                                </Paragraph>
                                <Paragraph style={styles.ubiChangeModalText}>
                                    {i18n.t('frequency')}:{' '}
                                    {requiredUbiToChange.baseInterval === 86400
                                        ? i18n.t('day')
                                        : i18n.t('week')}
                                </Paragraph>
                                <Paragraph style={styles.ubiChangeModalText}>
                                    {i18n.t('timeIncrementAfterClaim')} (
                                    {i18n.t('timeInMinutes')}):{' '}
                                    {requiredUbiToChange.incrementInterval / 60}{' '}
                                </Paragraph>
                            </Modal>
                        </Portal>
                    )}
                </>
            );
        }
        return (
            <View style={{ flex: 1 }}>
                <BaseCommunity community={_community} full>
                    <View
                        style={{
                            marginHorizontal: 20,
                            flex: 1,
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'space-around',
                        }}
                    >
                        <CachedImage
                            source={require('assets/images/pending.png')}
                            style={{ width: 50, height: 50 }}
                        />
                        <Headline
                            style={{
                                fontFamily: 'Gelion-Regular',
                                fontSize: 22,
                                lineHeight: 22,
                                height: 22,
                                letterSpacing: 0,
                                textAlign: 'center',
                            }}
                        >
                            {i18n.t('pendingApproval')}
                        </Headline>
                        <Text
                            style={{
                                fontFamily: 'Gelion-Regular',
                                fontSize: 19,
                                lineHeight: 19,
                                height: 100,
                                letterSpacing: 0,
                                textAlign: 'center',
                            }}
                        >
                            {i18n.t('pendingApprovalMessage')}{' '}
                            <Text
                                style={{ color: ipctColors.blueRibbon }}
                                onPress={() =>
                                    Linking.openURL(
                                        'mailto:hello@impactmarket.com'
                                    )
                                }
                            >
                                hello@impactmarket.com
                            </Text>
                        </Text>
                    </View>
                </BaseCommunity>
            </View>
        );
    };

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

    return communityStatus(community);
}

CommunityManagerScreen.navigationOptions = () => {
    return {
        title: i18n.t('manage'),
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
