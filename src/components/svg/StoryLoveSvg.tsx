import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

function StoryLoveSvg(props: { loved: boolean } & SvgProps) {
    return (
        <Svg width={17} height={17} viewBox="0 0 17 17" fill="none" {...props}>
            <Path
                d="M8.587 15.846l-.085.056a29.636 29.636 0 01-1.033-.73 31.353 31.353 0 01-2.875-2.393c-1.046-.99-2.077-2.128-2.844-3.33C.98 8.241.5 7.006.5 5.815.5 3.09 2.41 1 4.624 1h.005c1.358-.012 2.662.774 3.436 2.143l.432.767.437-.764c.78-1.364 2.081-2.15 3.44-2.146 2.211.013 4.114 2.095 4.126 4.817 0 1.212-.482 2.456-1.25 3.665-.767 1.206-1.798 2.341-2.843 3.325a30.592 30.592 0 01-3.82 3.039z"
                fill={props.loved ? 'red' : '#FAFAFA'}
                stroke={props.loved ? 'red' : '#FAFAFA'}
            />
        </Svg>
    );
}

export default StoryLoveSvg;
