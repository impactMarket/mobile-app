import { newKitFromWeb3 } from '@celo/contractkit';
import { requestAccountAddress, waitForAccountAuth } from '@celo/dappkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    RouteProp,
    useNavigation,
    useFocusEffect,
} from '@react-navigation/native';
import i18n, { supportedLanguages } from 'assets/i18n';
import Button from 'components/core/Button';
import Card from 'components/core/Card';
import renderHeader from 'components/core/HeaderBottomSheetTitle';
import CloseStorySvg from 'components/svg/CloseStorySvg';
import * as Device from 'expo-device';
import * as Linking from 'expo-linking';
import * as Localization from 'expo-localization';
import {
    Screens,
    STORAGE_USER_ADDRESS,
    STORAGE_USER_AUTH_TOKEN,
    STORAGE_USER_PHONE_NUMBER,
} from 'helpers/constants';
import {
    getCurrencyFromPhoneNumber,
    makeDeeplinkUrl,
    welcomeUser,
} from 'helpers/index';
import { setPushNotificationListeners } from 'helpers/redux/actions/app';
import { setPushNotificationsToken } from 'helpers/redux/actions/auth';
import { IRootState } from 'helpers/types/state';
import React, { useState, useRef } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    TouchableOpacity,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Modalize } from 'react-native-modalize';
import { Portal, Modal } from 'react-native-paper';
import { WebView } from 'react-native-webview';
import { useDispatch, useSelector } from 'react-redux';
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
function Auth() {
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const kit = useSelector((state: IRootState) => state.app.kit);
    // const user = useSelector((state: IRootState) => state.auth.user);
    // const refreshing = useSelector(
    //     (state: IRootState) => state.auth.refreshing
    // );

    const exchangeRates = useSelector(
        (state: IRootState) => state.app.exchangeRates
    );
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [timedOut, setTimedOut] = useState(false);
    const [connecting, setConnecting] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const [, setLoadRefs] = useState(false);
    const modalizeWelcomeRef = useRef<Modalize>(null);
    const modalizeWebViewRef = useRef<Modalize>(null);
    const modalizeHelpCenterRef = useRef<Modalize>(null);

    useFocusEffect(() => {
        renderAuthModalize();
    });

    const getUser = async (
        userAddress: string,
        language: string,
        currency: string,
        phoneNumber: string,
        pushNotificationToken: string
    ) =>
        await Api.user.auth(
            userAddress,
            language,
            currency,
            phoneNumber,
            pushNotificationToken
        );

    const login = async () => {
        const requestId = 'login';
        const dappName = 'impactMarket';
        const callback = makeDeeplinkUrl();
        setConnecting(true);

        const pushNotificationToken = await registerForPushNotifications();

        let userAddress = '';

        // celloWallet interaction
        try {
            requestAccountAddress({
                requestId,
                dappName,
                callback,
            });

            await Promise.race([
                waitForAccountAuth(requestId).then((dappkitResponse) => {
                    userAddress = kit.web3.utils.toChecksumAddress(
                        dappkitResponse.address
                    );
                    setPhoneNumber(dappkitResponse.phoneNumber);
                }),
                (async () => {
                    await new Promise((res) => setTimeout(res, 10000)).then(
                        () => {
                            setTimedOut(true);
                        }
                    );
                })(),
            ]);
        } catch (e) {
            Sentry.Native.captureException(e);
            setTimedOut(true);
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
        const currency = getCurrencyFromPhoneNumber(phoneNumber);
        /** Although all the SAGA structure is created, we would need to subscribe to the store just to 'wait' 
         * for the user to be authenticated. Using promise in this case, lead us to a more direct and independent approach.
         * Note. I am leaving the structure in place but disabled just in case we change authentication methhods in the future.
         * 
        dispatch(
            addUserAuthToStateRequest(
                userAddress,
                language,
                currency,
                dappkitResponse.phoneNumber,
                pushNotificationToken
            )
        );
        **/
        getUser(
            userAddress,
            language,
            currency,
            phoneNumber,
            pushNotificationToken
        )
            .then(async (user) => {
                if (user === undefined) {
                    analytics('login', {
                        device: Device.brand,
                        success: 'false',
                    });
                    await new Promise((res) => setTimeout(res, 5000)).then(
                        () => {
                            modalizeWelcomeRef.current.close();
                            setTimedOut(true);
                        }
                    );
                    throw new Error('user is undefined');
                }
                setRefreshing(true);
                await AsyncStorage.setItem(STORAGE_USER_AUTH_TOKEN, user.token);
                await AsyncStorage.setItem(STORAGE_USER_ADDRESS, userAddress);
                await AsyncStorage.setItem(
                    STORAGE_USER_PHONE_NUMBER,
                    phoneNumber
                );
                await CacheStore.cacheUser({
                    ...user.user,
                    avatar: user.user.avatar
                        ? (user.user.avatar as any).url
                        : null, // TODO: avoid this
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
                if (pushNotificationToken) {
                    dispatch(setPushNotificationsToken(pushNotificationToken));
                    setPushNotificationListeners(
                        startNotificationsListeners(kit, dispatch)
                    );
                }
                analytics('login', {
                    device: Device.brand,
                    success: 'true',
                });
                setRefreshing(false);
            })
            .catch((e) => {
                Sentry.Native.captureException(e);

                setTimedOut(true);
                setConnecting(false);
                setRefreshing(false);
            });
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
                        {i18n.t('installAndCreateValoraAccount')}
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
                        {i18n.t('installAndCreateValoraAccount')}
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

    const renderAuthModalize = () => {
        if (modalizeWelcomeRef.current === null) {
            setTimeout(() => {
                setLoadRefs(true);
            }, 100);
        } else {
            modalizeWelcomeRef.current.open();
        }
    };

    const handleCloseErrorModal = () => {
        setTimedOut(false);
        navigation.navigate(Screens.Communities);
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
                    i18n.t('connectWithValora'),
                    modalizeWelcomeRef,
                    () => {
                        navigation.navigate(Screens.Communities);
                    }
                )}
                adjustToContentHeight={Dimensions.get('window').height >= 720}
                onClose={() => {
                    navigation.navigate(Screens.Communities);
                }}
            >
                <ScrollView
                    style={{
                        minHeight: 500,
                    }}
                >
                    <View style={{ width: '100%', paddingHorizontal: 22 }}>
                        <Text style={styles.descriptionTop}>
                            {i18n.t('impactMarketDescription')}
                        </Text>
                        <Text style={styles.description}>
                            {i18n.t('loginDescription')}
                        </Text>
                    </View>
                    <View style={{ width: '100%', paddingHorizontal: 21 }}>
                        <Text style={styles.stepText1}>{i18n.t('step1')}</Text>
                        <View style={{ width: '100%', marginTop: 16 }}>
                            {buttonStoreLink()}
                        </View>
                        <TouchableOpacity
                            onPress={() => modalizeWebViewRef.current?.open()}
                        >
                            <Text style={styles.whatIsValora}>
                                {i18n.t('whatIsValora')}
                            </Text>
                        </TouchableOpacity>
                        <Text style={styles.stepText2}>{i18n.t('step2')}</Text>
                        <Button
                            modeType="green"
                            bold
                            onPress={login}
                            loading={connecting || refreshing}
                            style={{ width: '100%', marginTop: 16 }}
                            labelStyle={styles.buttomConnectValoraText}
                        >
                            {i18n.t('connectWithValora')}
                        </Button>
                    </View>
                </ScrollView>
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
                            {i18n.t('modalValoraTimeoutTitle')}
                        </Text>
                        <CloseStorySvg
                            onPress={() => handleCloseErrorModal()}
                        />
                    </View>
                    <View style={styles.timedOutCardDescriptionContainer}>
                        <Text style={styles.timedOutCardDescription}>
                            {i18n.t('modalValoraTimeoutDescription')}
                        </Text>
                    </View>
                    <View style={styles.timedOutCardButtons}>
                        <Button
                            modeType="gray"
                            style={{ flex: 1, marginRight: 5 }}
                            onPress={() => handleCloseErrorModal()}
                        >
                            {i18n.t('close')}
                        </Button>
                        <Button
                            modeType="default"
                            style={{ flex: 1, marginLeft: 5 }}
                            onPress={() => {
                                modalizeHelpCenterRef.current?.open();
                                setTimedOut(false);
                            }}
                        >
                            {i18n.t('faq')}
                        </Button>
                    </View>
                </Card>
            </Modal>
        </Portal>
    );
}

Auth.navigationOptions = ({ route }: { route: RouteProp<any, any> }) => {
    return {
        headerShown: false,
    };
};

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
