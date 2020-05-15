import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import PayScreen from './pay/PayScreen';
import UserShowScanQRScreen from './UserShowScanQRScreen';



const PayStackScreen = createStackNavigator();

export default function PayStackScreenScreen() {
    return (
        <PayStackScreen.Navigator>
            <PayStackScreen.Screen
                options={{
                    headerShown: false,
                }}
                name="PayScreen"
                component={PayScreen}
            />
            <PayStackScreen.Screen
                name="UserShowScanQRScreen"
                component={UserShowScanQRScreen}
            />
        </PayStackScreen.Navigator>
    );
}