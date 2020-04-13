import React from 'react';
import {
    Image,
    StyleSheet,
    Text,
    View,
    YellowBox,
    NativeSyntheticEvent,
    NativeTouchEvent,
} from 'react-native';
import { Button } from 'react-native-elements';
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


// YellowBox.ignoreWarnings(['Warning: The provided value \'moz', 'Warning: The provided value \'ms-stream']);


interface IHomeProps {
}
const mapStateToProps = (state: IRootState) => {
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
        const { address } = this.props.users.celoInfo;
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
        const { address } = this.props.users.celoInfo;
        const cooldownTime = await (await communityInstance.cooldownClaim(address)).toNumber();
        const isBeneficiary = await communityInstance.beneficiaries(address);
        const claimDisabled = cooldownTime * 1000 > new Date().getTime()
        if (claimDisabled) {
            // TODO: if timeout is bigger than 10 minutes, ignore!
            setTimeout(() => {
                this.loadAllowance(communityInstance)
            }, cooldownTime * 1000 - new Date().getTime());
        }
        this.setState({
            claimDisabled,
            nextClaim: cooldownTime * 1000,
            isBeneficiary,
            loading: false,
        })
    }

    handleClaimPress = async (ev: NativeSyntheticEvent<NativeTouchEvent>) => {
        const { impactMarketContract, communityContract } = this.state;
        const { celoInfo, kit } = this.props.users;
        const { address } = celoInfo;
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
            console.log(`Hello World contract update transcation receipt: `, result)
        })

        // ev.preventDefault();
    }

    render() {
        const { claimDisabled, nextClaim, isBeneficiary, loading, claiming } = this.state;
        const userView = (
            <>
                {claimDisabled && nextClaim > 0 && <Text>Your next claim is at {new Date(nextClaim).toLocaleString()}</Text>}
                <Button
                    title="Claim"
                    onPress={this.handleClaimPress}
                    disabled={claimDisabled}
                    loading={claiming}
                />
            </>
        );
        const nonUserView = (
            <>
                <Text>Not available!</Text>
                <Text>Please, contact close communities.</Text>
            </>
        );

        return (
            <View style={styles.container}>
                <Image resizeMode='center' source={require("../assets/logo.png")}></Image>
                {loading && <Text>Loading...</Text>}
                {!loading && (isBeneficiary ? userView : nonUserView)}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        marginVertical: 8,
        fontSize: 20,
        fontWeight: 'bold'
    }
});

export default connector(Home);