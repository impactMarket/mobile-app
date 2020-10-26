import * as React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';

function ManageSvg(props: { focused: boolean }) {
    return (
        <Svg width={34} height={27} viewBox="0 0 34 27" fill="none">
            <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M26.973 25.993c0-5.684-4.608-10.291-10.291-10.291-5.684 0-10.291 4.607-10.291 10.29"
                fill="#fff"
            />
            <Path
                d="M26.973 25.993c0-5.684-4.608-10.291-10.291-10.291-5.684 0-10.291 4.607-10.291 10.29"
                stroke={props.focused ? '#5E72E4' : '#7E8DA6'}
                strokeWidth={1.96}
                strokeLinecap="round"
            />
            <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M32.363 21.092c0-5.683-4.607-10.291-10.29-10.291-5.684 0-10.292 4.607-10.292 10.291"
                fill="#fff"
            />
            <Path
                d="M32.363 21.092c0-5.683-4.607-10.291-10.29-10.291-5.684 0-10.292 4.607-10.292 10.291"
                stroke={props.focused ? '#5E72E4' : '#7E8DA6'}
                strokeWidth={1.96}
                strokeLinecap="round"
            />
            <Circle
                cx={22.072}
                cy={6.881}
                r={5.881}
                fill="#fff"
                stroke={props.focused ? '#5E72E4' : '#7E8DA6'}
                strokeWidth={1.96}
            />
            <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M21.582 21.092c0-5.683-4.607-10.291-10.291-10.291S1 15.408 1 21.092"
                fill="#fff"
            />
            <Path
                d="M21.582 21.092c0-5.683-4.607-10.291-10.291-10.291S1 15.408 1 21.092"
                stroke={props.focused ? '#5E72E4' : '#7E8DA6'}
                strokeWidth={1.96}
                strokeLinecap="round"
            />
            <Circle
                cx={11.291}
                cy={6.881}
                r={5.881}
                fill="#fff"
                stroke={props.focused ? '#5E72E4' : '#7E8DA6'}
                strokeWidth={1.96}
            />
            <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M26.973 25.993c0-5.684-4.608-10.291-10.291-10.291-5.684 0-10.291 4.607-10.291 10.29"
                fill="#fff"
            />
            <Path
                d="M26.973 25.993c0-5.684-4.608-10.291-10.291-10.291-5.684 0-10.291 4.607-10.291 10.29"
                stroke={props.focused ? '#5E72E4' : '#7E8DA6'}
                strokeWidth={1.96}
                strokeLinecap="round"
            />
            <Circle
                cx={16.681}
                cy={11.781}
                r={5.881}
                fill="#fff"
                stroke={props.focused ? '#5E72E4' : '#7E8DA6'}
                strokeWidth={1.96}
            />
        </Svg>
    );
}

export default ManageSvg;
