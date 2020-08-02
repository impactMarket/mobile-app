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
                        services: './src/services'
                    },
                }
            ]
        ]
    };
};
