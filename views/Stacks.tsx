import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AccountScreen from './account/AccountScreen';
import UserShowScanQRScreen from './common/UserShowScanQRScreen';

import CommunitiesScreen from './communities/CommunitiesScreen';
import CommunityDetailsScreen from './communities/CommunityDetailsScreen';

import CommunityScreen from './community/CommunityScreen';
import ClaimExplainedScreen from './community/ClaimExplainedScreen';

import MyCircleScreen from './mycircle/MyCircleScreen';
import CreateCommunityScreen from './common/CreateCommunityScreen';

import PayScreen from './pay/PayScreen';



const PayStack = createStackNavigator();

export function PayStackScreen() {
    return (
        <PayStack.Navigator>
            <PayStack.Screen
                options={{
                    headerShown: false,
                }}
                name="PayScreen"
                component={PayScreen}
            />
            <PayStack.Screen
                name="UserShowScanQRScreen"
                component={UserShowScanQRScreen}
            />
        </PayStack.Navigator>
    );
}

const AccountStack = createStackNavigator();

export function AccountStackScreen() {
    return (
        <AccountStack.Navigator>
            <AccountStack.Screen
                options={{
                    headerShown: false,
                }}
                name="AccountScreen"
                component={AccountScreen}
            />
            <AccountStack.Screen
                name="UserShowScanQRScreen"
                component={UserShowScanQRScreen}
            />
        </AccountStack.Navigator>
    );
}

const CommunitiesStack = createStackNavigator();

export function CommunitiesStackScreen() {
    return (
        <CommunitiesStack.Navigator>
            <CommunitiesStack.Screen
                options={{
                    headerShown: false
                }}
                name="CommunitiesScreen"
                component={CommunitiesScreen}
            />
            <CommunitiesStack.Screen
                name="CommunityDetailsScreen"
                component={CommunityDetailsScreen}
            />
            <CommunitiesStack.Screen
                name="CreateCommunityScreen"
                component={CreateCommunityScreen}
            />
        </CommunitiesStack.Navigator>
    );
}

const CommunityStack = createStackNavigator();

export function CommunityStackScreen() {
    return (
        <CommunityStack.Navigator>
            <CommunityStack.Screen
                options={{
                    headerShown: false
                }}
                name="CommunityScreen"
                component={CommunityScreen}
            />
            <CommunityStack.Screen
                name="ClaimExplainedScreen"
                component={ClaimExplainedScreen}
            />
        </CommunityStack.Navigator>
    );
}

const MyCircleStack = createStackNavigator();

export function MyCircleStackScreen() {
    return (
        <MyCircleStack.Navigator>
            <MyCircleStack.Screen
                options={{
                    headerShown: false
                }}
                name="MyCircleScreen"
                component={MyCircleScreen}
            />
            <MyCircleStack.Screen
                name="CreateCommunityScreen"
                component={CreateCommunityScreen}
            />
        </MyCircleStack.Navigator>
    );
}