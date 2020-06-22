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
        baseApiUrl: 'http://192.168.1.109:5000/api',

        /**
         * Contract Address to use in dev
         */
        impactMarketContractAddress: '0xf67A23C86C95bF392bCdDd2e81f2aa6eDb257208',
    },
    prod: {
        /**
         * The default API URL
         */
        baseApiUrl: 'https://impactmarket-poc-api.herokuapp.com/api',

        /**
         * Contract Address to use in dev
         */
        impactMarketContractAddress: '0x52Fb07781152fa57f8CeF1eAeF789e4B5400Ca97',
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