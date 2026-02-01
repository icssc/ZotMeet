const require_chunk = require('./chunk-CdAKIUsw.js');
const require_dist_cjs$5 = require('./dist-cjs-CxAZshVx.js');
const require_dist_cjs$6 = require('./dist-cjs-DrUzD-Vw.js');

//#region ../node_modules/.pnpm/@smithy+querystring-parser@4.2.5/node_modules/@smithy/querystring-parser/dist-cjs/index.js
var require_dist_cjs$2 = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	function parseQueryString(querystring) {
		const query = {};
		querystring = querystring.replace(/^\?/, "");
		if (querystring) for (const pair of querystring.split("&")) {
			let [key, value = null] = pair.split("=");
			key = decodeURIComponent(key);
			if (value) value = decodeURIComponent(value);
			if (!(key in query)) query[key] = value;
			else if (Array.isArray(query[key])) query[key].push(value);
			else query[key] = [query[key], value];
		}
		return query;
	}
	exports.parseQueryString = parseQueryString;
}));

//#endregion
//#region ../node_modules/.pnpm/@smithy+url-parser@4.2.5/node_modules/@smithy/url-parser/dist-cjs/index.js
var require_dist_cjs$1 = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	var querystringParser = require_dist_cjs$2();
	const parseUrl = (url) => {
		if (typeof url === "string") return parseUrl(new URL(url));
		const { hostname, pathname, port, protocol, search } = url;
		let query;
		if (search) query = querystringParser.parseQueryString(search);
		return {
			hostname,
			port: port ? parseInt(port) : void 0,
			protocol,
			path: pathname,
			query
		};
	};
	exports.parseUrl = parseUrl;
}));

//#endregion
//#region ../node_modules/.pnpm/@smithy+node-config-provider@4.3.5/node_modules/@smithy/node-config-provider/dist-cjs/index.js
var require_dist_cjs = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	var propertyProvider = require_dist_cjs$5.require_dist_cjs();
	var sharedIniFileLoader = require_dist_cjs$6.require_dist_cjs();
	function getSelectorName(functionString) {
		try {
			const constants = new Set(Array.from(functionString.match(/([A-Z_]){3,}/g) ?? []));
			constants.delete("CONFIG");
			constants.delete("CONFIG_PREFIX_SEPARATOR");
			constants.delete("ENV");
			return [...constants].join(", ");
		} catch (e) {
			return functionString;
		}
	}
	const fromEnv = (envVarSelector, options) => async () => {
		try {
			const config = envVarSelector(process.env, options);
			if (config === void 0) throw new Error();
			return config;
		} catch (e) {
			throw new propertyProvider.CredentialsProviderError(e.message || `Not found in ENV: ${getSelectorName(envVarSelector.toString())}`, { logger: options?.logger });
		}
	};
	const fromSharedConfigFiles = (configSelector, { preferredFile = "config", ...init } = {}) => async () => {
		const profile = sharedIniFileLoader.getProfileName(init);
		const { configFile, credentialsFile } = await sharedIniFileLoader.loadSharedConfigFiles(init);
		const profileFromCredentials = credentialsFile[profile] || {};
		const profileFromConfig = configFile[profile] || {};
		const mergedProfile = preferredFile === "config" ? {
			...profileFromCredentials,
			...profileFromConfig
		} : {
			...profileFromConfig,
			...profileFromCredentials
		};
		try {
			const configValue = configSelector(mergedProfile, preferredFile === "config" ? configFile : credentialsFile);
			if (configValue === void 0) throw new Error();
			return configValue;
		} catch (e) {
			throw new propertyProvider.CredentialsProviderError(e.message || `Not found in config files w/ profile [${profile}]: ${getSelectorName(configSelector.toString())}`, { logger: init.logger });
		}
	};
	const isFunction = (func) => typeof func === "function";
	const fromStatic = (defaultValue) => isFunction(defaultValue) ? async () => await defaultValue() : propertyProvider.fromStatic(defaultValue);
	const loadConfig = ({ environmentVariableSelector, configFileSelector, default: defaultValue }, configuration = {}) => {
		const { signingName, logger } = configuration;
		const envOptions = {
			signingName,
			logger
		};
		return propertyProvider.memoize(propertyProvider.chain(fromEnv(environmentVariableSelector, envOptions), fromSharedConfigFiles(configFileSelector, configuration), fromStatic(defaultValue)));
	};
	exports.loadConfig = loadConfig;
}));

//#endregion
Object.defineProperty(exports, 'require_dist_cjs', {
  enumerable: true,
  get: function () {
    return require_dist_cjs;
  }
});
Object.defineProperty(exports, 'require_dist_cjs$1', {
  enumerable: true,
  get: function () {
    return require_dist_cjs$1;
  }
});