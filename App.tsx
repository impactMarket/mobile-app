import React from 'react';
import './global';
import { Image, View, YellowBox, AsyncStorage, StatusBar } from 'react-native';
import {
    DefaultTheme,
    Provider as PaperProvider,
    configureFonts,
    Text,
    Button,
    IconButton,
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
import CommunityDetailsScreen from './src/views/common/CommunityDetailsScreen';
import CreateCommunityScreen from './src/views/common/CreateCommunityScreen';
import FAQScreen from './src/views/common/FAQScreen';
import LoginScreen from './src/views/common/LoginScreen';
import ClaimExplainedScreen from './src/views/community/view/beneficiary/ClaimExplainedScreen';
import AddedScreen from './src/views/community/view/communitymanager/AddedScreen';
import RemovedScreen from './src/views/community/view/communitymanager/RemovedScreen';
import EditProfile from './src/views/wallet/EditProfile';
import CommunityContractABI from './src/contracts/CommunityABI.json';

BigNumber.config({ DECIMAL_PLACES: 55 });
const kit = newKitFromWeb3(new Web3(config.jsonRpc));
const Stack = createStackNavigator();
const store = createStore(combinedReducer);
const theme = {
    ...DefaultTheme,
    roundness: 4,
    colors: {
        ...DefaultTheme.colors,
        primary: iptcColors.softBlue,
    },
    fonts: configureFonts({
        default: {
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
        },
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
    enableInExpoDevelopment: true,
    debug: true,
});

interface IAppState {
    isSplashReady: boolean;
    isAppReady: boolean;
    firstTimeUser: boolean;
    // loggedIn is not used anywhere, only forces update!
    loggedIn: boolean;
    testnetWarningOpen: boolean;
}
export default class App extends React.Component<object, IAppState> {
    private unsubscribeStore: Unsubscribe = undefined as any;

    constructor(props: any) {
        super(props);
        this.state = {
            isSplashReady: false,
            isAppReady: false,
            firstTimeUser: true,
            loggedIn: false,
            testnetWarningOpen: false,
        };
    }

    componentDidMount = () => {
        this.unsubscribeStore = store.subscribe(() => {
            const previousLoggedIn = this.state.loggedIn;
            const currentLoggedIn =
                store.getState().user.celoInfo.address.length > 0;

            if (previousLoggedIn !== currentLoggedIn) {
                const notificationListener = (
                    notification: Notifications.Notification
                ) => {
                    const action = (notification.request.content.data
                        .body as any).action;
                    if (action === 'community-accepted') {
                        Api.findComunityToManager(
                            store.getState().user.celoInfo.address
                        ).then((isManager) => {
                            if (isManager !== undefined) {
                                // TODO: add store listener, wait until it's done, go to main page
                                store.dispatch(setUserIsCommunityManager(true));
                                const communityContract = new kit.web3.eth.Contract(
                                    CommunityContractABI as any,
                                    isManager.contractAddress
                                );
                                store.dispatch(setCommunity(isManager));
                                store.dispatch(
                                    setCommunityContract(communityContract)
                                );
                            }
                        });
                    } else if (action === 'beneficiary-added') {
                        Api.findComunityToBeneficicary(
                            store.getState().user.celoInfo.address
                        ).then((isBeneficiary) => {
                            if (isBeneficiary !== undefined) {
                                // TODO: add store listener, wait until it's done, go to main page
                                store.dispatch(setUserIsBeneficiary(true));
                                const communityContract = new kit.web3.eth.Contract(
                                    CommunityContractABI as any,
                                    isBeneficiary.contractAddress
                                );
                                store.dispatch(setCommunity(isBeneficiary));
                                store.dispatch(
                                    setCommunityContract(communityContract)
                                );
                            }
                        });
                    }
                };

                if (currentLoggedIn) {
                    Notifications.addNotificationReceivedListener(
                        notificationListener
                    );
                    Notifications.addNotificationResponseReceivedListener(
                        (response) =>
                            notificationListener(response.notification)
                    );
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

    render() {
        const {
            isAppReady,
            isSplashReady,
            firstTimeUser,
            testnetWarningOpen,
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
                                            mode="contained"
                                            style={{
                                                width: '100%',
                                                alignSelf: 'center',
                                            }}
                                            onPress={() =>
                                                this.openExploreCommunities()
                                            }
                                        >
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
                    <NavigationContainer theme={navigationTheme}>
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
        await this._authUser();
        this.setState({ isAppReady: true });
    };

    _authUser = async () => {
        const pushNotificationsToken = await registerForPushNotifications();
        store.dispatch(setPushNotificationsToken(pushNotificationsToken));

        let address: string | null = '';
        let phoneNumber: string | null = '';
        // TODO: what happens when it goes to catch?
        try {
            address = await AsyncStorage.getItem(STORAGE_USER_ADDRESS);
            phoneNumber = await AsyncStorage.getItem(STORAGE_USER_PHONE_NUMBER);
            if (address !== null && phoneNumber !== null) {
                const user = await Api.welcome(address, pushNotificationsToken);
                if (user !== undefined) {
                    await welcomeUser(address, phoneNumber, user, kit, store);
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
            // Error retrieving data
        }
    };
}
