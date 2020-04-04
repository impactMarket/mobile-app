import React from 'react';
import {
    Image,
    StyleSheet,
    Text,
    Button,
    View,
    AsyncStorage,
} from 'react-native';
import {
    requestAccountAddress,
    waitForAccountAuth,
} from '@celo/dappkit'
import { ContractKit } from '@celo/contractkit'
import { Linking } from 'expo'
import { connect, ConnectedProps } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setUserAddress } from '../helpers/SetUserAddressAction';


interface ILoginProps {
    kit: ContractKit;
    loginCallback: (account: string) => void;
}
const mapDispatchToProps = (dispatch: any) => (
    bindActionCreators({
        setUserAddress,
    }, dispatch)
);
const mapStateToProps = (state: any) => {
    const { users } = state
    return { users }
};

const connector = connect(mapStateToProps, mapDispatchToProps)

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & ILoginProps
interface ILoginState {
}
class Login extends React.Component<Props, ILoginState> {

    constructor(props: any) {
        super(props);
        this.state = {
        }
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
        try {
            await AsyncStorage.setItem('ACCOUNT', dappkitResponse.address);
            await AsyncStorage.setItem('PHONENUMBER', dappkitResponse.phoneNumber);
            this.props.setUserAddress({ address: dappkitResponse.address })
            this.props.loginCallback(dappkitResponse.address);
        } catch (error) {
            // Error saving data
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <Image resizeMode='center' source={require("../assets/splash.png")}></Image>

                <Text style={styles.title}>Welcome, please login first.</Text>
                <Button title="login" onPress={() => this.login()} />
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

export default connector(Login);