module.exports = (api) => {
	api.cache(true);
	return {
		presets: [
			["babel-preset-expo", { jsxImportSource: "nativewind" }],
			"nativewind/babel",
		],
		plugins: [
			// Must stay last. Reanimated 4 ships its worklets plugin under
			// `react-native-worklets`; it is installed ahead of the availability
			// grid work even though nothing uses it yet.
			"react-native-worklets/plugin",
		],
	};
};
