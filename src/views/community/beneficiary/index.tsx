import { useNavigation } from '@react-navigation/native';
import i18n from 'assets/i18n';
import BigNumber from 'bignumber.js';
import Header from 'components/Header';
import { iptcColors, humanifyNumber } from 'helpers/index';
import { IRootState, ICommunityInfo } from 'helpers/types';
import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Alert,
    RefreshControl,
    Dimensions,
} from 'react-native';
import { ActivityIndicator, ProgressBar, Snackbar } from 'react-native-paper';
import { connect, ConnectedProps } from 'react-redux';
import Api from 'services/api';
import * as Location from 'expo-location';

import Claim from './Claim';
import { ScrollView } from 'react-native-gesture-handler';
import moment from 'moment';
import BaseCommunity from 'components/BaseCommunity';
import Button from 'components/core/Button';

const mapStateToProps = (state: IRootState) => {
    const { user, network } = state;
    return { user, network };
};
const connector = connect(mapStateToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux;

function BeneficiaryView(props: Props) {
    const navigation = useNavigation();
    const [lastInterval, setLastInterval] = useState(0);
    const [cooldownTime, setCooldownTime] = useState(0);
    const [community, setCommunity] = useState<ICommunityInfo>();
    const [claimedAmount, setClaimedAmount] = useState(0);
    const [claimedProgress, setClaimedProgress] = useState(0.1);
    const [refreshing, setRefreshing] = useState(false);
    const [askLocationOnOpen, setAskLocationOnOpen] = useState(true);

    useEffect(() => {
        const loadCommunity = async () => {
            if (
                props.network.contracts.communityContract !== undefined &&
                props.network.community !== undefined &&
                props.user.celoInfo.address.length > 0
            ) {
                const amount = await props.network.contracts.communityContract.methods
                    .claimed(props.user.celoInfo.address)
                    .call();
                const progress = new BigNumber(amount.toString()).div(
                    props.network.community.vars._maxClaim
                );
                setClaimedAmount(humanifyNumber(amount.toString()));
                setClaimedProgress(progress.toNumber());
                setCommunity(props.network.community);
                setCooldownTime(
                    parseInt(
                        (
                            await props.network.contracts.communityContract.methods
                                .cooldown(props.user.celoInfo.address)
                                .call()
                        ).toString(),
                        10
                    )
                );
                setLastInterval(
                    parseInt(
                        (
                            await props.network.contracts.communityContract.methods
                                .lastInterval(props.user.celoInfo.address)
                                .call()
                        ).toString(),
                        10
                    )
                );
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

    const updateClaimedAmount = async () => {
        const amount = await props.network.contracts.communityContract.methods
            .claimed(props.user.celoInfo.address)
            .call();

        const progress = new BigNumber(amount.toString()).div(
            props.network.community.vars._maxClaim
        );
        setClaimedProgress(progress.toNumber());
        setClaimedAmount(humanifyNumber(amount.toString()));
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
            (lastInterval + parseInt(community.vars._incrementInterval)) * 1000
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
            <Header
                title={i18n.t('claim')}
                navigation={navigation}
                hasHelp
                hasQr
            />
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
                                navigation.navigate('CommunityDetailsScreen', {
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
                                    navigation.navigate('ClaimExplainedScreen')
                                }
                                style={styles.haveClaimed}
                            >
                                {i18n.t('youHaveClaimedXoutOfY', {
                                    claimed: claimedAmount,
                                    max: humanifyNumber(
                                        community.vars._maxClaim
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
                            claimAmount={community.vars._claimAmount}
                            updateClaimedAmount={updateClaimedAmount}
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
                            <Text style={styles.howClaimsWorks}>
                                {i18n.t('nextTimeWillWaitClaim', {
                                    nextWait: formatedTimeNextCooldown(),
                                })}
                            </Text>
                            <Text
                                onPress={() =>
                                    navigation.navigate('ClaimExplainedScreen')
                                }
                                style={styles.howClaimsWorksLink}
                            >
                                {i18n.t('knowHowClaimWorks')}
                            </Text>
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
        </>
    );
}

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

export default connector(BeneficiaryView);
