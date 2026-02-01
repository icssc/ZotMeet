const require_chunk = require('./chunk-CdAKIUsw.js');
const require_dist_cjs$2 = require('./dist-cjs-DcvYtBnm.js');

//#region ../node_modules/.pnpm/@smithy+protocol-http@5.3.5/node_modules/@smithy/protocol-http/dist-cjs/index.js
var require_dist_cjs = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	var types = require_dist_cjs$2.require_dist_cjs();
	const getHttpHandlerExtensionConfiguration = (runtimeConfig) => {
		return {
			setHttpHandler(handler) {
				runtimeConfig.httpHandler = handler;
			},
			httpHandler() {
				return runtimeConfig.httpHandler;
			},
			updateHttpClientConfig(key, value) {
				runtimeConfig.httpHandler?.updateHttpClientConfig(key, value);
			},
			httpHandlerConfigs() {
				return runtimeConfig.httpHandler.httpHandlerConfigs();
			}
		};
	};
	const resolveHttpHandlerRuntimeConfig = (httpHandlerExtensionConfiguration) => {
		return { httpHandler: httpHandlerExtensionConfiguration.httpHandler() };
	};
	var Field = class {
		name;
		kind;
		values;
		constructor({ name, kind = types.FieldPosition.HEADER, values = [] }) {
			this.name = name;
			this.kind = kind;
			this.values = values;
		}
		add(value) {
			this.values.push(value);
		}
		set(values) {
			this.values = values;
		}
		remove(value) {
			this.values = this.values.filter((v) => v !== value);
		}
		toString() {
			return this.values.map((v) => v.includes(",") || v.includes(" ") ? `"${v}"` : v).join(", ");
		}
		get() {
			return this.values;
		}
	};
	var Fields = class {
		entries = {};
		encoding;
		constructor({ fields = [], encoding = "utf-8" }) {
			fields.forEach(this.setField.bind(this));
			this.encoding = encoding;
		}
		setField(field) {
			this.entries[field.name.toLowerCase()] = field;
		}
		getField(name) {
			return this.entries[name.toLowerCase()];
		}
		removeField(name) {
			delete this.entries[name.toLowerCase()];
		}
		getByType(kind) {
			return Object.values(this.entries).filter((field) => field.kind === kind);
		}
	};
	var HttpRequest = class HttpRequest {
		method;
		protocol;
		hostname;
		port;
		path;
		query;
		headers;
		username;
		password;
		fragment;
		body;
		constructor(options) {
			this.method = options.method || "GET";
			this.hostname = options.hostname || "localhost";
			this.port = options.port;
			this.query = options.query || {};
			this.headers = options.headers || {};
			this.body = options.body;
			this.protocol = options.protocol ? options.protocol.slice(-1) !== ":" ? `${options.protocol}:` : options.protocol : "https:";
			this.path = options.path ? options.path.charAt(0) !== "/" ? `/${options.path}` : options.path : "/";
			this.username = options.username;
			this.password = options.password;
			this.fragment = options.fragment;
		}
		static clone(request) {
			const cloned = new HttpRequest({
				...request,
				headers: { ...request.headers }
			});
			if (cloned.query) cloned.query = cloneQuery(cloned.query);
			return cloned;
		}
		static isInstance(request) {
			if (!request) return false;
			const req = request;
			return "method" in req && "protocol" in req && "hostname" in req && "path" in req && typeof req["query"] === "object" && typeof req["headers"] === "object";
		}
		clone() {
			return HttpRequest.clone(this);
		}
	};
	function cloneQuery(query) {
		return Object.keys(query).reduce((carry, paramName) => {
			const param = query[paramName];
			return {
				...carry,
				[paramName]: Array.isArray(param) ? [...param] : param
			};
		}, {});
	}
	var HttpResponse = class {
		statusCode;
		reason;
		headers;
		body;
		constructor(options) {
			this.statusCode = options.statusCode;
			this.reason = options.reason;
			this.headers = options.headers || {};
			this.body = options.body;
		}
		static isInstance(response) {
			if (!response) return false;
			const resp = response;
			return typeof resp.statusCode === "number" && typeof resp.headers === "object";
		}
	};
	function isValidHostname(hostname) {
		return /^[a-z0-9][a-z0-9\.\-]*[a-z0-9]$/.test(hostname);
	}
	exports.Field = Field;
	exports.Fields = Fields;
	exports.HttpRequest = HttpRequest;
	exports.HttpResponse = HttpResponse;
	exports.getHttpHandlerExtensionConfiguration = getHttpHandlerExtensionConfiguration;
	exports.isValidHostname = isValidHostname;
	exports.resolveHttpHandlerRuntimeConfig = resolveHttpHandlerRuntimeConfig;
}));

//#endregion
Object.defineProperty(exports, 'require_dist_cjs', {
  enumerable: true,
  get: function () {
    return require_dist_cjs;
  }
});