import * as React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';
import { ipctColors } from 'styles/index';

function ProfileSvg(props: { focused: boolean }) {
    return (
        <Svg width={31} height={31} viewBox="0 0 31 31" fill="none">
            <Circle
                cx={15.5}
                cy={11.973}
                r={5.429}
                fill="#fff"
                stroke={
                    props.focused
                        ? ipctColors.blueRibbon
                        : ipctColors.regentGray
                }
                strokeWidth={1.96}
            />
            <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M25 25.092a9.5 9.5 0 00-19 0"
                fill="#fff"
            />
            <Path
                d="M25 25.092a9.5 9.5 0 00-19 0"
                stroke={
                    props.focused
                        ? ipctColors.blueRibbon
                        : ipctColors.regentGray
                }
                strokeWidth={1.96}
                strokeLinecap="round"
            />
            <Circle
                cx={15.5}
                cy={15.5}
                r={14.5}
                stroke={
                    props.focused
                        ? ipctColors.blueRibbon
                        : ipctColors.regentGray
                }
                strokeWidth={2}
            />
        </Svg>
    );
}

export default ProfileSvg;
