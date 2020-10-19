import React from 'react';
import './global';
import { Image, View, YellowBox, AsyncStorage, StatusBar } from 'react-native';
import {
    DefaultTheme,
    Provider as PaperProvider,
    configureFonts,
    Text,
    // Button,
    IconButton,
    Modal,
    Portal,
    // Card,
    Paragraph,
    Headline,
} from 'react-native-paper';
import {
    SafeAreaProvider,
    SafeAreaConsumer,
} from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { createStore, Unsubscribe } from 'redux';
import * as Sentry from 'sentry-expo';
import Web3 from 'web3';
import { newKitFromWeb3 } from '@celo/contractkit';
import * as Font from 'expo-font';
import * as Notifications from 'expo-notifications';
import { AppLoading, SplashScreen } from 'expo';
import { Asset } from 'expo-asset';
import {
    NavigationContainer,
    DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native';

import config from './config';
import i18n from './src/assets/i18n';
import { iptcColors, welcomeUser } from './src/helpers';
import {
    setCeloKit,
    setPushNotificationsToken,
    setCommunity,
    setCommunityContract,
    setUserIsCommunityManager,
    setUserIsBeneficiary,
    setAppExchangeRatesAction,
} from './src/helpers/redux/actions/ReduxActions';
import combinedReducer from './src/helpers/redux/reducers/ReduxReducers';
import {
    STORAGE_USER_ADDRESS,
    STORAGE_USER_PHONE_NUMBER,
    STORAGE_USER_FIRST_TIME,
    ICommunityInfo,
} from './src/helpers/types';

import BigNumber from 'bignumber.js';
import { createStackNavigator } from '@react-navigation/stack';

import Api from './src/services/api';
import { registerForPushNotifications } from './src/services/pushNotifications';
import Tabs from './src/views/Tabs';
import CommunityDetailsScreen from './src/views/common/CommunityDetailsScreen';
import CreateCommunityScreen from './src/views/common/CreateCommunityScreen';
import FAQScreen from './src/views/common/FAQScreen';
import LoginScreen from './src/views/common/LoginScreen';
import ClaimExplainedScreen from './src/views/community/view/beneficiary/ClaimExplainedScreen';
import AddedScreen from './src/views/community/view/communitymanager/AddedScreen';
import RemovedScreen from './src/views/community/view/communitymanager/RemovedScreen';
import EditProfile from './src/views/wallet/EditProfile';
import CommunityContractABI from './src/contracts/CommunityABI.json';
import AddBeneficiaryScreen from './src/views/community/view/communitymanager/AddBeneficiaryScreen';
import Button from 'components/Button';
import { writeLog } from 'services/logger/write';
import CacheStore from 'services/cacheStore';
import NetInfo from '@react-native-community/netinfo';
import Card from 'components/Card';
import Svg, { Path, SvgXml } from 'react-native-svg';
import NoConnectionSvg from 'components/NoConnectionSvg';
import DownloadSvg from 'components/DownloadSvg';

BigNumber.config({ EXPONENTIAL_AT: [-7, 30] });
const kit = newKitFromWeb3(new Web3(config.jsonRpc));
const Stack = createStackNavigator();
const store = createStore(combinedReducer);
const fonts = {
    regular: {
        fontFamily: 'Gelion-Regular',
    },
    medium: {
        fontFamily: 'Gelion-Regular',
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
    warnUserUpdateApp: boolean;
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
            warnUserUpdateApp: false,
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
        // TODO:
        console.log('update');
    };

    render() {
        const {
            isAppReady,
            isSplashReady,
            firstTimeUser,
            testnetWarningOpen,
            warnUserUpdateApp,
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

        if (blockUserToUpdateApp) {
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
                                                fontWeight: 'bold',
                                                fontSize: 24,
                                                lineHeight: 22,
                                                textAlign: 'center',
                                                color: iptcColors.almostBlack,
                                                marginVertical: 16,
                                            }}
                                        >
                                            New version available
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
                                            To get the latest improvements and
                                            features we need you to update to
                                            the latest version.
                                        </Paragraph>
                                    </View>
                                    <Button
                                        modeType="default"
                                        style={{
                                            marginTop: 20,
                                        }}
                                        bold={true}
                                        onPress={this.handleUpdateClick}
                                    >
                                        {i18n.t('update')}
                                    </Button>
                                </Card.Content>
                            </Card>
                        </Modal>
                    </Portal>
                </PaperProvider>
            );
        }

        if (warnUserUpdateApp) {
            return (
                <PaperProvider theme={theme}>
                    <Portal>
                        <Modal visible={true} dismissable={false}>
                            <Card style={{ marginHorizontal: 20 }}>
                                <Card.Content>
                                    <View
                                        style={{
                                            alignItems: 'center',
                                            paddingHorizontal: '20%',
                                        }}
                                    >
                                        <IconButton
                                            icon="alert"
                                            color="#f0ad4e"
                                            size={20}
                                        />
                                        <Paragraph
                                            style={{
                                                marginHorizontal: 10,
                                                textAlign: 'center',
                                            }}
                                        >
                                            {i18n.t('appVersionIsOld')}
                                        </Paragraph>
                                    </View>
                                </Card.Content>
                                <Card.Actions
                                    style={{
                                        justifyContent: 'center',
                                        marginTop: 20,
                                    }}
                                >
                                    <Button
                                        modeType="green"
                                        style={{
                                            marginHorizontal: 5,
                                        }}
                                        onPress={this.handleUpdateClick}
                                    >
                                        {i18n.t('update')}
                                    </Button>
                                    <Button
                                        modeType="gray"
                                        style={{
                                            marginHorizontal: 5,
                                        }}
                                        onPress={() =>
                                            this.setState({
                                                warnUserUpdateApp: false,
                                            })
                                        }
                                    >
                                        {i18n.t('later')}
                                    </Button>
                                </Card.Actions>
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

        if (firstTimeUser) {
            return (
                <SafeAreaProvider>
                    <SafeAreaConsumer>
                        {(insets) => (
                            <PaperProvider theme={theme}>
                                <View
                                    style={{
                                        paddingTop: insets?.top,
                                        flex: 1,
                                        flexDirection: 'column',
                                        justifyContent: 'space-around',
                                        alignItems: 'center',
                                    }}
                                >
                                    <Image
                                        style={{ height: 82, maxWidth: '51%' }}
                                        source={require('./src/assets/images/splash/logo.png')}
                                    />
                                    <Image
                                        style={{
                                            height: 136,
                                            maxWidth: '100%',
                                        }}
                                        source={require('./src/assets/images/splash/diversity.png')}
                                    />
                                    <Text
                                        style={{
                                            fontFamily: 'Gelion-Regular',
                                            fontSize: 19,
                                            fontWeight: 'normal',
                                            fontStyle: 'normal',
                                            lineHeight: 26,
                                            letterSpacing: 0,
                                            textAlign: 'center',
                                            color: '#172b4d',
                                            marginHorizontal: 40,
                                        }}
                                    >
                                        {i18n.t('oneTimeWelcomeMessage1')}
                                    </Text>
                                    <View>
                                        <Text
                                            style={{
                                                fontFamily: 'Gelion-Regular',
                                                fontSize: 19,
                                                fontWeight: 'normal',
                                                fontStyle: 'normal',
                                                lineHeight: 26,
                                                letterSpacing: 0,
                                                textAlign: 'center',
                                                color: '#172b4d',
                                                marginHorizontal: 40,
                                            }}
                                        >
                                            {i18n.t('oneTimeWelcomeMessage2')}
                                        </Text>
                                        <Button
                                            modeType="default"
                                            bold={true}
                                            style={{
                                                // width: '100%',
                                                marginVertical: 16,
                                                alignSelf: 'center',
                                            }}
                                            onPress={() =>
                                                this.openExploreCommunities()
                                            }
                                        >
                                            {/* <Text
                                                style={{
                                                    fontWeight: 'bold',
                                                    fontSize: 20,
                                                    lineHeight: 24,
                                                    color: 'white'
                                                }}
                                            >
                                            </Text> */}
                                            {i18n.t('exploreCommunities')}
                                        </Button>
                                    </View>
                                </View>
                            </PaperProvider>
                        )}
                    </SafeAreaConsumer>
                </SafeAreaProvider>
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
                                name="EditProfile"
                                component={EditProfile}
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
                                name="LoginScreen"
                                component={LoginScreen}
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
        // TODO: verify version
        // this.setState({ blockUserToUpdateApp: true });
        await this._authUser();
        this.setState({ isAppReady: true });
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
            const firstTime = await AsyncStorage.getItem(
                STORAGE_USER_FIRST_TIME
            );
            this.setState({
                firstTimeUser: firstTime === null,
                loggedIn: address !== null && phoneNumber !== null,
            });
        } catch (error) {
            writeLog({
                action: 'auth_user',
                details: error.message,
            });
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
    };
}
