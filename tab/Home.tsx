import React from 'react';
import {
    Image,
    StyleSheet,
    Text,
    Button,
    View,
    YellowBox,
    NativeSyntheticEvent,
    NativeTouchEvent,
} from 'react-native';
import {
    requestTxSig,
    waitForSignedTxs,
    FeeCurrency
} from '@celo/dappkit'
import { ContractKit } from '@celo/contractkit'
import { toTxResult } from "@celo/contractkit/lib/utils/tx-result";
import { Linking } from 'expo'
import ImpactMarketContractABI from '../contracts/ImpactMarketABI.json'
import ContractAddresses from '../contracts/network.json';
import Web3 from 'web3';


YellowBox.ignoreWarnings(['Warning: The provided value \'moz', 'Warning: The provided value \'ms-stream']);


interface IHomeProps {
    web3: Web3;
    kit: ContractKit;
    account: string;
}
interface IHomeState {
    nextClaim: number;
    claimDisabled: boolean;
    isUser: boolean;
    impactMarketContract: any;
}
export default class Home extends React.Component<IHomeProps, IHomeState> {

    constructor(props: any) {
        super(props);
        this.state = {
            nextClaim: 0,
            claimDisabled: true,
            isUser: false,
            impactMarketContract: undefined as any
        }
    }

    loadContracts = async () => {
        const instance = new web3.eth.Contract(
            ImpactMarketContractABI as any,
            ContractAddresses.alfajores.ImpactMarket,
        );

        this.loadAllowance(instance);
        this.setState({
            impactMarketContract: instance,
        })
    }

    loadAllowance = async (instance: any) => {
        const { account } = this.props;
        const cooldownTime = await instance.methods.cooldownClaim(account).call();
        const isUser = await instance.methods.isWhitelistUser(account).call();
        this.setState({
            claimDisabled: cooldownTime * 1000 > new Date().getTime(),
            nextClaim: cooldownTime * 1000,
            isUser
        })
    }

    handleClaimPress = async (ev: NativeSyntheticEvent<NativeTouchEvent>) => {
        const { impactMarketContract } = this.state;
        const { account, kit } = this.props;
        const requestId = 'user_claim'
        const dappName = 'Impact Market'
        const callback = Linking.makeUrl('/my/path')

        const txObject = await impactMarketContract.methods.claim()

        requestTxSig(
            kit,
            [
                {
                    from: account,
                    to: impactMarketContract.options.address,
                    tx: txObject,
                    feeCurrency: FeeCurrency.cUSD
                }
            ],
            { requestId, dappName, callback }
        )

        const dappkitResponse = await waitForSignedTxs(requestId);
        const tx = dappkitResponse.rawTxs[0];
        let result = await toTxResult(kit.web3.eth.sendSignedTransaction(tx)).waitReceipt()

        console.log(`Hello World contract update transcation receipt: `, result)
        ev.preventDefault();
    }

    render() {
        const { claimDisabled, nextClaim, isUser } = this.state;
        const userView = (
            <>
                {claimDisabled && nextClaim > 0 && <Text>Your next claim is at {new Date(nextClaim).toLocaleString()}</Text>}
                <Button title="Claim" onPress={this.handleClaimPress} disabled={claimDisabled} />
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
                <Image resizeMode='center' source={require("../assets/splash.png")}></Image>
                {isUser ? userView : nonUserView}
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
