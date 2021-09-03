import { useNavigation } from '@react-navigation/native';
import { Screens } from 'helpers/constants';
import { IRootState } from 'helpers/types/state';
import * as React from 'react';
import Svg, { Circle, G, Mask, Path, SvgProps } from 'react-native-svg';
import { useSelector } from 'react-redux';
import { ipctColors } from 'styles/index';

function ProfileSvg(props: SvgProps) {
    const navigation = useNavigation();
    const walletAddress = useSelector(
        (state: IRootState) => state.user.wallet.address
    );
    return (
        <Svg
            width={33}
            height={32}
            viewBox="0 0 33 32"
            style={{ marginLeft: 10 }}
            fill="none"
            {...props}
            onPress={() =>
                walletAddress.length > 0
                    ? navigation.navigate(Screens.Profile)
                    : navigation.navigate(Screens.Auth)
            }
        >
            <Circle
                cx={16.6}
                cy={16}
                r={15.4}
                fill={ipctColors.nileBlue}
                stroke={ipctColors.nileBlue}
                strokeWidth={1.2}
            />
            <Mask id="prefix__a" x={2} y={2} width={29} height={28}>
                <Path
                    d="M29.6 15.92c0 7.122-5.814 12.907-13 12.907s-13-5.785-13-12.907 5.814-12.907 13-12.907 13 5.785 13 12.907z"
                    fill={ipctColors.ghost}
                    stroke={ipctColors.darBlue}
                    strokeWidth={2}
                />
            </Mask>
            <G
                mask="url(#prefix__a)"
                fill={ipctColors.white}
                stroke={ipctColors.nileBlue}
                strokeWidth={0.4}
            >
                <Path d="M12.156 10.905c0-2.436 1.981-4.506 4.46-4.506 2.473 0 4.46 2.065 4.46 4.506 0 2.44-2 4.428-4.46 4.428s-4.46-1.988-4.46-4.428zm1.93 0a2.525 2.525 0 002.53 2.514 2.525 2.525 0 002.53-2.514c0-1.402-1.152-2.592-2.53-2.592-1.379 0-2.53 1.19-2.53 2.592zM10.992 32.812v-.283l-.267.094c-.343.121-.713.187-1.098.187-1.818 0-3.295-1.469-3.295-3.271v-6.943c0-3.079 2.522-5.586 5.624-5.586h9.32c3.102 0 5.624 2.507 5.624 5.586v6.467c0 1.802-1.477 3.271-3.295 3.271-.385 0-.755-.066-1.098-.187l-.267-.093v11.448c0 1.802-1.476 3.271-3.294 3.271a3.294 3.294 0 01-2.197-.836l-.133-.118-.133.118a3.294 3.294 0 01-2.197.836c-1.818 0-3.294-1.469-3.294-3.272v-10.69zm3.294 12.047c.376 0 .718-.152.965-.398v.157h.4c0-.527.43-.957.965-.957.534 0 .965.43.965.957h.4v-.157c.247.246.589.398.965.398.751 0 1.365-.608 1.365-1.358V22.597c0-.527.43-.957.965-.957.534 0 .964.43.964.957v6.467c0 .75.614 1.357 1.365 1.357.752 0 1.365-.607 1.365-1.357v-6.467c0-2.026-1.658-3.672-3.694-3.672h-9.32c-2.036 0-3.694 1.646-3.694 3.672v6.943c0 .75.613 1.357 1.365 1.357.751 0 1.364-.608 1.364-1.357v-6.943c0-.527.431-.957.965-.957.535 0 .965.43.965.957V43.501c0 .75.614 1.358 1.365 1.358z" />
            </G>
        </Svg>
    );
}

export default ProfileSvg;
