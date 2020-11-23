import React, { useLayoutEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import i18n from 'assets/i18n';
import { IRootState, ITabBarIconProps } from 'helpers/types';

import ManageSvg from 'components/svg/ManageSvg';
import ProfileSvg from 'components/svg/ProfileSvg';

import CommunitiesScreen from 'views/communities';
import BeneficiaryScreen from 'views/community/beneficiary';
import CommunityManagerScreen from 'views/community/manager';
import ProfileScreen from 'views/profile';
import {
    getFocusedRouteNameFromRoute,
    RouteProp,
} from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Screens } from 'helpers/constants';

import FaqSvg from 'components/svg/header/FaqSvg';
import QRCodeSvg from 'components/svg/header/QRCodeSvg';
import ThreeDotsSvg from 'components/svg/header/ThreeDotsSvg';
import { View } from 'react-native';
import { Text } from 'react-native-paper';

import { useSelector } from 'react-redux';
import Logout from './header/Logout';
import Login from 'views/profile/auth';

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
            return (
                <View style={{ flex: 1, flexDirection: 'row', marginTop: 16 }}>
                    <FaqSvg />
                    <QRCodeSvg style={{ marginLeft: 8.4, marginRight: 16 }} />
                </View>
            );
        case Screens.CommunityManager:
            return (
                <View style={{ flex: 1, flexDirection: 'row', marginTop: 16 }}>
                    <FaqSvg />
                    <ThreeDotsSvg
                        style={{ marginLeft: 8.4, marginRight: 16 }}
                    />
                </View>
            );
        case Screens.Communities:
            return (
                <View style={{ flex: 1, flexDirection: 'row', marginTop: 16 }}>
                    <Text
                        style={{
                            fontFamily: 'Gelion-Bold',
                            fontSize: 22,
                            lineHeight: 22, // TODO: design is 26
                            textAlign: 'center',
                            letterSpacing: 0.366667,
                            color: '#2643E9',
                            // marginLeft: 8.4,
                            marginRight: 16,
                        }}
                        onPress={() =>
                            navigation.navigate(Screens.CreateCommunity)
                        }
                    >
                        {i18n.t('create')}
                    </Text>
                </View>
            );
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
    const isManager = useSelector(
        (state: IRootState) => state.user.community.isManager
    );
    const isBeneficiary = useSelector(
        (state: IRootState) => state.user.community.isBeneficiary
    );
    const userWallet = useSelector((state: IRootState) => state.user.celoInfo);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: getHeaderTitle(
                route,
                isBeneficiary
                    ? Screens.Beneficiary
                    : isManager
                    ? Screens.CommunityManager
                    : Screens.Communities
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
            options={{
                title: i18n.t('manage'),
                tabBarIcon: (props: ITabBarIconProps) => (
                    <ManageSvg focused={props.focused} />
                ),
            }}
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
            options={{
                title: i18n.t('profile'),
                tabBarIcon: (props: ITabBarIconProps) => (
                    <ProfileSvg focused={props.focused} />
                ),
            }}
        />
    );
    const tabAuth = (
        <Tab.Screen
            name={Screens.Auth}
            component={Login}
            options={{
                title: i18n.t('profile'),
                tabBarIcon: (props: ITabBarIconProps) => (
                    <ProfileSvg focused={props.focused} />
                ),
            }}
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
                style: { height: 84 },
            }}
        >
            {isBeneficiary && tabBeneficiary}
            {isManager && tabManager}
            {!isBeneficiary && !isManager && tabCommunities}
            {userWallet.address.length === 0 ? tabAuth : tabProfile}
        </Tab.Navigator>
    );
}

TabNavigator.navigationOptions = ({
    route,
}: {
    route: RouteProp<any, any>;
}) => {
    let routeName = getFocusedRouteNameFromRoute(route);
    if (routeName === Screens.Auth) {
        return {
            headerShown: false,
        };
    }
};

export default TabNavigator;
