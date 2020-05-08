module.exports = {
	resolver: {
		extraNodeModules: {
			crypto: require.resolve('crypto-browserify'),
			url: require.resolve('url/'),
			fs: require.resolve('expo-file-system'),
			http: require.resolve('stream-http'),
			https: require.resolve('https-browserify'),
			os: require.resolve('os-browserify/browser.js'),
			stream: require.resolve('readable-stream'),
			vm: require.resolve('vm-browserify')
		}
	}
};