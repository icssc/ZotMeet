import { PrismaMySqlSession } from "./session.js";
import { entityKind } from "../../entity.js";
import { DefaultLogger } from "../../logger.js";
import { Prisma } from "@prisma/client";
import { MySqlDatabase, MySqlDialect } from "../../mysql-core/index.js";

//#region src/prisma/mysql/driver.ts
var PrismaMySqlDatabase = class extends MySqlDatabase {
	static [entityKind] = "PrismaMySqlDatabase";
	constructor(client, logger) {
		const dialect = new MySqlDialect();
		super(dialect, new PrismaMySqlSession(dialect, client, { logger }), {}, void 0, "default");
	}
};
function drizzle(config = {}) {
	let logger;
	if (config.logger === true) logger = new DefaultLogger();
	else if (config.logger !== false) logger = config.logger;
	return Prisma.defineExtension((client) => {
		return client.$extends({
			name: "drizzle",
			client: { $drizzle: new PrismaMySqlDatabase(client, logger) }
		});
	});
}

//#endregion
export { PrismaMySqlDatabase, drizzle };
//# sourceMappingURL=driver.js.map