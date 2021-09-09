import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
    getFocusedRouteNameFromRoute,
    RouteProp,
} from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import i18n from 'assets/i18n';
import ProfileSvg from 'components/svg/ProfileSvg';
import BackSvg from 'components/svg/header/BackSvg';
import FAQSvg from 'components/svg/header/FaqSvg';
import ImpactMarketHeaderLogoSVG from 'components/svg/header/ImpactMarketHeaderLogoSVG';
import { Screens } from 'helpers/constants';
import { CommunityAttributes } from 'helpers/types/models';
import { IRootState } from 'helpers/types/state';
import React, { useLayoutEffect } from 'react';
import { Platform, Dimensions, View } from 'react-native';
import { Host } from 'react-native-portalize';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { ipctColors, ipctFontSize, ipctLineHeight } from 'styles/index';
import CommunitiesScreen from 'views/communities';
import BeneficiaryScreen from 'views/community/beneficiary';
import CommunityManagerScreen from 'views/community/manager';

import Beneficiary from './header/Beneficiary';
import CommunityManager from './header/CommunityManager';
import Logout from './header/Logout';

function getHeaderTitle(route: RouteProp<any, any>, defaultValue: string) {
    let routeName = getFocusedRouteNameFromRoute(route);
    if (routeName === undefined) {
        routeName = defaultValue;
    }

    switch (routeName) {
        case Screens.Beneficiary:
            return i18n.t('beneficiary.claim');
        case Screens.CommunityManager:
            return i18n.t('generic.manage');
        case Screens.Communities:
            return null;
        case Screens.Profile:
            return i18n.t('profile.profile');
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
        case Screens.Profile:
            return <Logout />;
        default:
            return (
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginRight: 22,
                    }}
                >
                    <FAQSvg />
                    <ProfileSvg />
                </View>
            );
    }
}

function getHeaderLeft(route: RouteProp<any, any>) {
    const routeName = getFocusedRouteNameFromRoute(route);

    switch (routeName) {
        case Screens.Communities:
            return <ImpactMarketHeaderLogoSVG width={107.62} height={36.96} />;
        case undefined:
            return <ImpactMarketHeaderLogoSVG width={107.62} height={36.96} />;
        case Screens.CommunityManager:
            return null;
        case Screens.Beneficiary:
            return null;
        default:
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

    useLayoutEffect(() => {
        const routeName = getFocusedRouteNameFromRoute(route);
        const headerLeftDetected = getHeaderLeft(route);
        navigation.setOptions({
            headerLeft: () => getHeaderLeft(route),
            headerTitle: !routeName
                ? null
                : getHeaderTitle(
                      route,
                      isBeneficiary
                          ? Screens.Beneficiary
                          : isManager && Screens.CommunityManager
                  ),
            headerTitleStyle: {
                fontFamily: 'Manrope-Bold',
                fontSize: ipctFontSize.lowMedium,
                lineHeight: ipctLineHeight.large,
                color: ipctColors.darBlue,
            },
            headerTitleContainerStyle: {
                left: headerLeftDetected ? 58 : 18,
            },
            headerShown: !(routeName === Screens.Auth),
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
    }, [
        navigation,
        route,
        fromWelcomeScreen,
        isBeneficiary,
        isManager,
        userCommunity,
    ]);

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
                        height:
                            Platform.OS === 'ios' && !!isLargeIphone()
                                ? 82
                                : 84 + insets.bottom,
                    },
                    activeTintColor: ipctColors.blueRibbon,
                    inactiveTintColor: ipctColors.almostBlack,
                    safeAreaInsets: { bottom: 0, top: 0 },
                }}
                initialRouteName={
                    fromWelcomeScreen.length > 0 // if fromWelcomeScreen is valid, use it
                        ? Screens.Communities
                        : isBeneficiary
                        ? Screens.Beneficiary
                        : Screens.CommunityManager
                }
            >
                {tabCommunities}
                {isBeneficiary && tabBeneficiary}
                {isManager && tabManager}
            </Tab.Navigator>
        </Host>
    );
}

export default TabNavigator;
