import { Body, Modal } from '@impact-market/ui-kit';
import { useNavigation } from '@react-navigation/native';
import i18n from 'assets/i18n';
import BigNumber from 'bignumber.js';
import BaseCommunity from 'components/BaseCommunity';
import Button from 'components/core/Button';
import ClaimSvg from 'components/svg/ClaimSvg';
import WaitingRedSvg from 'components/svg/WaitingRedSvg';
import * as IntentLauncher from 'expo-intent-launcher';
import * as Location from 'expo-location';
import { Screens } from 'helpers/constants';
import { humanifyCurrencyAmount } from 'helpers/currency';
import { setAppSuspectWrongDateTime } from 'helpers/redux/actions/app';
import { findCommunityByIdRequest } from 'helpers/redux/actions/communities';
import { ITabBarIconProps } from 'helpers/types/common';
import { IRootState } from 'helpers/types/state';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { Trans } from 'react-i18next';
import { StyleSheet, Text, View, Alert, RefreshControl } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import {
    ActivityIndicator,
    Paragraph,
    Portal,
    ProgressBar,
    Snackbar,
} from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import * as Sentry from 'sentry-expo';
import CacheStore from 'services/cacheStore';
import { celoWalletRequest } from 'services/celoWallet';
import { ipctColors } from 'styles/index';

import Claim from './Claim';

function BeneficiaryScreen() {
    const timeoutTimeDiff = useRef<NodeJS.Timer | undefined>();
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const communityContract = useSelector(
        (state: IRootState) => state.user.community.contract
    );
    const kit = useSelector((state: IRootState) => state.app.kit);
    const community = useSelector(
        (state: IRootState) => state.user.community.metadata
    );
    const userAddress = useSelector(
        (state: IRootState) => state.user.wallet.address
    );

    const isUserBlocked = useSelector(
        (state: IRootState) => state.user.metadata.blocked
    );

    const suspectWrongDateTime = useSelector(
        (state: IRootState) => state.app.suspectWrongDateTime
    );
    const timeDiff = useSelector((state: IRootState) => state.app.timeDiff);

    const [lastInterval, setLastInterval] = useState(0);
    const [cooldownTime, setCooldownTime] = useState(0);
    const [claimedAmount, setClaimedAmount] = useState('');
    const [claimedProgress, setClaimedProgress] = useState(0.1);
    const [refreshing, setRefreshing] = useState(false);
    const [askLocationOnOpen, setAskLocationOnOpen] = useState(false);
    const [dateTimeDiffModal, setDateTimeDiffModal] = useState(new Date());
    const [needsToJoinMigratedCommunity, setNeedsToJoinMigratedCommunity] =
        useState(false);

    useEffect(() => {
        const loadCommunity = async () => {
            if (community !== undefined && community.contract !== undefined) {
                const beneficiaryClaimCache =
                    await CacheStore.getBeneficiaryClaim();
                if (
                    beneficiaryClaimCache !== null &&
                    beneficiaryClaimCache.communityId === community.publicId
                ) {
                    const progress = new BigNumber(
                        beneficiaryClaimCache.claimed
                    ).div(community.contract.maxClaim);
                    setClaimedAmount(
                        humanifyCurrencyAmount(beneficiaryClaimCache.claimed)
                    );
                    setClaimedProgress(progress.toNumber());
                    setCooldownTime(beneficiaryClaimCache.cooldown);
                    setLastInterval(beneficiaryClaimCache.lastInterval);
                } else if (
                    communityContract !== undefined &&
                    userAddress.length > 0
                ) {
                    let claimed = '0';
                    try {
                        claimed = (
                            await communityContract.methods
                                .claimed(userAddress)
                                .call()
                        ).toString();
                    } catch (_) {
                        claimed = (
                            await communityContract.methods.beneficiaries(
                                userAddress
                            )
                        ).claimedAmount.toString();
                    }
                    const cooldown = parseInt(
                        (
                            await communityContract.methods
                                .cooldown(userAddress)
                                .call()
                        ).toString(),
                        10
                    );
                    const lastIntv = parseInt(
                        (
                            await communityContract.methods
                                .lastInterval(userAddress)
                                .call()
                        ).toString(),
                        10
                    );
                    // cache it
                    const beneficiaryClaimCache = {
                        communityId: community.publicId,
                        claimed,
                        cooldown,
                        lastInterval: lastIntv,
                    };
                    CacheStore.cacheBeneficiaryClaim(beneficiaryClaimCache);
                    const progress = new BigNumber(claimed).div(
                        community.contract.maxClaim
                    );
                    setClaimedAmount(humanifyCurrencyAmount(claimed));
                    setClaimedProgress(progress.toNumber());
                    setCooldownTime(cooldown);
                    setLastInterval(lastIntv);
                }
                const isInNewCommunity =
                    await communityContract.methods.beneficiaries(userAddress);
                if (isInNewCommunity.state === 0) {
                    // TODO: still in old community
                    setNeedsToJoinMigratedCommunity(true);
                }
            }
        };
        loadCommunity();
    }, [communityContract, community, userAddress]);

    useEffect(() => {
        if (suspectWrongDateTime) {
            timeoutTimeDiff.current = setInterval(
                () => setDateTimeDiffModal(new Date()),
                1000
            );
        } else if (timeoutTimeDiff !== undefined) {
            clearInterval(timeoutTimeDiff.current);
        }
        return () => {
            if (timeoutTimeDiff !== undefined) {
                clearInterval(timeoutTimeDiff.current);
            }
        };
    }, [suspectWrongDateTime]);

    useEffect(() => {
        const isLocationAvailable = async () => {
            const availableGPSToRequest =
                (await Location.hasServicesEnabledAsync()) &&
                (await Location.getForegroundPermissionsAsync()).status ===
                    Location.PermissionStatus.GRANTED;
            setAskLocationOnOpen(!availableGPSToRequest);
        };

        isLocationAvailable();
    }, []);

    const getNewCooldownTime = async () => {
        return parseInt(
            (
                await communityContract.methods.cooldown(userAddress).call()
            ).toString(),
            10
        );
    };

    const onRefresh = () => {
        dispatch(findCommunityByIdRequest(community.id));
        setRefreshing(false);
    };

    const updateClaimedAmountAndCache = async () => {
        const claimed = (
            await communityContract.methods.claimed(userAddress).call()
        ).toString();
        const cooldown = parseInt(
            (
                await communityContract.methods.cooldown(userAddress).call()
            ).toString(),
            10
        );
        const lastIntv = parseInt(
            (
                await communityContract.methods.lastInterval(userAddress).call()
            ).toString(),
            10
        );
        // cache it
        const beneficiaryClaimCache = {
            communityId: community.publicId,
            claimed,
            cooldown,
            lastInterval: lastIntv,
        };
        CacheStore.cacheBeneficiaryClaim(beneficiaryClaimCache);

        const progress = new BigNumber(claimed).div(
            community.contract!.maxClaim
        );
        setClaimedProgress(progress.toNumber());
        setClaimedAmount(humanifyCurrencyAmount(claimed.toString()));
    };

    if (
        community === undefined ||
        community.contract === undefined ||
        lastInterval === 0 ||
        cooldownTime === 0
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

    const formatedTimeNextCooldown = () => {
        const nextCooldownTime = moment.duration(
            (lastInterval + community.contract!.incrementInterval) * 1000
        );
        let next = '';
        if (nextCooldownTime.days() > 0) {
            next += `${nextCooldownTime.days()}d `;
        }
        next += `${
            nextCooldownTime.hours() < 10 ? '0' : ''
        }${nextCooldownTime.hours()}h ${
            nextCooldownTime.minutes() < 10 ? '0' : ''
        }${nextCooldownTime.minutes()}m `;
        if (nextCooldownTime.seconds() > 0) {
            next += `${nextCooldownTime.seconds()}s`;
        }
        return next;
    };

    const handleBeneficiaryJoinMigrated = async () => {
        celoWalletRequest(
            userAddress,
            communityContract.options.address,
            await communityContract.methods.beneficiaryJoinFromMigrated(),
            'beneficiaryJoinFromMigrated',
            kit
        )
            .then(() => {
                setNeedsToJoinMigratedCommunity(false);
            })
            .catch(() => {
                Alert.alert(
                    i18n.t('generic.failure'),
                    i18n.t('errors.generic'),
                    [
                        {
                            text: i18n.t('generic.tryAgain'),
                            onPress: async () =>
                                handleBeneficiaryJoinMigrated(),
                        },
                        {
                            text: i18n.t('generic.cancel'),
                        },
                    ],
                    { cancelable: false }
                );
            });
    };

    return (
        <>
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            >
                <BaseCommunity
                    community={community}
                    full
                    action={
                        <Button
                            modeType="gray"
                            bold
                            style={{
                                marginVertical: 22.5,
                                alignSelf: 'center',
                            }}
                            labelStyle={{ textAlign: 'center' }}
                            onPress={() =>
                                navigation.navigate(Screens.CommunityDetails, {
                                    communityId: community.id,
                                })
                            }
                        >
                            {i18n.t('generic.moreAboutYourCommunity')}
                        </Button>
                    }
                >
                    <ScrollView>
                        <View>
                            <Text
                                onPress={() =>
                                    navigation.navigate(Screens.ClaimExplained)
                                }
                                style={styles.haveClaimed}
                            >
                                {i18n.t('beneficiary.youHaveClaimedXoutOfY', {
                                    claimed: claimedAmount,
                                    max: humanifyCurrencyAmount(
                                        community.contract.maxClaim
                                    ),
                                })}
                            </Text>
                            <View style={{ marginHorizontal: 30 }}>
                                <ProgressBar
                                    key="claimedbybeneficiary"
                                    style={styles.claimedProgress}
                                    progress={claimedProgress}
                                    color={ipctColors.blueRibbon}
                                />
                            </View>
                        </View>
                        <Claim
                            claimAmount={community.contract.claimAmount}
                            updateClaimedAmount={updateClaimedAmountAndCache}
                            cooldownTime={cooldownTime}
                            updateCooldownTime={getNewCooldownTime}
                        />
                        <View
                            style={{
                                alignItems: 'center',
                                marginBottom: 15,
                                marginHorizontal: 25,
                            }}
                        >
                            <Paragraph style={styles.howClaimsWorks}>
                                {moment
                                    .duration(
                                        moment(cooldownTime * 1000).diff(
                                            moment()
                                        )
                                    )
                                    .asSeconds() < 0 ? (
                                    <Trans
                                        i18nKey="beneficiary.nextTimeWillWaitClaim"
                                        values={{
                                            nextWait:
                                                formatedTimeNextCooldown(),
                                        }}
                                        components={{
                                            a: (
                                                <Text
                                                    onPress={() =>
                                                        navigation.navigate(
                                                            Screens.ClaimExplained
                                                        )
                                                    }
                                                    style={
                                                        styles.howClaimsWorksLink
                                                    }
                                                />
                                            ),
                                        }}
                                    />
                                ) : (
                                    <Text
                                        onPress={() =>
                                            navigation.navigate(
                                                Screens.ClaimExplained
                                            )
                                        }
                                        style={styles.howClaimsWorksLink}
                                    >
                                        {i18n.t('beneficiary.howClaimWorks')}
                                    </Text>
                                )}
                            </Paragraph>
                        </View>
                    </ScrollView>
                </BaseCommunity>
                {/* {showReportCard !== 'false' && !openModal && (
                    <ReportCard setOpenModal={setOpenModal} />
                )} */}
            </ScrollView>
            <Snackbar
                visible={askLocationOnOpen}
                duration={10000}
                onDismiss={() => setAskLocationOnOpen(false)}
                action={{
                    label: i18n.t('generic.turnOn'),
                    onPress: async () => {
                        try {
                            const { status } =
                                await Location.requestForegroundPermissionsAsync();
                            if (status !== Location.PermissionStatus.GRANTED) {
                                Alert.alert(
                                    i18n.t('generic.failure'),
                                    i18n.t('errors.gettingGPS'),
                                    [
                                        {
                                            text: i18n.t('generic.tryAgain'),
                                            onPress: async () =>
                                                await Location.requestForegroundPermissionsAsync(),
                                        },
                                        {
                                            text: i18n.t('generic.cancel'),
                                        },
                                    ],
                                    { cancelable: false }
                                );
                                return;
                            }
                            await Location.getCurrentPositionAsync({
                                accuracy: Location.Accuracy.Low,
                            });
                        } catch (e) {
                            Alert.alert(
                                i18n.t('generic.failure'),
                                i18n.t('errors.gettingGPS'),
                                [
                                    {
                                        text: i18n.t('generic.tryAgain'),
                                        onPress: async () => {
                                            await Location.getCurrentPositionAsync(
                                                {
                                                    accuracy:
                                                        Location.Accuracy.Low,
                                                }
                                            );
                                        },
                                    },
                                    {
                                        text: i18n.t('generic.cancel'),
                                    },
                                ],
                                { cancelable: false }
                            );
                        }
                    },
                }}
            >
                {i18n.t('generic.turnOnLocationHint')}
            </Snackbar>
            <Portal>
                <Modal
                    title={i18n.t('community.joinNewCommunity.title')}
                    visible={needsToJoinMigratedCommunity}
                    buttons={{
                        props: [
                            {
                                text: i18n.t('community.joinNewCommunity.join'),
                                onPress: handleBeneficiaryJoinMigrated,
                            },
                        ],
                    }}
                >
                    <Body>{i18n.t('community.joinNewCommunity.message')}</Body>
                </Modal>
                <Modal
                    title={i18n.t('errors.modals.clock.title')}
                    visible={suspectWrongDateTime}
                    buttons={{
                        inline: false,
                        props: [
                            {
                                text: i18n.t('generic.openClockSettings'),
                                onPress: () =>
                                    IntentLauncher.startActivityAsync(
                                        IntentLauncher.ACTION_DATE_SETTINGS
                                    ),
                            },
                            {
                                text: i18n.t('generic.dismiss'),
                                onPress: () =>
                                    dispatch(
                                        setAppSuspectWrongDateTime(false, 0)
                                    ),
                                mode: 'gray',
                            },
                        ],
                    }}
                >
                    <View
                        style={{
                            alignItems: 'center',
                        }}
                    >
                        <WaitingRedSvg />
                        <Body>
                            {i18n.t('errors.modals.clock.description', {
                                serverTime: moment(
                                    dateTimeDiffModal.getTime() - timeDiff
                                ).format('H[h]mm[m]ss[s]'),
                                userTime:
                                    moment(dateTimeDiffModal).format(
                                        'H[h]mm[m]ss[s]'
                                    ),
                            })}
                        </Body>
                    </View>
                </Modal>
                <Modal
                    title={i18n.t('beneficiary.blockedAccountTitle')}
                    visible={isUserBlocked}
                >
                    <Body>
                        {i18n.t('beneficiary.blockedAccountDescription')}
                    </Body>
                </Modal>
            </Portal>
        </>
    );
}

BeneficiaryScreen.navigationOptions = () => {
    return {
        headerTitle: i18n.t('beneficiary.claim'),
        tabBarLabel: i18n.t('beneficiary.claim'),
        tabBarIcon: (props: ITabBarIconProps) => (
            <ClaimSvg focused={props.focused} />
        ),
    };
};

const styles = StyleSheet.create({
    linearGradient: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: 80,
    },
    darkerBackground: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: '100%',
    },
    contentView: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    claimedProgress: {
        backgroundColor: '#d6d6d6',
        marginTop: 16.16,
        borderRadius: 6.5,
        height: 6.32,
    },
    foregroundView: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
    },
    communityName: {
        zIndex: 5,
        fontSize: 25,
        fontFamily: 'Gelion-Bold',
        color: 'white',
        textAlign: 'center',
    },
    communityLocation: {
        fontSize: 20,
        color: 'white',
    },
    howClaimsWorks: {
        fontFamily: 'Gelion-Regular',
        fontSize: 18,
        color: ipctColors.regentGray,
        letterSpacing: 0.3,
        textAlign: 'center',
    },
    howClaimsWorksLink: {
        fontFamily: 'Gelion-Bold',
        fontSize: 18,
        fontWeight: '500',
        letterSpacing: 0.3,
        color: ipctColors.blueRibbon,
        height: 25,
    },
    haveClaimed: {
        fontFamily: 'Gelion-Regular',
        fontSize: 15,
        lineHeight: 14,
        letterSpacing: 0.25,
        textAlign: 'center',
        color: ipctColors.regentGray,
        marginTop: 53,
    },
});

export default Sentry.Native.withProfiler(BeneficiaryScreen, {
    name: 'BeneficiaryScreen',
});
