import React from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';
import {
    requestTxSig,
    waitForSignedTxs,
    FeeCurrency
} from '@celo/dappkit'
import { toTxResult } from "@celo/contractkit/lib/utils/tx-result";
import { Linking } from 'expo'
import { connect, ConnectedProps } from 'react-redux';
import { IRootState } from '../../../helpers/types';

import { Button } from 'react-native-paper';
import { AntDesign } from '@expo/vector-icons';
import { setUserFirstTime } from '../../../helpers/redux/actions/ReduxActions';
import { CommunityInstance } from '../../../contracts/types/truffle-contracts';
import { ethers } from 'ethers';


interface IBeneficiaryViewProps {
    navigation: any;
}
const mapStateToProps = (state: IRootState) => {
    const { user, network } = state
    return { user, network }
};

const connector = connect(mapStateToProps)

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & IBeneficiaryViewProps
interface IBeneficiaryViewState {
    nextClaim: number;
    claimDisabled: boolean;
    isBeneficiary: boolean;
    loading: boolean;
    loaded: boolean;
    claiming: boolean;
    loggedIn: boolean;
}
class BeneficiaryView extends React.Component<Props, IBeneficiaryViewState> {

    constructor(props: any) {
        super(props);
        this.state = {
            nextClaim: 0,
            claimDisabled: true,
            isBeneficiary: false,
            loading: false,
            loaded: false,
            claiming: false,
            loggedIn: false,
        }
    }

    loadPage = async (props: Readonly<Props>) => {
        const communityContract = props.network.contracts.communityContract;
        if (props.network.contracts.communityContract !== undefined) {
            const address = props.user.celoInfo.address;
            const isBeneficiary = await communityContract.methods.beneficiaries(address).call();
            await this._loadAllowance(communityContract);
            this.setState({ isBeneficiary, loading: false, loggedIn: true, loaded: true });
        } else if (props.user.celoInfo.address.length === 0) {
            this.setState({ loading: false, loggedIn: false, loaded: true });
        }
    }

    // TODO: improve
    componentDidMount = async () => {
        if (!this.state.loaded && !this.state.loading) {
            this.setState({ loading: true });
            await this.loadPage(this.props);
        }
    }

    // TODO: improve
    UNSAFE_componentWillUpdate = async (nextProps: Readonly<Props>, nextState: Readonly<IBeneficiaryViewState>, nextContext: any) => {
        if (!this.state.loaded && !this.state.loading) {
            this.setState({ loading: true });
            await this.loadPage(nextProps);
        }
    }

    handleClaimPress = async () => {
        const { user, network } = this.props;
        const { communityContract } = network.contracts;
        const { address } = user.celoInfo;
        const requestId = 'user_claim'
        const dappName = 'Impact Market'
        const callback = Linking.makeUrl('/my/path')

        if (communityContract === undefined) {
            // TODO: do something beatiful, la la la
            return;
        }
        this.setState({ claiming: true });
        const txObject = await communityContract.methods.claim()

        requestTxSig(
            network.kit,
            [
                {
                    from: address,
                    to: communityContract.options.address,
                    tx: txObject,
                    feeCurrency: FeeCurrency.cUSD
                }
            ],
            { requestId, dappName, callback }
        )

        const dappkitResponse = await waitForSignedTxs(requestId);
        const tx = dappkitResponse.rawTxs[0];
        toTxResult(network.kit.web3.eth.sendSignedTransaction(tx)).waitReceipt().then((result) => {
            this._loadAllowance(communityContract).then(() => {
                this.setState({ claiming: false });
            })
        })
    }

    render() {
        const {
            claimDisabled,
            nextClaim,
            loading,
            claiming,
            loggedIn,
        } = this.state;
        if (loading) {
            return <Text>Loading...</Text>;
        }
        if (!loggedIn) {
            return <>
                <Text>Login needed...</Text>
                <Button
                    mode="contained"
                    onPress={() => this.props.dispatch(setUserFirstTime(true))}
                >
                    Login now
                </Button>
            </>;
        }

        return (
            <>
                <Text style={{ fontSize: 25, fontWeight: 'bold' }}>Fehsolna</Text>
                <Text style={{ fontSize: 20 }}><AntDesign name="enviromento" size={20} /> São Paulo</Text>
                <Text style={{
                    fontSize: 20,
                    top: 20,
                    width: '50%',
                    textAlign: 'center'
                }}>Every day you can claim $2 up to a total of $500</Text>
                <View style={{ top: 90 }}>
                    <Button
                        mode="contained"
                        onPress={this.handleClaimPress}
                        disabled={claimDisabled}
                        loading={claiming}
                    >
                        {claimDisabled ? new Date(nextClaim).toLocaleString() : 'Claim'}
                    </Button>
                    <Text
                        onPress={() => this.props.navigation.navigate('ClaimExplainedScreen')}
                        style={{ top: 15, textAlign: 'center', color: 'white' }}
                    >How claim works?</Text>
                </View>
            </>
        );
    }

    _loadAllowance = async (communityInstance: ethers.Contract & CommunityInstance) => {
        const { address } = this.props.user.celoInfo;
        const cooldownTime = parseInt((await communityInstance.methods.cooldownClaim(address).call()).toString(), 10);
        const isBeneficiary = await communityInstance.methods.beneficiaries(address).call();
        const claimDisabled = cooldownTime * 1000 > new Date().getTime()
        const remainingCooldown = cooldownTime * 1000 - new Date().getTime();
        // if timeout is bigger than 3 minutes, ignore!
        if (claimDisabled && remainingCooldown < 90000) {
            setTimeout(() => {
                this.setState({ isBeneficiary: false });
            }, remainingCooldown + 1000);
        }
        this.setState({
            claimDisabled,
            nextClaim: cooldownTime * 1000,
            isBeneficiary,
            loading: false,
        })
    }
}

const styles = StyleSheet.create({
});

export default connector(BeneficiaryView);