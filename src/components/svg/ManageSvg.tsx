import * as React from 'react';
import Svg, { Mask, Path, G, Circle } from 'react-native-svg';
import { ipctColors } from 'styles/index';

function ManageSvg(props: { focused: boolean }) {
    return (
        <Svg width={37} height={32} viewBox="0 0 37 32" fill="none" {...props}>
            <Mask id="prefix__a" x={0} y={0} width={37} height={32}>
                <Path
                    d="M35.303 16c0 8.177-7.497 15-17 15s-17-6.823-17-15 7.497-15 17-15 17 6.823 17 15z"
                    fill="#fff"
                    stroke="#000"
                    strokeWidth={1.2}
                />
            </Mask>
            <G mask="url(#prefix__a)">
                <Path
                    d="M11.64 7.4c0-2.275 1.837-4.2 4.128-4.2 2.288 0 4.128 1.924 4.128 4.2a4.133 4.133 0 01-4.128 4.128A4.133 4.133 0 0111.64 7.4zm1.764 0a2.366 2.366 0 002.364 2.364A2.366 2.366 0 0018.132 7.4c0-1.316-1.075-2.436-2.364-2.436-1.29 0-2.364 1.12-2.364 2.436zM37.192 63.966c.171.195.33.376.479.542.364.41.655.73.862.947a5.945 5.945 0 00.274.273.882.882 0 00.826-.88V54.57l.267.095c.318.112.66.174 1.015.174 1.69 0 3.118-1.366 3.118-3.046v-4.328c0-.182-.01-.314-.026-.407a.77.77 0 00-.01-.052.884.884 0 00-.056.053c-.126.13-.288.355-.487.655-.112.168-.23.352-.358.55-.1.153-.204.316-.315.484-.16.245-.331.501-.512.758l-5.077 14.46zm0 0h.677V54.42m-.677 9.547l.677-9.547m0 0v-.4m0 .4h-.4m0 0v-.4m0 .4v9.147-9.147zm0-.4h.4m-.4 0v-1.764H32.26a.902.902 0 01-.509-.17m5.718 1.934l-5.718-1.934m6.118 1.934v-1.764m0 1.764v-1.764m0 0h.882c.313 0 .617-.074.909-.202m-1.79.202l2.077.377m-2.078-.377h-.2l2.178-.292a2.987 2.987 0 01-.187.09m-1.79.202v-.4m1.79.198c.045.218.146.416.287.579m-.287-.58a1.273 1.273 0 01-.027-.26v-.17m.314 1.01c.064-.135.128-.276.191-.422l.125.686a1.293 1.293 0 01-.316-.264zm.736-1.262c-.13.358-.266.705-.409 1.028l.41-1.028zm0 0c.11-.096.216-.198.32-.303l-.32.303zm-8.932.715a38.265 38.265 0 01-.034-.282c.177.161.358.252.543.252h5.209l-5.718.03zm6.118-.23h.882c.294 0 .59-.083.882-.232m-1.764.232h-.2l1.964-.232m-1.764.232V47.465a.882.882 0 011.764 0v4.158m.4-.245v-3.913a1.282 1.282 0 00-2.564 0V51.855H32.26c-.141 0-.31-.085-.506-.298a3.478 3.478 0 01-.376-.526V50.47l8.655.907zm-15.547 6.835l-.67-9.286 1.812 2.133.325.382 2.861 3.367V63.566H27.05v-9.61a1.282 1.282 0 00-2.564 0v4.257zm-2.163-24.432l1.006 13.955a1628.62 1628.62 0 00-6.19-7.249 271.883 271.883 0 00-2.964-3.401 39.54 39.54 0 00-.876-.958 6.042 6.042 0 00-.262-.26 1.143 1.143 0 00-.092-.077.395.395 0 00-.05-.032.235.235 0 00-.11-.029.882.882 0 01-.882-.882V24.57l-.267.095a3.032 3.032 0 01-1.015.174c-1.691 0-3.118-1.368-3.118-3.046v-4.328c0-2.877 2.398-5.21 5.282-5.21h6.492a3.05 3.05 0 013.045 3.046V33.781zm9.055 24.084v-.043c.612.717 1.202 1.41 1.764 2.066v3.678h-1.764V57.865zm3.34 3.247l-1.176-1.372v-3.62a.882.882 0 011.764 0v5.674l-.588-.682zm.987 2.454v-.697l.606.697h-.605zm-4.727-6.83l-1.764-2.074V46.13v0l.083.294c.136.48.298 1.057.477 1.642.295.958.649 1.983 1.045 2.772.052.103.105.203.159.3v5.598zm-10.62-22.77h.2V15.301c0-.707-.574-1.282-1.281-1.282h-6.492c-1.905 0-3.518 1.572-3.518 3.446v4.328c0 .699.641 1.282 1.354 1.282.707 0 1.282-.575 1.282-1.282v-4.328a.882.882 0 011.764 0v16.501H16.23v-7.845a.882.882 0 011.764 0v7.845h2.363z"
                    fill={
                        props.focused
                            ? ipctColors.blueRibbon
                            : ipctColors.darBlue
                    }
                    stroke="#fff"
                    strokeWidth={0.4}
                />
                <Mask
                    id="prefix__b"
                    x={17.379}
                    y={8.846}
                    width={17}
                    height={17}
                    fill="#fff"
                >
                    <Path fill="#fff" d="M17.379 8.846h17v17h-17z" />
                    <Path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M25.879 11.846a.5.5 0 00-.5.5v3.793l-2.682-2.682a.5.5 0 10-.707.707l2.682 2.682h-3.793a.5.5 0 100 1h3.793l-2.682 2.682a.5.5 0 00.707.707l2.682-2.682v3.793a.5.5 0 001 0v-3.793l2.682 2.682a.5.5 0 00.707-.707l-2.682-2.682h3.793a.5.5 0 000-1h-3.793l2.682-2.682a.5.5 0 00-.707-.707l-2.682 2.682v-3.793a.5.5 0 00-.5-.5z"
                    />
                </Mask>
                <Path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M25.879 11.846a.5.5 0 00-.5.5v3.793l-2.682-2.682a.5.5 0 10-.707.707l2.682 2.682h-3.793a.5.5 0 100 1h3.793l-2.682 2.682a.5.5 0 00.707.707l2.682-2.682v3.793a.5.5 0 001 0v-3.793l2.682 2.682a.5.5 0 00.707-.707l-2.682-2.682h3.793a.5.5 0 000-1h-3.793l2.682-2.682a.5.5 0 00-.707-.707l-2.682 2.682v-3.793a.5.5 0 00-.5-.5z"
                    fill="#fff"
                />
                <Path
                    d="M25.379 16.139l-1.98 1.98 4.78 4.78v-6.76h-2.8zm-2.682-2.682l-1.98 1.98 1.98-1.98zm-.707 0l-1.98-1.98 1.98 1.98zm0 .707l-1.98 1.98 1.98-1.98zm2.682 2.682v2.8h6.76l-4.78-4.78-1.98 1.98zm0 1l1.98 1.98 4.78-4.78h-6.76v2.8zm-2.682 2.682l1.98 1.98-1.98-1.98zm0 .707l1.98-1.98-1.98 1.98zm.707 0l1.98 1.98-1.98-1.98zm2.682-2.682h2.8v-6.76l-4.78 4.78 1.98 1.98zm1 0l1.98-1.98-4.78-4.78v6.76h2.8zm3.389 2.682l1.98 1.98-1.98-1.98zm0-.707l1.98-1.98-1.98 1.98zm-2.682-2.682v-2.8h-6.76l4.78 4.78 1.98-1.98zm0-1l-1.98-1.98-4.78 4.78h6.76v-2.8zm2.682-2.682l1.98 1.98-1.98-1.98zm0-.707l-1.98 1.98 1.98-1.98zm-.707 0l1.98 1.98-1.98-1.98zm-2.682 2.682h-2.8v6.76l4.78-4.78-1.98-1.98zm1.8-3.793a2.3 2.3 0 01-2.3 2.3v-5.6a3.3 3.3 0 00-3.3 3.3h5.6zm0 3.793v-3.793h-5.6v3.793h5.6zm-7.462-.702l2.682 2.682 3.96-3.96-2.682-2.682-3.96 3.96zm3.253 0a2.3 2.3 0 01-3.253 0l3.96-3.96a3.3 3.3 0 00-4.667 0l3.96 3.96zm0-3.253a2.3 2.3 0 010 3.253l-3.96-3.96a3.3 3.3 0 000 4.667l3.96-3.96zm2.682 2.682l-2.682-2.682-3.96 3.96 2.682 2.682 3.96-3.96zm-5.773 4.78h3.793v-5.6h-3.793v5.6zm2.3-2.3a2.3 2.3 0 01-2.3 2.3v-5.6a3.3 3.3 0 00-3.3 3.3h5.6zm-2.3-2.3a2.3 2.3 0 012.3 2.3h-5.6a3.3 3.3 0 003.3 3.3v-5.6zm3.793 0h-3.793v5.6h3.793v-5.6zm-.702 7.462l2.682-2.682-3.96-3.96-2.682 2.682 3.96 3.96zm0-3.253a2.3 2.3 0 010 3.253l-3.96-3.96a3.3 3.3 0 000 4.667l3.96-3.96zm-3.253 0a2.3 2.3 0 013.253 0l-3.96 3.96a3.3 3.3 0 004.667 0l-3.96-3.96zm2.682-2.682l-2.682 2.682 3.96 3.96 2.682-2.682-3.96-3.96zm4.78 5.773v-3.793h-5.6v3.793h5.6zm-2.3-2.3a2.3 2.3 0 012.3 2.3h-5.6a3.3 3.3 0 003.3 3.3v-5.6zm-2.3 2.3a2.3 2.3 0 012.3-2.3v5.6a3.3 3.3 0 003.3-3.3h-5.6zm0-3.793v3.793h5.6v-3.793h-5.6zm7.462.702l-2.682-2.682-3.96 3.96 2.682 2.682 3.96-3.96zm-3.253 0a2.3 2.3 0 013.253 0l-3.96 3.96a3.3 3.3 0 004.667 0l-3.96-3.96zm0 3.253a2.3 2.3 0 010-3.253l3.96 3.96a3.3 3.3 0 000-4.667l-3.96 3.96zm-2.682-2.682l2.682 2.682 3.96-3.96-2.682-2.682-3.96 3.96zm5.773-4.78h-3.793v5.6h3.793v-5.6zm-2.3 2.3a2.3 2.3 0 012.3-2.3v5.6a3.3 3.3 0 003.3-3.3h-5.6zm2.3 2.3a2.3 2.3 0 01-2.3-2.3h5.6a3.3 3.3 0 00-3.3-3.3v5.6zm-3.793 0h3.793v-5.6h-3.793v5.6zm.702-7.462l-2.682 2.682 3.96 3.96 2.682-2.682-3.96-3.96zm0 3.253a2.3 2.3 0 010-3.253l3.96 3.96a3.3 3.3 0 000-4.667l-3.96 3.96zm3.253 0a2.3 2.3 0 01-3.253 0l3.96-3.96a3.3 3.3 0 00-4.667 0l3.96 3.96zm-2.682 2.682l2.682-2.682-3.96-3.96-2.682 2.682 3.96 3.96zm-4.78-5.773v3.793h5.6v-3.793h-5.6zm2.3 2.3a2.3 2.3 0 01-2.3-2.3h5.6a3.3 3.3 0 00-3.3-3.3v5.6z"
                    fill="#fff"
                    mask="url(#prefix__b)"
                />
                <Mask
                    id="prefix__c"
                    x={18.379}
                    y={9.846}
                    width={15}
                    height={15}
                    fill="#000"
                >
                    <Path fill="#fff" d="M18.379 9.846h15v15h-15z" />
                    <Path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M25.879 11.846a.5.5 0 00-.5.5v3.793l-2.682-2.682a.5.5 0 10-.707.707l2.682 2.682h-3.793a.5.5 0 100 1h3.793l-2.682 2.682a.5.5 0 10.707.707l2.682-2.682v3.793a.5.5 0 001 0v-3.793l2.682 2.682a.5.5 0 00.707-.707l-2.682-2.682h3.793a.5.5 0 000-1h-3.793l2.682-2.682a.5.5 0 00-.707-.707l-2.682 2.682v-3.793a.5.5 0 00-.5-.5z"
                    />
                </Mask>
                <Path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M25.879 11.846a.5.5 0 00-.5.5v3.793l-2.682-2.682a.5.5 0 10-.707.707l2.682 2.682h-3.793a.5.5 0 100 1h3.793l-2.682 2.682a.5.5 0 10.707.707l2.682-2.682v3.793a.5.5 0 001 0v-3.793l2.682 2.682a.5.5 0 00.707-.707l-2.682-2.682h3.793a.5.5 0 000-1h-3.793l2.682-2.682a.5.5 0 00-.707-.707l-2.682 2.682v-3.793a.5.5 0 00-.5-.5z"
                    fill="#FFF"
                    stroke={
                        props.focused
                            ? ipctColors.blueRibbon
                            : ipctColors.darBlue
                    }
                    strokeWidth={1.2}
                />
                <Path
                    d="M25.379 16.139l-.778.778 1.878 1.877V16.14h-1.1zm-2.682-2.682l-.778.778.778-.778zm-.707.707l-.778.778.778-.778zm2.682 2.682v1.1h2.655l-1.877-1.878-.778.778zm0 1l.778.778 1.877-1.878h-2.655v1.1zm-2.682 2.682l.778.778-.778-.778zm0 .707l-.778.778.778-.778zm.707 0l-.778-.778.778.778zm2.682-2.682h1.1v-2.656L24.6 17.775l.778.778zm1 0l.778-.778-1.878-1.877v2.655h1.1zm2.682 2.682l-.778.778.778-.778zm.707 0l.778.778-.778-.778zm0-.707l.778-.778-.778.778zm-2.682-2.682v-1.1H24.43l1.878 1.878.778-.778zm0-1l-.778-.778-1.878 1.878h2.656v-1.1zm2.682-2.682l.778.778-.778-.778zm0-.707l.778-.778-.778.778zm-.707 0l.778.778-.778-.778zm-2.682 2.682h-1.1v2.655l1.878-1.877-.778-.778zm.1-3.793a.6.6 0 01-.6.6v-2.2a1.6 1.6 0 00-1.6 1.6h2.2zm0 3.793v-3.793h-2.2v3.793h2.2zm-4.56-1.904l2.682 2.682 1.556-1.556-2.682-2.682-1.556 1.556zm.849 0a.6.6 0 01-.849 0l1.556-1.556a1.6 1.6 0 00-2.263 0l1.556 1.556zm0-.849a.6.6 0 010 .849l-1.556-1.556a1.6 1.6 0 000 2.263l1.556-1.556zm2.682 2.682l-2.682-2.682-1.556 1.556 2.682 2.682 1.556-1.556zm-4.571 1.878h3.793v-2.2h-3.793v2.2zm.6-.6a.6.6 0 01-.6.6v-2.2a1.6 1.6 0 00-1.6 1.6h2.2zm-.6-.6a.6.6 0 01.6.6h-2.2a1.6 1.6 0 001.6 1.6v-2.2zm3.793 0h-3.793v2.2h3.793v-2.2zm-1.904 4.56l2.682-2.682-1.556-1.556-2.682 2.682 1.556 1.556zm0-.849a.6.6 0 010 .849l-1.556-1.556a1.6 1.6 0 000 2.263l1.556-1.556zm-.849 0a.6.6 0 01.849 0l-1.556 1.556a1.6 1.6 0 002.263 0l-1.556-1.556zm2.682-2.682l-2.682 2.682 1.556 1.556 2.682-2.682-1.556-1.556zm1.878 4.571v-3.793h-2.2v3.793h2.2zm-.6-.6a.6.6 0 01.6.6h-2.2a1.6 1.6 0 001.6 1.6v-2.2zm-.6.6a.6.6 0 01.6-.6v2.2a1.6 1.6 0 001.6-1.6h-2.2zm0-3.793v3.793h2.2v-3.793h-2.2zm4.56 1.904l-2.682-2.682-1.556 1.556 2.682 2.682 1.556-1.556zm-.849 0a.6.6 0 01.849 0l-1.556 1.556a1.6 1.6 0 002.263 0l-1.556-1.556zm0 .849a.6.6 0 010-.849l1.556 1.556a1.6 1.6 0 000-2.263l-1.556 1.556zm-2.682-2.682l2.682 2.682 1.556-1.556-2.682-2.682-1.556 1.556zm4.57-1.878h-3.792v2.2h3.793v-2.2zm-.6.6a.6.6 0 01.6-.6v2.2a1.6 1.6 0 001.6-1.6h-2.2zm.6.6a.6.6 0 01-.6-.6h2.2a1.6 1.6 0 00-1.6-1.6v2.2zm-3.792 0h3.793v-2.2h-3.793v2.2zm1.904-4.56l-2.682 2.682 1.556 1.556 2.682-2.682-1.556-1.556zm0 .849a.6.6 0 010-.849l1.556 1.556a1.6 1.6 0 000-2.263l-1.556 1.556zm.849 0a.6.6 0 01-.849 0l1.556-1.556a1.6 1.6 0 00-2.263 0l1.556 1.556zm-2.682 2.682l2.682-2.682-1.556-1.556-2.682 2.682 1.556 1.556zm-1.878-4.571v3.793h2.2v-3.793h-2.2zm.6.6a.6.6 0 01-.6-.6h2.2a1.6 1.6 0 00-1.6-1.6v2.2z"
                    fill={
                        props.focused
                            ? ipctColors.blueRibbon
                            : ipctColors.darBlue
                    }
                    mask="url(#prefix__c)"
                />
                <Circle cx={25.879} cy={17.346} r={3.5} fill="#fff" />
                <Circle
                    cx={25.879}
                    cy={17.346}
                    r={2}
                    fill="#fff"
                    stroke={
                        props.focused
                            ? ipctColors.blueRibbon
                            : ipctColors.darBlue
                    }
                />
            </G>
        </Svg>
    );
}

export default ManageSvg;
