import React from 'react';
import './global';
import { web3, kit } from './root'
import { Image, StyleSheet, Text, Button, View, YellowBox } from 'react-native';
import {
    requestTxSig,
    waitForSignedTxs,
    requestAccountAddress,
    waitForAccountAuth,
    FeeCurrency
} from '@celo/dappkit'
import { CeloContract } from '@celo/contractkit'
import { toTxResult } from "@celo/contractkit/lib/utils/tx-result";
import { Linking } from 'expo'
import ImpactMarketContractABI from './contracts/ImpactMarketABI.json'
import ContractAddresses from './contracts/network.json';


YellowBox.ignoreWarnings(['Warning: The provided value \'moz', 'Warning: The provided value \'ms-stream']);

export default class App extends React.Component {

    state = {
        address: 'Not logged in',
        phoneNumber: 'Not logged in',
        cUSDBalance: 'Not logged in',
        nextClaim: 0,
        claimDisabled: true,
        isUser: false,
        impactMarketContract: {}
    }

    loadContracts = async () => {
        const instance = new web3.eth.Contract(
            ImpactMarketContractABI,
            ContractAddresses.alfajores.ImpactMarket,
            { from: this.state.account }
        );

        this.loadAllowance(instance);
        this.setState({
            impactMarketContract: instance,
        })
    }

    loadAllowance = async (instance) => {
        const { address } = this.state;
        const cooldownTime = await instance.methods.cooldownClaim(address).call();
        const isUser = await instance.methods.isWhitelistUser(address).call();
        this.setState({
            claimDisabled: cooldownTime * 1000 > new Date().getTime(),
            nextClaim: cooldownTime * 1000,
            isUser
        })
    }

    login = async () => {
        const requestId = 'login'
        const dappName = 'Impact Market'
        const callback = Linking.makeUrl('/my/path')

        requestAccountAddress({
            requestId,
            dappName,
            callback,
        })

        const dappkitResponse = await waitForAccountAuth(requestId)

        kit.defaultAccount = dappkitResponse.address

        const stableToken = await kit.contracts.getStableToken()

        const [cUSDBalanceBig, cUSDDecimals] = await Promise.all([stableToken.balanceOf(kit.defaultAccount), stableToken.decimals()])
        let cUSDBalance = cUSDBalanceBig.toString()
        this.setState({ cUSDBalance, isLoadingBalance: false })

        this.setState({ address: dappkitResponse.address, phoneNumber: dappkitResponse.phoneNumber })
        this.loadContracts();
    }

    handleClaimPress = async (ev) => {
        const { impactMarketContract, address } = this.state;
        const requestId = 'user_claim'
        const dappName = 'Impact Market'
        const callback = Linking.makeUrl('/my/path')

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
            <Text>You are not allowed!</Text>
        );

        return (
            <View style={styles.container}>
                <Image resizeMode='contain' source={require("./assets/white-wallet-rings.png")}></Image>
                <Text>Open up client/App.js to start working on your app!</Text>

                <Text style={styles.title}>Login first</Text>
                <Button title="login()" onPress={() => this.login()} />
                <Text style={styles.title}>Account Info:</Text>
                <Text>Current Account Address:</Text>
                <Text>{this.state.address}</Text>
                <Text>Phone number: {this.state.phoneNumber}</Text>
                <Text>cUSD Balance: {this.state.cUSDBalance}</Text>

                {isUser ? userView : nonUserView}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#35d07f',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        marginVertical: 8,
        fontSize: 20,
        fontWeight: 'bold'
    }
});
