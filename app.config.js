export default ({ config }) => {
    return {
        ...config,
        extra: {
            apiKey: process.env.EXPO_FIGMENT_API_KEY,
            apiBaseUrl: process.env.EXPO_API_BASE_URL,
        },
    };
};