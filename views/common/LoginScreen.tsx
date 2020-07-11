import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    AsyncStorage,
    Alert,
} from 'react-native';
import {
    requestAccountAddress,
    waitForAccountAuth,
} from '@celo/dappkit'
import * as Linking from 'expo-linking'
import {
    STORAGE_USER_ADDRESS,
    STORAGE_USER_PHONE_NUMBER,
    STORAGE_USER_FIRST_TIME,
    IRootState,
    STORAGE_USER_AUTH_TOKEN,
} from '../../helpers/types';
import { setUserCeloInfo, setPushNotificationsToken } from '../../helpers/redux/actions/ReduxActions';
import { ConnectedProps, connect, useStore } from 'react-redux';
import { ethers } from 'ethers';
import BigNumber from 'bignumber.js';
import { Button, Portal, Dialog, TextInput, Paragraph } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { loadContracts } from '../../helpers';
import { userAuth, setUserPushNotificationToken } from '../../services/api';
import { registerForPushNotifications } from '../../services/pushNotifications';


const mapStateToProps = (state: IRootState) => {
    const { user, network } = state
    return { user, network }
};
const connector = connect(mapStateToProps)
type PropsFromRedux = ConnectedProps<typeof connector>
type Props = PropsFromRedux

function LoginScreen(props: Props) {
    const store = useStore();
    const navigation = useNavigation();
    const [connecting, setConnecting] = useState(false);
    const [askingPattern, setAskingPattern] = useState(false);
    const [pin, setPin] = useState<string>('');

    const getCurrentUserBalance = async (address: string) => {
        const stableToken = await props.network.kit.contracts.getStableToken()

        const [cUSDBalanceBig, cUSDDecimals] = await Promise.all([stableToken.balanceOf(address), stableToken.decimals()])
        const decimals = new BigNumber(10).pow(cUSDDecimals).toString();
        let cUSDBalance = cUSDBalanceBig.div(decimals).toFixed(2)
        return cUSDBalance;
    }

    const login = async () => {
        const requestId = 'login'
        const dappName = 'Impact Market'
        const callback = Linking.makeUrl('impactmarketmobile://login')
        setConnecting(true);

        requestAccountAddress({
            requestId,
            dappName,
            callback,
        })
        
        const dappkitResponse = await waitForAccountAuth(requestId)
        const userAddress = ethers.utils.getAddress(dappkitResponse.address);
        const authToken = await userAuth(userAddress, pin);
        if (authToken === undefined) {
            Alert.alert('Failure',
                'An error happened, please, try again.',
                [{ text: 'OK' }], { cancelable: false }
            );
            setConnecting(false);
            setPin('');
            return;
        }
        try {
            const cUSDBalance = await getCurrentUserBalance(userAddress);
            //
            const unsubscribe = store.subscribe(() => {
                if (store.getState().user.celoInfo.address.length > 0) {
                    setConnecting(false);
                    navigation.goBack();
                    unsubscribe();
                }
            })
            await AsyncStorage.setItem(STORAGE_USER_AUTH_TOKEN, authToken);
            await AsyncStorage.setItem(STORAGE_USER_ADDRESS, userAddress);
            await AsyncStorage.setItem(STORAGE_USER_PHONE_NUMBER, dappkitResponse.phoneNumber);
            await AsyncStorage.setItem(STORAGE_USER_FIRST_TIME, 'false');
            await loadContracts(userAddress, props.network.kit, props);
            props.dispatch(setUserCeloInfo({
                address: userAddress,
                phoneNumber: dappkitResponse.phoneNumber,
                balance: cUSDBalance,
            }))
            const pushNotificationsToken = await registerForPushNotifications();
            if (pushNotificationsToken === undefined) {
                Alert.alert('Failure',
                    'An error happened, please, try again.',
                    [{ text: 'OK' }], { cancelable: false }
                );
                setConnecting(false);
                setPin('');
                return;
            }
            setUserPushNotificationToken(userAddress, pushNotificationsToken);
            props.dispatch(setPushNotificationsToken(pushNotificationsToken));
        } catch (error) {
            Alert.alert('Failure',
                'An error happened, please, try again.',
                [{ text: 'OK' }], { cancelable: false }
            );
            setConnecting(false);
            setPin('');
        }
    }

    return (
        <View
            style={{
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'space-around',
                alignItems: 'center',
                margin: 20
            }}
        >
            <Text style={styles.description}>To continue please</Text>
            <Text style={styles.title}>Connect to your Celo Wallet</Text>
            <Text style={styles.description}>ImpactMarket operates on top of  Celo Network, financial system that creates conditions for prosperity for everyone.</Text>
            <Text style={styles.description}>With Celo Wallet you can send money to anyone in the world with just a mobile phone.</Text>
            <Text style={styles.stepText}>Step 1</Text>
            <Text style={styles.instructionText}>Download the Celo app</Text>
            <View
                style={{
                    flexDirection: 'row',
                }}
            >
                <Button
                    mode="contained"
                    disabled={true}
                    style={{ marginHorizontal: 10, width: '40%' }}
                >
                    iOS
                </Button>
                <Button
                    mode="contained"
                    disabled={true}
                    style={{ marginHorizontal: 10, width: '40%' }}
                >
                    Android
                </Button>
            </View>
            <Text style={styles.stepText}>Step 2</Text>
            <Text style={styles.instructionText}>Install the Celo App and create a Celo account</Text>
            <Text style={styles.stepText}>Final Step</Text>
            <Button
                mode="contained"
                onPress={() => setAskingPattern(true)}
                disabled={connecting}
                loading={connecting}
                style={{ width: '80%' }}
            >
                Connect to Celo Wallet
            </Button>
            <Button
                mode="outlined"
                onPress={() => navigation.goBack()}
                disabled={connecting}
                style={{ width: '80%' }}
            >
                Not now
            </Button>
            <Portal>
                <Dialog
                    visible={askingPattern}
                    dismissable={false}
                >
                    <Dialog.Content>
                        <Paragraph>Before moving any further, please, insert your PIN</Paragraph>
                        <TextInput
                            maxLength={4}
                            label="PIN"
                            value={pin}
                            keyboardType="numeric"
                            secureTextEntry={true}
                            textContentType="password"
                            onChangeText={text => setPin(text)}
                        />
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button
                            mode="contained"
                            disabled={pin.length < 4}
                            style={{ marginRight: 10 }}
                            onPress={() => {
                                setAskingPattern(false);
                                login();
                            }}
                        >
                            Continue
                        </Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </View>
    );
}

const styles = StyleSheet.create({
    title: {
        height: 62,
        fontFamily: "Gelion-Bold",
        fontSize: 30,
        fontWeight: "bold",
        fontStyle: "normal",
        lineHeight: 31,
        letterSpacing: 0.7,
        textAlign: "center",
        color: "#1e3252"
    },
    description: {
        fontFamily: "Gelion-Regular",
        fontSize: 19,
        fontWeight: "normal",
        fontStyle: "normal",
        letterSpacing: 0,
        textAlign: "center",
        color: "#8898aa"
    },
    stepText: {
        fontFamily: "Gelion-Bold",
        fontSize: 19,
        fontWeight: "bold",
        fontStyle: "normal",
        letterSpacing: 0,
        textAlign: "center",
        color: "#172b4d"
    },
    instructionText: {
        height: 23,
        fontFamily: "Gelion-Regular",
        fontSize: 19,
        fontWeight: "normal",
        fontStyle: "normal",
        letterSpacing: 0,
        textAlign: "center",
        color: "#172b4d"
    }
});

export default connector(LoginScreen);