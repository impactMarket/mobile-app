import Constants from 'expo-constants';

const ENV = {
    dev: {
        /**
         * The default API URL
         */
        baseApiUrl: 'http://192.168.0.209:5000/api',

        /**
         * JSON RPC url
         */
        jsonRpc: 'https://alfajores-forno.celo-testnet.org'
    },
    prod: {
        /**
         * The default API URL
         */
        baseApiUrl: 'https://impactmarket-poc-api.herokuapp.com/api',

        /**
         * JSON RPC url
         */
        jsonRpc: 'https://alfajores-forno.celo-testnet.org'
    }
}

function getEnvVars(env = '') {
    if (env === null || env === undefined || env === '') return ENV.dev
    if (env.indexOf('dev') !== -1) return ENV.dev
    if (env.indexOf('prod') !== -1) return ENV.prod
    return ENV.dev
}

export default getEnvVars(Constants.manifest.releaseChannel)