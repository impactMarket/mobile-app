import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';
import { ipctColors } from 'styles/index';

function LocationsSvg(props: SvgProps) {
    return (
        <Svg width={8} height={12} viewBox="0 0 8 12" fill="none" {...props}>
            <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M0 4.535C0 2.412 1.794.685 4 .685s4 1.727 4 3.85c0 2.634-3.58 6.502-3.732 6.665a.37.37 0 01-.536 0C3.58 11.037 0 7.17 0 4.535zm1.988 0c0 1.068.902 1.937 2.012 1.937 1.11 0 2.012-.87 2.012-1.937 0-1.068-.902-1.937-2.012-1.937-1.11 0-2.012.869-2.012 1.937z"
                fill={ipctColors.blueGray}
            />
        </Svg>
    );
}

export default LocationsSvg;
