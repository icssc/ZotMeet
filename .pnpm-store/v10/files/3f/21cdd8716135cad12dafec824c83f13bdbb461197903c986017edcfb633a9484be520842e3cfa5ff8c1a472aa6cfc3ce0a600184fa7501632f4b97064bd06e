const require_rolldown_runtime = require('../../_virtual/rolldown_runtime.cjs');
const require_pg_core_query_builders_count = require('../query-builders/count.cjs');
let __entity_ts = require("../../entity.cjs");
let __utils_ts = require("../../utils.cjs");
let __query_promise_ts = require("../../query-promise.cjs");

//#region src/pg-core/async/count.ts
var PgAsyncCountBuilder = class extends require_pg_core_query_builders_count.PgCountBuilder {
	static [__entity_ts.entityKind] = "PgAsyncCountBuilder";
	session;
	constructor({ source, dialect, filters, session }) {
		super({
			source,
			dialect,
			filters
		});
		this.session = session;
	}
	/** @internal */
	authToken;
	/** @internal */
	setToken(token) {
		this.authToken = token;
		return this;
	}
	execute(placeholderValues) {
		return this.session.prepareQuery(this.build(), void 0, void 0, true, (rows) => {
			const v = rows[0]?.[0];
			if (typeof v === "number") return v;
			return v ? Number(v) : 0;
		}).setToken(this.authToken).execute(placeholderValues);
	}
};
(0, __utils_ts.applyMixins)(PgAsyncCountBuilder, [__query_promise_ts.QueryPromise]);

//#endregion
exports.PgAsyncCountBuilder = PgAsyncCountBuilder;
//# sourceMappingURL=count.cjs.map