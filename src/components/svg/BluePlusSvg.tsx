import * as React from 'react';
import Svg, { SvgProps, Circle, Path } from 'react-native-svg';

function BluePlusSvg(props: SvgProps) {
    return (
        <Svg width={34} height={34} viewBox="0 0 34 34" fill="none" {...props}>
            <Circle cx={16.8} cy={16.8} r={16.8} fill="#2362FB" />
            <Path
                stroke="#FAFAFA"
                strokeWidth={2}
                strokeLinecap="round"
                d="M8.141 16.8h18"
            />
            <Path
                stroke="#FAFAFA"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.141 25.8v-18"
            />
        </Svg>
    );
}

export default BluePlusSvg;
