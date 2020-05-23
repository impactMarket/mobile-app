import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { IRootState } from '../../../../helpers/types';

import { Button } from 'react-native-paper';
import { CommunityInstance } from '../../../../contracts/types/truffle-contracts';
import { ethers } from 'ethers';
import { celoWalletRequest } from '../../../../services';


const mapStateToProps = (state: IRootState) => {
    const { user, network } = state
    return { user, network }
};

const connector = connect(mapStateToProps)
type PropsFromRedux = ConnectedProps<typeof connector>
type Props = PropsFromRedux

interface IClaimState {
    nextClaim: number;
    claimDisabled: boolean;
    claiming: boolean;
}
class Claim extends React.Component<Props, IClaimState> {

    constructor(props: any) {
        super(props);
        this.state = {
            nextClaim: 0,
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
            'beneficiary_claim',
            network,
        ).then(() => {
            this._loadAllowance(communityContract).then(() => {
                this.setState({ claiming: false });
            })
        })
    }

    render() {
        const {
            claimDisabled,
            nextClaim,
            claiming,
        } = this.state;

        return (
            <Button
                mode="contained"
                onPress={this.handleClaimPress}
                disabled={claimDisabled}
                loading={claiming}
            >
                {claimDisabled ? new Date(nextClaim).toLocaleString() : 'Claim'}
            </Button>
        );
    }

    _loadAllowance = async (communityInstance: ethers.Contract & CommunityInstance) => {
        const { address } = this.props.user.celoInfo;
        const cooldownTime = parseInt((await communityInstance.methods.cooldownClaim(address).call()).toString(), 10);
        const claimDisabled = cooldownTime * 1000 > new Date().getTime()
        const remainingCooldown = cooldownTime * 1000 - new Date().getTime();
        // if timeout is bigger than 3 minutes, ignore!
        if (claimDisabled && remainingCooldown < 90000) {
            setTimeout(() => {
                this.setState({ claimDisabled: false });
            }, remainingCooldown);
        }
        this.setState({
            claimDisabled,
            nextClaim: cooldownTime * 1000,
        })
    }
}

export default connector(Claim);