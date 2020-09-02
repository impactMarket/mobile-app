import Constants from 'expo-constants';

const commonConfig = {
    /**
     * Block explorer base URL. Contract address is added at the end.
     */
    blockExplorer: 'https://alfajores-blockscout.celo-testnet.org/address/',

    /**
     * cUSD decimals to use in ui format
     */
    cUSDDecimals: 18,
};
const ENV = {
    dev: {
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
    },
    staging: {
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
    },
    production: {
        /**
         * The default API URL
         */
        baseApiUrl: 'https://impactmarket-api-production.herokuapp.com/api',

        /**
         * JSON RPC url
         */
        jsonRpc: 'https://alfajores-forno.celo-testnet.org',

        /**
         * Contract Address to use in dev
         */
        impactMarketContractAddress:
            '0xa7C3103EC5eE8188A7D20E70d5398F727DBb5A1A',
    },
};

function getEnvVars() {
    if (Constants.manifest.packagerOpts?.dev)
        return { ...commonConfig, ...ENV.dev };
    else if (Constants.appOwnership === 'standalone')
        return { ...commonConfig, ...ENV.production };
    else if (Constants.appOwnership === 'expo') {
        if (Constants.manifest.releaseChannel?.indexOf('production') !== -1)
            return { ...commonConfig, ...ENV.production };
        return { ...commonConfig, ...ENV.staging };
    }
    return { ...commonConfig, ...ENV.dev };
}

export default getEnvVars();
