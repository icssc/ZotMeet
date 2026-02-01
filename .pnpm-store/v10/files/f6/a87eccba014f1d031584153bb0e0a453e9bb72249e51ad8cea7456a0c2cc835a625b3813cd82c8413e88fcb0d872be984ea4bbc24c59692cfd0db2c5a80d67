const require_rolldown_runtime = require('../../_virtual/rolldown_runtime.cjs');
let __entity_ts = require("../../entity.cjs");
let __sql_sql_ts = require("../../sql/sql.cjs");

//#region src/pg-core/query-builders/count.ts
var PgCountBuilder = class PgCountBuilder extends __sql_sql_ts.SQL {
	static [__entity_ts.entityKind] = "PgCountBuilder";
	dialect;
	static buildEmbeddedCount(source, filters, parens) {
		const query = __sql_sql_ts.sql`select count(*) from ${source}${__sql_sql_ts.sql` where ${filters}`.if(filters)}`;
		return parens ? __sql_sql_ts.sql`(${query})` : query;
	}
	constructor(countConfig) {
		super(PgCountBuilder.buildEmbeddedCount(countConfig.source, countConfig.filters, true).queryChunks);
		this.countConfig = countConfig;
		this.dialect = countConfig.dialect;
		this.mapWith((e) => {
			if (typeof e === "number") return e;
			return Number(e ?? 0);
		});
	}
	build() {
		const { filters, source } = this.countConfig;
		const query = PgCountBuilder.buildEmbeddedCount(source, filters);
		return this.dialect.sqlToQuery(query);
	}
};

//#endregion
exports.PgCountBuilder = PgCountBuilder;
//# sourceMappingURL=count.cjs.map