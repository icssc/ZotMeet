const require_rolldown_runtime = require('../../_virtual/rolldown_runtime.cjs');
let __entity_ts = require("../../entity.cjs");
let __sql_sql_ts = require("../../sql/sql.cjs");

//#region src/mysql-core/query-builders/count.ts
var MySqlCountBuilder = class MySqlCountBuilder extends __sql_sql_ts.SQL {
	sql;
	static [__entity_ts.entityKind] = "MySqlCountBuilder";
	[Symbol.toStringTag] = "MySqlCountBuilder";
	session;
	static buildEmbeddedCount(source, filters) {
		return __sql_sql_ts.sql`(select count(*) from ${source}${__sql_sql_ts.sql.raw(" where ").if(filters)}${filters})`;
	}
	static buildCount(source, filters) {
		return __sql_sql_ts.sql`select count(*) as count from ${source}${__sql_sql_ts.sql.raw(" where ").if(filters)}${filters}`;
	}
	constructor(params) {
		super(MySqlCountBuilder.buildEmbeddedCount(params.source, params.filters).queryChunks);
		this.params = params;
		this.mapWith(Number);
		this.session = params.session;
		this.sql = MySqlCountBuilder.buildCount(params.source, params.filters);
	}
	then(onfulfilled, onrejected) {
		return Promise.resolve(this.session.count(this.sql)).then(onfulfilled, onrejected);
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
exports.MySqlCountBuilder = MySqlCountBuilder;
//# sourceMappingURL=count.cjs.map