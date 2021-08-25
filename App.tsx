import './global';
import { newKitFromWeb3 } from '@celo/contractkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import {
    NavigationContainer,
    DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native';
import BigNumber from 'bignumber.js';
import Button from 'components/core/Button';
import Card from 'components/core/Card';
import DownloadSvg from 'components/svg/DownloadSvg';
import NoConnectionSvg from 'components/svg/NoConnectionSvg';
import AppLoading from 'expo-app-loading';
import { Asset } from 'expo-asset';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Analytics from 'expo-firebase-analytics';
import * as Font from 'expo-font';
import * as Linking from 'expo-linking';
import * as Localization from 'expo-localization';
import * as Notifications from 'expo-notifications';
import * as SplashScreen from 'expo-splash-screen';
import {
    STORAGE_USER_ADDRESS,
    STORAGE_USER_PHONE_NUMBER,
} from 'helpers/constants';
import {
    setAppExchangeRatesAction,
    setAppSuspectWrongDateTime,
    setCeloKit,
    setPushNotificationListeners,
    setAppHasBeneficiaryAcceptedTerms,
    setAppHasManagerAcceptedTerms,
} from 'helpers/redux/actions/app';
import { setPushNotificationsToken } from 'helpers/redux/actions/auth';
import { resetUserApp, setUserLanguage } from 'helpers/redux/actions/user';
import rootSagas from 'helpers/redux/sagas';
import { isReadyRef, navigationRef } from 'helpers/rootNavigation';
import moment from 'moment';
import React from 'react';
import {
    Image,
    View,
    LogBox,
    StatusBar,
    Dimensions,
    Platform,
} from 'react-native';
import FlashMessage from 'react-native-flash-message';
import {
    DefaultTheme,
    Provider as PaperProvider,
    configureFonts,
    Text,
    IconButton,
    Modal,
    Portal,
    Paragraph,
    Headline,
} from 'react-native-paper';
import { Host } from 'react-native-portalize';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import {
    offlineMiddleware,
    suspendSaga,
    consumeActionMiddleware,
} from 'redux-offline-queue';
import createSagaMiddleware from 'redux-saga';
import { gt as semverGt, gte as semverGte } from 'semver';
import * as Sentry from 'sentry-expo';
import CacheStore from 'services/cacheStore';
import { startNotificationsListeners } from 'services/pushNotifications';
import Web3 from 'web3';

import config from './config';
import i18n, { loadi18n, supportedLanguages } from './src/assets/i18n';
import { welcomeUser } from './src/helpers';
import combinedReducer from './src/helpers/redux/reducers';
import Navigator from './src/navigator';
import Api from './src/services/api';
import { registerForPushNotifications } from './src/services/pushNotifications';
import { ipctColors } from './src/styles';
if (__DEV__) {
    import('./ReactotronConfig').then(() =>
        console.log('Reactotron Configured')
    );
}

BigNumber.config({ EXPONENTIAL_AT: [-7, 30] });
const kit = newKitFromWeb3(new Web3(config.jsonRpc));

const middlewares = [];
const sagaMiddleware = createSagaMiddleware();

middlewares.push(offlineMiddleware({}));
middlewares.push(suspendSaga(sagaMiddleware));
middlewares.push(consumeActionMiddleware());

const store = createStore(combinedReducer, applyMiddleware(...middlewares));
sagaMiddleware.run(rootSagas);
const fonts = {
    regular: {
        fontFamily: 'Gelion-Regular',
    },
    medium: {
        fontFamily: 'Gelion-Medium',
    },
    light: {
        fontFamily: 'Gelion-Light',
    },
    thin: {
        fontFamily: 'Gelion-Thin',
    },
};
const theme = {
    ...DefaultTheme,
    roundness: 4,
    colors: {
        ...DefaultTheme.colors,
        primary: ipctColors.blueRibbon,
        text: ipctColors.almostBlack,
    },
    fonts: configureFonts({
        default: fonts,
        ios: fonts,
        android: fonts,
    }),
};
const navigationTheme = {
    ...NavigationDefaultTheme,
    colors: {
        ...NavigationDefaultTheme.colors,
        primary: ipctColors.blueRibbon,
        background: '#ffffff',
    },
};

LogBox.ignoreLogs([
    'No DSN provided, backend will not do anything',
    "The provided value 'moz-chunked-arraybuffer' is not a valid 'responseType'.",
    "The provided value 'ms-stream' is not a valid 'responseType'.",
    'Firebase Analytics is not available in the Expo client.',
]);

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

// Construct a new instrumentation instance. This is needed to communicate between the integration and React
const routingInstrumentation = new Sentry.Native.ReactNavigationV5Instrumentation();

Sentry.init({
    // release: 'impactmarket@' + process.env.REACT_APP_RELEASE_VERSION, // https://docs.sentry.io/product/sentry-basics/guides/integrate-frontend/upload-source-maps/
    environment:
        process.env.SENTRY_ENVIRONMENT !== undefined
            ? process.env.SENTRY_ENVIRONMENT
            : 'dev',
    dsn: process.env.EXPO_SENTRY_DNS,
    enableInExpoDevelopment: true,
    debug: true,
    integrations: [
        new Sentry.Native.ReactNativeTracing({
            routingInstrumentation,
            // ... other options
        }),
    ],
    // sampleRate: 0.1,
    // tracesSampleRate: 0.1,
    tracesSampler: (samplingContext) => {
        // Examine provided context data (including parent decision, if any) along
        // with anything in the global namespace to compute the sample rate or
        // sampling decision for this transaction

        // if ipct-activity is defined, send all error to sentry
        if (
            samplingContext.transactionContext.tags &&
            samplingContext.transactionContext.tags['ipct-activity'] !==
                undefined
        ) {
            return 1;
        }
        return 0.1;
    },
});

const prefix = Linking.makeUrl('/');
interface IAppState {
    isSplashReady: boolean;
    isAppReady: boolean;
    // loggedIn is not used anywhere, only forces update!
    loggedIn: boolean;
    testnetWarningOpen: boolean;
    infoUserNewAppVersion: boolean;
    blockUserToUpdateApp: boolean;
    netAvailable: boolean;
}
class App extends React.Component<any, IAppState> {
    private currentRouteName: string | undefined = '';
    private linking = {
        prefixes: [prefix],
    };

    constructor(props: any) {
        super(props);
        this.state = {
            isSplashReady: false,
            isAppReady: false,
            loggedIn: false,
            testnetWarningOpen: false,
            infoUserNewAppVersion: false,
            blockUserToUpdateApp: false,
            netAvailable: true,
        };
    }

    componentDidMount = () => {
        const currentLoggedIn = store.getState().user.wallet.address.length > 0;
        if (currentLoggedIn) {
            setPushNotificationListeners(
                startNotificationsListeners(kit, store.dispatch)
            );
        }

        if (config.testnet) {
            this.setState({ testnetWarningOpen: true });
            setTimeout(
                () => this.setState({ testnetWarningOpen: false }),
                5000
            );
        }

        //
        const { width, height } = Dimensions.get('screen');
        Analytics.setUserProperties({
            screen_dimensions: `${width}x${height}`,
            os_version: `${Device.osName.slice(0, 1).toLowerCase()}${
                Device.osVersion
            }`, // to separate android and ios
        });
    };

    componentWillUnmount = () => {
        const listeners = store.getState().app.notificationsListeners;
        if (listeners) {
            Notifications.removeNotificationSubscription(
                listeners.notificationReceivedListener
            );
            Notifications.removeNotificationSubscription(
                listeners.notificationResponseReceivedListener
            );
        }
    };

    handleUpdateClick = () => {
        const androidURL =
            'https://play.google.com/store/apps/details?id=com.impactmarket.mobile';
        const iosURL = 'https://apps.apple.com/app/impactmarket/id1530870911';
        if (Device.osName === 'iOS') {
            Linking.openURL(iosURL);
        } else {
            Linking.openURL(androidURL);
        }
    };

    render() {
        const {
            isAppReady,
            isSplashReady,
            testnetWarningOpen,
            infoUserNewAppVersion,
            blockUserToUpdateApp,
            netAvailable,
        } = this.state;
        if (!isSplashReady) {
            return (
                <AppLoading
                    startAsync={this._cacheSplashResourcesAsync}
                    onFinish={() => this.setState({ isSplashReady: true })}
                    onError={console.warn}
                    autoHideSplash={false}
                />
            );
        }

        if (!netAvailable) {
            return (
                <PaperProvider theme={theme}>
                    <Portal>
                        <Modal visible dismissable={false}>
                            <Card
                                style={{
                                    marginHorizontal: 20,
                                    paddingVertical: 43,
                                }}
                            >
                                <Card.Content
                                    style={{
                                        alignItems: 'center',
                                    }}
                                >
                                    <NoConnectionSvg />
                                    <Paragraph
                                        style={{
                                            fontFamily: 'Gelion-Regular',
                                            fontSize: 21,
                                            lineHeight: 25,
                                            color: ipctColors.almostBlack,
                                            width: '70%',
                                            textAlign: 'center',
                                        }}
                                    >
                                        {i18n.t('generic.offline')}
                                    </Paragraph>
                                </Card.Content>
                            </Card>
                        </Modal>
                    </Portal>
                </PaperProvider>
            );
        }

        if (infoUserNewAppVersion) {
            return (
                <PaperProvider theme={theme}>
                    <Portal>
                        <Modal visible dismissable={false}>
                            <Card style={{ marginHorizontal: 20 }}>
                                <Card.Content>
                                    <View
                                        style={{
                                            alignItems: 'center',
                                        }}
                                    >
                                        <DownloadSvg />
                                        <Headline
                                            style={{
                                                fontFamily: 'Gelion-Regular',
                                                fontSize: 24,
                                                lineHeight: 24,
                                                textAlign: 'center',
                                                color: ipctColors.almostBlack,
                                                marginVertical: 16,
                                            }}
                                        >
                                            {i18n.t(
                                                'generic.newVersionAvailable'
                                            )}
                                        </Headline>
                                        <Paragraph
                                            style={{
                                                fontFamily: 'Gelion-Regular',
                                                fontSize: 16,
                                                lineHeight: 19,
                                                color: ipctColors.almostBlack,
                                                textAlign: 'center',
                                            }}
                                        >
                                            {i18n.t(
                                                'generic.newVersionAvailableMessage'
                                            )}
                                        </Paragraph>
                                    </View>
                                    <Button
                                        modeType="default"
                                        style={{
                                            marginTop: 20,
                                            marginHorizontal: 5,
                                        }}
                                        bold
                                        onPress={this.handleUpdateClick}
                                    >
                                        {i18n.t('generic.update')}
                                    </Button>
                                    {!blockUserToUpdateApp && (
                                        <Button
                                            modeType="gray"
                                            style={{
                                                marginTop: 11,
                                                marginHorizontal: 5,
                                            }}
                                            onPress={() =>
                                                this.setState({
                                                    infoUserNewAppVersion: false,
                                                })
                                            }
                                        >
                                            {i18n.t('generic.skip')}
                                        </Button>
                                    )}
                                </Card.Content>
                            </Card>
                        </Modal>
                    </Portal>
                </PaperProvider>
            );
        }

        if (!isAppReady) {
            return (
                <View
                    style={{
                        flex: 1,
                        alignItems: 'center',
                        flexDirection: 'row',
                        backgroundColor: ipctColors.blueRibbon,
                    }}
                >
                    <Image
                        style={{ flex: 1, resizeMode: 'cover' }}
                        source={require('./src/assets/images/splash.png')}
                        onLoad={this._cacheResourcesAsync}
                    />
                </View>
            );
        }

        const testnetWarningView = (
            <View
                style={{
                    backgroundColor: '#45c7ff',
                    width: '100%',
                    paddingTop: 30,
                    paddingBottom: 10,
                    paddingHorizontal: 20,
                    position: 'absolute',
                    zIndex: testnetWarningOpen ? 1 : -1,
                    flex: 1,
                    flexDirection: 'row',
                    alignItems: 'center',
                }}
            >
                <Text style={{ textAlign: 'center', width: '80%' }}>
                    {i18n.t('generic.testnetWarning')}
                </Text>
                <IconButton
                    style={{ width: '10%' }}
                    icon="close-circle-outline"
                    size={20}
                    onPress={() => this.setState({ testnetWarningOpen: false })}
                />
            </View>
        );

        return (
            <PaperProvider theme={theme}>
                <Provider store={store}>
                    <StatusBar
                        backgroundColor="rgba(0, 0, 0, 0.2)"
                        translucent
                    />
                    <FlashMessage
                        position={{
                            top: StatusBar.currentHeight,
                            left: 0,
                            right: 0,
                        }}
                        floating
                    />
                    {config.testnet && testnetWarningView}
                    <NavigationContainer
                        theme={navigationTheme}
                        linking={this.linking}
                        onReady={() => {
                            const currentRouteName = navigationRef.current?.getCurrentRoute()
                                ?.name;
                            if (currentRouteName !== undefined) {
                                Analytics.setCurrentScreen(currentRouteName);
                            }
                            routingInstrumentation.registerNavigationContainer(
                                navigationRef
                            );
                            // Save the current route name for later comparision
                            this.currentRouteName = currentRouteName;
                            (isReadyRef.current as any) = true; // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/31065
                        }}
                        onStateChange={() => {
                            const previousRouteName = this.currentRouteName;
                            const currentRouteName = navigationRef.current?.getCurrentRoute()
                                ?.name;

                            if (
                                previousRouteName !== currentRouteName &&
                                currentRouteName !== undefined
                            ) {
                                // The line below uses the expo-firebase-analytics tracker
                                // https://docs.expo.io/versions/latest/sdk/firebase-analytics/
                                // Change this line to use another Mobile analytics SDK
                                Analytics.setCurrentScreen(currentRouteName);
                            }

                            // Save the current route name for later comparision
                            this.currentRouteName = currentRouteName;
                        }}
                        ref={navigationRef}
                    >
                        <Host>
                            <Navigator />
                        </Host>
                    </NavigationContainer>
                </Provider>
            </PaperProvider>
        );
    }

    _cacheSplashResourcesAsync = async () => {
        const images = [require('./src/assets/images/splash.png')];

        const cacheImages = images.map((image) => {
            return Asset.fromModule(image).downloadAsync();
        });
        await Promise.all(cacheImages);
    };

    _cacheResourcesAsync = async () => {
        try {
            await Font.loadAsync({
                // Load a font `Montserrat` from a static resource
                // Montserrat: require('assets/fonts/Montserrat.ttf'),

                // Any string can be used as the fontFamily name. Here we use an object to provide more control
                'Gelion-SemiBold': {
                    uri: require('./src/assets/fonts/FontGelion/Gelion-SemiBold.ttf'),
                },
                'Gelion-Bold': {
                    uri: require('./src/assets/fonts/FontGelion/Gelion-Bold.ttf'),
                },
                'Gelion-Regular': {
                    uri: require('./src/assets/fonts/FontGelion/Gelion-Regular.ttf'),
                },
                'Gelion-Medium': {
                    uri: require('./src/assets/fonts/FontGelion/Gelion-Medium.ttf'),
                },
                'Gelion-Light': {
                    uri: require('./src/assets/fonts/FontGelion/Gelion-Light.ttf'),
                },
                'Gelion-Thin': {
                    uri: require('./src/assets/fonts/FontGelion/Gelion-Thin.ttf'),
                },
                'Inter-Thin': {
                    uri: require('./src/assets/fonts/Inter/Inter-Thin.ttf'),
                },
                'Inter-SemiBold': {
                    uri: require('./src/assets/fonts/Inter/Inter-SemiBold.ttf'),
                },
                'Inter-Regular': {
                    uri: require('./src/assets/fonts/Inter/Inter-Regular.ttf'),
                },
                'Inter-Medium': {
                    uri: require('./src/assets/fonts/Inter/Inter-Medium.ttf'),
                },
                'Inter-Light': {
                    uri: require('./src/assets/fonts/Inter/Inter-Light.ttf'),
                },
                'Inter-ExtraLight': {
                    uri: require('./src/assets/fonts/Inter/Inter-ExtraLight.ttf'),
                },
                'Inter-ExtraBold': {
                    uri: require('./src/assets/fonts/Inter/Inter-ExtraBold.ttf'),
                },
                'Inter-Bold': {
                    uri: require('./src/assets/fonts/Inter/Inter-Bold.ttf'),
                },
                'Inter-Black': {
                    uri: require('./src/assets/fonts/Inter/Inter-Black.ttf'),
                },
                'Manrope-Bold': {
                    uri: require('./src/assets/fonts/Manrope/Manrope-Bold.ttf'),
                },
                'Manrope-ExtraBold': {
                    uri: require('./src/assets/fonts/Manrope/Manrope-ExtraBold.ttf'),
                },
                'Manrope-ExtraLight': {
                    uri: require('./src/assets/fonts/Manrope/Manrope-ExtraLight.ttf'),
                },
                'Manrope-Light': {
                    uri: require('./src/assets/fonts/Manrope/Manrope-Light.ttf'),
                },
                'Manrope-Medium': {
                    uri: require('./src/assets/fonts/Manrope/Manrope-Medium.ttf'),
                },
                'Manrope-Regular': {
                    uri: require('./src/assets/fonts/Manrope/Manrope-Regular.ttf'),
                },
                'Manrope-SemiBold': {
                    uri: require('./src/assets/fonts/Manrope/Manrope-SemiBold.ttf'),
                },
            });
            // wait to load langiages
            await loadi18n;
            let language = Localization.locale;
            if (language.includes('-')) {
                language = language.substr(0, language.indexOf('-'));
            } else if (language.includes('_')) {
                language = language.substr(0, language.indexOf('_'));
            }
            if (!supportedLanguages.includes(language)) {
                language = 'en';
            }
            i18n.changeLanguage(language);
            store.dispatch(setUserLanguage(language));
            const netState = await NetInfo.fetch();
            if (!netState.isConnected) {
                this.setState({ netAvailable: false });
                return;
            }
            await this._checkForNewVersion();
            await this._authUser();
            await this._checkAcceptanceOfRules();
            this.setState({ isAppReady: true });
            // just at the end, so when we hide, app is ready!
            SplashScreen.hideAsync();
        } catch (e) {
            Sentry.Native.captureException(e);
            return (
                <PaperProvider theme={theme}>
                    <Portal>
                        <Modal visible dismissable={false}>
                            <Card
                                style={{
                                    marginHorizontal: 20,
                                    paddingVertical: 43,
                                }}
                            >
                                <Card.Content
                                    style={{
                                        alignItems: 'center',
                                    }}
                                >
                                    <Paragraph
                                        style={{
                                            fontFamily: 'Gelion-Regular',
                                            fontSize: 21,
                                            lineHeight: 25,
                                            color: ipctColors.almostBlack,
                                            width: '70%',
                                            textAlign: 'center',
                                        }}
                                    >
                                        {i18n.t('generic.unexpectedError')}
                                    </Paragraph>
                                </Card.Content>
                            </Card>
                        </Modal>
                    </Portal>
                </PaperProvider>
            );
        }
    };

    _checkForNewVersion = async () => {
        // this should not be built this way,
        // wee need instead an udp library and a NTP server.
        const preTime = new Date();
        const version = await Api.system.getMobileVersion();
        const postTime = new Date();
        if (version === undefined) {
            // TODO: error loading app, reload
            return;
        }
        const requestDiff = moment(preTime).diff(postTime);
        const timeDiff =
            new Date(postTime.getTime() - requestDiff / 2).getTime() -
            version.timestamp;
        // 10 seconds
        if (timeDiff < -10000 || timeDiff > 10000) {
            store.dispatch(setAppSuspectWrongDateTime(true, timeDiff));
        }
        let manifestVersion = '';
        if (Constants.manifest2 !== null) {
            manifestVersion = Constants.manifest2.runtimeVersion;
        } else if (
            Constants.manifest !== null &&
            Constants.manifest.version !== undefined
        ) {
            manifestVersion = Constants.manifest.version;
        }
        if (manifestVersion.length > 0) {
            let lastVersionFromCache = await CacheStore.getLastVersion();
            if (lastVersionFromCache === null) {
                lastVersionFromCache = manifestVersion;
            }
            if (!semverGte(manifestVersion, version.minimal)) {
                // id the user does not have the minimal required version
                // block until update
                this.setState({
                    blockUserToUpdateApp: true,
                    infoUserNewAppVersion: true,
                });
            } else if (semverGt(version.latest, lastVersionFromCache)) {
                // if there's a new version
                // warn only once
                await CacheStore.cacheLastVersion(version.latest);
                this.setState({ infoUserNewAppVersion: true });
            }
        }
    };

    _checkAcceptanceOfRules = async () => {
        const hasBeneficiaryAcceptedRulesAlready = await CacheStore.getBeneficiaryAcceptCommunityRules();
        const hasManagerAcceptedRulesAlready = await CacheStore.getManagerAcceptCommunityRules();

        if (hasBeneficiaryAcceptedRulesAlready) {
            store.dispatch(setAppHasBeneficiaryAcceptedTerms(true));
        } else {
            store.dispatch(setAppHasBeneficiaryAcceptedTerms(false));
        }

        if (hasManagerAcceptedRulesAlready) {
            store.dispatch(setAppHasManagerAcceptedTerms(true));
        } else {
            store.dispatch(setAppHasManagerAcceptedTerms(false));
        }
    };

    _authUser = async () => {
        let address: string | null = '';
        let phoneNumber: string | null = '';
        let loggedIn = false;
        try {
            store.dispatch(setCeloKit(kit));
            address = await AsyncStorage.getItem(STORAGE_USER_ADDRESS);
            phoneNumber = await AsyncStorage.getItem(STORAGE_USER_PHONE_NUMBER);
            const exchangeRates = await Api.system.getExchangeRate();
            const userRates: { [key: string]: number } = {};
            Object.assign(
                userRates,
                ...exchangeRates.map((y) => ({ [y.currency]: y.rate }))
            );
            store.dispatch(setAppExchangeRatesAction(userRates));
            if (address !== null && phoneNumber !== null) {
                const pushNotificationToken = await registerForPushNotifications();
                if (pushNotificationToken) {
                    store.dispatch(
                        setPushNotificationsToken(pushNotificationToken)
                    );
                    setPushNotificationListeners(
                        startNotificationsListeners(kit, store.dispatch)
                    );
                }

                const userWelcome = await Api.user.welcome(
                    pushNotificationToken
                );

                if (userWelcome !== undefined) {
                    const userMetadata = await CacheStore.getUser();
                    if (userMetadata === null) {
                        await AsyncStorage.clear();
                        store.dispatch(resetUserApp());
                        return;
                    }

                    await welcomeUser(
                        address,
                        phoneNumber,
                        userWelcome,
                        userRates,
                        kit,
                        store.dispatch,
                        userMetadata
                    );
                    loggedIn = true;
                }
            }
            this.setState({
                loggedIn,
            });
        } catch (e) {
            Sentry.Native.captureException(e);
        }
    };
}

export default Sentry.Native.withProfiler(App, { name: 'App' });
