import React, { useEffect } from 'react';
import {
    Image,
} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import BeneficiaryView from './community/view/beneficiary';
import { IRootState } from '../helpers/types';
import { connect, ConnectedProps, useStore } from 'react-redux';
import WalletScreen from './wallet';
import CommunitiesScreen from './communities/CommunitiesScreen';
import PayScreen from './pay';
import CommunityManagerView from './community/view/communitymanager';


const mapStateToProps = (state: IRootState) => {
    const { user, network } = state
    return { user, network }
};

const connector = connect(mapStateToProps)
type PropsFromRedux = ConnectedProps<typeof connector>
type Props = PropsFromRedux
const Tab = createBottomTabNavigator();

function Tabs(props: Props) {
    const tabsToUser = () => {
        const user = props.user;
        if (user.community.isBeneficiary === false && user.community.isCoordinator === false) {
            return <Tab.Screen
                name="Communities"
                component={CommunitiesScreen}
                options={{
                    tabBarIcon: (props: any) => (
                        <Image
                            source={require(`../assets/tab/communities.png`)}
                            style={{ width: props.size, height: props.size - 3 }}
                        />
                    ),
                }}
            />;
        }
        if (user.community.isBeneficiary) {
            return <Tab.Screen
                name="Claim"
                component={BeneficiaryView}
                options={{
                    tabBarIcon: (props: any) => (
                        <Image
                            source={require('../assets/tab/claim.png')}
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
                    tabBarIcon: (props: any) => (
                        <Image
                            source={require('../assets/tab/manage.png')}
                            style={{ width: props.size, height: props.size - 5 }}
                        />
                    ),
                }}
            />;
        }
    }

    return (
        <Tab.Navigator>
            {tabsToUser()}
            {props.user.celoInfo.address.length > 0 && <Tab.Screen
                name="Pay"
                component={PayScreen}
                options={{
                    tabBarIcon: (props: { focused: boolean, color: string, size: number }) => (
                        <Image
                            source={require(`../assets/tab/pay.png`)}
                            style={{ width: props.size + 3, height: props.size + 3 }}
                        />
                    ),
                }}
            />}
            <Tab.Screen
                name="Wallet"
                component={WalletScreen}
                options={{
                    headerShown: false,
                    tabBarIcon: (props: any) => (
                        <Image
                            source={require(`../assets/tab/wallet.png`)}
                            style={{ width: props.size - 5, height: props.size - 5 }}
                        />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}

export default connector(Tabs);