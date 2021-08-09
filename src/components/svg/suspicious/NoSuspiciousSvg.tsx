import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

function NoSuspiciousSvg(props: SvgProps) {
    return (
        <Svg width={14} height={16} viewBox="0 0 14 16" fill="none" {...props}>
            <Path
                d="M13.333 2.307L6.667 0 0 2.307v6.194a7.094 7.094 0 001.117 3.842 6.71 6.71 0 002.987 2.547L6.667 16l2.563-1.11a6.71 6.71 0 002.986-2.547A7.093 7.093 0 0013.333 8.5V2.307z"
                fill="#8A9FC2"
            />
            <Path
                d="M4.474 6.676L3.427 7.763 5.65 10.07a.727.727 0 00.524.226.718.718 0 00.528-.244l3.704-4.102L9.323 4.9 6.156 8.421 4.474 6.676z"
                fill="#fff"
            />
        </Svg>
    );
}

export default NoSuspiciousSvg;
