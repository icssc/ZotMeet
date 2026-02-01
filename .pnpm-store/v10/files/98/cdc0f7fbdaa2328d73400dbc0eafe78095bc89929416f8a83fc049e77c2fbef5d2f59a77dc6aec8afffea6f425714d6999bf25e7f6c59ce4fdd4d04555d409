const require_rolldown_runtime = require('../../_virtual/rolldown_runtime.cjs');
const require_pg_core_utils = require('../utils.cjs');
const require_pg_core_query_builders_insert = require('../query-builders/insert.cjs');
let __entity_ts = require("../../entity.cjs");
let __tracing_ts = require("../../tracing.cjs");
let __effect_core_query_effect_ts = require("../../effect-core/query-effect.cjs");

//#region src/pg-core/effect/insert.ts
var PgEffectInsertBase = class extends require_pg_core_query_builders_insert.PgInsertBase {
	static [__entity_ts.entityKind] = "PgEffectInsert";
	/** @internal */
	_prepare(name) {
		return this.session.prepareQuery(this.dialect.sqlToQuery(this.getSQL()), this.config.returning, name, true, void 0, {
			type: "insert",
			tables: require_pg_core_utils.extractUsedTable(this.config.table)
		}, this.cacheConfig);
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
(0, __effect_core_query_effect_ts.applyEffectWrapper)(PgEffectInsertBase);

//#endregion
exports.PgEffectInsertBase = PgEffectInsertBase;
//# sourceMappingURL=insert.cjs.map