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
import {
    ILoginCallbackAnswer,
    STORAGE_USER_ADDRESS,
    STORAGE_USER_PHONE_NUMBER,
    SET_USER_WALLET_BALANCE,
    STORAGE_USER_FIRST_TIME,
    IRootState,
} from '../helpers/types';
import { setUserCeloInfo, setUserFirstTime } from '../helpers/redux/actions/ReduxActions';
import { ConnectedProps, connect } from 'react-redux';


interface ILoginProps {
}
const mapStateToProps = (state: IRootState) => {
    const { user, network } = state
    return { user, network }
};

const connector = connect(mapStateToProps)

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

    getCurrentUserBalance = async (address: string) => {
        const stableToken = await this.props.network.kit.contracts.getStableToken()

        const [cUSDBalanceBig, cUSDDecimals] = await Promise.all([stableToken.balanceOf(address), stableToken.decimals()])
        let cUSDBalance = cUSDBalanceBig.div(10 ** 18).toFixed(2)
        return cUSDBalance;
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
            const cUSDBalance = await this.getCurrentUserBalance(dappkitResponse.address);
            //
            await AsyncStorage.setItem(STORAGE_USER_ADDRESS, dappkitResponse.address);
            await AsyncStorage.setItem(STORAGE_USER_PHONE_NUMBER, dappkitResponse.phoneNumber);
            await AsyncStorage.setItem(STORAGE_USER_FIRST_TIME, 'false');
            this.props.dispatch(setUserCeloInfo({
                address: dappkitResponse.address,
                phoneNumber: dappkitResponse.phoneNumber,
                balance: cUSDBalance,
            }))
            this.props.dispatch(setUserFirstTime(false));
        } catch (error) {
            // Error saving data
            console.log(error);
        }
    }
    
    openWithoutLogin = async () => {
        await AsyncStorage.setItem(STORAGE_USER_FIRST_TIME, 'false');
        this.props.dispatch(setUserFirstTime(false));
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

export default connector(Login);