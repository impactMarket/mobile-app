export default {
    /**
     * cUSD decimals to use in ui format
     */
    cUSDDecimals: 18,

    /**
     * Margin error to be added when adding new community
     */
    locationErrorMargin: 0.003,

    /**
     * Out of time threshold in milliseconds used to verify phones time
     */
    outOfTimeThreshold: 10000,

    /**
     * The default API URL
     */
    baseApiUrl: process.env.EXPO_API_BASE_URL! + '/api',

    /**
     * Block explorer base URL. Contract address is added at the end.
     */
    blockExplorer: process.env.EXPO_BLOCK_EXPLORER_URL!,

    /**
     * JSON RPC url
     */
    jsonRpc: process.env.EXPO_JSON_RPC_URL!,

    /**
     * cUSD contract address
     */
    cUSDContract: process.env.EXPO_CUSD_CONTRACT_ADDRESS!,

    /**
     * Google API key, used for Translation API
     */
    googleApiKey: process.env.EXPO_GOOGLE_API_KEY!,

    /**
     * Is it in testnet?
     */
    testnet: process.env.EXPO_IS_TESTNET! === 'true',

    /**
     * Donation miner address
     */
    donationMinerAddress: '0xac66FDe03Efc73879424d2bD61F846e964ce6639',
};
