import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import i18n from 'assets/i18n';
import { IRootState, ITabBarIconProps } from 'helpers/types';
import React from 'react';
import { Image } from 'react-native';
import { connect, ConnectedProps } from 'react-redux';

import CommunitiesScreen from './communities/CommunitiesScreen';
import BeneficiaryView from './community/view/beneficiary';
import CommunityManagerView from './community/view/communitymanager';
import PayScreen from './pay';
import WalletScreen from './wallet';

const ActiveClaimIcon = require('assets/images/tab/active/claim.png');
const ActiveCommunitiesIcon = require('assets/images/tab/active/communities.png');
const ActiveManageIcon = require('assets/images/tab/active/manage.png');
const ActivePayIcon = require('assets/images/tab/active/pay.png');
const ActiveWalletIcon = require('assets/images/tab/active/wallet.png');
const InactiveClaimIcon = require('assets/images/tab/claim.png');
const InactiveCommunitiesIcon = require('assets/images/tab/communities.png');
const InactiveManageIcon = require('assets/images/tab/manage.png');
const InactivePayIcon = require('assets/images/tab/pay.png');
const InactiveWalletIcon = require('assets/images/tab/wallet.png');

const mapStateToProps = (state: IRootState) => {
    const { user, network } = state;
    return { user, network };
};

const connector = connect(mapStateToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux;
const Tab = createBottomTabNavigator();

function Tabs(props: Props) {
    const selectTabBarIcon = (focused: boolean, tab: string) => {
        switch (tab) {
            case 'claim':
                if (focused) return ActiveClaimIcon;
                return InactiveClaimIcon;
            case 'manage':
                if (focused) return ActiveManageIcon;
                return InactiveManageIcon;
            case 'communities':
                if (focused) return ActiveCommunitiesIcon;
                return InactiveCommunitiesIcon;
            case 'pay':
                if (focused) return ActivePayIcon;
                return InactivePayIcon;
            case 'wallet':
                if (focused) return ActiveWalletIcon;
                return InactiveWalletIcon;
        }
    };

    const iconExtraSize = 0;
    const tabBeneficiary = (
        <Tab.Screen
            name="claim"
            component={BeneficiaryView}
            options={{
                title: i18n.t('claim'),
                tabBarIcon: (props: ITabBarIconProps) => (
                    <Image
                        source={selectTabBarIcon(props.focused, 'claim')}
                        style={{
                            width: props.size + 2 + iconExtraSize,
                            height: props.size - 5 + iconExtraSize,
                        }}
                    />
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
                    <Image
                        source={selectTabBarIcon(props.focused, 'manage')}
                        style={{
                            width: props.size + iconExtraSize,
                            height: props.size - 5 + iconExtraSize,
                        }}
                    />
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
                    <Image
                        source={selectTabBarIcon(props.focused, 'communities')}
                        style={{
                            width: props.size + iconExtraSize,
                            height: props.size - 3 + iconExtraSize,
                        }}
                    />
                ),
            }}
        />
    );
    const { isManager, isBeneficiary } = props.user.community;
    return (
        <Tab.Navigator
        // tabBarOptions={{ style: { height: 60 }, labelStyle: { top: -6 } }}
        >
            {isBeneficiary && tabBeneficiary}
            {isManager && tabManager}
            {!isBeneficiary && !isManager && tabCommunities}
            {props.user.celoInfo.address.length > 0 && (
                <Tab.Screen
                    name="pay"
                    component={PayScreen}
                    options={{
                        title: i18n.t('pay'),
                        tabBarIcon: (props: ITabBarIconProps) => (
                            <Image
                                source={selectTabBarIcon(props.focused, 'pay')}
                                style={{
                                    width: props.size + 7 + iconExtraSize,
                                    height: props.size + 7 + iconExtraSize,
                                }}
                            />
                        ),
                    }}
                />
            )}
            <Tab.Screen
                name="wallet"
                component={WalletScreen}
                options={{
                    title: i18n.t('wallet'),
                    tabBarIcon: (props: ITabBarIconProps) => (
                        <Image
                            source={selectTabBarIcon(props.focused, 'wallet')}
                            style={{
                                width: props.size - 5 + iconExtraSize,
                                height: props.size - 5 + iconExtraSize,
                            }}
                        />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}

export default connector(Tabs);
