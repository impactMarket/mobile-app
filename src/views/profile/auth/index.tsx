import { newKitFromWeb3 } from '@celo/contractkit';
import { requestAccountAddress, waitForAccountAuth } from '@celo/dappkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RouteProp, useNavigation } from '@react-navigation/native';
import countriesJSON from 'assets/countries.json';
import i18n, { supportedLanguages } from 'assets/i18n';
import Button from 'components/core/Button';
import renderHeader from 'components/core/HeaderBottomSheetTitle';
import * as Device from 'expo-device';
import * as Localization from 'expo-localization';
import {
    STORAGE_USER_ADDRESS,
    STORAGE_USER_AUTH_TOKEN,
    STORAGE_USER_PHONE_NUMBER,
} from 'helpers/constants';
import { makeDeeplinkUrl, welcomeUser } from 'helpers/index';
import { setPushNotificationListeners } from 'helpers/redux/actions/app';
import { setPushNotificationsToken } from 'helpers/redux/actions/auth';
import { IStoreCombinedActionsTypes } from 'helpers/types/redux';
import { IRootState } from 'helpers/types/state';
import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, Alert, Dimensions } from 'react-native';
import { Modalize } from 'react-native-modalize';
import { WebView } from 'react-native-webview';
import { useDispatch, useSelector, useStore } from 'react-redux';
import * as Sentry from 'sentry-expo';
import { analytics } from 'services/analytics';
import Api from 'services/api';
import CacheStore from 'services/cacheStore';
import {
    registerForPushNotifications,
    startNotificationsListeners,
} from 'services/pushNotifications';
import { ipctColors } from 'styles/index';
import Web3 from 'web3';

import config from '../../../../config';

const countries: {
    [key: string]: {
        name: string;
        native: string;
        phone: string;
        currency: string;
        languages: string[];
        emoji: string;
    };
} = countriesJSON;
function Auth() {
    const dispatch = useDispatch();
    const store = useStore<IRootState, IStoreCombinedActionsTypes>();
    const kit = useSelector((state: IRootState) => state.app.kit);
    const [connecting, setConnecting] = useState(false);
    const modalizeWelcomeRef = useRef<Modalize>(null);
    const modalizeWebViewRef = useRef<Modalize>(null);

    const login = async () => {
        const requestId = 'login';
        const dappName = 'impactMarket';
        const callback = makeDeeplinkUrl();
        setConnecting(true);

        const pushNotificationToken = await registerForPushNotifications();

        let userAddress = '';
        let dappkitResponse: any;
        try {
            requestAccountAddress({
                requestId,
                dappName,
                callback,
            });

            dappkitResponse = await waitForAccountAuth(requestId);
            userAddress = store
                .getState()
                .app.kit.web3.utils.toChecksumAddress(dappkitResponse.address);
        } catch (e) {
            Sentry.Native.captureException(e);
            analytics('login', { device: Device.brand, success: 'false' });
            Alert.alert(
                i18n.t('failure'),
                i18n.t('errorConnectToValora'),
                [{ text: i18n.t('close') }],
                { cancelable: false }
            );
            setConnecting(false);
            return;
        }

        let language = Localization.locale;
        if (language.includes('-')) {
            language = language.substr(0, language.indexOf('-'));
        } else if (language.includes('_')) {
            language = language.substr(0, language.indexOf('_'));
        }
        if (!supportedLanguages.includes(language)) {
            language = 'en';
        }
        let currency = '';
        for (const [, value] of Object.entries(countries)) {
            if (
                value.phone ===
                dappkitResponse.phoneNumber.slice(1, value.phone.length + 1)
            ) {
                currency = value.currency;
                break;
            }
        }

        const user = await Api.user.auth(
            userAddress,
            language,
            currency,
            pushNotificationToken,
            dappkitResponse.phoneNumber
        );

        if (user === undefined) {
            // TODO: needs to be improved
            // Sentry.Native.captureMessage(
            //     JSON.stringify({ action: 'login', details: 'undefined user' }),
            //     Sentry.Native.Severity.Critical
            // );
            analytics('login', { device: Device.brand, success: 'false' });

            Alert.alert(
                i18n.t('failure'),
                i18n.t('anErroHappenedTryAgain'),
                [{ text: i18n.t('close') }],
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
            await CacheStore.cacheUser(user.user);

            await welcomeUser(
                userAddress,
                dappkitResponse.phoneNumber,
                user,
                store.getState().app.exchangeRates,
                newKitFromWeb3(new Web3(config.jsonRpc)),
                dispatch,
                user.user
            );
            dispatch(setPushNotificationsToken(pushNotificationToken));
            setPushNotificationListeners(
                startNotificationsListeners(kit, dispatch)
            );
            analytics('login', { device: Device.brand, success: 'true' });
        } catch (error) {
            analytics('login', { device: Device.brand, success: 'false' });
            // TODO: improve this
            // Sentry.Native.captureMessage(
            //     JSON.stringify({
            //         action: 'login',
            //         details: `config user - ${error.message}`,
            //     }),
            //     Sentry.Native.Severity.Critical
            // );

            Alert.alert(
                i18n.t('failure'),
                i18n.t('anErroHappenedTryAgain'),
                [{ text: i18n.t('close') }],
                { cancelable: false }
            );
            setConnecting(false);
        }
    };

    const buttonStoreLink = () => {
        return (
            <Button
                modeType="default"
                bold
                style={{ width: '100%' }}
                labelStyle={styles.buttomStoreText}
                onPress={() => {
                    modalizeWebViewRef.current?.open();
                    modalizeWelcomeRef.current?.close();
                }}
            >
                <Text style={styles.buttomStoreText}>
                    {i18n.t('installAndCreateValoraAccount')}
                </Text>
            </Button>
        );
    };

    modalizeWelcomeRef.current?.open();

    return (
        <>
            <Modalize
                ref={modalizeWelcomeRef}
                HeaderComponent={renderHeader(
                    i18n.t('connectWithValora'),
                    modalizeWelcomeRef,
                    () => {}
                )}
                adjustToContentHeight
            >
                <View
                    style={{
                        height: Dimensions.get('screen').height * 0.6,
                    }}
                >
                    <View style={{ width: '100%', paddingHorizontal: 16 }}>
                        <Text style={styles.descriptionTop}>
                            {i18n.t('impactMarketDescription')}
                        </Text>
                        <Text style={styles.description}>
                            {i18n.t('loginDescription')}
                        </Text>
                    </View>
                    <View style={{ width: '100%', paddingHorizontal: 31 }}>
                        <Text style={styles.stepText1}>{i18n.t('step1')}</Text>
                        <View style={{ width: '100%', marginTop: 16 }}>
                            {buttonStoreLink()}
                        </View>
                        <Text style={styles.stepText2}>{i18n.t('step2')}</Text>
                        <Button
                            modeType="green"
                            bold
                            onPress={() => login()}
                            loading={connecting}
                            style={{ width: '100%', marginTop: 16 }}
                            labelStyle={styles.buttomConnectValoraText}
                        >
                            {i18n.t('connectWithValora')}
                        </Button>
                    </View>
                </View>
            </Modalize>

            <Modalize
                ref={modalizeWebViewRef}
                HeaderComponent={renderHeader(
                    '',
                    modalizeWebViewRef,
                    () => modalizeWelcomeRef.current?.open(),
                    true
                )}
                adjustToContentHeight
            >
                <WebView
                    originWhitelist={['*']}
                    source={{ uri: 'https://valoraapp.com/' }}
                    style={{ height: Dimensions.get('screen').height * 0.7 }}
                />
            </Modalize>
        </>
    );
}

Auth.navigationOptions = ({ route }: { route: RouteProp<any, any> }) => {
    return {
        headerShown: false,
    };
};

export default Auth;

const styles = StyleSheet.create({
    mainView: {
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingBottom: 38,
    },
    buttomStoreText: {
        fontSize: 14,
        lineHeight: 20,
        color: ipctColors.white,
        fontFamily: 'Manrope-Bold',
        fontWeight: '700',
    },
    buttomConnectValoraText: {
        fontSize: 14,
        lineHeight: 20,
        color: ipctColors.white,
        fontFamily: 'Manrope-Bold',
        fontWeight: '700',
    },
    title: {
        fontFamily: 'Gelion-Bold',
        fontSize: 30,
        lineHeight: 31,
        letterSpacing: 0.7,
        textAlign: 'center',
        color: ipctColors.almostBlack,
        marginTop: 16,
    },
    descriptionTop: {
        fontFamily: 'Manrope-Bold',
        fontSize: 16,
        fontWeight: '800',
        lineHeight: 24,
        textAlign: 'left',
        color: ipctColors.darBlue,
        marginTop: 8,
    },
    description: {
        fontFamily: 'Inter-Regular',
        fontSize: 15,
        fontWeight: '400',
        lineHeight: 24,
        textAlign: 'left',
        color: ipctColors.darBlue,
        marginTop: 8,
        marginBottom: 73,
    },
    stepText1: {
        fontFamily: 'Manrope-Bold',
        fontSize: 14,
        fontWeight: '800',
        lineHeight: 24,
        textAlign: 'left',
        color: ipctColors.darBlue,
    },
    stepText2: {
        fontFamily: 'Manrope-Bold',
        fontSize: 14,
        fontWeight: '800',
        lineHeight: 24,
        textAlign: 'left',
        color: ipctColors.darBlue,
        marginTop: 22,
    },
    instructionText: {
        fontFamily: 'Gelion-Regular',
        fontSize: 19,
        lineHeight: 23,
        textAlign: 'center',
        color: ipctColors.nileBlue,
        marginTop: 8,
    },
});
