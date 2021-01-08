import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

function SuccessSvg(props: SvgProps) {
    return (
        <Svg width={58} height={58} viewBox="0 0 58 58" fill="none" {...props}>
            <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M0 29C0 13.01 13.01 0 29 0s29 13.01 29 29-13.01 29-29 29S0 44.99 0 29zm27.421 12.818l18.37-17.928a3.972 3.972 0 000-5.708A4.16 4.16 0 0042.866 17a4.16 4.16 0 00-2.924 1.182L24.497 33.257l-6.438-6.284a4.158 4.158 0 00-2.924-1.182c-1.105 0-2.143.42-2.924 1.182A3.961 3.961 0 0011 29.827a3.96 3.96 0 001.211 2.854l9.362 9.137A4.16 4.16 0 0024.497 43a4.16 4.16 0 002.924-1.182z"
                fill="#2DCE89"
            />
        </Svg>
    );
}

export default SuccessSvg;
