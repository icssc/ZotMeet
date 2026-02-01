const require_rolldown_runtime = require('../../_virtual/rolldown_runtime.cjs');
const require_pg_core_query_builders_refresh_materialized_view = require('../query-builders/refresh-materialized-view.cjs');
let __entity_ts = require("../../entity.cjs");
let __tracing_ts = require("../../tracing.cjs");
let __effect_core_query_effect_ts = require("../../effect-core/query-effect.cjs");

//#region src/pg-core/effect/refresh-materialized-view.ts
var PgEffectRefreshMaterializedView = class extends require_pg_core_query_builders_refresh_materialized_view.PgRefreshMaterializedView {
	static [__entity_ts.entityKind] = "PgEffectRefreshMaterializedView";
	/** @internal */
	_prepare(name) {
		return __tracing_ts.tracer.startActiveSpan("drizzle.prepareQuery", () => {
			return this.session.prepareQuery(this.dialect.sqlToQuery(this.getSQL()), void 0, name, true);
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
(0, __effect_core_query_effect_ts.applyEffectWrapper)(PgEffectRefreshMaterializedView);

//#endregion
exports.PgEffectRefreshMaterializedView = PgEffectRefreshMaterializedView;
//# sourceMappingURL=refresh-materialized-view.cjs.map