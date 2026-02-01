const require_chunk = require('./chunk-CdAKIUsw.js');

//#region ../node_modules/.pnpm/@smithy+property-provider@4.2.5/node_modules/@smithy/property-provider/dist-cjs/index.js
var require_dist_cjs = /* @__PURE__ */ require_chunk.__commonJSMin(((exports) => {
	var ProviderError = class ProviderError extends Error {
		name = "ProviderError";
		tryNextLink;
		constructor(message, options = true) {
			let logger;
			let tryNextLink = true;
			if (typeof options === "boolean") {
				logger = void 0;
				tryNextLink = options;
			} else if (options != null && typeof options === "object") {
				logger = options.logger;
				tryNextLink = options.tryNextLink ?? true;
			}
			super(message);
			this.tryNextLink = tryNextLink;
			Object.setPrototypeOf(this, ProviderError.prototype);
			logger?.debug?.(`@smithy/property-provider ${tryNextLink ? "->" : "(!)"} ${message}`);
		}
		static from(error, options = true) {
			return Object.assign(new this(error.message, options), error);
		}
	};
	var CredentialsProviderError = class CredentialsProviderError extends ProviderError {
		name = "CredentialsProviderError";
		constructor(message, options = true) {
			super(message, options);
			Object.setPrototypeOf(this, CredentialsProviderError.prototype);
		}
	};
	var TokenProviderError = class TokenProviderError extends ProviderError {
		name = "TokenProviderError";
		constructor(message, options = true) {
			super(message, options);
			Object.setPrototypeOf(this, TokenProviderError.prototype);
		}
	};
	const chain = (...providers) => async () => {
		if (providers.length === 0) throw new ProviderError("No providers in chain");
		let lastProviderError;
		for (const provider of providers) try {
			return await provider();
		} catch (err) {
			lastProviderError = err;
			if (err?.tryNextLink) continue;
			throw err;
		}
		throw lastProviderError;
	};
	const fromStatic = (staticValue) => () => Promise.resolve(staticValue);
	const memoize = (provider, isExpired, requiresRefresh) => {
		let resolved;
		let pending;
		let hasResult;
		let isConstant = false;
		const coalesceProvider = async () => {
			if (!pending) pending = provider();
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
			if (!hasResult || options?.forceRefresh) resolved = await coalesceProvider();
			return resolved;
		};
		return async (options) => {
			if (!hasResult || options?.forceRefresh) resolved = await coalesceProvider();
			if (isConstant) return resolved;
			if (requiresRefresh && !requiresRefresh(resolved)) {
				isConstant = true;
				return resolved;
			}
			if (isExpired(resolved)) {
				await coalesceProvider();
				return resolved;
			}
			return resolved;
		};
	};
	exports.CredentialsProviderError = CredentialsProviderError;
	exports.ProviderError = ProviderError;
	exports.TokenProviderError = TokenProviderError;
	exports.chain = chain;
	exports.fromStatic = fromStatic;
	exports.memoize = memoize;
}));

//#endregion
Object.defineProperty(exports, 'require_dist_cjs', {
  enumerable: true,
  get: function () {
    return require_dist_cjs;
  }
});