import * as React from 'react';
import Svg, { SvgProps, Circle, Path } from 'react-native-svg';

function WarningRedCircle(props: SvgProps) {
    return (
        <Svg width={16} height={16} viewBox="0 0 16 16" fill="none" {...props}>
            <Circle cx={8} cy={8} r={8} fill="#EB5757" />
            <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M8 2.857a.72.72 0 01.727.714v5.715A.72.72 0 018 10a.72.72 0 01-.727-.714V3.57A.72.72 0 018 2.857zM8 10.952a.72.72 0 01.727.715v.476a.72.72 0 01-.727.714.72.72 0 01-.727-.714v-.476A.72.72 0 018 10.952z"
                fill="#fff"
            />
        </Svg>
    );
}

export default WarningRedCircle;
