const require_chunk = require('./chunk-CdAKIUsw.js');
const require_dist_cjs$24 = require('./dist-cjs-BawS8oYv.js');
const require_dist_cjs$25 = require('./dist-cjs-B9UsuYCY.js');
const require_dist_cjs$26 = require('./dist-cjs-BMOAUmMP.js');
const require_dist_cjs$27 = require('./dist-cjs-DVzRDdXz.js');
const require_dist_cjs$28 = require('./dist-cjs-CWItNfj0.js');
const require_client = require('./client-BsEbA1K3.js');
const require_package = require('./package-C0chbb9U.js');

//#region ../node_modules/.pnpm/@aws-sdk+nested-clients@3.940.0/node_modules/@aws-sdk/nested-clients/dist-es/submodules/sts/auth/httpAuthSchemeProvider.js
function createAwsAuthSigv4HttpAuthOption(authParameters) {
	return {
		schemeId: "aws.auth#sigv4",
		signingProperties: {
			name: "sts",
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
var import_dist_cjs$36, defaultSTSHttpAuthSchemeParametersProvider, defaultSTSHttpAuthSchemeProvider, resolveStsAuthConfig, resolveHttpAuthSchemeConfig;
var init_httpAuthSchemeProvider = require_chunk.__esmMin((() => {
	require_dist_cjs$25.init_dist_es();
	import_dist_cjs$36 = require_dist_cjs$26.require_dist_cjs$7();
	init_STSClient();
	defaultSTSHttpAuthSchemeParametersProvider = async (config, context, input) => {
		return {
			operation: (0, import_dist_cjs$36.getSmithyContext)(context).operation,
			region: await (0, import_dist_cjs$36.normalizeProvider)(config.region)() || (() => {
				throw new Error("expected `region` to be configured for `aws.auth#sigv4`");
			})()
		};
	};
	defaultSTSHttpAuthSchemeProvider = (authParameters) => {
		const options = [];
		switch (authParameters.operation) {
			case "AssumeRoleWithWebIdentity":
				options.push(createSmithyApiNoAuthHttpAuthOption(authParameters));
				break;
			default: options.push(createAwsAuthSigv4HttpAuthOption(authParameters));
		}
		return options;
	};
	resolveStsAuthConfig = (input) => Object.assign(input, { stsClientCtor: STSClient });
	resolveHttpAuthSchemeConfig = (config) => {
		const config_1 = require_dist_cjs$25.resolveAwsSdkSigV4Config(resolveStsAuthConfig(config));
		return Object.assign(config_1, { authSchemePreference: (0, import_dist_cjs$36.normalizeProvider)(config.authSchemePreference ?? []) });
	};
}));

//#endregion
//#region ../node_modules/.pnpm/@aws-sdk+nested-clients@3.940.0/node_modules/@aws-sdk/nested-clients/dist-es/submodules/sts/endpoint/EndpointParameters.js
var resolveClientEndpointParameters, commonParams;
var init_EndpointParameters = require_chunk.__esmMin((() => {
	resolveClientEndpointParameters = (options) => {
		return Object.assign(options, {
			useDualstackEndpoint: options.useDualstackEndpoint ?? false,
			useFipsEndpoint: options.useFipsEndpoint ?? false,
			useGlobalEndpoint: options.useGlobalEndpoint ?? false,
			defaultSigningName: "sts"
		});
	};
	commonParams = {
		UseGlobalEndpoint: {
			type: "builtInParams",
			name: "useGlobalEndpoint"
		},
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
//#region ../node_modules/.pnpm/@aws-sdk+nested-clients@3.940.0/node_modules/@aws-sdk/nested-clients/dist-es/submodules/sts/endpoint/ruleset.js
var F, G, H, I, J, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z, A, B, C, D, E, _data, ruleSet;
var init_ruleset = require_chunk.__esmMin((() => {
	F = "required", G = "type", H = "fn", I = "argv", J = "ref";
	a = false, b = true, c = "booleanEquals", d = "stringEquals", e = "sigv4", f = "sts", g = "us-east-1", h = "endpoint", i = "https://sts.{Region}.{PartitionResult#dnsSuffix}", j = "tree", k = "error", l = "getAttr", m = {
		[F]: false,
		[G]: "string"
	}, n = {
		[F]: true,
		"default": false,
		[G]: "boolean"
	}, o = { [J]: "Endpoint" }, p = {
		[H]: "isSet",
		[I]: [{ [J]: "Region" }]
	}, q = { [J]: "Region" }, r = {
		[H]: "aws.partition",
		[I]: [q],
		"assign": "PartitionResult"
	}, s = { [J]: "UseFIPS" }, t = { [J]: "UseDualStack" }, u = {
		"url": "https://sts.amazonaws.com",
		"properties": { "authSchemes": [{
			"name": e,
			"signingName": f,
			"signingRegion": g
		}] },
		"headers": {}
	}, v = {}, w = {
		"conditions": [{
			[H]: d,
			[I]: [q, "aws-global"]
		}],
		[h]: u,
		[G]: h
	}, x = {
		[H]: c,
		[I]: [s, true]
	}, y = {
		[H]: c,
		[I]: [t, true]
	}, z = {
		[H]: l,
		[I]: [{ [J]: "PartitionResult" }, "supportsFIPS"]
	}, A = { [J]: "PartitionResult" }, B = {
		[H]: c,
		[I]: [true, {
			[H]: l,
			[I]: [A, "supportsDualStack"]
		}]
	}, C = [{
		[H]: "isSet",
		[I]: [o]
	}], D = [x], E = [y];
	_data = {
		version: "1.0",
		parameters: {
			Region: m,
			UseDualStack: n,
			UseFIPS: n,
			Endpoint: m,
			UseGlobalEndpoint: n
		},
		rules: [
			{
				conditions: [
					{
						[H]: c,
						[I]: [{ [J]: "UseGlobalEndpoint" }, b]
					},
					{
						[H]: "not",
						[I]: C
					},
					p,
					r,
					{
						[H]: c,
						[I]: [s, a]
					},
					{
						[H]: c,
						[I]: [t, a]
					}
				],
				rules: [
					{
						conditions: [{
							[H]: d,
							[I]: [q, "ap-northeast-1"]
						}],
						endpoint: u,
						[G]: h
					},
					{
						conditions: [{
							[H]: d,
							[I]: [q, "ap-south-1"]
						}],
						endpoint: u,
						[G]: h
					},
					{
						conditions: [{
							[H]: d,
							[I]: [q, "ap-southeast-1"]
						}],
						endpoint: u,
						[G]: h
					},
					{
						conditions: [{
							[H]: d,
							[I]: [q, "ap-southeast-2"]
						}],
						endpoint: u,
						[G]: h
					},
					w,
					{
						conditions: [{
							[H]: d,
							[I]: [q, "ca-central-1"]
						}],
						endpoint: u,
						[G]: h
					},
					{
						conditions: [{
							[H]: d,
							[I]: [q, "eu-central-1"]
						}],
						endpoint: u,
						[G]: h
					},
					{
						conditions: [{
							[H]: d,
							[I]: [q, "eu-north-1"]
						}],
						endpoint: u,
						[G]: h
					},
					{
						conditions: [{
							[H]: d,
							[I]: [q, "eu-west-1"]
						}],
						endpoint: u,
						[G]: h
					},
					{
						conditions: [{
							[H]: d,
							[I]: [q, "eu-west-2"]
						}],
						endpoint: u,
						[G]: h
					},
					{
						conditions: [{
							[H]: d,
							[I]: [q, "eu-west-3"]
						}],
						endpoint: u,
						[G]: h
					},
					{
						conditions: [{
							[H]: d,
							[I]: [q, "sa-east-1"]
						}],
						endpoint: u,
						[G]: h
					},
					{
						conditions: [{
							[H]: d,
							[I]: [q, g]
						}],
						endpoint: u,
						[G]: h
					},
					{
						conditions: [{
							[H]: d,
							[I]: [q, "us-east-2"]
						}],
						endpoint: u,
						[G]: h
					},
					{
						conditions: [{
							[H]: d,
							[I]: [q, "us-west-1"]
						}],
						endpoint: u,
						[G]: h
					},
					{
						conditions: [{
							[H]: d,
							[I]: [q, "us-west-2"]
						}],
						endpoint: u,
						[G]: h
					},
					{
						endpoint: {
							url: i,
							properties: { authSchemes: [{
								name: e,
								signingName: f,
								signingRegion: "{Region}"
							}] },
							headers: v
						},
						[G]: h
					}
				],
				[G]: j
			},
			{
				conditions: C,
				rules: [
					{
						conditions: D,
						error: "Invalid Configuration: FIPS and custom endpoint are not supported",
						[G]: k
					},
					{
						conditions: E,
						error: "Invalid Configuration: Dualstack and custom endpoint are not supported",
						[G]: k
					},
					{
						endpoint: {
							url: o,
							properties: v,
							headers: v
						},
						[G]: h
					}
				],
				[G]: j
			},
			{
				conditions: [p],
				rules: [{
					conditions: [r],
					rules: [
						{
							conditions: [x, y],
							rules: [{
								conditions: [{
									[H]: c,
									[I]: [b, z]
								}, B],
								rules: [{
									endpoint: {
										url: "https://sts-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
										properties: v,
										headers: v
									},
									[G]: h
								}],
								[G]: j
							}, {
								error: "FIPS and DualStack are enabled, but this partition does not support one or both",
								[G]: k
							}],
							[G]: j
						},
						{
							conditions: D,
							rules: [{
								conditions: [{
									[H]: c,
									[I]: [z, b]
								}],
								rules: [{
									conditions: [{
										[H]: d,
										[I]: [{
											[H]: l,
											[I]: [A, "name"]
										}, "aws-us-gov"]
									}],
									endpoint: {
										url: "https://sts.{Region}.amazonaws.com",
										properties: v,
										headers: v
									},
									[G]: h
								}, {
									endpoint: {
										url: "https://sts-fips.{Region}.{PartitionResult#dnsSuffix}",
										properties: v,
										headers: v
									},
									[G]: h
								}],
								[G]: j
							}, {
								error: "FIPS is enabled but this partition does not support FIPS",
								[G]: k
							}],
							[G]: j
						},
						{
							conditions: E,
							rules: [{
								conditions: [B],
								rules: [{
									endpoint: {
										url: "https://sts.{Region}.{PartitionResult#dualStackDnsSuffix}",
										properties: v,
										headers: v
									},
									[G]: h
								}],
								[G]: j
							}, {
								error: "DualStack is enabled but this partition does not support DualStack",
								[G]: k
							}],
							[G]: j
						},
						w,
						{
							endpoint: {
								url: i,
								properties: v,
								headers: v
							},
							[G]: h
						}
					],
					[G]: j
				}],
				[G]: j
			},
			{
				error: "Invalid Configuration: Missing Region",
				[G]: k
			}
		]
	};
	ruleSet = _data;
}));

//#endregion
//#region ../node_modules/.pnpm/@aws-sdk+nested-clients@3.940.0/node_modules/@aws-sdk/nested-clients/dist-es/submodules/sts/endpoint/endpointResolver.js
var import_dist_cjs$34, import_dist_cjs$35, cache, defaultEndpointResolver;
var init_endpointResolver = require_chunk.__esmMin((() => {
	import_dist_cjs$34 = require_dist_cjs$25.require_dist_cjs$11();
	import_dist_cjs$35 = require_dist_cjs$25.require_dist_cjs$12();
	init_ruleset();
	cache = new import_dist_cjs$35.EndpointCache({
		size: 50,
		params: [
			"Endpoint",
			"Region",
			"UseDualStack",
			"UseFIPS",
			"UseGlobalEndpoint"
		]
	});
	defaultEndpointResolver = (endpointParams, context = {}) => {
		return cache.get(endpointParams, () => (0, import_dist_cjs$35.resolveEndpoint)(ruleSet, {
			endpointParams,
			logger: context.logger
		}));
	};
	import_dist_cjs$35.customEndpointFunctions.aws = import_dist_cjs$34.awsEndpointFunctions;
}));

//#endregion
//#region ../node_modules/.pnpm/@aws-sdk+nested-clients@3.940.0/node_modules/@aws-sdk/nested-clients/dist-es/submodules/sts/runtimeConfig.shared.js
var import_dist_cjs$30, import_dist_cjs$31, import_dist_cjs$32, import_dist_cjs$33, getRuntimeConfig$1;
var init_runtimeConfig_shared = require_chunk.__esmMin((() => {
	require_dist_cjs$25.init_dist_es();
	require_dist_cjs$25.init_protocols();
	require_dist_cjs$25.init_dist_es$1();
	import_dist_cjs$30 = require_dist_cjs$26.require_dist_cjs();
	import_dist_cjs$31 = require_dist_cjs$28.require_dist_cjs$1();
	import_dist_cjs$32 = require_dist_cjs$26.require_dist_cjs$6();
	import_dist_cjs$33 = require_dist_cjs$27.require_dist_cjs();
	init_httpAuthSchemeProvider();
	init_endpointResolver();
	getRuntimeConfig$1 = (config) => {
		return {
			apiVersion: "2011-06-15",
			base64Decoder: config?.base64Decoder ?? import_dist_cjs$32.fromBase64,
			base64Encoder: config?.base64Encoder ?? import_dist_cjs$32.toBase64,
			disableHostPrefix: config?.disableHostPrefix ?? false,
			endpointProvider: config?.endpointProvider ?? defaultEndpointResolver,
			extensions: config?.extensions ?? [],
			httpAuthSchemeProvider: config?.httpAuthSchemeProvider ?? defaultSTSHttpAuthSchemeProvider,
			httpAuthSchemes: config?.httpAuthSchemes ?? [{
				schemeId: "aws.auth#sigv4",
				identityProvider: (ipc) => ipc.getIdentityProvider("aws.auth#sigv4"),
				signer: new require_dist_cjs$25.AwsSdkSigV4Signer()
			}, {
				schemeId: "smithy.api#noAuth",
				identityProvider: (ipc) => ipc.getIdentityProvider("smithy.api#noAuth") || (async () => ({})),
				signer: new require_dist_cjs$25.NoAuthSigner()
			}],
			logger: config?.logger ?? new import_dist_cjs$30.NoOpLogger(),
			protocol: config?.protocol ?? new require_dist_cjs$25.AwsQueryProtocol({
				defaultNamespace: "com.amazonaws.sts",
				xmlNamespace: "https://sts.amazonaws.com/doc/2011-06-15/",
				version: "2011-06-15"
			}),
			serviceId: config?.serviceId ?? "STS",
			urlParser: config?.urlParser ?? import_dist_cjs$31.parseUrl,
			utf8Decoder: config?.utf8Decoder ?? import_dist_cjs$33.fromUtf8,
			utf8Encoder: config?.utf8Encoder ?? import_dist_cjs$33.toUtf8
		};
	};
}));

//#endregion
//#region ../node_modules/.pnpm/@aws-sdk+nested-clients@3.940.0/node_modules/@aws-sdk/nested-clients/dist-es/submodules/sts/runtimeConfig.js
var import_dist_cjs$19, import_dist_cjs$20, import_dist_cjs$21, import_dist_cjs$22, import_dist_cjs$23, import_dist_cjs$24, import_dist_cjs$25, import_dist_cjs$26, import_dist_cjs$27, import_dist_cjs$28, import_dist_cjs$29, getRuntimeConfig;
var init_runtimeConfig = require_chunk.__esmMin((() => {
	require_dist_cjs$25.init_dist_es();
	import_dist_cjs$19 = require_dist_cjs$25.require_dist_cjs$4();
	import_dist_cjs$20 = require_dist_cjs$25.require_dist_cjs$9();
	require_dist_cjs$25.init_dist_es$1();
	import_dist_cjs$21 = require_dist_cjs$25.require_dist_cjs$3();
	import_dist_cjs$22 = require_dist_cjs$25.require_dist_cjs$5();
	import_dist_cjs$23 = require_dist_cjs$28.require_dist_cjs();
	import_dist_cjs$24 = require_dist_cjs$26.require_dist_cjs$4();
	import_dist_cjs$25 = require_dist_cjs$25.require_dist_cjs$2();
	import_dist_cjs$26 = require_dist_cjs$25.require_dist_cjs$6();
	init_runtimeConfig_shared();
	import_dist_cjs$27 = require_dist_cjs$26.require_dist_cjs();
	import_dist_cjs$28 = require_dist_cjs$25.require_dist_cjs$1();
	import_dist_cjs$29 = require_dist_cjs$26.require_dist_cjs();
	getRuntimeConfig = (config) => {
		(0, import_dist_cjs$29.emitWarningIfUnsupportedVersion)(process.version);
		const defaultsMode = (0, import_dist_cjs$28.resolveDefaultsModeConfig)(config);
		const defaultConfigProvider = () => defaultsMode().then(import_dist_cjs$27.loadConfigsForDefaultMode);
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
			authSchemePreference: config?.authSchemePreference ?? (0, import_dist_cjs$23.loadConfig)(require_dist_cjs$25.NODE_AUTH_SCHEME_PREFERENCE_OPTIONS, loaderConfig),
			bodyLengthChecker: config?.bodyLengthChecker ?? import_dist_cjs$25.calculateBodyLength,
			defaultUserAgentProvider: config?.defaultUserAgentProvider ?? (0, import_dist_cjs$19.createDefaultUserAgentProvider)({
				serviceId: clientSharedValues.serviceId,
				clientVersion: require_package.version
			}),
			httpAuthSchemes: config?.httpAuthSchemes ?? [{
				schemeId: "aws.auth#sigv4",
				identityProvider: (ipc) => ipc.getIdentityProvider("aws.auth#sigv4") || (async (idProps) => await config.credentialDefaultProvider(idProps?.__config || {})()),
				signer: new require_dist_cjs$25.AwsSdkSigV4Signer()
			}, {
				schemeId: "smithy.api#noAuth",
				identityProvider: (ipc) => ipc.getIdentityProvider("smithy.api#noAuth") || (async () => ({})),
				signer: new require_dist_cjs$25.NoAuthSigner()
			}],
			maxAttempts: config?.maxAttempts ?? (0, import_dist_cjs$23.loadConfig)(import_dist_cjs$22.NODE_MAX_ATTEMPT_CONFIG_OPTIONS, config),
			region: config?.region ?? (0, import_dist_cjs$23.loadConfig)(import_dist_cjs$20.NODE_REGION_CONFIG_OPTIONS, {
				...import_dist_cjs$20.NODE_REGION_CONFIG_FILE_OPTIONS,
				...loaderConfig
			}),
			requestHandler: import_dist_cjs$24.NodeHttpHandler.create(config?.requestHandler ?? defaultConfigProvider),
			retryMode: config?.retryMode ?? (0, import_dist_cjs$23.loadConfig)({
				...import_dist_cjs$22.NODE_RETRY_MODE_CONFIG_OPTIONS,
				default: async () => (await defaultConfigProvider()).retryMode || import_dist_cjs$26.DEFAULT_RETRY_MODE
			}, config),
			sha256: config?.sha256 ?? import_dist_cjs$21.Hash.bind(null, "sha256"),
			streamCollector: config?.streamCollector ?? import_dist_cjs$24.streamCollector,
			useDualstackEndpoint: config?.useDualstackEndpoint ?? (0, import_dist_cjs$23.loadConfig)(import_dist_cjs$20.NODE_USE_DUALSTACK_ENDPOINT_CONFIG_OPTIONS, loaderConfig),
			useFipsEndpoint: config?.useFipsEndpoint ?? (0, import_dist_cjs$23.loadConfig)(import_dist_cjs$20.NODE_USE_FIPS_ENDPOINT_CONFIG_OPTIONS, loaderConfig),
			userAgentAppId: config?.userAgentAppId ?? (0, import_dist_cjs$23.loadConfig)(import_dist_cjs$19.NODE_APP_ID_CONFIG_OPTIONS, loaderConfig)
		};
	};
}));

//#endregion
//#region ../node_modules/.pnpm/@aws-sdk+nested-clients@3.940.0/node_modules/@aws-sdk/nested-clients/dist-es/submodules/sts/auth/httpAuthExtensionConfiguration.js
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
//#region ../node_modules/.pnpm/@aws-sdk+nested-clients@3.940.0/node_modules/@aws-sdk/nested-clients/dist-es/submodules/sts/runtimeExtensions.js
var import_dist_cjs$16, import_dist_cjs$17, import_dist_cjs$18, resolveRuntimeExtensions;
var init_runtimeExtensions = require_chunk.__esmMin((() => {
	import_dist_cjs$16 = require_dist_cjs$25.require_dist_cjs();
	import_dist_cjs$17 = require_dist_cjs$24.require_dist_cjs();
	import_dist_cjs$18 = require_dist_cjs$26.require_dist_cjs();
	init_httpAuthExtensionConfiguration();
	resolveRuntimeExtensions = (runtimeConfig, extensions) => {
		const extensionConfiguration = Object.assign((0, import_dist_cjs$16.getAwsRegionExtensionConfiguration)(runtimeConfig), (0, import_dist_cjs$18.getDefaultExtensionConfiguration)(runtimeConfig), (0, import_dist_cjs$17.getHttpHandlerExtensionConfiguration)(runtimeConfig), getHttpAuthExtensionConfiguration(runtimeConfig));
		extensions.forEach((extension) => extension.configure(extensionConfiguration));
		return Object.assign(runtimeConfig, (0, import_dist_cjs$16.resolveAwsRegionExtensionConfiguration)(extensionConfiguration), (0, import_dist_cjs$18.resolveDefaultRuntimeConfig)(extensionConfiguration), (0, import_dist_cjs$17.resolveHttpHandlerRuntimeConfig)(extensionConfiguration), resolveHttpAuthRuntimeConfig(extensionConfiguration));
	};
}));

//#endregion
//#region ../node_modules/.pnpm/@aws-sdk+nested-clients@3.940.0/node_modules/@aws-sdk/nested-clients/dist-es/submodules/sts/STSClient.js
var import_dist_cjs$7, import_dist_cjs$8, import_dist_cjs$9, import_dist_cjs$10, import_dist_cjs$11, import_dist_cjs$12, import_dist_cjs$13, import_dist_cjs$14, import_dist_cjs$15, STSClient;
var init_STSClient = require_chunk.__esmMin((() => {
	import_dist_cjs$7 = require_dist_cjs$25.require_dist_cjs$15();
	import_dist_cjs$8 = require_dist_cjs$25.require_dist_cjs$14();
	import_dist_cjs$9 = require_dist_cjs$25.require_dist_cjs$13();
	import_dist_cjs$10 = require_dist_cjs$25.require_dist_cjs$10();
	import_dist_cjs$11 = require_dist_cjs$25.require_dist_cjs$9();
	require_dist_cjs$25.init_dist_es$1();
	require_dist_cjs$26.init_schema();
	import_dist_cjs$12 = require_dist_cjs$25.require_dist_cjs$8();
	import_dist_cjs$13 = require_dist_cjs$25.require_dist_cjs$7();
	import_dist_cjs$14 = require_dist_cjs$25.require_dist_cjs$5();
	import_dist_cjs$15 = require_dist_cjs$26.require_dist_cjs();
	init_httpAuthSchemeProvider();
	init_EndpointParameters();
	init_runtimeConfig();
	init_runtimeExtensions();
	STSClient = class extends import_dist_cjs$15.Client {
		config;
		constructor(...[configuration]) {
			const _config_0 = getRuntimeConfig(configuration || {});
			super(_config_0);
			this.initConfig = _config_0;
			this.config = resolveRuntimeExtensions(resolveHttpAuthSchemeConfig((0, import_dist_cjs$13.resolveEndpointConfig)((0, import_dist_cjs$7.resolveHostHeaderConfig)((0, import_dist_cjs$11.resolveRegionConfig)((0, import_dist_cjs$14.resolveRetryConfig)((0, import_dist_cjs$10.resolveUserAgentConfig)(resolveClientEndpointParameters(_config_0))))))), configuration?.extensions || []);
			this.middlewareStack.use(require_dist_cjs$26.getSchemaSerdePlugin(this.config));
			this.middlewareStack.use((0, import_dist_cjs$10.getUserAgentPlugin)(this.config));
			this.middlewareStack.use((0, import_dist_cjs$14.getRetryPlugin)(this.config));
			this.middlewareStack.use((0, import_dist_cjs$12.getContentLengthPlugin)(this.config));
			this.middlewareStack.use((0, import_dist_cjs$7.getHostHeaderPlugin)(this.config));
			this.middlewareStack.use((0, import_dist_cjs$8.getLoggerPlugin)(this.config));
			this.middlewareStack.use((0, import_dist_cjs$9.getRecursionDetectionPlugin)(this.config));
			this.middlewareStack.use(require_dist_cjs$25.getHttpAuthSchemeEndpointRuleSetPlugin(this.config, {
				httpAuthSchemeParametersProvider: defaultSTSHttpAuthSchemeParametersProvider,
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
//#region ../node_modules/.pnpm/@aws-sdk+nested-clients@3.940.0/node_modules/@aws-sdk/nested-clients/dist-es/submodules/sts/models/STSServiceException.js
var import_dist_cjs$6, STSServiceException$1;
var init_STSServiceException = require_chunk.__esmMin((() => {
	import_dist_cjs$6 = require_dist_cjs$26.require_dist_cjs();
	STSServiceException$1 = class STSServiceException$1 extends import_dist_cjs$6.ServiceException {
		constructor(options) {
			super(options);
			Object.setPrototypeOf(this, STSServiceException$1.prototype);
		}
	};
}));

//#endregion
//#region ../node_modules/.pnpm/@aws-sdk+nested-clients@3.940.0/node_modules/@aws-sdk/nested-clients/dist-es/submodules/sts/models/errors.js
var ExpiredTokenException$1, MalformedPolicyDocumentException$1, PackedPolicyTooLargeException$1, RegionDisabledException$1, IDPRejectedClaimException$1, InvalidIdentityTokenException$1, IDPCommunicationErrorException$1;
var init_errors = require_chunk.__esmMin((() => {
	init_STSServiceException();
	ExpiredTokenException$1 = class ExpiredTokenException$1 extends STSServiceException$1 {
		name = "ExpiredTokenException";
		$fault = "client";
		constructor(opts) {
			super({
				name: "ExpiredTokenException",
				$fault: "client",
				...opts
			});
			Object.setPrototypeOf(this, ExpiredTokenException$1.prototype);
		}
	};
	MalformedPolicyDocumentException$1 = class MalformedPolicyDocumentException$1 extends STSServiceException$1 {
		name = "MalformedPolicyDocumentException";
		$fault = "client";
		constructor(opts) {
			super({
				name: "MalformedPolicyDocumentException",
				$fault: "client",
				...opts
			});
			Object.setPrototypeOf(this, MalformedPolicyDocumentException$1.prototype);
		}
	};
	PackedPolicyTooLargeException$1 = class PackedPolicyTooLargeException$1 extends STSServiceException$1 {
		name = "PackedPolicyTooLargeException";
		$fault = "client";
		constructor(opts) {
			super({
				name: "PackedPolicyTooLargeException",
				$fault: "client",
				...opts
			});
			Object.setPrototypeOf(this, PackedPolicyTooLargeException$1.prototype);
		}
	};
	RegionDisabledException$1 = class RegionDisabledException$1 extends STSServiceException$1 {
		name = "RegionDisabledException";
		$fault = "client";
		constructor(opts) {
			super({
				name: "RegionDisabledException",
				$fault: "client",
				...opts
			});
			Object.setPrototypeOf(this, RegionDisabledException$1.prototype);
		}
	};
	IDPRejectedClaimException$1 = class IDPRejectedClaimException$1 extends STSServiceException$1 {
		name = "IDPRejectedClaimException";
		$fault = "client";
		constructor(opts) {
			super({
				name: "IDPRejectedClaimException",
				$fault: "client",
				...opts
			});
			Object.setPrototypeOf(this, IDPRejectedClaimException$1.prototype);
		}
	};
	InvalidIdentityTokenException$1 = class InvalidIdentityTokenException$1 extends STSServiceException$1 {
		name = "InvalidIdentityTokenException";
		$fault = "client";
		constructor(opts) {
			super({
				name: "InvalidIdentityTokenException",
				$fault: "client",
				...opts
			});
			Object.setPrototypeOf(this, InvalidIdentityTokenException$1.prototype);
		}
	};
	IDPCommunicationErrorException$1 = class IDPCommunicationErrorException$1 extends STSServiceException$1 {
		name = "IDPCommunicationErrorException";
		$fault = "client";
		constructor(opts) {
			super({
				name: "IDPCommunicationErrorException",
				$fault: "client",
				...opts
			});
			Object.setPrototypeOf(this, IDPCommunicationErrorException$1.prototype);
		}
	};
}));

//#endregion
//#region ../node_modules/.pnpm/@aws-sdk+nested-clients@3.940.0/node_modules/@aws-sdk/nested-clients/dist-es/submodules/sts/schemas/schemas_0.js
var _A, _AKI, _AR, _ARI, _ARR, _ARRs, _ARU, _ARWWI, _ARWWIR, _ARWWIRs, _Au, _C, _CA, _DS, _E, _EI, _ETE, _IDPCEE, _IDPRCE, _IITE, _K, _MPDE, _P, _PA, _PAr, _PC, _PCLT, _PCr, _PDT, _PI, _PPS, _PPTLE, _Pr, _RA, _RDE, _RSN, _SAK, _SFWIT, _SI, _SN, _ST, _T, _TC, _TTK, _Ta, _V, _WIT, _a, _aKST, _aQE, _c, _cTT, _e, _hE, _m, _pDLT, _s, _tLT, n0, accessKeySecretType, clientTokenType, AssumedRoleUser, AssumeRoleRequest, AssumeRoleResponse, AssumeRoleWithWebIdentityRequest, AssumeRoleWithWebIdentityResponse, Credentials, ExpiredTokenException, IDPCommunicationErrorException, IDPRejectedClaimException, InvalidIdentityTokenException, MalformedPolicyDocumentException, PackedPolicyTooLargeException, PolicyDescriptorType, ProvidedContext, RegionDisabledException, Tag, STSServiceException, policyDescriptorListType, ProvidedContextsListType, tagListType, AssumeRole, AssumeRoleWithWebIdentity;
var init_schemas_0 = require_chunk.__esmMin((() => {
	require_dist_cjs$26.init_schema();
	init_errors();
	init_STSServiceException();
	_A = "Arn";
	_AKI = "AccessKeyId";
	_AR = "AssumeRole";
	_ARI = "AssumedRoleId";
	_ARR = "AssumeRoleRequest";
	_ARRs = "AssumeRoleResponse";
	_ARU = "AssumedRoleUser";
	_ARWWI = "AssumeRoleWithWebIdentity";
	_ARWWIR = "AssumeRoleWithWebIdentityRequest";
	_ARWWIRs = "AssumeRoleWithWebIdentityResponse";
	_Au = "Audience";
	_C = "Credentials";
	_CA = "ContextAssertion";
	_DS = "DurationSeconds";
	_E = "Expiration";
	_EI = "ExternalId";
	_ETE = "ExpiredTokenException";
	_IDPCEE = "IDPCommunicationErrorException";
	_IDPRCE = "IDPRejectedClaimException";
	_IITE = "InvalidIdentityTokenException";
	_K = "Key";
	_MPDE = "MalformedPolicyDocumentException";
	_P = "Policy";
	_PA = "PolicyArns";
	_PAr = "ProviderArn";
	_PC = "ProvidedContexts";
	_PCLT = "ProvidedContextsListType";
	_PCr = "ProvidedContext";
	_PDT = "PolicyDescriptorType";
	_PI = "ProviderId";
	_PPS = "PackedPolicySize";
	_PPTLE = "PackedPolicyTooLargeException";
	_Pr = "Provider";
	_RA = "RoleArn";
	_RDE = "RegionDisabledException";
	_RSN = "RoleSessionName";
	_SAK = "SecretAccessKey";
	_SFWIT = "SubjectFromWebIdentityToken";
	_SI = "SourceIdentity";
	_SN = "SerialNumber";
	_ST = "SessionToken";
	_T = "Tags";
	_TC = "TokenCode";
	_TTK = "TransitiveTagKeys";
	_Ta = "Tag";
	_V = "Value";
	_WIT = "WebIdentityToken";
	_a = "arn";
	_aKST = "accessKeySecretType";
	_aQE = "awsQueryError";
	_c = "client";
	_cTT = "clientTokenType";
	_e = "error";
	_hE = "httpError";
	_m = "message";
	_pDLT = "policyDescriptorListType";
	_s = "smithy.ts.sdk.synthetic.com.amazonaws.sts";
	_tLT = "tagListType";
	n0 = "com.amazonaws.sts";
	accessKeySecretType = [
		0,
		n0,
		_aKST,
		8,
		0
	];
	clientTokenType = [
		0,
		n0,
		_cTT,
		8,
		0
	];
	AssumedRoleUser = [
		3,
		n0,
		_ARU,
		0,
		[_ARI, _A],
		[0, 0]
	];
	AssumeRoleRequest = [
		3,
		n0,
		_ARR,
		0,
		[
			_RA,
			_RSN,
			_PA,
			_P,
			_DS,
			_T,
			_TTK,
			_EI,
			_SN,
			_TC,
			_SI,
			_PC
		],
		[
			0,
			0,
			() => policyDescriptorListType,
			0,
			1,
			() => tagListType,
			64,
			0,
			0,
			0,
			0,
			() => ProvidedContextsListType
		]
	];
	AssumeRoleResponse = [
		3,
		n0,
		_ARRs,
		0,
		[
			_C,
			_ARU,
			_PPS,
			_SI
		],
		[
			[() => Credentials, 0],
			() => AssumedRoleUser,
			1,
			0
		]
	];
	AssumeRoleWithWebIdentityRequest = [
		3,
		n0,
		_ARWWIR,
		0,
		[
			_RA,
			_RSN,
			_WIT,
			_PI,
			_PA,
			_P,
			_DS
		],
		[
			0,
			0,
			[() => clientTokenType, 0],
			0,
			() => policyDescriptorListType,
			0,
			1
		]
	];
	AssumeRoleWithWebIdentityResponse = [
		3,
		n0,
		_ARWWIRs,
		0,
		[
			_C,
			_SFWIT,
			_ARU,
			_PPS,
			_Pr,
			_Au,
			_SI
		],
		[
			[() => Credentials, 0],
			0,
			() => AssumedRoleUser,
			1,
			0,
			0,
			0
		]
	];
	Credentials = [
		3,
		n0,
		_C,
		0,
		[
			_AKI,
			_SAK,
			_ST,
			_E
		],
		[
			0,
			[() => accessKeySecretType, 0],
			0,
			4
		]
	];
	ExpiredTokenException = [
		-3,
		n0,
		_ETE,
		{
			[_e]: _c,
			[_hE]: 400,
			[_aQE]: [`ExpiredTokenException`, 400]
		},
		[_m],
		[0]
	];
	require_dist_cjs$26.TypeRegistry.for(n0).registerError(ExpiredTokenException, ExpiredTokenException$1);
	IDPCommunicationErrorException = [
		-3,
		n0,
		_IDPCEE,
		{
			[_e]: _c,
			[_hE]: 400,
			[_aQE]: [`IDPCommunicationError`, 400]
		},
		[_m],
		[0]
	];
	require_dist_cjs$26.TypeRegistry.for(n0).registerError(IDPCommunicationErrorException, IDPCommunicationErrorException$1);
	IDPRejectedClaimException = [
		-3,
		n0,
		_IDPRCE,
		{
			[_e]: _c,
			[_hE]: 403,
			[_aQE]: [`IDPRejectedClaim`, 403]
		},
		[_m],
		[0]
	];
	require_dist_cjs$26.TypeRegistry.for(n0).registerError(IDPRejectedClaimException, IDPRejectedClaimException$1);
	InvalidIdentityTokenException = [
		-3,
		n0,
		_IITE,
		{
			[_e]: _c,
			[_hE]: 400,
			[_aQE]: [`InvalidIdentityToken`, 400]
		},
		[_m],
		[0]
	];
	require_dist_cjs$26.TypeRegistry.for(n0).registerError(InvalidIdentityTokenException, InvalidIdentityTokenException$1);
	MalformedPolicyDocumentException = [
		-3,
		n0,
		_MPDE,
		{
			[_e]: _c,
			[_hE]: 400,
			[_aQE]: [`MalformedPolicyDocument`, 400]
		},
		[_m],
		[0]
	];
	require_dist_cjs$26.TypeRegistry.for(n0).registerError(MalformedPolicyDocumentException, MalformedPolicyDocumentException$1);
	PackedPolicyTooLargeException = [
		-3,
		n0,
		_PPTLE,
		{
			[_e]: _c,
			[_hE]: 400,
			[_aQE]: [`PackedPolicyTooLarge`, 400]
		},
		[_m],
		[0]
	];
	require_dist_cjs$26.TypeRegistry.for(n0).registerError(PackedPolicyTooLargeException, PackedPolicyTooLargeException$1);
	PolicyDescriptorType = [
		3,
		n0,
		_PDT,
		0,
		[_a],
		[0]
	];
	ProvidedContext = [
		3,
		n0,
		_PCr,
		0,
		[_PAr, _CA],
		[0, 0]
	];
	RegionDisabledException = [
		-3,
		n0,
		_RDE,
		{
			[_e]: _c,
			[_hE]: 403,
			[_aQE]: [`RegionDisabledException`, 403]
		},
		[_m],
		[0]
	];
	require_dist_cjs$26.TypeRegistry.for(n0).registerError(RegionDisabledException, RegionDisabledException$1);
	Tag = [
		3,
		n0,
		_Ta,
		0,
		[_K, _V],
		[0, 0]
	];
	STSServiceException = [
		-3,
		_s,
		"STSServiceException",
		0,
		[],
		[]
	];
	require_dist_cjs$26.TypeRegistry.for(_s).registerError(STSServiceException, STSServiceException$1);
	policyDescriptorListType = [
		1,
		n0,
		_pDLT,
		0,
		() => PolicyDescriptorType
	];
	ProvidedContextsListType = [
		1,
		n0,
		_PCLT,
		0,
		() => ProvidedContext
	];
	tagListType = [
		1,
		n0,
		_tLT,
		0,
		() => Tag
	];
	AssumeRole = [
		9,
		n0,
		_AR,
		0,
		() => AssumeRoleRequest,
		() => AssumeRoleResponse
	];
	AssumeRoleWithWebIdentity = [
		9,
		n0,
		_ARWWI,
		0,
		() => AssumeRoleWithWebIdentityRequest,
		() => AssumeRoleWithWebIdentityResponse
	];
}));

//#endregion
//#region ../node_modules/.pnpm/@aws-sdk+nested-clients@3.940.0/node_modules/@aws-sdk/nested-clients/dist-es/submodules/sts/commands/AssumeRoleCommand.js
var import_dist_cjs$4, import_dist_cjs$5, AssumeRoleCommand;
var init_AssumeRoleCommand = require_chunk.__esmMin((() => {
	import_dist_cjs$4 = require_dist_cjs$25.require_dist_cjs$7();
	import_dist_cjs$5 = require_dist_cjs$26.require_dist_cjs();
	init_EndpointParameters();
	init_schemas_0();
	AssumeRoleCommand = class extends import_dist_cjs$5.Command.classBuilder().ep(commonParams).m(function(Command, cs, config, o$1) {
		return [(0, import_dist_cjs$4.getEndpointPlugin)(config, Command.getEndpointParameterInstructions())];
	}).s("AWSSecurityTokenServiceV20110615", "AssumeRole", {}).n("STSClient", "AssumeRoleCommand").sc(AssumeRole).build() {};
}));

//#endregion
//#region ../node_modules/.pnpm/@aws-sdk+nested-clients@3.940.0/node_modules/@aws-sdk/nested-clients/dist-es/submodules/sts/commands/AssumeRoleWithWebIdentityCommand.js
var import_dist_cjs$2, import_dist_cjs$3, AssumeRoleWithWebIdentityCommand;
var init_AssumeRoleWithWebIdentityCommand = require_chunk.__esmMin((() => {
	import_dist_cjs$2 = require_dist_cjs$25.require_dist_cjs$7();
	import_dist_cjs$3 = require_dist_cjs$26.require_dist_cjs();
	init_EndpointParameters();
	init_schemas_0();
	AssumeRoleWithWebIdentityCommand = class extends import_dist_cjs$3.Command.classBuilder().ep(commonParams).m(function(Command, cs, config, o$1) {
		return [(0, import_dist_cjs$2.getEndpointPlugin)(config, Command.getEndpointParameterInstructions())];
	}).s("AWSSecurityTokenServiceV20110615", "AssumeRoleWithWebIdentity", {}).n("STSClient", "AssumeRoleWithWebIdentityCommand").sc(AssumeRoleWithWebIdentity).build() {};
}));

//#endregion
//#region ../node_modules/.pnpm/@aws-sdk+nested-clients@3.940.0/node_modules/@aws-sdk/nested-clients/dist-es/submodules/sts/STS.js
var import_dist_cjs$1, commands, STS;
var init_STS = require_chunk.__esmMin((() => {
	import_dist_cjs$1 = require_dist_cjs$26.require_dist_cjs();
	init_AssumeRoleCommand();
	init_AssumeRoleWithWebIdentityCommand();
	init_STSClient();
	commands = {
		AssumeRoleCommand,
		AssumeRoleWithWebIdentityCommand
	};
	STS = class extends STSClient {};
	(0, import_dist_cjs$1.createAggregatedClient)(commands, STS);
}));

//#endregion
//#region ../node_modules/.pnpm/@aws-sdk+nested-clients@3.940.0/node_modules/@aws-sdk/nested-clients/dist-es/submodules/sts/commands/index.js
var init_commands = require_chunk.__esmMin((() => {
	init_AssumeRoleCommand();
	init_AssumeRoleWithWebIdentityCommand();
}));

//#endregion
//#region ../node_modules/.pnpm/@aws-sdk+nested-clients@3.940.0/node_modules/@aws-sdk/nested-clients/dist-es/submodules/sts/defaultStsRoleAssumers.js
var import_dist_cjs, getAccountIdFromAssumedRoleUser, resolveRegion, getDefaultRoleAssumer$1, getDefaultRoleAssumerWithWebIdentity$1, isH2;
var init_defaultStsRoleAssumers = require_chunk.__esmMin((() => {
	require_client.init_client();
	import_dist_cjs = require_dist_cjs$25.require_dist_cjs();
	init_AssumeRoleCommand();
	init_AssumeRoleWithWebIdentityCommand();
	getAccountIdFromAssumedRoleUser = (assumedRoleUser) => {
		if (typeof assumedRoleUser?.Arn === "string") {
			const arnComponents = assumedRoleUser.Arn.split(":");
			if (arnComponents.length > 4 && arnComponents[4] !== "") return arnComponents[4];
		}
	};
	resolveRegion = async (_region, _parentRegion, credentialProviderLogger, loaderConfig = {}) => {
		const region = typeof _region === "function" ? await _region() : _region;
		const parentRegion = typeof _parentRegion === "function" ? await _parentRegion() : _parentRegion;
		const stsDefaultRegion = await (0, import_dist_cjs.stsRegionDefaultResolver)(loaderConfig)();
		credentialProviderLogger?.debug?.("@aws-sdk/client-sts::resolveRegion", "accepting first of:", `${region} (credential provider clientConfig)`, `${parentRegion} (contextual client)`, `${stsDefaultRegion} (STS default: AWS_REGION, profile region, or us-east-1)`);
		return region ?? parentRegion ?? stsDefaultRegion;
	};
	getDefaultRoleAssumer$1 = (stsOptions, STSClient$1) => {
		let stsClient;
		let closureSourceCreds;
		return async (sourceCreds, params) => {
			closureSourceCreds = sourceCreds;
			if (!stsClient) {
				const { logger = stsOptions?.parentClientConfig?.logger, profile = stsOptions?.parentClientConfig?.profile, region, requestHandler = stsOptions?.parentClientConfig?.requestHandler, credentialProviderLogger, userAgentAppId = stsOptions?.parentClientConfig?.userAgentAppId } = stsOptions;
				const resolvedRegion = await resolveRegion(region, stsOptions?.parentClientConfig?.region, credentialProviderLogger, {
					logger,
					profile
				});
				const isCompatibleRequestHandler = !isH2(requestHandler);
				stsClient = new STSClient$1({
					...stsOptions,
					userAgentAppId,
					profile,
					credentialDefaultProvider: () => async () => closureSourceCreds,
					region: resolvedRegion,
					requestHandler: isCompatibleRequestHandler ? requestHandler : void 0,
					logger
				});
			}
			const { Credentials: Credentials$1, AssumedRoleUser: AssumedRoleUser$1 } = await stsClient.send(new AssumeRoleCommand(params));
			if (!Credentials$1 || !Credentials$1.AccessKeyId || !Credentials$1.SecretAccessKey) throw new Error(`Invalid response from STS.assumeRole call with role ${params.RoleArn}`);
			const accountId = getAccountIdFromAssumedRoleUser(AssumedRoleUser$1);
			const credentials = {
				accessKeyId: Credentials$1.AccessKeyId,
				secretAccessKey: Credentials$1.SecretAccessKey,
				sessionToken: Credentials$1.SessionToken,
				expiration: Credentials$1.Expiration,
				...Credentials$1.CredentialScope && { credentialScope: Credentials$1.CredentialScope },
				...accountId && { accountId }
			};
			require_client.setCredentialFeature(credentials, "CREDENTIALS_STS_ASSUME_ROLE", "i");
			return credentials;
		};
	};
	getDefaultRoleAssumerWithWebIdentity$1 = (stsOptions, STSClient$1) => {
		let stsClient;
		return async (params) => {
			if (!stsClient) {
				const { logger = stsOptions?.parentClientConfig?.logger, profile = stsOptions?.parentClientConfig?.profile, region, requestHandler = stsOptions?.parentClientConfig?.requestHandler, credentialProviderLogger, userAgentAppId = stsOptions?.parentClientConfig?.userAgentAppId } = stsOptions;
				const resolvedRegion = await resolveRegion(region, stsOptions?.parentClientConfig?.region, credentialProviderLogger, {
					logger,
					profile
				});
				const isCompatibleRequestHandler = !isH2(requestHandler);
				stsClient = new STSClient$1({
					...stsOptions,
					userAgentAppId,
					profile,
					region: resolvedRegion,
					requestHandler: isCompatibleRequestHandler ? requestHandler : void 0,
					logger
				});
			}
			const { Credentials: Credentials$1, AssumedRoleUser: AssumedRoleUser$1 } = await stsClient.send(new AssumeRoleWithWebIdentityCommand(params));
			if (!Credentials$1 || !Credentials$1.AccessKeyId || !Credentials$1.SecretAccessKey) throw new Error(`Invalid response from STS.assumeRoleWithWebIdentity call with role ${params.RoleArn}`);
			const accountId = getAccountIdFromAssumedRoleUser(AssumedRoleUser$1);
			const credentials = {
				accessKeyId: Credentials$1.AccessKeyId,
				secretAccessKey: Credentials$1.SecretAccessKey,
				sessionToken: Credentials$1.SessionToken,
				expiration: Credentials$1.Expiration,
				...Credentials$1.CredentialScope && { credentialScope: Credentials$1.CredentialScope },
				...accountId && { accountId }
			};
			if (accountId) require_client.setCredentialFeature(credentials, "RESOLVED_ACCOUNT_ID", "T");
			require_client.setCredentialFeature(credentials, "CREDENTIALS_STS_ASSUME_ROLE_WEB_ID", "k");
			return credentials;
		};
	};
	isH2 = (requestHandler) => {
		return requestHandler?.metadata?.handlerProtocol === "h2";
	};
}));

//#endregion
//#region ../node_modules/.pnpm/@aws-sdk+nested-clients@3.940.0/node_modules/@aws-sdk/nested-clients/dist-es/submodules/sts/defaultRoleAssumers.js
var getCustomizableStsClientCtor, getDefaultRoleAssumer, getDefaultRoleAssumerWithWebIdentity, decorateDefaultCredentialProvider;
var init_defaultRoleAssumers = require_chunk.__esmMin((() => {
	init_defaultStsRoleAssumers();
	init_STSClient();
	getCustomizableStsClientCtor = (baseCtor, customizations) => {
		if (!customizations) return baseCtor;
		else return class CustomizableSTSClient extends baseCtor {
			constructor(config) {
				super(config);
				for (const customization of customizations) this.middlewareStack.use(customization);
			}
		};
	};
	getDefaultRoleAssumer = (stsOptions = {}, stsPlugins) => getDefaultRoleAssumer$1(stsOptions, getCustomizableStsClientCtor(STSClient, stsPlugins));
	getDefaultRoleAssumerWithWebIdentity = (stsOptions = {}, stsPlugins) => getDefaultRoleAssumerWithWebIdentity$1(stsOptions, getCustomizableStsClientCtor(STSClient, stsPlugins));
	decorateDefaultCredentialProvider = (provider) => (input) => provider({
		roleAssumer: getDefaultRoleAssumer(input),
		roleAssumerWithWebIdentity: getDefaultRoleAssumerWithWebIdentity(input),
		...input
	});
}));

//#endregion
//#region ../node_modules/.pnpm/@aws-sdk+nested-clients@3.940.0/node_modules/@aws-sdk/nested-clients/dist-es/submodules/sts/index.js
var sts_exports = /* @__PURE__ */ require_chunk.__exportAll({
	AssumeRoleCommand: () => AssumeRoleCommand,
	AssumeRoleWithWebIdentityCommand: () => AssumeRoleWithWebIdentityCommand,
	ExpiredTokenException: () => ExpiredTokenException$1,
	IDPCommunicationErrorException: () => IDPCommunicationErrorException$1,
	IDPRejectedClaimException: () => IDPRejectedClaimException$1,
	InvalidIdentityTokenException: () => InvalidIdentityTokenException$1,
	MalformedPolicyDocumentException: () => MalformedPolicyDocumentException$1,
	PackedPolicyTooLargeException: () => PackedPolicyTooLargeException$1,
	RegionDisabledException: () => RegionDisabledException$1,
	STS: () => STS,
	STSClient: () => STSClient,
	STSServiceException: () => STSServiceException$1,
	__Client: () => import_dist_cjs$15.Client,
	decorateDefaultCredentialProvider: () => decorateDefaultCredentialProvider,
	getDefaultRoleAssumer: () => getDefaultRoleAssumer,
	getDefaultRoleAssumerWithWebIdentity: () => getDefaultRoleAssumerWithWebIdentity
});
var init_sts = require_chunk.__esmMin((() => {
	init_STSClient();
	init_STS();
	init_commands();
	init_errors();
	init_defaultRoleAssumers();
	init_STSServiceException();
}));

//#endregion
Object.defineProperty(exports, 'AssumeRoleCommand', {
  enumerable: true,
  get: function () {
    return AssumeRoleCommand;
  }
});
Object.defineProperty(exports, 'AssumeRoleWithWebIdentityCommand', {
  enumerable: true,
  get: function () {
    return AssumeRoleWithWebIdentityCommand;
  }
});
Object.defineProperty(exports, 'ExpiredTokenException', {
  enumerable: true,
  get: function () {
    return ExpiredTokenException$1;
  }
});
Object.defineProperty(exports, 'IDPCommunicationErrorException', {
  enumerable: true,
  get: function () {
    return IDPCommunicationErrorException$1;
  }
});
Object.defineProperty(exports, 'IDPRejectedClaimException', {
  enumerable: true,
  get: function () {
    return IDPRejectedClaimException$1;
  }
});
Object.defineProperty(exports, 'InvalidIdentityTokenException', {
  enumerable: true,
  get: function () {
    return InvalidIdentityTokenException$1;
  }
});
Object.defineProperty(exports, 'MalformedPolicyDocumentException', {
  enumerable: true,
  get: function () {
    return MalformedPolicyDocumentException$1;
  }
});
Object.defineProperty(exports, 'PackedPolicyTooLargeException', {
  enumerable: true,
  get: function () {
    return PackedPolicyTooLargeException$1;
  }
});
Object.defineProperty(exports, 'RegionDisabledException', {
  enumerable: true,
  get: function () {
    return RegionDisabledException$1;
  }
});
Object.defineProperty(exports, 'STS', {
  enumerable: true,
  get: function () {
    return STS;
  }
});
Object.defineProperty(exports, 'STSClient', {
  enumerable: true,
  get: function () {
    return STSClient;
  }
});
Object.defineProperty(exports, 'STSServiceException', {
  enumerable: true,
  get: function () {
    return STSServiceException$1;
  }
});
Object.defineProperty(exports, 'decorateDefaultCredentialProvider', {
  enumerable: true,
  get: function () {
    return decorateDefaultCredentialProvider;
  }
});
Object.defineProperty(exports, 'getDefaultRoleAssumer', {
  enumerable: true,
  get: function () {
    return getDefaultRoleAssumer;
  }
});
Object.defineProperty(exports, 'getDefaultRoleAssumerWithWebIdentity', {
  enumerable: true,
  get: function () {
    return getDefaultRoleAssumerWithWebIdentity;
  }
});
Object.defineProperty(exports, 'import_dist_cjs', {
  enumerable: true,
  get: function () {
    return import_dist_cjs$5;
  }
});
Object.defineProperty(exports, 'import_dist_cjs$1', {
  enumerable: true,
  get: function () {
    return import_dist_cjs$15;
  }
});
Object.defineProperty(exports, 'init_sts', {
  enumerable: true,
  get: function () {
    return init_sts;
  }
});
Object.defineProperty(exports, 'sts_exports', {
  enumerable: true,
  get: function () {
    return sts_exports;
  }
});