import * as React from 'react';
import Svg, { SvgProps, Circle, Path } from 'react-native-svg';

function CloseStorySvg(props: SvgProps) {
    return (
        <Svg width={34} height={34} viewBox="0 0 34 34" fill="none" {...props}>
            <Circle cx={16.8} cy={17} r={16.8} fill="#fff" />
            <Path
                stroke="#1E3252"
                strokeWidth={2}
                strokeLinecap="round"
                d="M10.777 23.364l12.728-12.728"
            />
            <Path
                stroke="#1E3252"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M23.505 23.364L10.777 10.636"
            />
        </Svg>
    );
}

export default CloseStorySvg;
