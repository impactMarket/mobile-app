import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

function NoSuspiciusBadgeOutlineSvg(props: SvgProps) {
    return (
        <Svg width={14} height={16} viewBox="0 0 14 16" fill="none" {...props}>
            <Path
                d="M13.844 2.307L6.922 0 0 2.307v6.194a6.904 6.904 0 004.26 6.389L6.923 16l2.661-1.11a6.904 6.904 0 004.26-6.389V2.307zm-1.538 6.194a5.368 5.368 0 01-3.313 4.969l-2.071.864-2.071-.864A5.368 5.368 0 011.538 8.5V3.415L6.922 1.62l5.384 1.795V8.5z"
                fill="#2DCE89"
            />
            <Path
                d="M4.645 6.676L3.558 7.763l2.308 2.307a.77.77 0 00.543.226.77.77 0 00.549-.244l3.845-4.102L9.68 4.9 6.391 8.421 4.645 6.676z"
                fill="#2DCE89"
            />
        </Svg>
    );
}

export default NoSuspiciusBadgeOutlineSvg;
