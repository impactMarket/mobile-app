import i18n from 'assets/i18n';
import BigNumber from 'bignumber.js';
import * as Device from 'expo-device';
import * as Location from 'expo-location';
import {
    humanifyCurrencyAmount,
    amountToCurrency,
    getCurrencySymbol,
} from 'helpers/currency';
import { getUserBalance, isOutOfTime } from 'helpers/index';
import { setUserWalletBalance } from 'helpers/redux/actions/user';
import { UserActionTypes } from 'helpers/types/redux';
import { IRootState } from 'helpers/types/state';
import moment from 'moment';
import React from 'react';
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import { connect, ConnectedProps } from 'react-redux';
import { Dispatch } from 'redux';
import { analytics } from 'services/analytics';
import Api from 'services/api';
import CacheStore from 'services/cacheStore';
import { celoWalletRequest } from 'services/celoWallet';
import { ipctColors } from 'styles/index';
import * as Sentry from 'sentry-expo';

import config from '../../../../config';

interface IClaimProps {
    claimAmount: string;
    cooldownTime: number;
    updateClaimedAmount: () => void;
    updateCooldownTime: () => Promise<number>;
}
interface IClaimState {
    nextClaim: moment.Duration;
    claimDisabled: boolean;
    claiming: boolean;
    notEnoughToClaimOnContract: boolean;
}
class Claim extends React.Component<PropsFromRedux & IClaimProps, IClaimState> {
    constructor(props: any) {
        super(props);
        this.state = {
            nextClaim: moment.duration(0),
            claimDisabled: true,
            claiming: false,
            notEnoughToClaimOnContract: true,
        };
    }

    componentDidMount = async () => {
        const {
            communityMetadata,
            cooldownTime,
            communityContract,
            kit,
        } = this.props;
        const { state, contract } = communityMetadata;
        await this._loadAllowance(cooldownTime);
        // check if there's enough funds to enable/disable claim button

        const claimedRatio = new BigNumber(state.claimed).dividedBy(
            state.raised
        );
        let notEnoughToClaimOnContract = false;
        if (
            claimedRatio.gt(new BigNumber(0.97)) ||
            (await CacheStore.getCommunityHadNoFunds()) !== null
        ) {
            // if it's above 97, check from contract
            // because the values aren't 100% correct,
            // as we send 5 cents when a beneficiary is added
            const stableToken = await kit.contracts.getStableToken();
            const cUSDBalanceBig = await stableToken.balanceOf(
                communityContract._address
            );
            notEnoughToClaimOnContract = new BigNumber(
                cUSDBalanceBig.toString()
            ).lt(contract.claimAmount);
            if (!notEnoughToClaimOnContract) {
                CacheStore.removeCommunityHadNoFunds();
            }
        } else if (
            new BigNumber(state.raised)
                .minus(state.claimed)
                .lt(contract.claimAmount)
        ) {
            notEnoughToClaimOnContract = true;
        }

        this.setState({ notEnoughToClaimOnContract });
    };

    handleClaimPress = async () => {
        const {
            updateUserBalance,
            updateCooldownTime,
            updateClaimedAmount,
            communityContract,
            userAddress,
            communityMetadata,
            kit,
            isManager,
            userBalance,
        } = this.props;
        // const communityContract = user.community.contract;
        // const { address } = user.wallet;
        const { notEnoughToClaimOnContract } = this.state;

        if (notEnoughToClaimOnContract) {
            Alert.alert(
                i18n.t('failure'),
                i18n.t('beneficiaryCommunityNoFunds'),
                [{ text: i18n.t('close') }],
                { cancelable: false }
            );
            return;
        }

        if (userBalance.length < 16) {
            Alert.alert(
                i18n.t('failure'),
                i18n.t('notEnoughForTransaction'),
                [{ text: i18n.t('close') }],
                { cancelable: false }
            );
            return;
        }

        const isLocked = await CacheStore.getLockClaimUntil();
        if (isLocked !== null) {
            Alert.alert(
                i18n.t('failure'),
                i18n.t('claimLockedUntil', {
                    date: moment(isLocked).format('lll'),
                }),
                [{ text: i18n.t('close') }],
                { cancelable: false }
            );
            return;
        }

        this.setState({ claiming: true });
        celoWalletRequest(
            userAddress,
            communityContract.options.address,
            await communityContract.methods.claim(),
            'beneficiaryclaim',
            kit
        )
            .then(async (tx) => {
                if (tx === undefined) {
                    return;
                }
                CacheStore.resetClaimFails();
                setTimeout(async () => {
                    const newBalanceStr = (
                        await getUserBalance(kit, userAddress)
                    ).toString();
                    updateUserBalance(newBalanceStr);
                }, 1200);
                updateCooldownTime().then((newCooldownTime) => {
                    this._loadAllowance(newCooldownTime).then(() => {
                        this.setState({ claiming: false });
                        updateClaimedAmount();
                    });
                });
                analytics('claim', { device: Device.brand, success: 'true' });
                // do not collect manager claim location nor private communities
                if (
                    communityMetadata.visibility === 'public' &&
                    isManager === false
                ) {
                    try {
                        if (!(await Location.hasServicesEnabledAsync())) {
                            return;
                        }
                        if (
                            (await Location.getPermissionsAsync()).status !==
                            'granted'
                        ) {
                            return;
                        }
                        if (
                            (await Location.getProviderStatusAsync())
                                .locationServicesEnabled
                        ) {
                            return;
                        }

                        const loc = await Location.getCurrentPositionAsync({
                            accuracy: Location.Accuracy.Low,
                        });
                        await Api.user.addClaimLocation(
                            communityMetadata.publicId,
                            {
                                latitude:
                                    loc.coords.latitude +
                                    config.locationErrorMargin,
                                longitude:
                                    loc.coords.longitude +
                                    config.locationErrorMargin,
                            }
                        );
                        analytics('claim_location', {
                            device: Device.brand,
                            success: 'true',
                        });
                    } catch (e) {
                        Sentry.Native.captureException(e);
                        analytics('claim_location', {
                            device: Device.brand,
                            success: 'false',
                        });
                    }
                }
            })
            .catch(async (e) => {
                CacheStore.cacheFailedClaim();
                analytics('claim', { device: Device.brand, success: 'false' });
                this.setState({ claiming: false });
                let error = 'unknown';
                if (e.message.includes('execution reverted')) {
                    if (e.message.includes('NOT_YET')) {
                        error = 'clockNotSynced';
                    } else if (
                        e.message.includes('transfer value exceeded balance')
                    ) {
                        error = 'communityWentOutOfFunds';
                        this.setState({ notEnoughToClaimOnContract });
                    }
                } else if (e.message.includes('has been reverted')) {
                    error = 'syncIssues';
                } else if (
                    e.message.includes('nonce') ||
                    e.message.includes('gasprice is less')
                ) {
                    error = 'possiblyValoraNotSynced';
                } else if (e.message.includes('gas required exceeds')) {
                    error = 'unknown';
                    // verify clock time
                    if (await isOutOfTime()) {
                        error = 'clockNotSynced';
                    } else {
                        // verify remaining time to claim
                        const newCooldownTime = await updateCooldownTime();
                        const claimDisabled =
                            newCooldownTime * 1000 > new Date().getTime();
                        if (claimDisabled) {
                            // time to claim was wrong :/
                            error = 'syncIssues';
                            this._loadAllowance(newCooldownTime).then(() => {
                                this.setState({ claiming: false });
                                updateClaimedAmount();
                            });
                        } else {
                            // verify contract funds :/
                            const communityUpdated = await Api.community.getByPublicId(
                                communityMetadata.publicId
                            );
                            if (communityUpdated) {
                                const { state, contract } = communityUpdated;
                                const claimedRatio = new BigNumber(
                                    state.claimed
                                ).dividedBy(state.raised);
                                let notEnoughToClaimOnContract = false;
                                if (claimedRatio.gt(new BigNumber(0.97))) {
                                    // if it's above 97, check from contract
                                    // because the values aren't 100% correct,
                                    // as we send 5 cents when a beneficiary is added
                                    const stableToken = await kit.contracts.getStableToken();
                                    const cUSDBalanceBig = await stableToken.balanceOf(
                                        communityContract._address
                                    );
                                    notEnoughToClaimOnContract = new BigNumber(
                                        cUSDBalanceBig.toString()
                                    ).lt(contract.claimAmount);
                                } else if (
                                    new BigNumber(state.raised)
                                        .minus(state.claimed)
                                        .lt(contract.claimAmount)
                                ) {
                                    notEnoughToClaimOnContract = true;
                                } else {
                                    // very rare cases when the two prior conditions don't have a match
                                    // this is the same code has the first condition
                                    const stableToken = await kit.contracts.getStableToken();
                                    const cUSDBalanceBig = await stableToken.balanceOf(
                                        communityContract._address
                                    );
                                    notEnoughToClaimOnContract = new BigNumber(
                                        cUSDBalanceBig.toString()
                                    ).lt(contract.claimAmount);
                                }
                                if (notEnoughToClaimOnContract) {
                                    CacheStore.cacheCommunityHadNoFunds();
                                    error = 'communityWentOutOfFunds';
                                }
                                this.setState({ notEnoughToClaimOnContract });
                            }
                        }
                    }
                } else if (e.message.includes('Invalid JSON RPC response:')) {
                    if (
                        e.message.includes('The network connection was lost.')
                    ) {
                        error = 'networkConnectionLost';
                    }
                    error = 'networkIssuesRPC';
                }
                if (error === 'unknown') {
                    //only submit to sentry if it's unknown
                    Sentry.Native.captureException(e);
                }
                Alert.alert(
                    i18n.t('failure'),
                    i18n.t('errorClaiming', { error: i18n.t(error) }),
                    [{ text: i18n.t('close') }],
                    { cancelable: false }
                );
            });
    };

    render() {
        const {
            claimDisabled,
            nextClaim,
            claiming,
            notEnoughToClaimOnContract,
        } = this.state;
        const { claimAmount, userCurrency, exchangeRates } = this.props;

        const formatedTimeNextClaim = () => {
            let next = '';
            if (nextClaim.days() > 0) {
                next += `${nextClaim.days()}d ${nextClaim.hours()}h ${nextClaim.minutes()}m `;
            } else if (nextClaim.hours() > 0) {
                next += `${nextClaim.hours()}h ${nextClaim.minutes()}m `;
            } else if (nextClaim.minutes() > 0) {
                next += `${nextClaim.minutes()}m `;
            }
            next += `${nextClaim.seconds()}s `;
            return next;
        };

        if (claimDisabled) {
            return (
                <View style={{ height: 90 }}>
                    <Text style={styles.mainPageContent}>
                        {i18n.t('youCanClaimXin', {
                            amount: amountToCurrency(
                                claimAmount,
                                userCurrency,
                                exchangeRates
                            ),
                        })}
                    </Text>
                    <Text style={styles.claimCountDown}>
                        {formatedTimeNextClaim()}
                    </Text>
                </View>
            );
        }

        return (
            <TouchableOpacity
                style={{
                    flexDirection: 'row',
                    backgroundColor: claimDisabled
                        ? '#E9ECEF'
                        : notEnoughToClaimOnContract
                        ? '#f0ad4e'
                        : ipctColors.blueRibbon,
                    alignSelf: 'center',
                    alignItems: 'center',
                    paddingTop: 11,
                    paddingBottom: 17,
                    paddingHorizontal: 27,
                    borderRadius: 8,
                }}
                disabled={
                    claimDisabled // ||
                    // claiming ||  notEnoughToClaimOnContract
                }
                onPress={this.handleClaimPress}
            >
                {claiming && (
                    <ActivityIndicator
                        style={{ marginRight: 13 }}
                        animating
                        color="white"
                    />
                )}
                <View
                    style={{
                        flexDirection: 'column',
                        alignSelf: 'center',
                        alignItems: 'center',
                    }}
                >
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.claimText}>{i18n.t('claimX')}</Text>
                        <Text style={styles.claimTextCurrency}>
                            {getCurrencySymbol(userCurrency)}
                        </Text>
                        <Text style={styles.claimText}>
                            {amountToCurrency(
                                claimAmount,
                                userCurrency,
                                exchangeRates,
                                false
                            )}
                        </Text>
                    </View>
                    <Text style={styles.claimTextCUSD}>
                        ${humanifyCurrencyAmount(claimAmount)} cUSD
                    </Text>
                </View>
            </TouchableOpacity>
        );
    }

    _loadAllowance = async (cooldownTime: number) => {
        const claimDisabled = cooldownTime * 1000 > new Date().getTime();
        if (claimDisabled) {
            const interval = 1000;
            const updateTimer = () => {
                const timeLeft = moment.duration(
                    moment(cooldownTime * 1000).diff(moment())
                );
                this.setState({ nextClaim: timeLeft });
                if (timeLeft.asSeconds() < 0) {
                    this.setState({ claimDisabled: false });
                    clearInterval(intervalTimer);
                }
            };
            updateTimer();
            const intervalTimer = setInterval(updateTimer, interval);
        }
        this.setState({ claimDisabled });
    };
}

const styles = StyleSheet.create({
    claimButton: {
        borderRadius: 8,
        alignSelf: 'center',
    },
    claimText: {
        textTransform: 'none',
        fontFamily: 'Gelion-Bold',
        fontSize: 28,
        lineHeight: 34,
        letterSpacing: 0.458182,
        color: 'white',
    },
    claimTextCurrency: {
        textTransform: 'none',
        fontFamily: 'Gelion-Bold',
        fontSize: 20,
        lineHeight: 29,
        letterSpacing: 0.458182,
        // marginVertical: 4,
        alignSelf: 'flex-end',
        color: 'white',
    },
    claimTextCUSD: {
        textTransform: 'none',
        fontFamily: 'Gelion-Regular',
        fontSize: 15,
        lineHeight: 14,
        letterSpacing: 0.245455,
        color: 'rgba(255, 255, 255, 0.52)',
        marginTop: 6,
    },
    mainPageContent: {
        fontSize: 27,
        textAlign: 'center',
    },
    claimCountDown: {
        fontFamily: 'Gelion-Bold',
        fontSize: 37,
        letterSpacing: 0.61,
        textAlign: 'center',
        color: ipctColors.greenishTeal,
    },
});

const mapStateToProps = (state: IRootState) => {
    const { metadata, contract } = state.user.community;
    const { currency, address } = state.user.metadata;
    const { balance } = state.user.wallet;
    const { isManager } = state.user.community;
    const { exchangeRates, kit } = state.app;
    return {
        communityMetadata: metadata,
        communityContract: contract,
        userCurrency: currency,
        userAddress: address,
        userBalance: balance,
        exchangeRates,
        kit,
        isManager,
    };
};

const mapDispatchToProps = (dispatch: Dispatch<UserActionTypes>) => {
    return {
        updateUserBalance: (newBalance: string) =>
            dispatch(setUserWalletBalance(newBalance)),
    };
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(Claim);
