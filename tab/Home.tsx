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
    impactMarketContract?: ethers.Contract & ImpactMarketInstance;
    communityContract?: ethers.Contract & CommunityInstance;
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
        if (this.state.impactMarketContract === undefined) {
            await this.loadContracts();
        }
    }

    loadContracts = async () => {
        const { address } = this.props.users.user.celoInfo;
        const provider = new ethers.providers.Web3Provider(this.props.users.kit.web3.currentProvider as any);
        const impactMarketContract = new ethers.Contract(
            ContractAddresses.alfajores.ImpactMarket,
            ImpactMarketContractABI,
            provider,
        ) as ethers.Contract & ImpactMarketInstance;
        const logs = await provider.getLogs({
            address: impactMarketContract.address,
            fromBlock: 0,
            topics: [ethers.utils.id("CommunityAdded(address)")]
        })
        const communityAddress = ethers.utils.getAddress(logs[0].topics[1].slice(26, logs[0].topics[1].length));
        const communityContract = new ethers.Contract(
            communityAddress,
            CommunityContractABI as any,
            provider,
        ) as ethers.Contract & CommunityInstance;
        const isBeneficiary = await communityContract.beneficiaries(address);
        await this.loadAllowance(communityContract);
        this.setState({ impactMarketContract, communityContract, isBeneficiary });
    }

    loadAllowance = async (communityInstance: ethers.Contract & CommunityInstance) => {
        const { address } = this.props.users.user.celoInfo;
        const cooldownTime = await (await communityInstance.cooldownClaim(address)).toNumber();
        const isBeneficiary = await communityInstance.beneficiaries(address);
        const claimDisabled = cooldownTime * 1000 > new Date().getTime()
        const remainingCooldown = cooldownTime * 1000 - new Date().getTime();
        // if timeout is bigger than 3 minutes, ignore!
        if (claimDisabled && remainingCooldown < 90000) {
            setTimeout(() => {
                this.loadAllowance(communityInstance)
            }, remainingCooldown);
        }
        this.setState({
            claimDisabled,
            nextClaim: cooldownTime * 1000,
            isBeneficiary,
            loading: false,
        })
    }

    handleClaimPress = async () => {
        const { impactMarketContract, communityContract } = this.state;
        const { user, kit } = this.props.users;
        const { address } = user.celoInfo;
        const requestId = 'user_claim'
        const dappName = 'Impact Market'
        const callback = Linking.makeUrl('/my/path')

        if (impactMarketContract === undefined || communityContract === undefined) {
            // TODO: do something beatiful, la la la
            return;
        }
        this.setState({ claiming: true });
        const txObject = await impactMarketContract.methods.claim()

        requestTxSig(
            kit,
            [
                {
                    from: address,
                    to: impactMarketContract.options.address,
                    tx: txObject,
                    feeCurrency: FeeCurrency.cUSD
                }
            ],
            { requestId, dappName, callback }
        )

        const dappkitResponse = await waitForSignedTxs(requestId);
        const tx = dappkitResponse.rawTxs[0];
        toTxResult(kit.web3.eth.sendSignedTransaction(tx)).waitReceipt().then((result) => {
            this.loadAllowance(communityContract).then(() => {
                this.setState({ claiming: false });
            })
        })
    }

    render() {
        const { claimDisabled, nextClaim, isBeneficiary, loading, claiming } = this.state;
        const nextClaimMessage = (
            <>
                <Text style={{ fontSize: 25, fontWeight: 'bold' }}>Fehsolna</Text>
                <Text style={{ fontSize: 20 }}><AntDesign name="enviromento" size={20} /> São Paulo</Text>
                <Text style={{
                    fontSize: 20,
                    top: 20,
                    width: '50%',
                    textAlign: 'center'
                }}>Every day you can claim $2 up to a total of $500</Text>
            </>
        )
        const userView = (
            <>
                {claimDisabled && nextClaim > 0 && nextClaimMessage}
                <View style={{ top: 90 }}>
                    <Button
                        mode="contained"
                        onPress={this.handleClaimPress}
                        disabled={claimDisabled}
                        loading={claiming}
                    >
                        {claimDisabled ? new Date(nextClaim).toLocaleString() : 'Claim'}
                    </Button>
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