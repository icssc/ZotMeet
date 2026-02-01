const require_chunk = require('./chunk-CdAKIUsw.js');
const require_dist_cjs$29 = require('./dist-cjs-BawS8oYv.js');
const require_dist_cjs$30 = require('./dist-cjs-B9UsuYCY.js');
const require_dist_cjs$31 = require('./dist-cjs-BMOAUmMP.js');
const require_dist_cjs$32 = require('./dist-cjs-DVzRDdXz.js');
const require_dist_cjs$33 = require('./dist-cjs-CWItNfj0.js');
require('./client-BsEbA1K3.js');
const require_dist_cjs$34 = require('./dist-cjs-CxAZshVx.js');
const require_dist_cjs$35 = require('./dist-cjs-DrUzD-Vw.js');
const require_dist_cjs$36 = require('./dist-cjs-DFDJXm1l.js');

//#region ../node_modules/.pnpm/@aws-sdk+client-rds-data@3.940.0/node_modules/@aws-sdk/client-rds-data/dist-cjs/auth/httpAuthSchemeProvider.js
var require_httpAuthSchemeProvider = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.resolveHttpAuthSchemeConfig = exports.defaultRDSDataHttpAuthSchemeProvider = exports.defaultRDSDataHttpAuthSchemeParametersProvider = void 0;
	const core_1 = (require_dist_cjs$30.init_dist_es(), require_chunk.__toCommonJS(require_dist_cjs$30.dist_es_exports));
	const util_middleware_1 = require_dist_cjs$31.require_dist_cjs$7();
	const defaultRDSDataHttpAuthSchemeParametersProvider = async (config, context, input) => {
		return {
			operation: (0, util_middleware_1.getSmithyContext)(context).operation,
			region: await (0, util_middleware_1.normalizeProvider)(config.region)() || (() => {
				throw new Error("expected `region` to be configured for `aws.auth#sigv4`");
			})()
		};
	};
	exports.defaultRDSDataHttpAuthSchemeParametersProvider = defaultRDSDataHttpAuthSchemeParametersProvider;
	function createAwsAuthSigv4HttpAuthOption(authParameters) {
		return {
			schemeId: "aws.auth#sigv4",
			signingProperties: {
				name: "rds-data",
				region: authParameters.region
			},
			propertiesExtractor: (config, context) => ({ signingProperties: {
				config,
				context
			} })
		};
	}
	const defaultRDSDataHttpAuthSchemeProvider = (authParameters) => {
		const options = [];
		switch (authParameters.operation) {
			default: options.push(createAwsAuthSigv4HttpAuthOption(authParameters));
		}
		return options;
	};
	exports.defaultRDSDataHttpAuthSchemeProvider = defaultRDSDataHttpAuthSchemeProvider;
	const resolveHttpAuthSchemeConfig = (config) => {
		const config_0 = (0, core_1.resolveAwsSdkSigV4Config)(config);
		return Object.assign(config_0, { authSchemePreference: (0, util_middleware_1.normalizeProvider)(config.authSchemePreference ?? []) });
	};
	exports.resolveHttpAuthSchemeConfig = resolveHttpAuthSchemeConfig;
}));

//#endregion
//#region ../node_modules/.pnpm/@aws-sdk+client-rds-data@3.940.0/node_modules/@aws-sdk/client-rds-data/package.json
var require_package = /* @__PURE__ */ require_chunk.__commonJSMin(((exports, module) => {
	module.exports = {
		"name": "@aws-sdk/client-rds-data",
		"description": "AWS SDK for JavaScript Rds Data Client for Node.js, Browser and React Native",
		"version": "3.940.0",
		"scripts": {
			"build": "concurrently 'yarn:build:cjs' 'yarn:build:es' 'yarn:build:types'",
			"build:cjs": "node ../../scripts/compilation/inline client-rds-data",
			"build:es": "tsc -p tsconfig.es.json",
			"build:include:deps": "lerna run --scope $npm_package_name --include-dependencies build",
			"build:types": "tsc -p tsconfig.types.json",
			"build:types:downlevel": "downlevel-dts dist-types dist-types/ts3.4",
			"clean": "rimraf ./dist-* && rimraf *.tsbuildinfo",
			"extract:docs": "api-extractor run --local",
			"generate:client": "node ../../scripts/generate-clients/single-service --solo rds-data"
		},
		"main": "./dist-cjs/index.js",
		"types": "./dist-types/index.d.ts",
		"module": "./dist-es/index.js",
		"sideEffects": false,
		"dependencies": {
			"@aws-crypto/sha256-browser": "5.2.0",
			"@aws-crypto/sha256-js": "5.2.0",
			"@aws-sdk/core": "3.940.0",
			"@aws-sdk/credential-provider-node": "3.940.0",
			"@aws-sdk/middleware-host-header": "3.936.0",
			"@aws-sdk/middleware-logger": "3.936.0",
			"@aws-sdk/middleware-recursion-detection": "3.936.0",
			"@aws-sdk/middleware-user-agent": "3.940.0",
			"@aws-sdk/region-config-resolver": "3.936.0",
			"@aws-sdk/types": "3.936.0",
			"@aws-sdk/util-endpoints": "3.936.0",
			"@aws-sdk/util-user-agent-browser": "3.936.0",
			"@aws-sdk/util-user-agent-node": "3.940.0",
			"@smithy/config-resolver": "^4.4.3",
			"@smithy/core": "^3.18.5",
			"@smithy/fetch-http-handler": "^5.3.6",
			"@smithy/hash-node": "^4.2.5",
			"@smithy/invalid-dependency": "^4.2.5",
			"@smithy/middleware-content-length": "^4.2.5",
			"@smithy/middleware-endpoint": "^4.3.12",
			"@smithy/middleware-retry": "^4.4.12",
			"@smithy/middleware-serde": "^4.2.6",
			"@smithy/middleware-stack": "^4.2.5",
			"@smithy/node-config-provider": "^4.3.5",
			"@smithy/node-http-handler": "^4.4.5",
			"@smithy/protocol-http": "^5.3.5",
			"@smithy/smithy-client": "^4.9.8",
			"@smithy/types": "^4.9.0",
			"@smithy/url-parser": "^4.2.5",
			"@smithy/util-base64": "^4.3.0",
			"@smithy/util-body-length-browser": "^4.2.0",
			"@smithy/util-body-length-node": "^4.2.1",
			"@smithy/util-defaults-mode-browser": "^4.3.11",
			"@smithy/util-defaults-mode-node": "^4.2.14",
			"@smithy/util-endpoints": "^3.2.5",
			"@smithy/util-middleware": "^4.2.5",
			"@smithy/util-retry": "^4.2.5",
			"@smithy/util-utf8": "^4.2.0",
			"tslib": "^2.6.2"
		},
		"devDependencies": {
			"@tsconfig/node18": "18.2.4",
			"@types/node": "^18.19.69",
			"concurrently": "7.0.0",
			"downlevel-dts": "0.10.1",
			"rimraf": "3.0.2",
			"typescript": "~5.8.3"
		},
		"engines": { "node": ">=18.0.0" },
		"typesVersions": { "<4.0": { "dist-types/*": ["dist-types/ts3.4/*"] } },
		"files": ["dist-*/**"],
		"author": {
			"name": "AWS SDK for JavaScript Team",
			"url": "https://aws.amazon.com/javascript/"
		},
		"license": "Apache-2.0",
		"browser": { "./dist-es/runtimeConfig": "./dist-es/runtimeConfig.browser" },
		"react-native": { "./dist-es/runtimeConfig": "./dist-es/runtimeConfig.native" },
		"homepage": "https://github.com/aws/aws-sdk-js-v3/tree/main/clients/client-rds-data",
		"repository": {
			"type": "git",
			"url": "https://github.com/aws/aws-sdk-js-v3.git",
			"directory": "clients/client-rds-data"
		}
	};
}));

//#endregion
//#region ../node_modules/.pnpm/@aws-sdk+credential-provider-node@3.940.0/node_modules/@aws-sdk/credential-provider-node/dist-cjs/index.js
var require_dist_cjs$1 = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	var credentialProviderEnv = require_dist_cjs$36.require_dist_cjs();
	var propertyProvider = require_dist_cjs$34.require_dist_cjs();
	var sharedIniFileLoader = require_dist_cjs$35.require_dist_cjs();
	const ENV_IMDS_DISABLED = "AWS_EC2_METADATA_DISABLED";
	const remoteProvider = async (init) => {
		const { ENV_CMDS_FULL_URI, ENV_CMDS_RELATIVE_URI, fromContainerMetadata, fromInstanceMetadata } = await Promise.resolve().then(() => require_chunk.__toDynamicImportESM()(require("./dist-cjs-Blt4Z-vU.js")));
		if (process.env[ENV_CMDS_RELATIVE_URI] || process.env[ENV_CMDS_FULL_URI]) {
			init.logger?.debug("@aws-sdk/credential-provider-node - remoteProvider::fromHttp/fromContainerMetadata");
			const { fromHttp } = await Promise.resolve().then(() => require_chunk.__toDynamicImportESM()(require("./dist-cjs-BI-lCTto.js")));
			return propertyProvider.chain(fromHttp(init), fromContainerMetadata(init));
		}
		if (process.env[ENV_IMDS_DISABLED] && process.env[ENV_IMDS_DISABLED] !== "false") return async () => {
			throw new propertyProvider.CredentialsProviderError("EC2 Instance Metadata Service access disabled", { logger: init.logger });
		};
		init.logger?.debug("@aws-sdk/credential-provider-node - remoteProvider::fromInstanceMetadata");
		return fromInstanceMetadata(init);
	};
	function memoizeChain(providers, treatAsExpired) {
		const chain = internalCreateChain(providers);
		let activeLock;
		let passiveLock;
		let credentials;
		const provider = async (options) => {
			if (options?.forceRefresh) return await chain(options);
			if (credentials?.expiration) {
				if (credentials?.expiration?.getTime() < Date.now()) credentials = void 0;
			}
			if (activeLock) await activeLock;
			else if (!credentials || treatAsExpired?.(credentials)) if (credentials) {
				if (!passiveLock) passiveLock = chain(options).then((c) => {
					credentials = c;
					passiveLock = void 0;
				});
			} else {
				activeLock = chain(options).then((c) => {
					credentials = c;
					activeLock = void 0;
				});
				return provider(options);
			}
			return credentials;
		};
		return provider;
	}
	const internalCreateChain = (providers) => async (awsIdentityProperties) => {
		let lastProviderError;
		for (const provider of providers) try {
			return await provider(awsIdentityProperties);
		} catch (err) {
			lastProviderError = err;
			if (err?.tryNextLink) continue;
			throw err;
		}
		throw lastProviderError;
	};
	let multipleCredentialSourceWarningEmitted = false;
	const defaultProvider = (init = {}) => memoizeChain([
		async () => {
			if (init.profile ?? process.env[sharedIniFileLoader.ENV_PROFILE]) {
				if (process.env[credentialProviderEnv.ENV_KEY] && process.env[credentialProviderEnv.ENV_SECRET]) {
					if (!multipleCredentialSourceWarningEmitted) {
						(init.logger?.warn && init.logger?.constructor?.name !== "NoOpLogger" ? init.logger.warn.bind(init.logger) : console.warn)(`@aws-sdk/credential-provider-node - defaultProvider::fromEnv WARNING:
    Multiple credential sources detected: 
    Both AWS_PROFILE and the pair AWS_ACCESS_KEY_ID/AWS_SECRET_ACCESS_KEY static credentials are set.
    This SDK will proceed with the AWS_PROFILE value.
    
    However, a future version may change this behavior to prefer the ENV static credentials.
    Please ensure that your environment only sets either the AWS_PROFILE or the
    AWS_ACCESS_KEY_ID/AWS_SECRET_ACCESS_KEY pair.
`);
						multipleCredentialSourceWarningEmitted = true;
					}
				}
				throw new propertyProvider.CredentialsProviderError("AWS_PROFILE is set, skipping fromEnv provider.", {
					logger: init.logger,
					tryNextLink: true
				});
			}
			init.logger?.debug("@aws-sdk/credential-provider-node - defaultProvider::fromEnv");
			return credentialProviderEnv.fromEnv(init)();
		},
		async (awsIdentityProperties) => {
			init.logger?.debug("@aws-sdk/credential-provider-node - defaultProvider::fromSSO");
			const { ssoStartUrl, ssoAccountId, ssoRegion, ssoRoleName, ssoSession } = init;
			if (!ssoStartUrl && !ssoAccountId && !ssoRegion && !ssoRoleName && !ssoSession) throw new propertyProvider.CredentialsProviderError("Skipping SSO provider in default chain (inputs do not include SSO fields).", { logger: init.logger });
			const { fromSSO } = await Promise.resolve().then(() => require_chunk.__toDynamicImportESM()(require("./dist-cjs-CQCc4bni.js")));
			return fromSSO(init)(awsIdentityProperties);
		},
		async (awsIdentityProperties) => {
			init.logger?.debug("@aws-sdk/credential-provider-node - defaultProvider::fromIni");
			const { fromIni } = await Promise.resolve().then(() => require_chunk.__toDynamicImportESM()(require("./dist-cjs-BRrAwDG_.js")));
			return fromIni(init)(awsIdentityProperties);
		},
		async (awsIdentityProperties) => {
			init.logger?.debug("@aws-sdk/credential-provider-node - defaultProvider::fromProcess");
			const { fromProcess } = await Promise.resolve().then(() => require_chunk.__toDynamicImportESM()(require("./dist-cjs-sBSaVOtf.js")));
			return fromProcess(init)(awsIdentityProperties);
		},
		async (awsIdentityProperties) => {
			init.logger?.debug("@aws-sdk/credential-provider-node - defaultProvider::fromTokenFile");
			const { fromTokenFile } = await Promise.resolve().then(() => require_chunk.__toDynamicImportESM()(require("./dist-cjs-RfeMj_TG.js")));
			return fromTokenFile(init)(awsIdentityProperties);
		},
		async () => {
			init.logger?.debug("@aws-sdk/credential-provider-node - defaultProvider::remoteProvider");
			return (await remoteProvider(init))();
		},
		async () => {
			throw new propertyProvider.CredentialsProviderError("Could not load credentials from any providers", {
				tryNextLink: false,
				logger: init.logger
			});
		}
	], credentialsTreatedAsExpired);
	const credentialsWillNeedRefresh = (credentials) => credentials?.expiration !== void 0;
	const credentialsTreatedAsExpired = (credentials) => credentials?.expiration !== void 0 && credentials.expiration.getTime() - Date.now() < 3e5;
	exports.credentialsTreatedAsExpired = credentialsTreatedAsExpired;
	exports.credentialsWillNeedRefresh = credentialsWillNeedRefresh;
	exports.defaultProvider = defaultProvider;
}));

//#endregion
//#region ../node_modules/.pnpm/@aws-sdk+client-rds-data@3.940.0/node_modules/@aws-sdk/client-rds-data/dist-cjs/endpoint/ruleset.js
var require_ruleset = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.ruleSet = void 0;
	const s = "required", t = "fn", u = "argv", v = "ref";
	const a = true, b = "isSet", c = "booleanEquals", d = "error", e = "endpoint", f = "tree", g = "PartitionResult", h = {
		[s]: false,
		"type": "string"
	}, i = {
		[s]: true,
		"default": false,
		"type": "boolean"
	}, j = { [v]: "Endpoint" }, k = {
		[t]: c,
		[u]: [{ [v]: "UseFIPS" }, true]
	}, l = {
		[t]: c,
		[u]: [{ [v]: "UseDualStack" }, true]
	}, m = {}, n = {
		[t]: "getAttr",
		[u]: [{ [v]: g }, "supportsFIPS"]
	}, o = {
		[t]: c,
		[u]: [true, {
			[t]: "getAttr",
			[u]: [{ [v]: g }, "supportsDualStack"]
		}]
	}, p = [k], q = [l], r = [{ [v]: "Region" }];
	const _data = {
		version: "1.0",
		parameters: {
			Region: h,
			UseDualStack: i,
			UseFIPS: i,
			Endpoint: h
		},
		rules: [
			{
				conditions: [{
					[t]: b,
					[u]: [j]
				}],
				rules: [
					{
						conditions: p,
						error: "Invalid Configuration: FIPS and custom endpoint are not supported",
						type: d
					},
					{
						conditions: q,
						error: "Invalid Configuration: Dualstack and custom endpoint are not supported",
						type: d
					},
					{
						endpoint: {
							url: j,
							properties: m,
							headers: m
						},
						type: e
					}
				],
				type: f
			},
			{
				conditions: [{
					[t]: b,
					[u]: r
				}],
				rules: [{
					conditions: [{
						[t]: "aws.partition",
						[u]: r,
						assign: g
					}],
					rules: [
						{
							conditions: [k, l],
							rules: [{
								conditions: [{
									[t]: c,
									[u]: [a, n]
								}, o],
								rules: [{
									endpoint: {
										url: "https://rds-data-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
										properties: m,
										headers: m
									},
									type: e
								}],
								type: f
							}, {
								error: "FIPS and DualStack are enabled, but this partition does not support one or both",
								type: d
							}],
							type: f
						},
						{
							conditions: p,
							rules: [{
								conditions: [{
									[t]: c,
									[u]: [n, a]
								}],
								rules: [{
									endpoint: {
										url: "https://rds-data-fips.{Region}.{PartitionResult#dnsSuffix}",
										properties: m,
										headers: m
									},
									type: e
								}],
								type: f
							}, {
								error: "FIPS is enabled but this partition does not support FIPS",
								type: d
							}],
							type: f
						},
						{
							conditions: q,
							rules: [{
								conditions: [o],
								rules: [{
									endpoint: {
										url: "https://rds-data.{Region}.{PartitionResult#dualStackDnsSuffix}",
										properties: m,
										headers: m
									},
									type: e
								}],
								type: f
							}, {
								error: "DualStack is enabled but this partition does not support DualStack",
								type: d
							}],
							type: f
						},
						{
							endpoint: {
								url: "https://rds-data.{Region}.{PartitionResult#dnsSuffix}",
								properties: m,
								headers: m
							},
							type: e
						}
					],
					type: f
				}],
				type: f
			},
			{
				error: "Invalid Configuration: Missing Region",
				type: d
			}
		]
	};
	exports.ruleSet = _data;
}));

//#endregion
//#region ../node_modules/.pnpm/@aws-sdk+client-rds-data@3.940.0/node_modules/@aws-sdk/client-rds-data/dist-cjs/endpoint/endpointResolver.js
var require_endpointResolver = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.defaultEndpointResolver = void 0;
	const util_endpoints_1 = require_dist_cjs$30.require_dist_cjs$11();
	const util_endpoints_2 = require_dist_cjs$30.require_dist_cjs$12();
	const ruleset_1 = require_ruleset();
	const cache = new util_endpoints_2.EndpointCache({
		size: 50,
		params: [
			"Endpoint",
			"Region",
			"UseDualStack",
			"UseFIPS"
		]
	});
	const defaultEndpointResolver = (endpointParams, context = {}) => {
		return cache.get(endpointParams, () => (0, util_endpoints_2.resolveEndpoint)(ruleset_1.ruleSet, {
			endpointParams,
			logger: context.logger
		}));
	};
	exports.defaultEndpointResolver = defaultEndpointResolver;
	util_endpoints_2.customEndpointFunctions.aws = util_endpoints_1.awsEndpointFunctions;
}));

//#endregion
//#region ../node_modules/.pnpm/@aws-sdk+client-rds-data@3.940.0/node_modules/@aws-sdk/client-rds-data/dist-cjs/runtimeConfig.shared.js
var require_runtimeConfig_shared = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.getRuntimeConfig = void 0;
	const core_1 = (require_dist_cjs$30.init_dist_es(), require_chunk.__toCommonJS(require_dist_cjs$30.dist_es_exports));
	const protocols_1 = (require_dist_cjs$30.init_protocols(), require_chunk.__toCommonJS(require_dist_cjs$30.protocols_exports));
	const smithy_client_1 = require_dist_cjs$31.require_dist_cjs();
	const url_parser_1 = require_dist_cjs$33.require_dist_cjs$1();
	const util_base64_1 = require_dist_cjs$31.require_dist_cjs$6();
	const util_utf8_1 = require_dist_cjs$32.require_dist_cjs();
	const httpAuthSchemeProvider_1 = require_httpAuthSchemeProvider();
	const endpointResolver_1 = require_endpointResolver();
	const getRuntimeConfig = (config) => {
		return {
			apiVersion: "2018-08-01",
			base64Decoder: config?.base64Decoder ?? util_base64_1.fromBase64,
			base64Encoder: config?.base64Encoder ?? util_base64_1.toBase64,
			disableHostPrefix: config?.disableHostPrefix ?? false,
			endpointProvider: config?.endpointProvider ?? endpointResolver_1.defaultEndpointResolver,
			extensions: config?.extensions ?? [],
			httpAuthSchemeProvider: config?.httpAuthSchemeProvider ?? httpAuthSchemeProvider_1.defaultRDSDataHttpAuthSchemeProvider,
			httpAuthSchemes: config?.httpAuthSchemes ?? [{
				schemeId: "aws.auth#sigv4",
				identityProvider: (ipc) => ipc.getIdentityProvider("aws.auth#sigv4"),
				signer: new core_1.AwsSdkSigV4Signer()
			}],
			logger: config?.logger ?? new smithy_client_1.NoOpLogger(),
			protocol: config?.protocol ?? new protocols_1.AwsRestJsonProtocol({ defaultNamespace: "com.amazonaws.rdsdata" }),
			serviceId: config?.serviceId ?? "RDS Data",
			urlParser: config?.urlParser ?? url_parser_1.parseUrl,
			utf8Decoder: config?.utf8Decoder ?? util_utf8_1.fromUtf8,
			utf8Encoder: config?.utf8Encoder ?? util_utf8_1.toUtf8
		};
	};
	exports.getRuntimeConfig = getRuntimeConfig;
}));

//#endregion
//#region ../node_modules/.pnpm/@aws-sdk+client-rds-data@3.940.0/node_modules/@aws-sdk/client-rds-data/dist-cjs/runtimeConfig.js
var require_runtimeConfig = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.getRuntimeConfig = void 0;
	const package_json_1 = (require_dist_cjs$31.init_tslib_es6(), require_chunk.__toCommonJS(require_dist_cjs$31.tslib_es6_exports)).__importDefault(require_package());
	const core_1 = (require_dist_cjs$30.init_dist_es(), require_chunk.__toCommonJS(require_dist_cjs$30.dist_es_exports));
	const credential_provider_node_1 = require_dist_cjs$1();
	const util_user_agent_node_1 = require_dist_cjs$30.require_dist_cjs$4();
	const config_resolver_1 = require_dist_cjs$30.require_dist_cjs$9();
	const hash_node_1 = require_dist_cjs$30.require_dist_cjs$3();
	const middleware_retry_1 = require_dist_cjs$30.require_dist_cjs$5();
	const node_config_provider_1 = require_dist_cjs$33.require_dist_cjs();
	const node_http_handler_1 = require_dist_cjs$31.require_dist_cjs$4();
	const util_body_length_node_1 = require_dist_cjs$30.require_dist_cjs$2();
	const util_retry_1 = require_dist_cjs$30.require_dist_cjs$6();
	const runtimeConfig_shared_1 = require_runtimeConfig_shared();
	const smithy_client_1 = require_dist_cjs$31.require_dist_cjs();
	const util_defaults_mode_node_1 = require_dist_cjs$30.require_dist_cjs$1();
	const smithy_client_2 = require_dist_cjs$31.require_dist_cjs();
	const getRuntimeConfig = (config) => {
		(0, smithy_client_2.emitWarningIfUnsupportedVersion)(process.version);
		const defaultsMode = (0, util_defaults_mode_node_1.resolveDefaultsModeConfig)(config);
		const defaultConfigProvider = () => defaultsMode().then(smithy_client_1.loadConfigsForDefaultMode);
		const clientSharedValues = (0, runtimeConfig_shared_1.getRuntimeConfig)(config);
		(0, core_1.emitWarningIfUnsupportedVersion)(process.version);
		const loaderConfig = {
			profile: config?.profile,
			logger: clientSharedValues.logger
		};
		return {
			...clientSharedValues,
			...config,
			runtime: "node",
			defaultsMode,
			authSchemePreference: config?.authSchemePreference ?? (0, node_config_provider_1.loadConfig)(core_1.NODE_AUTH_SCHEME_PREFERENCE_OPTIONS, loaderConfig),
			bodyLengthChecker: config?.bodyLengthChecker ?? util_body_length_node_1.calculateBodyLength,
			credentialDefaultProvider: config?.credentialDefaultProvider ?? credential_provider_node_1.defaultProvider,
			defaultUserAgentProvider: config?.defaultUserAgentProvider ?? (0, util_user_agent_node_1.createDefaultUserAgentProvider)({
				serviceId: clientSharedValues.serviceId,
				clientVersion: package_json_1.default.version
			}),
			maxAttempts: config?.maxAttempts ?? (0, node_config_provider_1.loadConfig)(middleware_retry_1.NODE_MAX_ATTEMPT_CONFIG_OPTIONS, config),
			region: config?.region ?? (0, node_config_provider_1.loadConfig)(config_resolver_1.NODE_REGION_CONFIG_OPTIONS, {
				...config_resolver_1.NODE_REGION_CONFIG_FILE_OPTIONS,
				...loaderConfig
			}),
			requestHandler: node_http_handler_1.NodeHttpHandler.create(config?.requestHandler ?? defaultConfigProvider),
			retryMode: config?.retryMode ?? (0, node_config_provider_1.loadConfig)({
				...middleware_retry_1.NODE_RETRY_MODE_CONFIG_OPTIONS,
				default: async () => (await defaultConfigProvider()).retryMode || util_retry_1.DEFAULT_RETRY_MODE
			}, config),
			sha256: config?.sha256 ?? hash_node_1.Hash.bind(null, "sha256"),
			streamCollector: config?.streamCollector ?? node_http_handler_1.streamCollector,
			useDualstackEndpoint: config?.useDualstackEndpoint ?? (0, node_config_provider_1.loadConfig)(config_resolver_1.NODE_USE_DUALSTACK_ENDPOINT_CONFIG_OPTIONS, loaderConfig),
			useFipsEndpoint: config?.useFipsEndpoint ?? (0, node_config_provider_1.loadConfig)(config_resolver_1.NODE_USE_FIPS_ENDPOINT_CONFIG_OPTIONS, loaderConfig),
			userAgentAppId: config?.userAgentAppId ?? (0, node_config_provider_1.loadConfig)(util_user_agent_node_1.NODE_APP_ID_CONFIG_OPTIONS, loaderConfig)
		};
	};
	exports.getRuntimeConfig = getRuntimeConfig;
}));

//#endregion
//#region ../node_modules/.pnpm/@aws-sdk+client-rds-data@3.940.0/node_modules/@aws-sdk/client-rds-data/dist-cjs/index.js
var require_dist_cjs = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	var middlewareHostHeader = require_dist_cjs$30.require_dist_cjs$15();
	var middlewareLogger = require_dist_cjs$30.require_dist_cjs$14();
	var middlewareRecursionDetection = require_dist_cjs$30.require_dist_cjs$13();
	var middlewareUserAgent = require_dist_cjs$30.require_dist_cjs$10();
	var configResolver = require_dist_cjs$30.require_dist_cjs$9();
	var core = (require_dist_cjs$30.init_dist_es$1(), require_chunk.__toCommonJS(require_dist_cjs$30.dist_es_exports$1));
	var schema = (require_dist_cjs$31.init_schema(), require_chunk.__toCommonJS(require_dist_cjs$31.schema_exports));
	var middlewareContentLength = require_dist_cjs$30.require_dist_cjs$8();
	var middlewareEndpoint = require_dist_cjs$30.require_dist_cjs$7();
	var middlewareRetry = require_dist_cjs$30.require_dist_cjs$5();
	var smithyClient = require_dist_cjs$31.require_dist_cjs();
	var httpAuthSchemeProvider = require_httpAuthSchemeProvider();
	var runtimeConfig = require_runtimeConfig();
	var regionConfigResolver = require_dist_cjs$30.require_dist_cjs();
	var protocolHttp = require_dist_cjs$29.require_dist_cjs();
	const resolveClientEndpointParameters = (options) => {
		return Object.assign(options, {
			useDualstackEndpoint: options.useDualstackEndpoint ?? false,
			useFipsEndpoint: options.useFipsEndpoint ?? false,
			defaultSigningName: "rds-data"
		});
	};
	const commonParams = {
		UseFIPS: {
			type: "builtInParams",
			name: "useFipsEndpoint"
		},
		Endpoint: {
			type: "builtInParams",
			name: "endpoint"
		},
		Region: {
			type: "builtInParams",
			name: "region"
		},
		UseDualStack: {
			type: "builtInParams",
			name: "useDualstackEndpoint"
		}
	};
	const getHttpAuthExtensionConfiguration = (runtimeConfig) => {
		const _httpAuthSchemes = runtimeConfig.httpAuthSchemes;
		let _httpAuthSchemeProvider = runtimeConfig.httpAuthSchemeProvider;
		let _credentials = runtimeConfig.credentials;
		return {
			setHttpAuthScheme(httpAuthScheme) {
				const index = _httpAuthSchemes.findIndex((scheme) => scheme.schemeId === httpAuthScheme.schemeId);
				if (index === -1) _httpAuthSchemes.push(httpAuthScheme);
				else _httpAuthSchemes.splice(index, 1, httpAuthScheme);
			},
			httpAuthSchemes() {
				return _httpAuthSchemes;
			},
			setHttpAuthSchemeProvider(httpAuthSchemeProvider) {
				_httpAuthSchemeProvider = httpAuthSchemeProvider;
			},
			httpAuthSchemeProvider() {
				return _httpAuthSchemeProvider;
			},
			setCredentials(credentials) {
				_credentials = credentials;
			},
			credentials() {
				return _credentials;
			}
		};
	};
	const resolveHttpAuthRuntimeConfig = (config) => {
		return {
			httpAuthSchemes: config.httpAuthSchemes(),
			httpAuthSchemeProvider: config.httpAuthSchemeProvider(),
			credentials: config.credentials()
		};
	};
	const resolveRuntimeExtensions = (runtimeConfig, extensions) => {
		const extensionConfiguration = Object.assign(regionConfigResolver.getAwsRegionExtensionConfiguration(runtimeConfig), smithyClient.getDefaultExtensionConfiguration(runtimeConfig), protocolHttp.getHttpHandlerExtensionConfiguration(runtimeConfig), getHttpAuthExtensionConfiguration(runtimeConfig));
		extensions.forEach((extension) => extension.configure(extensionConfiguration));
		return Object.assign(runtimeConfig, regionConfigResolver.resolveAwsRegionExtensionConfiguration(extensionConfiguration), smithyClient.resolveDefaultRuntimeConfig(extensionConfiguration), protocolHttp.resolveHttpHandlerRuntimeConfig(extensionConfiguration), resolveHttpAuthRuntimeConfig(extensionConfiguration));
	};
	var RDSDataClient = class extends smithyClient.Client {
		config;
		constructor(...[configuration]) {
			const _config_0 = runtimeConfig.getRuntimeConfig(configuration || {});
			super(_config_0);
			this.initConfig = _config_0;
			const _config_1 = resolveClientEndpointParameters(_config_0);
			const _config_2 = middlewareUserAgent.resolveUserAgentConfig(_config_1);
			const _config_3 = middlewareRetry.resolveRetryConfig(_config_2);
			const _config_4 = configResolver.resolveRegionConfig(_config_3);
			const _config_5 = middlewareHostHeader.resolveHostHeaderConfig(_config_4);
			const _config_6 = middlewareEndpoint.resolveEndpointConfig(_config_5);
			this.config = resolveRuntimeExtensions(httpAuthSchemeProvider.resolveHttpAuthSchemeConfig(_config_6), configuration?.extensions || []);
			this.middlewareStack.use(schema.getSchemaSerdePlugin(this.config));
			this.middlewareStack.use(middlewareUserAgent.getUserAgentPlugin(this.config));
			this.middlewareStack.use(middlewareRetry.getRetryPlugin(this.config));
			this.middlewareStack.use(middlewareContentLength.getContentLengthPlugin(this.config));
			this.middlewareStack.use(middlewareHostHeader.getHostHeaderPlugin(this.config));
			this.middlewareStack.use(middlewareLogger.getLoggerPlugin(this.config));
			this.middlewareStack.use(middlewareRecursionDetection.getRecursionDetectionPlugin(this.config));
			this.middlewareStack.use(core.getHttpAuthSchemeEndpointRuleSetPlugin(this.config, {
				httpAuthSchemeParametersProvider: httpAuthSchemeProvider.defaultRDSDataHttpAuthSchemeParametersProvider,
				identityProviderConfigProvider: async (config) => new core.DefaultIdentityProviderConfig({ "aws.auth#sigv4": config.credentials })
			}));
			this.middlewareStack.use(core.getHttpSigningPlugin(this.config));
		}
		destroy() {
			super.destroy();
		}
	};
	let RDSDataServiceException$1 = class RDSDataServiceException extends smithyClient.ServiceException {
		constructor(options) {
			super(options);
			Object.setPrototypeOf(this, RDSDataServiceException.prototype);
		}
	};
	let AccessDeniedException$1 = class AccessDeniedException extends RDSDataServiceException$1 {
		name = "AccessDeniedException";
		$fault = "client";
		constructor(opts) {
			super({
				name: "AccessDeniedException",
				$fault: "client",
				...opts
			});
			Object.setPrototypeOf(this, AccessDeniedException.prototype);
		}
	};
	let BadRequestException$1 = class BadRequestException extends RDSDataServiceException$1 {
		name = "BadRequestException";
		$fault = "client";
		constructor(opts) {
			super({
				name: "BadRequestException",
				$fault: "client",
				...opts
			});
			Object.setPrototypeOf(this, BadRequestException.prototype);
		}
	};
	let DatabaseErrorException$1 = class DatabaseErrorException extends RDSDataServiceException$1 {
		name = "DatabaseErrorException";
		$fault = "client";
		constructor(opts) {
			super({
				name: "DatabaseErrorException",
				$fault: "client",
				...opts
			});
			Object.setPrototypeOf(this, DatabaseErrorException.prototype);
		}
	};
	let DatabaseNotFoundException$1 = class DatabaseNotFoundException extends RDSDataServiceException$1 {
		name = "DatabaseNotFoundException";
		$fault = "client";
		constructor(opts) {
			super({
				name: "DatabaseNotFoundException",
				$fault: "client",
				...opts
			});
			Object.setPrototypeOf(this, DatabaseNotFoundException.prototype);
		}
	};
	let DatabaseResumingException$1 = class DatabaseResumingException extends RDSDataServiceException$1 {
		name = "DatabaseResumingException";
		$fault = "client";
		constructor(opts) {
			super({
				name: "DatabaseResumingException",
				$fault: "client",
				...opts
			});
			Object.setPrototypeOf(this, DatabaseResumingException.prototype);
		}
	};
	let DatabaseUnavailableException$1 = class DatabaseUnavailableException extends RDSDataServiceException$1 {
		name = "DatabaseUnavailableException";
		$fault = "server";
		constructor(opts) {
			super({
				name: "DatabaseUnavailableException",
				$fault: "server",
				...opts
			});
			Object.setPrototypeOf(this, DatabaseUnavailableException.prototype);
		}
	};
	let ForbiddenException$1 = class ForbiddenException extends RDSDataServiceException$1 {
		name = "ForbiddenException";
		$fault = "client";
		constructor(opts) {
			super({
				name: "ForbiddenException",
				$fault: "client",
				...opts
			});
			Object.setPrototypeOf(this, ForbiddenException.prototype);
		}
	};
	let HttpEndpointNotEnabledException$1 = class HttpEndpointNotEnabledException extends RDSDataServiceException$1 {
		name = "HttpEndpointNotEnabledException";
		$fault = "client";
		constructor(opts) {
			super({
				name: "HttpEndpointNotEnabledException",
				$fault: "client",
				...opts
			});
			Object.setPrototypeOf(this, HttpEndpointNotEnabledException.prototype);
		}
	};
	let InternalServerErrorException$1 = class InternalServerErrorException extends RDSDataServiceException$1 {
		name = "InternalServerErrorException";
		$fault = "server";
		constructor(opts) {
			super({
				name: "InternalServerErrorException",
				$fault: "server",
				...opts
			});
			Object.setPrototypeOf(this, InternalServerErrorException.prototype);
		}
	};
	let InvalidResourceStateException$1 = class InvalidResourceStateException extends RDSDataServiceException$1 {
		name = "InvalidResourceStateException";
		$fault = "client";
		constructor(opts) {
			super({
				name: "InvalidResourceStateException",
				$fault: "client",
				...opts
			});
			Object.setPrototypeOf(this, InvalidResourceStateException.prototype);
		}
	};
	let InvalidSecretException$1 = class InvalidSecretException extends RDSDataServiceException$1 {
		name = "InvalidSecretException";
		$fault = "client";
		constructor(opts) {
			super({
				name: "InvalidSecretException",
				$fault: "client",
				...opts
			});
			Object.setPrototypeOf(this, InvalidSecretException.prototype);
		}
	};
	let SecretsErrorException$1 = class SecretsErrorException extends RDSDataServiceException$1 {
		name = "SecretsErrorException";
		$fault = "client";
		constructor(opts) {
			super({
				name: "SecretsErrorException",
				$fault: "client",
				...opts
			});
			Object.setPrototypeOf(this, SecretsErrorException.prototype);
		}
	};
	let ServiceUnavailableError$1 = class ServiceUnavailableError extends RDSDataServiceException$1 {
		name = "ServiceUnavailableError";
		$fault = "server";
		constructor(opts) {
			super({
				name: "ServiceUnavailableError",
				$fault: "server",
				...opts
			});
			Object.setPrototypeOf(this, ServiceUnavailableError.prototype);
		}
	};
	let StatementTimeoutException$1 = class StatementTimeoutException extends RDSDataServiceException$1 {
		name = "StatementTimeoutException";
		$fault = "client";
		dbConnectionId;
		constructor(opts) {
			super({
				name: "StatementTimeoutException",
				$fault: "client",
				...opts
			});
			Object.setPrototypeOf(this, StatementTimeoutException.prototype);
			this.dbConnectionId = opts.dbConnectionId;
		}
	};
	let TransactionNotFoundException$1 = class TransactionNotFoundException extends RDSDataServiceException$1 {
		name = "TransactionNotFoundException";
		$fault = "client";
		constructor(opts) {
			super({
				name: "TransactionNotFoundException",
				$fault: "client",
				...opts
			});
			Object.setPrototypeOf(this, TransactionNotFoundException.prototype);
		}
	};
	let NotFoundException$1 = class NotFoundException extends RDSDataServiceException$1 {
		name = "NotFoundException";
		$fault = "client";
		constructor(opts) {
			super({
				name: "NotFoundException",
				$fault: "client",
				...opts
			});
			Object.setPrototypeOf(this, NotFoundException.prototype);
		}
	};
	let UnsupportedResultException$1 = class UnsupportedResultException extends RDSDataServiceException$1 {
		name = "UnsupportedResultException";
		$fault = "client";
		constructor(opts) {
			super({
				name: "UnsupportedResultException",
				$fault: "client",
				...opts
			});
			Object.setPrototypeOf(this, UnsupportedResultException.prototype);
		}
	};
	const _ADE = "AccessDeniedException";
	const _AOA = "ArrayOfArray";
	const _AV = "ArrayValue";
	const _AVL = "ArrayValueList";
	const _BES = "BatchExecuteStatement";
	const _BESR = "BatchExecuteStatementRequest";
	const _BESRa = "BatchExecuteStatementResponse";
	const _BRE = "BadRequestException";
	const _BT = "BeginTransaction";
	const _BTR = "BeginTransactionRequest";
	const _BTRe = "BeginTransactionResponse";
	const _CM = "ColumnMetadata";
	const _CT = "CommitTransaction";
	const _CTR = "CommitTransactionRequest";
	const _CTRo = "CommitTransactionResponse";
	const _DEE = "DatabaseErrorException";
	const _DNFE = "DatabaseNotFoundException";
	const _DRE = "DatabaseResumingException";
	const _DUE = "DatabaseUnavailableException";
	const _ES = "ExecuteSql";
	const _ESR = "ExecuteSqlRequest";
	const _ESRx = "ExecuteSqlResponse";
	const _ESRxe = "ExecuteStatementRequest";
	const _ESRxec = "ExecuteStatementResponse";
	const _ESx = "ExecuteStatement";
	const _F = "Field";
	const _FE = "ForbiddenException";
	const _FL = "FieldList";
	const _HENEE = "HttpEndpointNotEnabledException";
	const _IRSE = "InvalidResourceStateException";
	const _ISE = "InvalidSecretException";
	const _ISEE = "InternalServerErrorException";
	const _M = "Metadata";
	const _NFE = "NotFoundException";
	const _R = "Record";
	const _RF = "ResultFrame";
	const _RSM = "ResultSetMetadata";
	const _RSO = "ResultSetOptions";
	const _RT = "RollbackTransaction";
	const _RTR = "RollbackTransactionRequest";
	const _RTRo = "RollbackTransactionResponse";
	const _Re = "Records";
	const _Ro = "Row";
	const _SEE = "SecretsErrorException";
	const _SP = "SqlParameter";
	const _SPL = "SqlParametersList";
	const _SPS = "SqlParameterSets";
	const _SR = "SqlRecords";
	const _SSR = "SqlStatementResult";
	const _SSRq = "SqlStatementResults";
	const _STE = "StatementTimeoutException";
	const _SUE = "ServiceUnavailableError";
	const _SV = "StructValue";
	const _TNFE = "TransactionNotFoundException";
	const _UR = "UpdateResult";
	const _URE = "UnsupportedResultException";
	const _URp = "UpdateResults";
	const _V = "Value";
	const _a = "attributes";
	const _aBCT = "arrayBaseColumnType";
	const _aSSA = "awsSecretStoreArn";
	const _aV = "arrayValues";
	const _aVr = "arrayValue";
	const _bIV = "bigIntValue";
	const _bV = "booleanValues";
	const _bVi = "bitValue";
	const _bVl = "blobValue";
	const _bVo = "booleanValue";
	const _c = "client";
	const _cAT = "continueAfterTimeout";
	const _cC = "columnCount";
	const _cM = "columnMetadata";
	const _d = "database";
	const _dCI = "dbConnectionId";
	const _dCOIA = "dbClusterOrInstanceArn";
	const _dRT = "decimalReturnType";
	const _dV = "doubleValues";
	const _dVo = "doubleValue";
	const _e = "error";
	const _fR = "formattedRecords";
	const _fRA = "formatRecordsAs";
	const _gF = "generatedFields";
	const _h = "http";
	const _hE = "httpError";
	const _iAI = "isAutoIncrement";
	const _iC = "isCurrency";
	const _iCS = "isCaseSensitive";
	const _iN = "isNull";
	const _iRM = "includeResultMetadata";
	const _iS = "isSigned";
	const _iV = "intValue";
	const _l = "label";
	const _lRT = "longReturnType";
	const _lV = "longValues";
	const _lVo = "longValue";
	const _m = "message";
	const _n = "name";
	const _nORU = "numberOfRecordsUpdated";
	const _nu = "nullable";
	const _p = "precision";
	const _pS = "parameterSets";
	const _pa = "parameters";
	const _r = "records";
	const _rA = "resourceArn";
	const _rF = "resultFrame";
	const _rSM = "resultSetMetadata";
	const _rSO = "resultSetOptions";
	const _rV = "realValue";
	const _s = "sql";
	const _sA = "secretArn";
	const _sN = "schemaName";
	const _sS = "sqlStatements";
	const _sSR = "sqlStatementResults";
	const _sV = "stringValues";
	const _sVt = "stringValue";
	const _sVtr = "structValue";
	const _sc = "schema";
	const _sca = "scale";
	const _se = "server";
	const _sm = "smithy.ts.sdk.synthetic.com.amazonaws.rdsdata";
	const _t = "type";
	const _tH = "typeHint";
	const _tI = "transactionId";
	const _tN = "typeName";
	const _tNa = "tableName";
	const _tS = "transactionStatus";
	const _uR = "updateResults";
	const _v = "values";
	const _va = "value";
	const n0 = "com.amazonaws.rdsdata";
	var AccessDeniedException = [
		-3,
		n0,
		_ADE,
		{
			[_e]: _c,
			[_hE]: 403
		},
		[_m],
		[0]
	];
	schema.TypeRegistry.for(n0).registerError(AccessDeniedException, AccessDeniedException$1);
	var BadRequestException = [
		-3,
		n0,
		_BRE,
		{
			[_e]: _c,
			[_hE]: 400
		},
		[_m],
		[0]
	];
	schema.TypeRegistry.for(n0).registerError(BadRequestException, BadRequestException$1);
	var BatchExecuteStatementRequest = [
		3,
		n0,
		_BESR,
		0,
		[
			_rA,
			_sA,
			_s,
			_d,
			_sc,
			_pS,
			_tI
		],
		[
			0,
			0,
			0,
			0,
			0,
			() => SqlParameterSets,
			0
		]
	];
	var BatchExecuteStatementResponse = [
		3,
		n0,
		_BESRa,
		0,
		[_uR],
		[() => UpdateResults]
	];
	var BeginTransactionRequest = [
		3,
		n0,
		_BTR,
		0,
		[
			_rA,
			_sA,
			_d,
			_sc
		],
		[
			0,
			0,
			0,
			0
		]
	];
	var BeginTransactionResponse = [
		3,
		n0,
		_BTRe,
		0,
		[_tI],
		[0]
	];
	var ColumnMetadata = [
		3,
		n0,
		_CM,
		0,
		[
			_n,
			_t,
			_tN,
			_l,
			_sN,
			_tNa,
			_iAI,
			_iS,
			_iC,
			_iCS,
			_nu,
			_p,
			_sca,
			_aBCT
		],
		[
			0,
			1,
			0,
			0,
			0,
			0,
			2,
			2,
			2,
			2,
			1,
			1,
			1,
			1
		]
	];
	var CommitTransactionRequest = [
		3,
		n0,
		_CTR,
		0,
		[
			_rA,
			_sA,
			_tI
		],
		[
			0,
			0,
			0
		]
	];
	var CommitTransactionResponse = [
		3,
		n0,
		_CTRo,
		0,
		[_tS],
		[0]
	];
	var DatabaseErrorException = [
		-3,
		n0,
		_DEE,
		{
			[_e]: _c,
			[_hE]: 400
		},
		[_m],
		[0]
	];
	schema.TypeRegistry.for(n0).registerError(DatabaseErrorException, DatabaseErrorException$1);
	var DatabaseNotFoundException = [
		-3,
		n0,
		_DNFE,
		{
			[_e]: _c,
			[_hE]: 404
		},
		[_m],
		[0]
	];
	schema.TypeRegistry.for(n0).registerError(DatabaseNotFoundException, DatabaseNotFoundException$1);
	var DatabaseResumingException = [
		-3,
		n0,
		_DRE,
		{
			[_e]: _c,
			[_hE]: 400
		},
		[_m],
		[0]
	];
	schema.TypeRegistry.for(n0).registerError(DatabaseResumingException, DatabaseResumingException$1);
	var DatabaseUnavailableException = [
		-3,
		n0,
		_DUE,
		{
			[_e]: _se,
			[_hE]: 504
		},
		[],
		[]
	];
	schema.TypeRegistry.for(n0).registerError(DatabaseUnavailableException, DatabaseUnavailableException$1);
	var ExecuteSqlRequest = [
		3,
		n0,
		_ESR,
		0,
		[
			_dCOIA,
			_aSSA,
			_sS,
			_d,
			_sc
		],
		[
			0,
			0,
			0,
			0,
			0
		]
	];
	var ExecuteSqlResponse = [
		3,
		n0,
		_ESRx,
		0,
		[_sSR],
		[() => SqlStatementResults]
	];
	var ExecuteStatementRequest = [
		3,
		n0,
		_ESRxe,
		0,
		[
			_rA,
			_sA,
			_s,
			_d,
			_sc,
			_pa,
			_tI,
			_iRM,
			_cAT,
			_rSO,
			_fRA
		],
		[
			0,
			0,
			0,
			0,
			0,
			() => SqlParametersList,
			0,
			2,
			2,
			() => ResultSetOptions,
			0
		]
	];
	var ExecuteStatementResponse = [
		3,
		n0,
		_ESRxec,
		0,
		[
			_r,
			_cM,
			_nORU,
			_gF,
			_fR
		],
		[
			() => SqlRecords,
			() => Metadata,
			1,
			() => FieldList,
			0
		]
	];
	var ForbiddenException = [
		-3,
		n0,
		_FE,
		{
			[_e]: _c,
			[_hE]: 403
		},
		[_m],
		[0]
	];
	schema.TypeRegistry.for(n0).registerError(ForbiddenException, ForbiddenException$1);
	var HttpEndpointNotEnabledException = [
		-3,
		n0,
		_HENEE,
		{
			[_e]: _c,
			[_hE]: 400
		},
		[_m],
		[0]
	];
	schema.TypeRegistry.for(n0).registerError(HttpEndpointNotEnabledException, HttpEndpointNotEnabledException$1);
	var InternalServerErrorException = [
		-3,
		n0,
		_ISEE,
		{
			[_e]: _se,
			[_hE]: 500
		},
		[],
		[]
	];
	schema.TypeRegistry.for(n0).registerError(InternalServerErrorException, InternalServerErrorException$1);
	var InvalidResourceStateException = [
		-3,
		n0,
		_IRSE,
		{
			[_e]: _c,
			[_hE]: 400
		},
		[_m],
		[0]
	];
	schema.TypeRegistry.for(n0).registerError(InvalidResourceStateException, InvalidResourceStateException$1);
	var InvalidSecretException = [
		-3,
		n0,
		_ISE,
		{
			[_e]: _c,
			[_hE]: 400
		},
		[_m],
		[0]
	];
	schema.TypeRegistry.for(n0).registerError(InvalidSecretException, InvalidSecretException$1);
	var NotFoundException = [
		-3,
		n0,
		_NFE,
		{
			[_e]: _c,
			[_hE]: 404
		},
		[_m],
		[0]
	];
	schema.TypeRegistry.for(n0).registerError(NotFoundException, NotFoundException$1);
	var _Record = [
		3,
		n0,
		_R,
		0,
		[_v],
		[() => Row]
	];
	var ResultFrame = [
		3,
		n0,
		_RF,
		0,
		[_rSM, _r],
		[() => ResultSetMetadata, () => Records]
	];
	var ResultSetMetadata = [
		3,
		n0,
		_RSM,
		0,
		[_cC, _cM],
		[1, () => Metadata]
	];
	var ResultSetOptions = [
		3,
		n0,
		_RSO,
		0,
		[_dRT, _lRT],
		[0, 0]
	];
	var RollbackTransactionRequest = [
		3,
		n0,
		_RTR,
		0,
		[
			_rA,
			_sA,
			_tI
		],
		[
			0,
			0,
			0
		]
	];
	var RollbackTransactionResponse = [
		3,
		n0,
		_RTRo,
		0,
		[_tS],
		[0]
	];
	var SecretsErrorException = [
		-3,
		n0,
		_SEE,
		{
			[_e]: _c,
			[_hE]: 400
		},
		[_m],
		[0]
	];
	schema.TypeRegistry.for(n0).registerError(SecretsErrorException, SecretsErrorException$1);
	var ServiceUnavailableError = [
		-3,
		n0,
		_SUE,
		{
			[_e]: _se,
			[_hE]: 503
		},
		[],
		[]
	];
	schema.TypeRegistry.for(n0).registerError(ServiceUnavailableError, ServiceUnavailableError$1);
	var SqlParameter = [
		3,
		n0,
		_SP,
		0,
		[
			_n,
			_va,
			_tH
		],
		[
			0,
			() => Field,
			0
		]
	];
	var SqlStatementResult = [
		3,
		n0,
		_SSR,
		0,
		[_rF, _nORU],
		[() => ResultFrame, 1]
	];
	var StatementTimeoutException = [
		-3,
		n0,
		_STE,
		{
			[_e]: _c,
			[_hE]: 400
		},
		[_m, _dCI],
		[0, 1]
	];
	schema.TypeRegistry.for(n0).registerError(StatementTimeoutException, StatementTimeoutException$1);
	var StructValue = [
		3,
		n0,
		_SV,
		0,
		[_a],
		[() => ArrayValueList]
	];
	var TransactionNotFoundException = [
		-3,
		n0,
		_TNFE,
		{
			[_e]: _c,
			[_hE]: 404
		},
		[_m],
		[0]
	];
	schema.TypeRegistry.for(n0).registerError(TransactionNotFoundException, TransactionNotFoundException$1);
	var UnsupportedResultException = [
		-3,
		n0,
		_URE,
		{
			[_e]: _c,
			[_hE]: 400
		},
		[_m],
		[0]
	];
	schema.TypeRegistry.for(n0).registerError(UnsupportedResultException, UnsupportedResultException$1);
	var UpdateResult = [
		3,
		n0,
		_UR,
		0,
		[_gF],
		[() => FieldList]
	];
	var RDSDataServiceException = [
		-3,
		_sm,
		"RDSDataServiceException",
		0,
		[],
		[]
	];
	schema.TypeRegistry.for(_sm).registerError(RDSDataServiceException, RDSDataServiceException$1);
	var ArrayOfArray = [
		1,
		n0,
		_AOA,
		0,
		() => ArrayValue
	];
	var ArrayValueList = [
		1,
		n0,
		_AVL,
		0,
		() => Value
	];
	var FieldList = [
		1,
		n0,
		_FL,
		0,
		() => Field
	];
	var Metadata = [
		1,
		n0,
		_M,
		0,
		() => ColumnMetadata
	];
	var Records = [
		1,
		n0,
		_Re,
		0,
		() => _Record
	];
	var Row = [
		1,
		n0,
		_Ro,
		0,
		() => Value
	];
	var SqlParameterSets = [
		1,
		n0,
		_SPS,
		0,
		() => SqlParametersList
	];
	var SqlParametersList = [
		1,
		n0,
		_SPL,
		0,
		() => SqlParameter
	];
	var SqlRecords = [
		1,
		n0,
		_SR,
		0,
		() => FieldList
	];
	var SqlStatementResults = [
		1,
		n0,
		_SSRq,
		0,
		() => SqlStatementResult
	];
	var UpdateResults = [
		1,
		n0,
		_URp,
		0,
		() => UpdateResult
	];
	var ArrayValue = [
		3,
		n0,
		_AV,
		0,
		[
			_bV,
			_lV,
			_dV,
			_sV,
			_aV
		],
		[
			66,
			65,
			65,
			64,
			() => ArrayOfArray
		]
	];
	var Field = [
		3,
		n0,
		_F,
		0,
		[
			_iN,
			_bVo,
			_lVo,
			_dVo,
			_sVt,
			_bVl,
			_aVr
		],
		[
			2,
			2,
			1,
			1,
			0,
			21,
			() => ArrayValue
		]
	];
	var Value = [
		3,
		n0,
		_V,
		0,
		[
			_iN,
			_bVi,
			_bIV,
			_iV,
			_dVo,
			_rV,
			_sVt,
			_bVl,
			_aV,
			_sVtr
		],
		[
			2,
			2,
			1,
			1,
			1,
			1,
			0,
			21,
			() => ArrayValueList,
			() => StructValue
		]
	];
	var BatchExecuteStatement = [
		9,
		n0,
		_BES,
		{ [_h]: [
			"POST",
			"/BatchExecute",
			200
		] },
		() => BatchExecuteStatementRequest,
		() => BatchExecuteStatementResponse
	];
	var BeginTransaction = [
		9,
		n0,
		_BT,
		{ [_h]: [
			"POST",
			"/BeginTransaction",
			200
		] },
		() => BeginTransactionRequest,
		() => BeginTransactionResponse
	];
	var CommitTransaction = [
		9,
		n0,
		_CT,
		{ [_h]: [
			"POST",
			"/CommitTransaction",
			200
		] },
		() => CommitTransactionRequest,
		() => CommitTransactionResponse
	];
	var ExecuteSql = [
		9,
		n0,
		_ES,
		{ [_h]: [
			"POST",
			"/ExecuteSql",
			200
		] },
		() => ExecuteSqlRequest,
		() => ExecuteSqlResponse
	];
	var ExecuteStatement = [
		9,
		n0,
		_ESx,
		{ [_h]: [
			"POST",
			"/Execute",
			200
		] },
		() => ExecuteStatementRequest,
		() => ExecuteStatementResponse
	];
	var RollbackTransaction = [
		9,
		n0,
		_RT,
		{ [_h]: [
			"POST",
			"/RollbackTransaction",
			200
		] },
		() => RollbackTransactionRequest,
		() => RollbackTransactionResponse
	];
	var BatchExecuteStatementCommand = class extends smithyClient.Command.classBuilder().ep(commonParams).m(function(Command, cs, config, o) {
		return [middlewareEndpoint.getEndpointPlugin(config, Command.getEndpointParameterInstructions())];
	}).s("RdsDataService", "BatchExecuteStatement", {}).n("RDSDataClient", "BatchExecuteStatementCommand").sc(BatchExecuteStatement).build() {};
	var BeginTransactionCommand = class extends smithyClient.Command.classBuilder().ep(commonParams).m(function(Command, cs, config, o) {
		return [middlewareEndpoint.getEndpointPlugin(config, Command.getEndpointParameterInstructions())];
	}).s("RdsDataService", "BeginTransaction", {}).n("RDSDataClient", "BeginTransactionCommand").sc(BeginTransaction).build() {};
	var CommitTransactionCommand = class extends smithyClient.Command.classBuilder().ep(commonParams).m(function(Command, cs, config, o) {
		return [middlewareEndpoint.getEndpointPlugin(config, Command.getEndpointParameterInstructions())];
	}).s("RdsDataService", "CommitTransaction", {}).n("RDSDataClient", "CommitTransactionCommand").sc(CommitTransaction).build() {};
	var ExecuteSqlCommand = class extends smithyClient.Command.classBuilder().ep(commonParams).m(function(Command, cs, config, o) {
		return [middlewareEndpoint.getEndpointPlugin(config, Command.getEndpointParameterInstructions())];
	}).s("RdsDataService", "ExecuteSql", {}).n("RDSDataClient", "ExecuteSqlCommand").sc(ExecuteSql).build() {};
	var ExecuteStatementCommand = class extends smithyClient.Command.classBuilder().ep(commonParams).m(function(Command, cs, config, o) {
		return [middlewareEndpoint.getEndpointPlugin(config, Command.getEndpointParameterInstructions())];
	}).s("RdsDataService", "ExecuteStatement", {}).n("RDSDataClient", "ExecuteStatementCommand").sc(ExecuteStatement).build() {};
	var RollbackTransactionCommand = class extends smithyClient.Command.classBuilder().ep(commonParams).m(function(Command, cs, config, o) {
		return [middlewareEndpoint.getEndpointPlugin(config, Command.getEndpointParameterInstructions())];
	}).s("RdsDataService", "RollbackTransaction", {}).n("RDSDataClient", "RollbackTransactionCommand").sc(RollbackTransaction).build() {};
	const commands = {
		BatchExecuteStatementCommand,
		BeginTransactionCommand,
		CommitTransactionCommand,
		ExecuteSqlCommand,
		ExecuteStatementCommand,
		RollbackTransactionCommand
	};
	var RDSData = class extends RDSDataClient {};
	smithyClient.createAggregatedClient(commands, RDSData);
	const TypeHint = {
		DATE: "DATE",
		DECIMAL: "DECIMAL",
		JSON: "JSON",
		TIME: "TIME",
		TIMESTAMP: "TIMESTAMP",
		UUID: "UUID"
	};
	const DecimalReturnType = {
		DOUBLE_OR_LONG: "DOUBLE_OR_LONG",
		STRING: "STRING"
	};
	const RecordsFormatType = {
		JSON: "JSON",
		NONE: "NONE"
	};
	const LongReturnType = {
		LONG: "LONG",
		STRING: "STRING"
	};
	Object.defineProperty(exports, "$Command", {
		enumerable: true,
		get: function() {
			return smithyClient.Command;
		}
	});
	Object.defineProperty(exports, "__Client", {
		enumerable: true,
		get: function() {
			return smithyClient.Client;
		}
	});
	exports.AccessDeniedException = AccessDeniedException$1;
	exports.BadRequestException = BadRequestException$1;
	exports.BatchExecuteStatementCommand = BatchExecuteStatementCommand;
	exports.BeginTransactionCommand = BeginTransactionCommand;
	exports.CommitTransactionCommand = CommitTransactionCommand;
	exports.DatabaseErrorException = DatabaseErrorException$1;
	exports.DatabaseNotFoundException = DatabaseNotFoundException$1;
	exports.DatabaseResumingException = DatabaseResumingException$1;
	exports.DatabaseUnavailableException = DatabaseUnavailableException$1;
	exports.DecimalReturnType = DecimalReturnType;
	exports.ExecuteSqlCommand = ExecuteSqlCommand;
	exports.ExecuteStatementCommand = ExecuteStatementCommand;
	exports.ForbiddenException = ForbiddenException$1;
	exports.HttpEndpointNotEnabledException = HttpEndpointNotEnabledException$1;
	exports.InternalServerErrorException = InternalServerErrorException$1;
	exports.InvalidResourceStateException = InvalidResourceStateException$1;
	exports.InvalidSecretException = InvalidSecretException$1;
	exports.LongReturnType = LongReturnType;
	exports.NotFoundException = NotFoundException$1;
	exports.RDSData = RDSData;
	exports.RDSDataClient = RDSDataClient;
	exports.RDSDataServiceException = RDSDataServiceException$1;
	exports.RecordsFormatType = RecordsFormatType;
	exports.RollbackTransactionCommand = RollbackTransactionCommand;
	exports.SecretsErrorException = SecretsErrorException$1;
	exports.ServiceUnavailableError = ServiceUnavailableError$1;
	exports.StatementTimeoutException = StatementTimeoutException$1;
	exports.TransactionNotFoundException = TransactionNotFoundException$1;
	exports.TypeHint = TypeHint;
	exports.UnsupportedResultException = UnsupportedResultException$1;
}));

//#endregion
Object.defineProperty(exports, 'default', {
  enumerable: true,
  get: function () {
    return require_dist_cjs();
  }
});