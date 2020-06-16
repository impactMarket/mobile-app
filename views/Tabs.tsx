import React from 'react';
import {
    Image,
} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import BeneficiaryView from './community/view/beneficiary';
import { IRootState, ITabBarIconProps } from '../helpers/types';
import { connect, ConnectedProps } from 'react-redux';
import WalletScreen from './wallet';
import CommunitiesScreen from './communities/CommunitiesScreen';
import PayScreen from './pay';
import CommunityManagerView from './community/view/communitymanager';

const ActiveClaimIcon = require('../assets/tab/active/claim.png');
const InactiveClaimIcon = require('../assets/tab/claim.png');
const ActiveManageIcon = require('../assets/tab/active/manage.png');
const InactiveManageIcon = require('../assets/tab/manage.png');
const ActiveCommunitiesIcon = require('../assets/tab/active/communities.png');
const InactiveCommunitiesIcon = require('../assets/tab/communities.png');
const ActivePayIcon = require('../assets/tab/active/pay.png');
const InactivePayIcon = require('../assets/tab/pay.png');
const ActiveWalletIcon = require('../assets/tab/active/wallet.png');
const InactiveWalletIcon = require('../assets/tab/wallet.png');


const mapStateToProps = (state: IRootState) => {
    const { user, network } = state
    return { user, network }
};

const connector = connect(mapStateToProps)
type PropsFromRedux = ConnectedProps<typeof connector>
type Props = PropsFromRedux
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
    }

    const tabsToUser = () => {
        const user = props.user;
        if (user.community.isBeneficiary) {
            return <Tab.Screen
                name="Claim"
                component={BeneficiaryView}
                options={{
                    tabBarIcon: (props: ITabBarIconProps) => (
                        <Image
                            source={selectTabBarIcon(props.focused, 'claim')}
                            style={{ width: props.size + 2, height: props.size - 5 }}
                        />
                    ),
                }}
            />;
        } else if (user.community.isCoordinator) {
            return <Tab.Screen
                name="Manage"
                component={CommunityManagerView}
                options={{
                    tabBarIcon: (props: ITabBarIconProps) => (
                        <Image
                            source={selectTabBarIcon(props.focused, 'manage')}
                            style={{ width: props.size, height: props.size - 5 }}
                        />
                    ),
                }}
            />;
        }
        return <Tab.Screen
            name="Communities"
            component={CommunitiesScreen}
            options={{
                tabBarIcon: (props: ITabBarIconProps) => (
                    <Image
                        source={selectTabBarIcon(props.focused, 'communities')}
                        style={{ width: props.size, height: props.size - 3 }}
                    />
                ),
            }}
        />;
    }

    return (
        <Tab.Navigator>
            {tabsToUser()}
            {props.user.celoInfo.address.length > 0 && <Tab.Screen
                name="Pay"
                component={PayScreen}
                options={{
                    tabBarIcon: (props: ITabBarIconProps) => (
                        <Image
                            source={selectTabBarIcon(props.focused, 'pay')}
                            style={{ width: props.size + 3, height: props.size + 3 }}
                        />
                    ),
                }}
            />}
            <Tab.Screen
                name="Wallet"
                component={WalletScreen}
                options={{
                    tabBarIcon: (props: ITabBarIconProps) => (
                        <Image
                            source={selectTabBarIcon(props.focused, 'wallet')}
                            style={{ width: props.size - 5, height: props.size - 5 }}
                        />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}

export default connector(Tabs);