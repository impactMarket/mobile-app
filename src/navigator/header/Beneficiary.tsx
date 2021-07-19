import FAQSvg from 'components/svg/header/FaqSvg';
import QRCodeSvg from 'components/svg/header/QRCodeSvg';
import ReportSvg from 'components/svg/header/ReportSvg';
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
            <ReportSvg style={{ marginLeft: 8.4 }} />
            <QRCodeSvg style={{ marginLeft: 8.4, marginRight: 16 }} />
        </View>
    );
}

export default Beneficiary;
