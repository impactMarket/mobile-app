import React from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { ContractKit } from '@celo/contractkit'
import { connect, ConnectedProps } from 'react-redux';


interface IAccountProps {
}
const mapStateToProps = (state: any) => {
    const { users } = state
    return { users }
};

const connector = connect(mapStateToProps)

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & IAccountProps
interface IAccountState {
    cUSDBalance: string;
}
class Account extends React.Component<Props, IAccountState> {

    constructor(props: any) {
        super(props);
        this.state = {
            cUSDBalance: '',
        }
    }
    

    // login = async () => {
    //     const stableToken = await this.props.kit.contracts.getStableToken()

    //     const [cUSDBalanceBig, cUSDDecimals] = await Promise.all([stableToken.balanceOf(this.props.account), stableToken.decimals()])
    //     let cUSDBalance = cUSDBalanceBig.toString()
    //     this.setState({ cUSDBalance })
    // }

    render() {
        return (
            <View style={styles.container}>
                <Text>{this.props.users.account}</Text>
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

export default connector(Account);