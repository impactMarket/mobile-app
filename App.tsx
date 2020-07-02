import React from 'react';
import './global';
import Web3 from 'web3'
import { newKitFromWeb3 } from "@celo/contractkit";
import {
    Image,
    View,
    YellowBox,
    AsyncStorage,
    StatusBar,
} from 'react-native';
import * as Font from 'expo-font';

import {
    AppLoading,
    SplashScreen,
} from 'expo';
import { Asset } from 'expo-asset';
import { NavigationContainer, DefaultTheme as NavigationDefaultTheme } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { createStore, Unsubscribe } from 'redux';
import userReducer from './helpers/redux/reducers/ReduxReducers';
import {
    setUserCeloInfo,
    setCeloKit,
    setUserInfo,
} from './helpers/redux/actions/ReduxActions';
import {
    STORAGE_USER_ADDRESS,
    STORAGE_USER_PHONE_NUMBER,
    STORAGE_USER_FIRST_TIME,
} from './helpers/types';
import {
    DefaultTheme,
    Provider as PaperProvider,
    configureFonts,
    Text,
    Button,
} from 'react-native-paper';
import config from './config';
import BigNumber from 'bignumber.js';
import { iptcColors, loadContracts } from './helpers';
import { SafeAreaProvider, SafeAreaConsumer } from 'react-native-safe-area-context';
import { createStackNavigator } from '@react-navigation/stack';
import Tabs from './views/Tabs';

import UserShowScanQRScreen from './views/common/UserShowScanQRScreen';
import CommunityDetailsScreen from './views/common/CommunityDetailsScreen';
import CreateCommunityScreen from './views/common/CreateCommunityScreen';
import EditProfile from './views/wallet/EditProfile';
import AddedScreen from './views/community/view/communitymanager/AddedScreen';
import RemovedScreen from './views/community/view/communitymanager/RemovedScreen';
import LoginScreen from './views/common/LoginScreen';
import { getExchangeRate, getUser } from './services/api';
import ClaimExplainedScreen from './views/community/view/beneficiary/ClaimExplainedScreen';
import FAQScreen from './views/common/FAQScreen';


const kit = newKitFromWeb3(new Web3(config.jsonRpc));
const Stack = createStackNavigator();
const store = createStore(userReducer);
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
        }
    })
};
const navigationTheme = {
    ...NavigationDefaultTheme,
    colors: {
        ...NavigationDefaultTheme.colors,
        primary: iptcColors.softBlue,
    },
};


YellowBox.ignoreWarnings(['Warning: The provided value \'moz', 'Warning: The provided value \'ms-stream']);


interface IAppState {
    isSplashReady: boolean;
    isAppReady: boolean;
    firstTimeUser: boolean;
    // loggedIn is not used anywhere, only forces update!
    loggedIn: boolean;
    testnetWarning: boolean;
}
export default class App extends React.Component<{}, IAppState> {
    private unsubscribeStore: Unsubscribe = undefined as any;

    constructor(props: any) {
        super(props);
        this.state = {
            isSplashReady: false,
            isAppReady: false,
            firstTimeUser: true,
            loggedIn: false,
            testnetWarning: false,
        }
    }

    componentDidMount = () => {
        this.unsubscribeStore = store.subscribe(() => {
            const previousLoggedIn = this.state.loggedIn;
            const currentLoggedIn = store.getState().user.celoInfo.address.length > 0;

            if (previousLoggedIn !== currentLoggedIn) {
                if (currentLoggedIn) {
                    this._authUser();
                }
                this.setState({ loggedIn: currentLoggedIn });
            }
        });
        setTimeout(() => this.setState({ testnetWarning: false }), 10000);
    }

    componentWillUnmount = () => {
        try {
            this.unsubscribeStore();
        } catch (e) { }
    }

    openExploreCommunities = async () => {
        await AsyncStorage.setItem(STORAGE_USER_FIRST_TIME, 'false');
        this.setState({ firstTimeUser: false });
    }

    render() {
        const {
            isAppReady,
            isSplashReady,
            firstTimeUser,
            testnetWarning,
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
                <View style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <Image
                        source={require('./assets/splash.png')}
                        onLoad={this._cacheResourcesAsync}
                    />
                </View>
            );
        }

        if (firstTimeUser) {
            return <SafeAreaProvider>
                <SafeAreaConsumer>{insets =>
                    <PaperProvider theme={theme}>
                        <View
                            style={{
                                paddingTop: insets?.top,
                                flex: 1,
                                flexDirection: 'column',
                                justifyContent: 'space-around',
                                alignItems: 'center'
                            }}
                        >
                            <Image
                                style={{ height: 82, maxWidth: '51%' }}
                                source={require('./assets/splash/logo.png')}
                            />
                            <Image
                                style={{ height: 136, maxWidth: '100%' }}
                                source={require('./assets/splash/diversity.png')}
                            />
                            <Text
                                style={{
                                    fontFamily: "Gelion-Regular",
                                    fontSize: 19,
                                    fontWeight: "normal",
                                    fontStyle: "normal",
                                    lineHeight: 26,
                                    letterSpacing: 0,
                                    textAlign: "center",
                                    color: "#172b4d",
                                    marginHorizontal: 40
                                }}
                            >
                                impactMarket enables any vulnerable community to create its own unconditional basic income system for their beneficiaries, where each member can claim a fixed amount on a regular basis and make payments for free
                            </Text>
                            <View>
                                <Text
                                    style={{
                                        fontFamily: "Gelion-Regular",
                                        fontSize: 19,
                                        fontWeight: "normal",
                                        fontStyle: "normal",
                                        lineHeight: 26,
                                        letterSpacing: 0,
                                        textAlign: "center",
                                        color: "#172b4d",
                                        marginHorizontal: 40
                                    }}
                                >
                                    Back those beneficiaries by donating to their communities.
                                </Text>
                                <Button
                                    mode="contained"
                                    style={{ width: '100%', alignSelf: 'center' }}
                                    onPress={() => this.openExploreCommunities()}
                                >
                                    Explore Communities
                                </Button>
                            </View>
                        </View>
                    </PaperProvider>
                }</SafeAreaConsumer>
            </SafeAreaProvider>
        }

        return (
            <PaperProvider theme={theme}>
                <Provider store={store}>
                    <StatusBar backgroundColor="rgba(0, 0, 0, 0.2)" translucent />
                    <View
                        style={{
                            backgroundColor: '#45c7ff',
                            width: '100%',
                            paddingTop: 40,
                            paddingBottom: 10,
                            paddingHorizontal: 20,
                            position: 'absolute',
                            zIndex: testnetWarning ? 1 : -1,
                        }}
                    >
                        <Text style={{ textAlign: 'center' }}>
                            A friendly reminder you're using the Alfajores network build - the balances are not real.
                        </Text>
                    </View>
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
                                name="UserShowScanQRScreen"
                                component={UserShowScanQRScreen}
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

    _getCurrentUserBalance = async (address: string) => {
        const stableToken = await kit.contracts.getStableToken()
        const cUSDBalanceBig = await stableToken.balanceOf(address)
        return new BigNumber(cUSDBalanceBig.toString());
    }

    _cacheSplashResourcesAsync = async () => {
        const gif = require('./assets/splash.png');
        return Asset.fromModule(gif).downloadAsync();
    };

    _cacheResourcesAsync = async () => {
        SplashScreen.hide();
        await Font.loadAsync({
            // Load a font `Montserrat` from a static resource
            // Montserrat: require('./assets/fonts/Montserrat.ttf'),

            // Any string can be used as the fontFamily name. Here we use an object to provide more control
            'Gelion-SemiBold': {
                uri: require('./fonts/FontGelion/Gelion-SemiBold.ttf'),
            },
            'Gelion-Bold': {
                uri: require('./fonts/FontGelion/Gelion-Bold.ttf'),
            },
            'Gelion-Regular': {
                uri: require('./fonts/FontGelion/Gelion-Regular.ttf'),
            },
            'Gelion-Medium': {
                uri: require('./fonts/FontGelion/Gelion-Medium.ttf'),
            },
            'Gelion-Light': {
                uri: require('./fonts/FontGelion/Gelion-Light.ttf'),
            },
            'Gelion-Thin': {
                uri: require('./fonts/FontGelion/Gelion-Thin.ttf'),
            },
        });
        await this._authUser();
        this.setState({ isAppReady: true });
    };

    _authUser = async () => {
        let address: string | null = '';
        let phoneNumber: string | null = '';
        try {
            address = await AsyncStorage.getItem(STORAGE_USER_ADDRESS);
            phoneNumber = await AsyncStorage.getItem(STORAGE_USER_PHONE_NUMBER);
            if (address !== null && phoneNumber !== null) {
                const balance = await this._getCurrentUserBalance(address);
                const user = await getUser(address);
                store.dispatch(setUserCeloInfo({ address, phoneNumber, balance: balance.toString() }))
                if (user !== undefined) {
                    let name = '';
                    let currency = 'USD';
                    let exchangeRate = 1;
                    if (user.username !== null) {
                        name = user.username;
                    }
                    if (user.currency !== null) {
                        currency = user.currency;
                        exchangeRate = await getExchangeRate(user.currency.toUpperCase());
                    }
                    store.dispatch(setUserInfo({ name, currency, exchangeRate }))
                }
                await loadContracts(address, kit, store);
                // We have data!!
            }
            const firstTime = await AsyncStorage.getItem(STORAGE_USER_FIRST_TIME);
            this.setState({
                firstTimeUser: firstTime === null,
                loggedIn: (address !== null && phoneNumber !== null),
                testnetWarning: (firstTime !== undefined || firstTime !== 'true')
            });
        } catch (error) {
            // Error retrieving data
        }
        store.dispatch(setCeloKit(kit))
    }
}
