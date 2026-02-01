import { NoopCache } from "./cache.js";
import { entityKind } from "../../entity.js";
import { Effect } from "effect";

//#region src/cache/core/cache-effect.ts
var EffectCache = class {
	static [entityKind] = "EffectCache";
	constructor(wrapped) {
		this.wrapped = wrapped;
	}
	strategy = () => this.wrapped.strategy();
	get(key, tables, isTag, isAutoInvalidate) {
		return Effect.tryPromise(() => this.wrapped.get(key, tables, isTag, isAutoInvalidate));
	}
	put(hashedQuery, response, tables, isTag, config) {
		return Effect.tryPromise(() => this.wrapped.put(hashedQuery, response, tables, isTag, config));
	}
	onMutate(params) {
		return Effect.tryPromise(() => this.wrapped.onMutate(params));
	}
};
const EffectNoopCache = new EffectCache(new NoopCache());

//#endregion
export { EffectCache, EffectNoopCache };
//# sourceMappingURL=cache-effect.js.map