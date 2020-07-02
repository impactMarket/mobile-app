import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    AsyncStorage,
} from 'react-native';
import {
    requestAccountAddress,
    waitForAccountAuth,
} from '@celo/dappkit'
import { Linking } from 'expo'
import {
    STORAGE_USER_ADDRESS,
    STORAGE_USER_PHONE_NUMBER,
    STORAGE_USER_FIRST_TIME,
    IRootState,
} from '../../helpers/types';
import { setUserCeloInfo } from '../../helpers/redux/actions/ReduxActions';
import { ConnectedProps, connect, useStore } from 'react-redux';
import { ethers } from 'ethers';
import BigNumber from 'bignumber.js';
import { Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { loadContracts } from '../../helpers';


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
        try {
            const userAddress = ethers.utils.getAddress(dappkitResponse.address);
            const cUSDBalance = await getCurrentUserBalance(userAddress);
            //
            const unsubscribe = store.subscribe(() => {
                if (store.getState().user.celoInfo.address.length > 0) {
                    setConnecting(false);
                    navigation.goBack();
                    unsubscribe();
                }
            })
            await AsyncStorage.setItem(STORAGE_USER_ADDRESS, userAddress);
            await AsyncStorage.setItem(STORAGE_USER_PHONE_NUMBER, dappkitResponse.phoneNumber);
            await AsyncStorage.setItem(STORAGE_USER_FIRST_TIME, 'false');
            await loadContracts(userAddress, props.network.kit, props);
            props.dispatch(setUserCeloInfo({
                address: userAddress,
                phoneNumber: dappkitResponse.phoneNumber,
                balance: cUSDBalance,
            }))
        } catch (error) {
            // Error saving data
            // log(error);
            setConnecting(false);
            navigation.goBack();
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
                onPress={() => login()}
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