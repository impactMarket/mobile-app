import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import i18n from 'assets/i18n';
import ManageSvg from 'components/svg/ManageSvg';
import ProfileSvg from 'components/svg/ProfileSvg';
import CommunitiesSvg from 'components/svg/CommunitiesSvg';
import ClaimSvg from 'components/svg/ClaimSvg';
import { IRootState, ITabBarIconProps } from 'helpers/types';
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import CommunitiesScreen from './communities/CommunitiesScreen';
import BeneficiaryView from './community/view/beneficiary';
import CommunityManagerView from './community/view/communitymanager';
import ProfileScreen from './profile';


const mapStateToProps = (state: IRootState) => {
    const { user, network } = state;
    return { user, network };
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
                // tabStyle: { height: 84 },
                // style: { backgroundColor: 'powderblue' },
            }}
        >
            {isBeneficiary && tabBeneficiary}
            {isManager && tabManager}
            {!isBeneficiary && !isManager && tabCommunities}
            {/* {props.user.celoInfo.address.length > 0 && (
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
            )} */}
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
