const require_rolldown_runtime = require('../../_virtual/rolldown_runtime.cjs');
const require_prisma_sqlite_session = require('./session.cjs');
let __logger_ts = require("../../logger.cjs");
let __sqlite_core_index_ts = require("../../sqlite-core/index.cjs");
let _prisma_client = require("@prisma/client");

//#region src/prisma/sqlite/driver.ts
function drizzle(config = {}) {
	const dialect = new __sqlite_core_index_ts.SQLiteAsyncDialect();
	let logger;
	if (config.logger === true) logger = new __logger_ts.DefaultLogger();
	else if (config.logger !== false) logger = config.logger;
	return _prisma_client.Prisma.defineExtension((client) => {
		const session = new require_prisma_sqlite_session.PrismaSQLiteSession(client, dialect, { logger });
		return client.$extends({
			name: "drizzle",
			client: { $drizzle: new __sqlite_core_index_ts.BaseSQLiteDatabase("async", dialect, session, {}, void 0) }
		});
	});
}

//#endregion
exports.drizzle = drizzle;
//# sourceMappingURL=driver.cjs.map