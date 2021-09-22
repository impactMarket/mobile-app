const { getDefaultConfig } = require('@expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.extraNodeModules = {
    crypto: require.resolve('crypto-browserify'),
    url: require.resolve('url/'),
    fs: require.resolve('expo-file-system'),
    http: require.resolve('stream-http'),
    https: require.resolve('https-browserify'),
    os: require.resolve('os-browserify/browser.js'),
    stream: require.resolve('readable-stream'),
    vm: require.resolve('vm-browserify'),
    net: require.resolve('react-native-tcp'),
    path: require.resolve('path-browserify'),
    ...config.resolver?.resolver?.extraNodeModules,
};

module.exports = config;
