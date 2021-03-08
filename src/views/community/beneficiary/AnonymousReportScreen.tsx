import i18n from 'assets/i18n';
import BackSvg from 'components/svg/header/BackSvg';
import React from 'react';
import { View, Text } from 'react-native';

function AnonymousReportScreen() {
    return (
        <View>
            <Text>Hello!</Text>
        </View>
    );
}

AnonymousReportScreen.navigationOptions = () => {
    return {
        headerLeft: () => <BackSvg />,
        headerTitle: i18n.t('report'),
    };
};

export default AnonymousReportScreen;
