import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

function SuspiciousActivityMiddleSvg(props: SvgProps) {
    return (
        <Svg width={16} height={16} viewBox="0 0 12 12" fill="none" {...props}>
            <Path
                d="M10.341 5.528l-.89-.206.283-.889-.02-.007a8.69 8.69 0 00-1.132-.287A2.605 2.605 0 016 6.425a2.605 2.605 0 01-2.575-2.233 8.55 8.55 0 00-1.135.316l.26.814-.892.206L0 8.586v1.861h1.977v-3.14h8.046v3.14H12V8.57l-1.659-3.042zM8.929 1.912A3.227 3.227 0 005.371.09a3.227 3.227 0 00-2.3 1.822L2.214 3.79c1.047-.351 2.374-.552 3.765-.567 1.38-.015 2.707.153 3.765.475l-.815-1.786z"
                fill="#FE9A22"
            />
            <Path
                d="M4.118 4.068A1.9 1.9 0 006 5.722c.977 0 1.784-.742 1.887-1.692a14.358 14.358 0 00-3.77.038zM2.68 11.972h6.64V8.011H2.68v3.961zM6 9.494l.497.497L6 10.49l-.497-.497L6 9.494z"
                fill="#FE9A22"
            />
        </Svg>
    );
}

export default SuspiciousActivityMiddleSvg;
