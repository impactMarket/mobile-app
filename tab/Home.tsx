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
import ContractAddresses from '../contracts/network.json';
import { connect, ConnectedProps } from 'react-redux';
import { IRootState } from '../helpers/types';


YellowBox.ignoreWarnings(['Warning: The provided value \'moz', 'Warning: The provided value \'ms-stream']);


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
    isUser: boolean;
    impactMarketContract: any;
    loading: boolean;
    claiming: boolean;
}
class Home extends React.Component<Props, IHomeState> {

    constructor(props: any) {
        super(props);
        this.state = {
            nextClaim: 0,
            claimDisabled: true,
            isUser: false,
            impactMarketContract: undefined as any,
            loading: true,
            claiming: false,
        }
    }

    componentDidMount = () => {
        this.loadContracts();
    }

    loadContracts = async () => {
        const instance = new this.props.users.kit.web3.eth.Contract(
            ImpactMarketContractABI as any,
            ContractAddresses.alfajores.ImpactMarket,
        );

        this.loadAllowance(instance);
        this.setState({
            impactMarketContract: instance,
        })
    }

    loadAllowance = async (instance: any) => {
        const { address } = this.props.users.celoInfo;
        const cooldownTime = await instance.methods.cooldownClaim(address).call();
        const isUser = await instance.methods.isWhitelistUser(address).call();
        const claimDisabled = cooldownTime * 1000 > new Date().getTime()
        if (claimDisabled) {
            setTimeout(() => {
                this.loadAllowance(instance)
            }, cooldownTime * 1000 - new Date().getTime());
        }
        this.setState({
            claimDisabled,
            nextClaim: cooldownTime * 1000,
            isUser,
            loading: false,
        })
    }

    handleClaimPress = async (ev: NativeSyntheticEvent<NativeTouchEvent>) => {
        const { impactMarketContract } = this.state;
        const { celoInfo, kit } = this.props.users;
        const { address } = celoInfo;
        const requestId = 'user_claim'
        const dappName = 'Impact Market'
        const callback = Linking.makeUrl('/my/path')

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
            this.loadAllowance(impactMarketContract).then(() => {
                this.setState({ claiming: false });
            })
            console.log(`Hello World contract update transcation receipt: `, result)
        })

        // ev.preventDefault();
    }

    render() {
        const { claimDisabled, nextClaim, isUser, loading, claiming } = this.state;
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
                <Image resizeMode='center' source={require("../assets/splash.png")}></Image>
                {loading && <Text>Loading...</Text>}
                {!loading && (isUser ? userView : nonUserView)}
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