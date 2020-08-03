import Constants from 'expo-constants';

const commonConfig = {
    /**
     * Block explorer base URL. Contract address is added at the end.
     */
    blockExplorer: 'https://alfajores-blockscout.celo-testnet.org/address/',

    /**
     * cUSD decimals to use in ui format
     */
    cUSDDecimals: 18
}
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
        impactMarketContractAddress: process.env.EXPO_DEV_IMPACT_MARKET_CONTRACT!,
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
        impactMarketContractAddress: '0xc57594675444BeC25f2863B8549c8e485dA290C1',
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
        impactMarketContractAddress: '0xc70cC218AE84cfDb0De11783082c49E3702092fb',
    }
}

function getEnvVars() {
    const { releaseChannel } = Constants.manifest;

    if (releaseChannel === undefined) return { ...commonConfig, ...ENV.dev };
    if (releaseChannel.indexOf('production') !== -1) return { ...commonConfig, ...ENV.production };
    if (releaseChannel.indexOf('staging') !== -1) return { ...commonConfig, ...ENV.staging };

    return { ...commonConfig, ...ENV.dev };
}

export default getEnvVars()