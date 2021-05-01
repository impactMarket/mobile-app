import * as React from 'react';
import Svg, { Mask, G, Circle, Path } from 'react-native-svg';
import { ipctColors } from 'styles/index';

function ProfileSvg(props: { focused: boolean }) {
    return (
        <Svg width={32} height={32} viewBox="0 0 32 32" fill="none" {...props}>
            <Mask id="prefix__a" x={4} y={2} width={24} height={25}>
                <Path
                    d="M27 14.383c0 6.025-4.919 10.92-11 10.92S5 20.408 5 14.383s4.919-10.92 11-10.92 11 4.895 11 10.92z"
                    fill={
                        props.focused
                            ? ipctColors.blueRibbon
                            : ipctColors.regentGray
                    }
                    stroke={
                        props.focused
                            ? ipctColors.blueRibbon
                            : ipctColors.regentGray
                    }
                    strokeWidth={2}
                />
            </Mask>
            <G
                mask="url(#prefix__a)"
                fill={
                    props.focused
                        ? ipctColors.blueRibbon
                        : ipctColors.regentGray
                }
                stroke={
                    props.focused
                        ? ipctColors.blueRibbon
                        : ipctColors.regentGray
                }
                strokeWidth={0.4}
            >
                <Path d="M12.22 10.084c0-2.073 1.686-3.833 3.793-3.833 2.104 0 3.794 1.757 3.794 3.833 0 2.076-1.7 3.768-3.793 3.768-2.094 0-3.794-1.692-3.794-3.768zm1.596 0c0 1.206.987 2.184 2.197 2.184s2.197-.978 2.197-2.184c0-1.216-.999-2.25-2.197-2.25-1.197 0-2.197 1.034-2.197 2.25zM11.221 28.862v-.283l-.266.094a2.8 2.8 0 01-.932.159c-1.543 0-2.796-1.247-2.796-2.776v-5.95c0-2.624 2.15-4.76 4.793-4.76h7.988c2.643 0 4.792 2.136 4.792 4.76v5.542c0 1.53-1.253 2.776-2.795 2.776-.327 0-.641-.056-.932-.159l-.267-.094v9.853c0 1.53-1.253 2.776-2.795 2.776a2.795 2.795 0 01-1.864-.71l-.133-.118-.133.119a2.795 2.795 0 01-1.864.709c-1.543 0-2.796-1.247-2.796-2.776v-9.162zm2.796 10.354c.306 0 .586-.115.798-.304v.07h.4c0-.437.356-.792.799-.792.442 0 .798.355.798.791h.4v-.069c.212.19.492.304.799.304.66 0 1.198-.533 1.198-1.192V20.105c0-.436.356-.792.799-.792.442 0 .798.356.798.792v5.543c0 .659.539 1.192 1.199 1.192s1.198-.533 1.198-1.192v-5.543c0-1.752-1.434-3.175-3.195-3.175H12.02c-1.761 0-3.196 1.423-3.196 3.175v5.951c0 .659.539 1.192 1.199 1.192s1.198-.533 1.198-1.192v-5.95c0-.437.357-.793.799-.793.442 0 .798.356.798.792V38.024c0 .659.539 1.192 1.199 1.192z" />
            </G>
            <Circle
                cx={16}
                cy={16}
                r={15.4}
                stroke={
                    props.focused
                        ? ipctColors.blueRibbon
                        : ipctColors.regentGray
                }
                strokeWidth={1.2}
            />
        </Svg>
    );
}

export default ProfileSvg;
