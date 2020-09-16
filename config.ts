import Constants from 'expo-constants';

const commonConfig = {
    /**
     * cUSD decimals to use in ui format
     */
    cUSDDecimals: 18,

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
         * Contract Address to use in dev
         */
        impactMarketContractAddress: process.env
            .EXPO_DEV_IMPACT_MARKET_CONTRACT!,

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
         * Contract Address to use in dev
         */
        impactMarketContractAddress:
            '0x4ebE844858c756498902B6517b20d50e28F8Dd62',

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
         * Contract Address to use in dev
         */
        impactMarketContractAddress:
            '0x2437F9ca0ac21bD2377734800918c2FBE0E566Ca',

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
