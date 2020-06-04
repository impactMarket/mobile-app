import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import WalletScreen from './wallet';
import UserShowScanQRScreen from './common/UserShowScanQRScreen';

import CommunitiesScreen from './communities/CommunitiesScreen';
import CommunityDetailsScreen from './common/CommunityDetailsScreen';
import CreateCommunityScreen from './common/CreateCommunityScreen';

import PayScreen from './pay';
import EditProfile from './wallet/EditProfile';
import CommunityManagerView from './community/view/communitymanager';
import AddedScreen from './community/view/communitymanager/AddedScreen';
import RemovedScreen from './community/view/communitymanager/RemovedScreen';



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

const WalletStack = createStackNavigator();

export function WalletStackScreen() {
    return (
        <WalletStack.Navigator>
            <WalletStack.Screen
                options={{
                    headerShown: false,
                }}
                name="WalletScreen"
                component={WalletScreen}
            />
            <WalletStack.Screen
                options={{
                    headerShown: false,
                }}
                name="EditProfile"
                component={EditProfile}
            />
        </WalletStack.Navigator>
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
                options={{
                    headerShown: false,
                }}
                name="CommunityDetailsScreen"
                component={CommunityDetailsScreen}
            />
            <CommunitiesStack.Screen
                options={{
                    headerShown: false,
                }}
                name="CreateCommunityScreen"
                component={CreateCommunityScreen}
            />
        </CommunitiesStack.Navigator>
    );
}

const CommunityManagerStack = createStackNavigator();

export function CommunityManagerStackSreen() {
    return (
        <CommunityManagerStack.Navigator>
            <CommunityManagerStack.Screen
                options={{
                    headerShown: false
                }}
                name="CommunityManager"
                component={CommunityManagerView}
            />
            <CommunityManagerStack.Screen
                options={{
                    headerShown: false
                }}
                name="AddedScreen"
                component={AddedScreen}
            />
            <CommunityManagerStack.Screen
                name="RemovedScreen"
                component={RemovedScreen}
            />
            <CommunitiesStack.Screen
                options={{
                    headerShown: false
                }}
                name="CommunityDetailsScreen"
                component={CommunityDetailsScreen}
            />
            <CommunitiesStack.Screen
                options={{
                    headerShown: false
                }}
                name="CreateCommunityScreen"
                component={CreateCommunityScreen}
            />
        </CommunityManagerStack.Navigator>
    );
}