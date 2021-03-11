import i18n from 'assets/i18n';
import { IRootState } from 'helpers/types/state';
import * as React from 'react';
import { useState } from 'react';
import SvgQRCode from 'react-native-qrcode-svg';
import Svg, { SvgProps, Circle, Path } from 'react-native-svg';
import { useSelector } from 'react-redux';
import BottomPopup from 'components/core/BottomPopup';

function QRCodeSvg(props: SvgProps) {
    const [openQR, setOpenQR] = useState(false);
    const userAddress = useSelector(
        (state: IRootState) => state.user.wallet.address
    );

    const toggleQR = () => setOpenQR(!openQR);

    return (
        <>
            <Svg
                width={34}
                height={34}
                viewBox="0 0 34 34"
                fill="none"
                onPress={() => setOpenQR(true)}
                {...props}
            >
                <Circle cx={16.8} cy={16.8} r={16.8} fill="#EAEDF0" />
                <Path
                    d="M11.98 10.746a.88.88 0 00-.616-.255.88.88 0 00-.618.255.88.88 0 00-.255.618c0 .23.093.454.255.617a.88.88 0 00.618.255.88.88 0 00.617-.255.88.88 0 00.255-.617.88.88 0 00-.255-.618z"
                    fill="#172B4D"
                />
                <Path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M7.873 7h6.982c.481 0 .872.39.872.873v6.982c0 .481-.39.872-.872.872H7.873A.873.873 0 017 14.855V7.873C7 7.39 7.39 7 7.873 7zm.872 6.982h5.237V8.745H8.745v5.237z"
                    fill="#172B4D"
                />
                <Path
                    d="M22.454 10.746a.88.88 0 00-.618-.255.88.88 0 00-.617.255.88.88 0 00-.255.618c0 .23.093.454.255.617a.88.88 0 00.617.255.88.88 0 00.618-.255.88.88 0 00.255-.617.88.88 0 00-.255-.618z"
                    fill="#172B4D"
                />
                <Path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M18.345 7h6.982c.482 0 .873.39.873.873v6.982c0 .481-.39.872-.873.872h-6.982a.873.873 0 01-.872-.872V7.873c0-.482.39-.873.872-.873zm.873 6.982h5.236V8.745h-5.236v5.237z"
                    fill="#172B4D"
                />
                <Path
                    d="M11.98 21.22a.88.88 0 00-.616-.256.88.88 0 00-.618.255.88.88 0 00-.255.617c0 .23.093.455.255.618a.88.88 0 00.618.255.88.88 0 00.617-.255.88.88 0 00.255-.618.88.88 0 00-.255-.617z"
                    fill="#172B4D"
                />
                <Path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M7.873 17.473h6.982c.481 0 .872.39.872.872v6.982c0 .482-.39.873-.872.873H7.873A.873.873 0 017 25.327v-6.982c0-.482.39-.872.873-.872zm.872 6.982h5.237v-5.237H8.745v5.237z"
                    fill="#172B4D"
                />
                <Path
                    d="M22.418 20.964h-.582a.873.873 0 100 1.745h.582a.873.873 0 100-1.745zM25.327 22.71a.873.873 0 00-.873.872v.873h-2.036a.873.873 0 000 1.745h2.91c.481 0 .872-.39.872-.873v-1.745a.873.873 0 00-.873-.873zM18.345 20.964a.873.873 0 00-.872.872V23a.873.873 0 101.745 0v-1.164a.873.873 0 00-.873-.872zM22.418 17.473h-1.745a.873.873 0 000 1.745h1.745a.873.873 0 100-1.745z"
                    fill="#172B4D"
                />
            </Svg>
            <BottomPopup
                isVisible={openQR}
                setIsVisible={toggleQR}
                title={i18n.t('yourQRCode')}
            >
                <SvgQRCode value={userAddress} size={200} />
            </BottomPopup>
        </>
    );
}

export default QRCodeSvg;
