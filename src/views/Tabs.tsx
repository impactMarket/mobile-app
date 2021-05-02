import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import i18n from 'assets/i18n';
import ClaimSvg from 'components/svg/ClaimSvg';
import CommunitiesSvg from 'components/svg/CommunitiesSvg';
import ManageSvg from 'components/svg/ManageSvg';
import ProfileSvg from 'components/svg/ProfileSvg';
import { ITabBarIconProps } from 'helpers/types/common';
import { IRootState } from 'helpers/types/state';
import React from 'react';
import { Host } from 'react-native-portalize';
import { useSelector } from 'react-redux';

import CommunitiesScreen from './communities';
import BeneficiaryView from './community/beneficiary/WelcomeRulesScreen';
import CommunityManagerView from './community/manager';
import ProfileScreen from './profile';

const Tab = createBottomTabNavigator();

function Tabs() {
    const isManager = useSelector(
        (state: IRootState) => state.user.community.isManager
    );
    const isBeneficiary = useSelector(
        (state: IRootState) => state.user.community.isBeneficiary
    );
    const tabBeneficiary = (
        <Tab.Screen
            name="claim"
            component={BeneficiaryView}
            options={{
                title: i18n.t('ubi'),
                tabBarIcon: (props: ITabBarIconProps) => (
                    <ClaimSvg focused={props.focused} />
                ),
            }}
        />
    );
    const tabManager = (
        <Tab.Screen
            name="manage"
            component={CommunityManagerView}
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
            name="communities"
            component={CommunitiesScreen}
            options={{
                title: i18n.t('communities'),
                tabBarIcon: (props: ITabBarIconProps) => (
                    <CommunitiesSvg focused={props.focused} />
                ),
            }}
        />
    );
    return (
        <Host>
            <Tab.Navigator
                tabBarOptions={{
                    labelStyle: {
                        fontFamily: 'Inter-Regular',
                        fontSize: 12,
                        lineHeight: 20,
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
                    name="profile"
                    component={ProfileScreen}
                    options={{
                        title: i18n.t('profile'),
                        tabBarIcon: (props: ITabBarIconProps) => (
                            <ProfileSvg focused={props.focused} />
                        ),
                    }}
                />
            </Tab.Navigator>
        </Host>
    );
}

export default Tabs;
