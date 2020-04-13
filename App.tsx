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
import Home from './tab/Home';
import Activity from './tab/Activity';
import Send from './tab/Send';
import Account from './tab/Account';
import { NavigationContainer } from '@react-navigation/native';
import Login from './components/Login';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import userReducer from './helpers/ReduxReducers';
import { setUserCeloInfo, setCeloKit } from './helpers/ReduxActions';
import { STORAGE_USER_ADDRESS, STORAGE_USER_PHONE_NUMBER, IUserCeloInfo } from './helpers/types';


const Tab = createBottomTabNavigator();
const store = createStore(userReducer);


YellowBox.ignoreWarnings(['Warning: The provided value \'moz', 'Warning: The provided value \'ms-stream']);


interface IAppState {
    isSplashReady: boolean;
    isAppReady: boolean;
    loggedIn: boolean;
}
export default class App extends React.Component<{}, IAppState> {

    constructor(props: any) {
        super(props);
        this.state = {
            isSplashReady: false,
            isAppReady: false,
            loggedIn: false,
        }
    }

    loginCallback = async (userCeloInfo: IUserCeloInfo) => {
        try {
            await AsyncStorage.setItem(STORAGE_USER_ADDRESS, userCeloInfo.address);
            await AsyncStorage.setItem(STORAGE_USER_PHONE_NUMBER, userCeloInfo.phoneNumber);
            store.dispatch(setUserCeloInfo({ address: userCeloInfo.address, phoneNumber: userCeloInfo.phoneNumber }))
            store.dispatch(setCeloKit(kit));
        } catch (error) {
            // Error saving data
        }
        this.setState({ loggedIn: true });
    }

    render() {
        const { isAppReady, isSplashReady, loggedIn } = this.state;
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

        if (!loggedIn) {
            return <Login loginCallback={this.loginCallback} />
        }

        return (
            <Provider store={store}>
                <NavigationContainer>
                    <Tab.Navigator>
                        <Tab.Screen
                            name="Home"
                            component={Home}
                            options={{
                                tabBarIcon: ({ color, size }) => (
                                    <AntDesign name="download" size={size} color={color} />
                                ),
                            }}
                        />
                        <Tab.Screen
                            name="Activity"
                            component={Activity}
                            options={{
                                tabBarIcon: ({ color, size }) => (
                                    <AntDesign name="retweet" size={size} color={color} />
                                ),
                            }}
                        />
                        <Tab.Screen
                            name="Send"
                            component={Send}
                            options={{
                                tabBarIcon: ({ color, size }) => (
                                    <AntDesign name="arrowup" size={size} color={color} />
                                ),
                            }}
                        />
                        <Tab.Screen
                            name="Account"
                            component={Account}
                            options={{
                                tabBarIcon: ({ color, size }) => (
                                    <AntDesign name="setting" size={size} color={color} />
                                ),
                            }}
                        />
                    </Tab.Navigator>
                </NavigationContainer>
            </Provider>
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
                // We have data!!
                this.setState({ loggedIn: true });
            }
        } catch (error) {
            // Error retrieving data
        }
        store.dispatch(setCeloKit(kit))
        this.setState({ isAppReady: true });
    };
}
