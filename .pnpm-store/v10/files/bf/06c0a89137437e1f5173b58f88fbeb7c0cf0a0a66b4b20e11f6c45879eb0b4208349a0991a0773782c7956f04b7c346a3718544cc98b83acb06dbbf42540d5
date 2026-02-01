const require_rolldown_runtime = require('../../_virtual/rolldown_runtime.cjs');
const require_cache_core_cache = require('./cache.cjs');
let __entity_ts = require("../../entity.cjs");
let effect = require("effect");

//#region src/cache/core/cache-effect.ts
var EffectCache = class {
	static [__entity_ts.entityKind] = "EffectCache";
	constructor(wrapped) {
		this.wrapped = wrapped;
	}
	strategy = () => this.wrapped.strategy();
	get(key, tables, isTag, isAutoInvalidate) {
		return effect.Effect.tryPromise(() => this.wrapped.get(key, tables, isTag, isAutoInvalidate));
	}
	put(hashedQuery, response, tables, isTag, config) {
		return effect.Effect.tryPromise(() => this.wrapped.put(hashedQuery, response, tables, isTag, config));
	}
	onMutate(params) {
		return effect.Effect.tryPromise(() => this.wrapped.onMutate(params));
	}
};
const EffectNoopCache = new EffectCache(new require_cache_core_cache.NoopCache());

//#endregion
exports.EffectCache = EffectCache;
exports.EffectNoopCache = EffectNoopCache;
//# sourceMappingURL=cache-effect.cjs.map