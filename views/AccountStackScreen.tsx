import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AccountScreen from './account/AccountScreen';
import UserShowScanQRScreen from './UserShowScanQRScreen';



const AccountStackScreen = createStackNavigator();

export default function AccountStackScreenScreen() {
    return (
        <AccountStackScreen.Navigator>
            <AccountStackScreen.Screen
                options={{
                    headerShown: false,
                }}
                name="AccountScreen"
                component={AccountScreen}
            />
            <AccountStackScreen.Screen
                name="UserShowScanQRScreen"
                component={UserShowScanQRScreen}
            />
        </AccountStackScreen.Navigator>
    );
}