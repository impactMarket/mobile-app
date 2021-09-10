import * as React from 'react';
import Svg, { SvgProps, Path, Circle } from 'react-native-svg';

function CloseSvg(props: SvgProps) {
    return (
        <Svg width={34} height={35} fill="none" {...props}>
            <Circle cx={17.2} cy={17.5} r={16.8} fill="#E9EDF4" />
            <Path
                stroke="#172B4D"
                strokeWidth={2}
                strokeLinecap="round"
                d="M11.177 23.864l12.728-12.728"
            />
            <Path
                stroke="#172B4D"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M23.905 23.864L11.177 11.136"
            />
        </Svg>
    );
}

export default CloseSvg;
