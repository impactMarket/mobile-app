import Constants from 'expo-constants';

const commonConfig = {
    /**
     * Block explorer base URL. Contract address is added at the end.
     */
    blockExplorer: 'https://alfajores-blockscout.celo-testnet.org/address/',

    /**
     * JSON RPC url
     */
    jsonRpc: 'https://alfajores-forno.celo-testnet.org',

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
         * Contract Address to use in dev
         */
        impactMarketContractAddress: process.env.EXPO_DEV_CONTRACT_ADDRESS!,
    },
    stag: {
        /**
         * The default API URL
         */
        baseApiUrl: 'https://impactmarket-api-staging.herokuapp.com/api',

        /**
         * Contract Address to use in dev
         */
        impactMarketContractAddress: '0xc57594675444BeC25f2863B8549c8e485dA290C1',
    },
    prod: {
        /**
         * The default API URL
         */
        baseApiUrl: 'https://impactmarket-api-prod.herokuapp.com/api',

        /**
         * Contract Address to use in dev
         */
        impactMarketContractAddress: '0xc70cC218AE84cfDb0De11783082c49E3702092fb',
    }
}

function getEnvVars() {
    const { releaseChannel } = Constants.manifest;

    if (releaseChannel === undefined) return { ...commonConfig, ...ENV.dev };
    if (releaseChannel.indexOf('production') !== -1) return { ...commonConfig, ...ENV.prod };
    if (releaseChannel.indexOf('staging') !== -1) return { ...commonConfig, ...ENV.stag };

    return { ...commonConfig, ...ENV.dev };
}

export default getEnvVars()