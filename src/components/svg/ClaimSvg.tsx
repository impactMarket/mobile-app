import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import { ipctColors } from 'styles/index';

function ClaimSvg(props: { focused: boolean }) {
    return (
        <Svg width={29} height={32} viewBox="0 0 29 32" fill="none" {...props}>
            <Path
                d="M2.126 20.807h0L1.033 22.4s0 0 0 0a.749.749 0 00.184 1.03.718.718 0 001.01-.187h0l1.094-1.594a5.201 5.201 0 011.855-1.658 5.12 5.12 0 012.403-.596m-5.453 1.412l5.453-1.312m-5.453 1.312a6.658 6.658 0 012.377-2.121 6.55 6.55 0 013.075-.761h9.724c.423-.002.841.096 1.221.284a2.763 2.763 0 011.372 1.54l.053.147.111-.11 3.904-3.875h0a2.725 2.725 0 013.116-.545h0l.004.001.044.02c.396.187.742.469 1.01.82a2.813 2.813 0 01.444 2.514 2.78 2.78 0 01-.667 1.127s0 0 0 0l-7.14 7.272h0a7.49 7.49 0 01-2.447 1.663 7.402 7.402 0 01-2.889.578h0-6.542a1.905 1.905 0 00-1.533.79m-5.237-9.344l5.236 9.344m.217-10.756v.1m0-.1h0v.1m0-.1h9.72c.352 0 .69.142.94.395a1.355 1.355 0 010 1.902 1.32 1.32 0 01-.94.395H11.2a.717.717 0 00-.511.214.741.741 0 000 1.04c.135.138.32.215.51.215H17.3m-9.72-4.061h9.72c.325 0 .638.131.868.365a1.255 1.255 0 010 1.762 1.22 1.22 0 01-.869.364h-6.097a.817.817 0 00-.583.245.841.841 0 000 1.18.817.817 0 00.582.245H17.3m0-.1v.1m0-.1c.458 0 .909-.115 1.313-.336a2.79 2.79 0 001-.927l.006-.01.007-.007 5.352-5.348h0a1.31 1.31 0 011.495-.257l.045.02h.003a1.31 1.31 0 01.677 1.577c-.063.2-.172.38-.32.528 0 0 0 0 0 0l-7.126 7.285h0a6.055 6.055 0 01-1.978 1.343c-.74.311-1.534.47-2.335.468l1.86-4.235m0-.1h0v.1M5.074 30.663a.84.84 0 00-.157.62c.031.218.147.416.321.549a.814.814 0 001.153-.167l1.054-1.456a1.778 1.778 0 011.452-.748l-3.823 1.202zm0 0l1.05-1.446-1.05 1.446zm2.29-.513l-1.054 1.456s0 0 0 0a.714.714 0 01-1.011.146.737.737 0 01-.267-.77.74.74 0 01.122-.26h0l1.051-1.447h0c.31-.428.716-.777 1.184-1.017.467-.24.984-.366 1.508-.367 0 0 0 0 0 0l-1.534 2.26zm19.068-13.39a1.21 1.21 0 00-1.383.238l1.383-.237zm0 0l.046.02-.046-.02zm-9.13 1.064H7.58a6.65 6.65 0 00-3.123.772 6.759 6.759 0 00-2.412 2.154l15.258-2.926z"
                fill="#2362FB"
                stroke="#fff"
                strokeWidth={0.2}
            />
            <Path
                d="M10.003 4.234C10.003 2.05 11.766.2 13.968.2c2.197 0 3.964 1.847 3.964 4.034a3.97 3.97 0 01-3.964 3.964 3.97 3.97 0 01-3.965-3.964zm1.682 0a2.285 2.285 0 002.283 2.282 2.285 2.285 0 002.282-2.282c0-1.27-1.037-2.352-2.282-2.352-1.246 0-2.283 1.081-2.283 2.352zM5.003 12.234c0-2.183 1.763-4.034 3.965-4.034 2.197 0 3.964 1.848 3.964 4.034a3.97 3.97 0 01-3.964 3.964 3.97 3.97 0 01-3.965-3.964zm1.682 0a2.285 2.285 0 002.283 2.282 2.285 2.285 0 002.282-2.282c0-1.27-1.037-2.352-2.282-2.352-1.246 0-2.283 1.081-2.283 2.352zM15.003 12.234c0-2.183 1.763-4.034 3.965-4.034 2.197 0 3.964 1.848 3.964 4.034a3.97 3.97 0 01-3.964 3.964 3.97 3.97 0 01-3.965-3.964zm1.682 0a2.285 2.285 0 002.283 2.282 2.285 2.285 0 002.282-2.282c0-1.27-1.037-2.352-2.282-2.352-1.246 0-2.283 1.081-2.283 2.352z"
                fill="#2362FB"
                stroke="#fff"
                strokeWidth={0.4}
            />
        </Svg>
    );
}

export default ClaimSvg;
