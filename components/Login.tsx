import React from 'react';
import {
    Image,
    StyleSheet,
    Text,
    Button,
    View,
} from 'react-native';
import {
    requestAccountAddress,
    waitForAccountAuth,
} from '@celo/dappkit'
import { Linking } from 'expo'
import { ILoginCallbackAnswer } from '../helpers/types';


interface ILoginProps {
    loginCallback: (loginCallbackAnswer: ILoginCallbackAnswer) => void;
}
interface ILoginState {
}
export default class Login extends React.Component<ILoginProps, ILoginState> {

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
            this.props.loginCallback({
                celoInfo: {
                    address: dappkitResponse.address,
                    phoneNumber: dappkitResponse.phoneNumber,
                }
            })
        } catch (error) {
            // Error saving data
        }
    }

    openWithoutLogin = () => {
        this.props.loginCallback({
            loginNotNow: true,
        })
    }

    render() {
        return (
            <View style={styles.container}>
                <Image resizeMode='center' source={require("../assets/logo.png")}></Image>

                <Text style={styles.title}>Welcome, please login first.</Text>
                <Button title="login" onPress={() => this.login()} />

                <View style={{ marginTop: 10 }}>
                    <Button color="green" title="Not now" onPress={() => this.openWithoutLogin()} />
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
    title: {
        marginVertical: 8,
        fontSize: 20,
        fontWeight: 'bold'
    }
});