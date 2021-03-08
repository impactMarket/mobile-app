import { useNavigation } from '@react-navigation/native';
import { Screens } from 'helpers/constants';
import * as React from 'react';
import Svg, {
    SvgProps,
    Circle,
    G,
    Path,
    Defs,
    ClipPath,
} from 'react-native-svg';

function ReportSvg(props: SvgProps) {
    const navigation = useNavigation();
    return (
        <Svg
            onPress={() => navigation.navigate(Screens.AnonymousReport)}
            width={34}
            height={34}
            viewBox="0 0 34 34"
            fill="none"
            {...props}
        >
            <Circle cx={17.2} cy={17} r={16.8} fill="#EAEDF0" />
            <G clipPath="url(#prefix__clip0)" fill="#172B4D">
                <Path d="M24.635 15.414l-1.484-.344.473-1.481-.035-.012a14.474 14.474 0 00-1.885-.48A4.342 4.342 0 0117.4 16.91a4.342 4.342 0 01-4.292-3.723c-.675.142-1.312.318-1.892.528l.433 1.356-1.485.344L7.4 20.51v3.102h3.294V18.38h13.412v5.232H27.4v-3.13l-2.765-5.068zM22.282 9.386a5.379 5.379 0 00-3.834-3.035 5.338 5.338 0 00-2.096 0 5.379 5.379 0 00-3.834 3.035l-1.428 3.13c1.745-.584 3.957-.919 6.274-.944 2.302-.026 4.513.255 6.276.792l-1.358-2.978z" />
                <Path d="M14.263 12.98a3.168 3.168 0 003.137 2.757 3.168 3.168 0 003.145-2.82 23.932 23.932 0 00-6.282.064zM11.866 26.153h11.068v-6.601H11.866v6.601zm5.534-4.13l.829.83-.829.828-.829-.829.83-.828z" />
            </G>
            <Defs>
                <ClipPath id="prefix__clip0">
                    <Path
                        fill="#fff"
                        transform="translate(7.4 6.2)"
                        d="M0 0h20v20H0z"
                    />
                </ClipPath>
            </Defs>
        </Svg>
    );
}

export default ReportSvg;
