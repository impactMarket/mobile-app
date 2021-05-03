import * as React from 'react';
import Svg, { Path, SvgProps, Ellipse } from 'react-native-svg';

function ReportInapropriateSvg(props: SvgProps) {
    return (
        <Svg width={33} height={34} viewBox="0 0 33 34" fill="none" {...props}>
            <Ellipse cx={16.5} cy={17} rx={16.5} ry={16.8} fill="#E9EDF4" />
            <Path
                d="M9.888 9.896a.925.925 0 00-.444-.57.993.993 0 00-.733-.094c-.51.137-.817.651-.677 1.149l4.493 16.352c.07.257.352.467.629.467h.997c.277 0 .439-.21.369-.467L9.888 9.896zm16.094 9.327l-2.188-7.955c-.07-.257-.32-.579-.567-.695-4.51-2.121-7.08 2.812-11.719.223.813 2.966 1.63 5.933 2.443 8.894 4.634 2.585 7.208-2.344 11.714-.227.25.12.387.022.317-.24z"
                fill="#172B4D"
            />
        </Svg>
    );
}

export default ReportInapropriateSvg;
