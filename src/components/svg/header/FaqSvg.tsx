import { setOpenFaqModal } from 'helpers/redux/actions/app';
import * as React from 'react';
import { Pressable } from 'react-native';
import Svg, { Circle, Path, SvgProps } from 'react-native-svg';
import { useDispatch } from 'react-redux';
import { ipctColors } from 'styles/index';

function FAQSvg(props: SvgProps) {
    const dispatch = useDispatch();
    return (
        <Pressable
            hitSlop={5}
            onPress={() => {
                dispatch(setOpenFaqModal(true));
            }}
        >
            <Svg
                width={34}
                height={34}
                viewBox="0 0 34 34"
                fill="none"
                {...props}
            >
                <Circle
                    cx={16.8}
                    cy={16.8}
                    r={16.8}
                    fill={ipctColors.softGray}
                />
                <Circle cx={17} cy={24} r={1} fill={ipctColors.nileBlue} />
                <Path
                    d="M17 9c-2.757 0-5 2.05-5 4.571 0 .632.56 1.143 1.25 1.143s1.25-.511 1.25-1.143c0-1.26 1.121-2.285 2.5-2.285 1.378 0 2.5 1.025 2.5 2.285 0 1.26-1.122 2.286-2.5 2.286-.69 0-1.25.512-1.25 1.143v2.857c0 .631.56 1.143 1.25 1.143s1.25-.512 1.25-1.143v-1.859c2.154-.509 3.75-2.3 3.75-4.427C22 11.051 19.757 9 17 9z"
                    fill={ipctColors.nileBlue}
                />
            </Svg>
        </Pressable>
    );
}

export default FAQSvg;
