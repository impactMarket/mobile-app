import { RouteProp, useNavigation } from '@react-navigation/native';
import i18n from 'assets/i18n';
import BigNumber from 'bignumber.js';
import Header from 'components/Header';
import { humanifyCurrencyAmount } from 'helpers/currency';
import { iptcColors } from 'styles/index';
import { IRootState, ICommunityInfo, ITabBarIconProps } from 'helpers/types';
import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Alert,
    RefreshControl,
    Dimensions,
} from 'react-native';
import {
    ActivityIndicator,
    Headline,
    Modal,
    Paragraph,
    Portal,
    ProgressBar,
    Snackbar,
} from 'react-native-paper';
import { connect, ConnectedProps, useDispatch, useSelector } from 'react-redux';
import Api from 'services/api';
import * as Location from 'expo-location';
import * as IntentLauncher from 'expo-intent-launcher';

import Claim from './Claim';
import { ScrollView } from 'react-native-gesture-handler';
import moment from 'moment';
import BaseCommunity from 'components/BaseCommunity';
import Button from 'components/core/Button';
import { Trans } from 'react-i18next';
import CacheStore from 'services/cacheStore';
import Card from 'components/core/Card';
import WaitingRedSvg from 'components/svg/WaitingRedSvg';
import { setAppSuspectWrongDateTime } from 'helpers/redux/actions/ReduxActions';
import ClaimSvg from 'components/svg/ClaimSvg';
import BackSvg from 'components/svg/header/BackSvg';
import FaqSvg from 'components/svg/header/FaqSvg';
import QRCodeSvg from 'components/svg/header/QRCodeSvg';
import { Screens } from 'helpers/constants';

const mapStateToProps = (state: IRootState) => {
    const { user, network } = state;
    return { user, network };
};
const connector = connect(mapStateToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux;

function BeneficiaryScreen(props: Props) {
    let timeoutTimeDiff: number | undefined;
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const suspectWrongDateTime = useSelector(
        (state: IRootState) => state.app.suspectWrongDateTime
    );
    const timeDiff = useSelector((state: IRootState) => state.app.timeDiff);

    const [lastInterval, setLastInterval] = useState(0);
    const [cooldownTime, setCooldownTime] = useState(0);
    const [community, setCommunity] = useState<ICommunityInfo>();
    const [claimedAmount, setClaimedAmount] = useState('');
    const [claimedProgress, setClaimedProgress] = useState(0.1);
    const [refreshing, setRefreshing] = useState(false);
    const [askLocationOnOpen, setAskLocationOnOpen] = useState(true);
    const [dateTimeDiffModal, setDateTimeDiffModal] = useState(new Date());

    useEffect(() => {
        const loadCommunity = async () => {
            if (props.network.community !== undefined) {
                const beneficiaryClaimCache = await CacheStore.getBeneficiaryClaim();
                if (beneficiaryClaimCache !== null) {
                    const progress = new BigNumber(
                        beneficiaryClaimCache.claimed
                    ).div(props.network.community.contractParams.maxClaim);
                    setClaimedAmount(
                        humanifyCurrencyAmount(beneficiaryClaimCache.claimed)
                    );
                    setClaimedProgress(progress.toNumber());
                    setCommunity(props.network.community);
                    setCooldownTime(beneficiaryClaimCache.cooldown);
                    setLastInterval(beneficiaryClaimCache.lastInterval);
                } else if (
                    props.network.contracts.communityContract !== undefined &&
                    props.user.celoInfo.address.length > 0
                ) {
                    const claimed = (
                        await props.network.contracts.communityContract.methods
                            .claimed(props.user.celoInfo.address)
                            .call()
                    ).toString();
                    const cooldown = parseInt(
                        (
                            await props.network.contracts.communityContract.methods
                                .cooldown(props.user.celoInfo.address)
                                .call()
                        ).toString(),
                        10
                    );
                    const lastIntv = parseInt(
                        (
                            await props.network.contracts.communityContract.methods
                                .lastInterval(props.user.celoInfo.address)
                                .call()
                        ).toString(),
                        10
                    );
                    // cache it
                    const beneficiaryClaimCache = {
                        claimed,
                        cooldown,
                        lastInterval: lastIntv,
                    };
                    CacheStore.cacheBeneficiaryClaim(beneficiaryClaimCache);
                    const progress = new BigNumber(claimed).div(
                        props.network.community.contractParams.maxClaim
                    );
                    setClaimedAmount(humanifyCurrencyAmount(claimed));
                    setClaimedProgress(progress.toNumber());
                    setCommunity(props.network.community);
                    setCooldownTime(cooldown);
                    setLastInterval(lastIntv);
                }
            }
        };
        const isLocationAvailable = async () => {
            const availableGPSToRequest =
                (await Location.hasServicesEnabledAsync()) &&
                (await Location.getPermissionsAsync()).status === 'granted' &&
                (await Location.getProviderStatusAsync())
                    .locationServicesEnabled;
            setAskLocationOnOpen(!availableGPSToRequest);
        };
        loadCommunity();
        isLocationAvailable();
    }, [
        props.network.contracts.communityContract,
        props.network.community,
        props.user.celoInfo.address,
    ]);

    useEffect(() => {
        if (suspectWrongDateTime) {
            timeoutTimeDiff = setInterval(
                () => setDateTimeDiffModal(new Date()),
                1000
            );
        } else if (timeoutTimeDiff !== undefined) {
            clearInterval(timeoutTimeDiff);
        }
    }, [suspectWrongDateTime]);

    const getNewCooldownTime = async () => {
        return parseInt(
            (
                await props.network.contracts.communityContract.methods
                    .cooldown(props.user.celoInfo.address)
                    .call()
            ).toString(),
            10
        );
    };

    const onRefresh = () => {
        Api.getCommunityByContractAddress(community!.contractAddress).then(
            (c) => {
                setCommunity(c!);
                setRefreshing(false);
            }
        );
    };

    const updateClaimedAmountAndCache = async () => {
        const claimed = (
            await props.network.contracts.communityContract.methods
                .claimed(props.user.celoInfo.address)
                .call()
        ).toString();
        const cooldown = parseInt(
            (
                await props.network.contracts.communityContract.methods
                    .cooldown(props.user.celoInfo.address)
                    .call()
            ).toString(),
            10
        );
        const lastIntv = parseInt(
            (
                await props.network.contracts.communityContract.methods
                    .lastInterval(props.user.celoInfo.address)
                    .call()
            ).toString(),
            10
        );
        // cache it
        const beneficiaryClaimCache = {
            claimed,
            cooldown,
            lastInterval: lastIntv,
        };
        CacheStore.cacheBeneficiaryClaim(beneficiaryClaimCache);

        const progress = new BigNumber(claimed).div(
            props.network.community.contractParams.maxClaim
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
                    animating={true}
                    size="large"
                    color={iptcColors.softBlue}
                />
            </View>
        );
    }

    const formatedTimeNextCooldown = () => {
        const nextCooldownTime = moment.duration(
            (lastInterval + community.contractParams.incrementInterval) * 1000
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
            {/* <Header
                title={i18n.t('claim')}
                navigation={navigation}
                hasHelp
                hasQr
            /> */}
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
                    full={true}
                    action={
                        <Button
                            modeType="gray"
                            bold={true}
                            style={{
                                marginVertical: 22.5,
                                alignSelf: 'center',
                            }}
                            labelStyle={{ textAlign: 'center' }}
                            onPress={() =>
                                navigation.navigate(Screens.CommunityDetails, {
                                    community,
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
                            justifyContent: 'space-around',
                            height: Dimensions.get('window').height - 130 - 186, // TODO: ideally, this should be header - navigation
                        }}
                    >
                        <View style={{ marginTop: '5%' }}>
                            <Text
                                onPress={() =>
                                    navigation.navigate(Screens.ClaimExplained)
                                }
                                style={styles.haveClaimed}
                            >
                                {i18n.t('youHaveClaimedXoutOfY', {
                                    claimed: claimedAmount,
                                    max: humanifyCurrencyAmount(
                                        community.contractParams.maxClaim
                                    ),
                                })}
                            </Text>
                            <ProgressBar
                                key="claimedbybeneficiary"
                                style={styles.claimedProgress}
                                progress={claimedProgress}
                                color="#5289ff"
                            />
                        </View>
                        <Claim
                            claimAmount={community.contractParams.claimAmount}
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
            </ScrollView>
            <Snackbar
                visible={askLocationOnOpen}
                duration={10000}
                onDismiss={() => setAskLocationOnOpen(false)}
                action={{
                    label: i18n.t('turnOn'),
                    onPress: async () => {
                        try {
                            await Location.requestPermissionsAsync();
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
                                            await Location.requestPermissionsAsync();
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
                                        color: iptcColors.almostBlack,
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
                                        color: iptcColors.almostBlack,
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
                                bold={true}
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
                                bold={true}
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
        </>
    );
}

BeneficiaryScreen.navigationOptions = ({
    route,
}: {
    route: RouteProp<any, any>;
}) => {
    return {
        headerRight: () => (
            <>
                <FaqSvg />
                <QRCodeSvg />
            </>
        ),
        title: i18n.t('claim'),
        tabBarIcon: (props: ITabBarIconProps) => (
            <ClaimSvg focused={props.focused} />
        ),
    };
};

const styles = StyleSheet.create({
    // container: {
    //     flex: 1,
    //     flexDirection: 'column',
    //     justifyContent: 'space-between',
    // },
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
        marginHorizontal: 30,
        marginVertical: 13,
        height: 6.32,
        borderRadius: 6.5,
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
        color: '#7E8DA6',
        letterSpacing: 0.3,
        textAlign: 'center',
    },
    howClaimsWorksLink: {
        fontFamily: 'Gelion-Bold',
        fontSize: 18,
        fontWeight: '500',
        letterSpacing: 0.3,
        color: iptcColors.softBlue,
        height: 25,
    },
    haveClaimed: {
        fontFamily: 'Gelion-Regular',
        fontSize: 15,
        lineHeight: 14,
        letterSpacing: 0.25,
        textAlign: 'center',
        color: '#7e8da6',
    },
});

export default connector(BeneficiaryScreen);
