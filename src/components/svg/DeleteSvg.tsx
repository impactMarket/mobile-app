import * as React from 'react';
import Svg, { SvgProps, Ellipse } from 'react-native-svg';

function DeleteSvg(props: SvgProps) {
    return (
        <Svg width={33} height={34} viewBox="0 0 33 34" fill="none" {...props}>
            <Ellipse cx={16.5} cy={17} rx={16.5} ry={16.8} fill="#E9EDF4" />
        </Svg>
    );
}

export default DeleteSvg;
