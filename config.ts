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
};
const ENV = {
    dev: {
        /**
         * Block explorer base URL. Contract address is added at the end.
         */
        blockExplorer: 'https://alfajores-blockscout.celo-testnet.org/address/',

        /**
         * The default API URL
         */
        baseApiUrl: process.env.EXPO_API_BASE_URL + '/api',

        /**
         * JSON RPC url
         */
        jsonRpc: 'https://alfajores-forno.celo-testnet.org',
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
         * The default API URL
         */
        baseApiUrl: 'https://impactmarket-api-staging.herokuapp.com/api',

        /**
         * JSON RPC url
         */
        jsonRpc: 'https://alfajores-forno.celo-testnet.org',

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
         * The default API URL
         */
        baseApiUrl: 'https://impactmarket-api-production.herokuapp.com/api',

        /**
         * JSON RPC url
         */
        jsonRpc: 'https://celo-mainnet--rpc.datahub.figment.io/apikey/b883d48310aa603380b19750aae4f9f4/',

        /**
         * Is it in testnet?
         */
        testnet: false,
    },
};

function getEnvVars() {
    if (Constants.manifest.packagerOpts?.dev) {
        return { ...commonConfig, ...ENV.dev };
    } else if (Constants.appOwnership === 'standalone') {
        return { ...commonConfig, ...ENV.production };
    } else if (Constants.appOwnership === 'expo') {
        if (Constants.manifest.releaseChannel?.indexOf('production') !== -1) {
            return { ...commonConfig, ...ENV.production };
        }
        return { ...commonConfig, ...ENV.staging };
    }
    return { ...commonConfig, ...ENV.dev };
}

export default getEnvVars();
