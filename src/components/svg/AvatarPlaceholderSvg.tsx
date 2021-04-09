import * as React from 'react';
import Svg, { SvgProps, Circle } from 'react-native-svg';

function AvatarPlaceholderSvg(props: SvgProps) {
    return (
        <Svg width={81} height={80} viewBox="0 0 81 80" fill="none" {...props}>
            <Circle
                cx={40.5}
                cy={40}
                r={38.5}
                stroke="#8A9FC2"
                strokeWidth={3}
            />
        </Svg>
    );
}

export default AvatarPlaceholderSvg;
