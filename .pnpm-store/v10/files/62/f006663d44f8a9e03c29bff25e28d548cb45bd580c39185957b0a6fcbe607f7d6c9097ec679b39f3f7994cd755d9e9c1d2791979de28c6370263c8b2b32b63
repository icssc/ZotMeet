const require_rolldown_runtime = require('../../_virtual/rolldown_runtime.cjs');
const require_pg_core_utils = require('../utils.cjs');
const require_pg_core_query_builders_delete = require('../query-builders/delete.cjs');
let __entity_ts = require("../../entity.cjs");
let __tracing_ts = require("../../tracing.cjs");
let __effect_core_query_effect_ts = require("../../effect-core/query-effect.cjs");

//#region src/pg-core/effect/delete.ts
var PgEffectDeleteBase = class extends require_pg_core_query_builders_delete.PgDeleteBase {
	static [__entity_ts.entityKind] = "PgEffectDelete";
	/** @internal */
	_prepare(name) {
		return __tracing_ts.tracer.startActiveSpan("drizzle.prepareQuery", () => {
			return this.session.prepareQuery(this.dialect.sqlToQuery(this.getSQL()), this.config.returning, name, true, void 0, {
				type: "delete",
				tables: require_pg_core_utils.extractUsedTable(this.config.table)
			}, this.cacheConfig);
		});
	}
	prepare(name) {
		return this._prepare(name);
	}
	execute = (placeholderValues) => {
		return __tracing_ts.tracer.startActiveSpan("drizzle.operation", () => {
			return this._prepare().execute(placeholderValues);
		});
	};
};
(0, __effect_core_query_effect_ts.applyEffectWrapper)(PgEffectDeleteBase);

//#endregion
exports.PgEffectDeleteBase = PgEffectDeleteBase;
//# sourceMappingURL=delete.cjs.map