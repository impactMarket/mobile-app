import Constants from 'expo-constants';

const commonConfig = {
    /**
     * Block explorer base URL. Contract address is added at the end.
     */
    blockExplorer: 'https://alfajores-blockscout.celo-testnet.org/address/',

    /**
     * JSON RPC url
     */
    jsonRpc: `https://celo-alfajores.datahub.figment.network/apikey/${process.env.EXPO_FIGMENT_API_KEY}/`,

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
        impactMarketContractAddress: '0xf67A23C86C95bF392bCdDd2e81f2aa6eDb257208',
    },
    prod: {
        /**
         * The default API URL
         */
        baseApiUrl: process.env.EXPO_API_BASE_URL + '/api',

        /**
         * Contract Address to use in dev
         */
        impactMarketContractAddress: '0xc57594675444BeC25f2863B8549c8e485dA290C1',
    }
}

function getEnvVars() {
    console.log('Constants.manifest.extra', Constants.manifest.extra, process.env.EXPO_FIGMENT_API_KEY);
    if (Constants.manifest.packagerOpts !== undefined) {
        if (Constants.manifest.packagerOpts.dev !== undefined) {
            return Constants.manifest.packagerOpts.dev ? { ...commonConfig, ...ENV.dev } : { ...commonConfig, ...ENV.prod };
        }
    }
    return { ...commonConfig, ...ENV.prod };
}

export default getEnvVars()