import FAQSvg from 'components/svg/header/FaqSvg';
import QRCodeSvg from 'components/svg/header/QRCodeSvg';
import React from 'react';
import { View } from 'react-native';

function Beneficiary() {
    return (
        <View
            style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
            }}
        >
            <FAQSvg />
            <QRCodeSvg style={{ marginLeft: 8.4, marginRight: 16 }} />
        </View>
    );
}

export default Beneficiary;
