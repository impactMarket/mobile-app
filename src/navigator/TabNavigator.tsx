import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
    getFocusedRouteNameFromRoute,
    RouteProp,
} from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import i18n from 'assets/i18n';
import BackSvg from 'components/svg/header/BackSvg';
import { Screens } from 'helpers/constants';
import { CommunityAttributes } from 'helpers/types/models';
import { IRootState } from 'helpers/types/state';
import React, { useLayoutEffect, useState } from 'react';
import { Platform, Dimensions, Animated } from 'react-native';
import { Host } from 'react-native-portalize';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { ipctColors } from 'styles/index';
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
    defaultValue: string,
    isManagerOrBeneficiary: boolean,
    userCommunity: CommunityAttributes
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
            if (!isManagerOrBeneficiary) {
                return (
                    <CreateCommunity
                        navigation={navigation}
                        userCommunity={userCommunity}
                    />
                );
            }
            return;
        case Screens.Profile:
            return <Logout />;
    }
}

function getHeaderLeft(route: RouteProp<any, any>) {
    const routeName = getFocusedRouteNameFromRoute(route);
    if (routeName === Screens.Profile) {
        return <BackSvg />;
    }
}
function isLargeIphone() {
    const d = Dimensions.get('window');
    const isX = !!(Platform.OS === 'ios' && (d.height > 800 || d.width > 800));
    return isX;
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

    const userCommunity = useSelector(
        (state: IRootState) => state.user.community.metadata
    );
    const isBeneficiary = useSelector(
        (state: IRootState) => state.user.community.isBeneficiary
    );
    const fromWelcomeScreen = useSelector(
        (state: IRootState) => state.app.fromWelcomeScreen
    );
    const userWallet = useSelector((state: IRootState) => state.user.wallet);

    const [hidedTabBar, setHidedTabBar] = useState({
        offset: 0,
        height: 0,
    });

    useLayoutEffect(() => {
        const routeName = getFocusedRouteNameFromRoute(route);
        const headerLeftDetected = getHeaderLeft(route);

        navigation.setOptions({
            headerLeft: () => getHeaderLeft(route),
            headerTitle: getHeaderTitle(
                route,
                isBeneficiary
                    ? Screens.Beneficiary
                    : isManager
                    ? Screens.CommunityManager
                    : Screens.Communities
            ),
            headerTitleStyle: {
                fontFamily: 'Manrope-Bold',
                fontSize: 22,
                lineHeight: 28,
                color: '#333239',
            },
            headerTitleContainerStyle: {
                left: headerLeftDetected ? 58 : 18,
            },
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
                        : Screens.Communities,
                    isBeneficiary || isBeneficiary,
                    userCommunity
                ),
        });

        if (!isBeneficiary && !isManager && userCommunity) {
            setHidedTabBar({ offset: -100, height: 12 });
        } else {
            setHidedTabBar({ offset: 0, height: 82 });
        }
    }, [navigation, route]);

    const tabBeneficiary = (
        <Tab.Screen
            name={Screens.Beneficiary}
            component={BeneficiaryScreen}
            options={(BeneficiaryScreen as any).navigationOptions}
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
        <Host>
            <Tab.Navigator
                tabBarOptions={{
                    labelStyle: {
                        fontFamily: 'Inter-Regular',
                        fontSize: 12,
                        lineHeight: 14,
                    },
                    tabStyle: { marginVertical: 16 },
                    style: {
                        bottom: hidedTabBar.offset,
                        height:
                            Platform.OS === 'ios' && !!isLargeIphone()
                                ? hidedTabBar.height
                                : hidedTabBar.height + 2 + insets.bottom,
                    },
                    activeTintColor: ipctColors.blueRibbon,
                    inactiveTintColor: ipctColors.almostBlack,
                    safeAreaInsets: { bottom: 0, top: 0 },
                }}
                initialRouteName={
                    fromWelcomeScreen.length > 0 // if fromWelcomeScreen is valid, use it
                        ? fromWelcomeScreen
                        : isBeneficiary
                        ? Screens.Beneficiary
                        : isManager
                        ? Screens.CommunityManager
                        : Screens.Communities
                }
            >
                {tabCommunities}
                {isBeneficiary && tabBeneficiary}
                {isManager && tabManager}
                {userWallet.address.length === 0 ? tabAuth : tabProfile}
            </Tab.Navigator>
        </Host>
    );
}

export default TabNavigator;
