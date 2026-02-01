const require_chunk = require('./chunk-CdAKIUsw.js');
const require_dist_cjs$24 = require('./dist-cjs-BawS8oYv.js');
const require_dist_cjs$25 = require('./dist-cjs-B9UsuYCY.js');
const require_dist_cjs$26 = require('./dist-cjs-BMOAUmMP.js');
const require_dist_cjs$27 = require('./dist-cjs-DVzRDdXz.js');
const require_dist_cjs$28 = require('./dist-cjs-CWItNfj0.js');
const require_client = require('./client-BsEbA1K3.js');
const require_package = require('./package-C0chbb9U.js');

//#region ../node_modules/.pnpm/@aws-sdk+nested-clients@3.940.0/node_modules/@aws-sdk/nested-clients/dist-es/submodules/sso-oidc/auth/httpAuthSchemeProvider.js
function createAwsAuthSigv4HttpAuthOption(authParameters) {
	return {
		schemeId: "aws.auth#sigv4",
		signingProperties: {
			name: "sso-oauth",
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
var import_dist_cjs$33, defaultSSOOIDCHttpAuthSchemeParametersProvider, defaultSSOOIDCHttpAuthSchemeProvider, resolveHttpAuthSchemeConfig;
var init_httpAuthSchemeProvider = require_chunk.__esmMin((() => {
	require_dist_cjs$25.init_dist_es();
	import_dist_cjs$33 = require_dist_cjs$26.require_dist_cjs$7();
	defaultSSOOIDCHttpAuthSchemeParametersProvider = async (config, context, input) => {
		return {
			operation: (0, import_dist_cjs$33.getSmithyContext)(context).operation,
			region: await (0, import_dist_cjs$33.normalizeProvider)(config.region)() || (() => {
				throw new Error("expected `region` to be configured for `aws.auth#sigv4`");
			})()
		};
	};
	defaultSSOOIDCHttpAuthSchemeProvider = (authParameters) => {
		const options = [];
		switch (authParameters.operation) {
			case "CreateToken":
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
//#region ../node_modules/.pnpm/@aws-sdk+nested-clients@3.940.0/node_modules/@aws-sdk/nested-clients/dist-es/submodules/sso-oidc/endpoint/EndpointParameters.js
var resolveClientEndpointParameters, commonParams;
var init_EndpointParameters = require_chunk.__esmMin((() => {
	resolveClientEndpointParameters = (options) => {
		return Object.assign(options, {
			useDualstackEndpoint: options.useDualstackEndpoint ?? false,
			useFipsEndpoint: options.useFipsEndpoint ?? false,
			defaultSigningName: "sso-oauth"
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
//#region ../node_modules/.pnpm/@aws-sdk+nested-clients@3.940.0/node_modules/@aws-sdk/nested-clients/dist-es/submodules/sso-oidc/endpoint/ruleset.js
var u, v, w, x, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, _data, ruleSet;
var init_ruleset = require_chunk.__esmMin((() => {
	u = "required", v = "fn", w = "argv", x = "ref";
	a = true, b = "isSet", c = "booleanEquals", d = "error", e = "endpoint", f = "tree", g = "PartitionResult", h = "getAttr", i = {
		[u]: false,
		"type": "string"
	}, j = {
		[u]: true,
		"default": false,
		"type": "boolean"
	}, k = { [x]: "Endpoint" }, l = {
		[v]: c,
		[w]: [{ [x]: "UseFIPS" }, true]
	}, m = {
		[v]: c,
		[w]: [{ [x]: "UseDualStack" }, true]
	}, n = {}, o = {
		[v]: h,
		[w]: [{ [x]: g }, "supportsFIPS"]
	}, p = { [x]: g }, q = {
		[v]: c,
		[w]: [true, {
			[v]: h,
			[w]: [p, "supportsDualStack"]
		}]
	}, r = [l], s = [m], t = [{ [x]: "Region" }];
	_data = {
		version: "1.0",
		parameters: {
			Region: i,
			UseDualStack: j,
			UseFIPS: j,
			Endpoint: i
		},
		rules: [
			{
				conditions: [{
					[v]: b,
					[w]: [k]
				}],
				rules: [
					{
						conditions: r,
						error: "Invalid Configuration: FIPS and custom endpoint are not supported",
						type: d
					},
					{
						conditions: s,
						error: "Invalid Configuration: Dualstack and custom endpoint are not supported",
						type: d
					},
					{
						endpoint: {
							url: k,
							properties: n,
							headers: n
						},
						type: e
					}
				],
				type: f
			},
			{
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
							conditions: [l, m],
							rules: [{
								conditions: [{
									[v]: c,
									[w]: [a, o]
								}, q],
								rules: [{
									endpoint: {
										url: "https://oidc-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
							conditions: r,
							rules: [{
								conditions: [{
									[v]: c,
									[w]: [o, a]
								}],
								rules: [{
									conditions: [{
										[v]: "stringEquals",
										[w]: [{
											[v]: h,
											[w]: [p, "name"]
										}, "aws-us-gov"]
									}],
									endpoint: {
										url: "https://oidc.{Region}.amazonaws.com",
										properties: n,
										headers: n
									},
									type: e
								}, {
									endpoint: {
										url: "https://oidc-fips.{Region}.{PartitionResult#dnsSuffix}",
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
							conditions: s,
							rules: [{
								conditions: [q],
								rules: [{
									endpoint: {
										url: "https://oidc.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
								url: "https://oidc.{Region}.{PartitionResult#dnsSuffix}",
								properties: n,
								headers: n
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
	ruleSet = _data;
}));

//#endregion
//#region ../node_modules/.pnpm/@aws-sdk+nested-clients@3.940.0/node_modules/@aws-sdk/nested-clients/dist-es/submodules/sso-oidc/endpoint/endpointResolver.js
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
//#region ../node_modules/.pnpm/@aws-sdk+nested-clients@3.940.0/node_modules/@aws-sdk/nested-clients/dist-es/submodules/sso-oidc/runtimeConfig.shared.js
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
			apiVersion: "2019-06-10",
			base64Decoder: config?.base64Decoder ?? import_dist_cjs$29.fromBase64,
			base64Encoder: config?.base64Encoder ?? import_dist_cjs$29.toBase64,
			disableHostPrefix: config?.disableHostPrefix ?? false,
			endpointProvider: config?.endpointProvider ?? defaultEndpointResolver,
			extensions: config?.extensions ?? [],
			httpAuthSchemeProvider: config?.httpAuthSchemeProvider ?? defaultSSOOIDCHttpAuthSchemeProvider,
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
			protocol: config?.protocol ?? new require_dist_cjs$25.AwsRestJsonProtocol({ defaultNamespace: "com.amazonaws.ssooidc" }),
			serviceId: config?.serviceId ?? "SSO OIDC",
			urlParser: config?.urlParser ?? import_dist_cjs$28.parseUrl,
			utf8Decoder: config?.utf8Decoder ?? import_dist_cjs$30.fromUtf8,
			utf8Encoder: config?.utf8Encoder ?? import_dist_cjs$30.toUtf8
		};
	};
}));

//#endregion
//#region ../node_modules/.pnpm/@aws-sdk+nested-clients@3.940.0/node_modules/@aws-sdk/nested-clients/dist-es/submodules/sso-oidc/runtimeConfig.js
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
//#region ../node_modules/.pnpm/@aws-sdk+nested-clients@3.940.0/node_modules/@aws-sdk/nested-clients/dist-es/submodules/sso-oidc/auth/httpAuthExtensionConfiguration.js
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
//#region ../node_modules/.pnpm/@aws-sdk+nested-clients@3.940.0/node_modules/@aws-sdk/nested-clients/dist-es/submodules/sso-oidc/runtimeExtensions.js
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
//#region ../node_modules/.pnpm/@aws-sdk+nested-clients@3.940.0/node_modules/@aws-sdk/nested-clients/dist-es/submodules/sso-oidc/SSOOIDCClient.js
var import_dist_cjs$4, import_dist_cjs$5, import_dist_cjs$6, import_dist_cjs$7, import_dist_cjs$8, import_dist_cjs$9, import_dist_cjs$10, import_dist_cjs$11, import_dist_cjs$12, SSOOIDCClient;
var init_SSOOIDCClient = require_chunk.__esmMin((() => {
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
	SSOOIDCClient = class extends import_dist_cjs$12.Client {
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
				httpAuthSchemeParametersProvider: defaultSSOOIDCHttpAuthSchemeParametersProvider,
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
//#region ../node_modules/.pnpm/@aws-sdk+nested-clients@3.940.0/node_modules/@aws-sdk/nested-clients/dist-es/submodules/sso-oidc/models/SSOOIDCServiceException.js
var import_dist_cjs$3, SSOOIDCServiceException$1;
var init_SSOOIDCServiceException = require_chunk.__esmMin((() => {
	import_dist_cjs$3 = require_dist_cjs$26.require_dist_cjs();
	SSOOIDCServiceException$1 = class SSOOIDCServiceException$1 extends import_dist_cjs$3.ServiceException {
		constructor(options) {
			super(options);
			Object.setPrototypeOf(this, SSOOIDCServiceException$1.prototype);
		}
	};
}));

//#endregion
//#region ../node_modules/.pnpm/@aws-sdk+nested-clients@3.940.0/node_modules/@aws-sdk/nested-clients/dist-es/submodules/sso-oidc/models/errors.js
var AccessDeniedException$1, AuthorizationPendingException$1, ExpiredTokenException$1, InternalServerException$1, InvalidClientException$1, InvalidGrantException$1, InvalidRequestException$1, InvalidScopeException$1, SlowDownException$1, UnauthorizedClientException$1, UnsupportedGrantTypeException$1;
var init_errors = require_chunk.__esmMin((() => {
	init_SSOOIDCServiceException();
	AccessDeniedException$1 = class AccessDeniedException$1 extends SSOOIDCServiceException$1 {
		name = "AccessDeniedException";
		$fault = "client";
		error;
		reason;
		error_description;
		constructor(opts) {
			super({
				name: "AccessDeniedException",
				$fault: "client",
				...opts
			});
			Object.setPrototypeOf(this, AccessDeniedException$1.prototype);
			this.error = opts.error;
			this.reason = opts.reason;
			this.error_description = opts.error_description;
		}
	};
	AuthorizationPendingException$1 = class AuthorizationPendingException$1 extends SSOOIDCServiceException$1 {
		name = "AuthorizationPendingException";
		$fault = "client";
		error;
		error_description;
		constructor(opts) {
			super({
				name: "AuthorizationPendingException",
				$fault: "client",
				...opts
			});
			Object.setPrototypeOf(this, AuthorizationPendingException$1.prototype);
			this.error = opts.error;
			this.error_description = opts.error_description;
		}
	};
	ExpiredTokenException$1 = class ExpiredTokenException$1 extends SSOOIDCServiceException$1 {
		name = "ExpiredTokenException";
		$fault = "client";
		error;
		error_description;
		constructor(opts) {
			super({
				name: "ExpiredTokenException",
				$fault: "client",
				...opts
			});
			Object.setPrototypeOf(this, ExpiredTokenException$1.prototype);
			this.error = opts.error;
			this.error_description = opts.error_description;
		}
	};
	InternalServerException$1 = class InternalServerException$1 extends SSOOIDCServiceException$1 {
		name = "InternalServerException";
		$fault = "server";
		error;
		error_description;
		constructor(opts) {
			super({
				name: "InternalServerException",
				$fault: "server",
				...opts
			});
			Object.setPrototypeOf(this, InternalServerException$1.prototype);
			this.error = opts.error;
			this.error_description = opts.error_description;
		}
	};
	InvalidClientException$1 = class InvalidClientException$1 extends SSOOIDCServiceException$1 {
		name = "InvalidClientException";
		$fault = "client";
		error;
		error_description;
		constructor(opts) {
			super({
				name: "InvalidClientException",
				$fault: "client",
				...opts
			});
			Object.setPrototypeOf(this, InvalidClientException$1.prototype);
			this.error = opts.error;
			this.error_description = opts.error_description;
		}
	};
	InvalidGrantException$1 = class InvalidGrantException$1 extends SSOOIDCServiceException$1 {
		name = "InvalidGrantException";
		$fault = "client";
		error;
		error_description;
		constructor(opts) {
			super({
				name: "InvalidGrantException",
				$fault: "client",
				...opts
			});
			Object.setPrototypeOf(this, InvalidGrantException$1.prototype);
			this.error = opts.error;
			this.error_description = opts.error_description;
		}
	};
	InvalidRequestException$1 = class InvalidRequestException$1 extends SSOOIDCServiceException$1 {
		name = "InvalidRequestException";
		$fault = "client";
		error;
		reason;
		error_description;
		constructor(opts) {
			super({
				name: "InvalidRequestException",
				$fault: "client",
				...opts
			});
			Object.setPrototypeOf(this, InvalidRequestException$1.prototype);
			this.error = opts.error;
			this.reason = opts.reason;
			this.error_description = opts.error_description;
		}
	};
	InvalidScopeException$1 = class InvalidScopeException$1 extends SSOOIDCServiceException$1 {
		name = "InvalidScopeException";
		$fault = "client";
		error;
		error_description;
		constructor(opts) {
			super({
				name: "InvalidScopeException",
				$fault: "client",
				...opts
			});
			Object.setPrototypeOf(this, InvalidScopeException$1.prototype);
			this.error = opts.error;
			this.error_description = opts.error_description;
		}
	};
	SlowDownException$1 = class SlowDownException$1 extends SSOOIDCServiceException$1 {
		name = "SlowDownException";
		$fault = "client";
		error;
		error_description;
		constructor(opts) {
			super({
				name: "SlowDownException",
				$fault: "client",
				...opts
			});
			Object.setPrototypeOf(this, SlowDownException$1.prototype);
			this.error = opts.error;
			this.error_description = opts.error_description;
		}
	};
	UnauthorizedClientException$1 = class UnauthorizedClientException$1 extends SSOOIDCServiceException$1 {
		name = "UnauthorizedClientException";
		$fault = "client";
		error;
		error_description;
		constructor(opts) {
			super({
				name: "UnauthorizedClientException",
				$fault: "client",
				...opts
			});
			Object.setPrototypeOf(this, UnauthorizedClientException$1.prototype);
			this.error = opts.error;
			this.error_description = opts.error_description;
		}
	};
	UnsupportedGrantTypeException$1 = class UnsupportedGrantTypeException$1 extends SSOOIDCServiceException$1 {
		name = "UnsupportedGrantTypeException";
		$fault = "client";
		error;
		error_description;
		constructor(opts) {
			super({
				name: "UnsupportedGrantTypeException",
				$fault: "client",
				...opts
			});
			Object.setPrototypeOf(this, UnsupportedGrantTypeException$1.prototype);
			this.error = opts.error;
			this.error_description = opts.error_description;
		}
	};
}));

//#endregion
//#region ../node_modules/.pnpm/@aws-sdk+nested-clients@3.940.0/node_modules/@aws-sdk/nested-clients/dist-es/submodules/sso-oidc/schemas/schemas_0.js
var _ADE, _APE, _AT, _CS, _CT, _CTR, _CTRr, _CV, _ETE, _ICE, _IGE, _IRE, _ISE, _ISEn, _IT, _RT, _SDE, _UCE, _UGTE, _aT, _c, _cI, _cS, _cV, _co, _dC, _e, _eI, _ed, _gT, _h, _hE, _iT, _r, _rT, _rU, _s, _se, _sm, _tT, n0, AccessToken, ClientSecret, CodeVerifier, IdToken, RefreshToken, AccessDeniedException, AuthorizationPendingException, CreateTokenRequest, CreateTokenResponse, ExpiredTokenException, InternalServerException, InvalidClientException, InvalidGrantException, InvalidRequestException, InvalidScopeException, SlowDownException, UnauthorizedClientException, UnsupportedGrantTypeException, SSOOIDCServiceException, CreateToken;
var init_schemas_0 = require_chunk.__esmMin((() => {
	require_dist_cjs$26.init_schema();
	init_errors();
	init_SSOOIDCServiceException();
	_ADE = "AccessDeniedException";
	_APE = "AuthorizationPendingException";
	_AT = "AccessToken";
	_CS = "ClientSecret";
	_CT = "CreateToken";
	_CTR = "CreateTokenRequest";
	_CTRr = "CreateTokenResponse";
	_CV = "CodeVerifier";
	_ETE = "ExpiredTokenException";
	_ICE = "InvalidClientException";
	_IGE = "InvalidGrantException";
	_IRE = "InvalidRequestException";
	_ISE = "InternalServerException";
	_ISEn = "InvalidScopeException";
	_IT = "IdToken";
	_RT = "RefreshToken";
	_SDE = "SlowDownException";
	_UCE = "UnauthorizedClientException";
	_UGTE = "UnsupportedGrantTypeException";
	_aT = "accessToken";
	_c = "client";
	_cI = "clientId";
	_cS = "clientSecret";
	_cV = "codeVerifier";
	_co = "code";
	_dC = "deviceCode";
	_e = "error";
	_eI = "expiresIn";
	_ed = "error_description";
	_gT = "grantType";
	_h = "http";
	_hE = "httpError";
	_iT = "idToken";
	_r = "reason";
	_rT = "refreshToken";
	_rU = "redirectUri";
	_s = "scope";
	_se = "server";
	_sm = "smithy.ts.sdk.synthetic.com.amazonaws.ssooidc";
	_tT = "tokenType";
	n0 = "com.amazonaws.ssooidc";
	AccessToken = [
		0,
		n0,
		_AT,
		8,
		0
	];
	ClientSecret = [
		0,
		n0,
		_CS,
		8,
		0
	];
	CodeVerifier = [
		0,
		n0,
		_CV,
		8,
		0
	];
	IdToken = [
		0,
		n0,
		_IT,
		8,
		0
	];
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
		{
			[_e]: _c,
			[_hE]: 400
		},
		[
			_e,
			_r,
			_ed
		],
		[
			0,
			0,
			0
		]
	];
	require_dist_cjs$26.TypeRegistry.for(n0).registerError(AccessDeniedException, AccessDeniedException$1);
	AuthorizationPendingException = [
		-3,
		n0,
		_APE,
		{
			[_e]: _c,
			[_hE]: 400
		},
		[_e, _ed],
		[0, 0]
	];
	require_dist_cjs$26.TypeRegistry.for(n0).registerError(AuthorizationPendingException, AuthorizationPendingException$1);
	CreateTokenRequest = [
		3,
		n0,
		_CTR,
		0,
		[
			_cI,
			_cS,
			_gT,
			_dC,
			_co,
			_rT,
			_s,
			_rU,
			_cV
		],
		[
			0,
			[() => ClientSecret, 0],
			0,
			0,
			0,
			[() => RefreshToken, 0],
			64,
			0,
			[() => CodeVerifier, 0]
		]
	];
	CreateTokenResponse = [
		3,
		n0,
		_CTRr,
		0,
		[
			_aT,
			_tT,
			_eI,
			_rT,
			_iT
		],
		[
			[() => AccessToken, 0],
			0,
			1,
			[() => RefreshToken, 0],
			[() => IdToken, 0]
		]
	];
	ExpiredTokenException = [
		-3,
		n0,
		_ETE,
		{
			[_e]: _c,
			[_hE]: 400
		},
		[_e, _ed],
		[0, 0]
	];
	require_dist_cjs$26.TypeRegistry.for(n0).registerError(ExpiredTokenException, ExpiredTokenException$1);
	InternalServerException = [
		-3,
		n0,
		_ISE,
		{
			[_e]: _se,
			[_hE]: 500
		},
		[_e, _ed],
		[0, 0]
	];
	require_dist_cjs$26.TypeRegistry.for(n0).registerError(InternalServerException, InternalServerException$1);
	InvalidClientException = [
		-3,
		n0,
		_ICE,
		{
			[_e]: _c,
			[_hE]: 401
		},
		[_e, _ed],
		[0, 0]
	];
	require_dist_cjs$26.TypeRegistry.for(n0).registerError(InvalidClientException, InvalidClientException$1);
	InvalidGrantException = [
		-3,
		n0,
		_IGE,
		{
			[_e]: _c,
			[_hE]: 400
		},
		[_e, _ed],
		[0, 0]
	];
	require_dist_cjs$26.TypeRegistry.for(n0).registerError(InvalidGrantException, InvalidGrantException$1);
	InvalidRequestException = [
		-3,
		n0,
		_IRE,
		{
			[_e]: _c,
			[_hE]: 400
		},
		[
			_e,
			_r,
			_ed
		],
		[
			0,
			0,
			0
		]
	];
	require_dist_cjs$26.TypeRegistry.for(n0).registerError(InvalidRequestException, InvalidRequestException$1);
	InvalidScopeException = [
		-3,
		n0,
		_ISEn,
		{
			[_e]: _c,
			[_hE]: 400
		},
		[_e, _ed],
		[0, 0]
	];
	require_dist_cjs$26.TypeRegistry.for(n0).registerError(InvalidScopeException, InvalidScopeException$1);
	SlowDownException = [
		-3,
		n0,
		_SDE,
		{
			[_e]: _c,
			[_hE]: 400
		},
		[_e, _ed],
		[0, 0]
	];
	require_dist_cjs$26.TypeRegistry.for(n0).registerError(SlowDownException, SlowDownException$1);
	UnauthorizedClientException = [
		-3,
		n0,
		_UCE,
		{
			[_e]: _c,
			[_hE]: 400
		},
		[_e, _ed],
		[0, 0]
	];
	require_dist_cjs$26.TypeRegistry.for(n0).registerError(UnauthorizedClientException, UnauthorizedClientException$1);
	UnsupportedGrantTypeException = [
		-3,
		n0,
		_UGTE,
		{
			[_e]: _c,
			[_hE]: 400
		},
		[_e, _ed],
		[0, 0]
	];
	require_dist_cjs$26.TypeRegistry.for(n0).registerError(UnsupportedGrantTypeException, UnsupportedGrantTypeException$1);
	SSOOIDCServiceException = [
		-3,
		_sm,
		"SSOOIDCServiceException",
		0,
		[],
		[]
	];
	require_dist_cjs$26.TypeRegistry.for(_sm).registerError(SSOOIDCServiceException, SSOOIDCServiceException$1);
	CreateToken = [
		9,
		n0,
		_CT,
		{ [_h]: [
			"POST",
			"/token",
			200
		] },
		() => CreateTokenRequest,
		() => CreateTokenResponse
	];
}));

//#endregion
//#region ../node_modules/.pnpm/@aws-sdk+nested-clients@3.940.0/node_modules/@aws-sdk/nested-clients/dist-es/submodules/sso-oidc/commands/CreateTokenCommand.js
var import_dist_cjs$1, import_dist_cjs$2, CreateTokenCommand;
var init_CreateTokenCommand = require_chunk.__esmMin((() => {
	import_dist_cjs$1 = require_dist_cjs$25.require_dist_cjs$7();
	import_dist_cjs$2 = require_dist_cjs$26.require_dist_cjs();
	init_EndpointParameters();
	init_schemas_0();
	CreateTokenCommand = class extends import_dist_cjs$2.Command.classBuilder().ep(commonParams).m(function(Command, cs, config, o$1) {
		return [(0, import_dist_cjs$1.getEndpointPlugin)(config, Command.getEndpointParameterInstructions())];
	}).s("AWSSSOOIDCService", "CreateToken", {}).n("SSOOIDCClient", "CreateTokenCommand").sc(CreateToken).build() {};
}));

//#endregion
//#region ../node_modules/.pnpm/@aws-sdk+nested-clients@3.940.0/node_modules/@aws-sdk/nested-clients/dist-es/submodules/sso-oidc/SSOOIDC.js
var import_dist_cjs, commands, SSOOIDC;
var init_SSOOIDC = require_chunk.__esmMin((() => {
	import_dist_cjs = require_dist_cjs$26.require_dist_cjs();
	init_CreateTokenCommand();
	init_SSOOIDCClient();
	commands = { CreateTokenCommand };
	SSOOIDC = class extends SSOOIDCClient {};
	(0, import_dist_cjs.createAggregatedClient)(commands, SSOOIDC);
}));

//#endregion
//#region ../node_modules/.pnpm/@aws-sdk+nested-clients@3.940.0/node_modules/@aws-sdk/nested-clients/dist-es/submodules/sso-oidc/commands/index.js
var init_commands = require_chunk.__esmMin((() => {
	init_CreateTokenCommand();
}));

//#endregion
//#region ../node_modules/.pnpm/@aws-sdk+nested-clients@3.940.0/node_modules/@aws-sdk/nested-clients/dist-es/submodules/sso-oidc/models/enums.js
var init_enums = require_chunk.__esmMin((() => {}));

//#endregion
//#region ../node_modules/.pnpm/@aws-sdk+nested-clients@3.940.0/node_modules/@aws-sdk/nested-clients/dist-es/submodules/sso-oidc/index.js
var init_sso_oidc = require_chunk.__esmMin((() => {
	init_SSOOIDCClient();
	init_SSOOIDC();
	init_commands();
	init_enums();
	init_errors();
}));

//#endregion
init_sso_oidc();
exports.CreateTokenCommand = CreateTokenCommand;
exports.SSOOIDCClient = SSOOIDCClient;