import i18n from 'assets/i18n';
import BigNumber from 'bignumber.js';
import * as Location from 'expo-location';
import {
    humanifyCurrencyAmount,
    amountToCurrency,
    getCurrencySymbol,
} from 'helpers/currency';
import { iptcColors } from 'styles/index';
import moment from 'moment';
import React from 'react';
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import { connect, ConnectedProps } from 'react-redux';
import Api from 'services/api';
import { celoWalletRequest } from 'services/celoWallet';
import config from '../../../../config';
import * as Device from 'expo-device';
import { analytics } from 'services/analytics';
import { IRootState } from 'helpers/types/state';
import { isOutOfTime } from 'helpers/index';

const mapStateToProps = (state: IRootState) => {
    const { user, app } = state;
    return { user, app };
};

const connector = connect(mapStateToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux & IClaimProps;

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
class Claim extends React.Component<Props, IClaimState> {
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
        await this._loadAllowance(this.props.cooldownTime);
        // check if there's enough funds to enable/disable claim button
        const { state, contract } = this.props.user.community.metadata;
        // const notEnoughToClaimOnContract = new BigNumber(state.raised)
        //     .minus(state.claimed)
        //     .lt(contract.claimAmount);
        // don't forget the 5 cents being sent for every new beneficiary

        const claimedRatio = new BigNumber(state.claimed).dividedBy(
            state.raised
        );
        const notEnoughToClaimOnContract = !(
            state.raised !== '0' &&
            claimedRatio.lte(new BigNumber(0.989)) &&
            new BigNumber(state.raised)
                .minus(state.claimed)
                .gt(contract.claimAmount)
        );
        this.setState({ notEnoughToClaimOnContract });
    };

    // componentDidUpdate = (prevProps: Props) => {
    //     console.log('componentDidUpdate new values, out', prevProps.user.community.metadata.state.raised, this.props.user.community.metadata.state.raised);
    //     if (
    //         prevProps.user.community.metadata.state.raised !==
    //         this.props.user.community.metadata.state.raised
    //     ) {
    //         console.log('componentDidUpdate new values');
    //         const { state } = this.props.user.community.metadata;
    //         const notEnoughToClaimOnContract =
    //             state.claimed === '0'
    //                 ? true
    //                 : new BigNumber(state.claimed)
    //                       .dividedBy(state.raised)
    //                       .gt(new BigNumber(0.989));
    //         this.setState({ notEnoughToClaimOnContract });
    //     }
    // };

    handleClaimPress = async () => {
        const { user, app } = this.props;
        const communityContract = user.community.contract;
        const { address } = user.wallet;
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

        this.setState({ claiming: true });
        celoWalletRequest(
            address,
            communityContract.options.address,
            await communityContract.methods.claim(),
            'beneficiaryclaim',
            app.kit
        )
            .then(async (tx) => {
                if (tx === undefined) {
                    return;
                }
                // do not collect manager claim location nor private communities
                if (
                    user.community.metadata.visibility === 'public' &&
                    user.community.isManager === false
                ) {
                    try {
                        let loc:
                            | Location.LocationObject
                            | undefined = undefined;
                        const availableGPSToRequest =
                            (await Location.hasServicesEnabledAsync()) &&
                            (await Location.getPermissionsAsync()).status ===
                                'granted' &&
                            (await Location.getProviderStatusAsync())
                                .locationServicesEnabled;
                        if (availableGPSToRequest) {
                            loc = await Location.getCurrentPositionAsync({
                                accuracy: Location.Accuracy.Low,
                            });
                        }
                        if (loc !== undefined) {
                            await Api.addClaimLocation(
                                user.community.metadata.publicId,
                                {
                                    latitude:
                                        loc.coords.latitude +
                                        config.locationErrorMargin,
                                    longitude:
                                        loc.coords.longitude +
                                        config.locationErrorMargin,
                                }
                            );
                        }
                        analytics('claim_location', {
                            device: Device.brand,
                            success: 'true',
                        });
                    } catch (e) {
                        Api.uploadError(address, 'claim', e);
                        analytics('claim_location', {
                            device: Device.brand,
                            success: 'false',
                        });
                    }
                }
                this.props.updateCooldownTime().then((newCooldownTime) => {
                    this._loadAllowance(newCooldownTime).then(() => {
                        this.setState({ claiming: false });
                        this.props.updateClaimedAmount();
                    });
                });
                analytics('claim', { device: Device.brand, success: 'true' });
            })
            .catch(async (e) => {
                analytics('claim', { device: Device.brand, success: 'false' });
                this.setState({ claiming: false });
                let error = i18n.t('possibleNetworkIssues');
                if (
                    e.message.includes('nonce') ||
                    e.message.includes('gasprice is less')
                ) {
                    error = i18n.t('possiblyValoraNotSynced');
                } else if (e.message.includes('gas required exceeds')) {
                    error = i18n.t('unknown');
                    // verify clock time
                    if (await isOutOfTime()) {
                        error = i18n.t('clockNotSynced');
                    } else {
                        // verify remaining time to claim
                        const newCooldownTime = await this.props.updateCooldownTime();
                        const claimDisabled =
                            newCooldownTime * 1000 > new Date().getTime();
                        if (claimDisabled) {
                            // time to claim was wrong :/
                            error = i18n.t('transactionPossiblyNotAllowed');
                            this._loadAllowance(newCooldownTime).then(() => {
                                this.setState({ claiming: false });
                                this.props.updateClaimedAmount();
                            });
                        } else {
                            // verify contract funds :/
                            const communityUpdated = await Api.community.getByPublicId(
                                this.props.user.community.metadata.publicId
                            );
                            if (communityUpdated) {
                                const { state, contract } = communityUpdated;
                                const claimedRatio = new BigNumber(
                                    state.claimed
                                ).dividedBy(state.raised);
                                const notEnoughToClaimOnContract = !(
                                    state.raised !== '0' &&
                                    claimedRatio.lte(new BigNumber(0.989)) &&
                                    new BigNumber(state.raised)
                                        .minus(state.claimed)
                                        .gt(contract.claimAmount)
                                );
                                error = i18n.t('communityWentOutOfFunds');
                                this.setState({ notEnoughToClaimOnContract });
                            }
                        }
                    }
                } else if (e.message.includes('Invalid JSON RPC response:')) {
                    if (
                        e.message.includes('The network connection was lost.')
                    ) {
                        error = i18n.t('networkConnectionLost');
                    }
                    error = i18n.t('networkIssuesRPC');
                }
                Alert.alert(
                    i18n.t('failure'),
                    i18n.t('errorClaiming', { error }),
                    [{ text: i18n.t('close') }],
                    { cancelable: false }
                );
                Api.uploadError(
                    address,
                    'claim',
                    `${e} <Presented Error> ${error}`
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
                                this.props.claimAmount,
                                this.props.user.metadata.currency,
                                this.props.app.exchangeRates
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
                        : iptcColors.softBlue,
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
                        animating={true}
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
                            {getCurrencySymbol(
                                this.props.user.metadata.currency
                            )}
                        </Text>
                        <Text style={styles.claimText}>
                            {amountToCurrency(
                                this.props.claimAmount,
                                this.props.user.metadata.currency,
                                this.props.app.exchangeRates,
                                false
                            )}
                        </Text>
                    </View>
                    <Text style={styles.claimTextCUSD}>
                        ${humanifyCurrencyAmount(this.props.claimAmount)} cUSD
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
        color: iptcColors.greenishTeal,
    },
});

export default connector(Claim);
