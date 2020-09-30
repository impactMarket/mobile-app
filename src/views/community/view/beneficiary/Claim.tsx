import i18n from 'assets/i18n';
import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import * as Location from 'expo-location';
import {
    humanifyNumber,
    iptcColors,
    getUserCurrencySymbol,
    amountToUserCurrency,
} from 'helpers/index';
import { IRootState } from 'helpers/types';
import moment from 'moment';
import React from 'react';
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ActivityIndicator, Button, Text } from 'react-native-paper';
import { connect, ConnectedProps } from 'react-redux';
import Api from 'services/api';
import { celoWalletRequest } from 'services/celoWallet';
import config from '../../../../../config';

import { CommunityInstance } from '../../../../contracts/types/truffle-contracts';

const mapStateToProps = (state: IRootState) => {
    const { user, network, app } = state;
    return { user, network, app };
};

const connector = connect(mapStateToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux & IClaimProps;

interface IClaimProps {
    claimAmount: string;
    updateClaimedAmount: () => void;
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
        const communityContract = this.props.network.contracts
            .communityContract;
        await this._loadAllowance(communityContract);
        // check if there's enough funds to enable/disable claim button
        const {
            totalClaimed,
            totalRaised,
            vars,
        } = this.props.network.community;
        const notEnoughToClaimOnContract = new BigNumber(totalRaised)
            .minus(totalClaimed)
            .lt(vars._claimAmount);
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
            .then(async () => {
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
                    Api.addClaimLocation(network.community.publicId, {
                        latitude:
                            loc.coords.latitude + config.locationErrorMargin,
                        longitude:
                            loc.coords.longitude + config.locationErrorMargin,
                    });
                }
                this._loadAllowance(communityContract).then(() => {
                    this.setState({ claiming: false });
                    this.props.updateClaimedAmount();
                });
            })
            .catch((e) => {
                this.setState({ claiming: false });
                Alert.alert(
                    i18n.t('failure'),
                    i18n.t('errorClaiming'),
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

        if (claimDisabled) {
            return (
                <View style={{ height: 90 }}>
                    <Text style={styles.mainPageContent}>
                        {i18n.t('youCanClaimXin', {
                            symbol: getUserCurrencySymbol(this.props.user.user),
                            amount: amountToUserCurrency(
                                this.props.claimAmount,
                                this.props.user.user
                            ),
                        })}
                    </Text>
                    <Text style={styles.claimCountDown}>
                        {nextClaim.days()}d {nextClaim.hours()}h{' '}
                        {nextClaim.minutes()}m {nextClaim.seconds()}s
                    </Text>
                </View>
            );
        }

        return (
            <TouchableOpacity
                style={{
                    flex: 1,
                    flexDirection: 'row',
                    backgroundColor:
                        claimDisabled || notEnoughToClaimOnContract
                            ? '#E9ECEF'
                            : iptcColors.softBlue,
                    alignSelf: 'center',
                    alignItems: 'center',
                    paddingVertical: 5,
                    paddingHorizontal: 15,
                    borderRadius: 8,
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
                            symbol: getUserCurrencySymbol(this.props.user.user),
                            amount: amountToUserCurrency(
                                this.props.claimAmount,
                                this.props.user.user
                            ),
                        })}
                    </Text>
                    <Text style={styles.claimTextCUSD}>
                        ${humanifyNumber(this.props.claimAmount)} cUSD
                    </Text>
                </View>
            </TouchableOpacity>
        );
    }

    _loadAllowance = async (
        communityInstance: ethers.Contract & CommunityInstance
    ) => {
        const { address } = this.props.user.celoInfo;
        const cooldownTime = parseInt(
            (
                await communityInstance.methods.cooldown(address).call()
            ).toString(),
            10
        );
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
        fontWeight: 'bold',
        fontStyle: 'normal',
        letterSpacing: 0.46,
        color: 'white',
    },
    claimTextCUSD: {
        textTransform: 'none',
        fontFamily: 'Gelion-Regular',
        fontStyle: 'normal',
        color: 'white',
    },
    mainPageContent: {
        fontSize: 27,
        textAlign: 'center',
    },
    claimCountDown: {
        fontFamily: 'Gelion-Bold',
        fontSize: 37,
        fontWeight: 'bold',
        fontStyle: 'normal',
        letterSpacing: 0.61,
        textAlign: 'center',
        color: iptcColors.greenishTeal,
    },
});

export default connector(Claim);
