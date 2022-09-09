module.exports = function (api) {
    api.cache(true);
    return {
        presets: ['babel-preset-expo'],
        plugins: [
            'inline-dotenv',
            [
                'module-resolver',
                {
                    alias: {
                        assets: './src/assets',
                        components: './src/components',
                        helpers: './src/helpers',
                        navigator: './src/navigator',
                        services: './src/services',
                        styles: './src/styles',
                        views: './src/views',
                    },
                },
            ],
            'react-native-reanimated/plugin',
        ],
    };
};
