const require_chunk = require('./chunk-CdAKIUsw.js');
const require_dist_cjs$36 = require('./dist-cjs-DcvYtBnm.js');
const require_dist_cjs$37 = require('./dist-cjs-BawS8oYv.js');
const require_dist_cjs$38 = require('./dist-cjs-BMOAUmMP.js');
const require_dist_cjs$39 = require('./dist-cjs-DVzRDdXz.js');
const require_dist_cjs$40 = require('./dist-cjs-CWItNfj0.js');
const require_client = require('./client-BsEbA1K3.js');
const require_dist_cjs$41 = require('./dist-cjs-CxAZshVx.js');
const require_dist_cjs$42 = require('./dist-cjs-DrUzD-Vw.js');

//#region ../node_modules/.pnpm/@aws-sdk+middleware-host-header@3.936.0/node_modules/@aws-sdk/middleware-host-header/dist-cjs/index.js
var require_dist_cjs$20 = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	var protocolHttp = require_dist_cjs$37.require_dist_cjs();
	function resolveHostHeaderConfig(input) {
		return input;
	}
	const hostHeaderMiddleware = (options) => (next) => async (args) => {
		if (!protocolHttp.HttpRequest.isInstance(args.request)) return next(args);
		const { request } = args;
		const { handlerProtocol = "" } = options.requestHandler.metadata || {};
		if (handlerProtocol.indexOf("h2") >= 0 && !request.headers[":authority"]) {
			delete request.headers["host"];
			request.headers[":authority"] = request.hostname + (request.port ? ":" + request.port : "");
		} else if (!request.headers["host"]) {
			let host = request.hostname;
			if (request.port != null) host += `:${request.port}`;
			request.headers["host"] = host;
		}
		return next(args);
	};
	const hostHeaderMiddlewareOptions = {
		name: "hostHeaderMiddleware",
		step: "build",
		priority: "low",
		tags: ["HOST"],
		override: true
	};
	const getHostHeaderPlugin = (options) => ({ applyToStack: (clientStack) => {
		clientStack.add(hostHeaderMiddleware(options), hostHeaderMiddlewareOptions);
	} });
	exports.getHostHeaderPlugin = getHostHeaderPlugin;
	exports.hostHeaderMiddleware = hostHeaderMiddleware;
	exports.hostHeaderMiddlewareOptions = hostHeaderMiddlewareOptions;
	exports.resolveHostHeaderConfig = resolveHostHeaderConfig;
}));

//#endregion
//#region ../node_modules/.pnpm/@aws-sdk+middleware-logger@3.936.0/node_modules/@aws-sdk/middleware-logger/dist-cjs/index.js
var require_dist_cjs$19 = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	const loggerMiddleware = () => (next, context) => async (args) => {
		try {
			const response = await next(args);
			const { clientName, commandName, logger, dynamoDbDocumentClientOptions = {} } = context;
			const { overrideInputFilterSensitiveLog, overrideOutputFilterSensitiveLog } = dynamoDbDocumentClientOptions;
			const inputFilterSensitiveLog = overrideInputFilterSensitiveLog ?? context.inputFilterSensitiveLog;
			const outputFilterSensitiveLog = overrideOutputFilterSensitiveLog ?? context.outputFilterSensitiveLog;
			const { $metadata, ...outputWithoutMetadata } = response.output;
			logger?.info?.({
				clientName,
				commandName,
				input: inputFilterSensitiveLog(args.input),
				output: outputFilterSensitiveLog(outputWithoutMetadata),
				metadata: $metadata
			});
			return response;
		} catch (error) {
			const { clientName, commandName, logger, dynamoDbDocumentClientOptions = {} } = context;
			const { overrideInputFilterSensitiveLog } = dynamoDbDocumentClientOptions;
			const inputFilterSensitiveLog = overrideInputFilterSensitiveLog ?? context.inputFilterSensitiveLog;
			logger?.error?.({
				clientName,
				commandName,
				input: inputFilterSensitiveLog(args.input),
				error,
				metadata: error.$metadata
			});
			throw error;
		}
	};
	const loggerMiddlewareOptions = {
		name: "loggerMiddleware",
		tags: ["LOGGER"],
		step: "initialize",
		override: true
	};
	const getLoggerPlugin = (options) => ({ applyToStack: (clientStack) => {
		clientStack.add(loggerMiddleware(), loggerMiddlewareOptions);
	} });
	exports.getLoggerPlugin = getLoggerPlugin;
	exports.loggerMiddleware = loggerMiddleware;
	exports.loggerMiddlewareOptions = loggerMiddlewareOptions;
}));

//#endregion
//#region ../node_modules/.pnpm/@aws+lambda-invoke-store@0.2.1/node_modules/@aws/lambda-invoke-store/dist-es/invoke-store.js
var invoke_store_exports = /* @__PURE__ */ require_chunk.__exportAll({
	InvokeStore: () => InvokeStore,
	InvokeStoreBase: () => InvokeStoreBase
});
var PROTECTED_KEYS, NO_GLOBAL_AWS_LAMBDA, InvokeStoreBase, InvokeStoreSingle, InvokeStoreMulti, InvokeStore;
var init_invoke_store = require_chunk.__esmMin((() => {
	PROTECTED_KEYS = {
		REQUEST_ID: Symbol.for("_AWS_LAMBDA_REQUEST_ID"),
		X_RAY_TRACE_ID: Symbol.for("_AWS_LAMBDA_X_RAY_TRACE_ID"),
		TENANT_ID: Symbol.for("_AWS_LAMBDA_TENANT_ID")
	};
	NO_GLOBAL_AWS_LAMBDA = ["true", "1"].includes(process.env?.AWS_LAMBDA_NODEJS_NO_GLOBAL_AWSLAMBDA ?? "");
	if (!NO_GLOBAL_AWS_LAMBDA) globalThis.awslambda = globalThis.awslambda || {};
	InvokeStoreBase = class {
		static PROTECTED_KEYS = PROTECTED_KEYS;
		isProtectedKey(key) {
			return Object.values(PROTECTED_KEYS).includes(key);
		}
		getRequestId() {
			return this.get(PROTECTED_KEYS.REQUEST_ID) ?? "-";
		}
		getXRayTraceId() {
			return this.get(PROTECTED_KEYS.X_RAY_TRACE_ID);
		}
		getTenantId() {
			return this.get(PROTECTED_KEYS.TENANT_ID);
		}
	};
	InvokeStoreSingle = class extends InvokeStoreBase {
		currentContext;
		getContext() {
			return this.currentContext;
		}
		hasContext() {
			return this.currentContext !== void 0;
		}
		get(key) {
			return this.currentContext?.[key];
		}
		set(key, value) {
			if (this.isProtectedKey(key)) throw new Error(`Cannot modify protected Lambda context field: ${String(key)}`);
			this.currentContext = this.currentContext || {};
			this.currentContext[key] = value;
		}
		run(context, fn) {
			this.currentContext = context;
			try {
				return fn();
			} finally {
				this.currentContext = void 0;
			}
		}
	};
	InvokeStoreMulti = class InvokeStoreMulti extends InvokeStoreBase {
		als;
		static async create() {
			const instance = new InvokeStoreMulti();
			instance.als = new (await (import("node:async_hooks"))).AsyncLocalStorage();
			return instance;
		}
		getContext() {
			return this.als.getStore();
		}
		hasContext() {
			return this.als.getStore() !== void 0;
		}
		get(key) {
			return this.als.getStore()?.[key];
		}
		set(key, value) {
			if (this.isProtectedKey(key)) throw new Error(`Cannot modify protected Lambda context field: ${String(key)}`);
			const store = this.als.getStore();
			if (!store) throw new Error("No context available");
			store[key] = value;
		}
		run(context, fn) {
			return this.als.run(context, fn);
		}
	};
	;
	(function(InvokeStore$1) {
		let instance = null;
		async function getInstanceAsync() {
			if (!instance) instance = (async () => {
				const newInstance = "AWS_LAMBDA_MAX_CONCURRENCY" in process.env ? await InvokeStoreMulti.create() : new InvokeStoreSingle();
				if (!NO_GLOBAL_AWS_LAMBDA && globalThis.awslambda?.InvokeStore) return globalThis.awslambda.InvokeStore;
				else if (!NO_GLOBAL_AWS_LAMBDA && globalThis.awslambda) {
					globalThis.awslambda.InvokeStore = newInstance;
					return newInstance;
				} else return newInstance;
			})();
			return instance;
		}
		InvokeStore$1.getInstanceAsync = getInstanceAsync;
		InvokeStore$1._testing = process.env.AWS_LAMBDA_BENCHMARK_MODE === "1" ? { reset: () => {
			instance = null;
			if (globalThis.awslambda?.InvokeStore) delete globalThis.awslambda.InvokeStore;
			globalThis.awslambda = {};
		} } : void 0;
	})(InvokeStore || (InvokeStore = {}));
}));

//#endregion
//#region ../node_modules/.pnpm/@aws-sdk+middleware-recursion-detection@3.936.0/node_modules/@aws-sdk/middleware-recursion-detection/dist-cjs/recursionDetectionMiddleware.js
var require_recursionDetectionMiddleware = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.recursionDetectionMiddleware = void 0;
	const lambda_invoke_store_1 = (init_invoke_store(), require_chunk.__toCommonJS(invoke_store_exports));
	const protocol_http_1 = require_dist_cjs$37.require_dist_cjs();
	const TRACE_ID_HEADER_NAME = "X-Amzn-Trace-Id";
	const ENV_LAMBDA_FUNCTION_NAME = "AWS_LAMBDA_FUNCTION_NAME";
	const ENV_TRACE_ID = "_X_AMZN_TRACE_ID";
	const recursionDetectionMiddleware = () => (next) => async (args) => {
		const { request } = args;
		if (!protocol_http_1.HttpRequest.isInstance(request)) return next(args);
		const traceIdHeader = Object.keys(request.headers ?? {}).find((h) => h.toLowerCase() === TRACE_ID_HEADER_NAME.toLowerCase()) ?? TRACE_ID_HEADER_NAME;
		if (request.headers.hasOwnProperty(traceIdHeader)) return next(args);
		const functionName = process.env[ENV_LAMBDA_FUNCTION_NAME];
		const traceIdFromEnv = process.env[ENV_TRACE_ID];
		const traceId = (await lambda_invoke_store_1.InvokeStore.getInstanceAsync())?.getXRayTraceId() ?? traceIdFromEnv;
		const nonEmptyString = (str) => typeof str === "string" && str.length > 0;
		if (nonEmptyString(functionName) && nonEmptyString(traceId)) request.headers[TRACE_ID_HEADER_NAME] = traceId;
		return next({
			...args,
			request
		});
	};
	exports.recursionDetectionMiddleware = recursionDetectionMiddleware;
}));

//#endregion
//#region ../node_modules/.pnpm/@aws-sdk+middleware-recursion-detection@3.936.0/node_modules/@aws-sdk/middleware-recursion-detection/dist-cjs/index.js
var require_dist_cjs$18 = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	var recursionDetectionMiddleware = require_recursionDetectionMiddleware();
	const recursionDetectionMiddlewareOptions = {
		step: "build",
		tags: ["RECURSION_DETECTION"],
		name: "recursionDetectionMiddleware",
		override: true,
		priority: "low"
	};
	const getRecursionDetectionPlugin = (options) => ({ applyToStack: (clientStack) => {
		clientStack.add(recursionDetectionMiddleware.recursionDetectionMiddleware(), recursionDetectionMiddlewareOptions);
	} });
	exports.getRecursionDetectionPlugin = getRecursionDetectionPlugin;
	Object.keys(recursionDetectionMiddleware).forEach(function(k) {
		if (k !== "default" && !Object.prototype.hasOwnProperty.call(exports, k)) Object.defineProperty(exports, k, {
			enumerable: true,
			get: function() {
				return recursionDetectionMiddleware[k];
			}
		});
	});
}));

//#endregion
//#region ../node_modules/.pnpm/@smithy+core@3.18.5/node_modules/@smithy/core/dist-es/getSmithyContext.js
var import_dist_cjs$32, getSmithyContext$3;
var init_getSmithyContext = require_chunk.__esmMin((() => {
	import_dist_cjs$32 = require_dist_cjs$36.require_dist_cjs();
	getSmithyContext$3 = (context) => context[import_dist_cjs$32.SMITHY_CONTEXT_KEY] || (context[import_dist_cjs$32.SMITHY_CONTEXT_KEY] = {});
}));

//#endregion
//#region ../node_modules/.pnpm/@smithy+core@3.18.5/node_modules/@smithy/core/dist-es/middleware-http-auth-scheme/resolveAuthOptions.js
var resolveAuthOptions;
var init_resolveAuthOptions = require_chunk.__esmMin((() => {
	resolveAuthOptions = (candidateAuthOptions, authSchemePreference) => {
		if (!authSchemePreference || authSchemePreference.length === 0) return candidateAuthOptions;
		const preferredAuthOptions = [];
		for (const preferredSchemeName of authSchemePreference) for (const candidateAuthOption of candidateAuthOptions) if (candidateAuthOption.schemeId.split("#")[1] === preferredSchemeName) preferredAuthOptions.push(candidateAuthOption);
		for (const candidateAuthOption of candidateAuthOptions) if (!preferredAuthOptions.find(({ schemeId }) => schemeId === candidateAuthOption.schemeId)) preferredAuthOptions.push(candidateAuthOption);
		return preferredAuthOptions;
	};
}));

//#endregion
//#region ../node_modules/.pnpm/@smithy+core@3.18.5/node_modules/@smithy/core/dist-es/middleware-http-auth-scheme/httpAuthSchemeMiddleware.js
function convertHttpAuthSchemesToMap(httpAuthSchemes) {
	const map = /* @__PURE__ */ new Map();
	for (const scheme of httpAuthSchemes) map.set(scheme.schemeId, scheme);
	return map;
}
var import_dist_cjs$31, httpAuthSchemeMiddleware;
var init_httpAuthSchemeMiddleware = require_chunk.__esmMin((() => {
	import_dist_cjs$31 = require_dist_cjs$38.require_dist_cjs$7();
	init_resolveAuthOptions();
	httpAuthSchemeMiddleware = (config, mwOptions) => (next, context) => async (args) => {
		const resolvedOptions = resolveAuthOptions(config.httpAuthSchemeProvider(await mwOptions.httpAuthSchemeParametersProvider(config, context, args.input)), config.authSchemePreference ? await config.authSchemePreference() : []);
		const authSchemes = convertHttpAuthSchemesToMap(config.httpAuthSchemes);
		const smithyContext = (0, import_dist_cjs$31.getSmithyContext)(context);
		const failureReasons = [];
		for (const option of resolvedOptions) {
			const scheme = authSchemes.get(option.schemeId);
			if (!scheme) {
				failureReasons.push(`HttpAuthScheme \`${option.schemeId}\` was not enabled for this service.`);
				continue;
			}
			const identityProvider = scheme.identityProvider(await mwOptions.identityProviderConfigProvider(config));
			if (!identityProvider) {
				failureReasons.push(`HttpAuthScheme \`${option.schemeId}\` did not have an IdentityProvider configured.`);
				continue;
			}
			const { identityProperties = {}, signingProperties = {} } = option.propertiesExtractor?.(config, context) || {};
			option.identityProperties = Object.assign(option.identityProperties || {}, identityProperties);
			option.signingProperties = Object.assign(option.signingProperties || {}, signingProperties);
			smithyContext.selectedHttpAuthScheme = {
				httpAuthOption: option,
				identity: await identityProvider(option.identityProperties),
				signer: scheme.signer
			};
			break;
		}
		if (!smithyContext.selectedHttpAuthScheme) throw new Error(failureReasons.join("\n"));
		return next(args);
	};
}));

//#endregion
//#region ../node_modules/.pnpm/@smithy+core@3.18.5/node_modules/@smithy/core/dist-es/middleware-http-auth-scheme/getHttpAuthSchemeEndpointRuleSetPlugin.js
var httpAuthSchemeEndpointRuleSetMiddlewareOptions, getHttpAuthSchemeEndpointRuleSetPlugin;
var init_getHttpAuthSchemeEndpointRuleSetPlugin = require_chunk.__esmMin((() => {
	init_httpAuthSchemeMiddleware();
	httpAuthSchemeEndpointRuleSetMiddlewareOptions = {
		step: "serialize",
		tags: ["HTTP_AUTH_SCHEME"],
		name: "httpAuthSchemeMiddleware",
		override: true,
		relation: "before",
		toMiddleware: "endpointV2Middleware"
	};
	getHttpAuthSchemeEndpointRuleSetPlugin = (config, { httpAuthSchemeParametersProvider, identityProviderConfigProvider }) => ({ applyToStack: (clientStack) => {
		clientStack.addRelativeTo(httpAuthSchemeMiddleware(config, {
			httpAuthSchemeParametersProvider,
			identityProviderConfigProvider
		}), httpAuthSchemeEndpointRuleSetMiddlewareOptions);
	} });
}));

//#endregion
//#region ../node_modules/.pnpm/@smithy+middleware-serde@4.2.6/node_modules/@smithy/middleware-serde/dist-cjs/index.js
var require_dist_cjs$17 = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	var protocolHttp = require_dist_cjs$37.require_dist_cjs();
	const deserializerMiddleware = (options, deserializer) => (next, context) => async (args) => {
		const { response } = await next(args);
		try {
			return {
				response,
				output: await deserializer(response, options)
			};
		} catch (error) {
			Object.defineProperty(error, "$response", {
				value: response,
				enumerable: false,
				writable: false,
				configurable: false
			});
			if (!("$metadata" in error)) {
				const hint = `Deserialization error: to see the raw response, inspect the hidden field {error}.$response on this object.`;
				try {
					error.message += "\n  " + hint;
				} catch (e) {
					if (!context.logger || context.logger?.constructor?.name === "NoOpLogger") console.warn(hint);
					else context.logger?.warn?.(hint);
				}
				if (typeof error.$responseBodyText !== "undefined") {
					if (error.$response) error.$response.body = error.$responseBodyText;
				}
				try {
					if (protocolHttp.HttpResponse.isInstance(response)) {
						const { headers = {} } = response;
						const headerEntries = Object.entries(headers);
						error.$metadata = {
							httpStatusCode: response.statusCode,
							requestId: findHeader(/^x-[\w-]+-request-?id$/, headerEntries),
							extendedRequestId: findHeader(/^x-[\w-]+-id-2$/, headerEntries),
							cfId: findHeader(/^x-[\w-]+-cf-id$/, headerEntries)
						};
					}
				} catch (e) {}
			}
			throw error;
		}
	};
	const findHeader = (pattern, headers) => {
		return (headers.find(([k]) => {
			return k.match(pattern);
		}) || [void 0, void 0])[1];
	};
	const serializerMiddleware = (options, serializer) => (next, context) => async (args) => {
		const endpointConfig = options;
		const endpoint = context.endpointV2?.url && endpointConfig.urlParser ? async () => endpointConfig.urlParser(context.endpointV2.url) : endpointConfig.endpoint;
		if (!endpoint) throw new Error("No valid endpoint provider available.");
		const request = await serializer(args.input, {
			...options,
			endpoint
		});
		return next({
			...args,
			request
		});
	};
	const deserializerMiddlewareOption = {
		name: "deserializerMiddleware",
		step: "deserialize",
		tags: ["DESERIALIZER"],
		override: true
	};
	const serializerMiddlewareOption = {
		name: "serializerMiddleware",
		step: "serialize",
		tags: ["SERIALIZER"],
		override: true
	};
	function getSerdePlugin(config, serializer, deserializer) {
		return { applyToStack: (commandStack) => {
			commandStack.add(deserializerMiddleware(config, deserializer), deserializerMiddlewareOption);
			commandStack.add(serializerMiddleware(config, serializer), serializerMiddlewareOption);
		} };
	}
	exports.deserializerMiddleware = deserializerMiddleware;
	exports.deserializerMiddlewareOption = deserializerMiddlewareOption;
	exports.getSerdePlugin = getSerdePlugin;
	exports.serializerMiddleware = serializerMiddleware;
	exports.serializerMiddlewareOption = serializerMiddlewareOption;
}));

//#endregion
//#region ../node_modules/.pnpm/@smithy+core@3.18.5/node_modules/@smithy/core/dist-es/middleware-http-auth-scheme/getHttpAuthSchemePlugin.js
var import_dist_cjs$30, httpAuthSchemeMiddlewareOptions, getHttpAuthSchemePlugin;
var init_getHttpAuthSchemePlugin = require_chunk.__esmMin((() => {
	import_dist_cjs$30 = require_dist_cjs$17();
	init_httpAuthSchemeMiddleware();
	httpAuthSchemeMiddlewareOptions = {
		step: "serialize",
		tags: ["HTTP_AUTH_SCHEME"],
		name: "httpAuthSchemeMiddleware",
		override: true,
		relation: "before",
		toMiddleware: import_dist_cjs$30.serializerMiddlewareOption.name
	};
	getHttpAuthSchemePlugin = (config, { httpAuthSchemeParametersProvider, identityProviderConfigProvider }) => ({ applyToStack: (clientStack) => {
		clientStack.addRelativeTo(httpAuthSchemeMiddleware(config, {
			httpAuthSchemeParametersProvider,
			identityProviderConfigProvider
		}), httpAuthSchemeMiddlewareOptions);
	} });
}));

//#endregion
//#region ../node_modules/.pnpm/@smithy+core@3.18.5/node_modules/@smithy/core/dist-es/middleware-http-auth-scheme/index.js
var init_middleware_http_auth_scheme = require_chunk.__esmMin((() => {
	init_httpAuthSchemeMiddleware();
	init_getHttpAuthSchemeEndpointRuleSetPlugin();
	init_getHttpAuthSchemePlugin();
}));

//#endregion
//#region ../node_modules/.pnpm/@smithy+core@3.18.5/node_modules/@smithy/core/dist-es/middleware-http-signing/httpSigningMiddleware.js
var import_dist_cjs$28, import_dist_cjs$29, defaultErrorHandler, defaultSuccessHandler, httpSigningMiddleware;
var init_httpSigningMiddleware = require_chunk.__esmMin((() => {
	import_dist_cjs$28 = require_dist_cjs$37.require_dist_cjs();
	import_dist_cjs$29 = require_dist_cjs$38.require_dist_cjs$7();
	defaultErrorHandler = (signingProperties) => (error) => {
		throw error;
	};
	defaultSuccessHandler = (httpResponse, signingProperties) => {};
	httpSigningMiddleware = (config) => (next, context) => async (args) => {
		if (!import_dist_cjs$28.HttpRequest.isInstance(args.request)) return next(args);
		const scheme = (0, import_dist_cjs$29.getSmithyContext)(context).selectedHttpAuthScheme;
		if (!scheme) throw new Error(`No HttpAuthScheme was selected: unable to sign request`);
		const { httpAuthOption: { signingProperties = {} }, identity, signer } = scheme;
		const output = await next({
			...args,
			request: await signer.sign(args.request, identity, signingProperties)
		}).catch((signer.errorHandler || defaultErrorHandler)(signingProperties));
		(signer.successHandler || defaultSuccessHandler)(output.response, signingProperties);
		return output;
	};
}));

//#endregion
//#region ../node_modules/.pnpm/@smithy+core@3.18.5/node_modules/@smithy/core/dist-es/middleware-http-signing/getHttpSigningMiddleware.js
var httpSigningMiddlewareOptions, getHttpSigningPlugin;
var init_getHttpSigningMiddleware = require_chunk.__esmMin((() => {
	init_httpSigningMiddleware();
	httpSigningMiddlewareOptions = {
		step: "finalizeRequest",
		tags: ["HTTP_SIGNING"],
		name: "httpSigningMiddleware",
		aliases: [
			"apiKeyMiddleware",
			"tokenMiddleware",
			"awsAuthMiddleware"
		],
		override: true,
		relation: "after",
		toMiddleware: "retryMiddleware"
	};
	getHttpSigningPlugin = (config) => ({ applyToStack: (clientStack) => {
		clientStack.addRelativeTo(httpSigningMiddleware(config), httpSigningMiddlewareOptions);
	} });
}));

//#endregion
//#region ../node_modules/.pnpm/@smithy+core@3.18.5/node_modules/@smithy/core/dist-es/middleware-http-signing/index.js
var init_middleware_http_signing = require_chunk.__esmMin((() => {
	init_httpSigningMiddleware();
	init_getHttpSigningMiddleware();
}));

//#endregion
//#region ../node_modules/.pnpm/@smithy+core@3.18.5/node_modules/@smithy/core/dist-es/normalizeProvider.js
var normalizeProvider;
var init_normalizeProvider = require_chunk.__esmMin((() => {
	normalizeProvider = (input) => {
		if (typeof input === "function") return input;
		const promisified = Promise.resolve(input);
		return () => promisified;
	};
}));

//#endregion
//#region ../node_modules/.pnpm/@smithy+core@3.18.5/node_modules/@smithy/core/dist-es/pagination/createPaginator.js
function createPaginator(ClientCtor, CommandCtor, inputTokenName, outputTokenName, pageSizeTokenName) {
	return async function* paginateOperation(config, input, ...additionalArguments) {
		const _input = input;
		let token = config.startingToken ?? _input[inputTokenName];
		let hasNext = true;
		let page;
		while (hasNext) {
			_input[inputTokenName] = token;
			if (pageSizeTokenName) _input[pageSizeTokenName] = _input[pageSizeTokenName] ?? config.pageSize;
			if (config.client instanceof ClientCtor) page = await makePagedClientRequest(CommandCtor, config.client, input, config.withCommand, ...additionalArguments);
			else throw new Error(`Invalid client, expected instance of ${ClientCtor.name}`);
			yield page;
			const prevToken = token;
			token = get(page, outputTokenName);
			hasNext = !!(token && (!config.stopOnSameToken || token !== prevToken));
		}
		return void 0;
	};
}
var makePagedClientRequest, get;
var init_createPaginator = require_chunk.__esmMin((() => {
	makePagedClientRequest = async (CommandCtor, client, input, withCommand = (_) => _, ...args) => {
		let command = new CommandCtor(input);
		command = withCommand(command) ?? command;
		return await client.send(command, ...args);
	};
	get = (fromObject, path) => {
		let cursor$1 = fromObject;
		const pathComponents = path.split(".");
		for (const step of pathComponents) {
			if (!cursor$1 || typeof cursor$1 !== "object") return;
			cursor$1 = cursor$1[step];
		}
		return cursor$1;
	};
}));

//#endregion
//#region ../node_modules/.pnpm/@smithy+core@3.18.5/node_modules/@smithy/core/dist-es/request-builder/requestBuilder.js
var init_requestBuilder = require_chunk.__esmMin((() => {
	require_dist_cjs$38.init_protocols();
}));

//#endregion
//#region ../node_modules/.pnpm/@smithy+core@3.18.5/node_modules/@smithy/core/dist-es/setFeature.js
function setFeature(context, feature, value) {
	if (!context.__smithy_context) context.__smithy_context = { features: {} };
	else if (!context.__smithy_context.features) context.__smithy_context.features = {};
	context.__smithy_context.features[feature] = value;
}
var init_setFeature = require_chunk.__esmMin((() => {}));

//#endregion
//#region ../node_modules/.pnpm/@smithy+core@3.18.5/node_modules/@smithy/core/dist-es/util-identity-and-auth/DefaultIdentityProviderConfig.js
var DefaultIdentityProviderConfig;
var init_DefaultIdentityProviderConfig = require_chunk.__esmMin((() => {
	DefaultIdentityProviderConfig = class {
		authSchemes = /* @__PURE__ */ new Map();
		constructor(config) {
			for (const [key, value] of Object.entries(config)) if (value !== void 0) this.authSchemes.set(key, value);
		}
		getIdentityProvider(schemeId) {
			return this.authSchemes.get(schemeId);
		}
	};
}));

//#endregion
//#region ../node_modules/.pnpm/@smithy+core@3.18.5/node_modules/@smithy/core/dist-es/util-identity-and-auth/httpAuthSchemes/httpApiKeyAuth.js
var import_dist_cjs$26, import_dist_cjs$27, HttpApiKeyAuthSigner;
var init_httpApiKeyAuth = require_chunk.__esmMin((() => {
	import_dist_cjs$26 = require_dist_cjs$37.require_dist_cjs();
	import_dist_cjs$27 = require_dist_cjs$36.require_dist_cjs();
	HttpApiKeyAuthSigner = class {
		async sign(httpRequest, identity, signingProperties) {
			if (!signingProperties) throw new Error("request could not be signed with `apiKey` since the `name` and `in` signer properties are missing");
			if (!signingProperties.name) throw new Error("request could not be signed with `apiKey` since the `name` signer property is missing");
			if (!signingProperties.in) throw new Error("request could not be signed with `apiKey` since the `in` signer property is missing");
			if (!identity.apiKey) throw new Error("request could not be signed with `apiKey` since the `apiKey` is not defined");
			const clonedRequest = import_dist_cjs$26.HttpRequest.clone(httpRequest);
			if (signingProperties.in === import_dist_cjs$27.HttpApiKeyAuthLocation.QUERY) clonedRequest.query[signingProperties.name] = identity.apiKey;
			else if (signingProperties.in === import_dist_cjs$27.HttpApiKeyAuthLocation.HEADER) clonedRequest.headers[signingProperties.name] = signingProperties.scheme ? `${signingProperties.scheme} ${identity.apiKey}` : identity.apiKey;
			else throw new Error("request can only be signed with `apiKey` locations `query` or `header`, but found: `" + signingProperties.in + "`");
			return clonedRequest;
		}
	};
}));

//#endregion
//#region ../node_modules/.pnpm/@smithy+core@3.18.5/node_modules/@smithy/core/dist-es/util-identity-and-auth/httpAuthSchemes/httpBearerAuth.js
var import_dist_cjs$25, HttpBearerAuthSigner;
var init_httpBearerAuth = require_chunk.__esmMin((() => {
	import_dist_cjs$25 = require_dist_cjs$37.require_dist_cjs();
	HttpBearerAuthSigner = class {
		async sign(httpRequest, identity, signingProperties) {
			const clonedRequest = import_dist_cjs$25.HttpRequest.clone(httpRequest);
			if (!identity.token) throw new Error("request could not be signed with `token` since the `token` is not defined");
			clonedRequest.headers["Authorization"] = `Bearer ${identity.token}`;
			return clonedRequest;
		}
	};
}));

//#endregion
//#region ../node_modules/.pnpm/@smithy+core@3.18.5/node_modules/@smithy/core/dist-es/util-identity-and-auth/httpAuthSchemes/noAuth.js
var NoAuthSigner;
var init_noAuth = require_chunk.__esmMin((() => {
	NoAuthSigner = class {
		async sign(httpRequest, identity, signingProperties) {
			return httpRequest;
		}
	};
}));

//#endregion
//#region ../node_modules/.pnpm/@smithy+core@3.18.5/node_modules/@smithy/core/dist-es/util-identity-and-auth/httpAuthSchemes/index.js
var init_httpAuthSchemes$1 = require_chunk.__esmMin((() => {
	init_httpApiKeyAuth();
	init_httpBearerAuth();
	init_noAuth();
}));

//#endregion
//#region ../node_modules/.pnpm/@smithy+core@3.18.5/node_modules/@smithy/core/dist-es/util-identity-and-auth/memoizeIdentityProvider.js
var createIsIdentityExpiredFunction, EXPIRATION_MS, isIdentityExpired, doesIdentityRequireRefresh, memoizeIdentityProvider;
var init_memoizeIdentityProvider = require_chunk.__esmMin((() => {
	createIsIdentityExpiredFunction = (expirationMs) => function isIdentityExpired$1(identity) {
		return doesIdentityRequireRefresh(identity) && identity.expiration.getTime() - Date.now() < expirationMs;
	};
	EXPIRATION_MS = 3e5;
	isIdentityExpired = createIsIdentityExpiredFunction(EXPIRATION_MS);
	doesIdentityRequireRefresh = (identity) => identity.expiration !== void 0;
	memoizeIdentityProvider = (provider, isExpired, requiresRefresh) => {
		if (provider === void 0) return;
		const normalizedProvider = typeof provider !== "function" ? async () => Promise.resolve(provider) : provider;
		let resolved;
		let pending;
		let hasResult;
		let isConstant = false;
		const coalesceProvider = async (options) => {
			if (!pending) pending = normalizedProvider(options);
			try {
				resolved = await pending;
				hasResult = true;
				isConstant = false;
			} finally {
				pending = void 0;
			}
			return resolved;
		};
		if (isExpired === void 0) return async (options) => {
			if (!hasResult || options?.forceRefresh) resolved = await coalesceProvider(options);
			return resolved;
		};
		return async (options) => {
			if (!hasResult || options?.forceRefresh) resolved = await coalesceProvider(options);
			if (isConstant) return resolved;
			if (!requiresRefresh(resolved)) {
				isConstant = true;
				return resolved;
			}
			if (isExpired(resolved)) {
				await coalesceProvider(options);
				return resolved;
			}
			return resolved;
		};
	};
}));

//#endregion
//#region ../node_modules/.pnpm/@smithy+core@3.18.5/node_modules/@smithy/core/dist-es/util-identity-and-auth/index.js
var init_util_identity_and_auth = require_chunk.__esmMin((() => {
	init_DefaultIdentityProviderConfig();
	init_httpAuthSchemes$1();
	init_memoizeIdentityProvider();
}));

//#endregion
//#region ../node_modules/.pnpm/@smithy+core@3.18.5/node_modules/@smithy/core/dist-es/index.js
var dist_es_exports$1 = /* @__PURE__ */ require_chunk.__exportAll({
	DefaultIdentityProviderConfig: () => DefaultIdentityProviderConfig,
	EXPIRATION_MS: () => EXPIRATION_MS,
	HttpApiKeyAuthSigner: () => HttpApiKeyAuthSigner,
	HttpBearerAuthSigner: () => HttpBearerAuthSigner,
	NoAuthSigner: () => NoAuthSigner,
	createIsIdentityExpiredFunction: () => createIsIdentityExpiredFunction,
	createPaginator: () => createPaginator,
	doesIdentityRequireRefresh: () => doesIdentityRequireRefresh,
	getHttpAuthSchemeEndpointRuleSetPlugin: () => getHttpAuthSchemeEndpointRuleSetPlugin,
	getHttpAuthSchemePlugin: () => getHttpAuthSchemePlugin,
	getHttpSigningPlugin: () => getHttpSigningPlugin,
	getSmithyContext: () => getSmithyContext$3,
	httpAuthSchemeEndpointRuleSetMiddlewareOptions: () => httpAuthSchemeEndpointRuleSetMiddlewareOptions,
	httpAuthSchemeMiddleware: () => httpAuthSchemeMiddleware,
	httpAuthSchemeMiddlewareOptions: () => httpAuthSchemeMiddlewareOptions,
	httpSigningMiddleware: () => httpSigningMiddleware,
	httpSigningMiddlewareOptions: () => httpSigningMiddlewareOptions,
	isIdentityExpired: () => isIdentityExpired,
	memoizeIdentityProvider: () => memoizeIdentityProvider,
	normalizeProvider: () => normalizeProvider,
	requestBuilder: () => require_dist_cjs$38.requestBuilder,
	setFeature: () => setFeature
});
var init_dist_es$1 = require_chunk.__esmMin((() => {
	init_getSmithyContext();
	init_middleware_http_auth_scheme();
	init_middleware_http_signing();
	init_normalizeProvider();
	init_createPaginator();
	init_requestBuilder();
	init_setFeature();
	init_util_identity_and_auth();
}));

//#endregion
//#region ../node_modules/.pnpm/@smithy+util-endpoints@3.2.5/node_modules/@smithy/util-endpoints/dist-cjs/index.js
var require_dist_cjs$16 = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	var types = require_dist_cjs$36.require_dist_cjs();
	var EndpointCache = class {
		capacity;
		data = /* @__PURE__ */ new Map();
		parameters = [];
		constructor({ size, params }) {
			this.capacity = size ?? 50;
			if (params) this.parameters = params;
		}
		get(endpointParams, resolver) {
			const key = this.hash(endpointParams);
			if (key === false) return resolver();
			if (!this.data.has(key)) {
				if (this.data.size > this.capacity + 10) {
					const keys = this.data.keys();
					let i = 0;
					while (true) {
						const { value, done } = keys.next();
						this.data.delete(value);
						if (done || ++i > 10) break;
					}
				}
				this.data.set(key, resolver());
			}
			return this.data.get(key);
		}
		size() {
			return this.data.size;
		}
		hash(endpointParams) {
			let buffer$1 = "";
			const { parameters } = this;
			if (parameters.length === 0) return false;
			for (const param of parameters) {
				const val = String(endpointParams[param] ?? "");
				if (val.includes("|;")) return false;
				buffer$1 += val + "|;";
			}
			return buffer$1;
		}
	};
	const IP_V4_REGEX = /* @__PURE__ */ new RegExp(`^(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}$`);
	const isIpAddress = (value) => IP_V4_REGEX.test(value) || value.startsWith("[") && value.endsWith("]");
	const VALID_HOST_LABEL_REGEX = /* @__PURE__ */ new RegExp(`^(?!.*-$)(?!-)[a-zA-Z0-9-]{1,63}$`);
	const isValidHostLabel = (value, allowSubDomains = false) => {
		if (!allowSubDomains) return VALID_HOST_LABEL_REGEX.test(value);
		const labels = value.split(".");
		for (const label of labels) if (!isValidHostLabel(label)) return false;
		return true;
	};
	const customEndpointFunctions = {};
	const debugId = "endpoints";
	function toDebugString(input) {
		if (typeof input !== "object" || input == null) return input;
		if ("ref" in input) return `$${toDebugString(input.ref)}`;
		if ("fn" in input) return `${input.fn}(${(input.argv || []).map(toDebugString).join(", ")})`;
		return JSON.stringify(input, null, 2);
	}
	var EndpointError = class extends Error {
		constructor(message) {
			super(message);
			this.name = "EndpointError";
		}
	};
	const booleanEquals = (value1, value2) => value1 === value2;
	const getAttrPathList = (path) => {
		const parts = path.split(".");
		const pathList = [];
		for (const part of parts) {
			const squareBracketIndex = part.indexOf("[");
			if (squareBracketIndex !== -1) {
				if (part.indexOf("]") !== part.length - 1) throw new EndpointError(`Path: '${path}' does not end with ']'`);
				const arrayIndex = part.slice(squareBracketIndex + 1, -1);
				if (Number.isNaN(parseInt(arrayIndex))) throw new EndpointError(`Invalid array index: '${arrayIndex}' in path: '${path}'`);
				if (squareBracketIndex !== 0) pathList.push(part.slice(0, squareBracketIndex));
				pathList.push(arrayIndex);
			} else pathList.push(part);
		}
		return pathList;
	};
	const getAttr = (value, path) => getAttrPathList(path).reduce((acc, index) => {
		if (typeof acc !== "object") throw new EndpointError(`Index '${index}' in '${path}' not found in '${JSON.stringify(value)}'`);
		else if (Array.isArray(acc)) return acc[parseInt(index)];
		return acc[index];
	}, value);
	const isSet = (value) => value != null;
	const not = (value) => !value;
	const DEFAULT_PORTS = {
		[types.EndpointURLScheme.HTTP]: 80,
		[types.EndpointURLScheme.HTTPS]: 443
	};
	const parseURL = (value) => {
		const whatwgURL = (() => {
			try {
				if (value instanceof URL) return value;
				if (typeof value === "object" && "hostname" in value) {
					const { hostname: hostname$1, port, protocol: protocol$1 = "", path = "", query = {} } = value;
					const url = new URL(`${protocol$1}//${hostname$1}${port ? `:${port}` : ""}${path}`);
					url.search = Object.entries(query).map(([k, v]) => `${k}=${v}`).join("&");
					return url;
				}
				return new URL(value);
			} catch (error) {
				return null;
			}
		})();
		if (!whatwgURL) {
			console.error(`Unable to parse ${JSON.stringify(value)} as a whatwg URL.`);
			return null;
		}
		const urlString = whatwgURL.href;
		const { host, hostname, pathname, protocol, search } = whatwgURL;
		if (search) return null;
		const scheme = protocol.slice(0, -1);
		if (!Object.values(types.EndpointURLScheme).includes(scheme)) return null;
		const isIp = isIpAddress(hostname);
		return {
			scheme,
			authority: `${host}${urlString.includes(`${host}:${DEFAULT_PORTS[scheme]}`) || typeof value === "string" && value.includes(`${host}:${DEFAULT_PORTS[scheme]}`) ? `:${DEFAULT_PORTS[scheme]}` : ``}`,
			path: pathname,
			normalizedPath: pathname.endsWith("/") ? pathname : `${pathname}/`,
			isIp
		};
	};
	const stringEquals = (value1, value2) => value1 === value2;
	const substring = (input, start, stop, reverse) => {
		if (start >= stop || input.length < stop) return null;
		if (!reverse) return input.substring(start, stop);
		return input.substring(input.length - stop, input.length - start);
	};
	const uriEncode = (value) => encodeURIComponent(value).replace(/[!*'()]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`);
	const endpointFunctions = {
		booleanEquals,
		getAttr,
		isSet,
		isValidHostLabel,
		not,
		parseURL,
		stringEquals,
		substring,
		uriEncode
	};
	const evaluateTemplate = (template, options) => {
		const evaluatedTemplateArr = [];
		const templateContext = {
			...options.endpointParams,
			...options.referenceRecord
		};
		let currentIndex = 0;
		while (currentIndex < template.length) {
			const openingBraceIndex = template.indexOf("{", currentIndex);
			if (openingBraceIndex === -1) {
				evaluatedTemplateArr.push(template.slice(currentIndex));
				break;
			}
			evaluatedTemplateArr.push(template.slice(currentIndex, openingBraceIndex));
			const closingBraceIndex = template.indexOf("}", openingBraceIndex);
			if (closingBraceIndex === -1) {
				evaluatedTemplateArr.push(template.slice(openingBraceIndex));
				break;
			}
			if (template[openingBraceIndex + 1] === "{" && template[closingBraceIndex + 1] === "}") {
				evaluatedTemplateArr.push(template.slice(openingBraceIndex + 1, closingBraceIndex));
				currentIndex = closingBraceIndex + 2;
			}
			const parameterName = template.substring(openingBraceIndex + 1, closingBraceIndex);
			if (parameterName.includes("#")) {
				const [refName, attrName] = parameterName.split("#");
				evaluatedTemplateArr.push(getAttr(templateContext[refName], attrName));
			} else evaluatedTemplateArr.push(templateContext[parameterName]);
			currentIndex = closingBraceIndex + 1;
		}
		return evaluatedTemplateArr.join("");
	};
	const getReferenceValue = ({ ref }, options) => {
		return {
			...options.endpointParams,
			...options.referenceRecord
		}[ref];
	};
	const evaluateExpression = (obj, keyName, options) => {
		if (typeof obj === "string") return evaluateTemplate(obj, options);
		else if (obj["fn"]) return group$2.callFunction(obj, options);
		else if (obj["ref"]) return getReferenceValue(obj, options);
		throw new EndpointError(`'${keyName}': ${String(obj)} is not a string, function or reference.`);
	};
	const callFunction = ({ fn, argv }, options) => {
		const evaluatedArgs = argv.map((arg) => ["boolean", "number"].includes(typeof arg) ? arg : group$2.evaluateExpression(arg, "arg", options));
		const fnSegments = fn.split(".");
		if (fnSegments[0] in customEndpointFunctions && fnSegments[1] != null) return customEndpointFunctions[fnSegments[0]][fnSegments[1]](...evaluatedArgs);
		return endpointFunctions[fn](...evaluatedArgs);
	};
	const group$2 = {
		evaluateExpression,
		callFunction
	};
	const evaluateCondition = ({ assign, ...fnArgs }, options) => {
		if (assign && assign in options.referenceRecord) throw new EndpointError(`'${assign}' is already defined in Reference Record.`);
		const value = callFunction(fnArgs, options);
		options.logger?.debug?.(`${debugId} evaluateCondition: ${toDebugString(fnArgs)} = ${toDebugString(value)}`);
		return {
			result: value === "" ? true : !!value,
			...assign != null && { toAssign: {
				name: assign,
				value
			} }
		};
	};
	const evaluateConditions = (conditions = [], options) => {
		const conditionsReferenceRecord = {};
		for (const condition of conditions) {
			const { result, toAssign } = evaluateCondition(condition, {
				...options,
				referenceRecord: {
					...options.referenceRecord,
					...conditionsReferenceRecord
				}
			});
			if (!result) return { result };
			if (toAssign) {
				conditionsReferenceRecord[toAssign.name] = toAssign.value;
				options.logger?.debug?.(`${debugId} assign: ${toAssign.name} := ${toDebugString(toAssign.value)}`);
			}
		}
		return {
			result: true,
			referenceRecord: conditionsReferenceRecord
		};
	};
	const getEndpointHeaders = (headers, options) => Object.entries(headers).reduce((acc, [headerKey, headerVal]) => ({
		...acc,
		[headerKey]: headerVal.map((headerValEntry) => {
			const processedExpr = evaluateExpression(headerValEntry, "Header value entry", options);
			if (typeof processedExpr !== "string") throw new EndpointError(`Header '${headerKey}' value '${processedExpr}' is not a string`);
			return processedExpr;
		})
	}), {});
	const getEndpointProperties = (properties, options) => Object.entries(properties).reduce((acc, [propertyKey, propertyVal]) => ({
		...acc,
		[propertyKey]: group$1.getEndpointProperty(propertyVal, options)
	}), {});
	const getEndpointProperty = (property, options) => {
		if (Array.isArray(property)) return property.map((propertyEntry) => getEndpointProperty(propertyEntry, options));
		switch (typeof property) {
			case "string": return evaluateTemplate(property, options);
			case "object":
				if (property === null) throw new EndpointError(`Unexpected endpoint property: ${property}`);
				return group$1.getEndpointProperties(property, options);
			case "boolean": return property;
			default: throw new EndpointError(`Unexpected endpoint property type: ${typeof property}`);
		}
	};
	const group$1 = {
		getEndpointProperty,
		getEndpointProperties
	};
	const getEndpointUrl = (endpointUrl, options) => {
		const expression = evaluateExpression(endpointUrl, "Endpoint URL", options);
		if (typeof expression === "string") try {
			return new URL(expression);
		} catch (error) {
			console.error(`Failed to construct URL with ${expression}`, error);
			throw error;
		}
		throw new EndpointError(`Endpoint URL must be a string, got ${typeof expression}`);
	};
	const evaluateEndpointRule = (endpointRule, options) => {
		const { conditions, endpoint } = endpointRule;
		const { result, referenceRecord } = evaluateConditions(conditions, options);
		if (!result) return;
		const endpointRuleOptions = {
			...options,
			referenceRecord: {
				...options.referenceRecord,
				...referenceRecord
			}
		};
		const { url, properties, headers } = endpoint;
		options.logger?.debug?.(`${debugId} Resolving endpoint from template: ${toDebugString(endpoint)}`);
		return {
			...headers != void 0 && { headers: getEndpointHeaders(headers, endpointRuleOptions) },
			...properties != void 0 && { properties: getEndpointProperties(properties, endpointRuleOptions) },
			url: getEndpointUrl(url, endpointRuleOptions)
		};
	};
	const evaluateErrorRule = (errorRule, options) => {
		const { conditions, error } = errorRule;
		const { result, referenceRecord } = evaluateConditions(conditions, options);
		if (!result) return;
		throw new EndpointError(evaluateExpression(error, "Error", {
			...options,
			referenceRecord: {
				...options.referenceRecord,
				...referenceRecord
			}
		}));
	};
	const evaluateRules = (rules, options) => {
		for (const rule of rules) if (rule.type === "endpoint") {
			const endpointOrUndefined = evaluateEndpointRule(rule, options);
			if (endpointOrUndefined) return endpointOrUndefined;
		} else if (rule.type === "error") evaluateErrorRule(rule, options);
		else if (rule.type === "tree") {
			const endpointOrUndefined = group.evaluateTreeRule(rule, options);
			if (endpointOrUndefined) return endpointOrUndefined;
		} else throw new EndpointError(`Unknown endpoint rule: ${rule}`);
		throw new EndpointError(`Rules evaluation failed`);
	};
	const evaluateTreeRule = (treeRule, options) => {
		const { conditions, rules } = treeRule;
		const { result, referenceRecord } = evaluateConditions(conditions, options);
		if (!result) return;
		return group.evaluateRules(rules, {
			...options,
			referenceRecord: {
				...options.referenceRecord,
				...referenceRecord
			}
		});
	};
	const group = {
		evaluateRules,
		evaluateTreeRule
	};
	const resolveEndpoint = (ruleSetObject, options) => {
		const { endpointParams, logger } = options;
		const { parameters, rules } = ruleSetObject;
		options.logger?.debug?.(`${debugId} Initial EndpointParams: ${toDebugString(endpointParams)}`);
		const paramsWithDefault = Object.entries(parameters).filter(([, v]) => v.default != null).map(([k, v]) => [k, v.default]);
		if (paramsWithDefault.length > 0) for (const [paramKey, paramDefaultValue] of paramsWithDefault) endpointParams[paramKey] = endpointParams[paramKey] ?? paramDefaultValue;
		const requiredParams = Object.entries(parameters).filter(([, v]) => v.required).map(([k]) => k);
		for (const requiredParam of requiredParams) if (endpointParams[requiredParam] == null) throw new EndpointError(`Missing required parameter: '${requiredParam}'`);
		const endpoint = evaluateRules(rules, {
			endpointParams,
			logger,
			referenceRecord: {}
		});
		options.logger?.debug?.(`${debugId} Resolved endpoint: ${toDebugString(endpoint)}`);
		return endpoint;
	};
	exports.EndpointCache = EndpointCache;
	exports.EndpointError = EndpointError;
	exports.customEndpointFunctions = customEndpointFunctions;
	exports.isIpAddress = isIpAddress;
	exports.isValidHostLabel = isValidHostLabel;
	exports.resolveEndpoint = resolveEndpoint;
}));

//#endregion
//#region ../node_modules/.pnpm/@aws-sdk+util-endpoints@3.936.0/node_modules/@aws-sdk/util-endpoints/dist-cjs/index.js
var require_dist_cjs$15 = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	var utilEndpoints = require_dist_cjs$16();
	var urlParser = require_dist_cjs$40.require_dist_cjs$1();
	const isVirtualHostableS3Bucket = (value, allowSubDomains = false) => {
		if (allowSubDomains) {
			for (const label of value.split(".")) if (!isVirtualHostableS3Bucket(label)) return false;
			return true;
		}
		if (!utilEndpoints.isValidHostLabel(value)) return false;
		if (value.length < 3 || value.length > 63) return false;
		if (value !== value.toLowerCase()) return false;
		if (utilEndpoints.isIpAddress(value)) return false;
		return true;
	};
	const ARN_DELIMITER = ":";
	const RESOURCE_DELIMITER = "/";
	const parseArn = (value) => {
		const segments = value.split(ARN_DELIMITER);
		if (segments.length < 6) return null;
		const [arn, partition, service, region, accountId, ...resourcePath] = segments;
		if (arn !== "arn" || partition === "" || service === "" || resourcePath.join(ARN_DELIMITER) === "") return null;
		return {
			partition,
			service,
			region,
			accountId,
			resourceId: resourcePath.map((resource) => resource.split(RESOURCE_DELIMITER)).flat()
		};
	};
	var partitionsInfo = {
		partitions: [
			{
				id: "aws",
				outputs: {
					dnsSuffix: "amazonaws.com",
					dualStackDnsSuffix: "api.aws",
					implicitGlobalRegion: "us-east-1",
					name: "aws",
					supportsDualStack: true,
					supportsFIPS: true
				},
				regionRegex: "^(us|eu|ap|sa|ca|me|af|il|mx)\\-\\w+\\-\\d+$",
				regions: {
					"af-south-1": { description: "Africa (Cape Town)" },
					"ap-east-1": { description: "Asia Pacific (Hong Kong)" },
					"ap-east-2": { description: "Asia Pacific (Taipei)" },
					"ap-northeast-1": { description: "Asia Pacific (Tokyo)" },
					"ap-northeast-2": { description: "Asia Pacific (Seoul)" },
					"ap-northeast-3": { description: "Asia Pacific (Osaka)" },
					"ap-south-1": { description: "Asia Pacific (Mumbai)" },
					"ap-south-2": { description: "Asia Pacific (Hyderabad)" },
					"ap-southeast-1": { description: "Asia Pacific (Singapore)" },
					"ap-southeast-2": { description: "Asia Pacific (Sydney)" },
					"ap-southeast-3": { description: "Asia Pacific (Jakarta)" },
					"ap-southeast-4": { description: "Asia Pacific (Melbourne)" },
					"ap-southeast-5": { description: "Asia Pacific (Malaysia)" },
					"ap-southeast-6": { description: "Asia Pacific (New Zealand)" },
					"ap-southeast-7": { description: "Asia Pacific (Thailand)" },
					"aws-global": { description: "aws global region" },
					"ca-central-1": { description: "Canada (Central)" },
					"ca-west-1": { description: "Canada West (Calgary)" },
					"eu-central-1": { description: "Europe (Frankfurt)" },
					"eu-central-2": { description: "Europe (Zurich)" },
					"eu-north-1": { description: "Europe (Stockholm)" },
					"eu-south-1": { description: "Europe (Milan)" },
					"eu-south-2": { description: "Europe (Spain)" },
					"eu-west-1": { description: "Europe (Ireland)" },
					"eu-west-2": { description: "Europe (London)" },
					"eu-west-3": { description: "Europe (Paris)" },
					"il-central-1": { description: "Israel (Tel Aviv)" },
					"me-central-1": { description: "Middle East (UAE)" },
					"me-south-1": { description: "Middle East (Bahrain)" },
					"mx-central-1": { description: "Mexico (Central)" },
					"sa-east-1": { description: "South America (Sao Paulo)" },
					"us-east-1": { description: "US East (N. Virginia)" },
					"us-east-2": { description: "US East (Ohio)" },
					"us-west-1": { description: "US West (N. California)" },
					"us-west-2": { description: "US West (Oregon)" }
				}
			},
			{
				id: "aws-cn",
				outputs: {
					dnsSuffix: "amazonaws.com.cn",
					dualStackDnsSuffix: "api.amazonwebservices.com.cn",
					implicitGlobalRegion: "cn-northwest-1",
					name: "aws-cn",
					supportsDualStack: true,
					supportsFIPS: true
				},
				regionRegex: "^cn\\-\\w+\\-\\d+$",
				regions: {
					"aws-cn-global": { description: "aws-cn global region" },
					"cn-north-1": { description: "China (Beijing)" },
					"cn-northwest-1": { description: "China (Ningxia)" }
				}
			},
			{
				id: "aws-eusc",
				outputs: {
					dnsSuffix: "amazonaws.eu",
					dualStackDnsSuffix: "api.amazonwebservices.eu",
					implicitGlobalRegion: "eusc-de-east-1",
					name: "aws-eusc",
					supportsDualStack: true,
					supportsFIPS: true
				},
				regionRegex: "^eusc\\-(de)\\-\\w+\\-\\d+$",
				regions: { "eusc-de-east-1": { description: "EU (Germany)" } }
			},
			{
				id: "aws-iso",
				outputs: {
					dnsSuffix: "c2s.ic.gov",
					dualStackDnsSuffix: "api.aws.ic.gov",
					implicitGlobalRegion: "us-iso-east-1",
					name: "aws-iso",
					supportsDualStack: true,
					supportsFIPS: true
				},
				regionRegex: "^us\\-iso\\-\\w+\\-\\d+$",
				regions: {
					"aws-iso-global": { description: "aws-iso global region" },
					"us-iso-east-1": { description: "US ISO East" },
					"us-iso-west-1": { description: "US ISO WEST" }
				}
			},
			{
				id: "aws-iso-b",
				outputs: {
					dnsSuffix: "sc2s.sgov.gov",
					dualStackDnsSuffix: "api.aws.scloud",
					implicitGlobalRegion: "us-isob-east-1",
					name: "aws-iso-b",
					supportsDualStack: true,
					supportsFIPS: true
				},
				regionRegex: "^us\\-isob\\-\\w+\\-\\d+$",
				regions: {
					"aws-iso-b-global": { description: "aws-iso-b global region" },
					"us-isob-east-1": { description: "US ISOB East (Ohio)" },
					"us-isob-west-1": { description: "US ISOB West" }
				}
			},
			{
				id: "aws-iso-e",
				outputs: {
					dnsSuffix: "cloud.adc-e.uk",
					dualStackDnsSuffix: "api.cloud-aws.adc-e.uk",
					implicitGlobalRegion: "eu-isoe-west-1",
					name: "aws-iso-e",
					supportsDualStack: true,
					supportsFIPS: true
				},
				regionRegex: "^eu\\-isoe\\-\\w+\\-\\d+$",
				regions: {
					"aws-iso-e-global": { description: "aws-iso-e global region" },
					"eu-isoe-west-1": { description: "EU ISOE West" }
				}
			},
			{
				id: "aws-iso-f",
				outputs: {
					dnsSuffix: "csp.hci.ic.gov",
					dualStackDnsSuffix: "api.aws.hci.ic.gov",
					implicitGlobalRegion: "us-isof-south-1",
					name: "aws-iso-f",
					supportsDualStack: true,
					supportsFIPS: true
				},
				regionRegex: "^us\\-isof\\-\\w+\\-\\d+$",
				regions: {
					"aws-iso-f-global": { description: "aws-iso-f global region" },
					"us-isof-east-1": { description: "US ISOF EAST" },
					"us-isof-south-1": { description: "US ISOF SOUTH" }
				}
			},
			{
				id: "aws-us-gov",
				outputs: {
					dnsSuffix: "amazonaws.com",
					dualStackDnsSuffix: "api.aws",
					implicitGlobalRegion: "us-gov-west-1",
					name: "aws-us-gov",
					supportsDualStack: true,
					supportsFIPS: true
				},
				regionRegex: "^us\\-gov\\-\\w+\\-\\d+$",
				regions: {
					"aws-us-gov-global": { description: "aws-us-gov global region" },
					"us-gov-east-1": { description: "AWS GovCloud (US-East)" },
					"us-gov-west-1": { description: "AWS GovCloud (US-West)" }
				}
			}
		],
		version: "1.1"
	};
	let selectedPartitionsInfo = partitionsInfo;
	let selectedUserAgentPrefix = "";
	const partition = (value) => {
		const { partitions } = selectedPartitionsInfo;
		for (const partition of partitions) {
			const { regions, outputs } = partition;
			for (const [region, regionData] of Object.entries(regions)) if (region === value) return {
				...outputs,
				...regionData
			};
		}
		for (const partition of partitions) {
			const { regionRegex, outputs } = partition;
			if (new RegExp(regionRegex).test(value)) return { ...outputs };
		}
		const DEFAULT_PARTITION = partitions.find((partition) => partition.id === "aws");
		if (!DEFAULT_PARTITION) throw new Error("Provided region was not found in the partition array or regex, and default partition with id 'aws' doesn't exist.");
		return { ...DEFAULT_PARTITION.outputs };
	};
	const setPartitionInfo = (partitionsInfo, userAgentPrefix = "") => {
		selectedPartitionsInfo = partitionsInfo;
		selectedUserAgentPrefix = userAgentPrefix;
	};
	const useDefaultPartitionInfo = () => {
		setPartitionInfo(partitionsInfo, "");
	};
	const getUserAgentPrefix = () => selectedUserAgentPrefix;
	const awsEndpointFunctions = {
		isVirtualHostableS3Bucket,
		parseArn,
		partition
	};
	utilEndpoints.customEndpointFunctions.aws = awsEndpointFunctions;
	const resolveDefaultAwsRegionalEndpointsConfig = (input) => {
		if (typeof input.endpointProvider !== "function") throw new Error("@aws-sdk/util-endpoint - endpointProvider and endpoint missing in config for this client.");
		const { endpoint } = input;
		if (endpoint === void 0) input.endpoint = async () => {
			return toEndpointV1(input.endpointProvider({
				Region: typeof input.region === "function" ? await input.region() : input.region,
				UseDualStack: typeof input.useDualstackEndpoint === "function" ? await input.useDualstackEndpoint() : input.useDualstackEndpoint,
				UseFIPS: typeof input.useFipsEndpoint === "function" ? await input.useFipsEndpoint() : input.useFipsEndpoint,
				Endpoint: void 0
			}, { logger: input.logger }));
		};
		return input;
	};
	const toEndpointV1 = (endpoint) => urlParser.parseUrl(endpoint.url);
	Object.defineProperty(exports, "EndpointError", {
		enumerable: true,
		get: function() {
			return utilEndpoints.EndpointError;
		}
	});
	Object.defineProperty(exports, "isIpAddress", {
		enumerable: true,
		get: function() {
			return utilEndpoints.isIpAddress;
		}
	});
	Object.defineProperty(exports, "resolveEndpoint", {
		enumerable: true,
		get: function() {
			return utilEndpoints.resolveEndpoint;
		}
	});
	exports.awsEndpointFunctions = awsEndpointFunctions;
	exports.getUserAgentPrefix = getUserAgentPrefix;
	exports.partition = partition;
	exports.resolveDefaultAwsRegionalEndpointsConfig = resolveDefaultAwsRegionalEndpointsConfig;
	exports.setPartitionInfo = setPartitionInfo;
	exports.toEndpointV1 = toEndpointV1;
	exports.useDefaultPartitionInfo = useDefaultPartitionInfo;
}));

//#endregion
//#region ../node_modules/.pnpm/@aws-sdk+core@3.940.0/node_modules/@aws-sdk/core/dist-es/submodules/httpAuthSchemes/utils/getDateHeader.js
var import_dist_cjs$24, getDateHeader;
var init_getDateHeader = require_chunk.__esmMin((() => {
	import_dist_cjs$24 = require_dist_cjs$37.require_dist_cjs();
	getDateHeader = (response) => import_dist_cjs$24.HttpResponse.isInstance(response) ? response.headers?.date ?? response.headers?.Date : void 0;
}));

//#endregion
//#region ../node_modules/.pnpm/@aws-sdk+core@3.940.0/node_modules/@aws-sdk/core/dist-es/submodules/httpAuthSchemes/utils/getSkewCorrectedDate.js
var getSkewCorrectedDate;
var init_getSkewCorrectedDate = require_chunk.__esmMin((() => {
	getSkewCorrectedDate = (systemClockOffset) => new Date(Date.now() + systemClockOffset);
}));

//#endregion
//#region ../node_modules/.pnpm/@aws-sdk+core@3.940.0/node_modules/@aws-sdk/core/dist-es/submodules/httpAuthSchemes/utils/isClockSkewed.js
var isClockSkewed;
var init_isClockSkewed = require_chunk.__esmMin((() => {
	init_getSkewCorrectedDate();
	isClockSkewed = (clockTime, systemClockOffset) => Math.abs(getSkewCorrectedDate(systemClockOffset).getTime() - clockTime) >= 3e5;
}));

//#endregion
//#region ../node_modules/.pnpm/@aws-sdk+core@3.940.0/node_modules/@aws-sdk/core/dist-es/submodules/httpAuthSchemes/utils/getUpdatedSystemClockOffset.js
var getUpdatedSystemClockOffset;
var init_getUpdatedSystemClockOffset = require_chunk.__esmMin((() => {
	init_isClockSkewed();
	getUpdatedSystemClockOffset = (clockTime, currentSystemClockOffset) => {
		const clockTimeInMs = Date.parse(clockTime);
		if (isClockSkewed(clockTimeInMs, currentSystemClockOffset)) return clockTimeInMs - Date.now();
		return currentSystemClockOffset;
	};
}));

//#endregion
//#region ../node_modules/.pnpm/@aws-sdk+core@3.940.0/node_modules/@aws-sdk/core/dist-es/submodules/httpAuthSchemes/utils/index.js
var init_utils = require_chunk.__esmMin((() => {
	init_getDateHeader();
	init_getSkewCorrectedDate();
	init_getUpdatedSystemClockOffset();
}));

//#endregion
//#region ../node_modules/.pnpm/@aws-sdk+core@3.940.0/node_modules/@aws-sdk/core/dist-es/submodules/httpAuthSchemes/aws_sdk/AwsSdkSigV4Signer.js
var import_dist_cjs$23, throwSigningPropertyError, validateSigningProperties, AwsSdkSigV4Signer, AWSSDKSigV4Signer;
var init_AwsSdkSigV4Signer = require_chunk.__esmMin((() => {
	import_dist_cjs$23 = require_dist_cjs$37.require_dist_cjs();
	init_utils();
	throwSigningPropertyError = (name, property) => {
		if (!property) throw new Error(`Property \`${name}\` is not resolved for AWS SDK SigV4Auth`);
		return property;
	};
	validateSigningProperties = async (signingProperties) => {
		const context = throwSigningPropertyError("context", signingProperties.context);
		const config = throwSigningPropertyError("config", signingProperties.config);
		const authScheme = context.endpointV2?.properties?.authSchemes?.[0];
		return {
			config,
			signer: await throwSigningPropertyError("signer", config.signer)(authScheme),
			signingRegion: signingProperties?.signingRegion,
			signingRegionSet: signingProperties?.signingRegionSet,
			signingName: signingProperties?.signingName
		};
	};
	AwsSdkSigV4Signer = class {
		async sign(httpRequest, identity, signingProperties) {
			if (!import_dist_cjs$23.HttpRequest.isInstance(httpRequest)) throw new Error("The request is not an instance of `HttpRequest` and cannot be signed");
			const validatedProps = await validateSigningProperties(signingProperties);
			const { config, signer } = validatedProps;
			let { signingRegion, signingName } = validatedProps;
			const handlerExecutionContext = signingProperties.context;
			if (handlerExecutionContext?.authSchemes?.length ?? false) {
				const [first, second] = handlerExecutionContext.authSchemes;
				if (first?.name === "sigv4a" && second?.name === "sigv4") {
					signingRegion = second?.signingRegion ?? signingRegion;
					signingName = second?.signingName ?? signingName;
				}
			}
			return await signer.sign(httpRequest, {
				signingDate: getSkewCorrectedDate(config.systemClockOffset),
				signingRegion,
				signingService: signingName
			});
		}
		errorHandler(signingProperties) {
			return (error) => {
				const serverTime = error.ServerTime ?? getDateHeader(error.$response);
				if (serverTime) {
					const config = throwSigningPropertyError("config", signingProperties.config);
					const initialSystemClockOffset = config.systemClockOffset;
					config.systemClockOffset = getUpdatedSystemClockOffset(serverTime, config.systemClockOffset);
					if (config.systemClockOffset !== initialSystemClockOffset && error.$metadata) error.$metadata.clockSkewCorrected = true;
				}
				throw error;
			};
		}
		successHandler(httpResponse, signingProperties) {
			const dateHeader = getDateHeader(httpResponse);
			if (dateHeader) {
				const config = throwSigningPropertyError("config", signingProperties.config);
				config.systemClockOffset = getUpdatedSystemClockOffset(dateHeader, config.systemClockOffset);
			}
		}
	};
	AWSSDKSigV4Signer = AwsSdkSigV4Signer;
}));

//#endregion
//#region ../node_modules/.pnpm/@aws-sdk+core@3.940.0/node_modules/@aws-sdk/core/dist-es/submodules/httpAuthSchemes/aws_sdk/AwsSdkSigV4ASigner.js
var import_dist_cjs$22, AwsSdkSigV4ASigner;
var init_AwsSdkSigV4ASigner = require_chunk.__esmMin((() => {
	import_dist_cjs$22 = require_dist_cjs$37.require_dist_cjs();
	init_utils();
	init_AwsSdkSigV4Signer();
	AwsSdkSigV4ASigner = class extends AwsSdkSigV4Signer {
		async sign(httpRequest, identity, signingProperties) {
			if (!import_dist_cjs$22.HttpRequest.isInstance(httpRequest)) throw new Error("The request is not an instance of `HttpRequest` and cannot be signed");
			const { config, signer, signingRegion, signingRegionSet, signingName } = await validateSigningProperties(signingProperties);
			const multiRegionOverride = (await config.sigv4aSigningRegionSet?.() ?? signingRegionSet ?? [signingRegion]).join(",");
			return await signer.sign(httpRequest, {
				signingDate: getSkewCorrectedDate(config.systemClockOffset),
				signingRegion: multiRegionOverride,
				signingService: signingName
			});
		}
	};
}));

//#endregion
//#region ../node_modules/.pnpm/@aws-sdk+core@3.940.0/node_modules/@aws-sdk/core/dist-es/submodules/httpAuthSchemes/utils/getArrayForCommaSeparatedString.js
var getArrayForCommaSeparatedString;
var init_getArrayForCommaSeparatedString = require_chunk.__esmMin((() => {
	getArrayForCommaSeparatedString = (str) => typeof str === "string" && str.length > 0 ? str.split(",").map((item) => item.trim()) : [];
}));

//#endregion
//#region ../node_modules/.pnpm/@aws-sdk+core@3.940.0/node_modules/@aws-sdk/core/dist-es/submodules/httpAuthSchemes/utils/getBearerTokenEnvKey.js
var getBearerTokenEnvKey;
var init_getBearerTokenEnvKey = require_chunk.__esmMin((() => {
	getBearerTokenEnvKey = (signingName) => `AWS_BEARER_TOKEN_${signingName.replace(/[\s-]/g, "_").toUpperCase()}`;
}));

//#endregion
//#region ../node_modules/.pnpm/@aws-sdk+core@3.940.0/node_modules/@aws-sdk/core/dist-es/submodules/httpAuthSchemes/aws_sdk/NODE_AUTH_SCHEME_PREFERENCE_OPTIONS.js
var NODE_AUTH_SCHEME_PREFERENCE_ENV_KEY, NODE_AUTH_SCHEME_PREFERENCE_CONFIG_KEY, NODE_AUTH_SCHEME_PREFERENCE_OPTIONS;
var init_NODE_AUTH_SCHEME_PREFERENCE_OPTIONS = require_chunk.__esmMin((() => {
	init_getArrayForCommaSeparatedString();
	init_getBearerTokenEnvKey();
	NODE_AUTH_SCHEME_PREFERENCE_ENV_KEY = "AWS_AUTH_SCHEME_PREFERENCE";
	NODE_AUTH_SCHEME_PREFERENCE_CONFIG_KEY = "auth_scheme_preference";
	NODE_AUTH_SCHEME_PREFERENCE_OPTIONS = {
		environmentVariableSelector: (env, options) => {
			if (options?.signingName) {
				if (getBearerTokenEnvKey(options.signingName) in env) return ["httpBearerAuth"];
			}
			if (!(NODE_AUTH_SCHEME_PREFERENCE_ENV_KEY in env)) return void 0;
			return getArrayForCommaSeparatedString(env[NODE_AUTH_SCHEME_PREFERENCE_ENV_KEY]);
		},
		configFileSelector: (profile) => {
			if (!(NODE_AUTH_SCHEME_PREFERENCE_CONFIG_KEY in profile)) return void 0;
			return getArrayForCommaSeparatedString(profile[NODE_AUTH_SCHEME_PREFERENCE_CONFIG_KEY]);
		},
		default: []
	};
}));

//#endregion
//#region ../node_modules/.pnpm/@aws-sdk+core@3.940.0/node_modules/@aws-sdk/core/dist-es/submodules/httpAuthSchemes/aws_sdk/resolveAwsSdkSigV4AConfig.js
var import_dist_cjs$21, resolveAwsSdkSigV4AConfig, NODE_SIGV4A_CONFIG_OPTIONS;
var init_resolveAwsSdkSigV4AConfig = require_chunk.__esmMin((() => {
	init_dist_es$1();
	import_dist_cjs$21 = require_dist_cjs$41.require_dist_cjs();
	resolveAwsSdkSigV4AConfig = (config) => {
		config.sigv4aSigningRegionSet = normalizeProvider(config.sigv4aSigningRegionSet);
		return config;
	};
	NODE_SIGV4A_CONFIG_OPTIONS = {
		environmentVariableSelector(env) {
			if (env.AWS_SIGV4A_SIGNING_REGION_SET) return env.AWS_SIGV4A_SIGNING_REGION_SET.split(",").map((_) => _.trim());
			throw new import_dist_cjs$21.ProviderError("AWS_SIGV4A_SIGNING_REGION_SET not set in env.", { tryNextLink: true });
		},
		configFileSelector(profile) {
			if (profile.sigv4a_signing_region_set) return (profile.sigv4a_signing_region_set ?? "").split(",").map((_) => _.trim());
			throw new import_dist_cjs$21.ProviderError("sigv4a_signing_region_set not set in profile.", { tryNextLink: true });
		},
		default: void 0
	};
}));

//#endregion
//#region ../node_modules/.pnpm/@smithy+signature-v4@5.3.5/node_modules/@smithy/signature-v4/dist-cjs/index.js
var require_dist_cjs$14 = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	var utilHexEncoding = require_dist_cjs$38.require_dist_cjs$3();
	var utilUtf8 = require_dist_cjs$39.require_dist_cjs();
	var isArrayBuffer = require_dist_cjs$39.require_dist_cjs$2();
	var protocolHttp = require_dist_cjs$37.require_dist_cjs();
	var utilMiddleware = require_dist_cjs$38.require_dist_cjs$7();
	var utilUriEscape = require_dist_cjs$38.require_dist_cjs$5();
	const ALGORITHM_QUERY_PARAM = "X-Amz-Algorithm";
	const CREDENTIAL_QUERY_PARAM = "X-Amz-Credential";
	const AMZ_DATE_QUERY_PARAM = "X-Amz-Date";
	const SIGNED_HEADERS_QUERY_PARAM = "X-Amz-SignedHeaders";
	const EXPIRES_QUERY_PARAM = "X-Amz-Expires";
	const SIGNATURE_QUERY_PARAM = "X-Amz-Signature";
	const TOKEN_QUERY_PARAM = "X-Amz-Security-Token";
	const AUTH_HEADER = "authorization";
	const AMZ_DATE_HEADER = AMZ_DATE_QUERY_PARAM.toLowerCase();
	const DATE_HEADER = "date";
	const GENERATED_HEADERS = [
		AUTH_HEADER,
		AMZ_DATE_HEADER,
		DATE_HEADER
	];
	const SIGNATURE_HEADER = SIGNATURE_QUERY_PARAM.toLowerCase();
	const SHA256_HEADER = "x-amz-content-sha256";
	const TOKEN_HEADER = TOKEN_QUERY_PARAM.toLowerCase();
	const ALWAYS_UNSIGNABLE_HEADERS = {
		authorization: true,
		"cache-control": true,
		connection: true,
		expect: true,
		from: true,
		"keep-alive": true,
		"max-forwards": true,
		pragma: true,
		referer: true,
		te: true,
		trailer: true,
		"transfer-encoding": true,
		upgrade: true,
		"user-agent": true,
		"x-amzn-trace-id": true
	};
	const PROXY_HEADER_PATTERN = /^proxy-/;
	const SEC_HEADER_PATTERN = /^sec-/;
	const ALGORITHM_IDENTIFIER = "AWS4-HMAC-SHA256";
	const EVENT_ALGORITHM_IDENTIFIER = "AWS4-HMAC-SHA256-PAYLOAD";
	const UNSIGNED_PAYLOAD = "UNSIGNED-PAYLOAD";
	const MAX_CACHE_SIZE = 50;
	const KEY_TYPE_IDENTIFIER = "aws4_request";
	const MAX_PRESIGNED_TTL = 3600 * 24 * 7;
	const signingKeyCache = {};
	const cacheQueue = [];
	const createScope = (shortDate, region, service) => `${shortDate}/${region}/${service}/${KEY_TYPE_IDENTIFIER}`;
	const getSigningKey = async (sha256Constructor, credentials, shortDate, region, service) => {
		const credsHash = await hmac(sha256Constructor, credentials.secretAccessKey, credentials.accessKeyId);
		const cacheKey = `${shortDate}:${region}:${service}:${utilHexEncoding.toHex(credsHash)}:${credentials.sessionToken}`;
		if (cacheKey in signingKeyCache) return signingKeyCache[cacheKey];
		cacheQueue.push(cacheKey);
		while (cacheQueue.length > MAX_CACHE_SIZE) delete signingKeyCache[cacheQueue.shift()];
		let key = `AWS4${credentials.secretAccessKey}`;
		for (const signable of [
			shortDate,
			region,
			service,
			KEY_TYPE_IDENTIFIER
		]) key = await hmac(sha256Constructor, key, signable);
		return signingKeyCache[cacheKey] = key;
	};
	const hmac = (ctor, secret, data$1) => {
		const hash = new ctor(secret);
		hash.update(utilUtf8.toUint8Array(data$1));
		return hash.digest();
	};
	const getCanonicalHeaders = ({ headers }, unsignableHeaders, signableHeaders) => {
		const canonical = {};
		for (const headerName of Object.keys(headers).sort()) {
			if (headers[headerName] == void 0) continue;
			const canonicalHeaderName = headerName.toLowerCase();
			if (canonicalHeaderName in ALWAYS_UNSIGNABLE_HEADERS || unsignableHeaders?.has(canonicalHeaderName) || PROXY_HEADER_PATTERN.test(canonicalHeaderName) || SEC_HEADER_PATTERN.test(canonicalHeaderName)) {
				if (!signableHeaders || signableHeaders && !signableHeaders.has(canonicalHeaderName)) continue;
			}
			canonical[canonicalHeaderName] = headers[headerName].trim().replace(/\s+/g, " ");
		}
		return canonical;
	};
	const getPayloadHash = async ({ headers, body }, hashConstructor) => {
		for (const headerName of Object.keys(headers)) if (headerName.toLowerCase() === SHA256_HEADER) return headers[headerName];
		if (body == void 0) return "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";
		else if (typeof body === "string" || ArrayBuffer.isView(body) || isArrayBuffer.isArrayBuffer(body)) {
			const hashCtor = new hashConstructor();
			hashCtor.update(utilUtf8.toUint8Array(body));
			return utilHexEncoding.toHex(await hashCtor.digest());
		}
		return UNSIGNED_PAYLOAD;
	};
	var HeaderFormatter = class {
		format(headers) {
			const chunks = [];
			for (const headerName of Object.keys(headers)) {
				const bytes = utilUtf8.fromUtf8(headerName);
				chunks.push(Uint8Array.from([bytes.byteLength]), bytes, this.formatHeaderValue(headers[headerName]));
			}
			const out = new Uint8Array(chunks.reduce((carry, bytes) => carry + bytes.byteLength, 0));
			let position = 0;
			for (const chunk of chunks) {
				out.set(chunk, position);
				position += chunk.byteLength;
			}
			return out;
		}
		formatHeaderValue(header) {
			switch (header.type) {
				case "boolean": return Uint8Array.from([header.value ? 0 : 1]);
				case "byte": return Uint8Array.from([2, header.value]);
				case "short":
					const shortView = /* @__PURE__ */ new DataView(/* @__PURE__ */ new ArrayBuffer(3));
					shortView.setUint8(0, 3);
					shortView.setInt16(1, header.value, false);
					return new Uint8Array(shortView.buffer);
				case "integer":
					const intView = /* @__PURE__ */ new DataView(/* @__PURE__ */ new ArrayBuffer(5));
					intView.setUint8(0, 4);
					intView.setInt32(1, header.value, false);
					return new Uint8Array(intView.buffer);
				case "long":
					const longBytes = new Uint8Array(9);
					longBytes[0] = 5;
					longBytes.set(header.value.bytes, 1);
					return longBytes;
				case "binary":
					const binView = new DataView(new ArrayBuffer(3 + header.value.byteLength));
					binView.setUint8(0, 6);
					binView.setUint16(1, header.value.byteLength, false);
					const binBytes = new Uint8Array(binView.buffer);
					binBytes.set(header.value, 3);
					return binBytes;
				case "string":
					const utf8Bytes = utilUtf8.fromUtf8(header.value);
					const strView = new DataView(new ArrayBuffer(3 + utf8Bytes.byteLength));
					strView.setUint8(0, 7);
					strView.setUint16(1, utf8Bytes.byteLength, false);
					const strBytes = new Uint8Array(strView.buffer);
					strBytes.set(utf8Bytes, 3);
					return strBytes;
				case "timestamp":
					const tsBytes = new Uint8Array(9);
					tsBytes[0] = 8;
					tsBytes.set(Int64.fromNumber(header.value.valueOf()).bytes, 1);
					return tsBytes;
				case "uuid":
					if (!UUID_PATTERN.test(header.value)) throw new Error(`Invalid UUID received: ${header.value}`);
					const uuidBytes = new Uint8Array(17);
					uuidBytes[0] = 9;
					uuidBytes.set(utilHexEncoding.fromHex(header.value.replace(/\-/g, "")), 1);
					return uuidBytes;
			}
		}
	};
	const UUID_PATTERN = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/;
	var Int64 = class Int64 {
		bytes;
		constructor(bytes) {
			this.bytes = bytes;
			if (bytes.byteLength !== 8) throw new Error("Int64 buffers must be exactly 8 bytes");
		}
		static fromNumber(number) {
			if (number > 0x8000000000000000 || number < -0x8000000000000000) throw new Error(`${number} is too large (or, if negative, too small) to represent as an Int64`);
			const bytes = new Uint8Array(8);
			for (let i = 7, remaining = Math.abs(Math.round(number)); i > -1 && remaining > 0; i--, remaining /= 256) bytes[i] = remaining;
			if (number < 0) negate(bytes);
			return new Int64(bytes);
		}
		valueOf() {
			const bytes = this.bytes.slice(0);
			const negative = bytes[0] & 128;
			if (negative) negate(bytes);
			return parseInt(utilHexEncoding.toHex(bytes), 16) * (negative ? -1 : 1);
		}
		toString() {
			return String(this.valueOf());
		}
	};
	function negate(bytes) {
		for (let i = 0; i < 8; i++) bytes[i] ^= 255;
		for (let i = 7; i > -1; i--) {
			bytes[i]++;
			if (bytes[i] !== 0) break;
		}
	}
	const hasHeader = (soughtHeader, headers) => {
		soughtHeader = soughtHeader.toLowerCase();
		for (const headerName of Object.keys(headers)) if (soughtHeader === headerName.toLowerCase()) return true;
		return false;
	};
	const moveHeadersToQuery = (request, options = {}) => {
		const { headers, query = {} } = protocolHttp.HttpRequest.clone(request);
		for (const name of Object.keys(headers)) {
			const lname = name.toLowerCase();
			if (lname.slice(0, 6) === "x-amz-" && !options.unhoistableHeaders?.has(lname) || options.hoistableHeaders?.has(lname)) {
				query[name] = headers[name];
				delete headers[name];
			}
		}
		return {
			...request,
			headers,
			query
		};
	};
	const prepareRequest = (request) => {
		request = protocolHttp.HttpRequest.clone(request);
		for (const headerName of Object.keys(request.headers)) if (GENERATED_HEADERS.indexOf(headerName.toLowerCase()) > -1) delete request.headers[headerName];
		return request;
	};
	const getCanonicalQuery = ({ query = {} }) => {
		const keys = [];
		const serialized = {};
		for (const key of Object.keys(query)) {
			if (key.toLowerCase() === SIGNATURE_HEADER) continue;
			const encodedKey = utilUriEscape.escapeUri(key);
			keys.push(encodedKey);
			const value = query[key];
			if (typeof value === "string") serialized[encodedKey] = `${encodedKey}=${utilUriEscape.escapeUri(value)}`;
			else if (Array.isArray(value)) serialized[encodedKey] = value.slice(0).reduce((encoded, value$1) => encoded.concat([`${encodedKey}=${utilUriEscape.escapeUri(value$1)}`]), []).sort().join("&");
		}
		return keys.sort().map((key) => serialized[key]).filter((serialized$1) => serialized$1).join("&");
	};
	const iso8601 = (time) => toDate(time).toISOString().replace(/\.\d{3}Z$/, "Z");
	const toDate = (time) => {
		if (typeof time === "number") return /* @__PURE__ */ new Date(time * 1e3);
		if (typeof time === "string") {
			if (Number(time)) return /* @__PURE__ */ new Date(Number(time) * 1e3);
			return new Date(time);
		}
		return time;
	};
	var SignatureV4Base = class {
		service;
		regionProvider;
		credentialProvider;
		sha256;
		uriEscapePath;
		applyChecksum;
		constructor({ applyChecksum, credentials, region, service, sha256, uriEscapePath = true }) {
			this.service = service;
			this.sha256 = sha256;
			this.uriEscapePath = uriEscapePath;
			this.applyChecksum = typeof applyChecksum === "boolean" ? applyChecksum : true;
			this.regionProvider = utilMiddleware.normalizeProvider(region);
			this.credentialProvider = utilMiddleware.normalizeProvider(credentials);
		}
		createCanonicalRequest(request, canonicalHeaders, payloadHash) {
			const sortedHeaders = Object.keys(canonicalHeaders).sort();
			return `${request.method}
${this.getCanonicalPath(request)}
${getCanonicalQuery(request)}
${sortedHeaders.map((name) => `${name}:${canonicalHeaders[name]}`).join("\n")}

${sortedHeaders.join(";")}
${payloadHash}`;
		}
		async createStringToSign(longDate, credentialScope, canonicalRequest, algorithmIdentifier) {
			const hash = new this.sha256();
			hash.update(utilUtf8.toUint8Array(canonicalRequest));
			const hashedRequest = await hash.digest();
			return `${algorithmIdentifier}
${longDate}
${credentialScope}
${utilHexEncoding.toHex(hashedRequest)}`;
		}
		getCanonicalPath({ path }) {
			if (this.uriEscapePath) {
				const normalizedPathSegments = [];
				for (const pathSegment of path.split("/")) {
					if (pathSegment?.length === 0) continue;
					if (pathSegment === ".") continue;
					if (pathSegment === "..") normalizedPathSegments.pop();
					else normalizedPathSegments.push(pathSegment);
				}
				const normalizedPath = `${path?.startsWith("/") ? "/" : ""}${normalizedPathSegments.join("/")}${normalizedPathSegments.length > 0 && path?.endsWith("/") ? "/" : ""}`;
				return utilUriEscape.escapeUri(normalizedPath).replace(/%2F/g, "/");
			}
			return path;
		}
		validateResolvedCredentials(credentials) {
			if (typeof credentials !== "object" || typeof credentials.accessKeyId !== "string" || typeof credentials.secretAccessKey !== "string") throw new Error("Resolved credential object is not valid");
		}
		formatDate(now) {
			const longDate = iso8601(now).replace(/[\-:]/g, "");
			return {
				longDate,
				shortDate: longDate.slice(0, 8)
			};
		}
		getCanonicalHeaderList(headers) {
			return Object.keys(headers).sort().join(";");
		}
	};
	var SignatureV4 = class extends SignatureV4Base {
		headerFormatter = new HeaderFormatter();
		constructor({ applyChecksum, credentials, region, service, sha256, uriEscapePath = true }) {
			super({
				applyChecksum,
				credentials,
				region,
				service,
				sha256,
				uriEscapePath
			});
		}
		async presign(originalRequest, options = {}) {
			const { signingDate = /* @__PURE__ */ new Date(), expiresIn = 3600, unsignableHeaders, unhoistableHeaders, signableHeaders, hoistableHeaders, signingRegion, signingService } = options;
			const credentials = await this.credentialProvider();
			this.validateResolvedCredentials(credentials);
			const region = signingRegion ?? await this.regionProvider();
			const { longDate, shortDate } = this.formatDate(signingDate);
			if (expiresIn > MAX_PRESIGNED_TTL) return Promise.reject("Signature version 4 presigned URLs must have an expiration date less than one week in the future");
			const scope = createScope(shortDate, region, signingService ?? this.service);
			const request = moveHeadersToQuery(prepareRequest(originalRequest), {
				unhoistableHeaders,
				hoistableHeaders
			});
			if (credentials.sessionToken) request.query[TOKEN_QUERY_PARAM] = credentials.sessionToken;
			request.query[ALGORITHM_QUERY_PARAM] = ALGORITHM_IDENTIFIER;
			request.query[CREDENTIAL_QUERY_PARAM] = `${credentials.accessKeyId}/${scope}`;
			request.query[AMZ_DATE_QUERY_PARAM] = longDate;
			request.query[EXPIRES_QUERY_PARAM] = expiresIn.toString(10);
			const canonicalHeaders = getCanonicalHeaders(request, unsignableHeaders, signableHeaders);
			request.query[SIGNED_HEADERS_QUERY_PARAM] = this.getCanonicalHeaderList(canonicalHeaders);
			request.query[SIGNATURE_QUERY_PARAM] = await this.getSignature(longDate, scope, this.getSigningKey(credentials, region, shortDate, signingService), this.createCanonicalRequest(request, canonicalHeaders, await getPayloadHash(originalRequest, this.sha256)));
			return request;
		}
		async sign(toSign, options) {
			if (typeof toSign === "string") return this.signString(toSign, options);
			else if (toSign.headers && toSign.payload) return this.signEvent(toSign, options);
			else if (toSign.message) return this.signMessage(toSign, options);
			else return this.signRequest(toSign, options);
		}
		async signEvent({ headers, payload: payload$1 }, { signingDate = /* @__PURE__ */ new Date(), priorSignature, signingRegion, signingService }) {
			const region = signingRegion ?? await this.regionProvider();
			const { shortDate, longDate } = this.formatDate(signingDate);
			const scope = createScope(shortDate, region, signingService ?? this.service);
			const hashedPayload = await getPayloadHash({
				headers: {},
				body: payload$1
			}, this.sha256);
			const hash = new this.sha256();
			hash.update(headers);
			const stringToSign = [
				EVENT_ALGORITHM_IDENTIFIER,
				longDate,
				scope,
				priorSignature,
				utilHexEncoding.toHex(await hash.digest()),
				hashedPayload
			].join("\n");
			return this.signString(stringToSign, {
				signingDate,
				signingRegion: region,
				signingService
			});
		}
		async signMessage(signableMessage, { signingDate = /* @__PURE__ */ new Date(), signingRegion, signingService }) {
			return this.signEvent({
				headers: this.headerFormatter.format(signableMessage.message.headers),
				payload: signableMessage.message.body
			}, {
				signingDate,
				signingRegion,
				signingService,
				priorSignature: signableMessage.priorSignature
			}).then((signature) => {
				return {
					message: signableMessage.message,
					signature
				};
			});
		}
		async signString(stringToSign, { signingDate = /* @__PURE__ */ new Date(), signingRegion, signingService } = {}) {
			const credentials = await this.credentialProvider();
			this.validateResolvedCredentials(credentials);
			const region = signingRegion ?? await this.regionProvider();
			const { shortDate } = this.formatDate(signingDate);
			const hash = new this.sha256(await this.getSigningKey(credentials, region, shortDate, signingService));
			hash.update(utilUtf8.toUint8Array(stringToSign));
			return utilHexEncoding.toHex(await hash.digest());
		}
		async signRequest(requestToSign, { signingDate = /* @__PURE__ */ new Date(), signableHeaders, unsignableHeaders, signingRegion, signingService } = {}) {
			const credentials = await this.credentialProvider();
			this.validateResolvedCredentials(credentials);
			const region = signingRegion ?? await this.regionProvider();
			const request = prepareRequest(requestToSign);
			const { longDate, shortDate } = this.formatDate(signingDate);
			const scope = createScope(shortDate, region, signingService ?? this.service);
			request.headers[AMZ_DATE_HEADER] = longDate;
			if (credentials.sessionToken) request.headers[TOKEN_HEADER] = credentials.sessionToken;
			const payloadHash = await getPayloadHash(request, this.sha256);
			if (!hasHeader(SHA256_HEADER, request.headers) && this.applyChecksum) request.headers[SHA256_HEADER] = payloadHash;
			const canonicalHeaders = getCanonicalHeaders(request, unsignableHeaders, signableHeaders);
			const signature = await this.getSignature(longDate, scope, this.getSigningKey(credentials, region, shortDate, signingService), this.createCanonicalRequest(request, canonicalHeaders, payloadHash));
			request.headers[AUTH_HEADER] = `${ALGORITHM_IDENTIFIER} Credential=${credentials.accessKeyId}/${scope}, SignedHeaders=${this.getCanonicalHeaderList(canonicalHeaders)}, Signature=${signature}`;
			return request;
		}
		async getSignature(longDate, credentialScope, keyPromise, canonicalRequest) {
			const stringToSign = await this.createStringToSign(longDate, credentialScope, canonicalRequest, ALGORITHM_IDENTIFIER);
			const hash = new this.sha256(await keyPromise);
			hash.update(utilUtf8.toUint8Array(stringToSign));
			return utilHexEncoding.toHex(await hash.digest());
		}
		getSigningKey(credentials, region, shortDate, service) {
			return getSigningKey(this.sha256, credentials, shortDate, region, service || this.service);
		}
	};
	exports.SignatureV4 = SignatureV4;
}));

//#endregion
//#region ../node_modules/.pnpm/@aws-sdk+core@3.940.0/node_modules/@aws-sdk/core/dist-es/submodules/httpAuthSchemes/aws_sdk/resolveAwsSdkSigV4Config.js
function normalizeCredentialProvider(config, { credentials, credentialDefaultProvider }) {
	let credentialsProvider;
	if (credentials) if (!credentials?.memoized) credentialsProvider = memoizeIdentityProvider(credentials, isIdentityExpired, doesIdentityRequireRefresh);
	else credentialsProvider = credentials;
	else if (credentialDefaultProvider) credentialsProvider = normalizeProvider(credentialDefaultProvider(Object.assign({}, config, { parentClientConfig: config })));
	else credentialsProvider = async () => {
		throw new Error("@aws-sdk/core::resolveAwsSdkSigV4Config - `credentials` not provided and no credentialDefaultProvider was configured.");
	};
	credentialsProvider.memoized = true;
	return credentialsProvider;
}
function bindCallerConfig(config, credentialsProvider) {
	if (credentialsProvider.configBound) return credentialsProvider;
	const fn = async (options) => credentialsProvider({
		...options,
		callerClientConfig: config
	});
	fn.memoized = credentialsProvider.memoized;
	fn.configBound = true;
	return fn;
}
var import_dist_cjs$20, resolveAwsSdkSigV4Config, resolveAWSSDKSigV4Config;
var init_resolveAwsSdkSigV4Config = require_chunk.__esmMin((() => {
	require_client.init_client();
	init_dist_es$1();
	import_dist_cjs$20 = require_dist_cjs$14();
	resolveAwsSdkSigV4Config = (config) => {
		let inputCredentials = config.credentials;
		let isUserSupplied = !!config.credentials;
		let resolvedCredentials = void 0;
		Object.defineProperty(config, "credentials", {
			set(credentials) {
				if (credentials && credentials !== inputCredentials && credentials !== resolvedCredentials) isUserSupplied = true;
				inputCredentials = credentials;
				const boundProvider = bindCallerConfig(config, normalizeCredentialProvider(config, {
					credentials: inputCredentials,
					credentialDefaultProvider: config.credentialDefaultProvider
				}));
				if (isUserSupplied && !boundProvider.attributed) {
					resolvedCredentials = async (options) => boundProvider(options).then((creds) => require_client.setCredentialFeature(creds, "CREDENTIALS_CODE", "e"));
					resolvedCredentials.memoized = boundProvider.memoized;
					resolvedCredentials.configBound = boundProvider.configBound;
					resolvedCredentials.attributed = true;
				} else resolvedCredentials = boundProvider;
			},
			get() {
				return resolvedCredentials;
			},
			enumerable: true,
			configurable: true
		});
		config.credentials = inputCredentials;
		const { signingEscapePath = true, systemClockOffset = config.systemClockOffset || 0, sha256 } = config;
		let signer;
		if (config.signer) signer = normalizeProvider(config.signer);
		else if (config.regionInfoProvider) signer = () => normalizeProvider(config.region)().then(async (region) => [await config.regionInfoProvider(region, {
			useFipsEndpoint: await config.useFipsEndpoint(),
			useDualstackEndpoint: await config.useDualstackEndpoint()
		}) || {}, region]).then(([regionInfo, region]) => {
			const { signingRegion, signingService } = regionInfo;
			config.signingRegion = config.signingRegion || signingRegion || region;
			config.signingName = config.signingName || signingService || config.serviceId;
			const params = {
				...config,
				credentials: config.credentials,
				region: config.signingRegion,
				service: config.signingName,
				sha256,
				uriEscapePath: signingEscapePath
			};
			return new (config.signerConstructor || import_dist_cjs$20.SignatureV4)(params);
		});
		else signer = async (authScheme) => {
			authScheme = Object.assign({}, {
				name: "sigv4",
				signingName: config.signingName || config.defaultSigningName,
				signingRegion: await normalizeProvider(config.region)(),
				properties: {}
			}, authScheme);
			const signingRegion = authScheme.signingRegion;
			const signingService = authScheme.signingName;
			config.signingRegion = config.signingRegion || signingRegion;
			config.signingName = config.signingName || signingService || config.serviceId;
			const params = {
				...config,
				credentials: config.credentials,
				region: config.signingRegion,
				service: config.signingName,
				sha256,
				uriEscapePath: signingEscapePath
			};
			return new (config.signerConstructor || import_dist_cjs$20.SignatureV4)(params);
		};
		return Object.assign(config, {
			systemClockOffset,
			signingEscapePath,
			signer
		});
	};
	resolveAWSSDKSigV4Config = resolveAwsSdkSigV4Config;
}));

//#endregion
//#region ../node_modules/.pnpm/@aws-sdk+core@3.940.0/node_modules/@aws-sdk/core/dist-es/submodules/httpAuthSchemes/aws_sdk/index.js
var init_aws_sdk = require_chunk.__esmMin((() => {
	init_AwsSdkSigV4Signer();
	init_AwsSdkSigV4ASigner();
	init_NODE_AUTH_SCHEME_PREFERENCE_OPTIONS();
	init_resolveAwsSdkSigV4AConfig();
	init_resolveAwsSdkSigV4Config();
}));

//#endregion
//#region ../node_modules/.pnpm/@aws-sdk+core@3.940.0/node_modules/@aws-sdk/core/dist-es/submodules/httpAuthSchemes/index.js
var httpAuthSchemes_exports = /* @__PURE__ */ require_chunk.__exportAll({
	AWSSDKSigV4Signer: () => AWSSDKSigV4Signer,
	AwsSdkSigV4ASigner: () => AwsSdkSigV4ASigner,
	AwsSdkSigV4Signer: () => AwsSdkSigV4Signer,
	NODE_AUTH_SCHEME_PREFERENCE_OPTIONS: () => NODE_AUTH_SCHEME_PREFERENCE_OPTIONS,
	NODE_SIGV4A_CONFIG_OPTIONS: () => NODE_SIGV4A_CONFIG_OPTIONS,
	getBearerTokenEnvKey: () => getBearerTokenEnvKey,
	resolveAWSSDKSigV4Config: () => resolveAWSSDKSigV4Config,
	resolveAwsSdkSigV4AConfig: () => resolveAwsSdkSigV4AConfig,
	resolveAwsSdkSigV4Config: () => resolveAwsSdkSigV4Config,
	validateSigningProperties: () => validateSigningProperties
});
var init_httpAuthSchemes = require_chunk.__esmMin((() => {
	init_aws_sdk();
	init_getBearerTokenEnvKey();
}));

//#endregion
//#region ../node_modules/.pnpm/@smithy+core@3.18.5/node_modules/@smithy/core/dist-es/submodules/cbor/cbor-types.js
function alloc(size) {
	return typeof Buffer !== "undefined" ? Buffer.alloc(size) : new Uint8Array(size);
}
function tag(data$1) {
	data$1[tagSymbol] = true;
	return data$1;
}
var majorUint64, majorNegativeInt64, majorUnstructuredByteString, majorUtf8String, majorList, majorMap, majorTag, majorSpecial, specialFalse, specialTrue, specialNull, specialUndefined, extendedOneByte, extendedFloat16, extendedFloat32, extendedFloat64, minorIndefinite, tagSymbol;
var init_cbor_types = require_chunk.__esmMin((() => {
	majorUint64 = 0;
	majorNegativeInt64 = 1;
	majorUnstructuredByteString = 2;
	majorUtf8String = 3;
	majorList = 4;
	majorMap = 5;
	majorTag = 6;
	majorSpecial = 7;
	specialFalse = 20;
	specialTrue = 21;
	specialNull = 22;
	specialUndefined = 23;
	extendedOneByte = 24;
	extendedFloat16 = 25;
	extendedFloat32 = 26;
	extendedFloat64 = 27;
	minorIndefinite = 31;
	tagSymbol = Symbol("@smithy/core/cbor::tagSymbol");
}));

//#endregion
//#region ../node_modules/.pnpm/@smithy+core@3.18.5/node_modules/@smithy/core/dist-es/submodules/cbor/cbor-decode.js
function setPayload(bytes) {
	payload = bytes;
	dataView$1 = new DataView(payload.buffer, payload.byteOffset, payload.byteLength);
}
function decode(at, to) {
	if (at >= to) throw new Error("unexpected end of (decode) payload.");
	const major = (payload[at] & 224) >> 5;
	const minor = payload[at] & 31;
	switch (major) {
		case majorUint64:
		case majorNegativeInt64:
		case majorTag:
			let unsignedInt;
			let offset;
			if (minor < 24) {
				unsignedInt = minor;
				offset = 1;
			} else switch (minor) {
				case extendedOneByte:
				case extendedFloat16:
				case extendedFloat32:
				case extendedFloat64:
					const countLength = minorValueToArgumentLength[minor];
					const countOffset = countLength + 1;
					offset = countOffset;
					if (to - at < countOffset) throw new Error(`countLength ${countLength} greater than remaining buf len.`);
					const countIndex = at + 1;
					if (countLength === 1) unsignedInt = payload[countIndex];
					else if (countLength === 2) unsignedInt = dataView$1.getUint16(countIndex);
					else if (countLength === 4) unsignedInt = dataView$1.getUint32(countIndex);
					else unsignedInt = dataView$1.getBigUint64(countIndex);
					break;
				default: throw new Error(`unexpected minor value ${minor}.`);
			}
			if (major === majorUint64) {
				_offset = offset;
				return castBigInt(unsignedInt);
			} else if (major === majorNegativeInt64) {
				let negativeInt;
				if (typeof unsignedInt === "bigint") negativeInt = BigInt(-1) - unsignedInt;
				else negativeInt = -1 - unsignedInt;
				_offset = offset;
				return castBigInt(negativeInt);
			} else if (minor === 2 || minor === 3) {
				const length = decodeCount(at + offset, to);
				let b = BigInt(0);
				const start = at + offset + _offset;
				for (let i = start; i < start + length; ++i) b = b << BigInt(8) | BigInt(payload[i]);
				_offset = offset + _offset + length;
				return minor === 3 ? -b - BigInt(1) : b;
			} else if (minor === 4) {
				const [exponent, mantissa] = decode(at + offset, to);
				const normalizer = mantissa < 0 ? -1 : 1;
				const mantissaStr = "0".repeat(Math.abs(exponent) + 1) + String(BigInt(normalizer) * BigInt(mantissa));
				let numericString;
				const sign = mantissa < 0 ? "-" : "";
				numericString = exponent === 0 ? mantissaStr : mantissaStr.slice(0, mantissaStr.length + exponent) + "." + mantissaStr.slice(exponent);
				numericString = numericString.replace(/^0+/g, "");
				if (numericString === "") numericString = "0";
				if (numericString[0] === ".") numericString = "0" + numericString;
				numericString = sign + numericString;
				_offset = offset + _offset;
				return require_dist_cjs$38.nv(numericString);
			} else {
				const value = decode(at + offset, to);
				_offset = offset + _offset;
				return tag({
					tag: castBigInt(unsignedInt),
					value
				});
			}
		case majorUtf8String:
		case majorMap:
		case majorList:
		case majorUnstructuredByteString: if (minor === minorIndefinite) switch (major) {
			case majorUtf8String: return decodeUtf8StringIndefinite(at, to);
			case majorMap: return decodeMapIndefinite(at, to);
			case majorList: return decodeListIndefinite(at, to);
			case majorUnstructuredByteString: return decodeUnstructuredByteStringIndefinite(at, to);
		}
		else switch (major) {
			case majorUtf8String: return decodeUtf8String(at, to);
			case majorMap: return decodeMap(at, to);
			case majorList: return decodeList(at, to);
			case majorUnstructuredByteString: return decodeUnstructuredByteString(at, to);
		}
		default: return decodeSpecial(at, to);
	}
}
function bytesToUtf8(bytes, at, to) {
	if (USE_BUFFER$1 && bytes.constructor?.name === "Buffer") return bytes.toString("utf-8", at, to);
	if (textDecoder) return textDecoder.decode(bytes.subarray(at, to));
	return (0, import_dist_cjs$19.toUtf8)(bytes.subarray(at, to));
}
function demote(bigInteger) {
	const num = Number(bigInteger);
	if (num < Number.MIN_SAFE_INTEGER || Number.MAX_SAFE_INTEGER < num) console.warn(/* @__PURE__ */ new Error(`@smithy/core/cbor - truncating BigInt(${bigInteger}) to ${num} with loss of precision.`));
	return num;
}
function bytesToFloat16(a, b) {
	const sign = a >> 7;
	const exponent = (a & 124) >> 2;
	const fraction = (a & 3) << 8 | b;
	const scalar = sign === 0 ? 1 : -1;
	let exponentComponent;
	let summation;
	if (exponent === 0) if (fraction === 0) return 0;
	else {
		exponentComponent = Math.pow(2, -14);
		summation = 0;
	}
	else if (exponent === 31) if (fraction === 0) return scalar * Infinity;
	else return NaN;
	else {
		exponentComponent = Math.pow(2, exponent - 15);
		summation = 1;
	}
	summation += fraction / 1024;
	return scalar * (exponentComponent * summation);
}
function decodeCount(at, to) {
	const minor = payload[at] & 31;
	if (minor < 24) {
		_offset = 1;
		return minor;
	}
	if (minor === extendedOneByte || minor === extendedFloat16 || minor === extendedFloat32 || minor === extendedFloat64) {
		const countLength = minorValueToArgumentLength[minor];
		_offset = countLength + 1;
		if (to - at < _offset) throw new Error(`countLength ${countLength} greater than remaining buf len.`);
		const countIndex = at + 1;
		if (countLength === 1) return payload[countIndex];
		else if (countLength === 2) return dataView$1.getUint16(countIndex);
		else if (countLength === 4) return dataView$1.getUint32(countIndex);
		return demote(dataView$1.getBigUint64(countIndex));
	}
	throw new Error(`unexpected minor value ${minor}.`);
}
function decodeUtf8String(at, to) {
	const length = decodeCount(at, to);
	const offset = _offset;
	at += offset;
	if (to - at < length) throw new Error(`string len ${length} greater than remaining buf len.`);
	const value = bytesToUtf8(payload, at, at + length);
	_offset = offset + length;
	return value;
}
function decodeUtf8StringIndefinite(at, to) {
	at += 1;
	const vector = [];
	for (const base = at; at < to;) {
		if (payload[at] === 255) {
			const data$1 = alloc(vector.length);
			data$1.set(vector, 0);
			_offset = at - base + 2;
			return bytesToUtf8(data$1, 0, data$1.length);
		}
		const major = (payload[at] & 224) >> 5;
		const minor = payload[at] & 31;
		if (major !== majorUtf8String) throw new Error(`unexpected major type ${major} in indefinite string.`);
		if (minor === minorIndefinite) throw new Error("nested indefinite string.");
		const bytes = decodeUnstructuredByteString(at, to);
		at += _offset;
		for (let i = 0; i < bytes.length; ++i) vector.push(bytes[i]);
	}
	throw new Error("expected break marker.");
}
function decodeUnstructuredByteString(at, to) {
	const length = decodeCount(at, to);
	const offset = _offset;
	at += offset;
	if (to - at < length) throw new Error(`unstructured byte string len ${length} greater than remaining buf len.`);
	const value = payload.subarray(at, at + length);
	_offset = offset + length;
	return value;
}
function decodeUnstructuredByteStringIndefinite(at, to) {
	at += 1;
	const vector = [];
	for (const base = at; at < to;) {
		if (payload[at] === 255) {
			const data$1 = alloc(vector.length);
			data$1.set(vector, 0);
			_offset = at - base + 2;
			return data$1;
		}
		const major = (payload[at] & 224) >> 5;
		const minor = payload[at] & 31;
		if (major !== majorUnstructuredByteString) throw new Error(`unexpected major type ${major} in indefinite string.`);
		if (minor === minorIndefinite) throw new Error("nested indefinite string.");
		const bytes = decodeUnstructuredByteString(at, to);
		at += _offset;
		for (let i = 0; i < bytes.length; ++i) vector.push(bytes[i]);
	}
	throw new Error("expected break marker.");
}
function decodeList(at, to) {
	const listDataLength = decodeCount(at, to);
	const offset = _offset;
	at += offset;
	const base = at;
	const list = Array(listDataLength);
	for (let i = 0; i < listDataLength; ++i) {
		const item = decode(at, to);
		const itemOffset = _offset;
		list[i] = item;
		at += itemOffset;
	}
	_offset = offset + (at - base);
	return list;
}
function decodeListIndefinite(at, to) {
	at += 1;
	const list = [];
	for (const base = at; at < to;) {
		if (payload[at] === 255) {
			_offset = at - base + 2;
			return list;
		}
		const item = decode(at, to);
		at += _offset;
		list.push(item);
	}
	throw new Error("expected break marker.");
}
function decodeMap(at, to) {
	const mapDataLength = decodeCount(at, to);
	const offset = _offset;
	at += offset;
	const base = at;
	const map = {};
	for (let i = 0; i < mapDataLength; ++i) {
		if (at >= to) throw new Error("unexpected end of map payload.");
		const major = (payload[at] & 224) >> 5;
		if (major !== majorUtf8String) throw new Error(`unexpected major type ${major} for map key at index ${at}.`);
		const key = decode(at, to);
		at += _offset;
		const value = decode(at, to);
		at += _offset;
		map[key] = value;
	}
	_offset = offset + (at - base);
	return map;
}
function decodeMapIndefinite(at, to) {
	at += 1;
	const base = at;
	const map = {};
	for (; at < to;) {
		if (at >= to) throw new Error("unexpected end of map payload.");
		if (payload[at] === 255) {
			_offset = at - base + 2;
			return map;
		}
		const major = (payload[at] & 224) >> 5;
		if (major !== majorUtf8String) throw new Error(`unexpected major type ${major} for map key.`);
		const key = decode(at, to);
		at += _offset;
		const value = decode(at, to);
		at += _offset;
		map[key] = value;
	}
	throw new Error("expected break marker.");
}
function decodeSpecial(at, to) {
	const minor = payload[at] & 31;
	switch (minor) {
		case specialTrue:
		case specialFalse:
			_offset = 1;
			return minor === specialTrue;
		case specialNull:
			_offset = 1;
			return null;
		case specialUndefined:
			_offset = 1;
			return null;
		case extendedFloat16:
			if (to - at < 3) throw new Error("incomplete float16 at end of buf.");
			_offset = 3;
			return bytesToFloat16(payload[at + 1], payload[at + 2]);
		case extendedFloat32:
			if (to - at < 5) throw new Error("incomplete float32 at end of buf.");
			_offset = 5;
			return dataView$1.getFloat32(at + 1);
		case extendedFloat64:
			if (to - at < 9) throw new Error("incomplete float64 at end of buf.");
			_offset = 9;
			return dataView$1.getFloat64(at + 1);
		default: throw new Error(`unexpected minor value ${minor}.`);
	}
}
function castBigInt(bigInt) {
	if (typeof bigInt === "number") return bigInt;
	const num = Number(bigInt);
	if (Number.MIN_SAFE_INTEGER <= num && num <= Number.MAX_SAFE_INTEGER) return num;
	return bigInt;
}
var import_dist_cjs$19, USE_TEXT_DECODER, USE_BUFFER$1, payload, dataView$1, textDecoder, _offset, minorValueToArgumentLength;
var init_cbor_decode = require_chunk.__esmMin((() => {
	require_dist_cjs$38.init_serde();
	import_dist_cjs$19 = require_dist_cjs$39.require_dist_cjs();
	init_cbor_types();
	USE_TEXT_DECODER = typeof TextDecoder !== "undefined";
	USE_BUFFER$1 = typeof Buffer !== "undefined";
	payload = alloc(0);
	dataView$1 = new DataView(payload.buffer, payload.byteOffset, payload.byteLength);
	textDecoder = USE_TEXT_DECODER ? new TextDecoder() : null;
	_offset = 0;
	minorValueToArgumentLength = {
		[extendedOneByte]: 1,
		[extendedFloat16]: 2,
		[extendedFloat32]: 4,
		[extendedFloat64]: 8
	};
}));

//#endregion
//#region ../node_modules/.pnpm/@smithy+core@3.18.5/node_modules/@smithy/core/dist-es/submodules/cbor/cbor-encode.js
function ensureSpace(bytes) {
	if (data.byteLength - cursor < bytes) if (cursor < 16e6) resize(Math.max(data.byteLength * 4, data.byteLength + bytes));
	else resize(data.byteLength + bytes + 16e6);
}
function toUint8Array() {
	const out = alloc(cursor);
	out.set(data.subarray(0, cursor), 0);
	cursor = 0;
	return out;
}
function resize(size) {
	const old = data;
	data = alloc(size);
	if (old) if (old.copy) old.copy(data, 0, 0, old.byteLength);
	else data.set(old, 0);
	dataView = new DataView(data.buffer, data.byteOffset, data.byteLength);
}
function encodeHeader(major, value) {
	if (value < 24) data[cursor++] = major << 5 | value;
	else if (value < 256) {
		data[cursor++] = major << 5 | 24;
		data[cursor++] = value;
	} else if (value < 65536) {
		data[cursor++] = major << 5 | extendedFloat16;
		dataView.setUint16(cursor, value);
		cursor += 2;
	} else if (value < 2 ** 32) {
		data[cursor++] = major << 5 | extendedFloat32;
		dataView.setUint32(cursor, value);
		cursor += 4;
	} else {
		data[cursor++] = major << 5 | extendedFloat64;
		dataView.setBigUint64(cursor, typeof value === "bigint" ? value : BigInt(value));
		cursor += 8;
	}
}
function encode(_input) {
	const encodeStack = [_input];
	while (encodeStack.length) {
		const input = encodeStack.pop();
		ensureSpace(typeof input === "string" ? input.length * 4 : 64);
		if (typeof input === "string") {
			if (USE_BUFFER) {
				encodeHeader(majorUtf8String, Buffer.byteLength(input));
				cursor += data.write(input, cursor);
			} else {
				const bytes = (0, import_dist_cjs$18.fromUtf8)(input);
				encodeHeader(majorUtf8String, bytes.byteLength);
				data.set(bytes, cursor);
				cursor += bytes.byteLength;
			}
			continue;
		} else if (typeof input === "number") {
			if (Number.isInteger(input)) {
				const nonNegative = input >= 0;
				const major = nonNegative ? majorUint64 : majorNegativeInt64;
				const value = nonNegative ? input : -input - 1;
				if (value < 24) data[cursor++] = major << 5 | value;
				else if (value < 256) {
					data[cursor++] = major << 5 | 24;
					data[cursor++] = value;
				} else if (value < 65536) {
					data[cursor++] = major << 5 | extendedFloat16;
					data[cursor++] = value >> 8;
					data[cursor++] = value;
				} else if (value < 4294967296) {
					data[cursor++] = major << 5 | extendedFloat32;
					dataView.setUint32(cursor, value);
					cursor += 4;
				} else {
					data[cursor++] = major << 5 | extendedFloat64;
					dataView.setBigUint64(cursor, BigInt(value));
					cursor += 8;
				}
				continue;
			}
			data[cursor++] = majorSpecial << 5 | extendedFloat64;
			dataView.setFloat64(cursor, input);
			cursor += 8;
			continue;
		} else if (typeof input === "bigint") {
			const nonNegative = input >= 0;
			const major = nonNegative ? majorUint64 : majorNegativeInt64;
			const value = nonNegative ? input : -input - BigInt(1);
			const n = Number(value);
			if (n < 24) data[cursor++] = major << 5 | n;
			else if (n < 256) {
				data[cursor++] = major << 5 | 24;
				data[cursor++] = n;
			} else if (n < 65536) {
				data[cursor++] = major << 5 | extendedFloat16;
				data[cursor++] = n >> 8;
				data[cursor++] = n & 255;
			} else if (n < 4294967296) {
				data[cursor++] = major << 5 | extendedFloat32;
				dataView.setUint32(cursor, n);
				cursor += 4;
			} else if (value < BigInt("18446744073709551616")) {
				data[cursor++] = major << 5 | extendedFloat64;
				dataView.setBigUint64(cursor, value);
				cursor += 8;
			} else {
				const binaryBigInt = value.toString(2);
				const bigIntBytes = new Uint8Array(Math.ceil(binaryBigInt.length / 8));
				let b = value;
				let i = 0;
				while (bigIntBytes.byteLength - ++i >= 0) {
					bigIntBytes[bigIntBytes.byteLength - i] = Number(b & BigInt(255));
					b >>= BigInt(8);
				}
				ensureSpace(bigIntBytes.byteLength * 2);
				data[cursor++] = nonNegative ? 194 : 195;
				if (USE_BUFFER) encodeHeader(majorUnstructuredByteString, Buffer.byteLength(bigIntBytes));
				else encodeHeader(majorUnstructuredByteString, bigIntBytes.byteLength);
				data.set(bigIntBytes, cursor);
				cursor += bigIntBytes.byteLength;
			}
			continue;
		} else if (input === null) {
			data[cursor++] = majorSpecial << 5 | specialNull;
			continue;
		} else if (typeof input === "boolean") {
			data[cursor++] = majorSpecial << 5 | (input ? specialTrue : specialFalse);
			continue;
		} else if (typeof input === "undefined") throw new Error("@smithy/core/cbor: client may not serialize undefined value.");
		else if (Array.isArray(input)) {
			for (let i = input.length - 1; i >= 0; --i) encodeStack.push(input[i]);
			encodeHeader(majorList, input.length);
			continue;
		} else if (typeof input.byteLength === "number") {
			ensureSpace(input.length * 2);
			encodeHeader(majorUnstructuredByteString, input.length);
			data.set(input, cursor);
			cursor += input.byteLength;
			continue;
		} else if (typeof input === "object") {
			if (input instanceof require_dist_cjs$38.NumericValue) {
				const decimalIndex = input.string.indexOf(".");
				const exponent = decimalIndex === -1 ? 0 : decimalIndex - input.string.length + 1;
				const mantissa = BigInt(input.string.replace(".", ""));
				data[cursor++] = 196;
				encodeStack.push(mantissa);
				encodeStack.push(exponent);
				encodeHeader(majorList, 2);
				continue;
			}
			if (input[tagSymbol]) if ("tag" in input && "value" in input) {
				encodeStack.push(input.value);
				encodeHeader(majorTag, input.tag);
				continue;
			} else throw new Error("tag encountered with missing fields, need 'tag' and 'value', found: " + JSON.stringify(input));
			const keys = Object.keys(input);
			for (let i = keys.length - 1; i >= 0; --i) {
				const key = keys[i];
				encodeStack.push(input[key]);
				encodeStack.push(key);
			}
			encodeHeader(majorMap, keys.length);
			continue;
		}
		throw new Error(`data type ${input?.constructor?.name ?? typeof input} not compatible for encoding.`);
	}
}
var import_dist_cjs$18, USE_BUFFER, data, dataView, cursor;
var init_cbor_encode = require_chunk.__esmMin((() => {
	require_dist_cjs$38.init_serde();
	import_dist_cjs$18 = require_dist_cjs$39.require_dist_cjs();
	init_cbor_types();
	USE_BUFFER = typeof Buffer !== "undefined";
	data = alloc(2048);
	dataView = new DataView(data.buffer, data.byteOffset, data.byteLength);
	cursor = 0;
}));

//#endregion
//#region ../node_modules/.pnpm/@smithy+core@3.18.5/node_modules/@smithy/core/dist-es/submodules/cbor/cbor.js
var cbor;
var init_cbor$1 = require_chunk.__esmMin((() => {
	init_cbor_decode();
	init_cbor_encode();
	cbor = {
		deserialize(payload$1) {
			setPayload(payload$1);
			return decode(0, payload$1.length);
		},
		serialize(input) {
			try {
				encode(input);
				return toUint8Array();
			} catch (e) {
				toUint8Array();
				throw e;
			}
		},
		resizeEncodingBuffer(size) {
			resize(size);
		}
	};
}));

//#endregion
//#region ../node_modules/.pnpm/@smithy+core@3.18.5/node_modules/@smithy/core/dist-es/submodules/cbor/parseCborBody.js
var dateToTag, loadSmithyRpcV2CborErrorCode;
var init_parseCborBody = require_chunk.__esmMin((() => {
	init_cbor_types();
	dateToTag = (date) => {
		return tag({
			tag: 1,
			value: date.getTime() / 1e3
		});
	};
	loadSmithyRpcV2CborErrorCode = (output, data$1) => {
		const sanitizeErrorCode = (rawValue) => {
			let cleanValue = rawValue;
			if (typeof cleanValue === "number") cleanValue = cleanValue.toString();
			if (cleanValue.indexOf(",") >= 0) cleanValue = cleanValue.split(",")[0];
			if (cleanValue.indexOf(":") >= 0) cleanValue = cleanValue.split(":")[0];
			if (cleanValue.indexOf("#") >= 0) cleanValue = cleanValue.split("#")[1];
			return cleanValue;
		};
		if (data$1["__type"] !== void 0) return sanitizeErrorCode(data$1["__type"]);
		const codeKey = Object.keys(data$1).find((key) => key.toLowerCase() === "code");
		if (codeKey && data$1[codeKey] !== void 0) return sanitizeErrorCode(data$1[codeKey]);
	};
}));

//#endregion
//#region ../node_modules/.pnpm/@smithy+core@3.18.5/node_modules/@smithy/core/dist-es/submodules/cbor/CborCodec.js
var import_dist_cjs$17, CborCodec, CborShapeSerializer, CborShapeDeserializer;
var init_CborCodec = require_chunk.__esmMin((() => {
	require_dist_cjs$38.init_protocols();
	require_dist_cjs$38.init_schema();
	require_dist_cjs$38.init_serde();
	import_dist_cjs$17 = require_dist_cjs$38.require_dist_cjs$6();
	init_cbor$1();
	init_parseCborBody();
	CborCodec = class extends require_dist_cjs$38.SerdeContext {
		createSerializer() {
			const serializer = new CborShapeSerializer();
			serializer.setSerdeContext(this.serdeContext);
			return serializer;
		}
		createDeserializer() {
			const deserializer = new CborShapeDeserializer();
			deserializer.setSerdeContext(this.serdeContext);
			return deserializer;
		}
	};
	CborShapeSerializer = class extends require_dist_cjs$38.SerdeContext {
		value;
		write(schema, value) {
			this.value = this.serialize(schema, value);
		}
		serialize(schema, source) {
			const ns = require_dist_cjs$38.NormalizedSchema.of(schema);
			if (source == null) {
				if (ns.isIdempotencyToken()) return (0, require_dist_cjs$38.import_dist_cjs.v4)();
				return source;
			}
			if (ns.isBlobSchema()) {
				if (typeof source === "string") return (this.serdeContext?.base64Decoder ?? import_dist_cjs$17.fromBase64)(source);
				return source;
			}
			if (ns.isTimestampSchema()) {
				if (typeof source === "number" || typeof source === "bigint") return dateToTag(/* @__PURE__ */ new Date(Number(source) / 1e3 | 0));
				return dateToTag(source);
			}
			if (typeof source === "function" || typeof source === "object") {
				const sourceObject = source;
				if (ns.isListSchema() && Array.isArray(sourceObject)) {
					const sparse = !!ns.getMergedTraits().sparse;
					const newArray = [];
					let i = 0;
					for (const item of sourceObject) {
						const value = this.serialize(ns.getValueSchema(), item);
						if (value != null || sparse) newArray[i++] = value;
					}
					return newArray;
				}
				if (sourceObject instanceof Date) return dateToTag(sourceObject);
				const newObject = {};
				if (ns.isMapSchema()) {
					const sparse = !!ns.getMergedTraits().sparse;
					for (const key of Object.keys(sourceObject)) {
						const value = this.serialize(ns.getValueSchema(), sourceObject[key]);
						if (value != null || sparse) newObject[key] = value;
					}
				} else if (ns.isStructSchema()) for (const [key, memberSchema] of ns.structIterator()) {
					const value = this.serialize(memberSchema, sourceObject[key]);
					if (value != null) newObject[key] = value;
				}
				else if (ns.isDocumentSchema()) for (const key of Object.keys(sourceObject)) newObject[key] = this.serialize(ns.getValueSchema(), sourceObject[key]);
				return newObject;
			}
			return source;
		}
		flush() {
			const buffer$1 = cbor.serialize(this.value);
			this.value = void 0;
			return buffer$1;
		}
	};
	CborShapeDeserializer = class extends require_dist_cjs$38.SerdeContext {
		read(schema, bytes) {
			const data$1 = cbor.deserialize(bytes);
			return this.readValue(schema, data$1);
		}
		readValue(_schema, value) {
			const ns = require_dist_cjs$38.NormalizedSchema.of(_schema);
			if (ns.isTimestampSchema() && typeof value === "number") return require_dist_cjs$38._parseEpochTimestamp(value);
			if (ns.isBlobSchema()) {
				if (typeof value === "string") return (this.serdeContext?.base64Decoder ?? import_dist_cjs$17.fromBase64)(value);
				return value;
			}
			if (typeof value === "undefined" || typeof value === "boolean" || typeof value === "number" || typeof value === "string" || typeof value === "bigint" || typeof value === "symbol") return value;
			else if (typeof value === "function" || typeof value === "object") {
				if (value === null) return null;
				if ("byteLength" in value) return value;
				if (value instanceof Date) return value;
				if (ns.isDocumentSchema()) return value;
				if (ns.isListSchema()) {
					const newArray = [];
					const memberSchema = ns.getValueSchema();
					const sparse = !!ns.getMergedTraits().sparse;
					for (const item of value) {
						const itemValue = this.readValue(memberSchema, item);
						if (itemValue != null || sparse) newArray.push(itemValue);
					}
					return newArray;
				}
				const newObject = {};
				if (ns.isMapSchema()) {
					const sparse = !!ns.getMergedTraits().sparse;
					const targetSchema = ns.getValueSchema();
					for (const key of Object.keys(value)) {
						const itemValue = this.readValue(targetSchema, value[key]);
						if (itemValue != null || sparse) newObject[key] = itemValue;
					}
				} else if (ns.isStructSchema()) for (const [key, memberSchema] of ns.structIterator()) {
					const v = this.readValue(memberSchema, value[key]);
					if (v != null) newObject[key] = v;
				}
				return newObject;
			} else return value;
		}
	};
}));

//#endregion
//#region ../node_modules/.pnpm/@smithy+core@3.18.5/node_modules/@smithy/core/dist-es/submodules/cbor/SmithyRpcV2CborProtocol.js
var import_dist_cjs$16, SmithyRpcV2CborProtocol;
var init_SmithyRpcV2CborProtocol = require_chunk.__esmMin((() => {
	require_dist_cjs$38.init_protocols();
	require_dist_cjs$38.init_schema();
	import_dist_cjs$16 = require_dist_cjs$38.require_dist_cjs$7();
	init_CborCodec();
	init_parseCborBody();
	SmithyRpcV2CborProtocol = class extends require_dist_cjs$38.RpcProtocol {
		codec = new CborCodec();
		serializer = this.codec.createSerializer();
		deserializer = this.codec.createDeserializer();
		constructor({ defaultNamespace }) {
			super({ defaultNamespace });
		}
		getShapeId() {
			return "smithy.protocols#rpcv2Cbor";
		}
		getPayloadCodec() {
			return this.codec;
		}
		async serializeRequest(operationSchema, input, context) {
			const request = await super.serializeRequest(operationSchema, input, context);
			Object.assign(request.headers, {
				"content-type": this.getDefaultContentType(),
				"smithy-protocol": "rpc-v2-cbor",
				accept: this.getDefaultContentType()
			});
			if (require_dist_cjs$38.deref(operationSchema.input) === "unit") {
				delete request.body;
				delete request.headers["content-type"];
			} else {
				if (!request.body) {
					this.serializer.write(15, {});
					request.body = this.serializer.flush();
				}
				try {
					request.headers["content-length"] = String(request.body.byteLength);
				} catch (e) {}
			}
			const { service, operation } = (0, import_dist_cjs$16.getSmithyContext)(context);
			const path = `/service/${service}/operation/${operation}`;
			if (request.path.endsWith("/")) request.path += path.slice(1);
			else request.path += path;
			return request;
		}
		async deserializeResponse(operationSchema, context, response) {
			return super.deserializeResponse(operationSchema, context, response);
		}
		async handleError(operationSchema, context, response, dataObject, metadata) {
			const errorName = loadSmithyRpcV2CborErrorCode(response, dataObject) ?? "Unknown";
			let namespace = this.options.defaultNamespace;
			if (errorName.includes("#")) [namespace] = errorName.split("#");
			const errorMetadata = {
				$metadata: metadata,
				$fault: response.statusCode <= 500 ? "client" : "server"
			};
			const registry = require_dist_cjs$38.TypeRegistry.for(namespace);
			let errorSchema;
			try {
				errorSchema = registry.getSchema(errorName);
			} catch (e) {
				if (dataObject.Message) dataObject.message = dataObject.Message;
				const synthetic = require_dist_cjs$38.TypeRegistry.for("smithy.ts.sdk.synthetic." + namespace);
				const baseExceptionSchema = synthetic.getBaseException();
				if (baseExceptionSchema) {
					const ErrorCtor$1 = synthetic.getErrorCtor(baseExceptionSchema);
					throw Object.assign(new ErrorCtor$1({ name: errorName }), errorMetadata, dataObject);
				}
				throw Object.assign(new Error(errorName), errorMetadata, dataObject);
			}
			const ns = require_dist_cjs$38.NormalizedSchema.of(errorSchema);
			const ErrorCtor = registry.getErrorCtor(errorSchema);
			const message = dataObject.message ?? dataObject.Message ?? "Unknown";
			const exception = new ErrorCtor(message);
			const output = {};
			for (const [name, member] of ns.structIterator()) output[name] = this.deserializer.readValue(member, dataObject[name]);
			throw Object.assign(exception, errorMetadata, {
				$fault: ns.getMergedTraits().error,
				message
			}, output);
		}
		getDefaultContentType() {
			return "application/cbor";
		}
	};
}));

//#endregion
//#region ../node_modules/.pnpm/@smithy+core@3.18.5/node_modules/@smithy/core/dist-es/submodules/cbor/index.js
var init_cbor = require_chunk.__esmMin((() => {
	init_parseCborBody();
	init_SmithyRpcV2CborProtocol();
	init_CborCodec();
}));

//#endregion
//#region ../node_modules/.pnpm/@aws-sdk+core@3.940.0/node_modules/@aws-sdk/core/dist-es/submodules/protocols/ProtocolLib.js
var import_dist_cjs$15, ProtocolLib;
var init_ProtocolLib = require_chunk.__esmMin((() => {
	require_dist_cjs$38.init_schema();
	import_dist_cjs$15 = require_dist_cjs$38.require_dist_cjs();
	ProtocolLib = class {
		queryCompat;
		constructor(queryCompat = false) {
			this.queryCompat = queryCompat;
		}
		resolveRestContentType(defaultContentType, inputSchema) {
			const members = inputSchema.getMemberSchemas();
			const httpPayloadMember = Object.values(members).find((m) => {
				return !!m.getMergedTraits().httpPayload;
			});
			if (httpPayloadMember) {
				const mediaType = httpPayloadMember.getMergedTraits().mediaType;
				if (mediaType) return mediaType;
				else if (httpPayloadMember.isStringSchema()) return "text/plain";
				else if (httpPayloadMember.isBlobSchema()) return "application/octet-stream";
				else return defaultContentType;
			} else if (!inputSchema.isUnitSchema()) {
				if (Object.values(members).find((m) => {
					const { httpQuery, httpQueryParams, httpHeader, httpLabel, httpPrefixHeaders } = m.getMergedTraits();
					return !httpQuery && !httpQueryParams && !httpHeader && !httpLabel && httpPrefixHeaders === void 0;
				})) return defaultContentType;
			}
		}
		async getErrorSchemaOrThrowBaseException(errorIdentifier, defaultNamespace, response, dataObject, metadata, getErrorSchema) {
			let namespace = defaultNamespace;
			let errorName = errorIdentifier;
			if (errorIdentifier.includes("#")) [namespace, errorName] = errorIdentifier.split("#");
			const errorMetadata = {
				$metadata: metadata,
				$fault: response.statusCode < 500 ? "client" : "server"
			};
			const registry = require_dist_cjs$38.TypeRegistry.for(namespace);
			try {
				return {
					errorSchema: getErrorSchema?.(registry, errorName) ?? registry.getSchema(errorIdentifier),
					errorMetadata
				};
			} catch (e) {
				dataObject.message = dataObject.message ?? dataObject.Message ?? "UnknownError";
				const synthetic = require_dist_cjs$38.TypeRegistry.for("smithy.ts.sdk.synthetic." + namespace);
				const baseExceptionSchema = synthetic.getBaseException();
				if (baseExceptionSchema) {
					const ErrorCtor = synthetic.getErrorCtor(baseExceptionSchema) ?? Error;
					throw this.decorateServiceException(Object.assign(new ErrorCtor({ name: errorName }), errorMetadata), dataObject);
				}
				throw this.decorateServiceException(Object.assign(new Error(errorName), errorMetadata), dataObject);
			}
		}
		decorateServiceException(exception, additions = {}) {
			if (this.queryCompat) {
				const msg = exception.Message ?? additions.Message;
				const error = (0, import_dist_cjs$15.decorateServiceException)(exception, additions);
				if (msg) {
					error.Message = msg;
					error.message = msg;
				}
				return error;
			}
			return (0, import_dist_cjs$15.decorateServiceException)(exception, additions);
		}
		setQueryCompatError(output, response) {
			const queryErrorHeader = response.headers?.["x-amzn-query-error"];
			if (output !== void 0 && queryErrorHeader != null) {
				const [Code, Type] = queryErrorHeader.split(";");
				const entries = Object.entries(output);
				const Error$1 = {
					Code,
					Type
				};
				Object.assign(output, Error$1);
				for (const [k, v] of entries) Error$1[k] = v;
				delete Error$1.__type;
				output.Error = Error$1;
			}
		}
		queryCompatOutput(queryCompatErrorData, errorData) {
			if (queryCompatErrorData.Error) errorData.Error = queryCompatErrorData.Error;
			if (queryCompatErrorData.Type) errorData.Type = queryCompatErrorData.Type;
			if (queryCompatErrorData.Code) errorData.Code = queryCompatErrorData.Code;
		}
	};
}));

//#endregion
//#region ../node_modules/.pnpm/@aws-sdk+core@3.940.0/node_modules/@aws-sdk/core/dist-es/submodules/protocols/cbor/AwsSmithyRpcV2CborProtocol.js
var AwsSmithyRpcV2CborProtocol;
var init_AwsSmithyRpcV2CborProtocol = require_chunk.__esmMin((() => {
	init_cbor();
	require_dist_cjs$38.init_schema();
	init_ProtocolLib();
	AwsSmithyRpcV2CborProtocol = class extends SmithyRpcV2CborProtocol {
		awsQueryCompatible;
		mixin;
		constructor({ defaultNamespace, awsQueryCompatible }) {
			super({ defaultNamespace });
			this.awsQueryCompatible = !!awsQueryCompatible;
			this.mixin = new ProtocolLib(this.awsQueryCompatible);
		}
		async serializeRequest(operationSchema, input, context) {
			const request = await super.serializeRequest(operationSchema, input, context);
			if (this.awsQueryCompatible) request.headers["x-amzn-query-mode"] = "true";
			return request;
		}
		async handleError(operationSchema, context, response, dataObject, metadata) {
			if (this.awsQueryCompatible) this.mixin.setQueryCompatError(dataObject, response);
			const errorName = loadSmithyRpcV2CborErrorCode(response, dataObject) ?? "Unknown";
			const { errorSchema, errorMetadata } = await this.mixin.getErrorSchemaOrThrowBaseException(errorName, this.options.defaultNamespace, response, dataObject, metadata);
			const ns = require_dist_cjs$38.NormalizedSchema.of(errorSchema);
			const message = dataObject.message ?? dataObject.Message ?? "Unknown";
			const exception = new ((require_dist_cjs$38.TypeRegistry.for(errorSchema[1]).getErrorCtor(errorSchema)) ?? Error)(message);
			const output = {};
			for (const [name, member] of ns.structIterator()) output[name] = this.deserializer.readValue(member, dataObject[name]);
			if (this.awsQueryCompatible) this.mixin.queryCompatOutput(dataObject, output);
			throw this.mixin.decorateServiceException(Object.assign(exception, errorMetadata, {
				$fault: ns.getMergedTraits().error,
				message
			}, output), dataObject);
		}
	};
}));

//#endregion
//#region ../node_modules/.pnpm/@aws-sdk+core@3.940.0/node_modules/@aws-sdk/core/dist-es/submodules/protocols/coercing-serializers.js
var _toStr, _toBool, _toNum;
var init_coercing_serializers = require_chunk.__esmMin((() => {
	_toStr = (val) => {
		if (val == null) return val;
		if (typeof val === "number" || typeof val === "bigint") {
			const warning = /* @__PURE__ */ new Error(`Received number ${val} where a string was expected.`);
			warning.name = "Warning";
			console.warn(warning);
			return String(val);
		}
		if (typeof val === "boolean") {
			const warning = /* @__PURE__ */ new Error(`Received boolean ${val} where a string was expected.`);
			warning.name = "Warning";
			console.warn(warning);
			return String(val);
		}
		return val;
	};
	_toBool = (val) => {
		if (val == null) return val;
		if (typeof val === "number") {}
		if (typeof val === "string") {
			const lowercase = val.toLowerCase();
			if (val !== "" && lowercase !== "false" && lowercase !== "true") {
				const warning = /* @__PURE__ */ new Error(`Received string "${val}" where a boolean was expected.`);
				warning.name = "Warning";
				console.warn(warning);
			}
			return val !== "" && lowercase !== "false";
		}
		return val;
	};
	_toNum = (val) => {
		if (val == null) return val;
		if (typeof val === "boolean") {}
		if (typeof val === "string") {
			const num = Number(val);
			if (num.toString() !== val) {
				const warning = /* @__PURE__ */ new Error(`Received string "${val}" where a number was expected.`);
				warning.name = "Warning";
				console.warn(warning);
				return val;
			}
			return num;
		}
		return val;
	};
}));

//#endregion
//#region ../node_modules/.pnpm/@aws-sdk+core@3.940.0/node_modules/@aws-sdk/core/dist-es/submodules/protocols/ConfigurableSerdeContext.js
var SerdeContextConfig;
var init_ConfigurableSerdeContext = require_chunk.__esmMin((() => {
	SerdeContextConfig = class {
		serdeContext;
		setSerdeContext(serdeContext) {
			this.serdeContext = serdeContext;
		}
	};
}));

//#endregion
//#region ../node_modules/.pnpm/@aws-sdk+core@3.940.0/node_modules/@aws-sdk/core/dist-es/submodules/protocols/structIterator.js
function* serializingStructIterator(ns, sourceObject) {
	if (ns.isUnitSchema()) return;
	const struct = ns.getSchema();
	for (let i = 0; i < struct[4].length; ++i) {
		const key = struct[4][i];
		const memberNs = new require_dist_cjs$38.NormalizedSchema([struct[5][i], 0], key);
		if (!(key in sourceObject) && !memberNs.isIdempotencyToken()) continue;
		yield [key, memberNs];
	}
}
function* deserializingStructIterator(ns, sourceObject, nameTrait) {
	if (ns.isUnitSchema()) return;
	const struct = ns.getSchema();
	let keysRemaining = Object.keys(sourceObject).length;
	for (let i = 0; i < struct[4].length; ++i) {
		if (keysRemaining === 0) break;
		const key = struct[4][i];
		const memberNs = new require_dist_cjs$38.NormalizedSchema([struct[5][i], 0], key);
		let serializationKey = key;
		if (nameTrait) serializationKey = memberNs.getMergedTraits()[nameTrait] ?? key;
		if (!(serializationKey in sourceObject)) continue;
		yield [key, memberNs];
		keysRemaining -= 1;
	}
}
var init_structIterator = require_chunk.__esmMin((() => {
	require_dist_cjs$38.init_schema();
}));

//#endregion
//#region ../node_modules/.pnpm/@aws-sdk+core@3.940.0/node_modules/@aws-sdk/core/dist-es/submodules/protocols/json/jsonReviver.js
function jsonReviver(key, value, context) {
	if (context?.source) {
		const numericString = context.source;
		if (typeof value === "number") {
			if (value > Number.MAX_SAFE_INTEGER || value < Number.MIN_SAFE_INTEGER || numericString !== String(value)) if (numericString.includes(".")) return new require_dist_cjs$38.NumericValue(numericString, "bigDecimal");
			else return BigInt(numericString);
		}
	}
	return value;
}
var init_jsonReviver = require_chunk.__esmMin((() => {
	require_dist_cjs$38.init_serde();
}));

//#endregion
//#region ../node_modules/.pnpm/@aws-sdk+core@3.940.0/node_modules/@aws-sdk/core/dist-es/submodules/protocols/common.js
var import_dist_cjs$13, import_dist_cjs$14, collectBodyString;
var init_common = require_chunk.__esmMin((() => {
	import_dist_cjs$13 = require_dist_cjs$38.require_dist_cjs();
	import_dist_cjs$14 = require_dist_cjs$39.require_dist_cjs();
	collectBodyString = (streamBody, context) => (0, import_dist_cjs$13.collectBody)(streamBody, context).then((body) => (context?.utf8Encoder ?? import_dist_cjs$14.toUtf8)(body));
}));

//#endregion
//#region ../node_modules/.pnpm/@aws-sdk+core@3.940.0/node_modules/@aws-sdk/core/dist-es/submodules/protocols/json/parseJsonBody.js
var parseJsonBody, parseJsonErrorBody, loadRestJsonErrorCode;
var init_parseJsonBody = require_chunk.__esmMin((() => {
	init_common();
	parseJsonBody = (streamBody, context) => collectBodyString(streamBody, context).then((encoded) => {
		if (encoded.length) try {
			return JSON.parse(encoded);
		} catch (e) {
			if (e?.name === "SyntaxError") Object.defineProperty(e, "$responseBodyText", { value: encoded });
			throw e;
		}
		return {};
	});
	parseJsonErrorBody = async (errorBody, context) => {
		const value = await parseJsonBody(errorBody, context);
		value.message = value.message ?? value.Message;
		return value;
	};
	loadRestJsonErrorCode = (output, data$1) => {
		const findKey = (object, key) => Object.keys(object).find((k) => k.toLowerCase() === key.toLowerCase());
		const sanitizeErrorCode = (rawValue) => {
			let cleanValue = rawValue;
			if (typeof cleanValue === "number") cleanValue = cleanValue.toString();
			if (cleanValue.indexOf(",") >= 0) cleanValue = cleanValue.split(",")[0];
			if (cleanValue.indexOf(":") >= 0) cleanValue = cleanValue.split(":")[0];
			if (cleanValue.indexOf("#") >= 0) cleanValue = cleanValue.split("#")[1];
			return cleanValue;
		};
		const headerKey = findKey(output.headers, "x-amzn-errortype");
		if (headerKey !== void 0) return sanitizeErrorCode(output.headers[headerKey]);
		if (data$1 && typeof data$1 === "object") {
			const codeKey = findKey(data$1, "code");
			if (codeKey && data$1[codeKey] !== void 0) return sanitizeErrorCode(data$1[codeKey]);
			if (data$1["__type"] !== void 0) return sanitizeErrorCode(data$1["__type"]);
		}
	};
}));

//#endregion
//#region ../node_modules/.pnpm/@aws-sdk+core@3.940.0/node_modules/@aws-sdk/core/dist-es/submodules/protocols/json/JsonShapeDeserializer.js
var import_dist_cjs$12, JsonShapeDeserializer;
var init_JsonShapeDeserializer = require_chunk.__esmMin((() => {
	require_dist_cjs$38.init_protocols();
	require_dist_cjs$38.init_schema();
	require_dist_cjs$38.init_serde();
	import_dist_cjs$12 = require_dist_cjs$38.require_dist_cjs$6();
	init_ConfigurableSerdeContext();
	init_structIterator();
	init_jsonReviver();
	init_parseJsonBody();
	JsonShapeDeserializer = class extends SerdeContextConfig {
		settings;
		constructor(settings) {
			super();
			this.settings = settings;
		}
		async read(schema, data$1) {
			return this._read(schema, typeof data$1 === "string" ? JSON.parse(data$1, jsonReviver) : await parseJsonBody(data$1, this.serdeContext));
		}
		readObject(schema, data$1) {
			return this._read(schema, data$1);
		}
		_read(schema, value) {
			const isObject = value !== null && typeof value === "object";
			const ns = require_dist_cjs$38.NormalizedSchema.of(schema);
			if (ns.isListSchema() && Array.isArray(value)) {
				const listMember = ns.getValueSchema();
				const out = [];
				const sparse = !!ns.getMergedTraits().sparse;
				for (const item of value) if (sparse || item != null) out.push(this._read(listMember, item));
				return out;
			} else if (ns.isMapSchema() && isObject) {
				const mapMember = ns.getValueSchema();
				const out = {};
				const sparse = !!ns.getMergedTraits().sparse;
				for (const [_k, _v] of Object.entries(value)) if (sparse || _v != null) out[_k] = this._read(mapMember, _v);
				return out;
			} else if (ns.isStructSchema() && isObject) {
				const out = {};
				for (const [memberName, memberSchema] of deserializingStructIterator(ns, value, this.settings.jsonName ? "jsonName" : false)) {
					const fromKey = this.settings.jsonName ? memberSchema.getMergedTraits().jsonName ?? memberName : memberName;
					const deserializedValue = this._read(memberSchema, value[fromKey]);
					if (deserializedValue != null) out[memberName] = deserializedValue;
				}
				return out;
			}
			if (ns.isBlobSchema() && typeof value === "string") return (0, import_dist_cjs$12.fromBase64)(value);
			const mediaType = ns.getMergedTraits().mediaType;
			if (ns.isStringSchema() && typeof value === "string" && mediaType) {
				if (mediaType === "application/json" || mediaType.endsWith("+json")) return require_dist_cjs$38.LazyJsonString.from(value);
			}
			if (ns.isTimestampSchema() && value != null) switch (require_dist_cjs$38.determineTimestampFormat(ns, this.settings)) {
				case 5: return require_dist_cjs$38.parseRfc3339DateTimeWithOffset(value);
				case 6: return require_dist_cjs$38.parseRfc7231DateTime(value);
				case 7: return require_dist_cjs$38.parseEpochTimestamp(value);
				default:
					console.warn("Missing timestamp format, parsing value with Date constructor:", value);
					return new Date(value);
			}
			if (ns.isBigIntegerSchema() && (typeof value === "number" || typeof value === "string")) return BigInt(value);
			if (ns.isBigDecimalSchema() && value != void 0) {
				if (value instanceof require_dist_cjs$38.NumericValue) return value;
				const untyped = value;
				if (untyped.type === "bigDecimal" && "string" in untyped) return new require_dist_cjs$38.NumericValue(untyped.string, untyped.type);
				return new require_dist_cjs$38.NumericValue(String(value), "bigDecimal");
			}
			if (ns.isNumericSchema() && typeof value === "string") switch (value) {
				case "Infinity": return Infinity;
				case "-Infinity": return -Infinity;
				case "NaN": return NaN;
			}
			if (ns.isDocumentSchema()) if (isObject) {
				const out = Array.isArray(value) ? [] : {};
				for (const [k, v] of Object.entries(value)) if (v instanceof require_dist_cjs$38.NumericValue) out[k] = v;
				else out[k] = this._read(ns, v);
				return out;
			} else return structuredClone(value);
			return value;
		}
	};
}));

//#endregion
//#region ../node_modules/.pnpm/@aws-sdk+core@3.940.0/node_modules/@aws-sdk/core/dist-es/submodules/protocols/json/jsonReplacer.js
var NUMERIC_CONTROL_CHAR, JsonReplacer;
var init_jsonReplacer = require_chunk.__esmMin((() => {
	require_dist_cjs$38.init_serde();
	NUMERIC_CONTROL_CHAR = String.fromCharCode(925);
	JsonReplacer = class {
		values = /* @__PURE__ */ new Map();
		counter = 0;
		stage = 0;
		createReplacer() {
			if (this.stage === 1) throw new Error("@aws-sdk/core/protocols - JsonReplacer already created.");
			if (this.stage === 2) throw new Error("@aws-sdk/core/protocols - JsonReplacer exhausted.");
			this.stage = 1;
			return (key, value) => {
				if (value instanceof require_dist_cjs$38.NumericValue) {
					const v = `${NUMERIC_CONTROL_CHAR + "nv" + this.counter++}_` + value.string;
					this.values.set(`"${v}"`, value.string);
					return v;
				}
				if (typeof value === "bigint") {
					const s = value.toString();
					const v = `${NUMERIC_CONTROL_CHAR + "b" + this.counter++}_` + s;
					this.values.set(`"${v}"`, s);
					return v;
				}
				return value;
			};
		}
		replaceInJson(json) {
			if (this.stage === 0) throw new Error("@aws-sdk/core/protocols - JsonReplacer not created yet.");
			if (this.stage === 2) throw new Error("@aws-sdk/core/protocols - JsonReplacer exhausted.");
			this.stage = 2;
			if (this.counter === 0) return json;
			for (const [key, value] of this.values) json = json.replace(key, value);
			return json;
		}
	};
}));

//#endregion
//#region ../node_modules/.pnpm/@aws-sdk+core@3.940.0/node_modules/@aws-sdk/core/dist-es/submodules/protocols/json/JsonShapeSerializer.js
var import_dist_cjs$11, JsonShapeSerializer;
var init_JsonShapeSerializer = require_chunk.__esmMin((() => {
	require_dist_cjs$38.init_protocols();
	require_dist_cjs$38.init_schema();
	require_dist_cjs$38.init_serde();
	import_dist_cjs$11 = require_dist_cjs$38.require_dist_cjs$6();
	init_ConfigurableSerdeContext();
	init_structIterator();
	init_jsonReplacer();
	JsonShapeSerializer = class extends SerdeContextConfig {
		settings;
		buffer;
		rootSchema;
		constructor(settings) {
			super();
			this.settings = settings;
		}
		write(schema, value) {
			this.rootSchema = require_dist_cjs$38.NormalizedSchema.of(schema);
			this.buffer = this._write(this.rootSchema, value);
		}
		writeDiscriminatedDocument(schema, value) {
			this.write(schema, value);
			if (typeof this.buffer === "object") this.buffer.__type = require_dist_cjs$38.NormalizedSchema.of(schema).getName(true);
		}
		flush() {
			const { rootSchema } = this;
			this.rootSchema = void 0;
			if (rootSchema?.isStructSchema() || rootSchema?.isDocumentSchema()) {
				const replacer = new JsonReplacer();
				return replacer.replaceInJson(JSON.stringify(this.buffer, replacer.createReplacer(), 0));
			}
			return this.buffer;
		}
		_write(schema, value, container) {
			const isObject = value !== null && typeof value === "object";
			const ns = require_dist_cjs$38.NormalizedSchema.of(schema);
			if (ns.isListSchema() && Array.isArray(value)) {
				const listMember = ns.getValueSchema();
				const out = [];
				const sparse = !!ns.getMergedTraits().sparse;
				for (const item of value) if (sparse || item != null) out.push(this._write(listMember, item));
				return out;
			} else if (ns.isMapSchema() && isObject) {
				const mapMember = ns.getValueSchema();
				const out = {};
				const sparse = !!ns.getMergedTraits().sparse;
				for (const [_k, _v] of Object.entries(value)) if (sparse || _v != null) out[_k] = this._write(mapMember, _v);
				return out;
			} else if (ns.isStructSchema() && isObject) {
				const out = {};
				for (const [memberName, memberSchema] of serializingStructIterator(ns, value)) {
					const serializableValue = this._write(memberSchema, value[memberName], ns);
					if (serializableValue !== void 0) {
						const targetKey = this.settings.jsonName ? memberSchema.getMergedTraits().jsonName ?? memberName : memberName;
						out[targetKey] = serializableValue;
					}
				}
				return out;
			}
			if (value === null && container?.isStructSchema()) return;
			if (ns.isBlobSchema() && (value instanceof Uint8Array || typeof value === "string") || ns.isDocumentSchema() && value instanceof Uint8Array) {
				if (ns === this.rootSchema) return value;
				return (this.serdeContext?.base64Encoder ?? import_dist_cjs$11.toBase64)(value);
			}
			if ((ns.isTimestampSchema() || ns.isDocumentSchema()) && value instanceof Date) switch (require_dist_cjs$38.determineTimestampFormat(ns, this.settings)) {
				case 5: return value.toISOString().replace(".000Z", "Z");
				case 6: return require_dist_cjs$38.dateToUtcString(value);
				case 7: return value.getTime() / 1e3;
				default:
					console.warn("Missing timestamp format, using epoch seconds", value);
					return value.getTime() / 1e3;
			}
			if (ns.isNumericSchema() && typeof value === "number") {
				if (Math.abs(value) === Infinity || isNaN(value)) return String(value);
			}
			if (ns.isStringSchema()) {
				if (typeof value === "undefined" && ns.isIdempotencyToken()) return (0, require_dist_cjs$38.import_dist_cjs.v4)();
				const mediaType = ns.getMergedTraits().mediaType;
				if (value != null && mediaType) {
					if (mediaType === "application/json" || mediaType.endsWith("+json")) return require_dist_cjs$38.LazyJsonString.from(value);
				}
			}
			if (ns.isDocumentSchema()) if (isObject) {
				const out = Array.isArray(value) ? [] : {};
				for (const [k, v] of Object.entries(value)) if (v instanceof require_dist_cjs$38.NumericValue) out[k] = v;
				else out[k] = this._write(ns, v);
				return out;
			} else return structuredClone(value);
			return value;
		}
	};
}));

//#endregion
//#region ../node_modules/.pnpm/@aws-sdk+core@3.940.0/node_modules/@aws-sdk/core/dist-es/submodules/protocols/json/JsonCodec.js
var JsonCodec;
var init_JsonCodec = require_chunk.__esmMin((() => {
	init_ConfigurableSerdeContext();
	init_JsonShapeDeserializer();
	init_JsonShapeSerializer();
	JsonCodec = class extends SerdeContextConfig {
		settings;
		constructor(settings) {
			super();
			this.settings = settings;
		}
		createSerializer() {
			const serializer = new JsonShapeSerializer(this.settings);
			serializer.setSerdeContext(this.serdeContext);
			return serializer;
		}
		createDeserializer() {
			const deserializer = new JsonShapeDeserializer(this.settings);
			deserializer.setSerdeContext(this.serdeContext);
			return deserializer;
		}
	};
}));

//#endregion
//#region ../node_modules/.pnpm/@aws-sdk+core@3.940.0/node_modules/@aws-sdk/core/dist-es/submodules/protocols/json/AwsJsonRpcProtocol.js
var AwsJsonRpcProtocol;
var init_AwsJsonRpcProtocol = require_chunk.__esmMin((() => {
	require_dist_cjs$38.init_protocols();
	require_dist_cjs$38.init_schema();
	init_ProtocolLib();
	init_JsonCodec();
	init_parseJsonBody();
	AwsJsonRpcProtocol = class extends require_dist_cjs$38.RpcProtocol {
		serializer;
		deserializer;
		serviceTarget;
		codec;
		mixin;
		awsQueryCompatible;
		constructor({ defaultNamespace, serviceTarget, awsQueryCompatible }) {
			super({ defaultNamespace });
			this.serviceTarget = serviceTarget;
			this.codec = new JsonCodec({
				timestampFormat: {
					useTrait: true,
					default: 7
				},
				jsonName: false
			});
			this.serializer = this.codec.createSerializer();
			this.deserializer = this.codec.createDeserializer();
			this.awsQueryCompatible = !!awsQueryCompatible;
			this.mixin = new ProtocolLib(this.awsQueryCompatible);
		}
		async serializeRequest(operationSchema, input, context) {
			const request = await super.serializeRequest(operationSchema, input, context);
			if (!request.path.endsWith("/")) request.path += "/";
			Object.assign(request.headers, {
				"content-type": `application/x-amz-json-${this.getJsonRpcVersion()}`,
				"x-amz-target": `${this.serviceTarget}.${operationSchema.name}`
			});
			if (this.awsQueryCompatible) request.headers["x-amzn-query-mode"] = "true";
			if (require_dist_cjs$38.deref(operationSchema.input) === "unit" || !request.body) request.body = "{}";
			return request;
		}
		getPayloadCodec() {
			return this.codec;
		}
		async handleError(operationSchema, context, response, dataObject, metadata) {
			if (this.awsQueryCompatible) this.mixin.setQueryCompatError(dataObject, response);
			const errorIdentifier = loadRestJsonErrorCode(response, dataObject) ?? "Unknown";
			const { errorSchema, errorMetadata } = await this.mixin.getErrorSchemaOrThrowBaseException(errorIdentifier, this.options.defaultNamespace, response, dataObject, metadata);
			const ns = require_dist_cjs$38.NormalizedSchema.of(errorSchema);
			const message = dataObject.message ?? dataObject.Message ?? "Unknown";
			const exception = new ((require_dist_cjs$38.TypeRegistry.for(errorSchema[1]).getErrorCtor(errorSchema)) ?? Error)(message);
			const output = {};
			for (const [name, member] of ns.structIterator()) {
				const target = member.getMergedTraits().jsonName ?? name;
				output[name] = this.codec.createDeserializer().readObject(member, dataObject[target]);
			}
			if (this.awsQueryCompatible) this.mixin.queryCompatOutput(dataObject, output);
			throw this.mixin.decorateServiceException(Object.assign(exception, errorMetadata, {
				$fault: ns.getMergedTraits().error,
				message
			}, output), dataObject);
		}
	};
}));

//#endregion
//#region ../node_modules/.pnpm/@aws-sdk+core@3.940.0/node_modules/@aws-sdk/core/dist-es/submodules/protocols/json/AwsJson1_0Protocol.js
var AwsJson1_0Protocol;
var init_AwsJson1_0Protocol = require_chunk.__esmMin((() => {
	init_AwsJsonRpcProtocol();
	AwsJson1_0Protocol = class extends AwsJsonRpcProtocol {
		constructor({ defaultNamespace, serviceTarget, awsQueryCompatible }) {
			super({
				defaultNamespace,
				serviceTarget,
				awsQueryCompatible
			});
		}
		getShapeId() {
			return "aws.protocols#awsJson1_0";
		}
		getJsonRpcVersion() {
			return "1.0";
		}
		getDefaultContentType() {
			return "application/x-amz-json-1.0";
		}
	};
}));

//#endregion
//#region ../node_modules/.pnpm/@aws-sdk+core@3.940.0/node_modules/@aws-sdk/core/dist-es/submodules/protocols/json/AwsJson1_1Protocol.js
var AwsJson1_1Protocol;
var init_AwsJson1_1Protocol = require_chunk.__esmMin((() => {
	init_AwsJsonRpcProtocol();
	AwsJson1_1Protocol = class extends AwsJsonRpcProtocol {
		constructor({ defaultNamespace, serviceTarget, awsQueryCompatible }) {
			super({
				defaultNamespace,
				serviceTarget,
				awsQueryCompatible
			});
		}
		getShapeId() {
			return "aws.protocols#awsJson1_1";
		}
		getJsonRpcVersion() {
			return "1.1";
		}
		getDefaultContentType() {
			return "application/x-amz-json-1.1";
		}
	};
}));

//#endregion
//#region ../node_modules/.pnpm/@aws-sdk+core@3.940.0/node_modules/@aws-sdk/core/dist-es/submodules/protocols/json/AwsRestJsonProtocol.js
var AwsRestJsonProtocol;
var init_AwsRestJsonProtocol = require_chunk.__esmMin((() => {
	require_dist_cjs$38.init_protocols();
	require_dist_cjs$38.init_schema();
	init_ProtocolLib();
	init_JsonCodec();
	init_parseJsonBody();
	AwsRestJsonProtocol = class extends require_dist_cjs$38.HttpBindingProtocol {
		serializer;
		deserializer;
		codec;
		mixin = new ProtocolLib();
		constructor({ defaultNamespace }) {
			super({ defaultNamespace });
			const settings = {
				timestampFormat: {
					useTrait: true,
					default: 7
				},
				httpBindings: true,
				jsonName: true
			};
			this.codec = new JsonCodec(settings);
			this.serializer = new require_dist_cjs$38.HttpInterceptingShapeSerializer(this.codec.createSerializer(), settings);
			this.deserializer = new require_dist_cjs$38.HttpInterceptingShapeDeserializer(this.codec.createDeserializer(), settings);
		}
		getShapeId() {
			return "aws.protocols#restJson1";
		}
		getPayloadCodec() {
			return this.codec;
		}
		setSerdeContext(serdeContext) {
			this.codec.setSerdeContext(serdeContext);
			super.setSerdeContext(serdeContext);
		}
		async serializeRequest(operationSchema, input, context) {
			const request = await super.serializeRequest(operationSchema, input, context);
			const inputSchema = require_dist_cjs$38.NormalizedSchema.of(operationSchema.input);
			if (!request.headers["content-type"]) {
				const contentType = this.mixin.resolveRestContentType(this.getDefaultContentType(), inputSchema);
				if (contentType) request.headers["content-type"] = contentType;
			}
			if (request.body == null && request.headers["content-type"] === this.getDefaultContentType()) request.body = "{}";
			return request;
		}
		async deserializeResponse(operationSchema, context, response) {
			const output = await super.deserializeResponse(operationSchema, context, response);
			const outputSchema = require_dist_cjs$38.NormalizedSchema.of(operationSchema.output);
			for (const [name, member] of outputSchema.structIterator()) if (member.getMemberTraits().httpPayload && !(name in output)) output[name] = null;
			return output;
		}
		async handleError(operationSchema, context, response, dataObject, metadata) {
			const errorIdentifier = loadRestJsonErrorCode(response, dataObject) ?? "Unknown";
			const { errorSchema, errorMetadata } = await this.mixin.getErrorSchemaOrThrowBaseException(errorIdentifier, this.options.defaultNamespace, response, dataObject, metadata);
			const ns = require_dist_cjs$38.NormalizedSchema.of(errorSchema);
			const message = dataObject.message ?? dataObject.Message ?? "Unknown";
			const exception = new ((require_dist_cjs$38.TypeRegistry.for(errorSchema[1]).getErrorCtor(errorSchema)) ?? Error)(message);
			await this.deserializeHttpMessage(errorSchema, context, response, dataObject);
			const output = {};
			for (const [name, member] of ns.structIterator()) {
				const target = member.getMergedTraits().jsonName ?? name;
				output[name] = this.codec.createDeserializer().readObject(member, dataObject[target]);
			}
			throw this.mixin.decorateServiceException(Object.assign(exception, errorMetadata, {
				$fault: ns.getMergedTraits().error,
				message
			}, output), dataObject);
		}
		getDefaultContentType() {
			return "application/json";
		}
	};
}));

//#endregion
//#region ../node_modules/.pnpm/@aws-sdk+core@3.940.0/node_modules/@aws-sdk/core/dist-es/submodules/protocols/json/awsExpectUnion.js
var import_dist_cjs$10, awsExpectUnion;
var init_awsExpectUnion = require_chunk.__esmMin((() => {
	import_dist_cjs$10 = require_dist_cjs$38.require_dist_cjs();
	awsExpectUnion = (value) => {
		if (value == null) return;
		if (typeof value === "object" && "__type" in value) delete value.__type;
		return (0, import_dist_cjs$10.expectUnion)(value);
	};
}));

//#endregion
//#region ../node_modules/.pnpm/fast-xml-parser@5.2.5/node_modules/fast-xml-parser/lib/fxp.cjs
var require_fxp = /* @__PURE__ */ require_chunk.__commonJSMin(((exports, module) => {
	(() => {
		"use strict";
		var t = {
			d: (e$1, n) => {
				for (var i$1 in n) t.o(n, i$1) && !t.o(e$1, i$1) && Object.defineProperty(e$1, i$1, {
					enumerable: !0,
					get: n[i$1]
				});
			},
			o: (t$1, e$1) => Object.prototype.hasOwnProperty.call(t$1, e$1),
			r: (t$1) => {
				"undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(t$1, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(t$1, "__esModule", { value: !0 });
			}
		}, e = {};
		t.r(e), t.d(e, {
			XMLBuilder: () => ft,
			XMLParser: () => st,
			XMLValidator: () => mt
		});
		const i = /* @__PURE__ */ new RegExp("^[:A-Za-z_\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Za-z_\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.\\d\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$");
		function s(t$1, e$1) {
			const n = [];
			let i$1 = e$1.exec(t$1);
			for (; i$1;) {
				const s$1 = [];
				s$1.startIndex = e$1.lastIndex - i$1[0].length;
				const r$1 = i$1.length;
				for (let t$2 = 0; t$2 < r$1; t$2++) s$1.push(i$1[t$2]);
				n.push(s$1), i$1 = e$1.exec(t$1);
			}
			return n;
		}
		const r = function(t$1) {
			return !(null == i.exec(t$1));
		}, o = {
			allowBooleanAttributes: !1,
			unpairedTags: []
		};
		function a(t$1, e$1) {
			e$1 = Object.assign({}, o, e$1);
			const n = [];
			let i$1 = !1, s$1 = !1;
			"﻿" === t$1[0] && (t$1 = t$1.substr(1));
			for (let o$1 = 0; o$1 < t$1.length; o$1++) if ("<" === t$1[o$1] && "?" === t$1[o$1 + 1]) {
				if (o$1 += 2, o$1 = u(t$1, o$1), o$1.err) return o$1;
			} else {
				if ("<" !== t$1[o$1]) {
					if (l(t$1[o$1])) continue;
					return x("InvalidChar", "char '" + t$1[o$1] + "' is not expected.", N(t$1, o$1));
				}
				{
					let a$1 = o$1;
					if (o$1++, "!" === t$1[o$1]) {
						o$1 = h(t$1, o$1);
						continue;
					}
					{
						let d$1 = !1;
						"/" === t$1[o$1] && (d$1 = !0, o$1++);
						let f$1 = "";
						for (; o$1 < t$1.length && ">" !== t$1[o$1] && " " !== t$1[o$1] && "	" !== t$1[o$1] && "\n" !== t$1[o$1] && "\r" !== t$1[o$1]; o$1++) f$1 += t$1[o$1];
						if (f$1 = f$1.trim(), "/" === f$1[f$1.length - 1] && (f$1 = f$1.substring(0, f$1.length - 1), o$1--), !r(f$1)) {
							let e$2;
							return e$2 = 0 === f$1.trim().length ? "Invalid space after '<'." : "Tag '" + f$1 + "' is an invalid name.", x("InvalidTag", e$2, N(t$1, o$1));
						}
						const p$1 = c(t$1, o$1);
						if (!1 === p$1) return x("InvalidAttr", "Attributes for '" + f$1 + "' have open quote.", N(t$1, o$1));
						let b$1 = p$1.value;
						if (o$1 = p$1.index, "/" === b$1[b$1.length - 1]) {
							const n$1 = o$1 - b$1.length;
							b$1 = b$1.substring(0, b$1.length - 1);
							const s$2 = g(b$1, e$1);
							if (!0 !== s$2) return x(s$2.err.code, s$2.err.msg, N(t$1, n$1 + s$2.err.line));
							i$1 = !0;
						} else if (d$1) {
							if (!p$1.tagClosed) return x("InvalidTag", "Closing tag '" + f$1 + "' doesn't have proper closing.", N(t$1, o$1));
							if (b$1.trim().length > 0) return x("InvalidTag", "Closing tag '" + f$1 + "' can't have attributes or invalid starting.", N(t$1, a$1));
							if (0 === n.length) return x("InvalidTag", "Closing tag '" + f$1 + "' has not been opened.", N(t$1, a$1));
							{
								const e$2 = n.pop();
								if (f$1 !== e$2.tagName) {
									let n$1 = N(t$1, e$2.tagStartPos);
									return x("InvalidTag", "Expected closing tag '" + e$2.tagName + "' (opened in line " + n$1.line + ", col " + n$1.col + ") instead of closing tag '" + f$1 + "'.", N(t$1, a$1));
								}
								0 == n.length && (s$1 = !0);
							}
						} else {
							const r$1 = g(b$1, e$1);
							if (!0 !== r$1) return x(r$1.err.code, r$1.err.msg, N(t$1, o$1 - b$1.length + r$1.err.line));
							if (!0 === s$1) return x("InvalidXml", "Multiple possible root nodes found.", N(t$1, o$1));
							-1 !== e$1.unpairedTags.indexOf(f$1) || n.push({
								tagName: f$1,
								tagStartPos: a$1
							}), i$1 = !0;
						}
						for (o$1++; o$1 < t$1.length; o$1++) if ("<" === t$1[o$1]) {
							if ("!" === t$1[o$1 + 1]) {
								o$1++, o$1 = h(t$1, o$1);
								continue;
							}
							if ("?" !== t$1[o$1 + 1]) break;
							if (o$1 = u(t$1, ++o$1), o$1.err) return o$1;
						} else if ("&" === t$1[o$1]) {
							const e$2 = m(t$1, o$1);
							if (-1 == e$2) return x("InvalidChar", "char '&' is not expected.", N(t$1, o$1));
							o$1 = e$2;
						} else if (!0 === s$1 && !l(t$1[o$1])) return x("InvalidXml", "Extra text at the end", N(t$1, o$1));
						"<" === t$1[o$1] && o$1--;
					}
				}
			}
			return i$1 ? 1 == n.length ? x("InvalidTag", "Unclosed tag '" + n[0].tagName + "'.", N(t$1, n[0].tagStartPos)) : !(n.length > 0) || x("InvalidXml", "Invalid '" + JSON.stringify(n.map(((t$2) => t$2.tagName)), null, 4).replace(/\r?\n/g, "") + "' found.", {
				line: 1,
				col: 1
			}) : x("InvalidXml", "Start tag expected.", 1);
		}
		function l(t$1) {
			return " " === t$1 || "	" === t$1 || "\n" === t$1 || "\r" === t$1;
		}
		function u(t$1, e$1) {
			const n = e$1;
			for (; e$1 < t$1.length; e$1++) if ("?" != t$1[e$1] && " " != t$1[e$1]);
			else {
				const i$1 = t$1.substr(n, e$1 - n);
				if (e$1 > 5 && "xml" === i$1) return x("InvalidXml", "XML declaration allowed only at the start of the document.", N(t$1, e$1));
				if ("?" == t$1[e$1] && ">" == t$1[e$1 + 1]) {
					e$1++;
					break;
				}
			}
			return e$1;
		}
		function h(t$1, e$1) {
			if (t$1.length > e$1 + 5 && "-" === t$1[e$1 + 1] && "-" === t$1[e$1 + 2]) {
				for (e$1 += 3; e$1 < t$1.length; e$1++) if ("-" === t$1[e$1] && "-" === t$1[e$1 + 1] && ">" === t$1[e$1 + 2]) {
					e$1 += 2;
					break;
				}
			} else if (t$1.length > e$1 + 8 && "D" === t$1[e$1 + 1] && "O" === t$1[e$1 + 2] && "C" === t$1[e$1 + 3] && "T" === t$1[e$1 + 4] && "Y" === t$1[e$1 + 5] && "P" === t$1[e$1 + 6] && "E" === t$1[e$1 + 7]) {
				let n = 1;
				for (e$1 += 8; e$1 < t$1.length; e$1++) if ("<" === t$1[e$1]) n++;
				else if (">" === t$1[e$1] && (n--, 0 === n)) break;
			} else if (t$1.length > e$1 + 9 && "[" === t$1[e$1 + 1] && "C" === t$1[e$1 + 2] && "D" === t$1[e$1 + 3] && "A" === t$1[e$1 + 4] && "T" === t$1[e$1 + 5] && "A" === t$1[e$1 + 6] && "[" === t$1[e$1 + 7]) {
				for (e$1 += 8; e$1 < t$1.length; e$1++) if ("]" === t$1[e$1] && "]" === t$1[e$1 + 1] && ">" === t$1[e$1 + 2]) {
					e$1 += 2;
					break;
				}
			}
			return e$1;
		}
		const d = "\"", f = "'";
		function c(t$1, e$1) {
			let n = "", i$1 = "", s$1 = !1;
			for (; e$1 < t$1.length; e$1++) {
				if (t$1[e$1] === d || t$1[e$1] === f) "" === i$1 ? i$1 = t$1[e$1] : i$1 !== t$1[e$1] || (i$1 = "");
				else if (">" === t$1[e$1] && "" === i$1) {
					s$1 = !0;
					break;
				}
				n += t$1[e$1];
			}
			return "" === i$1 && {
				value: n,
				index: e$1,
				tagClosed: s$1
			};
		}
		const p = new RegExp("(\\s*)([^\\s=]+)(\\s*=)?(\\s*(['\"])(([\\s\\S])*?)\\5)?", "g");
		function g(t$1, e$1) {
			const n = s(t$1, p), i$1 = {};
			for (let t$2 = 0; t$2 < n.length; t$2++) {
				if (0 === n[t$2][1].length) return x("InvalidAttr", "Attribute '" + n[t$2][2] + "' has no space in starting.", E(n[t$2]));
				if (void 0 !== n[t$2][3] && void 0 === n[t$2][4]) return x("InvalidAttr", "Attribute '" + n[t$2][2] + "' is without value.", E(n[t$2]));
				if (void 0 === n[t$2][3] && !e$1.allowBooleanAttributes) return x("InvalidAttr", "boolean attribute '" + n[t$2][2] + "' is not allowed.", E(n[t$2]));
				const s$1 = n[t$2][2];
				if (!b(s$1)) return x("InvalidAttr", "Attribute '" + s$1 + "' is an invalid name.", E(n[t$2]));
				if (i$1.hasOwnProperty(s$1)) return x("InvalidAttr", "Attribute '" + s$1 + "' is repeated.", E(n[t$2]));
				i$1[s$1] = 1;
			}
			return !0;
		}
		function m(t$1, e$1) {
			if (";" === t$1[++e$1]) return -1;
			if ("#" === t$1[e$1]) return function(t$2, e$2) {
				let n$1 = /\d/;
				for ("x" === t$2[e$2] && (e$2++, n$1 = /[\da-fA-F]/); e$2 < t$2.length; e$2++) {
					if (";" === t$2[e$2]) return e$2;
					if (!t$2[e$2].match(n$1)) break;
				}
				return -1;
			}(t$1, ++e$1);
			let n = 0;
			for (; e$1 < t$1.length; e$1++, n++) if (!(t$1[e$1].match(/\w/) && n < 20)) {
				if (";" === t$1[e$1]) break;
				return -1;
			}
			return e$1;
		}
		function x(t$1, e$1, n) {
			return { err: {
				code: t$1,
				msg: e$1,
				line: n.line || n,
				col: n.col
			} };
		}
		function b(t$1) {
			return r(t$1);
		}
		function N(t$1, e$1) {
			const n = t$1.substring(0, e$1).split(/\r?\n/);
			return {
				line: n.length,
				col: n[n.length - 1].length + 1
			};
		}
		function E(t$1) {
			return t$1.startIndex + t$1[1].length;
		}
		const v = {
			preserveOrder: !1,
			attributeNamePrefix: "@_",
			attributesGroupName: !1,
			textNodeName: "#text",
			ignoreAttributes: !0,
			removeNSPrefix: !1,
			allowBooleanAttributes: !1,
			parseTagValue: !0,
			parseAttributeValue: !1,
			trimValues: !0,
			cdataPropName: !1,
			numberParseOptions: {
				hex: !0,
				leadingZeros: !0,
				eNotation: !0
			},
			tagValueProcessor: function(t$1, e$1) {
				return e$1;
			},
			attributeValueProcessor: function(t$1, e$1) {
				return e$1;
			},
			stopNodes: [],
			alwaysCreateTextNode: !1,
			isArray: () => !1,
			commentPropName: !1,
			unpairedTags: [],
			processEntities: !0,
			htmlEntities: !1,
			ignoreDeclaration: !1,
			ignorePiTags: !1,
			transformTagName: !1,
			transformAttributeName: !1,
			updateTag: function(t$1, e$1, n) {
				return t$1;
			},
			captureMetaData: !1
		};
		let y;
		y = "function" != typeof Symbol ? "@@xmlMetadata" : Symbol("XML Node Metadata");
		class T {
			constructor(t$1) {
				this.tagname = t$1, this.child = [], this[":@"] = {};
			}
			add(t$1, e$1) {
				"__proto__" === t$1 && (t$1 = "#__proto__"), this.child.push({ [t$1]: e$1 });
			}
			addChild(t$1, e$1) {
				"__proto__" === t$1.tagname && (t$1.tagname = "#__proto__"), t$1[":@"] && Object.keys(t$1[":@"]).length > 0 ? this.child.push({
					[t$1.tagname]: t$1.child,
					":@": t$1[":@"]
				}) : this.child.push({ [t$1.tagname]: t$1.child }), void 0 !== e$1 && (this.child[this.child.length - 1][y] = { startIndex: e$1 });
			}
			static getMetaDataSymbol() {
				return y;
			}
		}
		function w(t$1, e$1) {
			const n = {};
			if ("O" !== t$1[e$1 + 3] || "C" !== t$1[e$1 + 4] || "T" !== t$1[e$1 + 5] || "Y" !== t$1[e$1 + 6] || "P" !== t$1[e$1 + 7] || "E" !== t$1[e$1 + 8]) throw new Error("Invalid Tag instead of DOCTYPE");
			{
				e$1 += 9;
				let i$1 = 1, s$1 = !1, r$1 = !1, o$1 = "";
				for (; e$1 < t$1.length; e$1++) if ("<" !== t$1[e$1] || r$1) if (">" === t$1[e$1]) {
					if (r$1 ? "-" === t$1[e$1 - 1] && "-" === t$1[e$1 - 2] && (r$1 = !1, i$1--) : i$1--, 0 === i$1) break;
				} else "[" === t$1[e$1] ? s$1 = !0 : o$1 += t$1[e$1];
				else {
					if (s$1 && C(t$1, "!ENTITY", e$1)) {
						let i$2, s$2;
						e$1 += 7, [i$2, s$2, e$1] = O(t$1, e$1 + 1), -1 === s$2.indexOf("&") && (n[i$2] = {
							regx: RegExp(`&${i$2};`, "g"),
							val: s$2
						});
					} else if (s$1 && C(t$1, "!ELEMENT", e$1)) {
						e$1 += 8;
						const { index: n$1 } = S(t$1, e$1 + 1);
						e$1 = n$1;
					} else if (s$1 && C(t$1, "!ATTLIST", e$1)) e$1 += 8;
					else if (s$1 && C(t$1, "!NOTATION", e$1)) {
						e$1 += 9;
						const { index: n$1 } = A(t$1, e$1 + 1);
						e$1 = n$1;
					} else {
						if (!C(t$1, "!--", e$1)) throw new Error("Invalid DOCTYPE");
						r$1 = !0;
					}
					i$1++, o$1 = "";
				}
				if (0 !== i$1) throw new Error("Unclosed DOCTYPE");
			}
			return {
				entities: n,
				i: e$1
			};
		}
		const P = (t$1, e$1) => {
			for (; e$1 < t$1.length && /\s/.test(t$1[e$1]);) e$1++;
			return e$1;
		};
		function O(t$1, e$1) {
			e$1 = P(t$1, e$1);
			let n = "";
			for (; e$1 < t$1.length && !/\s/.test(t$1[e$1]) && "\"" !== t$1[e$1] && "'" !== t$1[e$1];) n += t$1[e$1], e$1++;
			if ($(n), e$1 = P(t$1, e$1), "SYSTEM" === t$1.substring(e$1, e$1 + 6).toUpperCase()) throw new Error("External entities are not supported");
			if ("%" === t$1[e$1]) throw new Error("Parameter entities are not supported");
			let i$1 = "";
			return [e$1, i$1] = I(t$1, e$1, "entity"), [
				n,
				i$1,
				--e$1
			];
		}
		function A(t$1, e$1) {
			e$1 = P(t$1, e$1);
			let n = "";
			for (; e$1 < t$1.length && !/\s/.test(t$1[e$1]);) n += t$1[e$1], e$1++;
			$(n), e$1 = P(t$1, e$1);
			const i$1 = t$1.substring(e$1, e$1 + 6).toUpperCase();
			if ("SYSTEM" !== i$1 && "PUBLIC" !== i$1) throw new Error(`Expected SYSTEM or PUBLIC, found "${i$1}"`);
			e$1 += i$1.length, e$1 = P(t$1, e$1);
			let s$1 = null, r$1 = null;
			if ("PUBLIC" === i$1) [e$1, s$1] = I(t$1, e$1, "publicIdentifier"), "\"" !== t$1[e$1 = P(t$1, e$1)] && "'" !== t$1[e$1] || ([e$1, r$1] = I(t$1, e$1, "systemIdentifier"));
			else if ("SYSTEM" === i$1 && ([e$1, r$1] = I(t$1, e$1, "systemIdentifier"), !r$1)) throw new Error("Missing mandatory system identifier for SYSTEM notation");
			return {
				notationName: n,
				publicIdentifier: s$1,
				systemIdentifier: r$1,
				index: --e$1
			};
		}
		function I(t$1, e$1, n) {
			let i$1 = "";
			const s$1 = t$1[e$1];
			if ("\"" !== s$1 && "'" !== s$1) throw new Error(`Expected quoted string, found "${s$1}"`);
			for (e$1++; e$1 < t$1.length && t$1[e$1] !== s$1;) i$1 += t$1[e$1], e$1++;
			if (t$1[e$1] !== s$1) throw new Error(`Unterminated ${n} value`);
			return [++e$1, i$1];
		}
		function S(t$1, e$1) {
			e$1 = P(t$1, e$1);
			let n = "";
			for (; e$1 < t$1.length && !/\s/.test(t$1[e$1]);) n += t$1[e$1], e$1++;
			if (!$(n)) throw new Error(`Invalid element name: "${n}"`);
			let i$1 = "";
			if ("E" === t$1[e$1 = P(t$1, e$1)] && C(t$1, "MPTY", e$1)) e$1 += 4;
			else if ("A" === t$1[e$1] && C(t$1, "NY", e$1)) e$1 += 2;
			else {
				if ("(" !== t$1[e$1]) throw new Error(`Invalid Element Expression, found "${t$1[e$1]}"`);
				for (e$1++; e$1 < t$1.length && ")" !== t$1[e$1];) i$1 += t$1[e$1], e$1++;
				if (")" !== t$1[e$1]) throw new Error("Unterminated content model");
			}
			return {
				elementName: n,
				contentModel: i$1.trim(),
				index: e$1
			};
		}
		function C(t$1, e$1, n) {
			for (let i$1 = 0; i$1 < e$1.length; i$1++) if (e$1[i$1] !== t$1[n + i$1 + 1]) return !1;
			return !0;
		}
		function $(t$1) {
			if (r(t$1)) return t$1;
			throw new Error(`Invalid entity name ${t$1}`);
		}
		const j = /^[-+]?0x[a-fA-F0-9]+$/, D = /^([\-\+])?(0*)([0-9]*(\.[0-9]*)?)$/, V = {
			hex: !0,
			leadingZeros: !0,
			decimalPoint: ".",
			eNotation: !0
		};
		const M = /^([-+])?(0*)(\d*(\.\d*)?[eE][-\+]?\d+)$/;
		function _(t$1) {
			return "function" == typeof t$1 ? t$1 : Array.isArray(t$1) ? (e$1) => {
				for (const n of t$1) {
					if ("string" == typeof n && e$1 === n) return !0;
					if (n instanceof RegExp && n.test(e$1)) return !0;
				}
			} : () => !1;
		}
		class k {
			constructor(t$1) {
				this.options = t$1, this.currentNode = null, this.tagsNodeStack = [], this.docTypeEntities = {}, this.lastEntities = {
					apos: {
						regex: /&(apos|#39|#x27);/g,
						val: "'"
					},
					gt: {
						regex: /&(gt|#62|#x3E);/g,
						val: ">"
					},
					lt: {
						regex: /&(lt|#60|#x3C);/g,
						val: "<"
					},
					quot: {
						regex: /&(quot|#34|#x22);/g,
						val: "\""
					}
				}, this.ampEntity = {
					regex: /&(amp|#38|#x26);/g,
					val: "&"
				}, this.htmlEntities = {
					space: {
						regex: /&(nbsp|#160);/g,
						val: " "
					},
					cent: {
						regex: /&(cent|#162);/g,
						val: "¢"
					},
					pound: {
						regex: /&(pound|#163);/g,
						val: "£"
					},
					yen: {
						regex: /&(yen|#165);/g,
						val: "¥"
					},
					euro: {
						regex: /&(euro|#8364);/g,
						val: "€"
					},
					copyright: {
						regex: /&(copy|#169);/g,
						val: "©"
					},
					reg: {
						regex: /&(reg|#174);/g,
						val: "®"
					},
					inr: {
						regex: /&(inr|#8377);/g,
						val: "₹"
					},
					num_dec: {
						regex: /&#([0-9]{1,7});/g,
						val: (t$2, e$1) => String.fromCodePoint(Number.parseInt(e$1, 10))
					},
					num_hex: {
						regex: /&#x([0-9a-fA-F]{1,6});/g,
						val: (t$2, e$1) => String.fromCodePoint(Number.parseInt(e$1, 16))
					}
				}, this.addExternalEntities = F, this.parseXml = X, this.parseTextData = L, this.resolveNameSpace = B, this.buildAttributesMap = G, this.isItStopNode = Z, this.replaceEntitiesValue = R, this.readStopNodeData = J, this.saveTextToParentTag = q, this.addChild = Y, this.ignoreAttributesFn = _(this.options.ignoreAttributes);
			}
		}
		function F(t$1) {
			const e$1 = Object.keys(t$1);
			for (let n = 0; n < e$1.length; n++) {
				const i$1 = e$1[n];
				this.lastEntities[i$1] = {
					regex: new RegExp("&" + i$1 + ";", "g"),
					val: t$1[i$1]
				};
			}
		}
		function L(t$1, e$1, n, i$1, s$1, r$1, o$1) {
			if (void 0 !== t$1 && (this.options.trimValues && !i$1 && (t$1 = t$1.trim()), t$1.length > 0)) {
				o$1 || (t$1 = this.replaceEntitiesValue(t$1));
				const i$2 = this.options.tagValueProcessor(e$1, t$1, n, s$1, r$1);
				return null == i$2 ? t$1 : typeof i$2 != typeof t$1 || i$2 !== t$1 ? i$2 : this.options.trimValues || t$1.trim() === t$1 ? H(t$1, this.options.parseTagValue, this.options.numberParseOptions) : t$1;
			}
		}
		function B(t$1) {
			if (this.options.removeNSPrefix) {
				const e$1 = t$1.split(":"), n = "/" === t$1.charAt(0) ? "/" : "";
				if ("xmlns" === e$1[0]) return "";
				2 === e$1.length && (t$1 = n + e$1[1]);
			}
			return t$1;
		}
		const U = new RegExp("([^\\s=]+)\\s*(=\\s*(['\"])([\\s\\S]*?)\\3)?", "gm");
		function G(t$1, e$1, n) {
			if (!0 !== this.options.ignoreAttributes && "string" == typeof t$1) {
				const n$1 = s(t$1, U), i$1 = n$1.length, r$1 = {};
				for (let t$2 = 0; t$2 < i$1; t$2++) {
					const i$2 = this.resolveNameSpace(n$1[t$2][1]);
					if (this.ignoreAttributesFn(i$2, e$1)) continue;
					let s$1 = n$1[t$2][4], o$1 = this.options.attributeNamePrefix + i$2;
					if (i$2.length) if (this.options.transformAttributeName && (o$1 = this.options.transformAttributeName(o$1)), "__proto__" === o$1 && (o$1 = "#__proto__"), void 0 !== s$1) {
						this.options.trimValues && (s$1 = s$1.trim()), s$1 = this.replaceEntitiesValue(s$1);
						const t$3 = this.options.attributeValueProcessor(i$2, s$1, e$1);
						r$1[o$1] = null == t$3 ? s$1 : typeof t$3 != typeof s$1 || t$3 !== s$1 ? t$3 : H(s$1, this.options.parseAttributeValue, this.options.numberParseOptions);
					} else this.options.allowBooleanAttributes && (r$1[o$1] = !0);
				}
				if (!Object.keys(r$1).length) return;
				if (this.options.attributesGroupName) {
					const t$2 = {};
					return t$2[this.options.attributesGroupName] = r$1, t$2;
				}
				return r$1;
			}
		}
		const X = function(t$1) {
			t$1 = t$1.replace(/\r\n?/g, "\n");
			const e$1 = new T("!xml");
			let n = e$1, i$1 = "", s$1 = "";
			for (let r$1 = 0; r$1 < t$1.length; r$1++) if ("<" === t$1[r$1]) if ("/" === t$1[r$1 + 1]) {
				const e$2 = W(t$1, ">", r$1, "Closing Tag is not closed.");
				let o$1 = t$1.substring(r$1 + 2, e$2).trim();
				if (this.options.removeNSPrefix) {
					const t$2 = o$1.indexOf(":");
					-1 !== t$2 && (o$1 = o$1.substr(t$2 + 1));
				}
				this.options.transformTagName && (o$1 = this.options.transformTagName(o$1)), n && (i$1 = this.saveTextToParentTag(i$1, n, s$1));
				const a$1 = s$1.substring(s$1.lastIndexOf(".") + 1);
				if (o$1 && -1 !== this.options.unpairedTags.indexOf(o$1)) throw new Error(`Unpaired tag can not be used as closing tag: </${o$1}>`);
				let l$1 = 0;
				a$1 && -1 !== this.options.unpairedTags.indexOf(a$1) ? (l$1 = s$1.lastIndexOf(".", s$1.lastIndexOf(".") - 1), this.tagsNodeStack.pop()) : l$1 = s$1.lastIndexOf("."), s$1 = s$1.substring(0, l$1), n = this.tagsNodeStack.pop(), i$1 = "", r$1 = e$2;
			} else if ("?" === t$1[r$1 + 1]) {
				let e$2 = z(t$1, r$1, !1, "?>");
				if (!e$2) throw new Error("Pi Tag is not closed.");
				if (i$1 = this.saveTextToParentTag(i$1, n, s$1), this.options.ignoreDeclaration && "?xml" === e$2.tagName || this.options.ignorePiTags);
				else {
					const t$2 = new T(e$2.tagName);
					t$2.add(this.options.textNodeName, ""), e$2.tagName !== e$2.tagExp && e$2.attrExpPresent && (t$2[":@"] = this.buildAttributesMap(e$2.tagExp, s$1, e$2.tagName)), this.addChild(n, t$2, s$1, r$1);
				}
				r$1 = e$2.closeIndex + 1;
			} else if ("!--" === t$1.substr(r$1 + 1, 3)) {
				const e$2 = W(t$1, "-->", r$1 + 4, "Comment is not closed.");
				if (this.options.commentPropName) {
					const o$1 = t$1.substring(r$1 + 4, e$2 - 2);
					i$1 = this.saveTextToParentTag(i$1, n, s$1), n.add(this.options.commentPropName, [{ [this.options.textNodeName]: o$1 }]);
				}
				r$1 = e$2;
			} else if ("!D" === t$1.substr(r$1 + 1, 2)) {
				const e$2 = w(t$1, r$1);
				this.docTypeEntities = e$2.entities, r$1 = e$2.i;
			} else if ("![" === t$1.substr(r$1 + 1, 2)) {
				const e$2 = W(t$1, "]]>", r$1, "CDATA is not closed.") - 2, o$1 = t$1.substring(r$1 + 9, e$2);
				i$1 = this.saveTextToParentTag(i$1, n, s$1);
				let a$1 = this.parseTextData(o$1, n.tagname, s$1, !0, !1, !0, !0);
				a$1 ??= "", this.options.cdataPropName ? n.add(this.options.cdataPropName, [{ [this.options.textNodeName]: o$1 }]) : n.add(this.options.textNodeName, a$1), r$1 = e$2 + 2;
			} else {
				let o$1 = z(t$1, r$1, this.options.removeNSPrefix), a$1 = o$1.tagName;
				const l$1 = o$1.rawTagName;
				let u$1 = o$1.tagExp, h$1 = o$1.attrExpPresent, d$1 = o$1.closeIndex;
				this.options.transformTagName && (a$1 = this.options.transformTagName(a$1)), n && i$1 && "!xml" !== n.tagname && (i$1 = this.saveTextToParentTag(i$1, n, s$1, !1));
				const f$1 = n;
				f$1 && -1 !== this.options.unpairedTags.indexOf(f$1.tagname) && (n = this.tagsNodeStack.pop(), s$1 = s$1.substring(0, s$1.lastIndexOf("."))), a$1 !== e$1.tagname && (s$1 += s$1 ? "." + a$1 : a$1);
				const c$1 = r$1;
				if (this.isItStopNode(this.options.stopNodes, s$1, a$1)) {
					let e$2 = "";
					if (u$1.length > 0 && u$1.lastIndexOf("/") === u$1.length - 1) "/" === a$1[a$1.length - 1] ? (a$1 = a$1.substr(0, a$1.length - 1), s$1 = s$1.substr(0, s$1.length - 1), u$1 = a$1) : u$1 = u$1.substr(0, u$1.length - 1), r$1 = o$1.closeIndex;
					else if (-1 !== this.options.unpairedTags.indexOf(a$1)) r$1 = o$1.closeIndex;
					else {
						const n$1 = this.readStopNodeData(t$1, l$1, d$1 + 1);
						if (!n$1) throw new Error(`Unexpected end of ${l$1}`);
						r$1 = n$1.i, e$2 = n$1.tagContent;
					}
					const i$2 = new T(a$1);
					a$1 !== u$1 && h$1 && (i$2[":@"] = this.buildAttributesMap(u$1, s$1, a$1)), e$2 && (e$2 = this.parseTextData(e$2, a$1, s$1, !0, h$1, !0, !0)), s$1 = s$1.substr(0, s$1.lastIndexOf(".")), i$2.add(this.options.textNodeName, e$2), this.addChild(n, i$2, s$1, c$1);
				} else {
					if (u$1.length > 0 && u$1.lastIndexOf("/") === u$1.length - 1) {
						"/" === a$1[a$1.length - 1] ? (a$1 = a$1.substr(0, a$1.length - 1), s$1 = s$1.substr(0, s$1.length - 1), u$1 = a$1) : u$1 = u$1.substr(0, u$1.length - 1), this.options.transformTagName && (a$1 = this.options.transformTagName(a$1));
						const t$2 = new T(a$1);
						a$1 !== u$1 && h$1 && (t$2[":@"] = this.buildAttributesMap(u$1, s$1, a$1)), this.addChild(n, t$2, s$1, c$1), s$1 = s$1.substr(0, s$1.lastIndexOf("."));
					} else {
						const t$2 = new T(a$1);
						this.tagsNodeStack.push(n), a$1 !== u$1 && h$1 && (t$2[":@"] = this.buildAttributesMap(u$1, s$1, a$1)), this.addChild(n, t$2, s$1, c$1), n = t$2;
					}
					i$1 = "", r$1 = d$1;
				}
			}
			else i$1 += t$1[r$1];
			return e$1.child;
		};
		function Y(t$1, e$1, n, i$1) {
			this.options.captureMetaData || (i$1 = void 0);
			const s$1 = this.options.updateTag(e$1.tagname, n, e$1[":@"]);
			!1 === s$1 || ("string" == typeof s$1 ? (e$1.tagname = s$1, t$1.addChild(e$1, i$1)) : t$1.addChild(e$1, i$1));
		}
		const R = function(t$1) {
			if (this.options.processEntities) {
				for (let e$1 in this.docTypeEntities) {
					const n = this.docTypeEntities[e$1];
					t$1 = t$1.replace(n.regx, n.val);
				}
				for (let e$1 in this.lastEntities) {
					const n = this.lastEntities[e$1];
					t$1 = t$1.replace(n.regex, n.val);
				}
				if (this.options.htmlEntities) for (let e$1 in this.htmlEntities) {
					const n = this.htmlEntities[e$1];
					t$1 = t$1.replace(n.regex, n.val);
				}
				t$1 = t$1.replace(this.ampEntity.regex, this.ampEntity.val);
			}
			return t$1;
		};
		function q(t$1, e$1, n, i$1) {
			return t$1 && (void 0 === i$1 && (i$1 = 0 === e$1.child.length), void 0 !== (t$1 = this.parseTextData(t$1, e$1.tagname, n, !1, !!e$1[":@"] && 0 !== Object.keys(e$1[":@"]).length, i$1)) && "" !== t$1 && e$1.add(this.options.textNodeName, t$1), t$1 = ""), t$1;
		}
		function Z(t$1, e$1, n) {
			const i$1 = "*." + n;
			for (const n$1 in t$1) {
				const s$1 = t$1[n$1];
				if (i$1 === s$1 || e$1 === s$1) return !0;
			}
			return !1;
		}
		function W(t$1, e$1, n, i$1) {
			const s$1 = t$1.indexOf(e$1, n);
			if (-1 === s$1) throw new Error(i$1);
			return s$1 + e$1.length - 1;
		}
		function z(t$1, e$1, n, i$1 = ">") {
			const s$1 = function(t$2, e$2, n$1 = ">") {
				let i$2, s$2 = "";
				for (let r$2 = e$2; r$2 < t$2.length; r$2++) {
					let e$3 = t$2[r$2];
					if (i$2) e$3 === i$2 && (i$2 = "");
					else if ("\"" === e$3 || "'" === e$3) i$2 = e$3;
					else if (e$3 === n$1[0]) {
						if (!n$1[1]) return {
							data: s$2,
							index: r$2
						};
						if (t$2[r$2 + 1] === n$1[1]) return {
							data: s$2,
							index: r$2
						};
					} else "	" === e$3 && (e$3 = " ");
					s$2 += e$3;
				}
			}(t$1, e$1 + 1, i$1);
			if (!s$1) return;
			let r$1 = s$1.data;
			const o$1 = s$1.index, a$1 = r$1.search(/\s/);
			let l$1 = r$1, u$1 = !0;
			-1 !== a$1 && (l$1 = r$1.substring(0, a$1), r$1 = r$1.substring(a$1 + 1).trimStart());
			const h$1 = l$1;
			if (n) {
				const t$2 = l$1.indexOf(":");
				-1 !== t$2 && (l$1 = l$1.substr(t$2 + 1), u$1 = l$1 !== s$1.data.substr(t$2 + 1));
			}
			return {
				tagName: l$1,
				tagExp: r$1,
				closeIndex: o$1,
				attrExpPresent: u$1,
				rawTagName: h$1
			};
		}
		function J(t$1, e$1, n) {
			const i$1 = n;
			let s$1 = 1;
			for (; n < t$1.length; n++) if ("<" === t$1[n]) if ("/" === t$1[n + 1]) {
				const r$1 = W(t$1, ">", n, `${e$1} is not closed`);
				if (t$1.substring(n + 2, r$1).trim() === e$1 && (s$1--, 0 === s$1)) return {
					tagContent: t$1.substring(i$1, n),
					i: r$1
				};
				n = r$1;
			} else if ("?" === t$1[n + 1]) n = W(t$1, "?>", n + 1, "StopNode is not closed.");
			else if ("!--" === t$1.substr(n + 1, 3)) n = W(t$1, "-->", n + 3, "StopNode is not closed.");
			else if ("![" === t$1.substr(n + 1, 2)) n = W(t$1, "]]>", n, "StopNode is not closed.") - 2;
			else {
				const i$2 = z(t$1, n, ">");
				i$2 && ((i$2 && i$2.tagName) === e$1 && "/" !== i$2.tagExp[i$2.tagExp.length - 1] && s$1++, n = i$2.closeIndex);
			}
		}
		function H(t$1, e$1, n) {
			if (e$1 && "string" == typeof t$1) {
				const e$2 = t$1.trim();
				return "true" === e$2 || "false" !== e$2 && function(t$2, e$3 = {}) {
					if (e$3 = Object.assign({}, V, e$3), !t$2 || "string" != typeof t$2) return t$2;
					let n$1 = t$2.trim();
					if (void 0 !== e$3.skipLike && e$3.skipLike.test(n$1)) return t$2;
					if ("0" === t$2) return 0;
					if (e$3.hex && j.test(n$1)) return function(t$3) {
						if (parseInt) return parseInt(t$3, 16);
						if (Number.parseInt) return Number.parseInt(t$3, 16);
						if (window && window.parseInt) return window.parseInt(t$3, 16);
						throw new Error("parseInt, Number.parseInt, window.parseInt are not supported");
					}(n$1);
					if (-1 !== n$1.search(/.+[eE].+/)) return function(t$3, e$4, n$2) {
						if (!n$2.eNotation) return t$3;
						const i$2 = e$4.match(M);
						if (i$2) {
							let s$1 = i$2[1] || "";
							const r$1 = -1 === i$2[3].indexOf("e") ? "E" : "e", o$1 = i$2[2], a$1 = s$1 ? t$3[o$1.length + 1] === r$1 : t$3[o$1.length] === r$1;
							return o$1.length > 1 && a$1 ? t$3 : 1 !== o$1.length || !i$2[3].startsWith(`.${r$1}`) && i$2[3][0] !== r$1 ? n$2.leadingZeros && !a$1 ? (e$4 = (i$2[1] || "") + i$2[3], Number(e$4)) : t$3 : Number(e$4);
						}
						return t$3;
					}(t$2, n$1, e$3);
					{
						const s$1 = D.exec(n$1);
						if (s$1) {
							const r$1 = s$1[1] || "", o$1 = s$1[2];
							let a$1 = (i$1 = s$1[3]) && -1 !== i$1.indexOf(".") ? ("." === (i$1 = i$1.replace(/0+$/, "")) ? i$1 = "0" : "." === i$1[0] ? i$1 = "0" + i$1 : "." === i$1[i$1.length - 1] && (i$1 = i$1.substring(0, i$1.length - 1)), i$1) : i$1;
							const l$1 = r$1 ? "." === t$2[o$1.length + 1] : "." === t$2[o$1.length];
							if (!e$3.leadingZeros && (o$1.length > 1 || 1 === o$1.length && !l$1)) return t$2;
							{
								const i$2 = Number(n$1), s$2 = String(i$2);
								if (0 === i$2 || -0 === i$2) return i$2;
								if (-1 !== s$2.search(/[eE]/)) return e$3.eNotation ? i$2 : t$2;
								if (-1 !== n$1.indexOf(".")) return "0" === s$2 || s$2 === a$1 || s$2 === `${r$1}${a$1}` ? i$2 : t$2;
								let l$2 = o$1 ? a$1 : n$1;
								return o$1 ? l$2 === s$2 || r$1 + l$2 === s$2 ? i$2 : t$2 : l$2 === s$2 || l$2 === r$1 + s$2 ? i$2 : t$2;
							}
						}
						return t$2;
					}
					var i$1;
				}(t$1, n);
			}
			return void 0 !== t$1 ? t$1 : "";
		}
		const K = T.getMetaDataSymbol();
		function Q(t$1, e$1) {
			return tt(t$1, e$1);
		}
		function tt(t$1, e$1, n) {
			let i$1;
			const s$1 = {};
			for (let r$1 = 0; r$1 < t$1.length; r$1++) {
				const o$1 = t$1[r$1], a$1 = et(o$1);
				let l$1 = "";
				if (l$1 = void 0 === n ? a$1 : n + "." + a$1, a$1 === e$1.textNodeName) void 0 === i$1 ? i$1 = o$1[a$1] : i$1 += "" + o$1[a$1];
				else {
					if (void 0 === a$1) continue;
					if (o$1[a$1]) {
						let t$2 = tt(o$1[a$1], e$1, l$1);
						const n$1 = it(t$2, e$1);
						void 0 !== o$1[K] && (t$2[K] = o$1[K]), o$1[":@"] ? nt(t$2, o$1[":@"], l$1, e$1) : 1 !== Object.keys(t$2).length || void 0 === t$2[e$1.textNodeName] || e$1.alwaysCreateTextNode ? 0 === Object.keys(t$2).length && (e$1.alwaysCreateTextNode ? t$2[e$1.textNodeName] = "" : t$2 = "") : t$2 = t$2[e$1.textNodeName], void 0 !== s$1[a$1] && s$1.hasOwnProperty(a$1) ? (Array.isArray(s$1[a$1]) || (s$1[a$1] = [s$1[a$1]]), s$1[a$1].push(t$2)) : e$1.isArray(a$1, l$1, n$1) ? s$1[a$1] = [t$2] : s$1[a$1] = t$2;
					}
				}
			}
			return "string" == typeof i$1 ? i$1.length > 0 && (s$1[e$1.textNodeName] = i$1) : void 0 !== i$1 && (s$1[e$1.textNodeName] = i$1), s$1;
		}
		function et(t$1) {
			const e$1 = Object.keys(t$1);
			for (let t$2 = 0; t$2 < e$1.length; t$2++) {
				const n = e$1[t$2];
				if (":@" !== n) return n;
			}
		}
		function nt(t$1, e$1, n, i$1) {
			if (e$1) {
				const s$1 = Object.keys(e$1), r$1 = s$1.length;
				for (let o$1 = 0; o$1 < r$1; o$1++) {
					const r$2 = s$1[o$1];
					i$1.isArray(r$2, n + "." + r$2, !0, !0) ? t$1[r$2] = [e$1[r$2]] : t$1[r$2] = e$1[r$2];
				}
			}
		}
		function it(t$1, e$1) {
			const { textNodeName: n } = e$1, i$1 = Object.keys(t$1).length;
			return 0 === i$1 || !(1 !== i$1 || !t$1[n] && "boolean" != typeof t$1[n] && 0 !== t$1[n]);
		}
		class st {
			constructor(t$1) {
				this.externalEntities = {}, this.options = function(t$2) {
					return Object.assign({}, v, t$2);
				}(t$1);
			}
			parse(t$1, e$1) {
				if ("string" == typeof t$1);
				else {
					if (!t$1.toString) throw new Error("XML data is accepted in String or Bytes[] form.");
					t$1 = t$1.toString();
				}
				if (e$1) {
					!0 === e$1 && (e$1 = {});
					const n$1 = a(t$1, e$1);
					if (!0 !== n$1) throw Error(`${n$1.err.msg}:${n$1.err.line}:${n$1.err.col}`);
				}
				const n = new k(this.options);
				n.addExternalEntities(this.externalEntities);
				const i$1 = n.parseXml(t$1);
				return this.options.preserveOrder || void 0 === i$1 ? i$1 : Q(i$1, this.options);
			}
			addEntity(t$1, e$1) {
				if (-1 !== e$1.indexOf("&")) throw new Error("Entity value can't have '&'");
				if (-1 !== t$1.indexOf("&") || -1 !== t$1.indexOf(";")) throw new Error("An entity must be set without '&' and ';'. Eg. use '#xD' for '&#xD;'");
				if ("&" === e$1) throw new Error("An entity with value '&' is not permitted");
				this.externalEntities[t$1] = e$1;
			}
			static getMetaDataSymbol() {
				return T.getMetaDataSymbol();
			}
		}
		function rt(t$1, e$1) {
			let n = "";
			return e$1.format && e$1.indentBy.length > 0 && (n = "\n"), ot(t$1, e$1, "", n);
		}
		function ot(t$1, e$1, n, i$1) {
			let s$1 = "", r$1 = !1;
			for (let o$1 = 0; o$1 < t$1.length; o$1++) {
				const a$1 = t$1[o$1], l$1 = at(a$1);
				if (void 0 === l$1) continue;
				let u$1 = "";
				if (u$1 = 0 === n.length ? l$1 : `${n}.${l$1}`, l$1 === e$1.textNodeName) {
					let t$2 = a$1[l$1];
					ut(u$1, e$1) || (t$2 = e$1.tagValueProcessor(l$1, t$2), t$2 = ht(t$2, e$1)), r$1 && (s$1 += i$1), s$1 += t$2, r$1 = !1;
					continue;
				}
				if (l$1 === e$1.cdataPropName) {
					r$1 && (s$1 += i$1), s$1 += `<![CDATA[${a$1[l$1][0][e$1.textNodeName]}]]>`, r$1 = !1;
					continue;
				}
				if (l$1 === e$1.commentPropName) {
					s$1 += i$1 + `\x3c!--${a$1[l$1][0][e$1.textNodeName]}--\x3e`, r$1 = !0;
					continue;
				}
				if ("?" === l$1[0]) {
					const t$2 = lt(a$1[":@"], e$1), n$1 = "?xml" === l$1 ? "" : i$1;
					let o$2 = a$1[l$1][0][e$1.textNodeName];
					o$2 = 0 !== o$2.length ? " " + o$2 : "", s$1 += n$1 + `<${l$1}${o$2}${t$2}?>`, r$1 = !0;
					continue;
				}
				let h$1 = i$1;
				"" !== h$1 && (h$1 += e$1.indentBy);
				const d$1 = i$1 + `<${l$1}${lt(a$1[":@"], e$1)}`, f$1 = ot(a$1[l$1], e$1, u$1, h$1);
				-1 !== e$1.unpairedTags.indexOf(l$1) ? e$1.suppressUnpairedNode ? s$1 += d$1 + ">" : s$1 += d$1 + "/>" : f$1 && 0 !== f$1.length || !e$1.suppressEmptyNode ? f$1 && f$1.endsWith(">") ? s$1 += d$1 + `>${f$1}${i$1}</${l$1}>` : (s$1 += d$1 + ">", f$1 && "" !== i$1 && (f$1.includes("/>") || f$1.includes("</")) ? s$1 += i$1 + e$1.indentBy + f$1 + i$1 : s$1 += f$1, s$1 += `</${l$1}>`) : s$1 += d$1 + "/>", r$1 = !0;
			}
			return s$1;
		}
		function at(t$1) {
			const e$1 = Object.keys(t$1);
			for (let n = 0; n < e$1.length; n++) {
				const i$1 = e$1[n];
				if (t$1.hasOwnProperty(i$1) && ":@" !== i$1) return i$1;
			}
		}
		function lt(t$1, e$1) {
			let n = "";
			if (t$1 && !e$1.ignoreAttributes) for (let i$1 in t$1) {
				if (!t$1.hasOwnProperty(i$1)) continue;
				let s$1 = e$1.attributeValueProcessor(i$1, t$1[i$1]);
				s$1 = ht(s$1, e$1), !0 === s$1 && e$1.suppressBooleanAttributes ? n += ` ${i$1.substr(e$1.attributeNamePrefix.length)}` : n += ` ${i$1.substr(e$1.attributeNamePrefix.length)}="${s$1}"`;
			}
			return n;
		}
		function ut(t$1, e$1) {
			let n = (t$1 = t$1.substr(0, t$1.length - e$1.textNodeName.length - 1)).substr(t$1.lastIndexOf(".") + 1);
			for (let i$1 in e$1.stopNodes) if (e$1.stopNodes[i$1] === t$1 || e$1.stopNodes[i$1] === "*." + n) return !0;
			return !1;
		}
		function ht(t$1, e$1) {
			if (t$1 && t$1.length > 0 && e$1.processEntities) for (let n = 0; n < e$1.entities.length; n++) {
				const i$1 = e$1.entities[n];
				t$1 = t$1.replace(i$1.regex, i$1.val);
			}
			return t$1;
		}
		const dt = {
			attributeNamePrefix: "@_",
			attributesGroupName: !1,
			textNodeName: "#text",
			ignoreAttributes: !0,
			cdataPropName: !1,
			format: !1,
			indentBy: "  ",
			suppressEmptyNode: !1,
			suppressUnpairedNode: !0,
			suppressBooleanAttributes: !0,
			tagValueProcessor: function(t$1, e$1) {
				return e$1;
			},
			attributeValueProcessor: function(t$1, e$1) {
				return e$1;
			},
			preserveOrder: !1,
			commentPropName: !1,
			unpairedTags: [],
			entities: [
				{
					regex: new RegExp("&", "g"),
					val: "&amp;"
				},
				{
					regex: new RegExp(">", "g"),
					val: "&gt;"
				},
				{
					regex: new RegExp("<", "g"),
					val: "&lt;"
				},
				{
					regex: new RegExp("'", "g"),
					val: "&apos;"
				},
				{
					regex: new RegExp("\"", "g"),
					val: "&quot;"
				}
			],
			processEntities: !0,
			stopNodes: [],
			oneListGroup: !1
		};
		function ft(t$1) {
			this.options = Object.assign({}, dt, t$1), !0 === this.options.ignoreAttributes || this.options.attributesGroupName ? this.isAttribute = function() {
				return !1;
			} : (this.ignoreAttributesFn = _(this.options.ignoreAttributes), this.attrPrefixLen = this.options.attributeNamePrefix.length, this.isAttribute = gt), this.processTextOrObjNode = ct, this.options.format ? (this.indentate = pt, this.tagEndChar = ">\n", this.newLine = "\n") : (this.indentate = function() {
				return "";
			}, this.tagEndChar = ">", this.newLine = "");
		}
		function ct(t$1, e$1, n, i$1) {
			const s$1 = this.j2x(t$1, n + 1, i$1.concat(e$1));
			return void 0 !== t$1[this.options.textNodeName] && 1 === Object.keys(t$1).length ? this.buildTextValNode(t$1[this.options.textNodeName], e$1, s$1.attrStr, n) : this.buildObjectNode(s$1.val, e$1, s$1.attrStr, n);
		}
		function pt(t$1) {
			return this.options.indentBy.repeat(t$1);
		}
		function gt(t$1) {
			return !(!t$1.startsWith(this.options.attributeNamePrefix) || t$1 === this.options.textNodeName) && t$1.substr(this.attrPrefixLen);
		}
		ft.prototype.build = function(t$1) {
			return this.options.preserveOrder ? rt(t$1, this.options) : (Array.isArray(t$1) && this.options.arrayNodeName && this.options.arrayNodeName.length > 1 && (t$1 = { [this.options.arrayNodeName]: t$1 }), this.j2x(t$1, 0, []).val);
		}, ft.prototype.j2x = function(t$1, e$1, n) {
			let i$1 = "", s$1 = "";
			const r$1 = n.join(".");
			for (let o$1 in t$1) if (Object.prototype.hasOwnProperty.call(t$1, o$1)) if (void 0 === t$1[o$1]) this.isAttribute(o$1) && (s$1 += "");
			else if (null === t$1[o$1]) this.isAttribute(o$1) || o$1 === this.options.cdataPropName ? s$1 += "" : "?" === o$1[0] ? s$1 += this.indentate(e$1) + "<" + o$1 + "?" + this.tagEndChar : s$1 += this.indentate(e$1) + "<" + o$1 + "/" + this.tagEndChar;
			else if (t$1[o$1] instanceof Date) s$1 += this.buildTextValNode(t$1[o$1], o$1, "", e$1);
			else if ("object" != typeof t$1[o$1]) {
				const n$1 = this.isAttribute(o$1);
				if (n$1 && !this.ignoreAttributesFn(n$1, r$1)) i$1 += this.buildAttrPairStr(n$1, "" + t$1[o$1]);
				else if (!n$1) if (o$1 === this.options.textNodeName) {
					let e$2 = this.options.tagValueProcessor(o$1, "" + t$1[o$1]);
					s$1 += this.replaceEntitiesValue(e$2);
				} else s$1 += this.buildTextValNode(t$1[o$1], o$1, "", e$1);
			} else if (Array.isArray(t$1[o$1])) {
				const i$2 = t$1[o$1].length;
				let r$2 = "", a$1 = "";
				for (let l$1 = 0; l$1 < i$2; l$1++) {
					const i$3 = t$1[o$1][l$1];
					if (void 0 === i$3);
					else if (null === i$3) "?" === o$1[0] ? s$1 += this.indentate(e$1) + "<" + o$1 + "?" + this.tagEndChar : s$1 += this.indentate(e$1) + "<" + o$1 + "/" + this.tagEndChar;
					else if ("object" == typeof i$3) if (this.options.oneListGroup) {
						const t$2 = this.j2x(i$3, e$1 + 1, n.concat(o$1));
						r$2 += t$2.val, this.options.attributesGroupName && i$3.hasOwnProperty(this.options.attributesGroupName) && (a$1 += t$2.attrStr);
					} else r$2 += this.processTextOrObjNode(i$3, o$1, e$1, n);
					else if (this.options.oneListGroup) {
						let t$2 = this.options.tagValueProcessor(o$1, i$3);
						t$2 = this.replaceEntitiesValue(t$2), r$2 += t$2;
					} else r$2 += this.buildTextValNode(i$3, o$1, "", e$1);
				}
				this.options.oneListGroup && (r$2 = this.buildObjectNode(r$2, o$1, a$1, e$1)), s$1 += r$2;
			} else if (this.options.attributesGroupName && o$1 === this.options.attributesGroupName) {
				const e$2 = Object.keys(t$1[o$1]), n$1 = e$2.length;
				for (let s$2 = 0; s$2 < n$1; s$2++) i$1 += this.buildAttrPairStr(e$2[s$2], "" + t$1[o$1][e$2[s$2]]);
			} else s$1 += this.processTextOrObjNode(t$1[o$1], o$1, e$1, n);
			return {
				attrStr: i$1,
				val: s$1
			};
		}, ft.prototype.buildAttrPairStr = function(t$1, e$1) {
			return e$1 = this.options.attributeValueProcessor(t$1, "" + e$1), e$1 = this.replaceEntitiesValue(e$1), this.options.suppressBooleanAttributes && "true" === e$1 ? " " + t$1 : " " + t$1 + "=\"" + e$1 + "\"";
		}, ft.prototype.buildObjectNode = function(t$1, e$1, n, i$1) {
			if ("" === t$1) return "?" === e$1[0] ? this.indentate(i$1) + "<" + e$1 + n + "?" + this.tagEndChar : this.indentate(i$1) + "<" + e$1 + n + this.closeTag(e$1) + this.tagEndChar;
			{
				let s$1 = "</" + e$1 + this.tagEndChar, r$1 = "";
				return "?" === e$1[0] && (r$1 = "?", s$1 = ""), !n && "" !== n || -1 !== t$1.indexOf("<") ? !1 !== this.options.commentPropName && e$1 === this.options.commentPropName && 0 === r$1.length ? this.indentate(i$1) + `\x3c!--${t$1}--\x3e` + this.newLine : this.indentate(i$1) + "<" + e$1 + n + r$1 + this.tagEndChar + t$1 + this.indentate(i$1) + s$1 : this.indentate(i$1) + "<" + e$1 + n + r$1 + ">" + t$1 + s$1;
			}
		}, ft.prototype.closeTag = function(t$1) {
			let e$1 = "";
			return -1 !== this.options.unpairedTags.indexOf(t$1) ? this.options.suppressUnpairedNode || (e$1 = "/") : e$1 = this.options.suppressEmptyNode ? "/" : `></${t$1}`, e$1;
		}, ft.prototype.buildTextValNode = function(t$1, e$1, n, i$1) {
			if (!1 !== this.options.cdataPropName && e$1 === this.options.cdataPropName) return this.indentate(i$1) + `<![CDATA[${t$1}]]>` + this.newLine;
			if (!1 !== this.options.commentPropName && e$1 === this.options.commentPropName) return this.indentate(i$1) + `\x3c!--${t$1}--\x3e` + this.newLine;
			if ("?" === e$1[0]) return this.indentate(i$1) + "<" + e$1 + n + "?" + this.tagEndChar;
			{
				let s$1 = this.options.tagValueProcessor(e$1, t$1);
				return s$1 = this.replaceEntitiesValue(s$1), "" === s$1 ? this.indentate(i$1) + "<" + e$1 + n + this.closeTag(e$1) + this.tagEndChar : this.indentate(i$1) + "<" + e$1 + n + ">" + s$1 + "</" + e$1 + this.tagEndChar;
			}
		}, ft.prototype.replaceEntitiesValue = function(t$1) {
			if (t$1 && t$1.length > 0 && this.options.processEntities) for (let e$1 = 0; e$1 < this.options.entities.length; e$1++) {
				const n = this.options.entities[e$1];
				t$1 = t$1.replace(n.regex, n.val);
			}
			return t$1;
		};
		const mt = { validate: a };
		module.exports = e;
	})();
}));

//#endregion
//#region ../node_modules/.pnpm/@aws-sdk+xml-builder@3.930.0/node_modules/@aws-sdk/xml-builder/dist-cjs/xml-parser.js
var require_xml_parser = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.parseXML = parseXML;
	const parser = new (require_fxp()).XMLParser({
		attributeNamePrefix: "",
		htmlEntities: true,
		ignoreAttributes: false,
		ignoreDeclaration: true,
		parseTagValue: false,
		trimValues: false,
		tagValueProcessor: (_, val) => val.trim() === "" && val.includes("\n") ? "" : void 0
	});
	parser.addEntity("#xD", "\r");
	parser.addEntity("#10", "\n");
	function parseXML(xmlString) {
		return parser.parse(xmlString, true);
	}
}));

//#endregion
//#region ../node_modules/.pnpm/@aws-sdk+xml-builder@3.930.0/node_modules/@aws-sdk/xml-builder/dist-cjs/index.js
var require_dist_cjs$13 = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	var xmlParser = require_xml_parser();
	function escapeAttribute(value) {
		return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
	}
	function escapeElement(value) {
		return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&apos;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\r/g, "&#x0D;").replace(/\n/g, "&#x0A;").replace(/\u0085/g, "&#x85;").replace(/\u2028/, "&#x2028;");
	}
	var XmlText = class {
		value;
		constructor(value) {
			this.value = value;
		}
		toString() {
			return escapeElement("" + this.value);
		}
	};
	var XmlNode = class XmlNode {
		name;
		children;
		attributes = {};
		static of(name, childText, withName) {
			const node = new XmlNode(name);
			if (childText !== void 0) node.addChildNode(new XmlText(childText));
			if (withName !== void 0) node.withName(withName);
			return node;
		}
		constructor(name, children = []) {
			this.name = name;
			this.children = children;
		}
		withName(name) {
			this.name = name;
			return this;
		}
		addAttribute(name, value) {
			this.attributes[name] = value;
			return this;
		}
		addChildNode(child) {
			this.children.push(child);
			return this;
		}
		removeAttribute(name) {
			delete this.attributes[name];
			return this;
		}
		n(name) {
			this.name = name;
			return this;
		}
		c(child) {
			this.children.push(child);
			return this;
		}
		a(name, value) {
			if (value != null) this.attributes[name] = value;
			return this;
		}
		cc(input, field, withName = field) {
			if (input[field] != null) {
				const node = XmlNode.of(field, input[field]).withName(withName);
				this.c(node);
			}
		}
		l(input, listName, memberName, valueProvider) {
			if (input[listName] != null) valueProvider().map((node) => {
				node.withName(memberName);
				this.c(node);
			});
		}
		lc(input, listName, memberName, valueProvider) {
			if (input[listName] != null) {
				const nodes = valueProvider();
				const containerNode = new XmlNode(memberName);
				nodes.map((node) => {
					containerNode.c(node);
				});
				this.c(containerNode);
			}
		}
		toString() {
			const hasChildren = Boolean(this.children.length);
			let xmlText = `<${this.name}`;
			const attributes = this.attributes;
			for (const attributeName of Object.keys(attributes)) {
				const attribute = attributes[attributeName];
				if (attribute != null) xmlText += ` ${attributeName}="${escapeAttribute("" + attribute)}"`;
			}
			return xmlText += !hasChildren ? "/>" : `>${this.children.map((c) => c.toString()).join("")}</${this.name}>`;
		}
	};
	Object.defineProperty(exports, "parseXML", {
		enumerable: true,
		get: function() {
			return xmlParser.parseXML;
		}
	});
	exports.XmlNode = XmlNode;
	exports.XmlText = XmlText;
}));

//#endregion
//#region ../node_modules/.pnpm/@aws-sdk+core@3.940.0/node_modules/@aws-sdk/core/dist-es/submodules/protocols/xml/XmlShapeDeserializer.js
var import_dist_cjs$7, import_dist_cjs$8, import_dist_cjs$9, XmlShapeDeserializer;
var init_XmlShapeDeserializer = require_chunk.__esmMin((() => {
	import_dist_cjs$7 = require_dist_cjs$13();
	require_dist_cjs$38.init_protocols();
	require_dist_cjs$38.init_schema();
	import_dist_cjs$8 = require_dist_cjs$38.require_dist_cjs();
	import_dist_cjs$9 = require_dist_cjs$39.require_dist_cjs();
	init_ConfigurableSerdeContext();
	XmlShapeDeserializer = class extends SerdeContextConfig {
		settings;
		stringDeserializer;
		constructor(settings) {
			super();
			this.settings = settings;
			this.stringDeserializer = new require_dist_cjs$38.FromStringShapeDeserializer(settings);
		}
		setSerdeContext(serdeContext) {
			this.serdeContext = serdeContext;
			this.stringDeserializer.setSerdeContext(serdeContext);
		}
		read(schema, bytes, key) {
			const ns = require_dist_cjs$38.NormalizedSchema.of(schema);
			const memberSchemas = ns.getMemberSchemas();
			if (ns.isStructSchema() && ns.isMemberSchema() && !!Object.values(memberSchemas).find((memberNs) => {
				return !!memberNs.getMemberTraits().eventPayload;
			})) {
				const output = {};
				const memberName = Object.keys(memberSchemas)[0];
				if (memberSchemas[memberName].isBlobSchema()) output[memberName] = bytes;
				else output[memberName] = this.read(memberSchemas[memberName], bytes);
				return output;
			}
			const xmlString = (this.serdeContext?.utf8Encoder ?? import_dist_cjs$9.toUtf8)(bytes);
			const parsedObject = this.parseXml(xmlString);
			return this.readSchema(schema, key ? parsedObject[key] : parsedObject);
		}
		readSchema(_schema, value) {
			const ns = require_dist_cjs$38.NormalizedSchema.of(_schema);
			if (ns.isUnitSchema()) return;
			const traits = ns.getMergedTraits();
			if (ns.isListSchema() && !Array.isArray(value)) return this.readSchema(ns, [value]);
			if (value == null) return value;
			if (typeof value === "object") {
				const sparse = !!traits.sparse;
				const flat = !!traits.xmlFlattened;
				if (ns.isListSchema()) {
					const listValue = ns.getValueSchema();
					const buffer$2 = [];
					const sourceKey = listValue.getMergedTraits().xmlName ?? "member";
					const source = flat ? value : (value[0] ?? value)[sourceKey];
					const sourceArray = Array.isArray(source) ? source : [source];
					for (const v of sourceArray) if (v != null || sparse) buffer$2.push(this.readSchema(listValue, v));
					return buffer$2;
				}
				const buffer$1 = {};
				if (ns.isMapSchema()) {
					const keyNs = ns.getKeySchema();
					const memberNs = ns.getValueSchema();
					let entries;
					if (flat) entries = Array.isArray(value) ? value : [value];
					else entries = Array.isArray(value.entry) ? value.entry : [value.entry];
					const keyProperty = keyNs.getMergedTraits().xmlName ?? "key";
					const valueProperty = memberNs.getMergedTraits().xmlName ?? "value";
					for (const entry of entries) {
						const key = entry[keyProperty];
						const value$1 = entry[valueProperty];
						if (value$1 != null || sparse) buffer$1[key] = this.readSchema(memberNs, value$1);
					}
					return buffer$1;
				}
				if (ns.isStructSchema()) {
					for (const [memberName, memberSchema] of ns.structIterator()) {
						const memberTraits = memberSchema.getMergedTraits();
						const xmlObjectKey = !memberTraits.httpPayload ? memberSchema.getMemberTraits().xmlName ?? memberName : memberTraits.xmlName ?? memberSchema.getName();
						if (value[xmlObjectKey] != null) buffer$1[memberName] = this.readSchema(memberSchema, value[xmlObjectKey]);
					}
					return buffer$1;
				}
				if (ns.isDocumentSchema()) return value;
				throw new Error(`@aws-sdk/core/protocols - xml deserializer unhandled schema type for ${ns.getName(true)}`);
			}
			if (ns.isListSchema()) return [];
			if (ns.isMapSchema() || ns.isStructSchema()) return {};
			return this.stringDeserializer.read(ns, value);
		}
		parseXml(xml) {
			if (xml.length) {
				let parsedObj;
				try {
					parsedObj = (0, import_dist_cjs$7.parseXML)(xml);
				} catch (e) {
					if (e && typeof e === "object") Object.defineProperty(e, "$responseBodyText", { value: xml });
					throw e;
				}
				const textNodeName = "#text";
				const key = Object.keys(parsedObj)[0];
				const parsedObjToReturn = parsedObj[key];
				if (parsedObjToReturn[textNodeName]) {
					parsedObjToReturn[key] = parsedObjToReturn[textNodeName];
					delete parsedObjToReturn[textNodeName];
				}
				return (0, import_dist_cjs$8.getValueFromTextNode)(parsedObjToReturn);
			}
			return {};
		}
	};
}));

//#endregion
//#region ../node_modules/.pnpm/@aws-sdk+core@3.940.0/node_modules/@aws-sdk/core/dist-es/submodules/protocols/query/QueryShapeSerializer.js
var import_dist_cjs$5, import_dist_cjs$6, QueryShapeSerializer;
var init_QueryShapeSerializer = require_chunk.__esmMin((() => {
	require_dist_cjs$38.init_protocols();
	require_dist_cjs$38.init_schema();
	require_dist_cjs$38.init_serde();
	import_dist_cjs$5 = require_dist_cjs$38.require_dist_cjs();
	import_dist_cjs$6 = require_dist_cjs$38.require_dist_cjs$6();
	init_ConfigurableSerdeContext();
	init_structIterator();
	QueryShapeSerializer = class extends SerdeContextConfig {
		settings;
		buffer;
		constructor(settings) {
			super();
			this.settings = settings;
		}
		write(schema, value, prefix = "") {
			if (this.buffer === void 0) this.buffer = "";
			const ns = require_dist_cjs$38.NormalizedSchema.of(schema);
			if (prefix && !prefix.endsWith(".")) prefix += ".";
			if (ns.isBlobSchema()) {
				if (typeof value === "string" || value instanceof Uint8Array) {
					this.writeKey(prefix);
					this.writeValue((this.serdeContext?.base64Encoder ?? import_dist_cjs$6.toBase64)(value));
				}
			} else if (ns.isBooleanSchema() || ns.isNumericSchema() || ns.isStringSchema()) {
				if (value != null) {
					this.writeKey(prefix);
					this.writeValue(String(value));
				} else if (ns.isIdempotencyToken()) {
					this.writeKey(prefix);
					this.writeValue((0, require_dist_cjs$38.import_dist_cjs.v4)());
				}
			} else if (ns.isBigIntegerSchema()) {
				if (value != null) {
					this.writeKey(prefix);
					this.writeValue(String(value));
				}
			} else if (ns.isBigDecimalSchema()) {
				if (value != null) {
					this.writeKey(prefix);
					this.writeValue(value instanceof require_dist_cjs$38.NumericValue ? value.string : String(value));
				}
			} else if (ns.isTimestampSchema()) {
				if (value instanceof Date) {
					this.writeKey(prefix);
					switch (require_dist_cjs$38.determineTimestampFormat(ns, this.settings)) {
						case 5:
							this.writeValue(value.toISOString().replace(".000Z", "Z"));
							break;
						case 6:
							this.writeValue((0, import_dist_cjs$5.dateToUtcString)(value));
							break;
						case 7:
							this.writeValue(String(value.getTime() / 1e3));
							break;
					}
				}
			} else if (ns.isDocumentSchema()) throw new Error(`@aws-sdk/core/protocols - QuerySerializer unsupported document type ${ns.getName(true)}`);
			else if (ns.isListSchema()) {
				if (Array.isArray(value)) if (value.length === 0) {
					if (this.settings.serializeEmptyLists) {
						this.writeKey(prefix);
						this.writeValue("");
					}
				} else {
					const member = ns.getValueSchema();
					const flat = this.settings.flattenLists || ns.getMergedTraits().xmlFlattened;
					let i = 1;
					for (const item of value) {
						if (item == null) continue;
						const suffix = this.getKey("member", member.getMergedTraits().xmlName);
						const key = flat ? `${prefix}${i}` : `${prefix}${suffix}.${i}`;
						this.write(member, item, key);
						++i;
					}
				}
			} else if (ns.isMapSchema()) {
				if (value && typeof value === "object") {
					const keySchema = ns.getKeySchema();
					const memberSchema = ns.getValueSchema();
					const flat = ns.getMergedTraits().xmlFlattened;
					let i = 1;
					for (const [k, v] of Object.entries(value)) {
						if (v == null) continue;
						const keySuffix = this.getKey("key", keySchema.getMergedTraits().xmlName);
						const key = flat ? `${prefix}${i}.${keySuffix}` : `${prefix}entry.${i}.${keySuffix}`;
						const valueSuffix = this.getKey("value", memberSchema.getMergedTraits().xmlName);
						const valueKey = flat ? `${prefix}${i}.${valueSuffix}` : `${prefix}entry.${i}.${valueSuffix}`;
						this.write(keySchema, k, key);
						this.write(memberSchema, v, valueKey);
						++i;
					}
				}
			} else if (ns.isStructSchema()) {
				if (value && typeof value === "object") for (const [memberName, member] of serializingStructIterator(ns, value)) {
					if (value[memberName] == null && !member.isIdempotencyToken()) continue;
					const suffix = this.getKey(memberName, member.getMergedTraits().xmlName);
					const key = `${prefix}${suffix}`;
					this.write(member, value[memberName], key);
				}
			} else if (ns.isUnitSchema()) {} else throw new Error(`@aws-sdk/core/protocols - QuerySerializer unrecognized schema type ${ns.getName(true)}`);
		}
		flush() {
			if (this.buffer === void 0) throw new Error("@aws-sdk/core/protocols - QuerySerializer cannot flush with nothing written to buffer.");
			const str = this.buffer;
			delete this.buffer;
			return str;
		}
		getKey(memberName, xmlName) {
			const key = xmlName ?? memberName;
			if (this.settings.capitalizeKeys) return key[0].toUpperCase() + key.slice(1);
			return key;
		}
		writeKey(key) {
			if (key.endsWith(".")) key = key.slice(0, key.length - 1);
			this.buffer += `&${require_dist_cjs$38.extendedEncodeURIComponent(key)}=`;
		}
		writeValue(value) {
			this.buffer += require_dist_cjs$38.extendedEncodeURIComponent(value);
		}
	};
}));

//#endregion
//#region ../node_modules/.pnpm/@aws-sdk+core@3.940.0/node_modules/@aws-sdk/core/dist-es/submodules/protocols/query/AwsQueryProtocol.js
var AwsQueryProtocol;
var init_AwsQueryProtocol = require_chunk.__esmMin((() => {
	require_dist_cjs$38.init_protocols();
	require_dist_cjs$38.init_schema();
	init_ProtocolLib();
	init_XmlShapeDeserializer();
	init_QueryShapeSerializer();
	AwsQueryProtocol = class extends require_dist_cjs$38.RpcProtocol {
		options;
		serializer;
		deserializer;
		mixin = new ProtocolLib();
		constructor(options) {
			super({ defaultNamespace: options.defaultNamespace });
			this.options = options;
			const settings = {
				timestampFormat: {
					useTrait: true,
					default: 5
				},
				httpBindings: false,
				xmlNamespace: options.xmlNamespace,
				serviceNamespace: options.defaultNamespace,
				serializeEmptyLists: true
			};
			this.serializer = new QueryShapeSerializer(settings);
			this.deserializer = new XmlShapeDeserializer(settings);
		}
		getShapeId() {
			return "aws.protocols#awsQuery";
		}
		setSerdeContext(serdeContext) {
			this.serializer.setSerdeContext(serdeContext);
			this.deserializer.setSerdeContext(serdeContext);
		}
		getPayloadCodec() {
			throw new Error("AWSQuery protocol has no payload codec.");
		}
		async serializeRequest(operationSchema, input, context) {
			const request = await super.serializeRequest(operationSchema, input, context);
			if (!request.path.endsWith("/")) request.path += "/";
			Object.assign(request.headers, { "content-type": `application/x-www-form-urlencoded` });
			if (require_dist_cjs$38.deref(operationSchema.input) === "unit" || !request.body) request.body = "";
			request.body = `Action=${operationSchema.name.split("#")[1] ?? operationSchema.name}&Version=${this.options.version}` + request.body;
			if (request.body.endsWith("&")) request.body = request.body.slice(-1);
			return request;
		}
		async deserializeResponse(operationSchema, context, response) {
			const deserializer = this.deserializer;
			const ns = require_dist_cjs$38.NormalizedSchema.of(operationSchema.output);
			const dataObject = {};
			if (response.statusCode >= 300) {
				const bytes$1 = await require_dist_cjs$38.collectBody(response.body, context);
				if (bytes$1.byteLength > 0) Object.assign(dataObject, await deserializer.read(15, bytes$1));
				await this.handleError(operationSchema, context, response, dataObject, this.deserializeMetadata(response));
			}
			for (const header in response.headers) {
				const value = response.headers[header];
				delete response.headers[header];
				response.headers[header.toLowerCase()] = value;
			}
			const shortName = operationSchema.name.split("#")[1] ?? operationSchema.name;
			const awsQueryResultKey = ns.isStructSchema() && this.useNestedResult() ? shortName + "Result" : void 0;
			const bytes = await require_dist_cjs$38.collectBody(response.body, context);
			if (bytes.byteLength > 0) Object.assign(dataObject, await deserializer.read(ns, bytes, awsQueryResultKey));
			return {
				$metadata: this.deserializeMetadata(response),
				...dataObject
			};
		}
		useNestedResult() {
			return true;
		}
		async handleError(operationSchema, context, response, dataObject, metadata) {
			const errorIdentifier = this.loadQueryErrorCode(response, dataObject) ?? "Unknown";
			const errorData = this.loadQueryError(dataObject);
			const message = this.loadQueryErrorMessage(dataObject);
			errorData.message = message;
			errorData.Error = {
				Type: errorData.Type,
				Code: errorData.Code,
				Message: message
			};
			const { errorSchema, errorMetadata } = await this.mixin.getErrorSchemaOrThrowBaseException(errorIdentifier, this.options.defaultNamespace, response, errorData, metadata, (registry, errorName) => {
				try {
					return registry.getSchema(errorName);
				} catch (e) {
					return registry.find((schema) => require_dist_cjs$38.NormalizedSchema.of(schema).getMergedTraits().awsQueryError?.[0] === errorName);
				}
			});
			const ns = require_dist_cjs$38.NormalizedSchema.of(errorSchema);
			const exception = new ((require_dist_cjs$38.TypeRegistry.for(errorSchema[1]).getErrorCtor(errorSchema)) ?? Error)(message);
			const output = { Error: errorData.Error };
			for (const [name, member] of ns.structIterator()) {
				const target = member.getMergedTraits().xmlName ?? name;
				const value = errorData[target] ?? dataObject[target];
				output[name] = this.deserializer.readSchema(member, value);
			}
			throw this.mixin.decorateServiceException(Object.assign(exception, errorMetadata, {
				$fault: ns.getMergedTraits().error,
				message
			}, output), dataObject);
		}
		loadQueryErrorCode(output, data$1) {
			const code = (data$1.Errors?.[0]?.Error ?? data$1.Errors?.Error ?? data$1.Error)?.Code;
			if (code !== void 0) return code;
			if (output.statusCode == 404) return "NotFound";
		}
		loadQueryError(data$1) {
			return data$1.Errors?.[0]?.Error ?? data$1.Errors?.Error ?? data$1.Error;
		}
		loadQueryErrorMessage(data$1) {
			const errorData = this.loadQueryError(data$1);
			return errorData?.message ?? errorData?.Message ?? data$1.message ?? data$1.Message ?? "Unknown";
		}
		getDefaultContentType() {
			return "application/x-www-form-urlencoded";
		}
	};
}));

//#endregion
//#region ../node_modules/.pnpm/@aws-sdk+core@3.940.0/node_modules/@aws-sdk/core/dist-es/submodules/protocols/query/AwsEc2QueryProtocol.js
var AwsEc2QueryProtocol;
var init_AwsEc2QueryProtocol = require_chunk.__esmMin((() => {
	init_AwsQueryProtocol();
	AwsEc2QueryProtocol = class extends AwsQueryProtocol {
		options;
		constructor(options) {
			super(options);
			this.options = options;
			Object.assign(this.serializer.settings, {
				capitalizeKeys: true,
				flattenLists: true,
				serializeEmptyLists: false
			});
		}
		useNestedResult() {
			return false;
		}
	};
}));

//#endregion
//#region ../node_modules/.pnpm/@aws-sdk+core@3.940.0/node_modules/@aws-sdk/core/dist-es/submodules/protocols/xml/parseXmlBody.js
var import_dist_cjs$3, import_dist_cjs$4, parseXmlBody, parseXmlErrorBody, loadRestXmlErrorCode;
var init_parseXmlBody = require_chunk.__esmMin((() => {
	import_dist_cjs$3 = require_dist_cjs$13();
	import_dist_cjs$4 = require_dist_cjs$38.require_dist_cjs();
	init_common();
	parseXmlBody = (streamBody, context) => collectBodyString(streamBody, context).then((encoded) => {
		if (encoded.length) {
			let parsedObj;
			try {
				parsedObj = (0, import_dist_cjs$3.parseXML)(encoded);
			} catch (e) {
				if (e && typeof e === "object") Object.defineProperty(e, "$responseBodyText", { value: encoded });
				throw e;
			}
			const textNodeName = "#text";
			const key = Object.keys(parsedObj)[0];
			const parsedObjToReturn = parsedObj[key];
			if (parsedObjToReturn[textNodeName]) {
				parsedObjToReturn[key] = parsedObjToReturn[textNodeName];
				delete parsedObjToReturn[textNodeName];
			}
			return (0, import_dist_cjs$4.getValueFromTextNode)(parsedObjToReturn);
		}
		return {};
	});
	parseXmlErrorBody = async (errorBody, context) => {
		const value = await parseXmlBody(errorBody, context);
		if (value.Error) value.Error.message = value.Error.message ?? value.Error.Message;
		return value;
	};
	loadRestXmlErrorCode = (output, data$1) => {
		if (data$1?.Error?.Code !== void 0) return data$1.Error.Code;
		if (data$1?.Code !== void 0) return data$1.Code;
		if (output.statusCode == 404) return "NotFound";
	};
}));

//#endregion
//#region ../node_modules/.pnpm/@aws-sdk+core@3.940.0/node_modules/@aws-sdk/core/dist-es/submodules/protocols/xml/XmlShapeSerializer.js
var import_dist_cjs, import_dist_cjs$1, import_dist_cjs$2, XmlShapeSerializer;
var init_XmlShapeSerializer = require_chunk.__esmMin((() => {
	import_dist_cjs = require_dist_cjs$13();
	require_dist_cjs$38.init_protocols();
	require_dist_cjs$38.init_schema();
	require_dist_cjs$38.init_serde();
	import_dist_cjs$1 = require_dist_cjs$38.require_dist_cjs();
	import_dist_cjs$2 = require_dist_cjs$38.require_dist_cjs$6();
	init_ConfigurableSerdeContext();
	init_structIterator();
	XmlShapeSerializer = class extends SerdeContextConfig {
		settings;
		stringBuffer;
		byteBuffer;
		buffer;
		constructor(settings) {
			super();
			this.settings = settings;
		}
		write(schema, value) {
			const ns = require_dist_cjs$38.NormalizedSchema.of(schema);
			if (ns.isStringSchema() && typeof value === "string") this.stringBuffer = value;
			else if (ns.isBlobSchema()) this.byteBuffer = "byteLength" in value ? value : (this.serdeContext?.base64Decoder ?? import_dist_cjs$2.fromBase64)(value);
			else {
				this.buffer = this.writeStruct(ns, value, void 0);
				const traits = ns.getMergedTraits();
				if (traits.httpPayload && !traits.xmlName) this.buffer.withName(ns.getName());
			}
		}
		flush() {
			if (this.byteBuffer !== void 0) {
				const bytes = this.byteBuffer;
				delete this.byteBuffer;
				return bytes;
			}
			if (this.stringBuffer !== void 0) {
				const str = this.stringBuffer;
				delete this.stringBuffer;
				return str;
			}
			const buffer$1 = this.buffer;
			if (this.settings.xmlNamespace) {
				if (!buffer$1?.attributes?.["xmlns"]) buffer$1.addAttribute("xmlns", this.settings.xmlNamespace);
			}
			delete this.buffer;
			return buffer$1.toString();
		}
		writeStruct(ns, value, parentXmlns) {
			const traits = ns.getMergedTraits();
			const name = ns.isMemberSchema() && !traits.httpPayload ? ns.getMemberTraits().xmlName ?? ns.getMemberName() : traits.xmlName ?? ns.getName();
			if (!name || !ns.isStructSchema()) throw new Error(`@aws-sdk/core/protocols - xml serializer, cannot write struct with empty name or non-struct, schema=${ns.getName(true)}.`);
			const structXmlNode = import_dist_cjs.XmlNode.of(name);
			const [xmlnsAttr, xmlns] = this.getXmlnsAttribute(ns, parentXmlns);
			for (const [memberName, memberSchema] of serializingStructIterator(ns, value)) {
				const val = value[memberName];
				if (val != null || memberSchema.isIdempotencyToken()) {
					if (memberSchema.getMergedTraits().xmlAttribute) {
						structXmlNode.addAttribute(memberSchema.getMergedTraits().xmlName ?? memberName, this.writeSimple(memberSchema, val));
						continue;
					}
					if (memberSchema.isListSchema()) this.writeList(memberSchema, val, structXmlNode, xmlns);
					else if (memberSchema.isMapSchema()) this.writeMap(memberSchema, val, structXmlNode, xmlns);
					else if (memberSchema.isStructSchema()) structXmlNode.addChildNode(this.writeStruct(memberSchema, val, xmlns));
					else {
						const memberNode = import_dist_cjs.XmlNode.of(memberSchema.getMergedTraits().xmlName ?? memberSchema.getMemberName());
						this.writeSimpleInto(memberSchema, val, memberNode, xmlns);
						structXmlNode.addChildNode(memberNode);
					}
				}
			}
			if (xmlns) structXmlNode.addAttribute(xmlnsAttr, xmlns);
			return structXmlNode;
		}
		writeList(listMember, array, container, parentXmlns) {
			if (!listMember.isMemberSchema()) throw new Error(`@aws-sdk/core/protocols - xml serializer, cannot write non-member list: ${listMember.getName(true)}`);
			const listTraits = listMember.getMergedTraits();
			const listValueSchema = listMember.getValueSchema();
			const listValueTraits = listValueSchema.getMergedTraits();
			const sparse = !!listValueTraits.sparse;
			const flat = !!listTraits.xmlFlattened;
			const [xmlnsAttr, xmlns] = this.getXmlnsAttribute(listMember, parentXmlns);
			const writeItem = (container$1, value) => {
				if (listValueSchema.isListSchema()) this.writeList(listValueSchema, Array.isArray(value) ? value : [value], container$1, xmlns);
				else if (listValueSchema.isMapSchema()) this.writeMap(listValueSchema, value, container$1, xmlns);
				else if (listValueSchema.isStructSchema()) {
					const struct = this.writeStruct(listValueSchema, value, xmlns);
					container$1.addChildNode(struct.withName(flat ? listTraits.xmlName ?? listMember.getMemberName() : listValueTraits.xmlName ?? "member"));
				} else {
					const listItemNode = import_dist_cjs.XmlNode.of(flat ? listTraits.xmlName ?? listMember.getMemberName() : listValueTraits.xmlName ?? "member");
					this.writeSimpleInto(listValueSchema, value, listItemNode, xmlns);
					container$1.addChildNode(listItemNode);
				}
			};
			if (flat) {
				for (const value of array) if (sparse || value != null) writeItem(container, value);
			} else {
				const listNode = import_dist_cjs.XmlNode.of(listTraits.xmlName ?? listMember.getMemberName());
				if (xmlns) listNode.addAttribute(xmlnsAttr, xmlns);
				for (const value of array) if (sparse || value != null) writeItem(listNode, value);
				container.addChildNode(listNode);
			}
		}
		writeMap(mapMember, map, container, parentXmlns, containerIsMap = false) {
			if (!mapMember.isMemberSchema()) throw new Error(`@aws-sdk/core/protocols - xml serializer, cannot write non-member map: ${mapMember.getName(true)}`);
			const mapTraits = mapMember.getMergedTraits();
			const mapKeySchema = mapMember.getKeySchema();
			const keyTag = mapKeySchema.getMergedTraits().xmlName ?? "key";
			const mapValueSchema = mapMember.getValueSchema();
			const mapValueTraits = mapValueSchema.getMergedTraits();
			const valueTag = mapValueTraits.xmlName ?? "value";
			const sparse = !!mapValueTraits.sparse;
			const flat = !!mapTraits.xmlFlattened;
			const [xmlnsAttr, xmlns] = this.getXmlnsAttribute(mapMember, parentXmlns);
			const addKeyValue = (entry, key, val) => {
				const keyNode = import_dist_cjs.XmlNode.of(keyTag, key);
				const [keyXmlnsAttr, keyXmlns] = this.getXmlnsAttribute(mapKeySchema, xmlns);
				if (keyXmlns) keyNode.addAttribute(keyXmlnsAttr, keyXmlns);
				entry.addChildNode(keyNode);
				let valueNode = import_dist_cjs.XmlNode.of(valueTag);
				if (mapValueSchema.isListSchema()) this.writeList(mapValueSchema, val, valueNode, xmlns);
				else if (mapValueSchema.isMapSchema()) this.writeMap(mapValueSchema, val, valueNode, xmlns, true);
				else if (mapValueSchema.isStructSchema()) valueNode = this.writeStruct(mapValueSchema, val, xmlns);
				else this.writeSimpleInto(mapValueSchema, val, valueNode, xmlns);
				entry.addChildNode(valueNode);
			};
			if (flat) {
				for (const [key, val] of Object.entries(map)) if (sparse || val != null) {
					const entry = import_dist_cjs.XmlNode.of(mapTraits.xmlName ?? mapMember.getMemberName());
					addKeyValue(entry, key, val);
					container.addChildNode(entry);
				}
			} else {
				let mapNode;
				if (!containerIsMap) {
					mapNode = import_dist_cjs.XmlNode.of(mapTraits.xmlName ?? mapMember.getMemberName());
					if (xmlns) mapNode.addAttribute(xmlnsAttr, xmlns);
					container.addChildNode(mapNode);
				}
				for (const [key, val] of Object.entries(map)) if (sparse || val != null) {
					const entry = import_dist_cjs.XmlNode.of("entry");
					addKeyValue(entry, key, val);
					(containerIsMap ? container : mapNode).addChildNode(entry);
				}
			}
		}
		writeSimple(_schema, value) {
			if (null === value) throw new Error("@aws-sdk/core/protocols - (XML serializer) cannot write null value.");
			const ns = require_dist_cjs$38.NormalizedSchema.of(_schema);
			let nodeContents = null;
			if (value && typeof value === "object") if (ns.isBlobSchema()) nodeContents = (this.serdeContext?.base64Encoder ?? import_dist_cjs$2.toBase64)(value);
			else if (ns.isTimestampSchema() && value instanceof Date) switch (require_dist_cjs$38.determineTimestampFormat(ns, this.settings)) {
				case 5:
					nodeContents = value.toISOString().replace(".000Z", "Z");
					break;
				case 6:
					nodeContents = (0, import_dist_cjs$1.dateToUtcString)(value);
					break;
				case 7:
					nodeContents = String(value.getTime() / 1e3);
					break;
				default:
					console.warn("Missing timestamp format, using http date", value);
					nodeContents = (0, import_dist_cjs$1.dateToUtcString)(value);
					break;
			}
			else if (ns.isBigDecimalSchema() && value) {
				if (value instanceof require_dist_cjs$38.NumericValue) return value.string;
				return String(value);
			} else if (ns.isMapSchema() || ns.isListSchema()) throw new Error("@aws-sdk/core/protocols - xml serializer, cannot call _write() on List/Map schema, call writeList or writeMap() instead.");
			else throw new Error(`@aws-sdk/core/protocols - xml serializer, unhandled schema type for object value and schema: ${ns.getName(true)}`);
			if (ns.isBooleanSchema() || ns.isNumericSchema() || ns.isBigIntegerSchema() || ns.isBigDecimalSchema()) nodeContents = String(value);
			if (ns.isStringSchema()) if (value === void 0 && ns.isIdempotencyToken()) nodeContents = (0, require_dist_cjs$38.import_dist_cjs.v4)();
			else nodeContents = String(value);
			if (nodeContents === null) throw new Error(`Unhandled schema-value pair ${ns.getName(true)}=${value}`);
			return nodeContents;
		}
		writeSimpleInto(_schema, value, into, parentXmlns) {
			const nodeContents = this.writeSimple(_schema, value);
			const ns = require_dist_cjs$38.NormalizedSchema.of(_schema);
			const content = new import_dist_cjs.XmlText(nodeContents);
			const [xmlnsAttr, xmlns] = this.getXmlnsAttribute(ns, parentXmlns);
			if (xmlns) into.addAttribute(xmlnsAttr, xmlns);
			into.addChildNode(content);
		}
		getXmlnsAttribute(ns, parentXmlns) {
			const [prefix, xmlns] = ns.getMergedTraits().xmlNamespace ?? [];
			if (xmlns && xmlns !== parentXmlns) return [prefix ? `xmlns:${prefix}` : "xmlns", xmlns];
			return [void 0, void 0];
		}
	};
}));

//#endregion
//#region ../node_modules/.pnpm/@aws-sdk+core@3.940.0/node_modules/@aws-sdk/core/dist-es/submodules/protocols/xml/XmlCodec.js
var XmlCodec;
var init_XmlCodec = require_chunk.__esmMin((() => {
	init_ConfigurableSerdeContext();
	init_XmlShapeDeserializer();
	init_XmlShapeSerializer();
	XmlCodec = class extends SerdeContextConfig {
		settings;
		constructor(settings) {
			super();
			this.settings = settings;
		}
		createSerializer() {
			const serializer = new XmlShapeSerializer(this.settings);
			serializer.setSerdeContext(this.serdeContext);
			return serializer;
		}
		createDeserializer() {
			const deserializer = new XmlShapeDeserializer(this.settings);
			deserializer.setSerdeContext(this.serdeContext);
			return deserializer;
		}
	};
}));

//#endregion
//#region ../node_modules/.pnpm/@aws-sdk+core@3.940.0/node_modules/@aws-sdk/core/dist-es/submodules/protocols/xml/AwsRestXmlProtocol.js
var AwsRestXmlProtocol;
var init_AwsRestXmlProtocol = require_chunk.__esmMin((() => {
	require_dist_cjs$38.init_protocols();
	require_dist_cjs$38.init_schema();
	init_ProtocolLib();
	init_parseXmlBody();
	init_XmlCodec();
	AwsRestXmlProtocol = class extends require_dist_cjs$38.HttpBindingProtocol {
		codec;
		serializer;
		deserializer;
		mixin = new ProtocolLib();
		constructor(options) {
			super(options);
			const settings = {
				timestampFormat: {
					useTrait: true,
					default: 5
				},
				httpBindings: true,
				xmlNamespace: options.xmlNamespace,
				serviceNamespace: options.defaultNamespace
			};
			this.codec = new XmlCodec(settings);
			this.serializer = new require_dist_cjs$38.HttpInterceptingShapeSerializer(this.codec.createSerializer(), settings);
			this.deserializer = new require_dist_cjs$38.HttpInterceptingShapeDeserializer(this.codec.createDeserializer(), settings);
		}
		getPayloadCodec() {
			return this.codec;
		}
		getShapeId() {
			return "aws.protocols#restXml";
		}
		async serializeRequest(operationSchema, input, context) {
			const request = await super.serializeRequest(operationSchema, input, context);
			const inputSchema = require_dist_cjs$38.NormalizedSchema.of(operationSchema.input);
			if (!request.headers["content-type"]) {
				const contentType = this.mixin.resolveRestContentType(this.getDefaultContentType(), inputSchema);
				if (contentType) request.headers["content-type"] = contentType;
			}
			if (request.headers["content-type"] === this.getDefaultContentType()) {
				if (typeof request.body === "string") request.body = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" + request.body;
			}
			return request;
		}
		async deserializeResponse(operationSchema, context, response) {
			return super.deserializeResponse(operationSchema, context, response);
		}
		async handleError(operationSchema, context, response, dataObject, metadata) {
			const errorIdentifier = loadRestXmlErrorCode(response, dataObject) ?? "Unknown";
			const { errorSchema, errorMetadata } = await this.mixin.getErrorSchemaOrThrowBaseException(errorIdentifier, this.options.defaultNamespace, response, dataObject, metadata);
			const ns = require_dist_cjs$38.NormalizedSchema.of(errorSchema);
			const message = dataObject.Error?.message ?? dataObject.Error?.Message ?? dataObject.message ?? dataObject.Message ?? "Unknown";
			const exception = new ((require_dist_cjs$38.TypeRegistry.for(errorSchema[1]).getErrorCtor(errorSchema)) ?? Error)(message);
			await this.deserializeHttpMessage(errorSchema, context, response, dataObject);
			const output = {};
			for (const [name, member] of ns.structIterator()) {
				const target = member.getMergedTraits().xmlName ?? name;
				const value = dataObject.Error?.[target] ?? dataObject[target];
				output[name] = this.codec.createDeserializer().readSchema(member, value);
			}
			throw this.mixin.decorateServiceException(Object.assign(exception, errorMetadata, {
				$fault: ns.getMergedTraits().error,
				message
			}, output), dataObject);
		}
		getDefaultContentType() {
			return "application/xml";
		}
	};
}));

//#endregion
//#region ../node_modules/.pnpm/@aws-sdk+core@3.940.0/node_modules/@aws-sdk/core/dist-es/submodules/protocols/index.js
var protocols_exports = /* @__PURE__ */ require_chunk.__exportAll({
	AwsEc2QueryProtocol: () => AwsEc2QueryProtocol,
	AwsJson1_0Protocol: () => AwsJson1_0Protocol,
	AwsJson1_1Protocol: () => AwsJson1_1Protocol,
	AwsJsonRpcProtocol: () => AwsJsonRpcProtocol,
	AwsQueryProtocol: () => AwsQueryProtocol,
	AwsRestJsonProtocol: () => AwsRestJsonProtocol,
	AwsRestXmlProtocol: () => AwsRestXmlProtocol,
	AwsSmithyRpcV2CborProtocol: () => AwsSmithyRpcV2CborProtocol,
	JsonCodec: () => JsonCodec,
	JsonShapeDeserializer: () => JsonShapeDeserializer,
	JsonShapeSerializer: () => JsonShapeSerializer,
	XmlCodec: () => XmlCodec,
	XmlShapeDeserializer: () => XmlShapeDeserializer,
	XmlShapeSerializer: () => XmlShapeSerializer,
	_toBool: () => _toBool,
	_toNum: () => _toNum,
	_toStr: () => _toStr,
	awsExpectUnion: () => awsExpectUnion,
	loadRestJsonErrorCode: () => loadRestJsonErrorCode,
	loadRestXmlErrorCode: () => loadRestXmlErrorCode,
	parseJsonBody: () => parseJsonBody,
	parseJsonErrorBody: () => parseJsonErrorBody,
	parseXmlBody: () => parseXmlBody,
	parseXmlErrorBody: () => parseXmlErrorBody
});
var init_protocols = require_chunk.__esmMin((() => {
	init_AwsSmithyRpcV2CborProtocol();
	init_coercing_serializers();
	init_AwsJson1_0Protocol();
	init_AwsJson1_1Protocol();
	init_AwsJsonRpcProtocol();
	init_AwsRestJsonProtocol();
	init_JsonCodec();
	init_JsonShapeDeserializer();
	init_JsonShapeSerializer();
	init_awsExpectUnion();
	init_parseJsonBody();
	init_AwsEc2QueryProtocol();
	init_AwsQueryProtocol();
	init_AwsRestXmlProtocol();
	init_XmlCodec();
	init_XmlShapeDeserializer();
	init_XmlShapeSerializer();
	init_parseXmlBody();
}));

//#endregion
//#region ../node_modules/.pnpm/@aws-sdk+core@3.940.0/node_modules/@aws-sdk/core/dist-es/index.js
var dist_es_exports = /* @__PURE__ */ require_chunk.__exportAll({
	AWSSDKSigV4Signer: () => AWSSDKSigV4Signer,
	AwsEc2QueryProtocol: () => AwsEc2QueryProtocol,
	AwsJson1_0Protocol: () => AwsJson1_0Protocol,
	AwsJson1_1Protocol: () => AwsJson1_1Protocol,
	AwsJsonRpcProtocol: () => AwsJsonRpcProtocol,
	AwsQueryProtocol: () => AwsQueryProtocol,
	AwsRestJsonProtocol: () => AwsRestJsonProtocol,
	AwsRestXmlProtocol: () => AwsRestXmlProtocol,
	AwsSdkSigV4ASigner: () => AwsSdkSigV4ASigner,
	AwsSdkSigV4Signer: () => AwsSdkSigV4Signer,
	AwsSmithyRpcV2CborProtocol: () => AwsSmithyRpcV2CborProtocol,
	JsonCodec: () => JsonCodec,
	JsonShapeDeserializer: () => JsonShapeDeserializer,
	JsonShapeSerializer: () => JsonShapeSerializer,
	NODE_AUTH_SCHEME_PREFERENCE_OPTIONS: () => NODE_AUTH_SCHEME_PREFERENCE_OPTIONS,
	NODE_SIGV4A_CONFIG_OPTIONS: () => NODE_SIGV4A_CONFIG_OPTIONS,
	XmlCodec: () => XmlCodec,
	XmlShapeDeserializer: () => XmlShapeDeserializer,
	XmlShapeSerializer: () => XmlShapeSerializer,
	_toBool: () => _toBool,
	_toNum: () => _toNum,
	_toStr: () => _toStr,
	awsExpectUnion: () => awsExpectUnion,
	emitWarningIfUnsupportedVersion: () => require_client.emitWarningIfUnsupportedVersion,
	getBearerTokenEnvKey: () => getBearerTokenEnvKey,
	loadRestJsonErrorCode: () => loadRestJsonErrorCode,
	loadRestXmlErrorCode: () => loadRestXmlErrorCode,
	parseJsonBody: () => parseJsonBody,
	parseJsonErrorBody: () => parseJsonErrorBody,
	parseXmlBody: () => parseXmlBody,
	parseXmlErrorBody: () => parseXmlErrorBody,
	resolveAWSSDKSigV4Config: () => resolveAWSSDKSigV4Config,
	resolveAwsSdkSigV4AConfig: () => resolveAwsSdkSigV4AConfig,
	resolveAwsSdkSigV4Config: () => resolveAwsSdkSigV4Config,
	setCredentialFeature: () => require_client.setCredentialFeature,
	setFeature: () => require_client.setFeature,
	setTokenFeature: () => require_client.setTokenFeature,
	state: () => require_client.state,
	validateSigningProperties: () => validateSigningProperties
});
var init_dist_es = require_chunk.__esmMin((() => {
	init_client();
	init_httpAuthSchemes();
	init_protocols();
}));

//#endregion
//#region ../node_modules/.pnpm/@aws-sdk+middleware-user-agent@3.940.0/node_modules/@aws-sdk/middleware-user-agent/dist-cjs/index.js
var require_dist_cjs$12 = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	var core = (init_dist_es$1(), require_chunk.__toCommonJS(dist_es_exports$1));
	var utilEndpoints = require_dist_cjs$15();
	var protocolHttp = require_dist_cjs$37.require_dist_cjs();
	var core$1 = (init_dist_es(), require_chunk.__toCommonJS(dist_es_exports));
	const DEFAULT_UA_APP_ID = void 0;
	function isValidUserAgentAppId(appId) {
		if (appId === void 0) return true;
		return typeof appId === "string" && appId.length <= 50;
	}
	function resolveUserAgentConfig(input) {
		const normalizedAppIdProvider = core.normalizeProvider(input.userAgentAppId ?? DEFAULT_UA_APP_ID);
		const { customUserAgent } = input;
		return Object.assign(input, {
			customUserAgent: typeof customUserAgent === "string" ? [[customUserAgent]] : customUserAgent,
			userAgentAppId: async () => {
				const appId = await normalizedAppIdProvider();
				if (!isValidUserAgentAppId(appId)) {
					const logger = input.logger?.constructor?.name === "NoOpLogger" || !input.logger ? console : input.logger;
					if (typeof appId !== "string") logger?.warn("userAgentAppId must be a string or undefined.");
					else if (appId.length > 50) logger?.warn("The provided userAgentAppId exceeds the maximum length of 50 characters.");
				}
				return appId;
			}
		});
	}
	const ACCOUNT_ID_ENDPOINT_REGEX = /\d{12}\.ddb/;
	async function checkFeatures(context, config, args) {
		if (args.request?.headers?.["smithy-protocol"] === "rpc-v2-cbor") core$1.setFeature(context, "PROTOCOL_RPC_V2_CBOR", "M");
		if (typeof config.retryStrategy === "function") {
			const retryStrategy = await config.retryStrategy();
			if (typeof retryStrategy.acquireInitialRetryToken === "function") if (retryStrategy.constructor?.name?.includes("Adaptive")) core$1.setFeature(context, "RETRY_MODE_ADAPTIVE", "F");
			else core$1.setFeature(context, "RETRY_MODE_STANDARD", "E");
			else core$1.setFeature(context, "RETRY_MODE_LEGACY", "D");
		}
		if (typeof config.accountIdEndpointMode === "function") {
			const endpointV2 = context.endpointV2;
			if (String(endpointV2?.url?.hostname).match(ACCOUNT_ID_ENDPOINT_REGEX)) core$1.setFeature(context, "ACCOUNT_ID_ENDPOINT", "O");
			switch (await config.accountIdEndpointMode?.()) {
				case "disabled":
					core$1.setFeature(context, "ACCOUNT_ID_MODE_DISABLED", "Q");
					break;
				case "preferred":
					core$1.setFeature(context, "ACCOUNT_ID_MODE_PREFERRED", "P");
					break;
				case "required":
					core$1.setFeature(context, "ACCOUNT_ID_MODE_REQUIRED", "R");
					break;
			}
		}
		const identity = context.__smithy_context?.selectedHttpAuthScheme?.identity;
		if (identity?.$source) {
			const credentials = identity;
			if (credentials.accountId) core$1.setFeature(context, "RESOLVED_ACCOUNT_ID", "T");
			for (const [key, value] of Object.entries(credentials.$source ?? {})) core$1.setFeature(context, key, value);
		}
	}
	const USER_AGENT = "user-agent";
	const X_AMZ_USER_AGENT = "x-amz-user-agent";
	const SPACE = " ";
	const UA_NAME_SEPARATOR = "/";
	const UA_NAME_ESCAPE_REGEX = /[^!$%&'*+\-.^_`|~\w]/g;
	const UA_VALUE_ESCAPE_REGEX = /[^!$%&'*+\-.^_`|~\w#]/g;
	const UA_ESCAPE_CHAR = "-";
	const BYTE_LIMIT = 1024;
	function encodeFeatures(features) {
		let buffer$1 = "";
		for (const key in features) {
			const val = features[key];
			if (buffer$1.length + val.length + 1 <= BYTE_LIMIT) {
				if (buffer$1.length) buffer$1 += "," + val;
				else buffer$1 += val;
				continue;
			}
			break;
		}
		return buffer$1;
	}
	const userAgentMiddleware = (options) => (next, context) => async (args) => {
		const { request } = args;
		if (!protocolHttp.HttpRequest.isInstance(request)) return next(args);
		const { headers } = request;
		const userAgent = context?.userAgent?.map(escapeUserAgent) || [];
		const defaultUserAgent = (await options.defaultUserAgentProvider()).map(escapeUserAgent);
		await checkFeatures(context, options, args);
		const awsContext = context;
		defaultUserAgent.push(`m/${encodeFeatures(Object.assign({}, context.__smithy_context?.features, awsContext.__aws_sdk_context?.features))}`);
		const customUserAgent = options?.customUserAgent?.map(escapeUserAgent) || [];
		const appId = await options.userAgentAppId();
		if (appId) defaultUserAgent.push(escapeUserAgent([`app`, `${appId}`]));
		const prefix = utilEndpoints.getUserAgentPrefix();
		const sdkUserAgentValue = (prefix ? [prefix] : []).concat([
			...defaultUserAgent,
			...userAgent,
			...customUserAgent
		]).join(SPACE);
		const normalUAValue = [...defaultUserAgent.filter((section) => section.startsWith("aws-sdk-")), ...customUserAgent].join(SPACE);
		if (options.runtime !== "browser") {
			if (normalUAValue) headers[X_AMZ_USER_AGENT] = headers[X_AMZ_USER_AGENT] ? `${headers[USER_AGENT]} ${normalUAValue}` : normalUAValue;
			headers[USER_AGENT] = sdkUserAgentValue;
		} else headers[X_AMZ_USER_AGENT] = sdkUserAgentValue;
		return next({
			...args,
			request
		});
	};
	const escapeUserAgent = (userAgentPair) => {
		const name = userAgentPair[0].split(UA_NAME_SEPARATOR).map((part) => part.replace(UA_NAME_ESCAPE_REGEX, UA_ESCAPE_CHAR)).join(UA_NAME_SEPARATOR);
		const version = userAgentPair[1]?.replace(UA_VALUE_ESCAPE_REGEX, UA_ESCAPE_CHAR);
		const prefixSeparatorIndex = name.indexOf(UA_NAME_SEPARATOR);
		const prefix = name.substring(0, prefixSeparatorIndex);
		let uaName = name.substring(prefixSeparatorIndex + 1);
		if (prefix === "api") uaName = uaName.toLowerCase();
		return [
			prefix,
			uaName,
			version
		].filter((item) => item && item.length > 0).reduce((acc, item, index) => {
			switch (index) {
				case 0: return item;
				case 1: return `${acc}/${item}`;
				default: return `${acc}#${item}`;
			}
		}, "");
	};
	const getUserAgentMiddlewareOptions = {
		name: "getUserAgentMiddleware",
		step: "build",
		priority: "low",
		tags: ["SET_USER_AGENT", "USER_AGENT"],
		override: true
	};
	const getUserAgentPlugin = (config) => ({ applyToStack: (clientStack) => {
		clientStack.add(userAgentMiddleware(config), getUserAgentMiddlewareOptions);
	} });
	exports.DEFAULT_UA_APP_ID = DEFAULT_UA_APP_ID;
	exports.getUserAgentMiddlewareOptions = getUserAgentMiddlewareOptions;
	exports.getUserAgentPlugin = getUserAgentPlugin;
	exports.resolveUserAgentConfig = resolveUserAgentConfig;
	exports.userAgentMiddleware = userAgentMiddleware;
}));

//#endregion
//#region ../node_modules/.pnpm/@smithy+util-config-provider@4.2.0/node_modules/@smithy/util-config-provider/dist-cjs/index.js
var require_dist_cjs$11 = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	const booleanSelector = (obj, key, type) => {
		if (!(key in obj)) return void 0;
		if (obj[key] === "true") return true;
		if (obj[key] === "false") return false;
		throw new Error(`Cannot load ${type} "${key}". Expected "true" or "false", got ${obj[key]}.`);
	};
	const numberSelector = (obj, key, type) => {
		if (!(key in obj)) return void 0;
		const numberValue = parseInt(obj[key], 10);
		if (Number.isNaN(numberValue)) throw new TypeError(`Cannot load ${type} '${key}'. Expected number, got '${obj[key]}'.`);
		return numberValue;
	};
	exports.SelectorType = void 0;
	(function(SelectorType) {
		SelectorType["ENV"] = "env";
		SelectorType["CONFIG"] = "shared config entry";
	})(exports.SelectorType || (exports.SelectorType = {}));
	exports.booleanSelector = booleanSelector;
	exports.numberSelector = numberSelector;
}));

//#endregion
//#region ../node_modules/.pnpm/@smithy+config-resolver@4.4.3/node_modules/@smithy/config-resolver/dist-cjs/index.js
var require_dist_cjs$10 = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	var utilConfigProvider = require_dist_cjs$11();
	var utilMiddleware = require_dist_cjs$38.require_dist_cjs$7();
	var utilEndpoints = require_dist_cjs$16();
	const ENV_USE_DUALSTACK_ENDPOINT = "AWS_USE_DUALSTACK_ENDPOINT";
	const CONFIG_USE_DUALSTACK_ENDPOINT = "use_dualstack_endpoint";
	const DEFAULT_USE_DUALSTACK_ENDPOINT = false;
	const NODE_USE_DUALSTACK_ENDPOINT_CONFIG_OPTIONS = {
		environmentVariableSelector: (env) => utilConfigProvider.booleanSelector(env, ENV_USE_DUALSTACK_ENDPOINT, utilConfigProvider.SelectorType.ENV),
		configFileSelector: (profile) => utilConfigProvider.booleanSelector(profile, CONFIG_USE_DUALSTACK_ENDPOINT, utilConfigProvider.SelectorType.CONFIG),
		default: false
	};
	const ENV_USE_FIPS_ENDPOINT = "AWS_USE_FIPS_ENDPOINT";
	const CONFIG_USE_FIPS_ENDPOINT = "use_fips_endpoint";
	const DEFAULT_USE_FIPS_ENDPOINT = false;
	const NODE_USE_FIPS_ENDPOINT_CONFIG_OPTIONS = {
		environmentVariableSelector: (env) => utilConfigProvider.booleanSelector(env, ENV_USE_FIPS_ENDPOINT, utilConfigProvider.SelectorType.ENV),
		configFileSelector: (profile) => utilConfigProvider.booleanSelector(profile, CONFIG_USE_FIPS_ENDPOINT, utilConfigProvider.SelectorType.CONFIG),
		default: false
	};
	const resolveCustomEndpointsConfig = (input) => {
		const { tls, endpoint, urlParser, useDualstackEndpoint } = input;
		return Object.assign(input, {
			tls: tls ?? true,
			endpoint: utilMiddleware.normalizeProvider(typeof endpoint === "string" ? urlParser(endpoint) : endpoint),
			isCustomEndpoint: true,
			useDualstackEndpoint: utilMiddleware.normalizeProvider(useDualstackEndpoint ?? false)
		});
	};
	const getEndpointFromRegion = async (input) => {
		const { tls = true } = input;
		const region = await input.region();
		if (!(/* @__PURE__ */ new RegExp(/^([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9])$/)).test(region)) throw new Error("Invalid region in client config");
		const useDualstackEndpoint = await input.useDualstackEndpoint();
		const useFipsEndpoint = await input.useFipsEndpoint();
		const { hostname } = await input.regionInfoProvider(region, {
			useDualstackEndpoint,
			useFipsEndpoint
		}) ?? {};
		if (!hostname) throw new Error("Cannot resolve hostname from client config");
		return input.urlParser(`${tls ? "https:" : "http:"}//${hostname}`);
	};
	const resolveEndpointsConfig = (input) => {
		const useDualstackEndpoint = utilMiddleware.normalizeProvider(input.useDualstackEndpoint ?? false);
		const { endpoint, useFipsEndpoint, urlParser, tls } = input;
		return Object.assign(input, {
			tls: tls ?? true,
			endpoint: endpoint ? utilMiddleware.normalizeProvider(typeof endpoint === "string" ? urlParser(endpoint) : endpoint) : () => getEndpointFromRegion({
				...input,
				useDualstackEndpoint,
				useFipsEndpoint
			}),
			isCustomEndpoint: !!endpoint,
			useDualstackEndpoint
		});
	};
	const REGION_ENV_NAME = "AWS_REGION";
	const REGION_INI_NAME = "region";
	const NODE_REGION_CONFIG_OPTIONS = {
		environmentVariableSelector: (env) => env[REGION_ENV_NAME],
		configFileSelector: (profile) => profile[REGION_INI_NAME],
		default: () => {
			throw new Error("Region is missing");
		}
	};
	const NODE_REGION_CONFIG_FILE_OPTIONS = { preferredFile: "credentials" };
	const validRegions = /* @__PURE__ */ new Set();
	const checkRegion = (region, check = utilEndpoints.isValidHostLabel) => {
		if (!validRegions.has(region) && !check(region)) if (region === "*") console.warn(`@smithy/config-resolver WARN - Please use the caller region instead of "*". See "sigv4a" in https://github.com/aws/aws-sdk-js-v3/blob/main/supplemental-docs/CLIENTS.md.`);
		else throw new Error(`Region not accepted: region="${region}" is not a valid hostname component.`);
		else validRegions.add(region);
	};
	const isFipsRegion = (region) => typeof region === "string" && (region.startsWith("fips-") || region.endsWith("-fips"));
	const getRealRegion = (region) => isFipsRegion(region) ? ["fips-aws-global", "aws-fips"].includes(region) ? "us-east-1" : region.replace(/fips-(dkr-|prod-)?|-fips/, "") : region;
	const resolveRegionConfig = (input) => {
		const { region, useFipsEndpoint } = input;
		if (!region) throw new Error("Region is missing");
		return Object.assign(input, {
			region: async () => {
				const realRegion = getRealRegion(typeof region === "function" ? await region() : region);
				checkRegion(realRegion);
				return realRegion;
			},
			useFipsEndpoint: async () => {
				if (isFipsRegion(typeof region === "string" ? region : await region())) return true;
				return typeof useFipsEndpoint !== "function" ? Promise.resolve(!!useFipsEndpoint) : useFipsEndpoint();
			}
		});
	};
	const getHostnameFromVariants = (variants = [], { useFipsEndpoint, useDualstackEndpoint }) => variants.find(({ tags }) => useFipsEndpoint === tags.includes("fips") && useDualstackEndpoint === tags.includes("dualstack"))?.hostname;
	const getResolvedHostname = (resolvedRegion, { regionHostname, partitionHostname }) => regionHostname ? regionHostname : partitionHostname ? partitionHostname.replace("{region}", resolvedRegion) : void 0;
	const getResolvedPartition = (region, { partitionHash }) => Object.keys(partitionHash || {}).find((key) => partitionHash[key].regions.includes(region)) ?? "aws";
	const getResolvedSigningRegion = (hostname, { signingRegion, regionRegex, useFipsEndpoint }) => {
		if (signingRegion) return signingRegion;
		else if (useFipsEndpoint) {
			const regionRegexJs = regionRegex.replace("\\\\", "\\").replace(/^\^/g, "\\.").replace(/\$$/g, "\\.");
			const regionRegexmatchArray = hostname.match(regionRegexJs);
			if (regionRegexmatchArray) return regionRegexmatchArray[0].slice(1, -1);
		}
	};
	const getRegionInfo = (region, { useFipsEndpoint = false, useDualstackEndpoint = false, signingService, regionHash, partitionHash }) => {
		const partition = getResolvedPartition(region, { partitionHash });
		const resolvedRegion = region in regionHash ? region : partitionHash[partition]?.endpoint ?? region;
		const hostnameOptions = {
			useFipsEndpoint,
			useDualstackEndpoint
		};
		const hostname = getResolvedHostname(resolvedRegion, {
			regionHostname: getHostnameFromVariants(regionHash[resolvedRegion]?.variants, hostnameOptions),
			partitionHostname: getHostnameFromVariants(partitionHash[partition]?.variants, hostnameOptions)
		});
		if (hostname === void 0) throw new Error(`Endpoint resolution failed for: [object Object]`);
		const signingRegion = getResolvedSigningRegion(hostname, {
			signingRegion: regionHash[resolvedRegion]?.signingRegion,
			regionRegex: partitionHash[partition].regionRegex,
			useFipsEndpoint
		});
		return {
			partition,
			signingService,
			hostname,
			...signingRegion && { signingRegion },
			...regionHash[resolvedRegion]?.signingService && { signingService: regionHash[resolvedRegion].signingService }
		};
	};
	exports.CONFIG_USE_DUALSTACK_ENDPOINT = CONFIG_USE_DUALSTACK_ENDPOINT;
	exports.CONFIG_USE_FIPS_ENDPOINT = CONFIG_USE_FIPS_ENDPOINT;
	exports.DEFAULT_USE_DUALSTACK_ENDPOINT = DEFAULT_USE_DUALSTACK_ENDPOINT;
	exports.DEFAULT_USE_FIPS_ENDPOINT = DEFAULT_USE_FIPS_ENDPOINT;
	exports.ENV_USE_DUALSTACK_ENDPOINT = ENV_USE_DUALSTACK_ENDPOINT;
	exports.ENV_USE_FIPS_ENDPOINT = ENV_USE_FIPS_ENDPOINT;
	exports.NODE_REGION_CONFIG_FILE_OPTIONS = NODE_REGION_CONFIG_FILE_OPTIONS;
	exports.NODE_REGION_CONFIG_OPTIONS = NODE_REGION_CONFIG_OPTIONS;
	exports.NODE_USE_DUALSTACK_ENDPOINT_CONFIG_OPTIONS = NODE_USE_DUALSTACK_ENDPOINT_CONFIG_OPTIONS;
	exports.NODE_USE_FIPS_ENDPOINT_CONFIG_OPTIONS = NODE_USE_FIPS_ENDPOINT_CONFIG_OPTIONS;
	exports.REGION_ENV_NAME = REGION_ENV_NAME;
	exports.REGION_INI_NAME = REGION_INI_NAME;
	exports.getRegionInfo = getRegionInfo;
	exports.resolveCustomEndpointsConfig = resolveCustomEndpointsConfig;
	exports.resolveEndpointsConfig = resolveEndpointsConfig;
	exports.resolveRegionConfig = resolveRegionConfig;
}));

//#endregion
//#region ../node_modules/.pnpm/@smithy+middleware-content-length@4.2.5/node_modules/@smithy/middleware-content-length/dist-cjs/index.js
var require_dist_cjs$9 = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	var protocolHttp = require_dist_cjs$37.require_dist_cjs();
	const CONTENT_LENGTH_HEADER = "content-length";
	function contentLengthMiddleware(bodyLengthChecker) {
		return (next) => async (args) => {
			const request = args.request;
			if (protocolHttp.HttpRequest.isInstance(request)) {
				const { body, headers } = request;
				if (body && Object.keys(headers).map((str) => str.toLowerCase()).indexOf(CONTENT_LENGTH_HEADER) === -1) try {
					const length = bodyLengthChecker(body);
					request.headers = {
						...request.headers,
						[CONTENT_LENGTH_HEADER]: String(length)
					};
				} catch (error) {}
			}
			return next({
				...args,
				request
			});
		};
	}
	const contentLengthMiddlewareOptions = {
		step: "build",
		tags: ["SET_CONTENT_LENGTH", "CONTENT_LENGTH"],
		name: "contentLengthMiddleware",
		override: true
	};
	const getContentLengthPlugin = (options) => ({ applyToStack: (clientStack) => {
		clientStack.add(contentLengthMiddleware(options.bodyLengthChecker), contentLengthMiddlewareOptions);
	} });
	exports.contentLengthMiddleware = contentLengthMiddleware;
	exports.contentLengthMiddlewareOptions = contentLengthMiddlewareOptions;
	exports.getContentLengthPlugin = getContentLengthPlugin;
}));

//#endregion
//#region ../node_modules/.pnpm/@smithy+middleware-endpoint@4.3.12/node_modules/@smithy/middleware-endpoint/dist-cjs/adaptors/getEndpointUrlConfig.js
var require_getEndpointUrlConfig = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.getEndpointUrlConfig = void 0;
	const shared_ini_file_loader_1 = require_dist_cjs$42.require_dist_cjs();
	const ENV_ENDPOINT_URL = "AWS_ENDPOINT_URL";
	const CONFIG_ENDPOINT_URL = "endpoint_url";
	const getEndpointUrlConfig = (serviceId) => ({
		environmentVariableSelector: (env) => {
			const serviceEndpointUrl = env[[ENV_ENDPOINT_URL, ...serviceId.split(" ").map((w) => w.toUpperCase())].join("_")];
			if (serviceEndpointUrl) return serviceEndpointUrl;
			const endpointUrl = env[ENV_ENDPOINT_URL];
			if (endpointUrl) return endpointUrl;
		},
		configFileSelector: (profile, config) => {
			if (config && profile.services) {
				const servicesSection = config[["services", profile.services].join(shared_ini_file_loader_1.CONFIG_PREFIX_SEPARATOR)];
				if (servicesSection) {
					const endpointUrl$1 = servicesSection[[serviceId.split(" ").map((w) => w.toLowerCase()).join("_"), CONFIG_ENDPOINT_URL].join(shared_ini_file_loader_1.CONFIG_PREFIX_SEPARATOR)];
					if (endpointUrl$1) return endpointUrl$1;
				}
			}
			const endpointUrl = profile[CONFIG_ENDPOINT_URL];
			if (endpointUrl) return endpointUrl;
		},
		default: void 0
	});
	exports.getEndpointUrlConfig = getEndpointUrlConfig;
}));

//#endregion
//#region ../node_modules/.pnpm/@smithy+middleware-endpoint@4.3.12/node_modules/@smithy/middleware-endpoint/dist-cjs/adaptors/getEndpointFromConfig.js
var require_getEndpointFromConfig = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.getEndpointFromConfig = void 0;
	const node_config_provider_1 = require_dist_cjs$40.require_dist_cjs();
	const getEndpointUrlConfig_1 = require_getEndpointUrlConfig();
	const getEndpointFromConfig = async (serviceId) => (0, node_config_provider_1.loadConfig)((0, getEndpointUrlConfig_1.getEndpointUrlConfig)(serviceId ?? ""))();
	exports.getEndpointFromConfig = getEndpointFromConfig;
}));

//#endregion
//#region ../node_modules/.pnpm/@smithy+middleware-endpoint@4.3.12/node_modules/@smithy/middleware-endpoint/dist-cjs/index.js
var require_dist_cjs$8 = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	var getEndpointFromConfig = require_getEndpointFromConfig();
	var urlParser = require_dist_cjs$40.require_dist_cjs$1();
	var core = (init_dist_es$1(), require_chunk.__toCommonJS(dist_es_exports$1));
	var utilMiddleware = require_dist_cjs$38.require_dist_cjs$7();
	var middlewareSerde = require_dist_cjs$17();
	const resolveParamsForS3 = async (endpointParams) => {
		const bucket = endpointParams?.Bucket || "";
		if (typeof endpointParams.Bucket === "string") endpointParams.Bucket = bucket.replace(/#/g, encodeURIComponent("#")).replace(/\?/g, encodeURIComponent("?"));
		if (isArnBucketName(bucket)) {
			if (endpointParams.ForcePathStyle === true) throw new Error("Path-style addressing cannot be used with ARN buckets");
		} else if (!isDnsCompatibleBucketName(bucket) || bucket.indexOf(".") !== -1 && !String(endpointParams.Endpoint).startsWith("http:") || bucket.toLowerCase() !== bucket || bucket.length < 3) endpointParams.ForcePathStyle = true;
		if (endpointParams.DisableMultiRegionAccessPoints) {
			endpointParams.disableMultiRegionAccessPoints = true;
			endpointParams.DisableMRAP = true;
		}
		return endpointParams;
	};
	const DOMAIN_PATTERN = /^[a-z0-9][a-z0-9\.\-]{1,61}[a-z0-9]$/;
	const IP_ADDRESS_PATTERN = /(\d+\.){3}\d+/;
	const DOTS_PATTERN = /\.\./;
	const isDnsCompatibleBucketName = (bucketName) => DOMAIN_PATTERN.test(bucketName) && !IP_ADDRESS_PATTERN.test(bucketName) && !DOTS_PATTERN.test(bucketName);
	const isArnBucketName = (bucketName) => {
		const [arn, partition, service, , , bucket] = bucketName.split(":");
		const isArn = arn === "arn" && bucketName.split(":").length >= 6;
		const isValidArn = Boolean(isArn && partition && service && bucket);
		if (isArn && !isValidArn) throw new Error(`Invalid ARN: ${bucketName} was an invalid ARN.`);
		return isValidArn;
	};
	const createConfigValueProvider = (configKey, canonicalEndpointParamKey, config) => {
		const configProvider = async () => {
			const configValue = config[configKey] ?? config[canonicalEndpointParamKey];
			if (typeof configValue === "function") return configValue();
			return configValue;
		};
		if (configKey === "credentialScope" || canonicalEndpointParamKey === "CredentialScope") return async () => {
			const credentials = typeof config.credentials === "function" ? await config.credentials() : config.credentials;
			return credentials?.credentialScope ?? credentials?.CredentialScope;
		};
		if (configKey === "accountId" || canonicalEndpointParamKey === "AccountId") return async () => {
			const credentials = typeof config.credentials === "function" ? await config.credentials() : config.credentials;
			return credentials?.accountId ?? credentials?.AccountId;
		};
		if (configKey === "endpoint" || canonicalEndpointParamKey === "endpoint") return async () => {
			if (config.isCustomEndpoint === false) return;
			const endpoint = await configProvider();
			if (endpoint && typeof endpoint === "object") {
				if ("url" in endpoint) return endpoint.url.href;
				if ("hostname" in endpoint) {
					const { protocol, hostname, port, path } = endpoint;
					return `${protocol}//${hostname}${port ? ":" + port : ""}${path}`;
				}
			}
			return endpoint;
		};
		return configProvider;
	};
	const toEndpointV1 = (endpoint) => {
		if (typeof endpoint === "object") {
			if ("url" in endpoint) return urlParser.parseUrl(endpoint.url);
			return endpoint;
		}
		return urlParser.parseUrl(endpoint);
	};
	const getEndpointFromInstructions = async (commandInput, instructionsSupplier, clientConfig, context) => {
		if (!clientConfig.isCustomEndpoint) {
			let endpointFromConfig;
			if (clientConfig.serviceConfiguredEndpoint) endpointFromConfig = await clientConfig.serviceConfiguredEndpoint();
			else endpointFromConfig = await getEndpointFromConfig.getEndpointFromConfig(clientConfig.serviceId);
			if (endpointFromConfig) {
				clientConfig.endpoint = () => Promise.resolve(toEndpointV1(endpointFromConfig));
				clientConfig.isCustomEndpoint = true;
			}
		}
		const endpointParams = await resolveParams(commandInput, instructionsSupplier, clientConfig);
		if (typeof clientConfig.endpointProvider !== "function") throw new Error("config.endpointProvider is not set.");
		return clientConfig.endpointProvider(endpointParams, context);
	};
	const resolveParams = async (commandInput, instructionsSupplier, clientConfig) => {
		const endpointParams = {};
		const instructions = instructionsSupplier?.getEndpointParameterInstructions?.() || {};
		for (const [name, instruction] of Object.entries(instructions)) switch (instruction.type) {
			case "staticContextParams":
				endpointParams[name] = instruction.value;
				break;
			case "contextParams":
				endpointParams[name] = commandInput[instruction.name];
				break;
			case "clientContextParams":
			case "builtInParams":
				endpointParams[name] = await createConfigValueProvider(instruction.name, name, clientConfig)();
				break;
			case "operationContextParams":
				endpointParams[name] = instruction.get(commandInput);
				break;
			default: throw new Error("Unrecognized endpoint parameter instruction: " + JSON.stringify(instruction));
		}
		if (Object.keys(instructions).length === 0) Object.assign(endpointParams, clientConfig);
		if (String(clientConfig.serviceId).toLowerCase() === "s3") await resolveParamsForS3(endpointParams);
		return endpointParams;
	};
	const endpointMiddleware = ({ config, instructions }) => {
		return (next, context) => async (args) => {
			if (config.isCustomEndpoint) core.setFeature(context, "ENDPOINT_OVERRIDE", "N");
			const endpoint = await getEndpointFromInstructions(args.input, { getEndpointParameterInstructions() {
				return instructions;
			} }, { ...config }, context);
			context.endpointV2 = endpoint;
			context.authSchemes = endpoint.properties?.authSchemes;
			const authScheme = context.authSchemes?.[0];
			if (authScheme) {
				context["signing_region"] = authScheme.signingRegion;
				context["signing_service"] = authScheme.signingName;
				const httpAuthOption = utilMiddleware.getSmithyContext(context)?.selectedHttpAuthScheme?.httpAuthOption;
				if (httpAuthOption) httpAuthOption.signingProperties = Object.assign(httpAuthOption.signingProperties || {}, {
					signing_region: authScheme.signingRegion,
					signingRegion: authScheme.signingRegion,
					signing_service: authScheme.signingName,
					signingName: authScheme.signingName,
					signingRegionSet: authScheme.signingRegionSet
				}, authScheme.properties);
			}
			return next({ ...args });
		};
	};
	const endpointMiddlewareOptions = {
		step: "serialize",
		tags: [
			"ENDPOINT_PARAMETERS",
			"ENDPOINT_V2",
			"ENDPOINT"
		],
		name: "endpointV2Middleware",
		override: true,
		relation: "before",
		toMiddleware: middlewareSerde.serializerMiddlewareOption.name
	};
	const getEndpointPlugin = (config, instructions) => ({ applyToStack: (clientStack) => {
		clientStack.addRelativeTo(endpointMiddleware({
			config,
			instructions
		}), endpointMiddlewareOptions);
	} });
	const resolveEndpointConfig = (input) => {
		const tls = input.tls ?? true;
		const { endpoint, useDualstackEndpoint, useFipsEndpoint } = input;
		const customEndpointProvider = endpoint != null ? async () => toEndpointV1(await utilMiddleware.normalizeProvider(endpoint)()) : void 0;
		const isCustomEndpoint = !!endpoint;
		const resolvedConfig = Object.assign(input, {
			endpoint: customEndpointProvider,
			tls,
			isCustomEndpoint,
			useDualstackEndpoint: utilMiddleware.normalizeProvider(useDualstackEndpoint ?? false),
			useFipsEndpoint: utilMiddleware.normalizeProvider(useFipsEndpoint ?? false)
		});
		let configuredEndpointPromise = void 0;
		resolvedConfig.serviceConfiguredEndpoint = async () => {
			if (input.serviceId && !configuredEndpointPromise) configuredEndpointPromise = getEndpointFromConfig.getEndpointFromConfig(input.serviceId);
			return configuredEndpointPromise;
		};
		return resolvedConfig;
	};
	const resolveEndpointRequiredConfig = (input) => {
		const { endpoint } = input;
		if (endpoint === void 0) input.endpoint = async () => {
			throw new Error("@smithy/middleware-endpoint: (default endpointRuleSet) endpoint is not set - you must configure an endpoint.");
		};
		return input;
	};
	exports.endpointMiddleware = endpointMiddleware;
	exports.endpointMiddlewareOptions = endpointMiddlewareOptions;
	exports.getEndpointFromInstructions = getEndpointFromInstructions;
	exports.getEndpointPlugin = getEndpointPlugin;
	exports.resolveEndpointConfig = resolveEndpointConfig;
	exports.resolveEndpointRequiredConfig = resolveEndpointRequiredConfig;
	exports.resolveParams = resolveParams;
	exports.toEndpointV1 = toEndpointV1;
}));

//#endregion
//#region ../node_modules/.pnpm/@smithy+service-error-classification@4.2.5/node_modules/@smithy/service-error-classification/dist-cjs/index.js
var require_dist_cjs$7 = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	const CLOCK_SKEW_ERROR_CODES = [
		"AuthFailure",
		"InvalidSignatureException",
		"RequestExpired",
		"RequestInTheFuture",
		"RequestTimeTooSkewed",
		"SignatureDoesNotMatch"
	];
	const THROTTLING_ERROR_CODES = [
		"BandwidthLimitExceeded",
		"EC2ThrottledException",
		"LimitExceededException",
		"PriorRequestNotComplete",
		"ProvisionedThroughputExceededException",
		"RequestLimitExceeded",
		"RequestThrottled",
		"RequestThrottledException",
		"SlowDown",
		"ThrottledException",
		"Throttling",
		"ThrottlingException",
		"TooManyRequestsException",
		"TransactionInProgressException"
	];
	const TRANSIENT_ERROR_CODES = [
		"TimeoutError",
		"RequestTimeout",
		"RequestTimeoutException"
	];
	const TRANSIENT_ERROR_STATUS_CODES = [
		500,
		502,
		503,
		504
	];
	const NODEJS_TIMEOUT_ERROR_CODES = [
		"ECONNRESET",
		"ECONNREFUSED",
		"EPIPE",
		"ETIMEDOUT"
	];
	const NODEJS_NETWORK_ERROR_CODES = [
		"EHOSTUNREACH",
		"ENETUNREACH",
		"ENOTFOUND"
	];
	const isRetryableByTrait = (error) => error?.$retryable !== void 0;
	const isClockSkewError = (error) => CLOCK_SKEW_ERROR_CODES.includes(error.name);
	const isClockSkewCorrectedError = (error) => error.$metadata?.clockSkewCorrected;
	const isBrowserNetworkError = (error) => {
		const errorMessages = new Set([
			"Failed to fetch",
			"NetworkError when attempting to fetch resource",
			"The Internet connection appears to be offline",
			"Load failed",
			"Network request failed"
		]);
		if (!(error && error instanceof TypeError)) return false;
		return errorMessages.has(error.message);
	};
	const isThrottlingError = (error) => error.$metadata?.httpStatusCode === 429 || THROTTLING_ERROR_CODES.includes(error.name) || error.$retryable?.throttling == true;
	const isTransientError = (error, depth = 0) => isRetryableByTrait(error) || isClockSkewCorrectedError(error) || TRANSIENT_ERROR_CODES.includes(error.name) || NODEJS_TIMEOUT_ERROR_CODES.includes(error?.code || "") || NODEJS_NETWORK_ERROR_CODES.includes(error?.code || "") || TRANSIENT_ERROR_STATUS_CODES.includes(error.$metadata?.httpStatusCode || 0) || isBrowserNetworkError(error) || error.cause !== void 0 && depth <= 10 && isTransientError(error.cause, depth + 1);
	const isServerError = (error) => {
		if (error.$metadata?.httpStatusCode !== void 0) {
			const statusCode = error.$metadata.httpStatusCode;
			if (500 <= statusCode && statusCode <= 599 && !isTransientError(error)) return true;
			return false;
		}
		return false;
	};
	exports.isBrowserNetworkError = isBrowserNetworkError;
	exports.isClockSkewCorrectedError = isClockSkewCorrectedError;
	exports.isClockSkewError = isClockSkewError;
	exports.isRetryableByTrait = isRetryableByTrait;
	exports.isServerError = isServerError;
	exports.isThrottlingError = isThrottlingError;
	exports.isTransientError = isTransientError;
}));

//#endregion
//#region ../node_modules/.pnpm/@smithy+util-retry@4.2.5/node_modules/@smithy/util-retry/dist-cjs/index.js
var require_dist_cjs$6 = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	var serviceErrorClassification = require_dist_cjs$7();
	exports.RETRY_MODES = void 0;
	(function(RETRY_MODES) {
		RETRY_MODES["STANDARD"] = "standard";
		RETRY_MODES["ADAPTIVE"] = "adaptive";
	})(exports.RETRY_MODES || (exports.RETRY_MODES = {}));
	const DEFAULT_MAX_ATTEMPTS = 3;
	const DEFAULT_RETRY_MODE = exports.RETRY_MODES.STANDARD;
	var DefaultRateLimiter = class DefaultRateLimiter {
		static setTimeoutFn = setTimeout;
		beta;
		minCapacity;
		minFillRate;
		scaleConstant;
		smooth;
		currentCapacity = 0;
		enabled = false;
		lastMaxRate = 0;
		measuredTxRate = 0;
		requestCount = 0;
		fillRate;
		lastThrottleTime;
		lastTimestamp = 0;
		lastTxRateBucket;
		maxCapacity;
		timeWindow = 0;
		constructor(options) {
			this.beta = options?.beta ?? .7;
			this.minCapacity = options?.minCapacity ?? 1;
			this.minFillRate = options?.minFillRate ?? .5;
			this.scaleConstant = options?.scaleConstant ?? .4;
			this.smooth = options?.smooth ?? .8;
			this.lastThrottleTime = this.getCurrentTimeInSeconds();
			this.lastTxRateBucket = Math.floor(this.getCurrentTimeInSeconds());
			this.fillRate = this.minFillRate;
			this.maxCapacity = this.minCapacity;
		}
		getCurrentTimeInSeconds() {
			return Date.now() / 1e3;
		}
		async getSendToken() {
			return this.acquireTokenBucket(1);
		}
		async acquireTokenBucket(amount) {
			if (!this.enabled) return;
			this.refillTokenBucket();
			if (amount > this.currentCapacity) {
				const delay = (amount - this.currentCapacity) / this.fillRate * 1e3;
				await new Promise((resolve) => DefaultRateLimiter.setTimeoutFn(resolve, delay));
			}
			this.currentCapacity = this.currentCapacity - amount;
		}
		refillTokenBucket() {
			const timestamp = this.getCurrentTimeInSeconds();
			if (!this.lastTimestamp) {
				this.lastTimestamp = timestamp;
				return;
			}
			const fillAmount = (timestamp - this.lastTimestamp) * this.fillRate;
			this.currentCapacity = Math.min(this.maxCapacity, this.currentCapacity + fillAmount);
			this.lastTimestamp = timestamp;
		}
		updateClientSendingRate(response) {
			let calculatedRate;
			this.updateMeasuredRate();
			if (serviceErrorClassification.isThrottlingError(response)) {
				const rateToUse = !this.enabled ? this.measuredTxRate : Math.min(this.measuredTxRate, this.fillRate);
				this.lastMaxRate = rateToUse;
				this.calculateTimeWindow();
				this.lastThrottleTime = this.getCurrentTimeInSeconds();
				calculatedRate = this.cubicThrottle(rateToUse);
				this.enableTokenBucket();
			} else {
				this.calculateTimeWindow();
				calculatedRate = this.cubicSuccess(this.getCurrentTimeInSeconds());
			}
			const newRate = Math.min(calculatedRate, 2 * this.measuredTxRate);
			this.updateTokenBucketRate(newRate);
		}
		calculateTimeWindow() {
			this.timeWindow = this.getPrecise(Math.pow(this.lastMaxRate * (1 - this.beta) / this.scaleConstant, 1 / 3));
		}
		cubicThrottle(rateToUse) {
			return this.getPrecise(rateToUse * this.beta);
		}
		cubicSuccess(timestamp) {
			return this.getPrecise(this.scaleConstant * Math.pow(timestamp - this.lastThrottleTime - this.timeWindow, 3) + this.lastMaxRate);
		}
		enableTokenBucket() {
			this.enabled = true;
		}
		updateTokenBucketRate(newRate) {
			this.refillTokenBucket();
			this.fillRate = Math.max(newRate, this.minFillRate);
			this.maxCapacity = Math.max(newRate, this.minCapacity);
			this.currentCapacity = Math.min(this.currentCapacity, this.maxCapacity);
		}
		updateMeasuredRate() {
			const t = this.getCurrentTimeInSeconds();
			const timeBucket = Math.floor(t * 2) / 2;
			this.requestCount++;
			if (timeBucket > this.lastTxRateBucket) {
				const currentRate = this.requestCount / (timeBucket - this.lastTxRateBucket);
				this.measuredTxRate = this.getPrecise(currentRate * this.smooth + this.measuredTxRate * (1 - this.smooth));
				this.requestCount = 0;
				this.lastTxRateBucket = timeBucket;
			}
		}
		getPrecise(num) {
			return parseFloat(num.toFixed(8));
		}
	};
	const DEFAULT_RETRY_DELAY_BASE = 100;
	const MAXIMUM_RETRY_DELAY = 20 * 1e3;
	const THROTTLING_RETRY_DELAY_BASE = 500;
	const INITIAL_RETRY_TOKENS = 500;
	const RETRY_COST = 5;
	const TIMEOUT_RETRY_COST = 10;
	const NO_RETRY_INCREMENT = 1;
	const INVOCATION_ID_HEADER = "amz-sdk-invocation-id";
	const REQUEST_HEADER = "amz-sdk-request";
	const getDefaultRetryBackoffStrategy = () => {
		let delayBase = DEFAULT_RETRY_DELAY_BASE;
		const computeNextBackoffDelay = (attempts) => {
			return Math.floor(Math.min(MAXIMUM_RETRY_DELAY, Math.random() * 2 ** attempts * delayBase));
		};
		const setDelayBase = (delay) => {
			delayBase = delay;
		};
		return {
			computeNextBackoffDelay,
			setDelayBase
		};
	};
	const createDefaultRetryToken = ({ retryDelay, retryCount, retryCost }) => {
		const getRetryCount = () => retryCount;
		const getRetryDelay = () => Math.min(MAXIMUM_RETRY_DELAY, retryDelay);
		const getRetryCost = () => retryCost;
		return {
			getRetryCount,
			getRetryDelay,
			getRetryCost
		};
	};
	var StandardRetryStrategy = class {
		maxAttempts;
		mode = exports.RETRY_MODES.STANDARD;
		capacity = INITIAL_RETRY_TOKENS;
		retryBackoffStrategy = getDefaultRetryBackoffStrategy();
		maxAttemptsProvider;
		constructor(maxAttempts) {
			this.maxAttempts = maxAttempts;
			this.maxAttemptsProvider = typeof maxAttempts === "function" ? maxAttempts : async () => maxAttempts;
		}
		async acquireInitialRetryToken(retryTokenScope) {
			return createDefaultRetryToken({
				retryDelay: DEFAULT_RETRY_DELAY_BASE,
				retryCount: 0
			});
		}
		async refreshRetryTokenForRetry(token, errorInfo) {
			const maxAttempts = await this.getMaxAttempts();
			if (this.shouldRetry(token, errorInfo, maxAttempts)) {
				const errorType = errorInfo.errorType;
				this.retryBackoffStrategy.setDelayBase(errorType === "THROTTLING" ? THROTTLING_RETRY_DELAY_BASE : DEFAULT_RETRY_DELAY_BASE);
				const delayFromErrorType = this.retryBackoffStrategy.computeNextBackoffDelay(token.getRetryCount());
				const retryDelay = errorInfo.retryAfterHint ? Math.max(errorInfo.retryAfterHint.getTime() - Date.now() || 0, delayFromErrorType) : delayFromErrorType;
				const capacityCost = this.getCapacityCost(errorType);
				this.capacity -= capacityCost;
				return createDefaultRetryToken({
					retryDelay,
					retryCount: token.getRetryCount() + 1,
					retryCost: capacityCost
				});
			}
			throw new Error("No retry token available");
		}
		recordSuccess(token) {
			this.capacity = Math.max(INITIAL_RETRY_TOKENS, this.capacity + (token.getRetryCost() ?? NO_RETRY_INCREMENT));
		}
		getCapacity() {
			return this.capacity;
		}
		async getMaxAttempts() {
			try {
				return await this.maxAttemptsProvider();
			} catch (error) {
				console.warn(`Max attempts provider could not resolve. Using default of ${DEFAULT_MAX_ATTEMPTS}`);
				return DEFAULT_MAX_ATTEMPTS;
			}
		}
		shouldRetry(tokenToRenew, errorInfo, maxAttempts) {
			return tokenToRenew.getRetryCount() + 1 < maxAttempts && this.capacity >= this.getCapacityCost(errorInfo.errorType) && this.isRetryableError(errorInfo.errorType);
		}
		getCapacityCost(errorType) {
			return errorType === "TRANSIENT" ? TIMEOUT_RETRY_COST : RETRY_COST;
		}
		isRetryableError(errorType) {
			return errorType === "THROTTLING" || errorType === "TRANSIENT";
		}
	};
	var AdaptiveRetryStrategy = class {
		maxAttemptsProvider;
		rateLimiter;
		standardRetryStrategy;
		mode = exports.RETRY_MODES.ADAPTIVE;
		constructor(maxAttemptsProvider, options) {
			this.maxAttemptsProvider = maxAttemptsProvider;
			const { rateLimiter } = options ?? {};
			this.rateLimiter = rateLimiter ?? new DefaultRateLimiter();
			this.standardRetryStrategy = new StandardRetryStrategy(maxAttemptsProvider);
		}
		async acquireInitialRetryToken(retryTokenScope) {
			await this.rateLimiter.getSendToken();
			return this.standardRetryStrategy.acquireInitialRetryToken(retryTokenScope);
		}
		async refreshRetryTokenForRetry(tokenToRenew, errorInfo) {
			this.rateLimiter.updateClientSendingRate(errorInfo);
			return this.standardRetryStrategy.refreshRetryTokenForRetry(tokenToRenew, errorInfo);
		}
		recordSuccess(token) {
			this.rateLimiter.updateClientSendingRate({});
			this.standardRetryStrategy.recordSuccess(token);
		}
	};
	var ConfiguredRetryStrategy = class extends StandardRetryStrategy {
		computeNextBackoffDelay;
		constructor(maxAttempts, computeNextBackoffDelay = DEFAULT_RETRY_DELAY_BASE) {
			super(typeof maxAttempts === "function" ? maxAttempts : async () => maxAttempts);
			if (typeof computeNextBackoffDelay === "number") this.computeNextBackoffDelay = () => computeNextBackoffDelay;
			else this.computeNextBackoffDelay = computeNextBackoffDelay;
		}
		async refreshRetryTokenForRetry(tokenToRenew, errorInfo) {
			const token = await super.refreshRetryTokenForRetry(tokenToRenew, errorInfo);
			token.getRetryDelay = () => this.computeNextBackoffDelay(token.getRetryCount());
			return token;
		}
	};
	exports.AdaptiveRetryStrategy = AdaptiveRetryStrategy;
	exports.ConfiguredRetryStrategy = ConfiguredRetryStrategy;
	exports.DEFAULT_MAX_ATTEMPTS = DEFAULT_MAX_ATTEMPTS;
	exports.DEFAULT_RETRY_DELAY_BASE = DEFAULT_RETRY_DELAY_BASE;
	exports.DEFAULT_RETRY_MODE = DEFAULT_RETRY_MODE;
	exports.DefaultRateLimiter = DefaultRateLimiter;
	exports.INITIAL_RETRY_TOKENS = INITIAL_RETRY_TOKENS;
	exports.INVOCATION_ID_HEADER = INVOCATION_ID_HEADER;
	exports.MAXIMUM_RETRY_DELAY = MAXIMUM_RETRY_DELAY;
	exports.NO_RETRY_INCREMENT = NO_RETRY_INCREMENT;
	exports.REQUEST_HEADER = REQUEST_HEADER;
	exports.RETRY_COST = RETRY_COST;
	exports.StandardRetryStrategy = StandardRetryStrategy;
	exports.THROTTLING_RETRY_DELAY_BASE = THROTTLING_RETRY_DELAY_BASE;
	exports.TIMEOUT_RETRY_COST = TIMEOUT_RETRY_COST;
}));

//#endregion
//#region ../node_modules/.pnpm/@smithy+middleware-retry@4.4.12/node_modules/@smithy/middleware-retry/dist-cjs/isStreamingPayload/isStreamingPayload.js
var require_isStreamingPayload = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.isStreamingPayload = void 0;
	const stream_1 = require("stream");
	const isStreamingPayload = (request) => request?.body instanceof stream_1.Readable || typeof ReadableStream !== "undefined" && request?.body instanceof ReadableStream;
	exports.isStreamingPayload = isStreamingPayload;
}));

//#endregion
//#region ../node_modules/.pnpm/@smithy+middleware-retry@4.4.12/node_modules/@smithy/middleware-retry/dist-cjs/index.js
var require_dist_cjs$5 = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	var utilRetry = require_dist_cjs$6();
	var protocolHttp = require_dist_cjs$37.require_dist_cjs();
	var serviceErrorClassification = require_dist_cjs$7();
	var uuid = require_dist_cjs$38.require_dist_cjs$1();
	var utilMiddleware = require_dist_cjs$38.require_dist_cjs$7();
	var smithyClient = require_dist_cjs$38.require_dist_cjs();
	var isStreamingPayload = require_isStreamingPayload();
	const getDefaultRetryQuota = (initialRetryTokens, options) => {
		const MAX_CAPACITY = initialRetryTokens;
		const noRetryIncrement = utilRetry.NO_RETRY_INCREMENT;
		const retryCost = utilRetry.RETRY_COST;
		const timeoutRetryCost = utilRetry.TIMEOUT_RETRY_COST;
		let availableCapacity = initialRetryTokens;
		const getCapacityAmount = (error) => error.name === "TimeoutError" ? timeoutRetryCost : retryCost;
		const hasRetryTokens = (error) => getCapacityAmount(error) <= availableCapacity;
		const retrieveRetryTokens = (error) => {
			if (!hasRetryTokens(error)) throw new Error("No retry token available");
			const capacityAmount = getCapacityAmount(error);
			availableCapacity -= capacityAmount;
			return capacityAmount;
		};
		const releaseRetryTokens = (capacityReleaseAmount) => {
			availableCapacity += capacityReleaseAmount ?? noRetryIncrement;
			availableCapacity = Math.min(availableCapacity, MAX_CAPACITY);
		};
		return Object.freeze({
			hasRetryTokens,
			retrieveRetryTokens,
			releaseRetryTokens
		});
	};
	const defaultDelayDecider = (delayBase, attempts) => Math.floor(Math.min(utilRetry.MAXIMUM_RETRY_DELAY, Math.random() * 2 ** attempts * delayBase));
	const defaultRetryDecider = (error) => {
		if (!error) return false;
		return serviceErrorClassification.isRetryableByTrait(error) || serviceErrorClassification.isClockSkewError(error) || serviceErrorClassification.isThrottlingError(error) || serviceErrorClassification.isTransientError(error);
	};
	const asSdkError = (error) => {
		if (error instanceof Error) return error;
		if (error instanceof Object) return Object.assign(/* @__PURE__ */ new Error(), error);
		if (typeof error === "string") return new Error(error);
		return /* @__PURE__ */ new Error(`AWS SDK error wrapper for ${error}`);
	};
	var StandardRetryStrategy = class {
		maxAttemptsProvider;
		retryDecider;
		delayDecider;
		retryQuota;
		mode = utilRetry.RETRY_MODES.STANDARD;
		constructor(maxAttemptsProvider, options) {
			this.maxAttemptsProvider = maxAttemptsProvider;
			this.retryDecider = options?.retryDecider ?? defaultRetryDecider;
			this.delayDecider = options?.delayDecider ?? defaultDelayDecider;
			this.retryQuota = options?.retryQuota ?? getDefaultRetryQuota(utilRetry.INITIAL_RETRY_TOKENS);
		}
		shouldRetry(error, attempts, maxAttempts) {
			return attempts < maxAttempts && this.retryDecider(error) && this.retryQuota.hasRetryTokens(error);
		}
		async getMaxAttempts() {
			let maxAttempts;
			try {
				maxAttempts = await this.maxAttemptsProvider();
			} catch (error) {
				maxAttempts = utilRetry.DEFAULT_MAX_ATTEMPTS;
			}
			return maxAttempts;
		}
		async retry(next, args, options) {
			let retryTokenAmount;
			let attempts = 0;
			let totalDelay = 0;
			const maxAttempts = await this.getMaxAttempts();
			const { request } = args;
			if (protocolHttp.HttpRequest.isInstance(request)) request.headers[utilRetry.INVOCATION_ID_HEADER] = uuid.v4();
			while (true) try {
				if (protocolHttp.HttpRequest.isInstance(request)) request.headers[utilRetry.REQUEST_HEADER] = `attempt=${attempts + 1}; max=${maxAttempts}`;
				if (options?.beforeRequest) await options.beforeRequest();
				const { response, output } = await next(args);
				if (options?.afterRequest) options.afterRequest(response);
				this.retryQuota.releaseRetryTokens(retryTokenAmount);
				output.$metadata.attempts = attempts + 1;
				output.$metadata.totalRetryDelay = totalDelay;
				return {
					response,
					output
				};
			} catch (e) {
				const err = asSdkError(e);
				attempts++;
				if (this.shouldRetry(err, attempts, maxAttempts)) {
					retryTokenAmount = this.retryQuota.retrieveRetryTokens(err);
					const delayFromDecider = this.delayDecider(serviceErrorClassification.isThrottlingError(err) ? utilRetry.THROTTLING_RETRY_DELAY_BASE : utilRetry.DEFAULT_RETRY_DELAY_BASE, attempts);
					const delayFromResponse = getDelayFromRetryAfterHeader(err.$response);
					const delay = Math.max(delayFromResponse || 0, delayFromDecider);
					totalDelay += delay;
					await new Promise((resolve) => setTimeout(resolve, delay));
					continue;
				}
				if (!err.$metadata) err.$metadata = {};
				err.$metadata.attempts = attempts;
				err.$metadata.totalRetryDelay = totalDelay;
				throw err;
			}
		}
	};
	const getDelayFromRetryAfterHeader = (response) => {
		if (!protocolHttp.HttpResponse.isInstance(response)) return;
		const retryAfterHeaderName = Object.keys(response.headers).find((key) => key.toLowerCase() === "retry-after");
		if (!retryAfterHeaderName) return;
		const retryAfter = response.headers[retryAfterHeaderName];
		const retryAfterSeconds = Number(retryAfter);
		if (!Number.isNaN(retryAfterSeconds)) return retryAfterSeconds * 1e3;
		return new Date(retryAfter).getTime() - Date.now();
	};
	var AdaptiveRetryStrategy = class extends StandardRetryStrategy {
		rateLimiter;
		constructor(maxAttemptsProvider, options) {
			const { rateLimiter, ...superOptions } = options ?? {};
			super(maxAttemptsProvider, superOptions);
			this.rateLimiter = rateLimiter ?? new utilRetry.DefaultRateLimiter();
			this.mode = utilRetry.RETRY_MODES.ADAPTIVE;
		}
		async retry(next, args) {
			return super.retry(next, args, {
				beforeRequest: async () => {
					return this.rateLimiter.getSendToken();
				},
				afterRequest: (response) => {
					this.rateLimiter.updateClientSendingRate(response);
				}
			});
		}
	};
	const ENV_MAX_ATTEMPTS = "AWS_MAX_ATTEMPTS";
	const CONFIG_MAX_ATTEMPTS = "max_attempts";
	const NODE_MAX_ATTEMPT_CONFIG_OPTIONS = {
		environmentVariableSelector: (env) => {
			const value = env[ENV_MAX_ATTEMPTS];
			if (!value) return void 0;
			const maxAttempt = parseInt(value);
			if (Number.isNaN(maxAttempt)) throw new Error(`Environment variable ${ENV_MAX_ATTEMPTS} mast be a number, got "${value}"`);
			return maxAttempt;
		},
		configFileSelector: (profile) => {
			const value = profile[CONFIG_MAX_ATTEMPTS];
			if (!value) return void 0;
			const maxAttempt = parseInt(value);
			if (Number.isNaN(maxAttempt)) throw new Error(`Shared config file entry ${CONFIG_MAX_ATTEMPTS} mast be a number, got "${value}"`);
			return maxAttempt;
		},
		default: utilRetry.DEFAULT_MAX_ATTEMPTS
	};
	const resolveRetryConfig = (input) => {
		const { retryStrategy, retryMode: _retryMode, maxAttempts: _maxAttempts } = input;
		const maxAttempts = utilMiddleware.normalizeProvider(_maxAttempts ?? utilRetry.DEFAULT_MAX_ATTEMPTS);
		return Object.assign(input, {
			maxAttempts,
			retryStrategy: async () => {
				if (retryStrategy) return retryStrategy;
				if (await utilMiddleware.normalizeProvider(_retryMode)() === utilRetry.RETRY_MODES.ADAPTIVE) return new utilRetry.AdaptiveRetryStrategy(maxAttempts);
				return new utilRetry.StandardRetryStrategy(maxAttempts);
			}
		});
	};
	const ENV_RETRY_MODE = "AWS_RETRY_MODE";
	const CONFIG_RETRY_MODE = "retry_mode";
	const NODE_RETRY_MODE_CONFIG_OPTIONS = {
		environmentVariableSelector: (env) => env[ENV_RETRY_MODE],
		configFileSelector: (profile) => profile[CONFIG_RETRY_MODE],
		default: utilRetry.DEFAULT_RETRY_MODE
	};
	const omitRetryHeadersMiddleware = () => (next) => async (args) => {
		const { request } = args;
		if (protocolHttp.HttpRequest.isInstance(request)) {
			delete request.headers[utilRetry.INVOCATION_ID_HEADER];
			delete request.headers[utilRetry.REQUEST_HEADER];
		}
		return next(args);
	};
	const omitRetryHeadersMiddlewareOptions = {
		name: "omitRetryHeadersMiddleware",
		tags: [
			"RETRY",
			"HEADERS",
			"OMIT_RETRY_HEADERS"
		],
		relation: "before",
		toMiddleware: "awsAuthMiddleware",
		override: true
	};
	const getOmitRetryHeadersPlugin = (options) => ({ applyToStack: (clientStack) => {
		clientStack.addRelativeTo(omitRetryHeadersMiddleware(), omitRetryHeadersMiddlewareOptions);
	} });
	const retryMiddleware = (options) => (next, context) => async (args) => {
		let retryStrategy = await options.retryStrategy();
		const maxAttempts = await options.maxAttempts();
		if (isRetryStrategyV2(retryStrategy)) {
			retryStrategy = retryStrategy;
			let retryToken = await retryStrategy.acquireInitialRetryToken(context["partition_id"]);
			let lastError = /* @__PURE__ */ new Error();
			let attempts = 0;
			let totalRetryDelay = 0;
			const { request } = args;
			const isRequest = protocolHttp.HttpRequest.isInstance(request);
			if (isRequest) request.headers[utilRetry.INVOCATION_ID_HEADER] = uuid.v4();
			while (true) try {
				if (isRequest) request.headers[utilRetry.REQUEST_HEADER] = `attempt=${attempts + 1}; max=${maxAttempts}`;
				const { response, output } = await next(args);
				retryStrategy.recordSuccess(retryToken);
				output.$metadata.attempts = attempts + 1;
				output.$metadata.totalRetryDelay = totalRetryDelay;
				return {
					response,
					output
				};
			} catch (e) {
				const retryErrorInfo = getRetryErrorInfo(e);
				lastError = asSdkError(e);
				if (isRequest && isStreamingPayload.isStreamingPayload(request)) {
					(context.logger instanceof smithyClient.NoOpLogger ? console : context.logger)?.warn("An error was encountered in a non-retryable streaming request.");
					throw lastError;
				}
				try {
					retryToken = await retryStrategy.refreshRetryTokenForRetry(retryToken, retryErrorInfo);
				} catch (refreshError) {
					if (!lastError.$metadata) lastError.$metadata = {};
					lastError.$metadata.attempts = attempts + 1;
					lastError.$metadata.totalRetryDelay = totalRetryDelay;
					throw lastError;
				}
				attempts = retryToken.getRetryCount();
				const delay = retryToken.getRetryDelay();
				totalRetryDelay += delay;
				await new Promise((resolve) => setTimeout(resolve, delay));
			}
		} else {
			retryStrategy = retryStrategy;
			if (retryStrategy?.mode) context.userAgent = [...context.userAgent || [], ["cfg/retry-mode", retryStrategy.mode]];
			return retryStrategy.retry(next, args);
		}
	};
	const isRetryStrategyV2 = (retryStrategy) => typeof retryStrategy.acquireInitialRetryToken !== "undefined" && typeof retryStrategy.refreshRetryTokenForRetry !== "undefined" && typeof retryStrategy.recordSuccess !== "undefined";
	const getRetryErrorInfo = (error) => {
		const errorInfo = {
			error,
			errorType: getRetryErrorType(error)
		};
		const retryAfterHint = getRetryAfterHint(error.$response);
		if (retryAfterHint) errorInfo.retryAfterHint = retryAfterHint;
		return errorInfo;
	};
	const getRetryErrorType = (error) => {
		if (serviceErrorClassification.isThrottlingError(error)) return "THROTTLING";
		if (serviceErrorClassification.isTransientError(error)) return "TRANSIENT";
		if (serviceErrorClassification.isServerError(error)) return "SERVER_ERROR";
		return "CLIENT_ERROR";
	};
	const retryMiddlewareOptions = {
		name: "retryMiddleware",
		tags: ["RETRY"],
		step: "finalizeRequest",
		priority: "high",
		override: true
	};
	const getRetryPlugin = (options) => ({ applyToStack: (clientStack) => {
		clientStack.add(retryMiddleware(options), retryMiddlewareOptions);
	} });
	const getRetryAfterHint = (response) => {
		if (!protocolHttp.HttpResponse.isInstance(response)) return;
		const retryAfterHeaderName = Object.keys(response.headers).find((key) => key.toLowerCase() === "retry-after");
		if (!retryAfterHeaderName) return;
		const retryAfter = response.headers[retryAfterHeaderName];
		const retryAfterSeconds = Number(retryAfter);
		if (!Number.isNaN(retryAfterSeconds)) return /* @__PURE__ */ new Date(retryAfterSeconds * 1e3);
		return new Date(retryAfter);
	};
	exports.AdaptiveRetryStrategy = AdaptiveRetryStrategy;
	exports.CONFIG_MAX_ATTEMPTS = CONFIG_MAX_ATTEMPTS;
	exports.CONFIG_RETRY_MODE = CONFIG_RETRY_MODE;
	exports.ENV_MAX_ATTEMPTS = ENV_MAX_ATTEMPTS;
	exports.ENV_RETRY_MODE = ENV_RETRY_MODE;
	exports.NODE_MAX_ATTEMPT_CONFIG_OPTIONS = NODE_MAX_ATTEMPT_CONFIG_OPTIONS;
	exports.NODE_RETRY_MODE_CONFIG_OPTIONS = NODE_RETRY_MODE_CONFIG_OPTIONS;
	exports.StandardRetryStrategy = StandardRetryStrategy;
	exports.defaultDelayDecider = defaultDelayDecider;
	exports.defaultRetryDecider = defaultRetryDecider;
	exports.getOmitRetryHeadersPlugin = getOmitRetryHeadersPlugin;
	exports.getRetryAfterHint = getRetryAfterHint;
	exports.getRetryPlugin = getRetryPlugin;
	exports.omitRetryHeadersMiddleware = omitRetryHeadersMiddleware;
	exports.omitRetryHeadersMiddlewareOptions = omitRetryHeadersMiddlewareOptions;
	exports.resolveRetryConfig = resolveRetryConfig;
	exports.retryMiddleware = retryMiddleware;
	exports.retryMiddlewareOptions = retryMiddlewareOptions;
}));

//#endregion
//#region ../node_modules/.pnpm/@aws-sdk+util-user-agent-node@3.940.0/node_modules/@aws-sdk/util-user-agent-node/dist-cjs/index.js
var require_dist_cjs$4 = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	var os = require("os");
	var process$1 = require("process");
	var middlewareUserAgent = require_dist_cjs$12();
	const crtAvailability = { isCrtAvailable: false };
	const isCrtAvailable = () => {
		if (crtAvailability.isCrtAvailable) return ["md/crt-avail"];
		return null;
	};
	const createDefaultUserAgentProvider = ({ serviceId, clientVersion }) => {
		return async (config) => {
			const sections = [
				["aws-sdk-js", clientVersion],
				["ua", "2.1"],
				[`os/${os.platform()}`, os.release()],
				["lang/js"],
				["md/nodejs", `${process$1.versions.node}`]
			];
			const crtAvailable = isCrtAvailable();
			if (crtAvailable) sections.push(crtAvailable);
			if (serviceId) sections.push([`api/${serviceId}`, clientVersion]);
			if (process$1.env.AWS_EXECUTION_ENV) sections.push([`exec-env/${process$1.env.AWS_EXECUTION_ENV}`]);
			const appId = await config?.userAgentAppId?.();
			return appId ? [...sections, [`app/${appId}`]] : [...sections];
		};
	};
	const defaultUserAgent = createDefaultUserAgentProvider;
	const UA_APP_ID_ENV_NAME = "AWS_SDK_UA_APP_ID";
	const UA_APP_ID_INI_NAME = "sdk_ua_app_id";
	const UA_APP_ID_INI_NAME_DEPRECATED = "sdk-ua-app-id";
	const NODE_APP_ID_CONFIG_OPTIONS = {
		environmentVariableSelector: (env) => env[UA_APP_ID_ENV_NAME],
		configFileSelector: (profile) => profile[UA_APP_ID_INI_NAME] ?? profile[UA_APP_ID_INI_NAME_DEPRECATED],
		default: middlewareUserAgent.DEFAULT_UA_APP_ID
	};
	exports.NODE_APP_ID_CONFIG_OPTIONS = NODE_APP_ID_CONFIG_OPTIONS;
	exports.UA_APP_ID_ENV_NAME = UA_APP_ID_ENV_NAME;
	exports.UA_APP_ID_INI_NAME = UA_APP_ID_INI_NAME;
	exports.createDefaultUserAgentProvider = createDefaultUserAgentProvider;
	exports.crtAvailability = crtAvailability;
	exports.defaultUserAgent = defaultUserAgent;
}));

//#endregion
//#region ../node_modules/.pnpm/@smithy+hash-node@4.2.5/node_modules/@smithy/hash-node/dist-cjs/index.js
var require_dist_cjs$3 = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	var utilBufferFrom = require_dist_cjs$39.require_dist_cjs$1();
	var utilUtf8 = require_dist_cjs$39.require_dist_cjs();
	var buffer = require("buffer");
	var crypto = require("crypto");
	var Hash = class {
		algorithmIdentifier;
		secret;
		hash;
		constructor(algorithmIdentifier, secret) {
			this.algorithmIdentifier = algorithmIdentifier;
			this.secret = secret;
			this.reset();
		}
		update(toHash, encoding) {
			this.hash.update(utilUtf8.toUint8Array(castSourceData(toHash, encoding)));
		}
		digest() {
			return Promise.resolve(this.hash.digest());
		}
		reset() {
			this.hash = this.secret ? crypto.createHmac(this.algorithmIdentifier, castSourceData(this.secret)) : crypto.createHash(this.algorithmIdentifier);
		}
	};
	function castSourceData(toCast, encoding) {
		if (buffer.Buffer.isBuffer(toCast)) return toCast;
		if (typeof toCast === "string") return utilBufferFrom.fromString(toCast, encoding);
		if (ArrayBuffer.isView(toCast)) return utilBufferFrom.fromArrayBuffer(toCast.buffer, toCast.byteOffset, toCast.byteLength);
		return utilBufferFrom.fromArrayBuffer(toCast);
	}
	exports.Hash = Hash;
}));

//#endregion
//#region ../node_modules/.pnpm/@smithy+util-body-length-node@4.2.1/node_modules/@smithy/util-body-length-node/dist-cjs/index.js
var require_dist_cjs$2 = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	var node_fs = require("node:fs");
	const calculateBodyLength = (body) => {
		if (!body) return 0;
		if (typeof body === "string") return Buffer.byteLength(body);
		else if (typeof body.byteLength === "number") return body.byteLength;
		else if (typeof body.size === "number") return body.size;
		else if (typeof body.start === "number" && typeof body.end === "number") return body.end + 1 - body.start;
		else if (body instanceof node_fs.ReadStream) {
			if (body.path != null) return node_fs.lstatSync(body.path).size;
			else if (typeof body.fd === "number") return node_fs.fstatSync(body.fd).size;
		}
		throw new Error(`Body Length computation failed for ${body}`);
	};
	exports.calculateBodyLength = calculateBodyLength;
}));

//#endregion
//#region ../node_modules/.pnpm/@smithy+util-defaults-mode-node@4.2.14/node_modules/@smithy/util-defaults-mode-node/dist-cjs/index.js
var require_dist_cjs$1 = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	var configResolver = require_dist_cjs$10();
	var nodeConfigProvider = require_dist_cjs$40.require_dist_cjs();
	var propertyProvider = require_dist_cjs$41.require_dist_cjs();
	const AWS_EXECUTION_ENV = "AWS_EXECUTION_ENV";
	const AWS_REGION_ENV = "AWS_REGION";
	const AWS_DEFAULT_REGION_ENV = "AWS_DEFAULT_REGION";
	const ENV_IMDS_DISABLED = "AWS_EC2_METADATA_DISABLED";
	const DEFAULTS_MODE_OPTIONS = [
		"in-region",
		"cross-region",
		"mobile",
		"standard",
		"legacy"
	];
	const IMDS_REGION_PATH = "/latest/meta-data/placement/region";
	const AWS_DEFAULTS_MODE_ENV = "AWS_DEFAULTS_MODE";
	const AWS_DEFAULTS_MODE_CONFIG = "defaults_mode";
	const NODE_DEFAULTS_MODE_CONFIG_OPTIONS = {
		environmentVariableSelector: (env) => {
			return env[AWS_DEFAULTS_MODE_ENV];
		},
		configFileSelector: (profile) => {
			return profile[AWS_DEFAULTS_MODE_CONFIG];
		},
		default: "legacy"
	};
	const resolveDefaultsModeConfig = ({ region = nodeConfigProvider.loadConfig(configResolver.NODE_REGION_CONFIG_OPTIONS), defaultsMode = nodeConfigProvider.loadConfig(NODE_DEFAULTS_MODE_CONFIG_OPTIONS) } = {}) => propertyProvider.memoize(async () => {
		const mode = typeof defaultsMode === "function" ? await defaultsMode() : defaultsMode;
		switch (mode?.toLowerCase()) {
			case "auto": return resolveNodeDefaultsModeAuto(region);
			case "in-region":
			case "cross-region":
			case "mobile":
			case "standard":
			case "legacy": return Promise.resolve(mode?.toLocaleLowerCase());
			case void 0: return Promise.resolve("legacy");
			default: throw new Error(`Invalid parameter for "defaultsMode", expect ${DEFAULTS_MODE_OPTIONS.join(", ")}, got ${mode}`);
		}
	});
	const resolveNodeDefaultsModeAuto = async (clientRegion) => {
		if (clientRegion) {
			const resolvedRegion = typeof clientRegion === "function" ? await clientRegion() : clientRegion;
			const inferredRegion = await inferPhysicalRegion();
			if (!inferredRegion) return "standard";
			if (resolvedRegion === inferredRegion) return "in-region";
			else return "cross-region";
		}
		return "standard";
	};
	const inferPhysicalRegion = async () => {
		if (process.env[AWS_EXECUTION_ENV] && (process.env[AWS_REGION_ENV] || process.env[AWS_DEFAULT_REGION_ENV])) return process.env[AWS_REGION_ENV] ?? process.env[AWS_DEFAULT_REGION_ENV];
		if (!process.env[ENV_IMDS_DISABLED]) try {
			const { getInstanceMetadataEndpoint, httpRequest } = await Promise.resolve().then(() => require_chunk.__toDynamicImportESM()(require("./dist-cjs-Blt4Z-vU.js")));
			return (await httpRequest({
				...await getInstanceMetadataEndpoint(),
				path: IMDS_REGION_PATH
			})).toString();
		} catch (e) {}
	};
	exports.resolveDefaultsModeConfig = resolveDefaultsModeConfig;
}));

//#endregion
//#region ../node_modules/.pnpm/@aws-sdk+region-config-resolver@3.936.0/node_modules/@aws-sdk/region-config-resolver/dist-cjs/regionConfig/stsRegionDefaultResolver.js
var require_stsRegionDefaultResolver = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.warning = void 0;
	exports.stsRegionDefaultResolver = stsRegionDefaultResolver;
	const config_resolver_1 = require_dist_cjs$10();
	const node_config_provider_1 = require_dist_cjs$40.require_dist_cjs();
	function stsRegionDefaultResolver(loaderConfig = {}) {
		return (0, node_config_provider_1.loadConfig)({
			...config_resolver_1.NODE_REGION_CONFIG_OPTIONS,
			async default() {
				if (!exports.warning.silence) console.warn("@aws-sdk - WARN - default STS region of us-east-1 used. See @aws-sdk/credential-providers README and set a region explicitly.");
				return "us-east-1";
			}
		}, {
			...config_resolver_1.NODE_REGION_CONFIG_FILE_OPTIONS,
			...loaderConfig
		});
	}
	exports.warning = { silence: false };
}));

//#endregion
//#region ../node_modules/.pnpm/@aws-sdk+region-config-resolver@3.936.0/node_modules/@aws-sdk/region-config-resolver/dist-cjs/index.js
var require_dist_cjs = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	var configResolver = require_dist_cjs$10();
	var stsRegionDefaultResolver = require_stsRegionDefaultResolver();
	const getAwsRegionExtensionConfiguration = (runtimeConfig) => {
		return {
			setRegion(region) {
				runtimeConfig.region = region;
			},
			region() {
				return runtimeConfig.region;
			}
		};
	};
	const resolveAwsRegionExtensionConfiguration = (awsRegionExtensionConfiguration) => {
		return { region: awsRegionExtensionConfiguration.region() };
	};
	Object.defineProperty(exports, "NODE_REGION_CONFIG_FILE_OPTIONS", {
		enumerable: true,
		get: function() {
			return configResolver.NODE_REGION_CONFIG_FILE_OPTIONS;
		}
	});
	Object.defineProperty(exports, "NODE_REGION_CONFIG_OPTIONS", {
		enumerable: true,
		get: function() {
			return configResolver.NODE_REGION_CONFIG_OPTIONS;
		}
	});
	Object.defineProperty(exports, "REGION_ENV_NAME", {
		enumerable: true,
		get: function() {
			return configResolver.REGION_ENV_NAME;
		}
	});
	Object.defineProperty(exports, "REGION_INI_NAME", {
		enumerable: true,
		get: function() {
			return configResolver.REGION_INI_NAME;
		}
	});
	Object.defineProperty(exports, "resolveRegionConfig", {
		enumerable: true,
		get: function() {
			return configResolver.resolveRegionConfig;
		}
	});
	exports.getAwsRegionExtensionConfiguration = getAwsRegionExtensionConfiguration;
	exports.resolveAwsRegionExtensionConfiguration = resolveAwsRegionExtensionConfiguration;
	Object.keys(stsRegionDefaultResolver).forEach(function(k) {
		if (k !== "default" && !Object.prototype.hasOwnProperty.call(exports, k)) Object.defineProperty(exports, k, {
			enumerable: true,
			get: function() {
				return stsRegionDefaultResolver[k];
			}
		});
	});
}));

//#endregion
Object.defineProperty(exports, 'AwsQueryProtocol', {
  enumerable: true,
  get: function () {
    return AwsQueryProtocol;
  }
});
Object.defineProperty(exports, 'AwsRestJsonProtocol', {
  enumerable: true,
  get: function () {
    return AwsRestJsonProtocol;
  }
});
Object.defineProperty(exports, 'AwsSdkSigV4Signer', {
  enumerable: true,
  get: function () {
    return AwsSdkSigV4Signer;
  }
});
Object.defineProperty(exports, 'DefaultIdentityProviderConfig', {
  enumerable: true,
  get: function () {
    return DefaultIdentityProviderConfig;
  }
});
Object.defineProperty(exports, 'NODE_AUTH_SCHEME_PREFERENCE_OPTIONS', {
  enumerable: true,
  get: function () {
    return NODE_AUTH_SCHEME_PREFERENCE_OPTIONS;
  }
});
Object.defineProperty(exports, 'NoAuthSigner', {
  enumerable: true,
  get: function () {
    return NoAuthSigner;
  }
});
Object.defineProperty(exports, 'dist_es_exports', {
  enumerable: true,
  get: function () {
    return dist_es_exports;
  }
});
Object.defineProperty(exports, 'dist_es_exports$1', {
  enumerable: true,
  get: function () {
    return dist_es_exports$1;
  }
});
Object.defineProperty(exports, 'getHttpAuthSchemeEndpointRuleSetPlugin', {
  enumerable: true,
  get: function () {
    return getHttpAuthSchemeEndpointRuleSetPlugin;
  }
});
Object.defineProperty(exports, 'getHttpSigningPlugin', {
  enumerable: true,
  get: function () {
    return getHttpSigningPlugin;
  }
});
Object.defineProperty(exports, 'httpAuthSchemes_exports', {
  enumerable: true,
  get: function () {
    return httpAuthSchemes_exports;
  }
});
Object.defineProperty(exports, 'init_dist_es', {
  enumerable: true,
  get: function () {
    return init_dist_es;
  }
});
Object.defineProperty(exports, 'init_dist_es$1', {
  enumerable: true,
  get: function () {
    return init_dist_es$1;
  }
});
Object.defineProperty(exports, 'init_httpAuthSchemes', {
  enumerable: true,
  get: function () {
    return init_httpAuthSchemes;
  }
});
Object.defineProperty(exports, 'init_protocols', {
  enumerable: true,
  get: function () {
    return init_protocols;
  }
});
Object.defineProperty(exports, 'protocols_exports', {
  enumerable: true,
  get: function () {
    return protocols_exports;
  }
});
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
Object.defineProperty(exports, 'require_dist_cjs$10', {
  enumerable: true,
  get: function () {
    return require_dist_cjs$12;
  }
});
Object.defineProperty(exports, 'require_dist_cjs$11', {
  enumerable: true,
  get: function () {
    return require_dist_cjs$15;
  }
});
Object.defineProperty(exports, 'require_dist_cjs$12', {
  enumerable: true,
  get: function () {
    return require_dist_cjs$16;
  }
});
Object.defineProperty(exports, 'require_dist_cjs$13', {
  enumerable: true,
  get: function () {
    return require_dist_cjs$18;
  }
});
Object.defineProperty(exports, 'require_dist_cjs$14', {
  enumerable: true,
  get: function () {
    return require_dist_cjs$19;
  }
});
Object.defineProperty(exports, 'require_dist_cjs$15', {
  enumerable: true,
  get: function () {
    return require_dist_cjs$20;
  }
});
Object.defineProperty(exports, 'require_dist_cjs$2', {
  enumerable: true,
  get: function () {
    return require_dist_cjs$2;
  }
});
Object.defineProperty(exports, 'require_dist_cjs$3', {
  enumerable: true,
  get: function () {
    return require_dist_cjs$3;
  }
});
Object.defineProperty(exports, 'require_dist_cjs$4', {
  enumerable: true,
  get: function () {
    return require_dist_cjs$4;
  }
});
Object.defineProperty(exports, 'require_dist_cjs$5', {
  enumerable: true,
  get: function () {
    return require_dist_cjs$5;
  }
});
Object.defineProperty(exports, 'require_dist_cjs$6', {
  enumerable: true,
  get: function () {
    return require_dist_cjs$6;
  }
});
Object.defineProperty(exports, 'require_dist_cjs$7', {
  enumerable: true,
  get: function () {
    return require_dist_cjs$8;
  }
});
Object.defineProperty(exports, 'require_dist_cjs$8', {
  enumerable: true,
  get: function () {
    return require_dist_cjs$9;
  }
});
Object.defineProperty(exports, 'require_dist_cjs$9', {
  enumerable: true,
  get: function () {
    return require_dist_cjs$10;
  }
});
Object.defineProperty(exports, 'resolveAwsSdkSigV4Config', {
  enumerable: true,
  get: function () {
    return resolveAwsSdkSigV4Config;
  }
});