import { entityKind } from "../../entity.js";
import { fillPlaceholders } from "../../sql/sql.js";
import { NoopLogger } from "../../logger.js";
import { PgAsyncPreparedQuery, PgAsyncSession } from "../../pg-core/async/session.js";

//#region src/prisma/pg/session.ts
var PrismaPgPreparedQuery = class extends PgAsyncPreparedQuery {
	static [entityKind] = "PrismaPgPreparedQuery";
	constructor(prisma, query, logger) {
		super(query, void 0, void 0, void 0);
		this.prisma = prisma;
		this.logger = logger;
	}
	execute(placeholderValues) {
		const params = fillPlaceholders(this.query.params, placeholderValues ?? {});
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
var PrismaPgSession = class extends PgAsyncSession {
	static [entityKind] = "PrismaPgSession";
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
export { PrismaPgPreparedQuery, PrismaPgSession };
//# sourceMappingURL=session.js.map