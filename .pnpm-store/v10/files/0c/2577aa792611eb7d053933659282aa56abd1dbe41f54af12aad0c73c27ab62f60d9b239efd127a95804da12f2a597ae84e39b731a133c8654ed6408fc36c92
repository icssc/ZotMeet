const require_rolldown_runtime = require('../../_virtual/rolldown_runtime.cjs');
let __entity_ts = require("../../entity.cjs");
let __sql_sql_ts = require("../../sql/sql.cjs");
let __logger_ts = require("../../logger.cjs");
let __pg_core_async_session_ts = require("../../pg-core/async/session.cjs");

//#region src/prisma/pg/session.ts
var PrismaPgPreparedQuery = class extends __pg_core_async_session_ts.PgAsyncPreparedQuery {
	static [__entity_ts.entityKind] = "PrismaPgPreparedQuery";
	constructor(prisma, query, logger) {
		super(query, void 0, void 0, void 0);
		this.prisma = prisma;
		this.logger = logger;
	}
	execute(placeholderValues) {
		const params = (0, __sql_sql_ts.fillPlaceholders)(this.query.params, placeholderValues ?? {});
		this.logger.logQuery(this.query.sql, params);
		return this.prisma.$queryRawUnsafe(this.query.sql, ...params);
	}
	all() {
		throw new Error("Method not implemented.");
	}
	isResponseInArrayMode() {
		return false;
	}
};
var PrismaPgSession = class extends __pg_core_async_session_ts.PgAsyncSession {
	static [__entity_ts.entityKind] = "PrismaPgSession";
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
	prepareQuery(query) {
		return new PrismaPgPreparedQuery(this.prisma, query, this.logger);
	}
	prepareRelationalQuery() {
		throw new Error("Method not implemented.");
	}
	transaction(_transaction, _config) {
		throw new Error("Method not implemented.");
	}
};

//#endregion
exports.PrismaPgPreparedQuery = PrismaPgPreparedQuery;
exports.PrismaPgSession = PrismaPgSession;
//# sourceMappingURL=session.cjs.map