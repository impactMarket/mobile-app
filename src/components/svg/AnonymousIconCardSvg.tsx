import * as React from 'react';
import Svg, { SvgProps, G, Path, Defs, ClipPath } from 'react-native-svg';

function AnonymousIconCardSvg(props: SvgProps) {
    return (
        <Svg width={54} height={54} viewBox="0 0 54 54" fill="none" {...props}>
            <G clipPath="url(#prefix__clip0)">
                <Path
                    d="M46.535 24.877l-4.006-.928 1.275-4-.093-.03a39.102 39.102 0 00-5.09-1.295c-.702 5.789-5.646 10.289-11.62 10.289-5.894 0-10.783-4.377-11.59-10.05-1.821.383-3.54.858-5.107 1.424l1.167 3.662-4.008.928L0 38.637v8.375h8.895V32.886h36.21v14.126H54v-8.449l-7.465-13.686zM40.18 8.603A14.523 14.523 0 0029.83.407a14.413 14.413 0 00-5.66 0 14.523 14.523 0 00-10.35 8.196l-3.856 8.452c4.71-1.58 10.682-2.483 16.94-2.552 6.213-.068 12.185.689 16.943 2.14l-3.666-8.04z"
                    fill="#172B4D"
                />
                <Path
                    d="M18.53 18.308c.543 4.192 4.133 7.441 8.47 7.441 4.397 0 8.027-3.34 8.492-7.614-5.476-.69-11.515-.628-16.961.173z"
                    fill="#172B4D"
                />
                <Path
                    d="M12.059 53.874H41.94V36.05H12.06v17.824zM27 42.724l2.237 2.238L27 47.199l-2.237-2.237L27 42.724z"
                    fill="#5E72E4"
                />
            </G>
            <Defs>
                <ClipPath id="prefix__clip0">
                    <Path fill="#fff" d="M0 0h54v54H0z" />
                </ClipPath>
            </Defs>
        </Svg>
    );
}

export default AnonymousIconCardSvg;
