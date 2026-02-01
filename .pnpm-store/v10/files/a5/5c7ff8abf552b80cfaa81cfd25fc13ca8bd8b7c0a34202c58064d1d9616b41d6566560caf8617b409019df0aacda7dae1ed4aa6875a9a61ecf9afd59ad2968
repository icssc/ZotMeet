const require_rolldown_runtime = require('../../_virtual/rolldown_runtime.cjs');
let __entity_ts = require("../../entity.cjs");
let __sql_sql_ts = require("../../sql/sql.cjs");

//#region src/cockroach-core/query-builders/count.ts
var CockroachCountBuilder = class CockroachCountBuilder extends __sql_sql_ts.SQL {
	sql;
	token;
	static [__entity_ts.entityKind] = "CockroachCountBuilder";
	[Symbol.toStringTag] = "CockroachCountBuilder";
	session;
	static buildEmbeddedCount(source, filters) {
		return __sql_sql_ts.sql`(select count(*) from ${source}${__sql_sql_ts.sql.raw(" where ").if(filters)}${filters})`;
	}
	static buildCount(source, filters) {
		return __sql_sql_ts.sql`select count(*) as count from ${source}${__sql_sql_ts.sql.raw(" where ").if(filters)}${filters};`;
	}
	constructor(params) {
		super(CockroachCountBuilder.buildEmbeddedCount(params.source, params.filters).queryChunks);
		this.params = params;
		this.mapWith(Number);
		this.session = params.session;
		this.sql = CockroachCountBuilder.buildCount(params.source, params.filters);
	}
	/** @intrnal */
	setToken(token) {
		this.token = token;
		return this;
	}
	then(onfulfilled, onrejected) {
		return Promise.resolve(this.session.count(this.sql, this.token)).then(onfulfilled, onrejected);
	}
	catch(onRejected) {
		return this.then(void 0, onRejected);
	}
	finally(onFinally) {
		return this.then((value) => {
			onFinally?.();
			return value;
		}, (reason) => {
			onFinally?.();
			throw reason;
		});
	}
};

//#endregion
exports.CockroachCountBuilder = CockroachCountBuilder;
//# sourceMappingURL=count.cjs.map