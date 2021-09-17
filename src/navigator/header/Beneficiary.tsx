import FAQSvg from 'components/svg/header/FaqSvg';
import QRCodeSvg from 'components/svg/header/QRCodeSvg';
import ReportSvg from 'components/svg/header/ReportSvg';
import React from 'react';

function Beneficiary() {
    return (
        <>
            <FAQSvg />
            <ReportSvg style={{ marginLeft: 8.4 }} />
            <QRCodeSvg style={{ marginLeft: 8.4 }} />
        </>
    );
}

export default Beneficiary;
