const require_rolldown_runtime = require('../_virtual/rolldown_runtime.cjs');
let __migrator_ts = require("../migrator.cjs");

//#region src/better-sqlite3/migrator.ts
function migrate(db, config) {
	const migrations = (0, __migrator_ts.readMigrationFiles)(config);
	return db.dialect.migrate(migrations, db.session, config);
}

//#endregion
exports.migrate = migrate;
//# sourceMappingURL=migrator.cjs.map