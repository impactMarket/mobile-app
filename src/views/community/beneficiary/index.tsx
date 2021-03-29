import { RouteProp, useNavigation } from '@react-navigation/native';
import i18n from 'assets/i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BigNumber from 'bignumber.js';
import BaseCommunity from 'components/BaseCommunity';
import Button from 'components/core/Button';
import Card from 'components/core/Card';
import ClaimSvg from 'components/svg/ClaimSvg';
import WaitingRedSvg from 'components/svg/WaitingRedSvg';
import * as IntentLauncher from 'expo-intent-launcher';
import * as Location from 'expo-location';
import { Screens } from 'helpers/constants';
import { humanifyCurrencyAmount } from 'helpers/currency';
import { setAppSuspectWrongDateTime } from 'helpers/redux/actions/app';
import { setCommunityMetadata } from 'helpers/redux/actions/user';
import { ITabBarIconProps } from 'helpers/types/common';
import { IRootState } from 'helpers/types/state';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { SHOW_REPORT_CARD } from 'helpers/constants';

// redux Actions
import { setAppHasAcceptedTerms } from 'helpers/redux/actions/app';
import { Trans } from 'react-i18next';
import {
    StyleSheet,
    Text,
    View,
    Alert,
    RefreshControl,
    Dimensions,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import {
    ActivityIndicator,
    Headline,
    Modal,
    Paragraph,
    Portal,
    ProgressBar,
    Snackbar,
} from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import Api from 'services/api';
import CacheStore from 'services/cacheStore';
import { ipctColors } from 'styles/index';
import ReportCard from 'components/svg/header/ReportCard';
import BlockedAccount from './cards/BlockedAccount';

import Claim from './Claim';

function BeneficiaryScreen() {
    let timeoutTimeDiff: number | undefined;
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const [openModal, setOpenModal] = useState(false);
    const [showReportCard, setShowReportCard] = useState<string | null>('');

    const communityContract = useSelector(
        (state: IRootState) => state.user.community.contract
    );
    const community = useSelector(
        (state: IRootState) => state.user.community.metadata
    );
    const userAddress = useSelector(
        (state: IRootState) => state.user.wallet.address
    );

    const isUserBlocked = useSelector(
        (state: IRootState) => state.user.metadata.blocked
    );

    const hasAcceptedRulesAlready = useSelector(
        (state: IRootState) => state.app.hasAcceptedRulesAlready
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

    useEffect(() => {
        const loadCommunity = async () => {
            if (community !== undefined) {
                const beneficiaryClaimCache = await CacheStore.getBeneficiaryClaim();
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
                    const claimed = (
                        await communityContract.methods
                            .claimed(userAddress)
                            .call()
                    ).toString();
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
            }
        };
        loadCommunity();
    }, [communityContract, community, userAddress]);

    useEffect(() => {
        if (suspectWrongDateTime) {
            timeoutTimeDiff = setInterval(
                () => setDateTimeDiffModal(new Date()),
                1000
            );
        } else if (timeoutTimeDiff !== undefined) {
            clearInterval(timeoutTimeDiff);
        }
        return () => {
            clearInterval(timeoutTimeDiff);
        };
    }, [suspectWrongDateTime]);

    useEffect(() => {
        async function loadCommunityRulesStats() {
            if (hasAcceptedRulesAlready == null) {
                const _hasAcceptedRulesAlready = await CacheStore.getAcceptCommunityRules();

                if (!_hasAcceptedRulesAlready) {
                    dispatch(setAppHasAcceptedTerms(false));
                    navigation.navigate(Screens.WelcomeBeneficiaryScreen);
                }
            }
        }
        loadCommunityRulesStats();
    }, []);

    useEffect(() => {
        const isLocationAvailable = async () => {
            const availableGPSToRequest =
                (await Location.hasServicesEnabledAsync()) &&
                (await Location.getPermissionsAsync()).status === 'granted' &&
                (await Location.getProviderStatusAsync())
                    .locationServicesEnabled;
            setAskLocationOnOpen(!availableGPSToRequest);
        };
        // const checkFirstTime = async () => {
        //     const isFirstTime = await AsyncStorage.getItem(SHOW_REPORT_CARD);
        //     setShowReportCard(isFirstTime);
        // };
        // checkFirstTime();
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
        Api.community.getByPublicId(community.publicId).then((c) => {
            dispatch(setCommunityMetadata(c!));
            setRefreshing(false);
        });
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
            community.contract.maxClaim
        );
        setClaimedProgress(progress.toNumber());
        setClaimedAmount(humanifyCurrencyAmount(claimed.toString()));
    };

    if (community === undefined || lastInterval === 0 || cooldownTime === 0) {
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
            (lastInterval + community.contract.incrementInterval) * 1000
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
                                    communityId: community.publicId,
                                })
                            }
                        >
                            {i18n.t('moreAboutYourCommunity')}
                        </Button>
                    }
                >
                    <View
                        style={{
                            flex: 1,
                            justifyContent: 'space-between',
                            height:
                                Dimensions.get('window').height -
                                100 -
                                84 -
                                152, // this is the: height - header - navigation - image
                        }}
                    >
                        <View>
                            <Text
                                onPress={() =>
                                    navigation.navigate(Screens.ClaimExplained)
                                }
                                style={styles.haveClaimed}
                            >
                                {i18n.t('youHaveClaimedXoutOfY', {
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
                                        i18nKey="nextTimeWillWaitClaim"
                                        values={{
                                            nextWait: formatedTimeNextCooldown(),
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
                                        {i18n.t('howClaimWorks')}
                                    </Text>
                                )}
                            </Paragraph>
                        </View>
                    </View>
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
                    label: i18n.t('turnOn'),
                    onPress: async () => {
                        try {
                            const {
                                status,
                            } = await Location.requestPermissionsAsync();
                            if (status !== 'granted') {
                                Alert.alert(
                                    i18n.t('failure'),
                                    i18n.t('errorGettingGPSLocation'),
                                    [{ text: 'OK' }],
                                    { cancelable: false }
                                );
                                return;
                            }
                            await Location.getCurrentPositionAsync({
                                accuracy: Location.Accuracy.Low,
                            });
                        } catch (e) {
                            Alert.alert(
                                i18n.t('failure'),
                                i18n.t('errorGettingGPSLocation'),
                                [
                                    {
                                        text: i18n.t('tryAgain'),
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
                                        text: i18n.t('cancel'),
                                    },
                                ],
                                { cancelable: false }
                            );
                        }
                    },
                }}
            >
                {i18n.t('turnOnLocationHint')}
            </Snackbar>
            <Portal>
                <Modal visible={suspectWrongDateTime} dismissable={false}>
                    <Card style={{ marginHorizontal: 20 }}>
                        <Card.Content>
                            <View
                                style={{
                                    alignItems: 'center',
                                }}
                            >
                                <WaitingRedSvg />
                                <Headline
                                    style={{
                                        fontFamily: 'Gelion-Regular',
                                        fontSize: 24,
                                        lineHeight: 24,
                                        textAlign: 'center',
                                        color: ipctColors.almostBlack,
                                        marginVertical: 16,
                                    }}
                                >
                                    {i18n.t('incorrectTime')}
                                </Headline>
                                <Paragraph
                                    style={{
                                        fontFamily: 'Gelion-Regular',
                                        fontSize: 16,
                                        lineHeight: 19,
                                        color: ipctColors.almostBlack,
                                        textAlign: 'center',
                                    }}
                                >
                                    {i18n.t('incorrectTimeMessage', {
                                        serverTime: moment(
                                            dateTimeDiffModal.getTime() -
                                                timeDiff
                                        ).format('H[h]mm[m]ss[s]'),
                                        userTime: moment(
                                            dateTimeDiffModal
                                        ).format('H[h]mm[m]ss[s]'),
                                    })}
                                </Paragraph>
                            </View>
                            <Button
                                modeType="default"
                                style={{
                                    marginTop: 20,
                                    marginHorizontal: 5,
                                }}
                                bold
                                onPress={() =>
                                    IntentLauncher.startActivityAsync(
                                        IntentLauncher.ACTION_DATE_SETTINGS
                                    )
                                }
                            >
                                {i18n.t('openClockSettings')}
                            </Button>
                            <Button
                                modeType="gray"
                                style={{
                                    marginTop: 8,
                                    marginHorizontal: 5,
                                }}
                                bold
                                onPress={() =>
                                    dispatch(
                                        setAppSuspectWrongDateTime(false, 0)
                                    )
                                }
                            >
                                {i18n.t('dismiss')}
                            </Button>
                        </Card.Content>
                    </Card>
                </Modal>
            </Portal>
            <Portal>
                <Modal visible={isUserBlocked} dismissable={false}>
                    <BlockedAccount />
                </Modal>
            </Portal>
        </>
    );
}

BeneficiaryScreen.navigationOptions = ({
    route,
}: {
    route: RouteProp<any, any>;
}) => {
    return {
        title: i18n.t('claim'),
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

export default BeneficiaryScreen;
