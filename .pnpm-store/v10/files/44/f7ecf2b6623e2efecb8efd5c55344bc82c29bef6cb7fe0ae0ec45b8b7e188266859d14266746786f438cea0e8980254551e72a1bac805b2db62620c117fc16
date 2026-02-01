const require_chunk = require('./chunk-CdAKIUsw.js');
const require_dist_cjs$2 = require('./dist-cjs-DcvYtBnm.js');

//#region ../node_modules/.pnpm/@smithy+shared-ini-file-loader@4.4.0/node_modules/@smithy/shared-ini-file-loader/dist-cjs/getHomeDir.js
var require_getHomeDir = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.getHomeDir = void 0;
	const os_1 = require("os");
	const path_1$1 = require("path");
	const homeDirCache = {};
	const getHomeDirCacheKey = () => {
		if (process && process.geteuid) return `${process.geteuid()}`;
		return "DEFAULT";
	};
	const getHomeDir = () => {
		const { HOME, USERPROFILE, HOMEPATH, HOMEDRIVE = `C:${path_1$1.sep}` } = process.env;
		if (HOME) return HOME;
		if (USERPROFILE) return USERPROFILE;
		if (HOMEPATH) return `${HOMEDRIVE}${HOMEPATH}`;
		const homeDirCacheKey = getHomeDirCacheKey();
		if (!homeDirCache[homeDirCacheKey]) homeDirCache[homeDirCacheKey] = (0, os_1.homedir)();
		return homeDirCache[homeDirCacheKey];
	};
	exports.getHomeDir = getHomeDir;
}));

//#endregion
//#region ../node_modules/.pnpm/@smithy+shared-ini-file-loader@4.4.0/node_modules/@smithy/shared-ini-file-loader/dist-cjs/getSSOTokenFilepath.js
var require_getSSOTokenFilepath = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.getSSOTokenFilepath = void 0;
	const crypto_1 = require("crypto");
	const path_1 = require("path");
	const getHomeDir_1 = require_getHomeDir();
	const getSSOTokenFilepath = (id) => {
		const cacheName = (0, crypto_1.createHash)("sha1").update(id).digest("hex");
		return (0, path_1.join)((0, getHomeDir_1.getHomeDir)(), ".aws", "sso", "cache", `${cacheName}.json`);
	};
	exports.getSSOTokenFilepath = getSSOTokenFilepath;
}));

//#endregion
//#region ../node_modules/.pnpm/@smithy+shared-ini-file-loader@4.4.0/node_modules/@smithy/shared-ini-file-loader/dist-cjs/getSSOTokenFromFile.js
var require_getSSOTokenFromFile = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.getSSOTokenFromFile = exports.tokenIntercept = void 0;
	const promises_1$1 = require("fs/promises");
	const getSSOTokenFilepath_1 = require_getSSOTokenFilepath();
	exports.tokenIntercept = {};
	const getSSOTokenFromFile = async (id) => {
		if (exports.tokenIntercept[id]) return exports.tokenIntercept[id];
		const ssoTokenFilepath = (0, getSSOTokenFilepath_1.getSSOTokenFilepath)(id);
		const ssoTokenText = await (0, promises_1$1.readFile)(ssoTokenFilepath, "utf8");
		return JSON.parse(ssoTokenText);
	};
	exports.getSSOTokenFromFile = getSSOTokenFromFile;
}));

//#endregion
//#region ../node_modules/.pnpm/@smithy+shared-ini-file-loader@4.4.0/node_modules/@smithy/shared-ini-file-loader/dist-cjs/readFile.js
var require_readFile = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.readFile = exports.fileIntercept = exports.filePromises = void 0;
	const promises_1 = require("node:fs/promises");
	exports.filePromises = {};
	exports.fileIntercept = {};
	const readFile = (path$1, options) => {
		if (exports.fileIntercept[path$1] !== void 0) return exports.fileIntercept[path$1];
		if (!exports.filePromises[path$1] || options?.ignoreCache) exports.filePromises[path$1] = (0, promises_1.readFile)(path$1, "utf8");
		return exports.filePromises[path$1];
	};
	exports.readFile = readFile;
}));

//#endregion
//#region ../node_modules/.pnpm/@smithy+shared-ini-file-loader@4.4.0/node_modules/@smithy/shared-ini-file-loader/dist-cjs/index.js
var require_dist_cjs = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	var getHomeDir = require_getHomeDir();
	var getSSOTokenFilepath = require_getSSOTokenFilepath();
	var getSSOTokenFromFile = require_getSSOTokenFromFile();
	var path = require("path");
	var types = require_dist_cjs$2.require_dist_cjs();
	var readFile = require_readFile();
	const ENV_PROFILE = "AWS_PROFILE";
	const DEFAULT_PROFILE = "default";
	const getProfileName = (init) => init.profile || process.env[ENV_PROFILE] || DEFAULT_PROFILE;
	const CONFIG_PREFIX_SEPARATOR = ".";
	const getConfigData = (data) => Object.entries(data).filter(([key]) => {
		const indexOfSeparator = key.indexOf(CONFIG_PREFIX_SEPARATOR);
		if (indexOfSeparator === -1) return false;
		return Object.values(types.IniSectionType).includes(key.substring(0, indexOfSeparator));
	}).reduce((acc, [key, value]) => {
		const indexOfSeparator = key.indexOf(CONFIG_PREFIX_SEPARATOR);
		const updatedKey = key.substring(0, indexOfSeparator) === types.IniSectionType.PROFILE ? key.substring(indexOfSeparator + 1) : key;
		acc[updatedKey] = value;
		return acc;
	}, { ...data.default && { default: data.default } });
	const ENV_CONFIG_PATH = "AWS_CONFIG_FILE";
	const getConfigFilepath = () => process.env[ENV_CONFIG_PATH] || path.join(getHomeDir.getHomeDir(), ".aws", "config");
	const ENV_CREDENTIALS_PATH = "AWS_SHARED_CREDENTIALS_FILE";
	const getCredentialsFilepath = () => process.env[ENV_CREDENTIALS_PATH] || path.join(getHomeDir.getHomeDir(), ".aws", "credentials");
	const prefixKeyRegex = /^([\w-]+)\s(["'])?([\w-@\+\.%:/]+)\2$/;
	const profileNameBlockList = ["__proto__", "profile __proto__"];
	const parseIni = (iniData) => {
		const map = {};
		let currentSection;
		let currentSubSection;
		for (const iniLine of iniData.split(/\r?\n/)) {
			const trimmedLine = iniLine.split(/(^|\s)[;#]/)[0].trim();
			if (trimmedLine[0] === "[" && trimmedLine[trimmedLine.length - 1] === "]") {
				currentSection = void 0;
				currentSubSection = void 0;
				const sectionName = trimmedLine.substring(1, trimmedLine.length - 1);
				const matches = prefixKeyRegex.exec(sectionName);
				if (matches) {
					const [, prefix, , name] = matches;
					if (Object.values(types.IniSectionType).includes(prefix)) currentSection = [prefix, name].join(CONFIG_PREFIX_SEPARATOR);
				} else currentSection = sectionName;
				if (profileNameBlockList.includes(sectionName)) throw new Error(`Found invalid profile name "${sectionName}"`);
			} else if (currentSection) {
				const indexOfEqualsSign = trimmedLine.indexOf("=");
				if (![0, -1].includes(indexOfEqualsSign)) {
					const [name, value] = [trimmedLine.substring(0, indexOfEqualsSign).trim(), trimmedLine.substring(indexOfEqualsSign + 1).trim()];
					if (value === "") currentSubSection = name;
					else {
						if (currentSubSection && iniLine.trimStart() === iniLine) currentSubSection = void 0;
						map[currentSection] = map[currentSection] || {};
						const key = currentSubSection ? [currentSubSection, name].join(CONFIG_PREFIX_SEPARATOR) : name;
						map[currentSection][key] = value;
					}
				}
			}
		}
		return map;
	};
	const swallowError$1 = () => ({});
	const loadSharedConfigFiles = async (init = {}) => {
		const { filepath = getCredentialsFilepath(), configFilepath = getConfigFilepath() } = init;
		const homeDir = getHomeDir.getHomeDir();
		const relativeHomeDirPrefix = "~/";
		let resolvedFilepath = filepath;
		if (filepath.startsWith(relativeHomeDirPrefix)) resolvedFilepath = path.join(homeDir, filepath.slice(2));
		let resolvedConfigFilepath = configFilepath;
		if (configFilepath.startsWith(relativeHomeDirPrefix)) resolvedConfigFilepath = path.join(homeDir, configFilepath.slice(2));
		const parsedFiles = await Promise.all([readFile.readFile(resolvedConfigFilepath, { ignoreCache: init.ignoreCache }).then(parseIni).then(getConfigData).catch(swallowError$1), readFile.readFile(resolvedFilepath, { ignoreCache: init.ignoreCache }).then(parseIni).catch(swallowError$1)]);
		return {
			configFile: parsedFiles[0],
			credentialsFile: parsedFiles[1]
		};
	};
	const getSsoSessionData = (data) => Object.entries(data).filter(([key]) => key.startsWith(types.IniSectionType.SSO_SESSION + CONFIG_PREFIX_SEPARATOR)).reduce((acc, [key, value]) => ({
		...acc,
		[key.substring(key.indexOf(CONFIG_PREFIX_SEPARATOR) + 1)]: value
	}), {});
	const swallowError = () => ({});
	const loadSsoSessionData = async (init = {}) => readFile.readFile(init.configFilepath ?? getConfigFilepath()).then(parseIni).then(getSsoSessionData).catch(swallowError);
	const mergeConfigFiles = (...files) => {
		const merged = {};
		for (const file of files) for (const [key, values] of Object.entries(file)) if (merged[key] !== void 0) Object.assign(merged[key], values);
		else merged[key] = values;
		return merged;
	};
	const parseKnownFiles = async (init) => {
		const parsedFiles = await loadSharedConfigFiles(init);
		return mergeConfigFiles(parsedFiles.configFile, parsedFiles.credentialsFile);
	};
	const externalDataInterceptor = {
		getFileRecord() {
			return readFile.fileIntercept;
		},
		interceptFile(path$1, contents) {
			readFile.fileIntercept[path$1] = Promise.resolve(contents);
		},
		getTokenRecord() {
			return getSSOTokenFromFile.tokenIntercept;
		},
		interceptToken(id, contents) {
			getSSOTokenFromFile.tokenIntercept[id] = contents;
		}
	};
	Object.defineProperty(exports, "getSSOTokenFromFile", {
		enumerable: true,
		get: function() {
			return getSSOTokenFromFile.getSSOTokenFromFile;
		}
	});
	Object.defineProperty(exports, "readFile", {
		enumerable: true,
		get: function() {
			return readFile.readFile;
		}
	});
	exports.CONFIG_PREFIX_SEPARATOR = CONFIG_PREFIX_SEPARATOR;
	exports.DEFAULT_PROFILE = DEFAULT_PROFILE;
	exports.ENV_PROFILE = ENV_PROFILE;
	exports.externalDataInterceptor = externalDataInterceptor;
	exports.getProfileName = getProfileName;
	exports.loadSharedConfigFiles = loadSharedConfigFiles;
	exports.loadSsoSessionData = loadSsoSessionData;
	exports.parseKnownFiles = parseKnownFiles;
	Object.keys(getHomeDir).forEach(function(k) {
		if (k !== "default" && !Object.prototype.hasOwnProperty.call(exports, k)) Object.defineProperty(exports, k, {
			enumerable: true,
			get: function() {
				return getHomeDir[k];
			}
		});
	});
	Object.keys(getSSOTokenFilepath).forEach(function(k) {
		if (k !== "default" && !Object.prototype.hasOwnProperty.call(exports, k)) Object.defineProperty(exports, k, {
			enumerable: true,
			get: function() {
				return getSSOTokenFilepath[k];
			}
		});
	});
}));

//#endregion
Object.defineProperty(exports, 'require_dist_cjs', {
  enumerable: true,
  get: function () {
    return require_dist_cjs;
  }
});