import Constants from 'expo-constants';

const ENV = {
    dev: {
        /**
         * The default API URL
         */
        baseApiUrl: 'http://192.168.1.110:5000/api',

        /**
         * JSON RPC url
         */
        jsonRpc: 'https://alfajores-forno.celo-testnet.org',

        /**
         * Contract Address to use in dev
         */
        impactMarketContractAddress: '0x03582fE5f7b2F33c572FDFeDEBcc994E50f5586E',
    },
    prod: {
        /**
         * The default API URL
         */
        baseApiUrl: 'https://impactmarket-poc-api.herokuapp.com/api',

        /**
         * JSON RPC url
         */
        jsonRpc: 'https://alfajores-forno.celo-testnet.org',

        /**
         * Contract Address to use in dev
         */
        impactMarketContractAddress: '0x74DF0a14C1358e78A904822ddCA8b85D969b3c3c',
    }
}

function getEnvVars(env = '') {
    if (env === null || env === undefined || env === '') return ENV.dev
    if (env.indexOf('dev') !== -1) return ENV.dev
    if (env.indexOf('prod') !== -1) return ENV.prod
    return ENV.dev
}

export default getEnvVars(Constants.manifest.releaseChannel)