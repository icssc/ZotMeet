import { entityKind } from "../entity.js";
import { applyMixins } from "../utils.js";
import { Effect } from "effect";

//#region src/effect-core/query-effect.ts
var QueryEffect = class {
	static [entityKind] = "EffectWrapper";
	_effect;
	get effect() {
		this._effect = Effect.suspend(() => this.execute());
		Object.defineProperty(this, "effect", {
			value: this._effect,
			writable: false,
			configurable: false
		});
		return this._effect;
	}
	_pipe;
	get pipe() {
		this._pipe = (...args) => {
			return this.effect.pipe(...args);
		};
		Object.defineProperty(this, "pipe", {
			value: this._pipe,
			writable: false,
			configurable: false
		});
		return this._pipe;
	}
	get [Effect.EffectTypeId]() {
		return this.effect[Effect.EffectTypeId];
	}
	[Symbol.iterator]() {
		return this.effect[Symbol.iterator]();
	}
};
function applyEffectWrapper(baseClass) {
	applyMixins(baseClass, [QueryEffect]);
	Object.defineProperty(baseClass.prototype, Symbol.iterator, Object.getOwnPropertyDescriptor(QueryEffect.prototype, Symbol.iterator));
	Object.defineProperty(baseClass.prototype, Effect.EffectTypeId, Object.getOwnPropertyDescriptor(QueryEffect.prototype, Effect.EffectTypeId));
}

//#endregion
export { QueryEffect, applyEffectWrapper };
//# sourceMappingURL=query-effect.js.map