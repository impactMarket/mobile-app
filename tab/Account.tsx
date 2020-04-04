import React from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { ContractKit } from '@celo/contractkit'


interface IAccountProps {
    kit: ContractKit;
    account: string;
}
interface IAccountState {
    cUSDBalance: string;
}
export default class Account extends React.Component<IAccountProps, IAccountState> {

    constructor(props: any) {
        super(props);
        this.state = {
            cUSDBalance: '',
        }
    }

    login = async () => {
        const stableToken = await this.props.kit.contracts.getStableToken()

        const [cUSDBalanceBig, cUSDDecimals] = await Promise.all([stableToken.balanceOf(this.props.account), stableToken.decimals()])
        let cUSDBalance = cUSDBalanceBig.toString()
        this.setState({ cUSDBalance })
    }

    render() {
        return (
            <View style={styles.container}>
                <Text>{this.props.account}</Text>
                <Text>{this.state.cUSDBalance}</Text>
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
    }
});
