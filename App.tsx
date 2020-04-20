import React from 'react';
import './global';
import { web3, kit } from './root'
import {
    Image,
    View,
    YellowBox,
    AsyncStorage,
} from 'react-native';

import { AntDesign } from '@expo/vector-icons';
import { AppLoading, SplashScreen } from 'expo';
import { Asset } from 'expo-asset';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeStackScreen from './tab/HomeStackScreen';
import Activity from './tab/activity/Activity';
import Community from './tab/community/Community';
import Settings from './tab/settings/Settings';
import { NavigationContainer } from '@react-navigation/native';
import Login from './components/Login';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import userReducer from './helpers/ReduxReducers';
import { setUserCeloInfo, setCeloKit, setImpactMarketContract, setCommunityContract } from './helpers/ReduxActions';
import { STORAGE_USER_ADDRESS, STORAGE_USER_PHONE_NUMBER, IUserCeloInfo, STORAGE_STATUS_LOGIN_NOT_NOW, ILoginCallbackAnswer } from './helpers/types';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { ContractKit } from '@celo/contractkit/lib/kit';
import { ethers } from 'ethers';
import { ImpactMarketInstance } from './contracts/types/truffle-contracts';
import ImpactMarketContractABI from './contracts/ImpactMarketABI.json'
import CommunityContractABI from './contracts/CommunityABI.json'
import ContractAddresses from './contracts/network.json';
import Explore from './tab/explore/Explore';


const Tab = createBottomTabNavigator();
const store = createStore(userReducer);
const theme = {
    ...DefaultTheme,
    roundness: 2,
    colors: {
        ...DefaultTheme.colors,
        primary: '#ffffff',
        accent: '#f1c40f',
    },
};


YellowBox.ignoreWarnings(['Warning: The provided value \'moz', 'Warning: The provided value \'ms-stream']);


interface IAppState {
    isSplashReady: boolean;
    isAppReady: boolean;
    loggedIn: boolean;
    loginNotNow: boolean;
}
export default class App extends React.Component<{}, IAppState> {

    constructor(props: any) {
        super(props);
        this.state = {
            isSplashReady: false,
            isAppReady: false,
            loggedIn: false,
            loginNotNow: false,
        }
    }

    loginCallback = async (loginCallbackAnswer: ILoginCallbackAnswer) => {
        try {
            if (loginCallbackAnswer.celoInfo !== undefined) {
                await AsyncStorage.setItem(STORAGE_USER_ADDRESS, loginCallbackAnswer.celoInfo.address);
                await AsyncStorage.setItem(STORAGE_USER_PHONE_NUMBER, loginCallbackAnswer.celoInfo.phoneNumber);
                store.dispatch(setUserCeloInfo({
                    address: loginCallbackAnswer.celoInfo.address,
                    phoneNumber: loginCallbackAnswer.celoInfo.phoneNumber
                }))
                this.setState({ loggedIn: true });
            } else if (loginCallbackAnswer.loginNotNow !== undefined) {
                await AsyncStorage.setItem(STORAGE_STATUS_LOGIN_NOT_NOW, loginCallbackAnswer.loginNotNow.toString());
                this.setState({ loginNotNow: true });
            }
            store.dispatch(setCeloKit(kit));
        } catch (error) {
            // Error saving data
        }
    }

    render() {
        const { isAppReady, isSplashReady, loggedIn, loginNotNow } = this.state;
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

        if (loginNotNow) {
            return <Provider store={store}><Explore /></Provider>
        }

        if (!loggedIn) {
            return <Login loginCallback={this.loginCallback} />
        }

        return (
            <PaperProvider theme={theme}>
                <Provider store={store}>
                    <NavigationContainer>
                        <Tab.Navigator>
                            <Tab.Screen
                                name="Home"
                                component={HomeStackScreen}
                                options={{
                                    tabBarIcon: (props: any) => (
                                        <AntDesign name="home" size={props.size} color={props.color} />
                                    ),
                                }}
                            />
                            <Tab.Screen
                                name="Community"
                                component={Community}
                                options={{
                                    tabBarIcon: (props: any) => (
                                        <AntDesign name="team" size={props.size} color={props.color} />
                                    ),
                                }}
                            />
                            <Tab.Screen
                                name="Activity"
                                component={Activity}
                                options={{
                                    tabBarIcon: (props: any) => (
                                        <AntDesign name="retweet" size={props.size} color={props.color} />
                                    ),
                                }}
                            />
                            <Tab.Screen
                                name="Settings"
                                component={Settings}
                                options={{
                                    tabBarIcon: (props: any) => (
                                        <AntDesign name="setting" size={props.size} color={props.color} />
                                    ),
                                }}
                            />
                        </Tab.Navigator>
                    </NavigationContainer>
                </Provider>
            </PaperProvider>
        );
    }

    _cacheSplashResourcesAsync = async () => {
        const gif = require('./assets/splash.png');
        return Asset.fromModule(gif).downloadAsync();
    };

    _cacheResourcesAsync = async () => {
        SplashScreen.hide();
        let address: string | null = '';
        let phoneNumber: string | null = '';
        try {
            address = await AsyncStorage.getItem(STORAGE_USER_ADDRESS);
            phoneNumber = await AsyncStorage.getItem(STORAGE_USER_PHONE_NUMBER);
            if (address !== null && phoneNumber !== null) {
                store.dispatch(setUserCeloInfo({ address, phoneNumber }))
                store.dispatch(setCeloKit(kit));
                await this._loadContracts(address, kit);
                // We have data!!
                this.setState({ loggedIn: true });
            }
        } catch (error) {
            // Error retrieving data
        }
        store.dispatch(setCeloKit(kit))
        this.setState({ isAppReady: true });
    };

    _loadContracts = async (address: string, kit: ContractKit) => {
        const provider = new ethers.providers.Web3Provider(kit.web3.currentProvider as any);
        const impactMarketContract = new ethers.Contract(
            ContractAddresses.alfajores.ImpactMarket,
            ImpactMarketContractABI,
            provider,
        ) as ethers.Contract & ImpactMarketInstance;
        const logs = await provider.getLogs({
            address: ContractAddresses.alfajores.ImpactMarket,
            fromBlock: 0,
            topics: [ethers.utils.id("CommunityAdded(address)")]
        })
        // change the following to support multiple communities
        const communityAddress = ethers.utils
            .getAddress(logs[0].topics[1].slice(26, logs[0].topics[1].length));
        const communityContract = new kit.web3.eth.Contract(
            CommunityContractABI as any,
            communityAddress,
        );
        store.dispatch(setImpactMarketContract(impactMarketContract));
        store.dispatch(setCommunityContract(communityContract));
        // const isBeneficiary = await communityContract.beneficiaries(address);
        // TODO: set isBeneficiary 
    }
}
