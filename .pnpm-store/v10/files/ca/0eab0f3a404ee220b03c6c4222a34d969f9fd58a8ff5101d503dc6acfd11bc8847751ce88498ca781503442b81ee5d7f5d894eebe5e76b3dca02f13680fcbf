const require_rolldown_runtime = require('../_virtual/rolldown_runtime.cjs');
let __entity_ts = require("../entity.cjs");
let __utils_ts = require("../utils.cjs");
let effect = require("effect");

//#region src/effect-core/query-effect.ts
var QueryEffect = class {
	static [__entity_ts.entityKind] = "EffectWrapper";
	_effect;
	get effect() {
		this._effect = effect.Effect.suspend(() => this.execute());
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
	get [effect.Effect.EffectTypeId]() {
		return this.effect[effect.Effect.EffectTypeId];
	}
	[Symbol.iterator]() {
		return this.effect[Symbol.iterator]();
	}
};
function applyEffectWrapper(baseClass) {
	(0, __utils_ts.applyMixins)(baseClass, [QueryEffect]);
	Object.defineProperty(baseClass.prototype, Symbol.iterator, Object.getOwnPropertyDescriptor(QueryEffect.prototype, Symbol.iterator));
	Object.defineProperty(baseClass.prototype, effect.Effect.EffectTypeId, Object.getOwnPropertyDescriptor(QueryEffect.prototype, effect.Effect.EffectTypeId));
}

//#endregion
exports.QueryEffect = QueryEffect;
exports.applyEffectWrapper = applyEffectWrapper;
//# sourceMappingURL=query-effect.cjs.map