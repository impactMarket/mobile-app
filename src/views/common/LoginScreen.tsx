import { requestAccountAddress, waitForAccountAuth } from '@celo/dappkit';
import { useNavigation } from '@react-navigation/native';
import i18n from 'assets/i18n';
import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import * as Linking from 'expo-linking';
import { loadContracts, iptcColors } from 'helpers/index';
import {
    setUserCeloInfo,
    setPushNotificationsToken,
} from 'helpers/redux/actions/ReduxActions';
import {
    STORAGE_USER_ADDRESS,
    STORAGE_USER_PHONE_NUMBER,
    STORAGE_USER_FIRST_TIME,
    IRootState,
    STORAGE_USER_AUTH_TOKEN,
} from 'helpers/types';
import React, { useState } from 'react';
import { StyleSheet, Text, View, AsyncStorage, Alert } from 'react-native';
import { Button } from 'react-native-paper';
import { ConnectedProps, connect, useStore } from 'react-redux';
import Api from 'services/api';
import { registerForPushNotifications } from 'services/pushNotifications';
import * as Device from 'expo-device';

const mapStateToProps = (state: IRootState) => {
    const { user, app } = state;
    return { user, app };
};
const connector = connect(mapStateToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux;

function LoginScreen(props: Props) {
    const store = useStore();
    const navigation = useNavigation();
    const [connecting, setConnecting] = useState(false);

    const getCurrentUserBalance = async (address: string) => {
        const stableToken = await props.app.kit.contracts.getStableToken();

        const [cUSDBalanceBig, cUSDDecimals] = await Promise.all([
            stableToken.balanceOf(address),
            stableToken.decimals(),
        ]);
        const decimals = new BigNumber(10).pow(cUSDDecimals).toString();
        const cUSDBalance = cUSDBalanceBig.div(decimals).toFixed(2);
        return cUSDBalance;
    };

    const login = async () => {
        const requestId = 'login';
        const dappName = 'impactMarket';
        const callback = Linking.makeUrl('/login');
        setConnecting(true);

        requestAccountAddress({
            requestId,
            dappName,
            callback,
        });

        const dappkitResponse = await waitForAccountAuth(requestId);
        const userAddress = ethers.utils.getAddress(dappkitResponse.address);
        const authToken = await Api.userAuth(
            userAddress,
            Device.osInternalBuildId!
        );
        if (authToken === undefined) {
            Alert.alert(
                i18n.t('failure'),
                i18n.t('anErroHappenedTryAgain'),
                [{ text: 'OK' }],
                { cancelable: false }
            );
            setConnecting(false);
            return;
        }
        try {
            const cUSDBalance = await getCurrentUserBalance(userAddress);
            //
            await AsyncStorage.setItem(STORAGE_USER_AUTH_TOKEN, authToken);
            await AsyncStorage.setItem(STORAGE_USER_ADDRESS, userAddress);
            await AsyncStorage.setItem(
                STORAGE_USER_PHONE_NUMBER,
                dappkitResponse.phoneNumber
            );
            await AsyncStorage.setItem(STORAGE_USER_FIRST_TIME, 'false');
            const is = await loadContracts(userAddress, props.app.kit, props);
            const unsubscribe = store.subscribe(() => {
                const state = store.getState();
                if (state.user.celoInfo.address.length > 0) {
                    unsubscribe();
                    setConnecting(false);
                    navigation.goBack();
                    if(is === 1) {
                        navigation.navigate(i18n.t('claim'));
                    } else if(is === 0) {
                        navigation.navigate(i18n.t('manage'));
                    } else {
                        navigation.navigate(i18n.t('communities'));
                    }
                }
            });
            props.dispatch(
                setUserCeloInfo({
                    address: userAddress,
                    phoneNumber: dappkitResponse.phoneNumber,
                    balance: cUSDBalance,
                })
            );
            const pushNotificationsToken = await registerForPushNotifications();
            if (pushNotificationsToken === undefined) {
                Alert.alert(
                    i18n.t('failure'),
                    i18n.t('anErroHappenedTryAgain'),
                    [{ text: 'OK' }],
                    { cancelable: false }
                );
                setConnecting(false);
                return;
            }
            Api.setUserPushNotificationToken(
                userAddress,
                pushNotificationsToken
            );
            props.dispatch(setPushNotificationsToken(pushNotificationsToken));
        } catch (error) {
            Alert.alert(
                i18n.t('failure'),
                i18n.t('anErroHappenedTryAgain'),
                [{ text: 'OK' }],
                { cancelable: false }
            );
            setConnecting(false);
        }
    };

    const buttonStoreLink = () => {
        if (Device.osName === 'Android') {
            return (
                <Button
                    mode="contained"
                    style={{
                        marginHorizontal: 10,
                        width: '40%',
                        backgroundColor: '#e9e9e9',
                    }}
                    onPress={() => Linking.openURL('https://impactmarket.com/')}
                >
                    <Text style={{ color: 'black' }}>Android</Text>
                </Button>
            );
        } else if (Device.osName === 'iOS') {
            return (
                <Button
                    mode="contained"
                    disabled
                    style={{ marginHorizontal: 10, width: '40%' }}
                >
                    iOS
                </Button>
            );
        }
        return (
            <>
                <Button
                    mode="contained"
                    disabled
                    style={{ marginHorizontal: 10, width: '40%' }}
                >
                    iOS
                </Button>
                <Button
                    mode="contained"
                    style={{
                        marginHorizontal: 10,
                        width: '40%',
                        backgroundColor: '#e9e9e9',
                    }}
                    onPress={() => Linking.openURL('https://impactmarket.com/')}
                >
                    <Text style={{ color: 'black' }}>Android</Text>
                </Button>
            </>
        );
    };

    return (
        <View style={styles.mainView}>
            <Text style={styles.description}>{i18n.t('toContinuePlease')}</Text>
            <Text style={styles.title}>
                {i18n.t('connectToYourCeloWallet')}
            </Text>
            <Text style={styles.description}>
                {i18n.t('loginDescription1')}
            </Text>
            <Text style={styles.description}>
                {i18n.t('loginDescription2')}
            </Text>
            <Text style={styles.stepText}>{i18n.t('step1')}</Text>
            <Text style={styles.instructionText}>
                {i18n.t('downloadCeloApp')}
            </Text>
            <View
                style={{
                    flexDirection: 'row',
                }}
            >
                {buttonStoreLink()}
            </View>
            <Text style={styles.stepText}>{i18n.t('step2')}</Text>
            <Text style={styles.instructionText}>
                {i18n.t('installCeloCreateAccount')}
            </Text>
            <Text style={styles.stepText}>{i18n.t('finalStep')}</Text>
            <Button
                mode="contained"
                onPress={() => login()}
                disabled={connecting}
                loading={connecting}
                style={{
                    width: '80%',
                    backgroundColor: iptcColors.greenishTeal,
                }}
            >
                {i18n.t('connectCeloWallet')}
            </Button>
            <Button
                mode="contained"
                onPress={() => navigation.goBack()}
                disabled={connecting}
                style={{ width: '80%', backgroundColor: '#e9e9e9' }}
            >
                <Text style={{ color: 'black' }}>{i18n.t('notNow')}</Text>
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginHorizontal: 10,
        marginVertical: 20,
    },
    title: {
        height: 62,
        fontFamily: 'Gelion-Bold',
        fontSize: 30,
        fontWeight: 'bold',
        fontStyle: 'normal',
        lineHeight: 31,
        letterSpacing: 0.7,
        textAlign: 'center',
        color: '#1e3252',
    },
    description: {
        fontFamily: 'Gelion-Regular',
        fontSize: 19,
        fontWeight: 'normal',
        fontStyle: 'normal',
        letterSpacing: 0,
        textAlign: 'center',
        color: '#8898aa',
    },
    stepText: {
        fontFamily: 'Gelion-Bold',
        fontSize: 19,
        fontWeight: 'bold',
        fontStyle: 'normal',
        letterSpacing: 0,
        textAlign: 'center',
        color: '#172b4d',
    },
    instructionText: {
        height: 23,
        fontFamily: 'Gelion-Regular',
        fontSize: 19,
        fontWeight: 'normal',
        fontStyle: 'normal',
        letterSpacing: 0,
        textAlign: 'center',
        color: '#172b4d',
    },
});

export default connector(LoginScreen);
