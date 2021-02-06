import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
    getFocusedRouteNameFromRoute,
    RouteProp,
} from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import i18n from 'assets/i18n';
import { Screens } from 'helpers/constants';
import { IRootState } from 'helpers/types/state';
import React, { useLayoutEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import CommunitiesScreen from 'views/communities';
import BeneficiaryScreen from 'views/community/beneficiary';
import CommunityManagerScreen from 'views/community/manager';
import ProfileScreen from 'views/profile';
import Login from 'views/profile/auth';

import Beneficiary from './header/Beneficiary';
import CommunityManager from './header/CommunityManager';
import CreateCommunity from './header/CreateCommunity';
import Logout from './header/Logout';

function getHeaderTitle(route: RouteProp<any, any>, defaultValue: string) {
    let routeName = getFocusedRouteNameFromRoute(route);
    if (routeName === undefined) {
        routeName = defaultValue;
    }

    switch (routeName) {
        case Screens.Beneficiary:
            return i18n.t('claim');
        case Screens.CommunityManager:
            return i18n.t('manage');
        case Screens.Communities:
            return i18n.t('communities');
        case Screens.Profile:
            return i18n.t('profile');
    }
}
function getHeaderRight(
    route: RouteProp<any, any>,
    navigation: StackNavigationProp<any, any>,
    defaultValue: string
) {
    let routeName = getFocusedRouteNameFromRoute(route);
    if (routeName === undefined) {
        routeName = defaultValue;
    }

    switch (routeName) {
        case Screens.Beneficiary:
            return <Beneficiary />;
        case Screens.CommunityManager:
            return <CommunityManager />;
        case Screens.Communities:
            return <CreateCommunity navigation={navigation} />;
        case Screens.Profile:
            return <Logout />;
    }
}

const Tab = createBottomTabNavigator();

function TabNavigator({
    route,
    navigation,
}: {
    route: RouteProp<any, any>;
    navigation: StackNavigationProp<any, any>;
}) {
    const insets = useSafeAreaInsets();
    const isManager = useSelector(
        (state: IRootState) => state.user.community.isManager
    );
    const isBeneficiary = useSelector(
        (state: IRootState) => state.user.community.isBeneficiary
    );
    const fromWelcomeScreen = useSelector(
        (state: IRootState) => state.app.fromWelcomeScreen
    );
    const userWallet = useSelector((state: IRootState) => state.user.wallet);

    useLayoutEffect(() => {
        const routeName = getFocusedRouteNameFromRoute(route);
        navigation.setOptions({
            headerTitle: getHeaderTitle(
                route,
                isBeneficiary
                    ? Screens.Beneficiary
                    : isManager
                    ? Screens.CommunityManager
                    : Screens.Communities
            ),
            headerShown: !(
                (routeName === undefined &&
                    fromWelcomeScreen === Screens.Auth) ||
                routeName === Screens.Auth
            ),
            headerRight: () =>
                getHeaderRight(
                    route,
                    navigation,
                    isBeneficiary
                        ? Screens.Beneficiary
                        : isManager
                        ? Screens.CommunityManager
                        : Screens.Communities
                ),
        });
    }, [navigation, route]);

    const tabBeneficiary = (
        <Tab.Screen
            name={Screens.Beneficiary}
            component={BeneficiaryScreen}
            options={BeneficiaryScreen.navigationOptions}
        />
    );
    const tabManager = (
        <Tab.Screen
            name={Screens.CommunityManager}
            component={CommunityManagerScreen}
            options={CommunityManagerScreen.navigationOptions}
        />
    );
    const tabCommunities = (
        <Tab.Screen
            name={Screens.Communities}
            component={CommunitiesScreen}
            options={CommunitiesScreen.navigationOptions}
        />
    );
    const tabProfile = (
        <Tab.Screen
            name={Screens.Profile}
            component={ProfileScreen}
            options={ProfileScreen.navigationOptions}
        />
    );
    const tabAuth = (
        <Tab.Screen
            name={Screens.Auth}
            component={Login}
            options={ProfileScreen.navigationOptions}
        />
    );
    return (
        <Tab.Navigator
            tabBarOptions={{
                labelStyle: {
                    fontFamily: 'Gelion-Regular',
                    fontSize: 15,
                    lineHeight: 18,
                    letterSpacing: 0.212727,
                },
                tabStyle: {
                    marginVertical: 16,
                },
                style: { height: 84 + insets.bottom },
            }}
            initialRouteName={fromWelcomeScreen}
        >
            {isBeneficiary && tabBeneficiary}
            {isManager && tabManager}
            {!isBeneficiary && !isManager && tabCommunities}
            {userWallet.address.length === 0 ? tabAuth : tabProfile}
        </Tab.Navigator>
    );
}

export default TabNavigator;
