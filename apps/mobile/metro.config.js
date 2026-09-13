const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

// Expo's default config already handles pnpm workspace resolution (it walks up
// to the repo root for watch folders and the server root), so nothing beyond
// the NativeWind wrapper is needed here.
const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, { input: "./src/global.css" });
