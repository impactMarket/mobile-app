import Constants from 'expo-constants';

const commonConfig = {
    /**
     * cUSD decimals to use in ui format
     */
    cUSDDecimals: 18,

    /**
     * Margin error to be added when adding new community
     */
    locationErrorMargin: 0.003,

    /**
     * Out of time threshold in milliseconds used to verify phones time
     */
    outOfTimeThreshold: 10000,

    /**
     * The default API URL
     */
    baseApiUrl: process.env.EXPO_API_BASE_URL + '/api',
};
const ENV = {
    dev: {
        /**
         * Block explorer base URL. Contract address is added at the end.
         */
        blockExplorer: 'https://alfajores-blockscout.celo-testnet.org/address/',

        /**
         * JSON RPC url
         */
        jsonRpc: 'https://alfajores-forno.celo-testnet.org',

        /**
         * cUSD contract address
         */
        cUSDContract: '0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1',

        /**
         * Is it in testnet?
         */
        testnet: true,
    },
    staging: {
        /**
         * Block explorer base URL. Contract address is added at the end.
         */
        blockExplorer: 'https://alfajores-blockscout.celo-testnet.org/address/',

        /**
         * JSON RPC url
         */
        jsonRpc: 'https://alfajores-forno.celo-testnet.org',

        /**
         * cUSD contract address
         */
        cUSDContract: '0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1',

        /**
         * Is it in testnet?
         */
        testnet: true,
    },
    production: {
        /**
         * Block explorer base URL. Contract address is added at the end.
         */
        blockExplorer: 'https://explorer.celo.org/address/',

        /**
         * JSON RPC url
         */
        jsonRpc:
            'https://celo-mainnet--rpc.datahub.figment.io/apikey/' +
            process.env.EXPO_FIGMENT_API_KEY! +
            '/',

        /**
         * cUSD contract address
         */
        cUSDContract: '0x765de816845861e75a25fca122bb6898b8b1282a',

        /**
         * Is it in testnet?
         */
        testnet: false,
    },
};

function getEnvVars() {
    if (__DEV__) {
        // thanks https://stackoverflow.com/a/57468503/3348623
        // do dev stuff 🤘
        if (process.env.EXPO_USE_STAGING) {
            return { ...commonConfig, ...ENV.staging };
        }
        return { ...commonConfig, ...ENV.dev };
    } else if (Constants.appOwnership === 'expo') {
        return { ...commonConfig, ...ENV.staging };
    }
    return { ...commonConfig, ...ENV.production };
}

export default getEnvVars();
