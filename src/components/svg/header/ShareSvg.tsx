import i18n from 'assets/i18n';
import * as React from 'react';
import { Share } from 'react-native';
import Svg, { SvgProps, Ellipse, Path } from 'react-native-svg';
import { ipctColors } from 'styles/index';

function ShareSvg(props: SvgProps) {
    const onShare = async () => {
        try {
            const result = await Share.share({
                message: i18n.t('community.shareTitle'),
            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (_) {}
    };

    return (
        <Svg
            width={33}
            height={34}
            viewBox="0 0 33 34"
            fill="none"
            {...props}
            style={{ marginLeft: 10 }}
            onPress={onShare}
        >
            <Ellipse
                cx={16.5}
                cy={16.8}
                rx={16.5}
                ry={16.8}
                fill={ipctColors.softGray}
            />
            <Path
                d="M18.55 10.162a.55.55 0 00-.602-.12.557.557 0 00-.34.515v2.97c-2.985.12-4.48 1.365-4.709 1.573a8.45 8.45 0 00-2.907 4.904 8.7 8.7 0 00-.099 2.827v.003l.004.025.118.68a.551.551 0 001.018.19l.352-.59c1.081-1.81 2.428-3.01 4.005-3.567a5.766 5.766 0 012.218-.327v3.076a.55.55 0 00.944.392l5.84-5.912a.56.56 0 00-.001-.787l-5.84-5.852z"
                fill={ipctColors.nileBlue}
            />
        </Svg>
    );
}

export default ShareSvg;
