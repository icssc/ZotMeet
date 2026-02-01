const require_chunk = require('./chunk-CdAKIUsw.js');
const require_dist_cjs$24 = require('./dist-cjs-BawS8oYv.js');
const require_dist_cjs$25 = require('./dist-cjs-B9UsuYCY.js');
const require_dist_cjs$26 = require('./dist-cjs-BMOAUmMP.js');
const require_dist_cjs$27 = require('./dist-cjs-DVzRDdXz.js');
const require_dist_cjs$28 = require('./dist-cjs-CWItNfj0.js');
const require_client = require('./client-BsEbA1K3.js');
const require_package = require('./package-C0chbb9U.js');

//#region ../node_modules/.pnpm/@aws-sdk+nested-clients@3.940.0/node_modules/@aws-sdk/nested-clients/dist-es/submodules/signin/auth/httpAuthSchemeProvider.js
function createAwsAuthSigv4HttpAuthOption(authParameters) {
	return {
		schemeId: "aws.auth#sigv4",
		signingProperties: {
			name: "signin",
			region: authParameters.region
		},
		propertiesExtractor: (config, context) => ({ signingProperties: {
			config,
			context
		} })
	};
}
function createSmithyApiNoAuthHttpAuthOption(authParameters) {
	return { schemeId: "smithy.api#noAuth" };
}
var import_dist_cjs$33, defaultSigninHttpAuthSchemeParametersProvider, defaultSigninHttpAuthSchemeProvider, resolveHttpAuthSchemeConfig;
var init_httpAuthSchemeProvider = require_chunk.__esmMin((() => {
	require_dist_cjs$25.init_dist_es();
	import_dist_cjs$33 = require_dist_cjs$26.require_dist_cjs$7();
	defaultSigninHttpAuthSchemeParametersProvider = async (config, context, input) => {
		return {
			operation: (0, import_dist_cjs$33.getSmithyContext)(context).operation,
			region: await (0, import_dist_cjs$33.normalizeProvider)(config.region)() || (() => {
				throw new Error("expected `region` to be configured for `aws.auth#sigv4`");
			})()
		};
	};
	defaultSigninHttpAuthSchemeProvider = (authParameters) => {
		const options = [];
		switch (authParameters.operation) {
			case "CreateOAuth2Token":
				options.push(createSmithyApiNoAuthHttpAuthOption(authParameters));
				break;
			default: options.push(createAwsAuthSigv4HttpAuthOption(authParameters));
		}
		return options;
	};
	resolveHttpAuthSchemeConfig = (config) => {
		const config_0 = require_dist_cjs$25.resolveAwsSdkSigV4Config(config);
		return Object.assign(config_0, { authSchemePreference: (0, import_dist_cjs$33.normalizeProvider)(config.authSchemePreference ?? []) });
	};
}));

//#endregion
//#region ../node_modules/.pnpm/@aws-sdk+nested-clients@3.940.0/node_modules/@aws-sdk/nested-clients/dist-es/submodules/signin/endpoint/EndpointParameters.js
var resolveClientEndpointParameters, commonParams;
var init_EndpointParameters = require_chunk.__esmMin((() => {
	resolveClientEndpointParameters = (options) => {
		return Object.assign(options, {
			useDualstackEndpoint: options.useDualstackEndpoint ?? false,
			useFipsEndpoint: options.useFipsEndpoint ?? false,
			defaultSigningName: "signin"
		});
	};
	commonParams = {
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
}));

//#endregion
//#region ../node_modules/.pnpm/@aws-sdk+nested-clients@3.940.0/node_modules/@aws-sdk/nested-clients/dist-es/submodules/signin/endpoint/ruleset.js
var u, v, w, x, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, _data, ruleSet;
var init_ruleset = require_chunk.__esmMin((() => {
	u = "required", v = "fn", w = "argv", x = "ref";
	a = true, b = "isSet", c = "booleanEquals", d = "error", e = "endpoint", f = "tree", g = "PartitionResult", h = "stringEquals", i = {
		[u]: true,
		"default": false,
		"type": "boolean"
	}, j = {
		[u]: false,
		"type": "string"
	}, k = { [x]: "Endpoint" }, l = {
		[v]: c,
		[w]: [{ [x]: "UseFIPS" }, true]
	}, m = {
		[v]: c,
		[w]: [{ [x]: "UseDualStack" }, true]
	}, n = {}, o = {
		[v]: "getAttr",
		[w]: [{ [x]: g }, "name"]
	}, p = {
		[v]: c,
		[w]: [{ [x]: "UseFIPS" }, false]
	}, q = {
		[v]: c,
		[w]: [{ [x]: "UseDualStack" }, false]
	}, r = {
		[v]: "getAttr",
		[w]: [{ [x]: g }, "supportsFIPS"]
	}, s = {
		[v]: c,
		[w]: [true, {
			[v]: "getAttr",
			[w]: [{ [x]: g }, "supportsDualStack"]
		}]
	}, t = [{ [x]: "Region" }];
	_data = {
		version: "1.0",
		parameters: {
			UseDualStack: i,
			UseFIPS: i,
			Endpoint: j,
			Region: j
		},
		rules: [{
			conditions: [{
				[v]: b,
				[w]: [k]
			}],
			rules: [{
				conditions: [l],
				error: "Invalid Configuration: FIPS and custom endpoint are not supported",
				type: d
			}, {
				rules: [{
					conditions: [m],
					error: "Invalid Configuration: Dualstack and custom endpoint are not supported",
					type: d
				}, {
					endpoint: {
						url: k,
						properties: n,
						headers: n
					},
					type: e
				}],
				type: f
			}],
			type: f
		}, {
			rules: [{
				conditions: [{
					[v]: b,
					[w]: t
				}],
				rules: [{
					conditions: [{
						[v]: "aws.partition",
						[w]: t,
						assign: g
					}],
					rules: [
						{
							conditions: [
								{
									[v]: h,
									[w]: [o, "aws"]
								},
								p,
								q
							],
							endpoint: {
								url: "https://{Region}.signin.aws.amazon.com",
								properties: n,
								headers: n
							},
							type: e
						},
						{
							conditions: [
								{
									[v]: h,
									[w]: [o, "aws-cn"]
								},
								p,
								q
							],
							endpoint: {
								url: "https://{Region}.signin.amazonaws.cn",
								properties: n,
								headers: n
							},
							type: e
						},
						{
							conditions: [
								{
									[v]: h,
									[w]: [o, "aws-us-gov"]
								},
								p,
								q
							],
							endpoint: {
								url: "https://{Region}.signin.amazonaws-us-gov.com",
								properties: n,
								headers: n
							},
							type: e
						},
						{
							conditions: [l, m],
							rules: [{
								conditions: [{
									[v]: c,
									[w]: [a, r]
								}, s],
								rules: [{
									endpoint: {
										url: "https://signin-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
										properties: n,
										headers: n
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
							conditions: [l, q],
							rules: [{
								conditions: [{
									[v]: c,
									[w]: [r, a]
								}],
								rules: [{
									endpoint: {
										url: "https://signin-fips.{Region}.{PartitionResult#dnsSuffix}",
										properties: n,
										headers: n
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
							conditions: [p, m],
							rules: [{
								conditions: [s],
								rules: [{
									endpoint: {
										url: "https://signin.{Region}.{PartitionResult#dualStackDnsSuffix}",
										properties: n,
										headers: n
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
								url: "https://signin.{Region}.{PartitionResult#dnsSuffix}",
								properties: n,
								headers: n
							},
							type: e
						}
					],
					type: f
				}],
				type: f
			}, {
				error: "Invalid Configuration: Missing Region",
				type: d
			}],
			type: f
		}]
	};
	ruleSet = _data;
}));

//#endregion
//#region ../node_modules/.pnpm/@aws-sdk+nested-clients@3.940.0/node_modules/@aws-sdk/nested-clients/dist-es/submodules/signin/endpoint/endpointResolver.js
var import_dist_cjs$31, import_dist_cjs$32, cache, defaultEndpointResolver;
var init_endpointResolver = require_chunk.__esmMin((() => {
	import_dist_cjs$31 = require_dist_cjs$25.require_dist_cjs$11();
	import_dist_cjs$32 = require_dist_cjs$25.require_dist_cjs$12();
	init_ruleset();
	cache = new import_dist_cjs$32.EndpointCache({
		size: 50,
		params: [
			"Endpoint",
			"Region",
			"UseDualStack",
			"UseFIPS"
		]
	});
	defaultEndpointResolver = (endpointParams, context = {}) => {
		return cache.get(endpointParams, () => (0, import_dist_cjs$32.resolveEndpoint)(ruleSet, {
			endpointParams,
			logger: context.logger
		}));
	};
	import_dist_cjs$32.customEndpointFunctions.aws = import_dist_cjs$31.awsEndpointFunctions;
}));

//#endregion
//#region ../node_modules/.pnpm/@aws-sdk+nested-clients@3.940.0/node_modules/@aws-sdk/nested-clients/dist-es/submodules/signin/runtimeConfig.shared.js
var import_dist_cjs$27, import_dist_cjs$28, import_dist_cjs$29, import_dist_cjs$30, getRuntimeConfig$1;
var init_runtimeConfig_shared = require_chunk.__esmMin((() => {
	require_dist_cjs$25.init_dist_es();
	require_dist_cjs$25.init_protocols();
	require_dist_cjs$25.init_dist_es$1();
	import_dist_cjs$27 = require_dist_cjs$26.require_dist_cjs();
	import_dist_cjs$28 = require_dist_cjs$28.require_dist_cjs$1();
	import_dist_cjs$29 = require_dist_cjs$26.require_dist_cjs$6();
	import_dist_cjs$30 = require_dist_cjs$27.require_dist_cjs();
	init_httpAuthSchemeProvider();
	init_endpointResolver();
	getRuntimeConfig$1 = (config) => {
		return {
			apiVersion: "2023-01-01",
			base64Decoder: config?.base64Decoder ?? import_dist_cjs$29.fromBase64,
			base64Encoder: config?.base64Encoder ?? import_dist_cjs$29.toBase64,
			disableHostPrefix: config?.disableHostPrefix ?? false,
			endpointProvider: config?.endpointProvider ?? defaultEndpointResolver,
			extensions: config?.extensions ?? [],
			httpAuthSchemeProvider: config?.httpAuthSchemeProvider ?? defaultSigninHttpAuthSchemeProvider,
			httpAuthSchemes: config?.httpAuthSchemes ?? [{
				schemeId: "aws.auth#sigv4",
				identityProvider: (ipc) => ipc.getIdentityProvider("aws.auth#sigv4"),
				signer: new require_dist_cjs$25.AwsSdkSigV4Signer()
			}, {
				schemeId: "smithy.api#noAuth",
				identityProvider: (ipc) => ipc.getIdentityProvider("smithy.api#noAuth") || (async () => ({})),
				signer: new require_dist_cjs$25.NoAuthSigner()
			}],
			logger: config?.logger ?? new import_dist_cjs$27.NoOpLogger(),
			protocol: config?.protocol ?? new require_dist_cjs$25.AwsRestJsonProtocol({ defaultNamespace: "com.amazonaws.signin" }),
			serviceId: config?.serviceId ?? "Signin",
			urlParser: config?.urlParser ?? import_dist_cjs$28.parseUrl,
			utf8Decoder: config?.utf8Decoder ?? import_dist_cjs$30.fromUtf8,
			utf8Encoder: config?.utf8Encoder ?? import_dist_cjs$30.toUtf8
		};
	};
}));

//#endregion
//#region ../node_modules/.pnpm/@aws-sdk+nested-clients@3.940.0/node_modules/@aws-sdk/nested-clients/dist-es/submodules/signin/runtimeConfig.js
var import_dist_cjs$16, import_dist_cjs$17, import_dist_cjs$18, import_dist_cjs$19, import_dist_cjs$20, import_dist_cjs$21, import_dist_cjs$22, import_dist_cjs$23, import_dist_cjs$24, import_dist_cjs$25, import_dist_cjs$26, getRuntimeConfig;
var init_runtimeConfig = require_chunk.__esmMin((() => {
	require_dist_cjs$25.init_dist_es();
	import_dist_cjs$16 = require_dist_cjs$25.require_dist_cjs$4();
	import_dist_cjs$17 = require_dist_cjs$25.require_dist_cjs$9();
	import_dist_cjs$18 = require_dist_cjs$25.require_dist_cjs$3();
	import_dist_cjs$19 = require_dist_cjs$25.require_dist_cjs$5();
	import_dist_cjs$20 = require_dist_cjs$28.require_dist_cjs();
	import_dist_cjs$21 = require_dist_cjs$26.require_dist_cjs$4();
	import_dist_cjs$22 = require_dist_cjs$25.require_dist_cjs$2();
	import_dist_cjs$23 = require_dist_cjs$25.require_dist_cjs$6();
	init_runtimeConfig_shared();
	import_dist_cjs$24 = require_dist_cjs$26.require_dist_cjs();
	import_dist_cjs$25 = require_dist_cjs$25.require_dist_cjs$1();
	import_dist_cjs$26 = require_dist_cjs$26.require_dist_cjs();
	getRuntimeConfig = (config) => {
		(0, import_dist_cjs$26.emitWarningIfUnsupportedVersion)(process.version);
		const defaultsMode = (0, import_dist_cjs$25.resolveDefaultsModeConfig)(config);
		const defaultConfigProvider = () => defaultsMode().then(import_dist_cjs$24.loadConfigsForDefaultMode);
		const clientSharedValues = getRuntimeConfig$1(config);
		require_client.emitWarningIfUnsupportedVersion(process.version);
		const loaderConfig = {
			profile: config?.profile,
			logger: clientSharedValues.logger
		};
		return {
			...clientSharedValues,
			...config,
			runtime: "node",
			defaultsMode,
			authSchemePreference: config?.authSchemePreference ?? (0, import_dist_cjs$20.loadConfig)(require_dist_cjs$25.NODE_AUTH_SCHEME_PREFERENCE_OPTIONS, loaderConfig),
			bodyLengthChecker: config?.bodyLengthChecker ?? import_dist_cjs$22.calculateBodyLength,
			defaultUserAgentProvider: config?.defaultUserAgentProvider ?? (0, import_dist_cjs$16.createDefaultUserAgentProvider)({
				serviceId: clientSharedValues.serviceId,
				clientVersion: require_package.version
			}),
			maxAttempts: config?.maxAttempts ?? (0, import_dist_cjs$20.loadConfig)(import_dist_cjs$19.NODE_MAX_ATTEMPT_CONFIG_OPTIONS, config),
			region: config?.region ?? (0, import_dist_cjs$20.loadConfig)(import_dist_cjs$17.NODE_REGION_CONFIG_OPTIONS, {
				...import_dist_cjs$17.NODE_REGION_CONFIG_FILE_OPTIONS,
				...loaderConfig
			}),
			requestHandler: import_dist_cjs$21.NodeHttpHandler.create(config?.requestHandler ?? defaultConfigProvider),
			retryMode: config?.retryMode ?? (0, import_dist_cjs$20.loadConfig)({
				...import_dist_cjs$19.NODE_RETRY_MODE_CONFIG_OPTIONS,
				default: async () => (await defaultConfigProvider()).retryMode || import_dist_cjs$23.DEFAULT_RETRY_MODE
			}, config),
			sha256: config?.sha256 ?? import_dist_cjs$18.Hash.bind(null, "sha256"),
			streamCollector: config?.streamCollector ?? import_dist_cjs$21.streamCollector,
			useDualstackEndpoint: config?.useDualstackEndpoint ?? (0, import_dist_cjs$20.loadConfig)(import_dist_cjs$17.NODE_USE_DUALSTACK_ENDPOINT_CONFIG_OPTIONS, loaderConfig),
			useFipsEndpoint: config?.useFipsEndpoint ?? (0, import_dist_cjs$20.loadConfig)(import_dist_cjs$17.NODE_USE_FIPS_ENDPOINT_CONFIG_OPTIONS, loaderConfig),
			userAgentAppId: config?.userAgentAppId ?? (0, import_dist_cjs$20.loadConfig)(import_dist_cjs$16.NODE_APP_ID_CONFIG_OPTIONS, loaderConfig)
		};
	};
}));

//#endregion
//#region ../node_modules/.pnpm/@aws-sdk+nested-clients@3.940.0/node_modules/@aws-sdk/nested-clients/dist-es/submodules/signin/auth/httpAuthExtensionConfiguration.js
var getHttpAuthExtensionConfiguration, resolveHttpAuthRuntimeConfig;
var init_httpAuthExtensionConfiguration = require_chunk.__esmMin((() => {
	getHttpAuthExtensionConfiguration = (runtimeConfig) => {
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
	resolveHttpAuthRuntimeConfig = (config) => {
		return {
			httpAuthSchemes: config.httpAuthSchemes(),
			httpAuthSchemeProvider: config.httpAuthSchemeProvider(),
			credentials: config.credentials()
		};
	};
}));

//#endregion
//#region ../node_modules/.pnpm/@aws-sdk+nested-clients@3.940.0/node_modules/@aws-sdk/nested-clients/dist-es/submodules/signin/runtimeExtensions.js
var import_dist_cjs$13, import_dist_cjs$14, import_dist_cjs$15, resolveRuntimeExtensions;
var init_runtimeExtensions = require_chunk.__esmMin((() => {
	import_dist_cjs$13 = require_dist_cjs$25.require_dist_cjs();
	import_dist_cjs$14 = require_dist_cjs$24.require_dist_cjs();
	import_dist_cjs$15 = require_dist_cjs$26.require_dist_cjs();
	init_httpAuthExtensionConfiguration();
	resolveRuntimeExtensions = (runtimeConfig, extensions) => {
		const extensionConfiguration = Object.assign((0, import_dist_cjs$13.getAwsRegionExtensionConfiguration)(runtimeConfig), (0, import_dist_cjs$15.getDefaultExtensionConfiguration)(runtimeConfig), (0, import_dist_cjs$14.getHttpHandlerExtensionConfiguration)(runtimeConfig), getHttpAuthExtensionConfiguration(runtimeConfig));
		extensions.forEach((extension) => extension.configure(extensionConfiguration));
		return Object.assign(runtimeConfig, (0, import_dist_cjs$13.resolveAwsRegionExtensionConfiguration)(extensionConfiguration), (0, import_dist_cjs$15.resolveDefaultRuntimeConfig)(extensionConfiguration), (0, import_dist_cjs$14.resolveHttpHandlerRuntimeConfig)(extensionConfiguration), resolveHttpAuthRuntimeConfig(extensionConfiguration));
	};
}));

//#endregion
//#region ../node_modules/.pnpm/@aws-sdk+nested-clients@3.940.0/node_modules/@aws-sdk/nested-clients/dist-es/submodules/signin/SigninClient.js
var import_dist_cjs$4, import_dist_cjs$5, import_dist_cjs$6, import_dist_cjs$7, import_dist_cjs$8, import_dist_cjs$9, import_dist_cjs$10, import_dist_cjs$11, import_dist_cjs$12, SigninClient;
var init_SigninClient = require_chunk.__esmMin((() => {
	import_dist_cjs$4 = require_dist_cjs$25.require_dist_cjs$15();
	import_dist_cjs$5 = require_dist_cjs$25.require_dist_cjs$14();
	import_dist_cjs$6 = require_dist_cjs$25.require_dist_cjs$13();
	import_dist_cjs$7 = require_dist_cjs$25.require_dist_cjs$10();
	import_dist_cjs$8 = require_dist_cjs$25.require_dist_cjs$9();
	require_dist_cjs$25.init_dist_es$1();
	require_dist_cjs$26.init_schema();
	import_dist_cjs$9 = require_dist_cjs$25.require_dist_cjs$8();
	import_dist_cjs$10 = require_dist_cjs$25.require_dist_cjs$7();
	import_dist_cjs$11 = require_dist_cjs$25.require_dist_cjs$5();
	import_dist_cjs$12 = require_dist_cjs$26.require_dist_cjs();
	init_httpAuthSchemeProvider();
	init_EndpointParameters();
	init_runtimeConfig();
	init_runtimeExtensions();
	SigninClient = class extends import_dist_cjs$12.Client {
		config;
		constructor(...[configuration]) {
			const _config_0 = getRuntimeConfig(configuration || {});
			super(_config_0);
			this.initConfig = _config_0;
			this.config = resolveRuntimeExtensions(resolveHttpAuthSchemeConfig((0, import_dist_cjs$10.resolveEndpointConfig)((0, import_dist_cjs$4.resolveHostHeaderConfig)((0, import_dist_cjs$8.resolveRegionConfig)((0, import_dist_cjs$11.resolveRetryConfig)((0, import_dist_cjs$7.resolveUserAgentConfig)(resolveClientEndpointParameters(_config_0))))))), configuration?.extensions || []);
			this.middlewareStack.use(require_dist_cjs$26.getSchemaSerdePlugin(this.config));
			this.middlewareStack.use((0, import_dist_cjs$7.getUserAgentPlugin)(this.config));
			this.middlewareStack.use((0, import_dist_cjs$11.getRetryPlugin)(this.config));
			this.middlewareStack.use((0, import_dist_cjs$9.getContentLengthPlugin)(this.config));
			this.middlewareStack.use((0, import_dist_cjs$4.getHostHeaderPlugin)(this.config));
			this.middlewareStack.use((0, import_dist_cjs$5.getLoggerPlugin)(this.config));
			this.middlewareStack.use((0, import_dist_cjs$6.getRecursionDetectionPlugin)(this.config));
			this.middlewareStack.use(require_dist_cjs$25.getHttpAuthSchemeEndpointRuleSetPlugin(this.config, {
				httpAuthSchemeParametersProvider: defaultSigninHttpAuthSchemeParametersProvider,
				identityProviderConfigProvider: async (config) => new require_dist_cjs$25.DefaultIdentityProviderConfig({ "aws.auth#sigv4": config.credentials })
			}));
			this.middlewareStack.use(require_dist_cjs$25.getHttpSigningPlugin(this.config));
		}
		destroy() {
			super.destroy();
		}
	};
}));

//#endregion
//#region ../node_modules/.pnpm/@aws-sdk+nested-clients@3.940.0/node_modules/@aws-sdk/nested-clients/dist-es/submodules/signin/models/SigninServiceException.js
var import_dist_cjs$3, SigninServiceException$1;
var init_SigninServiceException = require_chunk.__esmMin((() => {
	import_dist_cjs$3 = require_dist_cjs$26.require_dist_cjs();
	SigninServiceException$1 = class SigninServiceException$1 extends import_dist_cjs$3.ServiceException {
		constructor(options) {
			super(options);
			Object.setPrototypeOf(this, SigninServiceException$1.prototype);
		}
	};
}));

//#endregion
//#region ../node_modules/.pnpm/@aws-sdk+nested-clients@3.940.0/node_modules/@aws-sdk/nested-clients/dist-es/submodules/signin/models/errors.js
var AccessDeniedException$1, InternalServerException$1, TooManyRequestsError$1, ValidationException$1;
var init_errors = require_chunk.__esmMin((() => {
	init_SigninServiceException();
	AccessDeniedException$1 = class AccessDeniedException$1 extends SigninServiceException$1 {
		name = "AccessDeniedException";
		$fault = "client";
		error;
		constructor(opts) {
			super({
				name: "AccessDeniedException",
				$fault: "client",
				...opts
			});
			Object.setPrototypeOf(this, AccessDeniedException$1.prototype);
			this.error = opts.error;
		}
	};
	InternalServerException$1 = class InternalServerException$1 extends SigninServiceException$1 {
		name = "InternalServerException";
		$fault = "server";
		error;
		constructor(opts) {
			super({
				name: "InternalServerException",
				$fault: "server",
				...opts
			});
			Object.setPrototypeOf(this, InternalServerException$1.prototype);
			this.error = opts.error;
		}
	};
	TooManyRequestsError$1 = class TooManyRequestsError$1 extends SigninServiceException$1 {
		name = "TooManyRequestsError";
		$fault = "client";
		error;
		constructor(opts) {
			super({
				name: "TooManyRequestsError",
				$fault: "client",
				...opts
			});
			Object.setPrototypeOf(this, TooManyRequestsError$1.prototype);
			this.error = opts.error;
		}
	};
	ValidationException$1 = class ValidationException$1 extends SigninServiceException$1 {
		name = "ValidationException";
		$fault = "client";
		error;
		constructor(opts) {
			super({
				name: "ValidationException",
				$fault: "client",
				...opts
			});
			Object.setPrototypeOf(this, ValidationException$1.prototype);
			this.error = opts.error;
		}
	};
}));

//#endregion
//#region ../node_modules/.pnpm/@aws-sdk+nested-clients@3.940.0/node_modules/@aws-sdk/nested-clients/dist-es/submodules/signin/schemas/schemas_0.js
var _ADE, _AT, _COAT, _COATR, _COATRB, _COATRBr, _COATRr, _ISE, _RT, _TMRE, _VE, _aKI, _aT, _c, _cI, _cV, _co, _e, _eI, _gT, _h, _hE, _iT, _jN, _m, _rT, _rU, _s, _sAK, _sT, _sm, _tI, _tO, _tT, n0, RefreshToken, AccessDeniedException, AccessToken, CreateOAuth2TokenRequest, CreateOAuth2TokenRequestBody, CreateOAuth2TokenResponse, CreateOAuth2TokenResponseBody, InternalServerException, TooManyRequestsError, ValidationException, SigninServiceException, CreateOAuth2Token;
var init_schemas_0 = require_chunk.__esmMin((() => {
	require_dist_cjs$26.init_schema();
	init_errors();
	init_SigninServiceException();
	_ADE = "AccessDeniedException";
	_AT = "AccessToken";
	_COAT = "CreateOAuth2Token";
	_COATR = "CreateOAuth2TokenRequest";
	_COATRB = "CreateOAuth2TokenRequestBody";
	_COATRBr = "CreateOAuth2TokenResponseBody";
	_COATRr = "CreateOAuth2TokenResponse";
	_ISE = "InternalServerException";
	_RT = "RefreshToken";
	_TMRE = "TooManyRequestsError";
	_VE = "ValidationException";
	_aKI = "accessKeyId";
	_aT = "accessToken";
	_c = "client";
	_cI = "clientId";
	_cV = "codeVerifier";
	_co = "code";
	_e = "error";
	_eI = "expiresIn";
	_gT = "grantType";
	_h = "http";
	_hE = "httpError";
	_iT = "idToken";
	_jN = "jsonName";
	_m = "message";
	_rT = "refreshToken";
	_rU = "redirectUri";
	_s = "server";
	_sAK = "secretAccessKey";
	_sT = "sessionToken";
	_sm = "smithy.ts.sdk.synthetic.com.amazonaws.signin";
	_tI = "tokenInput";
	_tO = "tokenOutput";
	_tT = "tokenType";
	n0 = "com.amazonaws.signin";
	RefreshToken = [
		0,
		n0,
		_RT,
		8,
		0
	];
	AccessDeniedException = [
		-3,
		n0,
		_ADE,
		{ [_e]: _c },
		[_e, _m],
		[0, 0]
	];
	require_dist_cjs$26.TypeRegistry.for(n0).registerError(AccessDeniedException, AccessDeniedException$1);
	AccessToken = [
		3,
		n0,
		_AT,
		8,
		[
			_aKI,
			_sAK,
			_sT
		],
		[
			[0, { [_jN]: _aKI }],
			[0, { [_jN]: _sAK }],
			[0, { [_jN]: _sT }]
		]
	];
	CreateOAuth2TokenRequest = [
		3,
		n0,
		_COATR,
		0,
		[_tI],
		[[() => CreateOAuth2TokenRequestBody, 16]]
	];
	CreateOAuth2TokenRequestBody = [
		3,
		n0,
		_COATRB,
		0,
		[
			_cI,
			_gT,
			_co,
			_rU,
			_cV,
			_rT
		],
		[
			[0, { [_jN]: _cI }],
			[0, { [_jN]: _gT }],
			0,
			[0, { [_jN]: _rU }],
			[0, { [_jN]: _cV }],
			[() => RefreshToken, { [_jN]: _rT }]
		]
	];
	CreateOAuth2TokenResponse = [
		3,
		n0,
		_COATRr,
		0,
		[_tO],
		[[() => CreateOAuth2TokenResponseBody, 16]]
	];
	CreateOAuth2TokenResponseBody = [
		3,
		n0,
		_COATRBr,
		0,
		[
			_aT,
			_tT,
			_eI,
			_rT,
			_iT
		],
		[
			[() => AccessToken, { [_jN]: _aT }],
			[0, { [_jN]: _tT }],
			[1, { [_jN]: _eI }],
			[() => RefreshToken, { [_jN]: _rT }],
			[0, { [_jN]: _iT }]
		]
	];
	InternalServerException = [
		-3,
		n0,
		_ISE,
		{
			[_e]: _s,
			[_hE]: 500
		},
		[_e, _m],
		[0, 0]
	];
	require_dist_cjs$26.TypeRegistry.for(n0).registerError(InternalServerException, InternalServerException$1);
	TooManyRequestsError = [
		-3,
		n0,
		_TMRE,
		{
			[_e]: _c,
			[_hE]: 429
		},
		[_e, _m],
		[0, 0]
	];
	require_dist_cjs$26.TypeRegistry.for(n0).registerError(TooManyRequestsError, TooManyRequestsError$1);
	ValidationException = [
		-3,
		n0,
		_VE,
		{
			[_e]: _c,
			[_hE]: 400
		},
		[_e, _m],
		[0, 0]
	];
	require_dist_cjs$26.TypeRegistry.for(n0).registerError(ValidationException, ValidationException$1);
	SigninServiceException = [
		-3,
		_sm,
		"SigninServiceException",
		0,
		[],
		[]
	];
	require_dist_cjs$26.TypeRegistry.for(_sm).registerError(SigninServiceException, SigninServiceException$1);
	CreateOAuth2Token = [
		9,
		n0,
		_COAT,
		{ [_h]: [
			"POST",
			"/v1/token",
			200
		] },
		() => CreateOAuth2TokenRequest,
		() => CreateOAuth2TokenResponse
	];
}));

//#endregion
//#region ../node_modules/.pnpm/@aws-sdk+nested-clients@3.940.0/node_modules/@aws-sdk/nested-clients/dist-es/submodules/signin/commands/CreateOAuth2TokenCommand.js
var import_dist_cjs$1, import_dist_cjs$2, CreateOAuth2TokenCommand;
var init_CreateOAuth2TokenCommand = require_chunk.__esmMin((() => {
	import_dist_cjs$1 = require_dist_cjs$25.require_dist_cjs$7();
	import_dist_cjs$2 = require_dist_cjs$26.require_dist_cjs();
	init_EndpointParameters();
	init_schemas_0();
	CreateOAuth2TokenCommand = class extends import_dist_cjs$2.Command.classBuilder().ep(commonParams).m(function(Command, cs, config, o$1) {
		return [(0, import_dist_cjs$1.getEndpointPlugin)(config, Command.getEndpointParameterInstructions())];
	}).s("Signin", "CreateOAuth2Token", {}).n("SigninClient", "CreateOAuth2TokenCommand").sc(CreateOAuth2Token).build() {};
}));

//#endregion
//#region ../node_modules/.pnpm/@aws-sdk+nested-clients@3.940.0/node_modules/@aws-sdk/nested-clients/dist-es/submodules/signin/Signin.js
var import_dist_cjs, commands, Signin;
var init_Signin = require_chunk.__esmMin((() => {
	import_dist_cjs = require_dist_cjs$26.require_dist_cjs();
	init_CreateOAuth2TokenCommand();
	init_SigninClient();
	commands = { CreateOAuth2TokenCommand };
	Signin = class extends SigninClient {};
	(0, import_dist_cjs.createAggregatedClient)(commands, Signin);
}));

//#endregion
//#region ../node_modules/.pnpm/@aws-sdk+nested-clients@3.940.0/node_modules/@aws-sdk/nested-clients/dist-es/submodules/signin/commands/index.js
var init_commands = require_chunk.__esmMin((() => {
	init_CreateOAuth2TokenCommand();
}));

//#endregion
//#region ../node_modules/.pnpm/@aws-sdk+nested-clients@3.940.0/node_modules/@aws-sdk/nested-clients/dist-es/submodules/signin/models/enums.js
var init_enums = require_chunk.__esmMin((() => {}));

//#endregion
//#region ../node_modules/.pnpm/@aws-sdk+nested-clients@3.940.0/node_modules/@aws-sdk/nested-clients/dist-es/submodules/signin/index.js
var init_signin = require_chunk.__esmMin((() => {
	init_SigninClient();
	init_Signin();
	init_commands();
	init_enums();
	init_errors();
}));

//#endregion
init_signin();
exports.CreateOAuth2TokenCommand = CreateOAuth2TokenCommand;
exports.SigninClient = SigninClient;