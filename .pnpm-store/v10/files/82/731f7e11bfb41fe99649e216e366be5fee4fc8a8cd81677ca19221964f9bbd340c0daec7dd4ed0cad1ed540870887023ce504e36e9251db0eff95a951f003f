import { entityKind } from "../../entity.js";
import { fillPlaceholders } from "../../sql/sql.js";
import { NoopLogger } from "../../logger.js";
import { MySqlPreparedQuery, MySqlSession } from "../../mysql-core/index.js";

//#region src/prisma/mysql/session.ts
var PrismaMySqlPreparedQuery = class extends MySqlPreparedQuery {
	iterator(_placeholderValues) {
		throw new Error("Method not implemented.");
	}
	static [entityKind] = "PrismaMySqlPreparedQuery";
	constructor(prisma, query, logger) {
		super(void 0, void 0, void 0);
		this.prisma = prisma;
		this.query = query;
		this.logger = logger;
	}
	execute(placeholderValues) {
		const params = fillPlaceholders(this.query.params, placeholderValues ?? {});
		this.logger.logQuery(this.query.sql, params);
		return this.prisma.$queryRawUnsafe(this.query.sql, ...params);
	}
};
var PrismaMySqlSession = class extends MySqlSession {
	static [entityKind] = "PrismaMySqlSession";
	logger;
	constructor(dialect, prisma, options) {
		super(dialect);
		this.prisma = prisma;
		this.options = options;
		this.logger = options.logger ?? new NoopLogger();
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
export { PrismaMySqlPreparedQuery, PrismaMySqlSession };
//# sourceMappingURL=session.js.map