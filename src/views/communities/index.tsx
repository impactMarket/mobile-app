import i18n from 'assets/i18n';
import CommunitiesSvg from 'components/svg/CommunitiesSvg';
import ProfileSvg from 'components/svg/ProfileSvg';
import ImpactMarketHeaderLogoSVG from 'components/svg/header/ImpactMarketHeaderLogoSVG';
import { ITabBarIconProps } from 'helpers/old-types';
import React from 'react';
import { ScrollView, View } from 'react-native';
import Auth from 'views/profile/auth';

import Stories from './Stories';
import Communities from './communities';

function CommunitiesScreen() {
    return (
        <ScrollView>
            <Communities />
            <Stories />
            <Auth />
        </ScrollView>
    );
}

CommunitiesScreen.navigationOptions = () => {
    return {
        tabBarLabel: i18n.t('generic.communities'),
        tabBarIcon: (props: ITabBarIconProps) => (
            <CommunitiesSvg focused={props.focused} />
        ),
        // lines below need to be here, so when a user only have one tab,
        // the stack is different and this is used to load the header
        headerLeft: () => (
            <ImpactMarketHeaderLogoSVG width={107.62} height={36.96} />
        ),
        headerRight: () => (
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginRight: 22,
                }}
            >
                <ProfileSvg />
            </View>
        ),
        headerTitle: '',
    };
};

export default CommunitiesScreen;
