const require_rolldown_runtime = require('../../_virtual/rolldown_runtime.cjs');
const require_pg_core_utils = require('../utils.cjs');
const require_pg_core_query_builders_delete = require('../query-builders/delete.cjs');
let __entity_ts = require("../../entity.cjs");
let __tracing_ts = require("../../tracing.cjs");
let __utils_ts = require("../../utils.cjs");
let __query_promise_ts = require("../../query-promise.cjs");

//#region src/pg-core/async/delete.ts
var PgAsyncDeleteBase = class extends require_pg_core_query_builders_delete.PgDeleteBase {
	static [__entity_ts.entityKind] = "PgAsyncDelete";
	/** @internal */
	_prepare(name) {
		return __tracing_ts.tracer.startActiveSpan("drizzle.prepareQuery", () => {
			return this.session.prepareQuery(this.dialect.sqlToQuery(this.getSQL()), this.config.returning, name, true, void 0, {
				type: "delete",
				tables: require_pg_core_utils.extractUsedTable(this.config.table)
			}, this.cacheConfig).setToken(this.authToken);
		});
	}
	prepare(name) {
		return this._prepare(name);
	}
	/** @internal */
	authToken;
	/** @internal */
	setToken(token) {
		this.authToken = token;
		return this;
	}
	execute = (placeholderValues) => {
		return __tracing_ts.tracer.startActiveSpan("drizzle.operation", () => {
			return this._prepare().execute(placeholderValues);
		});
	};
};
(0, __utils_ts.applyMixins)(PgAsyncDeleteBase, [__query_promise_ts.QueryPromise]);

//#endregion
exports.PgAsyncDeleteBase = PgAsyncDeleteBase;
//# sourceMappingURL=delete.cjs.map