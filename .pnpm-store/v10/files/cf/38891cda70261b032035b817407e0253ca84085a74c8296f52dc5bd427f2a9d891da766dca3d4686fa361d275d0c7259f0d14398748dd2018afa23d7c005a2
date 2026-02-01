import { PrismaSQLiteSession } from "./session.js";
import { DefaultLogger } from "../../logger.js";
import { BaseSQLiteDatabase, SQLiteAsyncDialect } from "../../sqlite-core/index.js";
import { Prisma } from "@prisma/client";

//#region src/prisma/sqlite/driver.ts
function drizzle(config = {}) {
	const dialect = new SQLiteAsyncDialect();
	let logger;
	if (config.logger === true) logger = new DefaultLogger();
	else if (config.logger !== false) logger = config.logger;
	return Prisma.defineExtension((client) => {
		const session = new PrismaSQLiteSession(client, dialect, { logger });
		return client.$extends({
			name: "drizzle",
			client: { $drizzle: new BaseSQLiteDatabase("async", dialect, session, {}, void 0) }
		});
	});
}

//#endregion
export { drizzle };
//# sourceMappingURL=driver.js.map