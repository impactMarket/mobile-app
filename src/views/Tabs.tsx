import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import i18n from 'assets/i18n';
import ManageSvg from 'components/svg/ManageSvg';
import ProfileSvg from 'components/svg/ProfileSvg';
import CommunitiesSvg from 'components/svg/CommunitiesSvg';
import ClaimSvg from 'components/svg/ClaimSvg';
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import CommunitiesScreen from './communities';
import BeneficiaryView from './community/beneficiary';
import CommunityManagerView from './community/manager';
import ProfileScreen from './profile';
import { IRootState } from 'helpers/types/state';
import { ITabBarIconProps } from 'helpers/types/common';

const mapStateToProps = (state: IRootState) => {
    const { user } = state;
    return { user };
};

const connector = connect(mapStateToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux;
const Tab = createBottomTabNavigator();

function Tabs(props: Props) {
    const tabBeneficiary = (
        <Tab.Screen
            name="claim"
            component={BeneficiaryView}
            options={{
                title: i18n.t('claim'),
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
    const { isManager, isBeneficiary } = props.user.community;
    return (
        <Tab.Navigator
            // tabBarOptions={{ style: { height: 60 }, labelStyle: { top: -6 } }}
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
    );
}

export default connector(Tabs);
