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

import {
    Fontisto,
    MaterialIcons,
    FontAwesome,
    MaterialCommunityIcons,
} from '@expo/vector-icons';
import {
    AppLoading,
    SplashScreen,
} from 'expo';
import { Asset } from 'expo-asset';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CommunityStackScreen from './views/CommunityStackScreen';
import Activity from './views/activity/Activity';
import Settings from './views/account/Account';
import { NavigationContainer } from '@react-navigation/native';
import Login from './components/Login';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import userReducer from './helpers/redux/reducers/ReduxReducers';
import {
    setUserCeloInfo,
    setCeloKit,
    setImpactMarketContract,
    setCommunityContract,
    setUserFirstTime,
    setUserIsBeneficiary,
    setUserIsCommunityManager,
} from './helpers/redux/actions/ReduxActions';
import {
    STORAGE_USER_ADDRESS,
    STORAGE_USER_PHONE_NUMBER,
    STORAGE_USER_FIRST_TIME,
} from './helpers/types';
import {
    DefaultTheme,
    Provider as PaperProvider,
} from 'react-native-paper';
import { ContractKit } from '@celo/contractkit/lib/kit';
import { ethers } from 'ethers';
import { ImpactMarketInstance } from './contracts/types/truffle-contracts';
import ImpactMarketContractABI from './contracts/ImpactMarketABI.json'
import CommunityContractABI from './contracts/CommunityABI.json'
import CommunitiesStackScreen from './views/CommunitiesStackScreen';
import MyCircleStackScreen from './views/MyCircleStackScreen';
import config from './config';
import {
    findComunityToBeneficicary,
    findComunityToManager,
} from './services';


const kit = newKitFromWeb3(new Web3(config.jsonRpc));
const Tab = createBottomTabNavigator();
const store = createStore(userReducer);
const theme = {
    ...DefaultTheme,
    roundness: 4,
    colors: {
        ...DefaultTheme.colors,
    },
};


YellowBox.ignoreWarnings(['Warning: The provided value \'moz', 'Warning: The provided value \'ms-stream']);


interface IAppState {
    isSplashReady: boolean;
    isAppReady: boolean;
    firstTimeUser: boolean;
}
export default class App extends React.Component<{}, IAppState> {

    constructor(props: any) {
        super(props);
        this.state = {
            isSplashReady: false,
            isAppReady: false,
            firstTimeUser: true,
        }
        store.subscribe(() => {
            const previousValue = this.state.firstTimeUser
            const currentValue = store.getState().user.firstTime;

            if (previousValue !== currentValue) {
                if (currentValue === false &&
                    store.getState().user.celoInfo.address.length > 0) {
                    this._authUser();
                }
                this.setState({ firstTimeUser: currentValue });
            }
        })
    }

    render() {
        const { isAppReady, isSplashReady, firstTimeUser } = this.state;
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
            return <Provider store={store}>
                <Login />
            </Provider>
        }

        return (
            <PaperProvider theme={theme}>
                <Provider store={store}>
                    <StatusBar backgroundColor="rgba(0, 0, 0, 0.2)" translucent />
                    <NavigationContainer>
                        <Tab.Navigator>
                            <Tab.Screen
                                name="My Circle"
                                component={MyCircleStackScreen}
                                options={{
                                    tabBarIcon: (props: any) => (
                                        <FontAwesome name="circle-o-notch" size={props.size} color={props.color} />
                                    ),
                                }}
                            />
                            <Tab.Screen
                                name="Communities"
                                component={CommunitiesStackScreen}
                                options={{
                                    tabBarIcon: (props: any) => (
                                        <MaterialCommunityIcons name="account-group" size={props.size} color={props.color} />
                                    ),
                                }}
                            />
                            <Tab.Screen
                                name="Pay"
                                component={Activity}
                                options={{
                                    tabBarIcon: (props: any) => (
                                        <MaterialIcons name="attach-money" size={props.size} color={props.color} />
                                    ),
                                }}
                            />
                            <Tab.Screen
                                name="Account"
                                component={Settings}
                                options={{
                                    tabBarIcon: (props: any) => (
                                        <Fontisto name="wallet" size={props.size} color={props.color} />
                                    ),
                                }}
                            />
                        </Tab.Navigator>
                    </NavigationContainer>
                </Provider>
            </PaperProvider>
        );
    }

    _getCurrentUserBalance = async (address: string) => {
        const stableToken = await kit.contracts.getStableToken()

        const [cUSDBalanceBig, cUSDDecimals] = await Promise.all(
            [stableToken.balanceOf(address), stableToken.decimals()]
        )
        let cUSDBalance = cUSDBalanceBig.div(10 ** cUSDDecimals).toFixed(2)
        return cUSDBalance;
    }

    _cacheSplashResourcesAsync = async () => {
        const gif = require('./assets/splash.png');
        return Asset.fromModule(gif).downloadAsync();
    };

    _cacheResourcesAsync = async () => {
        SplashScreen.hide();
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
                store.dispatch(setUserCeloInfo({ address, phoneNumber, balance }))
                await this._loadContracts(address, kit);
                // We have data!!
            }
            const firstTime = await AsyncStorage.getItem(STORAGE_USER_FIRST_TIME);
            this.setState({
                firstTimeUser: firstTime === null
            });
            store.dispatch(setUserFirstTime(firstTime !== 'false'));
        } catch (error) {
            // Error retrieving data
        }
        store.dispatch(setCeloKit(kit))
    }

    _loadContracts = async (address: string, kit: ContractKit) => {
        const isBeneficiary = await findComunityToBeneficicary(address);
        const isCoordinator = await findComunityToManager(address);

        const setCommunity = (address: string) => {
            const communityContract = new kit.web3.eth.Contract(
                CommunityContractABI as any,
                address,
            );
            store.dispatch(setCommunityContract(communityContract));
        };
        if (isBeneficiary !== undefined) {
            store.dispatch(setUserIsBeneficiary(true));
            setCommunity(isBeneficiary.contractAddress);
        }
        else if (isCoordinator !== undefined) {
            store.dispatch(setUserIsCommunityManager(true));
            setCommunity(isCoordinator.contractAddress);
        }

        const provider = new ethers.providers.Web3Provider(kit.web3.currentProvider as any);
        const impactMarketContract = new ethers.Contract(
            config.impactMarketContractAddress,
            ImpactMarketContractABI,
            provider,
        ) as ethers.Contract & ImpactMarketInstance;
        store.dispatch(setImpactMarketContract(impactMarketContract));
    }
}
