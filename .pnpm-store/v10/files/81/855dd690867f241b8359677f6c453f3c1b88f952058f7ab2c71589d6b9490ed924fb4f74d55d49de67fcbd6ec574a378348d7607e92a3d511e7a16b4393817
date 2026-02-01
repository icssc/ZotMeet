const require_rolldown_runtime = require('../../_virtual/rolldown_runtime.cjs');
const require_pg_core_query_builders_raw = require('../query-builders/raw.cjs');
let __entity_ts = require("../../entity.cjs");
let __effect_core_query_effect_ts = require("../../effect-core/query-effect.cjs");

//#region src/pg-core/effect/raw.ts
var PgEffectRaw = class extends require_pg_core_query_builders_raw.PgRaw {
	static [__entity_ts.entityKind] = "PgEffectRaw";
	constructor(execute, sql, query, mapBatchResult) {
		super(sql, query, mapBatchResult);
		this.execute = execute;
	}
	_prepare() {
		return this;
	}
};
(0, __effect_core_query_effect_ts.applyEffectWrapper)(PgEffectRaw);

//#endregion
exports.PgEffectRaw = PgEffectRaw;
//# sourceMappingURL=raw.cjs.map