const require_rolldown_runtime = require('../_virtual/rolldown_runtime.cjs');
let __pg_core_async_session_ts = require("../pg-core/async/session.cjs");
let __migrator_ts = require("../migrator.cjs");

//#region src/neon-serverless/migrator.ts
async function migrate(db, config) {
	return await (0, __pg_core_async_session_ts.migrate)((0, __migrator_ts.readMigrationFiles)(config), db.session, config);
}

//#endregion
exports.migrate = migrate;
//# sourceMappingURL=migrator.cjs.map