import BottomPopup from 'components/core/BottomPopup';
import React, { ReactElement } from 'react';
import { TextStyle, StyleProp } from 'react-native';
import Svg, { SvgProps, Circle, Path } from 'react-native-svg';
interface IThreeDotsProps extends SvgProps {
    children: ReactElement;
    openThreeDotsMenu: boolean;
    hasCloseBtn: boolean;
    title?: string;
    titleStyle?: StyleProp<TextStyle>;
    setOpenThreeDotsMenu: React.Dispatch<React.SetStateAction<boolean>>;
}

function ThreeDotsSvg(props: IThreeDotsProps) {
    const {
        setOpenThreeDotsMenu,
        openThreeDotsMenu,
        title,
        children,
        titleStyle,
        hasCloseBtn,
    } = props;

    const toggleThreeDotsMenu = () => setOpenThreeDotsMenu(!openThreeDotsMenu);

    return (
        <>
            <Svg
                width={34}
                height={34}
                viewBox="0 0 34 34"
                fill="none"
                onPress={() => setOpenThreeDotsMenu(true)}
                {...props}
            >
                <Circle cx={16.8} cy={16.8} r={16.8} fill="#EAEDF0" />
                <Path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M9.49 18.951c.655 0 1.233-.249 1.736-.747.503-.498.754-1.07.754-1.714 0-.664-.249-1.245-.747-1.743S10.154 14 9.49 14c-.683 0-1.27.249-1.758.747S7 15.827 7 16.49c0 .655.244 1.228.732 1.721.489.494 1.075.74 1.758.74zm7.617 0c.635 0 1.204-.249 1.707-.747.503-.498.754-1.07.754-1.714 0-.664-.249-1.245-.747-1.743S17.752 14 17.107 14c-.683 0-1.27.249-1.757.747-.489.498-.733 1.08-.733 1.743 0 .655.244 1.228.733 1.721.488.494 1.074.74 1.757.74zm9.31-.747c-.513.498-1.107.747-1.78.747-.664 0-1.24-.246-1.729-.74-.488-.493-.732-1.066-.732-1.72 0-.665.244-1.246.732-1.744S23.973 14 24.637 14c.683 0 1.279.249 1.787.747s.762 1.08.762 1.743c0 .645-.257 1.216-.77 1.714z"
                    fill="#161515"
                />
            </Svg>

            <BottomPopup
                isVisible={openThreeDotsMenu}
                toggleVisibility={toggleThreeDotsMenu}
                title={title}
                titleStyle={titleStyle}
                hasCloseBtn={hasCloseBtn}
            >
                {children}
            </BottomPopup>
        </>
    );
}

export default ThreeDotsSvg;
