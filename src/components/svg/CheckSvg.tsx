import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

function CheckSvg(props: SvgProps) {
    return (
        <Svg width={14} height={14} viewBox="0 0 14 14" fill="none" {...props}>
            <Path
                d="M6.337 13.361c-.635.852-1.664.852-2.299 0L.476 8.584c-.635-.851-.635-2.233 0-3.084.634-.851 1.664-.851 2.3 0l2.121 2.847c.16.214.42.214.581 0L11.225.639c.634-.852 1.664-.852 2.299 0 .305.408.476.963.476 1.541s-.171 1.133-.476 1.542l-7.187 9.64z"
                fill="#2DCE89"
            />
        </Svg>
    );
}

export default CheckSvg;
