import React from 'react';
import './global';
import { Image, View, LogBox, StatusBar, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
import { batch, Provider } from 'react-redux';
import { createStore, Unsubscribe } from 'redux';
import * as Sentry from 'sentry-expo';
import Web3 from 'web3';
import { newKitFromWeb3 } from '@celo/contractkit';
import * as Font from 'expo-font';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import AppLoading from 'expo-app-loading';
import { Asset } from 'expo-asset';
import {
    NavigationContainer,
    DefaultTheme as NavigationDefaultTheme,
    // NavigationContainerRef,
} from '@react-navigation/native';

import config from './config';
import i18n, { loadi18n, supportedLanguages } from './src/assets/i18n';
import { welcomeUser } from './src/helpers';
import { iptcColors } from './src/styles';
import combinedReducer from './src/helpers/redux/reducers/ReduxReducers';

import BigNumber from 'bignumber.js';

import Api from './src/services/api';
import { registerForPushNotifications } from './src/services/pushNotifications';
import CommunityContractABI from './src/contracts/CommunityABI.json';
import Button from 'components/core/Button';
import CacheStore from 'services/cacheStore';
import NetInfo from '@react-native-community/netinfo';
import Card from 'components/core/Card';
import NoConnectionSvg from 'components/svg/NoConnectionSvg';
import DownloadSvg from 'components/svg/DownloadSvg';
import { gt as semverGt, gte as semverGte } from 'semver';
import * as Linking from 'expo-linking';
import * as Device from 'expo-device';
import * as Localization from 'expo-localization';
import moment from 'moment';
import Navigator from './src/navigator';
import * as Analytics from 'expo-firebase-analytics';
import * as SplashScreen from 'expo-splash-screen';
import {
    resetUserApp,
    setCommunityContract,
    setCommunityMetadata,
    setUserIsBeneficiary,
    setUserIsCommunityManager,
    setUserLanguage,
} from 'helpers/redux/actions/user';
import {
    setAppExchangeRatesAction,
    setAppSuspectWrongDateTime,
    setCeloKit,
} from 'helpers/redux/actions/app';
import { setPushNotificationsToken } from 'helpers/redux/actions/auth';
import {
    STORAGE_USER_ADDRESS,
    STORAGE_USER_PHONE_NUMBER,
} from 'helpers/constants';
import { isReadyRef, navigationRef } from 'helpers/rootNavigation';
import { startNotificationsListeners } from 'services/pushNotifications';

BigNumber.config({ EXPONENTIAL_AT: [-7, 30] });
const kit = newKitFromWeb3(new Web3(config.jsonRpc));
const store = createStore(combinedReducer);
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
        primary: iptcColors.softBlue,
        text: iptcColors.almostBlack,
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
        primary: iptcColors.softBlue,
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

Sentry.init({
    dsn: process.env.EXPO_SENTRY_DNS,
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
export default class App extends React.Component<any, IAppState> {
    private unsubscribeStore: Unsubscribe = undefined as any;
    // private navigationRef = React.createRef<NavigationContainerRef>();
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
        this.unsubscribeStore = store.subscribe(() => {
            const previousLoggedIn = this.state.loggedIn;
            const currentLoggedIn =
                store.getState().user.wallet.address.length > 0;

            if (previousLoggedIn !== currentLoggedIn) {
                if (currentLoggedIn) {
                    startNotificationsListeners(kit, store.dispatch);
                }
            }
        });
        store.dispatch(setCeloKit(kit));
        if (config.testnet) {
            this.setState({ testnetWarningOpen: true });
            setTimeout(
                () => this.setState({ testnetWarningOpen: false }),
                5000
            );
        }

        //
        Analytics.setUserId(Device.osInternalBuildId);
        const osVersion = Device.osVersion;
        let userProperties: any = {
            screen_resolution: `${Dimensions.get('window').width}x${
                Dimensions.get('window').height
            }`,
        };
        if (osVersion) {
            userProperties = {
                ...userProperties,
                osVersion,
            };
        }
        Analytics.setUserProperties(userProperties);
    };

    componentWillUnmount = () => {
        try {
            this.unsubscribeStore();
        } catch (e) {}
        // refactor https://docs.expo.io/versions/latest/sdk/notifications/
        // Notifications.removeAllNotificationListeners();
    };

    handleUpdateClick = () => {
        const androidURL =
            'https://play.google.com/store/apps/details?id=com.impactmarket.mobile';
        const iosURL = 'https://testflight.apple.com/join/o19f5StV';
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
                        <Modal visible={true} dismissable={false}>
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
                                            color: iptcColors.almostBlack,
                                            width: '70%',
                                            textAlign: 'center',
                                        }}
                                    >
                                        {i18n.t('offline')}
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
                        <Modal visible={true} dismissable={false}>
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
                                                color: iptcColors.almostBlack,
                                                marginVertical: 16,
                                            }}
                                        >
                                            {i18n.t('newVersionAvailable')}
                                        </Headline>
                                        <Paragraph
                                            style={{
                                                fontFamily: 'Gelion-Regular',
                                                fontSize: 16,
                                                lineHeight: 19,
                                                color: iptcColors.almostBlack,
                                                textAlign: 'center',
                                            }}
                                        >
                                            {i18n.t(
                                                'newVersionAvailableMessage'
                                            )}
                                        </Paragraph>
                                    </View>
                                    <Button
                                        modeType="default"
                                        style={{
                                            marginTop: 20,
                                            marginHorizontal: 5,
                                        }}
                                        bold={true}
                                        onPress={this.handleUpdateClick}
                                    >
                                        {i18n.t('update')}
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
                                            {i18n.t('skip')}
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
                        justifyContent: 'center',
                    }}
                >
                    <Image
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
                    {i18n.t('testnetWarning')}
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
                        <Navigator />
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
        return;
    };

    _cacheResourcesAsync = async () => {
        SplashScreen.hideAsync();
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
        this.setState({ isAppReady: true });
    };

    _checkForNewVersion = async () => {
        // this should not be built this way,
        // wee need instead an udp library and a NTP server.
        const preTime = new Date();
        const version = await Api.getMobileVersion();
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
        let lastVersionFromCache = await CacheStore.getLastVersion();
        if (lastVersionFromCache === null) {
            lastVersionFromCache = Constants.manifest.version!;
        }
        const currentVersion = Constants.manifest.version;
        if (semverGt(version.latest, lastVersionFromCache)) {
            await CacheStore.cacheLastVersion(version.latest);
            this.setState({ infoUserNewAppVersion: true });
        }
        if (
            currentVersion !== undefined &&
            !semverGte(currentVersion, version.minimal)
        ) {
            this.setState({ blockUserToUpdateApp: true });
        }
    };

    _authUser = async () => {
        let address: string | null = '';
        let phoneNumber: string | null = '';
        let loggedIn = false;
        try {
            address = await AsyncStorage.getItem(STORAGE_USER_ADDRESS);
            phoneNumber = await AsyncStorage.getItem(STORAGE_USER_PHONE_NUMBER);
            if (address !== null && phoneNumber !== null) {
                const pushNotificationToken = await registerForPushNotifications();
                store.dispatch(
                    setPushNotificationsToken(pushNotificationToken)
                );
                const userWelcome = await Api.user.hello(
                    address,
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
                        kit,
                        store,
                        userMetadata
                    );
                    startNotificationsListeners(kit, store.dispatch);
                    loggedIn = true;
                }
            }
            if (!loggedIn) {
                const lastUpdate = await CacheStore.getLastExchangeRatesUpdate();
                if (new Date().getTime() - lastUpdate > 3600000) {
                    // 1h in ms
                    const exchangeRates = await Api.getExchangeRate();
                    store.dispatch(setAppExchangeRatesAction(exchangeRates));
                    CacheStore.cacheExchangeRates(exchangeRates);
                } else {
                    store.dispatch(
                        setAppExchangeRatesAction(
                            await CacheStore.getExchangeRates()
                        )
                    );
                }
            }
            this.setState({
                loggedIn,
            });
        } catch (error) {
            Api.uploadError('', 'auth_user', error);
        }
    };
}
