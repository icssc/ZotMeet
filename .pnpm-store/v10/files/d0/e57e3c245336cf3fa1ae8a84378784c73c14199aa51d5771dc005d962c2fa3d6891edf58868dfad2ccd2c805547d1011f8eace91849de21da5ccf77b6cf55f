const require_rolldown_runtime = require('../../_virtual/rolldown_runtime.cjs');
const require_pg_core_utils = require('../utils.cjs');
const require_pg_core_query_builders_update = require('../query-builders/update.cjs');
let __entity_ts = require("../../entity.cjs");
let __utils_ts = require("../../utils.cjs");
let __query_promise_ts = require("../../query-promise.cjs");

//#region src/pg-core/async/update.ts
var PgAsyncUpdateBase = class extends require_pg_core_query_builders_update.PgUpdateBase {
	static [__entity_ts.entityKind] = "PgAsyncUpdate";
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
(0, __utils_ts.applyMixins)(PgAsyncUpdateBase, [__query_promise_ts.QueryPromise]);

//#endregion
exports.PgAsyncUpdateBase = PgAsyncUpdateBase;
//# sourceMappingURL=update.cjs.map