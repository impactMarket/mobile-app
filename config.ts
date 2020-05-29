import Constants from 'expo-constants';

const commonConfig = {
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
        baseApiUrl: 'http://192.168.1.110:5000/api',

        /**
         * Contract Address to use in dev
         */
        impactMarketContractAddress: '0x69B3589922b312c4F38e5A2363055eB2EBEFac83',
    },
    prod: {
        /**
         * The default API URL
         */
        baseApiUrl: 'https://impactmarket-poc-api.herokuapp.com/api',

        /**
         * Contract Address to use in dev
         */
        impactMarketContractAddress: '0x5975dFBB64361D9365219A7c42836B19a4c2Ca38',
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