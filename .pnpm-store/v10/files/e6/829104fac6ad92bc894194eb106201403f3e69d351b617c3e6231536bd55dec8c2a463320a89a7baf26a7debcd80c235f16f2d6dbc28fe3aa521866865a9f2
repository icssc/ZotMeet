const require_rolldown_runtime = require('../../_virtual/rolldown_runtime.cjs');
const require_pg_core_utils = require('../utils.cjs');
const require_pg_core_query_builders_update = require('../query-builders/update.cjs');
let __entity_ts = require("../../entity.cjs");
let __effect_core_query_effect_ts = require("../../effect-core/query-effect.cjs");

//#region src/pg-core/effect/update.ts
var PgEffectUpdateBase = class extends require_pg_core_query_builders_update.PgUpdateBase {
	static [__entity_ts.entityKind] = "PgEffectUpdate";
	/** @internal */
	_prepare(name) {
		const query = this.session.prepareQuery(this.dialect.sqlToQuery(this.getSQL()), this.config.returning, name, true, void 0, {
			type: "insert",
			tables: require_pg_core_utils.extractUsedTable(this.config.table)
		}, this.cacheConfig);
		query.joinsNotNullableMap = this.joinsNotNullableMap;
		return query;
	}
	prepare(name) {
		return this._prepare(name);
	}
	execute = (placeholderValues = {}) => {
		return this._prepare().execute(placeholderValues);
	};
};
(0, __effect_core_query_effect_ts.applyEffectWrapper)(PgEffectUpdateBase);

//#endregion
exports.PgEffectUpdateBase = PgEffectUpdateBase;
//# sourceMappingURL=update.cjs.map