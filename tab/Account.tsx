import React from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { connect, ConnectedProps } from 'react-redux';
import { IRootState } from '../helpers/types';


interface IAccountProps {
}
const mapStateToProps = (state: { users: IRootState }) => {
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
            cUSDBalance: '(...)',
        }
    }

    componentDidMount = async () => {
        const stableToken = await this.props.users.kit.contracts.getStableToken()

        const [cUSDBalanceBig, cUSDDecimals] = await Promise.all([stableToken.balanceOf(this.props.users.user.celoInfo.address), stableToken.decimals()])
        let cUSDBalance = cUSDBalanceBig.div(10 ** 18).toString()
        this.setState({ cUSDBalance })
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.item}>
                    <Text style={{ fontWeight: 'bold'}}>Your current address is</Text>
                    <Text>{this.props.users.user.celoInfo.address}</Text>
                </View>
                <View style={styles.item}>
                    <Text style={{ fontWeight: 'bold'}}>Phone Number</Text>
                    <Text>{this.props.users.user.celoInfo.phoneNumber}</Text>
                </View>
                <View style={styles.item}>
                    <Text style={{ fontWeight: 'bold'}}>cUSD balance</Text>
                    <Text>{this.state.cUSDBalance}</Text>
                </View>
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
    item: {
        marginBottom: 50,
        alignItems: 'center',
        justifyContent: 'center',
    }
});

export default connector(Account);