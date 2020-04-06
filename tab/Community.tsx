import React from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';
import ImpactMarketContractABI from '../contracts/ImpactMarketABI.json'
import ContractAddresses from '../contracts/network.json';
import { connect, ConnectedProps } from 'react-redux';
import { IRootState } from '../helpers/types';


interface ICommunityProps {
}
const mapStateToProps = (state: IRootState) => {
    const { users } = state
    return { users }
};

const connector = connect(mapStateToProps)

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & ICommunityProps
interface ICommunityState {
    loading: boolean;
    userInCommunity: string;
}
class Community extends React.Component<Props, ICommunityState> {

    constructor(props: any) {
        super(props);
        this.state = {
            loading: false,
            userInCommunity: '',
        }
    }

    componentDidMount = () => {
        const { address } = this.props.users.celoInfo;
        const demoCommunityAddress = '0x27c719785c899A7426Af69Fee2d01091e38b7588';
        const instance = new this.props.users.kit.web3.eth.Contract(
            ImpactMarketContractABI as any,
            ContractAddresses.alfajores.ImpactMarket,
        );
        instance.methods.userToCommunity(address, demoCommunityAddress).call()
            .then((result: boolean) => {
                if (result) {
                    this.setState({ userInCommunity: demoCommunityAddress });
                }
            })
    }

    render() {
        const { loading, userInCommunity } = this.state;
        let message = '';
        if (loading) {
            return <Text>Loading...</Text>
        }
        if (userInCommunity.length > 0) {
            message = 'You belong to community ' + userInCommunity
        } else {
            message = 'You do not belong to a community!'
        }
        return (
            <View style={styles.container}>
                <Text>{message}</Text>
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

export default connector(Community);