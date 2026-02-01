import { migrate as migrate$1 } from "../pg-core/async/session.js";
import { readMigrationFiles } from "../migrator.js";

//#region src/vercel-postgres/migrator.ts
async function migrate(db, config) {
	return await migrate$1(readMigrationFiles(config), db.session, config);
}

//#endregion
export { migrate };
//# sourceMappingURL=migrator.js.map