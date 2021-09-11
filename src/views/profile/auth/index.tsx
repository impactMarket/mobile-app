import { newKitFromWeb3 } from '@celo/contractkit';
import { requestAccountAddress, waitForAccountAuth } from '@celo/dappkit';
import { AccountAuthResponseSuccess } from '@celo/utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n, { supportedLanguages } from 'assets/i18n';
import Button from 'components/core/Button';
import Card from 'components/core/Card';
import renderHeader from 'components/core/HeaderBottomSheetTitle';
import CloseStorySvg from 'components/svg/CloseStorySvg';
import * as Device from 'expo-device';
import * as Linking from 'expo-linking';
import * as Localization from 'expo-localization';
import {
    STORAGE_USER_ADDRESS,
    STORAGE_USER_AUTH_TOKEN,
    STORAGE_USER_PHONE_NUMBER,
} from 'helpers/constants';
import {
    getCurrencyFromPhoneNumber,
    makeDeeplinkUrl,
    welcomeUser,
} from 'helpers/index';
import {
    setOpenAuthModal,
    setPushNotificationListeners,
} from 'helpers/redux/actions/app';
import {
    addUserAuthToStateRequest,
    setPushNotificationsToken,
    userAuthToStateReset,
} from 'helpers/redux/actions/auth';
import { IRootState } from 'helpers/types/state';
import React, { useState, useRef, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    TouchableOpacity,
} from 'react-native';
import { Modalize } from 'react-native-modalize';
import { Portal, Modal } from 'react-native-paper';
import { WebView } from 'react-native-webview';
import { useDispatch, useSelector } from 'react-redux';
import * as Sentry from 'sentry-expo';
import CacheStore from 'services/cacheStore';
import {
    registerForPushNotifications,
    startNotificationsListeners,
} from 'services/pushNotifications';
import { ipctColors } from 'styles/index';
import Web3 from 'web3';

import config from '../../../../config';

function Auth() {
    const dispatch = useDispatch();

    const kit = useSelector((state: IRootState) => state.app.kit);
    const userAuthState = useSelector((state: IRootState) => state.auth);
    // const refreshing = useSelector(
    //     (state: IRootState) => state.auth.refreshing
    // );

    const exchangeRates = useSelector(
        (state: IRootState) => state.app.exchangeRates
    );
    const authModalOpen = useSelector(
        (state: IRootState) => state.app.authModalOpen
    );
    const [dappKitResponse, setDappKitResponse] = useState<
        AccountAuthResponseSuccess | undefined
    >(undefined);
    const [timedOut, setTimedOut] = useState(false);
    const [connecting, setConnecting] = useState(false);
    const [toggleWarn, setToggleWarn] = useState(false);
    const [timedOutValidation, setTimedOutValidation] = useState(false);

    const [, setLoadRefs] = useState(false);
    const modalizeDuplicatedAccountsRef = useRef<Modalize>(null);
    const modalizeDeleteAccountsRef = useRef<Modalize>(null);
    const modalizeWelcomeRef = useRef<Modalize>(null);
    const modalizeWebViewRef = useRef<Modalize>(null);
    const modalizeHelpCenterRef = useRef<Modalize>(null);

    // i don't like. We must do it differently when replacing the header
    useEffect(() => {
        if (timedOutValidation && !toggleWarn) {
            setTimedOut(true);
            modalizeWelcomeRef.current.close();
        }
    }, [timedOutValidation, toggleWarn]);

    useEffect(() => {
        if (modalizeWelcomeRef.current !== null) {
            if (authModalOpen) {
                modalizeWelcomeRef.current.open();
            } else {
                modalizeWelcomeRef.current.close();
            }
        }
    }, [authModalOpen]);

    useEffect(() => {
        const finishAuth = async () => {
            const user = userAuthState.user;

            const { phoneNumber, address } = dappKitResponse;
            const userAddress = kit.web3.utils.toChecksumAddress(address);

            await AsyncStorage.setItem(STORAGE_USER_AUTH_TOKEN, user.token);
            await AsyncStorage.setItem(STORAGE_USER_ADDRESS, userAddress);
            await AsyncStorage.setItem(STORAGE_USER_PHONE_NUMBER, phoneNumber);
            await CacheStore.cacheUser({
                ...user.user,
                avatar: user.user.avatar ? (user.user.avatar as any).url : null, // TODO: avoid this
            });

            await welcomeUser(
                userAddress,
                phoneNumber,
                user,
                exchangeRates,
                newKitFromWeb3(new Web3(config.jsonRpc)),
                dispatch,
                user.user
            );
            dispatch(setOpenAuthModal(false));
            dispatch(userAuthToStateReset());
            setConnecting(false);
        };

        if (userAuthState.user !== undefined) {
            if (dappKitResponse !== undefined) {
                finishAuth();
            }
        } else if (
            userAuthState.error !== undefined &&
            userAuthState.error.indexOf('associated with another account') !==
                -1
        ) {
            modalizeDuplicatedAccountsRef.current.open();
            modalizeWelcomeRef.current.close();
            setToggleWarn(true);
            setConnecting(false);
            dispatch(userAuthToStateReset());
        } else if (
            userAuthState.error !== undefined &&
            userAuthState.error.indexOf('in deletion process') !== -1
        ) {
            modalizeDeleteAccountsRef.current.open();
            modalizeWelcomeRef.current.close();
            setToggleWarn(true);
            setConnecting(false);
            dispatch(userAuthToStateReset());
        }
    }, [userAuthState, dappKitResponse, dispatch, exchangeRates, kit]);

    const apiAuthRequest = async (props: {
        response?: AccountAuthResponseSuccess;
        overwrite?: boolean;
        recover?: boolean;
    }) => {
        const { response, overwrite, recover } = props;
        let language = Localization.locale;
        if (language.includes('-')) {
            language = language.substr(0, language.indexOf('-'));
        } else if (language.includes('_')) {
            language = language.substr(0, language.indexOf('_'));
        }
        if (!supportedLanguages.includes(language)) {
            language = 'en';
        }
        let _dappkitResponse: AccountAuthResponseSuccess;
        if (response === undefined) {
            _dappkitResponse = dappKitResponse;
        } else {
            _dappkitResponse = response;
        }
        const { phoneNumber, address } = _dappkitResponse;
        const currency = getCurrencyFromPhoneNumber(phoneNumber);
        const pushNotificationToken = await registerForPushNotifications();
        if (pushNotificationToken) {
            dispatch(setPushNotificationsToken(pushNotificationToken));
            setPushNotificationListeners(
                startNotificationsListeners(kit, dispatch)
            );
        }
        const userAddress = kit.web3.utils.toChecksumAddress(address);

        dispatch(
            addUserAuthToStateRequest({
                address: userAddress,
                language,
                currency,
                phone: phoneNumber,
                pushNotificationToken,
                overwrite,
                recover,
            })
        );
    };

    const login = async () => {
        const requestId = 'login';
        const dappName = 'impactMarket';
        const callback = makeDeeplinkUrl();
        setConnecting(true);

        let _dappkitResponse: AccountAuthResponseSuccess;

        // celloWallet interaction
        try {
            requestAccountAddress({
                requestId,
                dappName,
                callback,
            });

            await Promise.race([
                waitForAccountAuth(requestId).then((response) => {
                    setDappKitResponse(response);
                    _dappkitResponse = response;
                }),
                // (async () => {
                //     await new Promise((res) => setTimeout(res, 10000)).then(
                //         () => {
                //             // TODO: this generates a "state update on an unmounted component". Needs fix.
                //             setTimedOutValidation(true);
                //         }
                //     );
                // })(),
            ]);
        } catch (e) {
            Sentry.Native.withScope((scope) => {
                scope.setTag('ipct-activity', 'auth');
                Sentry.Native.captureException(e);
            });
            setTimedOut(true);
            return;
        }
        await apiAuthRequest({ response: _dappkitResponse });
    };

    const buttonStoreLink = () => {
        const androidURL =
            'https://play.google.com/store/apps/details?id=co.clabs.valora';
        const iosURL = 'https://apps.apple.com/app/id1520414263';
        if (Device.osName === 'Android') {
            return (
                <Button
                    modeType="default"
                    bold
                    style={{ width: '100%' }}
                    labelStyle={styles.buttomStoreText}
                    onPress={() => Linking.openURL(androidURL)}
                >
                    <Text style={styles.buttomStoreText}>
                        {i18n.t('auth.installAndCreateValoraAccount')}
                    </Text>
                </Button>
            );
        } else if (Device.osName === 'iOS') {
            return (
                <Button
                    modeType="default"
                    bold
                    style={{ width: '100%' }}
                    labelStyle={styles.buttomStoreText}
                    onPress={() => Linking.openURL(iosURL)}
                >
                    <Text style={styles.buttomStoreText}>
                        {i18n.t('auth.installAndCreateValoraAccount')}
                    </Text>
                </Button>
            );
        }
        return (
            <>
                <Button
                    modeType="default"
                    bold
                    style={{ width: '100%', marginBottom: 16 }}
                    labelStyle={styles.buttomStoreText}
                    onPress={() => Linking.openURL(iosURL)}
                >
                    <Text style={styles.buttomStoreText}>iOS</Text>
                </Button>
                <Button
                    modeType="default"
                    bold
                    style={{ width: '100%' }}
                    labelStyle={styles.buttomStoreText}
                    onPress={() => Linking.openURL(androidURL)}
                >
                    <Text style={styles.buttomStoreText}>Android</Text>
                </Button>
            </>
        );
    };

    const handleCloseErrorModal = () => {
        setTimedOut(false);
        // navigation.navigate(Screens.Communities);
    };

    return (
        <Portal>
            <Modalize
                ref={modalizeHelpCenterRef}
                HeaderComponent={renderHeader(
                    null,
                    modalizeHelpCenterRef,
                    () => modalizeWelcomeRef.current?.open(),
                    true
                )}
                adjustToContentHeight
            >
                <WebView
                    originWhitelist={['*']}
                    source={{
                        uri:
                            'https://docs.impactmarket.com/general/others#app-is-out-of-date',
                    }}
                    style={{
                        height: Dimensions.get('screen').height * 0.85,
                    }}
                />
            </Modalize>
            <Modalize
                ref={modalizeWelcomeRef}
                HeaderComponent={renderHeader(
                    i18n.t('auth.connectWithValora'),
                    modalizeWelcomeRef,
                    () => {
                        // navigation.navigate(Screens.Communities);
                        dispatch(setOpenAuthModal(false));
                        setConnecting(false);
                    }
                )}
                adjustToContentHeight
                onClose={() => {
                    // navigation.navigate(Screens.Communities);
                    dispatch(setOpenAuthModal(false));
                    setConnecting(false);
                }}
            >
                <View style={{ width: '100%', paddingHorizontal: 22 }}>
                    <Text style={styles.descriptionTop}>
                        {i18n.t('auth.impactMarketDescription')}
                    </Text>
                    <Text style={styles.description}>
                        {i18n.t('auth.loginDescription')}
                    </Text>
                </View>
                <View
                    style={{
                        width: '100%',
                        paddingHorizontal: 21,
                        marginBottom: 22,
                    }}
                >
                    <Text style={styles.stepText1}>{i18n.t('auth.step1')}</Text>
                    <View style={{ width: '100%', marginTop: 16 }}>
                        {buttonStoreLink()}
                    </View>
                    <TouchableOpacity
                        onPress={() => modalizeWebViewRef.current?.open()}
                    >
                        <Text style={styles.whatIsValora}>
                            {i18n.t('auth.whatIsValora')}
                        </Text>
                    </TouchableOpacity>
                    <Text style={styles.stepText2}>{i18n.t('auth.step2')}</Text>
                    <Button
                        modeType="green"
                        bold
                        onPress={login}
                        loading={connecting || userAuthState.refreshing}
                        disabled={connecting || userAuthState.refreshing}
                        style={{ width: '100%', marginTop: 16 }}
                        labelStyle={styles.buttomConnectValoraText}
                    >
                        {i18n.t('auth.connectWithValora')}
                    </Button>
                </View>
            </Modalize>
            <Modalize
                ref={modalizeDuplicatedAccountsRef}
                HeaderComponent={renderHeader(
                    i18n.t('auth.duplicatedTitle'),
                    modalizeDuplicatedAccountsRef,
                    () => {
                        // navigation.navigate(Screens.Communities);
                    }
                )}
                adjustToContentHeight
                onClose={() => {
                    // navigation.navigate(Screens.Communities);
                }}
            >
                <View style={{ width: '100%', paddingHorizontal: 22 }}>
                    <Text style={styles.descriptionTop}>
                        {i18n.t(
                            'auth.duplicatedMsg1',
                            dappKitResponse ? dappKitResponse.phoneNumber : ''
                        )}
                    </Text>
                    <Text style={styles.description}>
                        {i18n.t('auth.duplicatedMsg2')}
                    </Text>
                    <Text style={styles.description}>
                        {i18n.t('auth.duplicatedMsg3')}
                    </Text>
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginBottom: 18,
                        }}
                    >
                        <Button
                            modeType="gray"
                            style={{ width: '45%' }}
                            onPress={() =>
                                modalizeDuplicatedAccountsRef.current.close()
                            }
                            disabled={connecting}
                        >
                            {i18n.t('generic.dismiss')}
                        </Button>
                        <Button
                            modeType="default"
                            style={{ width: '45%' }}
                            onPress={() => {
                                setConnecting(true);
                                apiAuthRequest({ overwrite: true });
                            }}
                            loading={connecting}
                            disabled={connecting}
                        >
                            {i18n.t('generic.yes')}
                        </Button>
                    </View>
                </View>
            </Modalize>
            <Modalize
                ref={modalizeDeleteAccountsRef}
                HeaderComponent={renderHeader(
                    i18n.t('auth.welcomeBack'),
                    modalizeDeleteAccountsRef,
                    () => {
                        // navigation.navigate(Screens.Communities);
                    }
                )}
                adjustToContentHeight
                onClose={() => {
                    // navigation.navigate(Screens.Communities);
                }}
            >
                <View style={{ width: '100%', paddingHorizontal: 22 }}>
                    <Text style={styles.description}>
                        {i18n.t('auth.recoverMsg1')}
                    </Text>
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginBottom: 18,
                        }}
                    >
                        <Button
                            modeType="gray"
                            style={{ width: '45%' }}
                            onPress={() =>
                                modalizeDeleteAccountsRef.current.close()
                            }
                            disabled={connecting}
                        >
                            {i18n.t('generic.dismiss')}
                        </Button>
                        <Button
                            modeType="default"
                            style={{ width: '45%' }}
                            onPress={() => {
                                setConnecting(true);
                                apiAuthRequest({ recover: true });
                            }}
                            loading={connecting}
                            disabled={connecting}
                        >
                            {i18n.t('auth.recover')}
                        </Button>
                    </View>
                </View>
            </Modalize>
            <Modalize
                ref={modalizeWebViewRef}
                HeaderComponent={renderHeader(
                    null,
                    modalizeWebViewRef,
                    () => modalizeWelcomeRef.current?.open(),
                    true
                )}
                adjustToContentHeight
            >
                <WebView
                    originWhitelist={['*']}
                    source={{ uri: 'https://valoraapp.com/' }}
                    style={{
                        height: Dimensions.get('screen').height * 0.85,
                    }}
                />
            </Modalize>
            <Modal visible={timedOut} dismissable={false}>
                <Card style={styles.timedOutCard}>
                    <View style={styles.timedOutCardContent}>
                        <Text style={styles.timedOutCardText}>
                            {i18n.t('errors.modals.valora.title')}
                        </Text>
                        <CloseStorySvg
                            onPress={() => handleCloseErrorModal()}
                        />
                    </View>
                    <View style={styles.timedOutCardDescriptionContainer}>
                        <Text style={styles.timedOutCardDescription}>
                            {i18n.t('errors.modals.valora.description')}
                        </Text>
                    </View>
                    <View style={styles.timedOutCardButtons}>
                        <Button
                            modeType="gray"
                            style={{ flex: 1, marginRight: 5 }}
                            onPress={() => handleCloseErrorModal()}
                        >
                            {i18n.t('generic.close')}
                        </Button>
                        <Button
                            modeType="default"
                            style={{ flex: 1, marginLeft: 5 }}
                            onPress={() => {
                                modalizeHelpCenterRef.current?.open();
                                setTimedOut(false);
                            }}
                        >
                            {i18n.t('generic.faq')}
                        </Button>
                    </View>
                </Card>
            </Modal>
        </Portal>
    );
}

export default Auth;

const styles = StyleSheet.create({
    timedOutCard: {
        marginHorizontal: 22,
        borderRadius: 12,
        paddingHorizontal: 22,
        paddingVertical: 16,
    },
    timedOutCardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 13.5,
    },
    timedOutCardText: {
        fontFamily: 'Manrope-Bold',
        fontSize: 18,
        lineHeight: 20,
        textAlign: 'left',
    },
    timedOutCardButtons: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
    },
    timedOutCardDescription: {
        fontFamily: 'Inter-Regular',
        fontSize: 14,
        lineHeight: 24,
        color: ipctColors.almostBlack,
    },
    timedOutCardDescriptionContainer: {
        width: '100%',
        flexDirection: 'row',
        marginBottom: 16,
    },
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
        marginBottom: 28,
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
    },
    whatIsValora: {
        fontFamily: 'Inter-Regular',
        fontSize: 15,
        fontWeight: '400',
        lineHeight: 28,
        textAlign: 'center',
        color: ipctColors.blueRibbon,
        marginTop: 24,
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
