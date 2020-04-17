import React from 'react';
import {
    Image,
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
import ImpactMarketContractABI from '../contracts/ImpactMarketABI.json'
import CommunityContractABI from '../contracts/CommunityABI.json'
import ContractAddresses from '../contracts/network.json';
import { connect, ConnectedProps } from 'react-redux';
import { IRootState } from '../helpers/types';
import { ethers } from 'ethers';
import { ImpactMarketInstance, CommunityInstance } from '../contracts/types/truffle-contracts';

import { Appbar, Avatar, Button } from 'react-native-paper';
import { AntDesign } from '@expo/vector-icons';


interface IHomeProps {
    navigation: any;
}
const mapStateToProps = (state: { users: IRootState }) => {
    const { users } = state
    return { users }
};

const connector = connect(mapStateToProps)

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & IHomeProps
interface IHomeState {
    nextClaim: number;
    claimDisabled: boolean;
    isBeneficiary: boolean;
    loading: boolean;
    claiming: boolean;
}
class Home extends React.Component<Props, IHomeState> {

    constructor(props: any) {
        super(props);
        this.state = {
            nextClaim: 0,
            claimDisabled: true,
            isBeneficiary: false,
            loading: true,
            claiming: false,
        }
    }

    componentDidMount = async () => {
        const communityContract = this.props.users.contracts.communityContract;
        if (this.props.users.contracts.communityContract !== undefined) {
            const address = this.props.users.user.celoInfo.address;
            const isBeneficiary = await communityContract.methods.beneficiaries(address).call();
            await this._loadAllowance(communityContract);
            this.setState({ isBeneficiary });
        }
    }

    handleClaimPress = async () => {
        const { user, kit, contracts } = this.props.users;
        const { communityContract } = contracts;
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
            kit,
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
        toTxResult(kit.web3.eth.sendSignedTransaction(tx)).waitReceipt().then((result) => {
            this._loadAllowance(communityContract).then(() => {
                this.setState({ claiming: false });
            })
        })
    }

    render() {
        const { claimDisabled, nextClaim, isBeneficiary, loading, claiming } = this.state;
        const userView = (
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
                        onPress={() => this.props.navigation.navigate('Details')}
                        style={{ top: 15 }}
                    >How claim works?</Text>
                </View>
            </>
        );
        const nonUserView = (
            <>
                <Text>Not available!</Text>
                <Text>Please, contact close communities.</Text>
            </>
        );

        return (
            <View>
                <Appbar.Header style={styles.appbar}>
                    <Avatar.Image size={58} source={require('../assets/hello.png')} />
                    <Appbar.Content
                        title="0$"
                        subtitle="Balance"
                    />
                    <Appbar.Action icon="bell" />
                </Appbar.Header>
                <View style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <Image
                        source={require('../assets/favela.jpg')}
                        style={{
                            width: '100%',
                            height: 500,
                            opacity: 0.3
                        }}
                    />
                    <View style={styles.container}>
                        {loading && <Text>Loading...</Text>}
                        {!loading && (isBeneficiary ? userView : nonUserView)}
                    </View>
                </View>
            </View>
        );
    }

    _loadAllowance = async (communityInstance: ethers.Contract & CommunityInstance) => {
        const { address } = this.props.users.user.celoInfo;
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
    container: {
        alignItems: 'center',
        position: 'absolute',
        top: 50
    },
    title: {
        marginVertical: 8,
        fontSize: 20,
        fontWeight: 'bold'
    },
    appbar: {
        height: 120
    },
    button: {
        backgroundColor: "blue",
        padding: 20,
        borderRadius: 5,
    },
    buttonText: {
        fontSize: 20,
        color: '#fff',
    },
});

export default connector(Home);