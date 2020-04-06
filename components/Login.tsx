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
import { Linking } from 'expo'
import { STORAGE_USER_ADDRESS, STORAGE_USER_PHONE_NUMBER, IUserCeloInfo } from '../helpers/types';


interface ILoginProps {
    loginCallback: (userCeloInfo: IUserCeloInfo) => void;
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
            await AsyncStorage.setItem(STORAGE_USER_ADDRESS, dappkitResponse.address);
            await AsyncStorage.setItem(STORAGE_USER_PHONE_NUMBER, dappkitResponse.phoneNumber);
            this.props.loginCallback({ address: dappkitResponse.address, phoneNumber: dappkitResponse.phoneNumber })
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