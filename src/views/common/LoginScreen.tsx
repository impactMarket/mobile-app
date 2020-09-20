import { requestAccountAddress, waitForAccountAuth } from '@celo/dappkit';
import { useNavigation } from '@react-navigation/native';
import i18n from 'assets/i18n';
import { ethers } from 'ethers';
import * as Linking from 'expo-linking';
import { iptcColors } from 'helpers/index';
import {
    setPushNotificationsToken,
} from 'helpers/redux/actions/ReduxActions';
import {
    STORAGE_USER_ADDRESS,
    STORAGE_USER_PHONE_NUMBER,
    STORAGE_USER_FIRST_TIME,
    STORAGE_USER_AUTH_TOKEN,
} from 'helpers/types';
import { welcomeUser } from 'helpers/index';
import React, { useState } from 'react';
import { StyleSheet, Text, View, AsyncStorage, Alert } from 'react-native';
import { Button } from 'react-native-paper';
import { useStore } from 'react-redux';
import Api from 'services/api';
import { registerForPushNotifications } from 'services/pushNotifications';
import * as Device from 'expo-device';
import * as Localization from 'expo-localization';
import Web3 from 'web3';
import { newKitFromWeb3 } from '@celo/contractkit';
import config from '../../../config';

function LoginScreen() {
    const store = useStore();
    const navigation = useNavigation();
    const [connecting, setConnecting] = useState(false);

    const login = async () => {
        const requestId = 'login';
        const dappName = 'impactmarket';
        const callback = Linking.makeUrl('/login');
        setConnecting(true);

        const pushNotificationsToken = await registerForPushNotifications();

        requestAccountAddress({
            requestId,
            dappName,
            callback,
        });

        const dappkitResponse = await waitForAccountAuth(requestId);
        const userAddress = ethers.utils.getAddress(dappkitResponse.address);

        let language = Localization.locale;
        if (language.includes('-')) {
            language = language.substr(0, language.indexOf('-'));
        } else if (language.includes('_')) {
            language = language.substr(0, language.indexOf('_'));
        }

        const user = await Api.userAuth(
            userAddress,
            language,
            pushNotificationsToken
        );
        console.log(user);
        if (user === undefined) {
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
            await AsyncStorage.setItem(STORAGE_USER_AUTH_TOKEN, user.token);
            await AsyncStorage.setItem(STORAGE_USER_ADDRESS, userAddress);
            await AsyncStorage.setItem(
                STORAGE_USER_PHONE_NUMBER,
                dappkitResponse.phoneNumber
            );
            await AsyncStorage.setItem(STORAGE_USER_FIRST_TIME, 'false');

            const unsubscribe = store.subscribe(() => {
                const state = store.getState();
                if (state.user.celoInfo.address.length > 0) {
                    unsubscribe();
                    setConnecting(false);
                    navigation.goBack();
                    if (state.user.community.isBeneficiary) {
                        navigation.navigate('claim');
                    } else if (state.user.community.isManager) {
                        navigation.navigate('manage');
                    } else {
                        navigation.navigate('communities');
                    }
                }
            });
            await welcomeUser(
                userAddress,
                dappkitResponse.phoneNumber,
                user,
                newKitFromWeb3(new Web3(config.jsonRpc)),
                store as any
            );
            store.dispatch(setPushNotificationsToken(pushNotificationsToken));
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
        const androidURL =
            'https://play.google.com/store/apps/details?id=co.clabs.valora';
        const iosURL = 'https://apps.apple.com/app/id1520414263';
        if (Device.osName === 'Android') {
            return (
                <Button
                    mode="contained"
                    style={{
                        marginHorizontal: 10,
                        width: '40%',
                        backgroundColor: '#e9e9e9',
                    }}
                    onPress={() => Linking.openURL(androidURL)}
                >
                    <Text style={{ color: 'black' }}>Android</Text>
                </Button>
            );
        } else if (Device.osName === 'iOS') {
            return (
                <Button
                    mode="contained"
                    style={{
                        marginHorizontal: 10,
                        width: '40%',
                        backgroundColor: '#e9e9e9',
                    }}
                    onPress={() => Linking.openURL(iosURL)}
                >
                    <Text style={{ color: 'black' }}>iOS</Text>
                </Button>
            );
        }
        return (
            <>
                <Button
                    mode="contained"
                    style={{
                        marginHorizontal: 10,
                        width: '40%',
                        backgroundColor: '#e9e9e9',
                    }}
                    onPress={() => Linking.openURL(iosURL)}
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
                    onPress={() => Linking.openURL(androidURL)}
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

export default LoginScreen;
