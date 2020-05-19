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
        impactMarketContractAddress: '0x571C4DDae57026c88a1C238165ebde37e60c995b',

        /**
         * Used to query
         */
        baseBlockScoutApiUrl: 'https://alfajores-blockscout.celo-testnet.org/api'
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
        impactMarketContractAddress: '0xeb74F9d4f4b4c1D73bcc9f0fDF5f413A2346A8De',

        /**
         * Used to query
         */
        baseBlockScoutApiUrl: 'https://alfajores-blockscout.celo-testnet.org/api'
    }
}

function getEnvVars() {
    if (Constants.manifest.packagerOpts !== undefined) {
        if (Constants.manifest.packagerOpts.dev !== undefined) {
            return Constants.manifest.packagerOpts.dev ? ENV.dev : ENV.prod;
        }
    }
    return ENV.prod;
}

export default getEnvVars()