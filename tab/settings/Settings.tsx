import React from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { connect, ConnectedProps } from 'react-redux';
import { IRootState } from '../../helpers/types';


interface ISettingsProps {
}
const mapStateToProps = (state: IRootState) => {
    const { user, network } = state
    return { user, network }
};

const connector = connect(mapStateToProps)

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & ISettingsProps
interface ISettingsState {
    cUSDBalance: string;
}
class Settings extends React.Component<Props, ISettingsState> {

    constructor(props: any) {
        super(props);
        this.state = {
            cUSDBalance: '(...)',
        }
    }

    componentDidMount = async () => {
        const stableToken = await this.props.network.kit.contracts.getStableToken()

        const [cUSDBalanceBig, cUSDDecimals] = await Promise.all([stableToken.balanceOf(this.props.user.celoInfo.address), stableToken.decimals()])
        let cUSDBalance = cUSDBalanceBig.div(10 ** 18).toFixed(2)
        this.setState({ cUSDBalance })
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.item}>
                    <Text style={{ fontWeight: 'bold'}}>Your current address is</Text>
                    <Text>{this.props.user.celoInfo.address}</Text>
                </View>
                <View style={styles.item}>
                    <Text style={{ fontWeight: 'bold'}}>Phone Number</Text>
                    <Text>{this.props.user.celoInfo.phoneNumber}</Text>
                </View>
                <View style={styles.item}>
                    <Text style={{ fontWeight: 'bold'}}>cUSD balance</Text>
                    <Text>${this.state.cUSDBalance}</Text>
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

export default connector(Settings);