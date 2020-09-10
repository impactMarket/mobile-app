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
import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { connect, ConnectedProps } from 'react-redux';
import Api from 'services/api';
import { celoWalletRequest } from 'services/celoWallet';

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
    enoughToClaimOnContract: boolean;
}
class Claim extends React.Component<Props, IClaimState> {
    constructor(props: any) {
        super(props);
        this.state = {
            nextClaim: moment.duration(0),
            claimDisabled: true,
            claiming: false,
            enoughToClaimOnContract: false,
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
        const enoughToClaimOnContract = new BigNumber(totalRaised)
            .minus(totalClaimed)
            .lt(vars._claimAmount);
        this.setState({ enoughToClaimOnContract });
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
        ).then(async () => {
            let loc: Location.LocationData | undefined = undefined;
            const availableGPSToRequest =
                (await Location.hasServicesEnabledAsync()) &&
                (await Location.getPermissionsAsync()).granted &&
                (await Location.getProviderStatusAsync()).gpsAvailable;
            if (availableGPSToRequest) {
                loc = await Location.getCurrentPositionAsync();
            }
            if (loc !== undefined) {
                Api.addClaimLocation({
                    latitude: loc.coords.altitude,
                    longitude: loc.coords.longitude,
                });
            }
            this._loadAllowance(communityContract).then(() => {
                this.setState({ claiming: false });
                this.props.updateClaimedAmount();
            });
        });
    };

    render() {
        const {
            claimDisabled,
            nextClaim,
            claiming,
            enoughToClaimOnContract,
        } = this.state;

        if (claimDisabled) {
            return (
                <View style={{ height: 90 }}>
                    <Text style={styles.mainPageContent}>
                        {i18n.t('youCanClaimXin', {
                            symbol: getUserCurrencySymbol(this.props.user.user),
                            amount: humanifyNumber(this.props.claimAmount),
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
            <Button
                mode="contained"
                onPress={this.handleClaimPress}
                disabled={claimDisabled || claiming || enoughToClaimOnContract}
                loading={claiming}
                style={styles.claimButton}
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
            </Button>
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
                if (timeLeft.asSeconds() === 0) {
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
        width: 200,
        height: 50,
        borderRadius: 8,
        alignSelf: 'center',
    },
    claimText: {
        fontFamily: 'Gelion-Bold',
        fontSize: 25,
        fontWeight: 'bold',
        fontStyle: 'normal',
        letterSpacing: 0.46,
        textAlign: 'center',
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
