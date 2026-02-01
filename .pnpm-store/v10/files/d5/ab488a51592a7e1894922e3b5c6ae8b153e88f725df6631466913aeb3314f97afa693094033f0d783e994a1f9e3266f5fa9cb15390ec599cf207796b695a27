const require_rolldown_runtime = require('../../_virtual/rolldown_runtime.cjs');
const require_pg_core_query_builders_query = require('../query-builders/query.cjs');
let __entity_ts = require("../../entity.cjs");
let __tracing_ts = require("../../tracing.cjs");
let __relations_ts = require("../../relations.cjs");
let __effect_core_query_effect_ts = require("../../effect-core/query-effect.cjs");

//#region src/pg-core/effect/query.ts
var PgEffectRelationalQuery = class extends require_pg_core_query_builders_query.PgRelationalQuery {
	static [__entity_ts.entityKind] = "PgEffectRelationalQueryV2";
	/** @internal */
	_prepare(name) {
		return __tracing_ts.tracer.startActiveSpan("drizzle.prepareQuery", () => {
			const { query, builtQuery } = this._toSQL();
			return this.session.prepareRelationalQuery(builtQuery, void 0, name, (rawRows, mapColumnValue) => {
				const rows = rawRows.map((row) => (0, __relations_ts.mapRelationalRow)(row, query.selection, mapColumnValue, this.parseJson));
				if (this.mode === "first") return rows[0];
				return rows;
			});
		});
	}
	prepare(name) {
		return this._prepare(name);
	}
	execute(placeholderValues) {
		return this._prepare().execute(placeholderValues);
	}
};
(0, __effect_core_query_effect_ts.applyEffectWrapper)(PgEffectRelationalQuery);

//#endregion
exports.PgEffectRelationalQuery = PgEffectRelationalQuery;
//# sourceMappingURL=query.cjs.map