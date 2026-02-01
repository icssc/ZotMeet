const require_rolldown_runtime = require('../../_virtual/rolldown_runtime.cjs');
let __entity_ts = require("../../entity.cjs");
let __sql_sql_ts = require("../../sql/sql.cjs");
let __logger_ts = require("../../logger.cjs");
let __mysql_core_index_ts = require("../../mysql-core/index.cjs");

//#region src/prisma/mysql/session.ts
var PrismaMySqlPreparedQuery = class extends __mysql_core_index_ts.MySqlPreparedQuery {
	iterator(_placeholderValues) {
		throw new Error("Method not implemented.");
	}
	static [__entity_ts.entityKind] = "PrismaMySqlPreparedQuery";
	constructor(prisma, query, logger) {
		super(void 0, void 0, void 0);
		this.prisma = prisma;
		this.query = query;
		this.logger = logger;
	}
	execute(placeholderValues) {
		const params = (0, __sql_sql_ts.fillPlaceholders)(this.query.params, placeholderValues ?? {});
		this.logger.logQuery(this.query.sql, params);
		return this.prisma.$queryRawUnsafe(this.query.sql, ...params);
	}
};
var PrismaMySqlSession = class extends __mysql_core_index_ts.MySqlSession {
	static [__entity_ts.entityKind] = "PrismaMySqlSession";
	logger;
	constructor(dialect, prisma, options) {
		super(dialect);
		this.prisma = prisma;
		this.options = options;
		this.logger = options.logger ?? new __logger_ts.NoopLogger();
	}
	execute(query) {
		return this.prepareQuery(this.dialect.sqlToQuery(query)).execute();
	}
	all(_query) {
		throw new Error("Method not implemented.");
	}
	prepareQuery(query) {
		return new PrismaMySqlPreparedQuery(this.prisma, query, this.logger);
	}
	prepareRelationalQuery() {
		throw new Error("Method not implemented");
	}
	transaction(_transaction, _config) {
		throw new Error("Method not implemented.");
	}
};

//#endregion
exports.PrismaMySqlPreparedQuery = PrismaMySqlPreparedQuery;
exports.PrismaMySqlSession = PrismaMySqlSession;
//# sourceMappingURL=session.cjs.map