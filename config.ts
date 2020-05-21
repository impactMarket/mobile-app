import Constants from 'expo-constants';

const commonConfig = {
    /**
     * JSON RPC url
     */
    jsonRpc: 'https://alfajores-forno.celo-testnet.org',

    /**
     * Used to query
     */
    baseBlockScoutApiUrl: 'https://alfajores-blockscout.celo-testnet.org/api',

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
        baseApiUrl: 'http://192.168.1.110:5000/api',

        /**
         * Contract Address to use in dev
         */
        impactMarketContractAddress: '0x571C4DDae57026c88a1C238165ebde37e60c995b',
    },
    prod: {
        /**
         * The default API URL
         */
        baseApiUrl: 'https://impactmarket-poc-api.herokuapp.com/api',

        /**
         * Contract Address to use in dev
         */
        impactMarketContractAddress: '0x80820c492179FFbc109942AEEDF427bAB3082948',
    }
}

function getEnvVars() {
    if (Constants.manifest.packagerOpts !== undefined) {
        if (Constants.manifest.packagerOpts.dev !== undefined) {
            return Constants.manifest.packagerOpts.dev ? { ...commonConfig, ...ENV.dev } : { ...commonConfig, ...ENV.prod };
        }
    }
    return { ...commonConfig, ...ENV.prod };
}

export default getEnvVars()