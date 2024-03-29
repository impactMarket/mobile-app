import { ContractKit } from '@celo/contractkit';
import i18n from 'assets/i18n';
import BigNumber from 'bignumber.js';
import WarningTriangle from 'components/svg/WarningTriangle';
import * as Device from 'expo-device';
import * as Location from 'expo-location';
import { Screens } from 'helpers/constants';
import {
    humanifyCurrencyAmount,
    amountToCurrency,
    getCurrencySymbol,
} from 'helpers/currency';
import { getUserBalance, isOutOfTime } from 'helpers/index';
import { findCommunityByIdRequest } from 'helpers/redux/actions/communities';
import { setUserWalletBalance } from 'helpers/redux/actions/user';
import { navigationRef } from 'helpers/rootNavigation';
import { CommunitiesActionTypes, UserActionTypes } from 'helpers/types/redux';
import { IRootState } from 'helpers/types/state';
import moment from 'moment';
import React from 'react';
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import { connect, ConnectedProps } from 'react-redux';
import { Dispatch } from 'redux';
import * as Sentry from 'sentry-expo';
import { analytics } from 'services/analytics';
import Api from 'services/api';
import CacheStore from 'services/cacheStore';
import { celoWalletRequest } from 'services/celoWallet';
import { ipctColors } from 'styles/index';

import config from '../../../../config';

interface IClaimProps {
    claimAmount: string;
    cooldownTime: number;
    updateClaimedAmount: () => void;
    updateCooldownTime: () => Promise<number>;
    kit: ContractKit;
}
interface IClaimState {
    nextClaim: moment.Duration;
    claimDisabled: boolean;
    claiming: boolean;
    notEnoughToClaimOnContract: boolean;
    loading: boolean;
}
class Claim extends React.Component<PropsFromRedux & IClaimProps, IClaimState> {
    constructor(props: any) {
        super(props);
        this.state = {
            nextClaim: moment.duration(0),
            claimDisabled: true,
            claiming: false,
            notEnoughToClaimOnContract: true,
            loading: true,
        };
    }

    componentDidUpdate = async (prevProps: IClaimProps) => {
        if (
            prevProps.cooldownTime !== this.props.cooldownTime &&
            !this.state.loading
        ) {
            const { communityMetadata, communityContract, kit } = this.props;
            const { state, contract } = communityMetadata;
            let notEnoughToClaimOnContract = false;
            if (state !== undefined && contract !== undefined) {
                const stableToken = await kit.contracts.getStableToken();
                const cUSDBalanceBig = await stableToken.balanceOf(
                    communityContract._address
                );
                notEnoughToClaimOnContract = new BigNumber(
                    cUSDBalanceBig.toString()
                ).lt(contract.claimAmount);
            }
            // eslint-disable-next-line react/no-did-update-set-state
            this.setState({ notEnoughToClaimOnContract });
        }
    };

    componentDidMount = async () => {
        const { communityMetadata, cooldownTime, communityContract, kit } =
            this.props;
        const { state, contract } = communityMetadata;
        if (
            state !== undefined &&
            contract !== undefined &&
            this.state.loading === true
        ) {
            await this._loadAllowance(cooldownTime);
            // check if there's enough funds to enable/disable claim button

            const claimedRatio = new BigNumber(state.claimed).dividedBy(
                state.contributed
            );
            let notEnoughToClaimOnContract = false;
            if (
                claimedRatio.gt(new BigNumber(0.9)) ||
                (await CacheStore.getCommunityHadNoFunds()) !== null
            ) {
                // if it's above 90, check from contract
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
                new BigNumber(state.contributed)
                    .minus(state.claimed)
                    .lt(contract.claimAmount)
            ) {
                notEnoughToClaimOnContract = true;
            }

            // TODO:
            // eslint-disable-next-line react/no-did-mount-set-state
            this.setState({ notEnoughToClaimOnContract, loading: false });
        }
    };

    handleClaimPress = async () => {
        const {
            updateUserBalance,
            findCommunityById,
            updateCooldownTime,
            updateClaimedAmount,
            communityContract,
            userAddress,
            communityMetadata,
            communityUpdated,
            kit,
            manager,
            userBalance,
        } = this.props;
        const { notEnoughToClaimOnContract } = this.state;

        if (notEnoughToClaimOnContract) {
            Alert.alert(
                i18n.t('generic.failure'),
                i18n.t('beneficiary.beneficiaryCommunityNoFunds'),
                [{ text: i18n.t('generic.close') }],
                { cancelable: false }
            );
            return;
        }

        if (userBalance.length < 16) {
            Alert.alert(
                i18n.t('generic.failure'),
                i18n.t('errors.notEnoughForTransaction'),
                [{ text: i18n.t('generic.close') }],
                { cancelable: false }
            );
            return;
        }

        const isLocked = await CacheStore.getLockClaimUntil();
        if (isLocked !== null) {
            Alert.alert(
                i18n.t('generic.failure'),
                i18n.t('beneficiary.claimLockedUntil', {
                    date: moment(isLocked).format('lll'),
                }),
                [{ text: i18n.t('generic.close') }],
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
                    throw new Error('invalid valora response');
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
                    manager === null
                ) {
                    const enabled = await Location.hasServicesEnabledAsync();
                    // if enabled but not allowed, request permission
                    // if not enabled but previously allowed, request permission
                    if (enabled) {
                        const permission =
                            await Location.getForegroundPermissionsAsync();
                        const { status } =
                            await Location.requestForegroundPermissionsAsync();
                        if (
                            permission.status !==
                            Location.PermissionStatus.GRANTED
                        ) {
                            if (status !== Location.PermissionStatus.GRANTED) {
                                return;
                            }
                        }
                    } else {
                        const permission =
                            await Location.getForegroundPermissionsAsync();
                        if (
                            permission.status ===
                            Location.PermissionStatus.GRANTED
                        ) {
                            const { status } =
                                await Location.requestForegroundPermissionsAsync();
                            if (status !== Location.PermissionStatus.GRANTED) {
                                return;
                            }
                        } else {
                            return;
                        }
                    }
                    // looks like expo-location fails getting location, many times
                    // trying many times solved the problem. Although, not good.
                    let x = 67;
                    while (x-- > 0) {
                        try {
                            const {
                                coords: { latitude, longitude },
                            } = await Location.getCurrentPositionAsync({
                                accuracy: Location.Accuracy.Low,
                            });
                            await Api.user.addClaimLocation(
                                communityMetadata.id,
                                {
                                    latitude:
                                        latitude + config.locationErrorMargin,
                                    longitude:
                                        longitude + config.locationErrorMargin,
                                }
                            );
                            analytics('claim_location', {
                                device: Device.brand,
                                success: 'true',
                            });
                            break;
                        } catch (e) {
                            //
                        }
                    }
                }
            })
            .catch(async (e) => {
                CacheStore.cacheFailedClaim();
                analytics('claim', { device: Device.brand, success: 'false' });
                this.setState({ claiming: false });
                let error = 'errors.unknown';
                if (e.message.includes('already known')) {
                    return;
                } else if (e.message.includes('NOT_YET')) {
                    error = 'errors.sync.clock';
                } else if (
                    e.message.includes('transfer value exceeded balance')
                ) {
                    error = 'communityWentOutOfFunds';
                    this.setState({ notEnoughToClaimOnContract });
                } else if (e.message.includes('has been reverted')) {
                    error = 'errors.sync.issues';
                } else if (
                    e.message.includes('nonce') ||
                    e.message.includes('gasprice is less')
                ) {
                    error = 'errors.sync.possiblyValora';
                } else if (e.message.includes('gas required exceeds')) {
                    error = 'errors.unknown';
                    // verify clock time
                    if (await isOutOfTime()) {
                        error = 'errors.sync.clock';
                    } else {
                        // verify remaining time to claim
                        const newCooldownTime = await updateCooldownTime();
                        const claimDisabled =
                            newCooldownTime * 1000 > new Date().getTime();
                        if (claimDisabled) {
                            // time to claim was wrong :/
                            error = 'errors.sync.issues';
                            this._loadAllowance(newCooldownTime).then(() => {
                                this.setState({ claiming: false });
                                updateClaimedAmount();
                            });
                        } else {
                            // verify contract funds :/
                            // const communityUpdated = await Api.community.findById(
                            // communityMetadata.id
                            // );
                            findCommunityById(communityMetadata.id);

                            if (communityUpdated) {
                                const { state, contract } = communityUpdated;
                                if (state && contract) {
                                    const claimedRatio = new BigNumber(
                                        state.claimed
                                    ).dividedBy(state.contributed);
                                    let notEnoughToClaimOnContract = false;
                                    if (claimedRatio.gt(new BigNumber(0.97))) {
                                        // if it's above 97, check from contract
                                        // because the values aren't 100% correct,
                                        // as we send 5 cents when a beneficiary is added
                                        const stableToken =
                                            await kit.contracts.getStableToken();
                                        const cUSDBalanceBig =
                                            await stableToken.balanceOf(
                                                communityContract._address
                                            );
                                        notEnoughToClaimOnContract =
                                            new BigNumber(
                                                cUSDBalanceBig.toString()
                                            ).lt(contract.claimAmount);
                                    } else if (
                                        new BigNumber(state.contributed)
                                            .minus(state.claimed)
                                            .lt(contract.claimAmount)
                                    ) {
                                        notEnoughToClaimOnContract = true;
                                    } else {
                                        // very rare cases when the two prior conditions don't have a match
                                        // this is the same code has the first condition
                                        const stableToken =
                                            await kit.contracts.getStableToken();
                                        const cUSDBalanceBig =
                                            await stableToken.balanceOf(
                                                communityContract._address
                                            );
                                        notEnoughToClaimOnContract =
                                            new BigNumber(
                                                cUSDBalanceBig.toString()
                                            ).lt(contract.claimAmount);
                                    }
                                    if (notEnoughToClaimOnContract) {
                                        CacheStore.cacheCommunityHadNoFunds();
                                        error = 'communityWentOutOfFunds';
                                    }
                                    this.setState({
                                        notEnoughToClaimOnContract,
                                    });
                                }
                                // TODO: else throw some error
                            }
                            // TODO: else throw some error
                        }
                    }
                } else if (e.message.includes('Invalid JSON RPC response:')) {
                    if (
                        e.message.includes('The network connection was lost.')
                    ) {
                        error = 'errors.network.connectionLost';
                    }
                    error = 'errors.network.rpc';
                }
                if (error === 'errors.unknown') {
                    //only submit to sentry if it's unknown
                    Sentry.Native.withScope((scope) => {
                        scope.setTag('ipct-activity', 'claim');
                        Sentry.Native.captureException(e);
                    });
                }
                Alert.alert(
                    i18n.t('generic.failure'),
                    i18n.t('beneficiary.errorClaiming', {
                        error: i18n.t(error),
                    }),
                    [{ text: i18n.t('generic.close') }],
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
            loading,
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

        if (loading) {
            return null;
        }

        if (claimDisabled) {
            return (
                <View style={{ height: 90 }}>
                    <Text style={styles.mainPageContent}>
                        {i18n.t('beneficiary.youCanClaimXin', {
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

        return notEnoughToClaimOnContract ? (
            <View style={styles.communityFundsRunOutContainer}>
                <View style={styles.communityFundsRunOutHeader}>
                    <WarningTriangle
                        style={{
                            marginRight: 10,
                        }}
                    />
                    <Text style={styles.communityFundsRunOutTitle}>
                        {i18n.t('communityFundsRunOut.title')}
                    </Text>
                </View>
                <Text style={styles.communityFundsRunOutDescription}>
                    {i18n.t('communityFundsRunOut.description')}
                </Text>
                <Text
                    style={styles.communityFundsRunOutCallToAction}
                    onPress={() =>
                        navigationRef.current?.navigate(Screens.ClaimExplained)
                    }
                >
                    {i18n.t('communityFundsRunOut.callToAction')}
                </Text>
            </View>
        ) : (
            <TouchableOpacity
                style={{
                    flexDirection: 'row',
                    backgroundColor: claimDisabled
                        ? '#E9ECEF'
                        : ipctColors.blueRibbon,
                    alignSelf: 'center',
                    alignItems: 'center',
                    paddingTop: 11,
                    paddingBottom: 17,
                    paddingHorizontal: 27,
                    marginVertical: 16,
                    borderRadius: 8,
                }}
                disabled={claimDisabled}
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
                        <Text style={styles.claimText}>
                            {i18n.t('beneficiary.claimX')}
                        </Text>
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

    estimateBlockTime = (currentBlock: number, endBlock: number) => {
        // const isFuture = currentBlock > endBlock;
        // const blocksPerDay = 12 * 60 * 24; // ~ amount of blocks in a day
        const blockTime = (endBlock - currentBlock) * 5000;

        return new Date(new Date().getTime() + blockTime);
    };

    _loadAllowance = async (_cooldownTime: number) => {
        const { kit, communityContract } = this.props;
        // if old community
        let cooldownTime = 0;
        const isNew = await communityContract.methods
            .impactMarketAddress()
            .call();
        if (isNew === '0x0000000000000000000000000000000000000000') {
            cooldownTime = this.estimateBlockTime(
                await kit.connection.getBlockNumber(),
                _cooldownTime
            ).getTime();
        } else {
            cooldownTime = _cooldownTime * 1000;
        }
        const claimDisabled = cooldownTime > new Date().getTime();
        if (claimDisabled) {
            const interval = 1000;
            const updateTimer = () => {
                const timeLeft = moment.duration(
                    moment(cooldownTime).diff(moment())
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
    communityFundsRunOutContainer: {
        display: 'flex',
        borderWidth: 2,
        borderStyle: 'solid',
        borderColor: 'rgba(235, 87, 87, 1)',
        borderRadius: 8,
        padding: 16,
        marginHorizontal: 22,
        marginVertical: 16,
        alignItems: 'center',
    },
    communityFundsRunOutHeader: {
        flexDirection: 'row',
        // width: '95%',
        alignItems: 'center',
        marginBottom: 8,
    },
    communityFundsRunOutTitle: {
        fontFamily: 'Manrope-Bold',
        fontSize: 16,
        fontWeight: '800',
        lineHeight: 22,
        textAlign: 'center',
    },
    communityFundsRunOutDescription: {
        fontFamily: 'Inter-Regular',
        fontSize: 14,
        lineHeight: 24,
        textAlign: 'center',
        marginBottom: 20,
    },
    communityFundsRunOutCallToAction: {
        fontFamily: 'Inter-Bold',
        fontSize: 18,
        fontWeight: '700',
        lineHeight: 30,
        textAlign: 'center',
        color: ipctColors.blueRibbon,
        marginBottom: 12,
    },
});

const mapStateToProps = (state: IRootState) => {
    const { metadata, contract } = state.user.community;
    const { currency, address } = state.user.metadata;
    const { balance } = state.user.wallet;
    const { manager } = state.user.community;
    const { exchangeRates, kit } = state.app;
    const { community } = state.communities;
    return {
        communityMetadata: metadata,
        communityContract: contract,
        userCurrency: currency,
        userAddress: address,
        userBalance: balance,
        communityUpdated: community,
        exchangeRates,
        kit,
        manager,
    };
};

const mapDispatchToProps = (
    dispatch: Dispatch<UserActionTypes | CommunitiesActionTypes>
) => {
    return {
        updateUserBalance: (newBalance: string) =>
            dispatch(setUserWalletBalance(newBalance)),
        findCommunityById: (id: number) =>
            dispatch(findCommunityByIdRequest(id)),
    };
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default Sentry.Native.withProfiler(connector(Claim), { name: 'Claim' });
