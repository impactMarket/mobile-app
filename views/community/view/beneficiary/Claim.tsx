import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { IRootState } from '../../../../helpers/types';

import { Button } from 'react-native-paper';
import { CommunityInstance } from '../../../../contracts/types/truffle-contracts';
import { ethers } from 'ethers';
import { celoWalletRequest } from '../../../../services';
import { humanifyNumber, iptcColors, getUserCurrencySymbol, amountToUserCurrency } from '../../../../helpers';

import moment from 'moment';
import { Text } from 'react-native-paper';
import {
    StyleSheet,
    View
} from 'react-native';


const mapStateToProps = (state: IRootState) => {
    const { user, network } = state
    return { user, network }
};

const connector = connect(mapStateToProps)
type PropsFromRedux = ConnectedProps<typeof connector>
type Props = PropsFromRedux & IClaimProps

interface IClaimProps {
    claimAmount: string;
    updateClaimedAmount: () => void;
}
interface IClaimState {
    nextClaim: moment.Duration;
    claimDisabled: boolean;
    claiming: boolean;
}
class Claim extends React.Component<Props, IClaimState> {

    constructor(props: any) {
        super(props);
        this.state = {
            nextClaim: moment.duration(0),
            claimDisabled: true,
            claiming: false,
        }
    }

    componentDidMount = async () => {
        const communityContract = this.props.network.contracts.communityContract;
        await this._loadAllowance(communityContract);
    }

    handleClaimPress = async () => {
        const { user, network } = this.props;
        const { communityContract } = network.contracts;
        const { address } = user.celoInfo;

        this.setState({ claiming: true });
        celoWalletRequest(
            address,
            communityContract.options.address,
            await communityContract.methods.claim(),
            'beneficiaryclaim',
            network,
        ).then(() => {
            this._loadAllowance(communityContract).then(() => {
                this.setState({ claiming: false });
                this.props.updateClaimedAmount();
            })
        })
    }

    render() {
        const {
            claimDisabled,
            nextClaim,
            claiming,
        } = this.state;

        if (claimDisabled) {
            return <View style={{ height: 90 }}>
                <Text style={styles.mainPageContent}>
                    You can claim ${humanifyNumber(this.props.claimAmount)} in
                </Text>
                <Text style={styles.claimCountDown}>
                    {nextClaim.days()}d {nextClaim.hours()}h {nextClaim.minutes()}m {nextClaim.seconds()}s
                </Text>
            </View>
        }

        return (
            <Button
                mode="contained"
                onPress={this.handleClaimPress}
                disabled={claimDisabled || claiming}
                loading={claiming}
                style={{
                    width: 170,
                    height: 50,
                    borderRadius: 8,
                    alignSelf: 'center'
                }}
            >
                <Text
                    style={{
                        fontFamily: "Gelion-Bold",
                        fontSize: 25,
                        fontWeight: "bold",
                        fontStyle: "normal",
                        letterSpacing: 0.46,
                        textAlign: "center",
                        color: 'white'
                    }}
                >
                    Claim {getUserCurrencySymbol(this.props.user.user)}
                    {amountToUserCurrency(this.props.claimAmount, this.props.user.user)}
                </Text>
            </Button>
        );
    }

    _loadAllowance = async (communityInstance: ethers.Contract & CommunityInstance) => {
        const { address } = this.props.user.celoInfo;
        const cooldownTime = parseInt((await communityInstance.methods.cooldown(address).call()).toString(), 10);
        const claimDisabled = cooldownTime * 1000 > new Date().getTime()
        if (claimDisabled) {
            const interval = 1000;
            const updateTimer = () => {
                const timeLeft = moment.duration(moment(cooldownTime * 1000).diff(moment()));
                this.setState({ nextClaim: timeLeft });
                if (timeLeft.asSeconds() === 0) {
                    this.setState({ claimDisabled: false })
                    clearInterval(intervalTimer);
                }
            }
            updateTimer();
            const intervalTimer = setInterval(updateTimer, interval);
        }
        this.setState({ claimDisabled })
    }
}

const styles = StyleSheet.create({
    mainPageContent: {
        fontSize: 27,
        textAlign: 'center',
    },
    container: {
        margin: 20
    },
    imageBackground: {
        width: '100%',
        height: 250,
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center'
    },
    communityName: {
        fontSize: 25,
        fontWeight: 'bold',
        fontFamily: 'Gelion-Bold',
        color: 'white'
    },
    communityLocation: {
        fontSize: 20,
        color: 'white'
    },
    claimCountDown: {
        fontFamily: "Gelion-Bold",
        fontSize: 37,
        fontWeight: "bold",
        fontStyle: "normal",
        letterSpacing: 0.61,
        textAlign: "center",
        color: iptcColors.greenishTeal
    },
});

export default connector(Claim);