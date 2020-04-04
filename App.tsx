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
import Community from './tab/Community';
import Account from './tab/Account';
import { NavigationContainer } from '@react-navigation/native';
import Login from './components/Login';

const Tab = createBottomTabNavigator();


YellowBox.ignoreWarnings(['Warning: The provided value \'moz', 'Warning: The provided value \'ms-stream']);


interface IAppState {
    isSplashReady: boolean;
    isAppReady: boolean;
    loggedIn: boolean;
    account: string;
    phoneNumber: string;
}
export default class App extends React.Component<{}, IAppState> {

    constructor(props: any) {
        super(props);
        this.state = {
            isSplashReady: false,
            isAppReady: false,
            loggedIn: false,
            account: '',
            phoneNumber: '',
        }
    }

    loginCallback = (account: string) => {
        this.setState({ loggedIn: true, account });
    }

    render() {
        const { loggedIn, isAppReady, isSplashReady, account } = this.state;
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
            return <Login kit={kit} loginCallback={this.loginCallback} />
        }

        return (
            <NavigationContainer>
                <Tab.Navigator>
                    <Tab.Screen
                        name="Home"
                        component={Home}
                        initialParams={{kit, web3, account}}
                        options={{
                            tabBarIcon: ({ color, size }) => (
                                <AntDesign name="isv" size={size} color={color} />
                            ),
                        }}
                    />
                    <Tab.Screen
                        name="Community"
                        component={Community}
                        options={{
                            tabBarIcon: ({ color, size }) => (
                                <AntDesign name="team" size={size} color={color} />
                            ),
                        }}
                    />
                    <Tab.Screen
                        name="Account"
                        component={Account}
                        initialParams={{props: { kit, account }}}
                        options={{
                            tabBarIcon: ({ color, size }) => (
                                <AntDesign name="user" size={size} color={color} />
                            ),
                        }}
                    />
                </Tab.Navigator>
            </NavigationContainer>
        );
    }

    _cacheSplashResourcesAsync = async () => {
        const gif = require('./assets/splash.png');
        return Asset.fromModule(gif).downloadAsync();
    };

    _cacheResourcesAsync = async () => {
        SplashScreen.hide();
        let account: string | null = '';
        let phoneNumber: string | null = '';
        try {
            account = await AsyncStorage.getItem('ACCOUNT');
            phoneNumber = await AsyncStorage.getItem('PHONENUMBER');
            if (account !== null && phoneNumber !== null) {
                // We have data!!
                this.setState({ loggedIn: true, account, phoneNumber });
            }
        } catch (error) {
            // Error retrieving data
        }
        this.setState({ isAppReady: true });
    };
}
