import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

function DownloadSvg() {
    return (
        <Svg width={64} height={62} viewBox="0 0 64 62" fill="none">
            <Path
                d="M32.02 44a3 3 0 002.12-.88L48.26 29l-4.24-4.24-9 9V0h-6v33.76l-9-9L15.78 29 29.9 43.12a3 3 0 002.12.88z"
                fill="#2DCE89"
            />
            <Path
                d="M32.02 62A31 31 0 0053.7 8.86l-4.2 4.29a25 25 0 11-35 0l-4.2-4.29A31 31 0 0032.02 62z"
                fill="#2DCE89"
            />
        </Svg>
    );
}

export default DownloadSvg;
