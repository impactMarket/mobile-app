import React from 'react';
import './global';
import { Image, View, YellowBox, AsyncStorage, StatusBar } from 'react-native';
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
import { Provider } from 'react-redux';
import { createStore, Unsubscribe } from 'redux';
import * as Sentry from 'sentry-expo';
import Web3 from 'web3';
import { newKitFromWeb3 } from '@celo/contractkit';
import * as Font from 'expo-font';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { AppLoading, SplashScreen } from 'expo';
import { Asset } from 'expo-asset';
import {
    NavigationContainer,
    DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native';

import config from './config';
import i18n, { supportedLanguages } from './src/assets/i18n';
import { iptcColors, welcomeUser } from './src/helpers';
import {
    setCeloKit,
    setPushNotificationsToken,
    setCommunity,
    setCommunityContract,
    setUserIsCommunityManager,
    setUserIsBeneficiary,
    setAppExchangeRatesAction,
    setUserLanguage,
} from './src/helpers/redux/actions/ReduxActions';
import combinedReducer from './src/helpers/redux/reducers/ReduxReducers';
import {
    STORAGE_USER_ADDRESS,
    STORAGE_USER_PHONE_NUMBER,
    STORAGE_USER_FIRST_TIME,
} from './src/helpers/types';

import BigNumber from 'bignumber.js';
import { createStackNavigator } from '@react-navigation/stack';

import Api from './src/services/api';
import { registerForPushNotifications } from './src/services/pushNotifications';
import Tabs from './src/views/Tabs';
import CommunityDetailsScreen from './src/views/community/details';
import CreateCommunityScreen from './src/views/createCommunity';
import FAQScreen from './src/views/faq';
import ClaimExplainedScreen from './src/views/community/beneficiary/ClaimExplainedScreen';
import AddedScreen from './src/views/community/manager/AddedScreen';
import RemovedScreen from './src/views/community/manager/RemovedScreen';
import Profile from './src/views/profile';
import CommunityContractABI from './src/contracts/CommunityABI.json';
import AddBeneficiaryScreen from './src/views/community/manager/AddBeneficiaryScreen';
import WelcomeScreen from './src/views/welcome/index';
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

BigNumber.config({ EXPONENTIAL_AT: [-7, 30] });
const kit = newKitFromWeb3(new Web3(config.jsonRpc));
const Stack = createStackNavigator();
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

YellowBox.ignoreWarnings([
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
    // enableInExpoDevelopment: true,
    debug: true,
});

interface IAppState {
    isSplashReady: boolean;
    isAppReady: boolean;
    firstTimeUser: boolean;
    // loggedIn is not used anywhere, only forces update!
    loggedIn: boolean;
    testnetWarningOpen: boolean;
    infoUserNewAppVersion: boolean;
    blockUserToUpdateApp: boolean;
    netAvailable: boolean;
}
export default class App extends React.Component<any, IAppState> {
    private unsubscribeStore: Unsubscribe = undefined as any;
    private navigationRef = React.createRef();

    constructor(props: any) {
        super(props);
        this.state = {
            isSplashReady: false,
            isAppReady: false,
            firstTimeUser: true,
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
                store.getState().user.celoInfo.address.length > 0;

            if (previousLoggedIn !== currentLoggedIn) {
                if (currentLoggedIn) {
                    // when notification received!
                    Notifications.addNotificationReceivedListener(
                        (notification: Notifications.Notification) => {
                            const {
                                action,
                                communityAddress,
                            } = notification.request.content.data;
                            if (
                                action === 'community-accepted' ||
                                action === 'beneficiary-added'
                            ) {
                                Api.getCommunityByContractAddress(
                                    communityAddress as string
                                ).then((community) => {
                                    if (community !== undefined) {
                                        const communityContract = new kit.web3.eth.Contract(
                                            CommunityContractABI as any,
                                            communityAddress as string
                                        );
                                        if (action === 'community-accepted') {
                                            store.dispatch(
                                                setUserIsCommunityManager(true)
                                            );
                                        }
                                        if (action === 'beneficiary-added') {
                                            store.dispatch(
                                                setUserIsBeneficiary(true)
                                            );
                                        }
                                        store.dispatch(setCommunity(community));
                                        store.dispatch(
                                            setCommunityContract(
                                                communityContract
                                            )
                                        );
                                    }
                                });
                            }
                        }
                    );
                    // when user interacts with notification
                    Notifications.addNotificationResponseReceivedListener(
                        (response) => {
                            const {
                                action,
                                communityAddress,
                            } = response.notification.request.content.data;
                            if (action === 'community-low-funds') {
                                Api.getCommunityByContractAddress(
                                    communityAddress as string
                                ).then((community) => {
                                    if (community !== undefined) {
                                        (this.navigationRef
                                            .current as any).navigate(
                                            'CommunityDetailsScreen',
                                            {
                                                community,
                                            }
                                        );
                                    }
                                });
                            }
                        }
                    );
                    // Notifications.addPushTokenListener
                    // In rare situations a push token may be changed by the push notification service while the app is running.
                }
            }
        });
        store.dispatch(setCeloKit(kit));
        this.setState({ testnetWarningOpen: true });
        setTimeout(() => this.setState({ testnetWarningOpen: false }), 5000);
    };

    componentWillUnmount = () => {
        try {
            this.unsubscribeStore();
        } catch (e) {}
        Notifications.removeAllNotificationListeners();
    };

    openExploreCommunities = async () => {
        await AsyncStorage.setItem(STORAGE_USER_FIRST_TIME, 'false');
        this.setState({ firstTimeUser: false });
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
            firstTimeUser,
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
                                        The Internet connection appears to be
                                        offline
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
                        ref={this.navigationRef as any}
                    >
                        <Stack.Navigator>
                            <Stack.Screen
                                options={{
                                    headerShown: false,
                                }}
                                name="Home"
                                component={Tabs}
                            />
                            <Stack.Screen
                                options={{
                                    headerShown: false,
                                }}
                                name="Profile"
                                component={Profile}
                            />
                            <Stack.Screen
                                options={{
                                    headerShown: false,
                                }}
                                name="CommunityDetailsScreen"
                                component={CommunityDetailsScreen}
                            />
                            <Stack.Screen
                                options={{
                                    headerShown: false,
                                }}
                                name="ClaimExplainedScreen"
                                component={ClaimExplainedScreen}
                            />
                            <Stack.Screen
                                options={{
                                    headerShown: false,
                                }}
                                name="CreateCommunityScreen"
                                component={CreateCommunityScreen}
                            />
                            <Stack.Screen
                                options={{
                                    headerShown: false,
                                }}
                                name="AddedScreen"
                                component={AddedScreen}
                            />
                            <Stack.Screen
                                options={{
                                    headerShown: false,
                                }}
                                name="RemovedScreen"
                                component={RemovedScreen}
                            />
                            <Stack.Screen
                                options={{
                                    headerShown: false,
                                }}
                                name="FAQScreen"
                                component={FAQScreen}
                            />
                            <Stack.Screen
                                options={{
                                    headerShown: false,
                                }}
                                name="AddBeneficiaryScreen"
                                component={AddBeneficiaryScreen}
                            />
                            <Stack.Screen
                                options={{
                                    headerShown: false,
                                }}
                                name="WelcomeScreen"
                                component={WelcomeScreen}
                            />
                        </Stack.Navigator>
                    </NavigationContainer>
                </Provider>
            </PaperProvider>
        );
    }

    _cacheSplashResourcesAsync = async () => {
        const gif = require('./src/assets/images/splash.png');
        return Asset.fromModule(gif).downloadAsync();
    };

    _cacheResourcesAsync = async () => {
        SplashScreen.hide();
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
        const version = await Api.getMobileVersion();
        if (version === undefined) {
            // TODO: error loading app, reload
            return;
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
        const pushNotificationsToken = await registerForPushNotifications();
        store.dispatch(setPushNotificationsToken(pushNotificationsToken));

        let address: string | null = '';
        let phoneNumber: string | null = '';
        let loggedIn = false;
        try {
            // TODO: changed in version 0.0.22, to be refactored in 0.0.24
            address = await AsyncStorage.getItem(STORAGE_USER_ADDRESS);
            phoneNumber = await AsyncStorage.getItem(STORAGE_USER_PHONE_NUMBER);
            if (address !== null && phoneNumber !== null) {
                const userWelcome = await Api.welcome(
                    address,
                    pushNotificationsToken
                );
                if (userWelcome !== undefined) {
                    CacheStore.cacheUser(userWelcome.user);
                    await welcomeUser(
                        address,
                        phoneNumber,
                        userWelcome,
                        kit,
                        store
                    );
                    loggedIn = true;
                }
            }
            if (!loggedIn) {
                let language = Localization.locale;
                if (language.includes('-')) {
                    language = language.substr(0, language.indexOf('-'));
                } else if (language.includes('_')) {
                    language = language.substr(0, language.indexOf('_'));
                }
                if (!supportedLanguages.includes(language)) {
                    language = 'en';
                }
                i18n.locale = language;
                store.dispatch(setUserLanguage(language));
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
