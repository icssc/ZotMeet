const require_rolldown_runtime = require('../../_virtual/rolldown_runtime.cjs');
const require_prisma_pg_session = require('./session.cjs');
let __entity_ts = require("../../entity.cjs");
let __logger_ts = require("../../logger.cjs");
let __pg_core_async_db_ts = require("../../pg-core/async/db.cjs");
let __pg_core_index_ts = require("../../pg-core/index.cjs");
let _prisma_client = require("@prisma/client");

//#region src/prisma/pg/driver.ts
var PrismaPgDatabase = class extends __pg_core_async_db_ts.PgAsyncDatabase {
	static [__entity_ts.entityKind] = "PrismaPgDatabase";
	constructor(client, logger) {
		const dialect = new __pg_core_index_ts.PgDialect();
		super(dialect, new require_prisma_pg_session.PrismaPgSession(dialect, client, { logger }), {}, void 0);
	}
};
function drizzle(config = {}) {
	let logger;
	if (config.logger === true) logger = new __logger_ts.DefaultLogger();
	else if (config.logger !== false) logger = config.logger;
	return _prisma_client.Prisma.defineExtension((client) => {
		return client.$extends({
			name: "drizzle",
			client: { $drizzle: new PrismaPgDatabase(client, logger) }
		});
	});
}

//#endregion
exports.PrismaPgDatabase = PrismaPgDatabase;
exports.drizzle = drizzle;
//# sourceMappingURL=driver.cjs.map