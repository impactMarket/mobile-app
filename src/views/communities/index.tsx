import CommunitiesSvg from 'components/svg/CommunitiesSvg';
import { ITabBarIconProps } from 'helpers/types/common';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView } from 'react-native-gesture-handler';
import Communities from './Communities';

import Stories from './Stories';

function CommunitiesScreen() {
    return (
        <ScrollView>
            <Stories />
            <Communities />
        </ScrollView>
    );
}

CommunitiesScreen.navigationOptions = () => {
    const { i18n } = useTranslation();
    return {
        headerTitle: i18n.t('communities'),
        tabBarIcon: (props: ITabBarIconProps) => (
            <CommunitiesSvg focused={props.focused} />
        ),
    };
};

export default CommunitiesScreen;
