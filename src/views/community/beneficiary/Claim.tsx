import i18n from 'assets/i18n';
import BigNumber from 'bignumber.js';
import * as Location from 'expo-location';
import { humanifyCurrencyAmount, amountToCurrency } from 'helpers/currency';
import { iptcColors } from 'styles/index';
import { IRootState } from 'helpers/types';
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

const mapStateToProps = (state: IRootState) => {
    const { user, network, app } = state;
    return { user, network, app };
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
        const {
            state,
            contractParams,
        } = this.props.network.community;
        const notEnoughToClaimOnContract = new BigNumber(state.raised)
            .minus(state.claimed)
            .lt(contractParams.claimAmount);
        this.setState({ notEnoughToClaimOnContract });
    };

    handleClaimPress = async () => {
        const { user, network, app } = this.props;
        const { communityContract } = network.contracts;
        const { address } = user.celoInfo;

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
                    network.community.visibility === 'public' &&
                    user.community.isManager === false
                ) {
                    try {
                        let loc: Location.LocationData | undefined = undefined;
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
                                network.community.publicId,
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
            .catch((e) => {
                Api.uploadError(address, 'claim', e);
                analytics('claim', { device: Device.brand, success: 'false' });
                this.setState({ claiming: false });
                let error = 'Possible network issues.';
                if (e.message.includes('gas required exceeds allowance')) {
                    error = 'Transaction possibly not allowed.';
                }
                if (e.message.includes('Invalid JSON RPC response:')) {
                    if (
                        e.message.includes('The network connection was lost.')
                    ) {
                        error = 'The network connection was lost.';
                    }
                    error = 'Possible network issues related to RPC.';
                }
                Alert.alert(
                    i18n.t('failure'),
                    i18n.t('errorClaiming', { error }),
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
                                this.props.user.user.currency,
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
                    flexGrow: 0,
                    flexDirection: 'row',
                    backgroundColor:
                        claimDisabled || notEnoughToClaimOnContract
                            ? '#E9ECEF'
                            : iptcColors.softBlue,
                    alignSelf: 'center',
                    alignItems: 'center',
                    paddingVertical: 5,
                    // marginVertical: '10%',
                    paddingHorizontal: 15,
                    borderRadius: 8,
                    // height: 60,
                }}
                disabled={
                    claimDisabled ||
                    /* claiming || */ notEnoughToClaimOnContract
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
                    <Text style={styles.claimText}>
                        {i18n.t('claimX', {
                            amount: amountToCurrency(
                                this.props.claimAmount,
                                this.props.user.user.currency,
                                this.props.app.exchangeRates
                            ),
                        })}
                    </Text>
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
        fontSize: 25,
        letterSpacing: 0.46,
        color: 'white',
    },
    claimTextCUSD: {
        textTransform: 'none',
        fontFamily: 'Gelion-Regular',
        color: 'white',
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
