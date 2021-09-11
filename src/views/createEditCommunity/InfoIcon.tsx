import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

function InfoIcon(props: SvgProps) {
    return (
        <Svg width={16} height={16} fill="none" {...props}>
            <Path
                d="M8 0a8 8 0 100 16A8 8 0 008 0zm.338 3.165a1.052 1.052 0 110 2.103 1.052 1.052 0 010-2.103zm.943 9.304s-.828.695-1.872.171a1.35 1.35 0 01-.553-.538c-.354-.627-.218-1.3-.218-1.3l.105-.824.27-2.151-.737.016a.623.623 0 01-.242-1.204l1.888-.743a.874.874 0 011.173 1.008l-.025.112-.739 3.242-.184.81c-.027.122-.031.15-.039.214-.02.365.499.091.499.091a.643.643 0 01.674 1.096z"
                fill="#2362FB"
            />
        </Svg>
    );
}

export default InfoIcon;
