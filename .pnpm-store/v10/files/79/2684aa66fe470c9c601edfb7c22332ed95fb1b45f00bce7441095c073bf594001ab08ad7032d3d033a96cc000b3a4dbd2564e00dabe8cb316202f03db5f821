const require_rolldown_runtime = require('../../_virtual/rolldown_runtime.cjs');
let __entity_ts = require("../../entity.cjs");
let __sql_sql_ts = require("../../sql/sql.cjs");

//#region src/sqlite-core/query-builders/count.ts
var SQLiteCountBuilder = class SQLiteCountBuilder extends __sql_sql_ts.SQL {
	sql;
	static [__entity_ts.entityKind] = "SQLiteCountBuilderAsync";
	[Symbol.toStringTag] = "SQLiteCountBuilderAsync";
	session;
	static buildEmbeddedCount(source, filters) {
		return __sql_sql_ts.sql`(select count(*) from ${source}${__sql_sql_ts.sql.raw(" where ").if(filters)}${filters})`;
	}
	static buildCount(source, filters) {
		return __sql_sql_ts.sql`select count(*) from ${source}${__sql_sql_ts.sql.raw(" where ").if(filters)}${filters}`;
	}
	constructor(params) {
		super(SQLiteCountBuilder.buildEmbeddedCount(params.source, params.filters).queryChunks);
		this.params = params;
		this.session = params.session;
		this.sql = SQLiteCountBuilder.buildCount(params.source, params.filters);
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
exports.SQLiteCountBuilder = SQLiteCountBuilder;
//# sourceMappingURL=count.cjs.map