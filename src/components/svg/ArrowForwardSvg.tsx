import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

function ArrowForwardSvg(props: SvgProps) {
    return (
        <Svg width={7} height={13} viewBox="0 0 7 13" fill="none" {...props}>
            <Path
                d="M4.648 6.497L.19 10.987a.653.653 0 00-.19.464c0 .176.068.34.19.464l.39.393a.644.644 0 00.462.192.644.644 0 00.46-.192L6.81 6.963A.653.653 0 007 6.498a.653.653 0 00-.19-.466L1.508.692A.644.644 0 001.047.5a.645.645 0 00-.461.192l-.39.393a.66.66 0 000 .928l4.452 4.484z"
                fill="#172B4D"
            />
        </Svg>
    );
}

export default ArrowForwardSvg;
