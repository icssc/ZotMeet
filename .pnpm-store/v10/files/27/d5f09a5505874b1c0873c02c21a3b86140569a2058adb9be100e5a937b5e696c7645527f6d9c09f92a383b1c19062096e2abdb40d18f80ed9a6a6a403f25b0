const require_rolldown_runtime = require('../../_virtual/rolldown_runtime.cjs');
let __entity_ts = require("../../entity.cjs");
let __sql_sql_ts = require("../../sql/sql.cjs");
let __logger_ts = require("../../logger.cjs");
let __sqlite_core_index_ts = require("../../sqlite-core/index.cjs");

//#region src/prisma/sqlite/session.ts
var PrismaSQLitePreparedQuery = class extends __sqlite_core_index_ts.SQLitePreparedQuery {
	static [__entity_ts.entityKind] = "PrismaSQLitePreparedQuery";
	constructor(prisma, query, logger, executeMethod) {
		super("async", executeMethod, query);
		this.prisma = prisma;
		this.logger = logger;
	}
	all(placeholderValues) {
		const params = (0, __sql_sql_ts.fillPlaceholders)(this.query.params, placeholderValues ?? {});
		this.logger.logQuery(this.query.sql, params);
		return this.prisma.$queryRawUnsafe(this.query.sql, ...params);
	}
	async run(placeholderValues) {
		await this.all(placeholderValues);
		return [];
	}
	async get(placeholderValues) {
		return (await this.all(placeholderValues))[0];
	}
	values(_placeholderValues) {
		throw new Error("Method not implemented.");
	}
	isResponseInArrayMode() {
		return false;
	}
};
var PrismaSQLiteSession = class extends __sqlite_core_index_ts.SQLiteSession {
	static [__entity_ts.entityKind] = "PrismaSQLiteSession";
	logger;
	constructor(prisma, dialect, options) {
		super(dialect);
		this.prisma = prisma;
		this.logger = options.logger ?? new __logger_ts.NoopLogger();
	}
	prepareQuery(query, fields, executeMethod) {
		return new PrismaSQLitePreparedQuery(this.prisma, query, this.logger, executeMethod);
	}
	prepareRelationalQuery() {
		throw new Error("Method not implemented.");
	}
	transaction(_transaction, _config) {
		throw new Error("Method not implemented.");
	}
};

//#endregion
exports.PrismaSQLitePreparedQuery = PrismaSQLitePreparedQuery;
exports.PrismaSQLiteSession = PrismaSQLiteSession;
//# sourceMappingURL=session.cjs.map