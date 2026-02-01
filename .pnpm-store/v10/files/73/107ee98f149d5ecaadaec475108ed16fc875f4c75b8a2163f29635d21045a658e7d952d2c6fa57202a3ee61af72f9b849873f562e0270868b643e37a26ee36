import { entityKind } from "../../entity.js";
import { fillPlaceholders } from "../../sql/sql.js";
import { NoopLogger } from "../../logger.js";
import { SQLitePreparedQuery, SQLiteSession } from "../../sqlite-core/index.js";

//#region src/prisma/sqlite/session.ts
var PrismaSQLitePreparedQuery = class extends SQLitePreparedQuery {
	static [entityKind] = "PrismaSQLitePreparedQuery";
	constructor(prisma, query, logger, executeMethod) {
		super("async", executeMethod, query);
		this.prisma = prisma;
		this.logger = logger;
	}
	all(placeholderValues) {
		const params = fillPlaceholders(this.query.params, placeholderValues ?? {});
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
var PrismaSQLiteSession = class extends SQLiteSession {
	static [entityKind] = "PrismaSQLiteSession";
	logger;
	constructor(prisma, dialect, options) {
		super(dialect);
		this.prisma = prisma;
		this.logger = options.logger ?? new NoopLogger();
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
export { PrismaSQLitePreparedQuery, PrismaSQLiteSession };
//# sourceMappingURL=session.js.map