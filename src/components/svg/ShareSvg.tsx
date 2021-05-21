import * as React from 'react';
import Svg, { SvgProps, Ellipse, Path } from 'react-native-svg';

function ShareSvg(props: SvgProps) {
    return (
        <Svg width={33} height={35} viewBox="0 0 33 35" fill="none" {...props}>
            <Ellipse cx={16.5} cy={17.4} rx={16.5} ry={16.8} fill="#E9EDF4" />
            <Path
                d="M18.55 10.762a.55.55 0 00-.601-.12.557.557 0 00-.341.515v2.97c-2.985.12-4.48 1.365-4.708 1.572a8.45 8.45 0 00-2.908 4.905 8.7 8.7 0 00-.099 2.827v.003a.978.978 0 00.004.025l.118.68a.551.551 0 001.018.19l.352-.59c1.081-1.81 2.428-3.01 4.005-3.567a5.766 5.766 0 012.218-.327v3.076c0 .225.135.428.342.514a.55.55 0 00.602-.122l5.84-5.912a.56.56 0 00-.001-.787l-5.84-5.852z"
                fill="#172B4D"
            />
        </Svg>
    );
}

export default ShareSvg;
