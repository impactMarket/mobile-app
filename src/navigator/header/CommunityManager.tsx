import React from 'react';
import { View } from 'react-native';
import FAQSvg from 'components/svg/header/FaqSvg';
import ThreeDotsSvg from 'components/svg/header/ThreeDotsSvg';

function CommunityManager() {
    return (
        <View
            style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
            }}
        >
            <FAQSvg />
            <ThreeDotsSvg style={{ marginLeft: 8.4, marginRight: 16 }} />
        </View>
    );
}

export default CommunityManager;
