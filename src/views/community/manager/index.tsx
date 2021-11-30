import { Body, Button, colors, WarningIcon } from '@impact-market/ui-kit';
import i18n from 'assets/i18n';
import BigNumber from 'bignumber.js';
import BaseCommunity from 'components/BaseCommunity';
import CommunityStatus from 'components/CommunityStatus';
import Modal from 'components/Modal';
import CoreButton from 'components/core/Button';
import Card from 'components/core/Card';
import renderHeader from 'components/core/HeaderBottomSheetTitle';
import ManageSvg from 'components/svg/ManageSvg';
import { amountToCurrency } from 'helpers/currency';
import {
    calculateCommunityRemainedFunds,
    docsURL,
    updateCommunityInfo,
} from 'helpers/index';
import { findCommunityByIdRequest } from 'helpers/redux/actions/communities';
import { ITabBarIconProps } from 'helpers/types/common';
import {
    CommunityAttributes,
    UbiRequestChangeParams,
} from 'helpers/types/models';
import { IRootState } from 'helpers/types/state';
import React, { useState, useEffect, useRef } from 'react';
import {
    StyleSheet,
    View,
    Text,
    RefreshControl,
    Dimensions,
    Alert,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
// services
import { Modalize } from 'react-native-modalize';
import { ActivityIndicator, Portal, Paragraph } from 'react-native-paper';
import { WebView } from 'react-native-webview';
import { useDispatch, useSelector } from 'react-redux';
import * as Sentry from 'sentry-expo';
import Api from 'services/api';
import { celoWalletRequest } from 'services/celoWallet';
import { ipctColors, ipctFontSize, ipctLineHeight } from 'styles/index';

// redux Actions

import Beneficiaries from './cards/Beneficiaries';
import Managers from './cards/Managers';

function CommunityManagerScreen() {
    const dispatch = useDispatch();

    const modalizeHelpCenterRef = useRef<Modalize>(null);

    const kit = useSelector((state: IRootState) => state.app.kit);
    const userCurrency = useSelector(
        (state: IRootState) => state.user.metadata.currency
    );
    const { language } = useSelector(
        (state: IRootState) => state.user.metadata
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

    const [refreshing, setRefreshing] = useState(false);
    const [hasFundsToNewBeneficiary, setHasFundsToNewBeneficiary] =
        useState(true);
    const [requiredUbiToChange, setRequiredUbiToChange] =
        useState<UbiRequestChangeParams | null>();
    const [canRequestFunds, setCanRequestFunds] = useState(false);

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
                const isNewCommunity =
                    await communityContract.methods.impactMarketAddress();
                if (isNewCommunity === 0) {
                    const claimedRatio = new BigNumber(
                        community.state.claimed
                    ).dividedBy(community.state.raised);
                    if (claimedRatio.gt(new BigNumber(0.95))) {
                        setCanRequestFunds(true);
                    }
                }
            };
            const verifyRequestToChangeUbiParams = () => {
                Api.community
                    .getRequestChangeUbi(community.id)
                    .then(setRequiredUbiToChange);
            };
            loadCommunityBalance();
            verifyRequestToChangeUbiParams();
        }
    }, [community, kit, communityContract]);

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
                    dispatch(findCommunityByIdRequest(community.id));
                }, 2500);

                Alert.alert(
                    i18n.t('generic.success'),
                    i18n.t('manager.ubiParamsUpdated'),
                    [{ text: 'OK' }],
                    { cancelable: false }
                );
            })
            .catch((e) => {
                Sentry.Native.captureException(e);
                Alert.alert(
                    i18n.t('generic.failure'),
                    i18n.t('generic.generic'),
                    [{ text: i18n.t('generic.close') }],
                    { cancelable: false }
                );
            })
            .finally(() => {
                setEditInProgress(false);
            });
    };

    let days = 0;
    if (community.state !== null) {
        days = calculateCommunityRemainedFunds(community);
    }

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
                                {canRequestFunds && (
                                    <Card
                                        style={{ marginTop: 16, padding: 22 }}
                                    >
                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                alignContent: 'center',
                                            }}
                                        >
                                            <WarningIcon
                                                color={colors.ui.warning}
                                            />
                                            <Body>
                                                <>
                                                    {i18n.t(
                                                        'community.fundsRunOut',
                                                        {
                                                            days: Math.floor(
                                                                days
                                                            ),
                                                        }
                                                    )}{' '}
                                                    {i18n.t('generic.days', {
                                                        count: days,
                                                    })}
                                                </>
                                            </Body>
                                        </View>
                                        <Button mode="text">
                                            {i18n.t('community.requestFunds')}
                                        </Button>
                                    </Card>
                                )}
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
                                        _community.suspect !== null
                                    }
                                />
                                <Managers
                                    managers={_community.state.managers}
                                />
                                <Card
                                    elevation={0}
                                    style={{ marginTop: 16, padding: 22 }}
                                >
                                    <CommunityStatus community={_community} />
                                </Card>
                            </View>
                        </BaseCommunity>
                    </ScrollView>
                    <Portal>
                        {requiredUbiToChange !== undefined &&
                            requiredUbiToChange !== null && (
                                <Modal
                                    title={i18n.t('manager.ubiParams')}
                                    visible
                                    buttons={
                                        <>
                                            <CoreButton
                                                modeType="green"
                                                bold
                                                onPress={
                                                    handleAcceptNewUbiParams
                                                }
                                                loading={editInProgress}
                                            >
                                                {i18n.t(
                                                    'manager.acceptNewUbiParams'
                                                )}
                                            </CoreButton>
                                        </>
                                    }
                                >
                                    <Paragraph
                                        style={styles.ubiChangeModalText}
                                    >
                                        {i18n.t('manager.ubiParamsChanged')}
                                    </Paragraph>
                                    <Paragraph
                                        style={styles.ubiChangeModalText}
                                    >
                                        {i18n.t('createCommunity.claimAmount')}:{' '}
                                        {amountToCurrency(
                                            requiredUbiToChange.claimAmount,
                                            userCurrency,
                                            rates
                                        )}
                                    </Paragraph>
                                    <Paragraph
                                        style={styles.ubiChangeModalText}
                                    >
                                        {i18n.t(
                                            'createCommunity.totalClaimPerBeneficiary'
                                        )}
                                        :{' '}
                                        {amountToCurrency(
                                            requiredUbiToChange.maxClaim,
                                            userCurrency,
                                            rates
                                        )}
                                    </Paragraph>
                                    <Paragraph
                                        style={styles.ubiChangeModalText}
                                    >
                                        {i18n.t('createCommunity.frequency')}:{' '}
                                        {requiredUbiToChange.baseInterval ===
                                        86400
                                            ? i18n.t('generic.days', {
                                                  count: 1,
                                              })
                                            : i18n.t('generic.week')}
                                    </Paragraph>
                                    <Paragraph
                                        style={styles.ubiChangeModalText}
                                    >
                                        {i18n.t(
                                            'createCommunity.timeIncrementAfterClaim'
                                        )}{' '}
                                        (
                                        {i18n.t(
                                            'createCommunity.timeInMinutes'
                                        )}
                                        ):{' '}
                                        {requiredUbiToChange.incrementInterval /
                                            60}{' '}
                                    </Paragraph>
                                </Modal>
                            )}
                    </Portal>
                </>
            );
        }

        return (
            <>
                <ScrollView>
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
                        {i18n.t('createCommunity.pendingApprovalMessage')}{' '}
                    </Text>
                    <CoreButton
                        modeType="gray"
                        style={{
                            marginHorizontal: 18,
                            marginTop: 16,
                            marginBottom: 16,
                        }}
                        onPress={() => {
                            modalizeHelpCenterRef.current?.open();
                        }}
                    >
                        {i18n.t('generic.openHelpCenter')}
                    </CoreButton>
                    <View style={styles.rulesView}>
                        <Text style={styles.rulesTitle}>
                            {i18n.t('manager.rules.title')}
                        </Text>
                        <Text style={styles.rulesMessage}>
                            1 - {i18n.t('manager.rules.first')}
                        </Text>
                        <Text style={styles.rulesMessage}>
                            2 - {i18n.t('manager.rules.second')}
                        </Text>
                        <Text style={styles.rulesMessage}>
                            3 - {i18n.t('manager.rules.third')}
                        </Text>
                        <Text style={styles.rulesMessage}>
                            4 - {i18n.t('manager.rules.fourth')}
                        </Text>
                        <Text style={styles.rulesMessage}>
                            5 - {i18n.t('manager.rules.fifth')}
                        </Text>
                        <Text style={styles.rulesMessage}>
                            6 - {i18n.t('manager.rules.sixth')}
                        </Text>
                        <Text style={styles.rulesMessage}>
                            7 - {i18n.t('manager.rules.seventh')}
                        </Text>
                    </View>
                </ScrollView>
                <Portal>
                    <Modalize
                        ref={modalizeHelpCenterRef}
                        HeaderComponent={renderHeader(
                            null,
                            modalizeHelpCenterRef,
                            () => {},
                            true
                        )}
                    >
                        <WebView
                            originWhitelist={['*']}
                            source={{
                                uri: docsURL(
                                    '/general/difficulties-getting-your-ubi',
                                    language
                                ),
                            }}
                            style={{
                                height: Dimensions.get('screen').height * 0.85,
                            }}
                        />
                    </Modalize>
                </Portal>
            </>
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
        headerTitle: i18n.t('generic.manage'),
        tabBarLabel: i18n.t('generic.manage'),
        tabBarIcon: (props: ITabBarIconProps) => (
            <ManageSvg focused={props.focused} />
        ),
    };
};

const styles = StyleSheet.create({
    rulesView: {
        backgroundColor: ipctColors.softWhite,
        padding: 22,
    },
    rulesTitle: {
        fontFamily: 'Manrope-Bold',
        fontSize: ipctFontSize.small,
        lineHeight: ipctLineHeight.big,
        color: ipctColors.mirage,
        marginBottom: 8,
    },
    rulesMessage: {
        fontFamily: 'Inter-Regular',
        fontSize: ipctFontSize.smaller,
        lineHeight: ipctLineHeight.bigger,
        color: ipctColors.nileBlue,
        marginBottom: 18,
    },
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
