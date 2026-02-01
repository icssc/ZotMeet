import { PrismaPgSession } from "./session.js";
import { entityKind } from "../../entity.js";
import { DefaultLogger } from "../../logger.js";
import { PgAsyncDatabase } from "../../pg-core/async/db.js";
import { PgDialect } from "../../pg-core/index.js";
import { Prisma } from "@prisma/client";

//#region src/prisma/pg/driver.ts
var PrismaPgDatabase = class extends PgAsyncDatabase {
	static [entityKind] = "PrismaPgDatabase";
	constructor(client, logger) {
		const dialect = new PgDialect();
		super(dialect, new PrismaPgSession(dialect, client, { logger }), {}, void 0);
	}
};
function drizzle(config = {}) {
	let logger;
	if (config.logger === true) logger = new DefaultLogger();
	else if (config.logger !== false) logger = config.logger;
	return Prisma.defineExtension((client) => {
		return client.$extends({
			name: "drizzle",
			client: { $drizzle: new PrismaPgDatabase(client, logger) }
		});
	});
}

//#endregion
export { PrismaPgDatabase, drizzle };
//# sourceMappingURL=driver.js.map