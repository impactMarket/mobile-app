import React from 'react';
// import { useSelector } from 'react-redux';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import i18n from 'assets/i18n';
import { IRootState, ITabBarIconProps, STORAGE_USER_FIRST_TIME } from 'helpers/types';

import ManageSvg from 'components/svg/ManageSvg';
import ProfileSvg from 'components/svg/ProfileSvg';
import ClaimSvg from 'components/svg/ClaimSvg';

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
import { AsyncStorage, View } from 'react-native';
import { Button } from 'react-native-paper';
import { Text } from 'react-native-paper';

import { batch, useDispatch, useSelector, useStore } from 'react-redux';
import {
    resetUserApp,
    resetNetworkContractsApp,
    setUserInfo,
    setUserExchangeRate,
    setUserIsBeneficiary,
    setUserIsCommunityManager,
    setUserLanguage,
    setUserWalletBalance,
} from 'helpers/redux/actions/ReduxActions';

const handleLogout = async (navigation: StackNavigationProp<any, any>) => {
    console.log('handleLogout')
    const store = useStore();
    const dispatch = useDispatch();
    // setLogingOut(true);
    await AsyncStorage.clear();
    await AsyncStorage.setItem(STORAGE_USER_FIRST_TIME, 'false');
    const unsubscribe = store.subscribe(() => {
        const state = store.getState();
        if (
            !state.user.community.isBeneficiary &&
            !state.user.community.isManager
        ) {
            unsubscribe();
            // setLogingOut(false);
            // TODO: improve this line below
            setTimeout(
                () =>
                    navigation.navigate(Screens.Communities, {
                        previous: Screens.Profile,
                    }),
                500
            );
        }
    });
    batch(() => {
        dispatch(setUserIsBeneficiary(false));
        dispatch(setUserIsCommunityManager(false));
        dispatch(resetUserApp());
        dispatch(resetNetworkContractsApp());
    });
};
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

    React.useLayoutEffect(() => {
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
        </Tab.Navigator>
    );
}

export default TabNavigator;
