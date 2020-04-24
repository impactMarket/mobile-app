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
}
class Settings extends React.Component<Props, ISettingsState> {

    constructor(props: any) {
        super(props);
        this.state = {
        }
    }
    render() {
        if (this.props.user.celoInfo.address.length === 0) {
            return <View style={styles.container}>
                <Text>Login needed...</Text>
            </View>;
        }
        return (
            <View style={styles.container}>
                <View style={styles.item}>
                    <Text style={{ fontWeight: 'bold' }}>Your current address is</Text>
                    <Text>{this.props.user.celoInfo.address}</Text>
                </View>
                <View style={styles.item}>
                    <Text style={{ fontWeight: 'bold' }}>Phone Number</Text>
                    <Text>{this.props.user.celoInfo.phoneNumber}</Text>
                </View>
                <View style={styles.item}>
                    <Text style={{ fontWeight: 'bold' }}>cUSD balance</Text>
                    <Text>${this.props.user.celoInfo.balance}</Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        paddingTop: Expo.Constants.statusBarHeight,
        alignItems: 'center',
        justifyContent: 'center',
        top: 50,
    },
    item: {
        marginBottom: 50,
        alignItems: 'center',
        justifyContent: 'center',
    }
});

export default connector(Settings);