import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

function NoSuspiciusBadgeSvg(props: SvgProps) {
    return (
        <Svg width={14} height={16} viewBox="0 0 14 16" fill="none" {...props}>
            <Path
                d="M13.844 2.307L6.922 0 0 2.307v6.194a6.904 6.904 0 004.26 6.389L6.923 16l2.661-1.11a6.904 6.904 0 004.26-6.389V2.307z"
                fill="#2DCE89"
            />
        </Svg>
    );
}

export default NoSuspiciusBadgeSvg;
