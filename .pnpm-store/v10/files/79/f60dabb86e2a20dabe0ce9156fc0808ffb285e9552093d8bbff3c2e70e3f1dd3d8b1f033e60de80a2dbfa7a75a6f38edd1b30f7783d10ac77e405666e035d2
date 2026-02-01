const require_rolldown_runtime = require('../_virtual/rolldown_runtime.cjs');
const require_tursodatabase_driver_core = require('./driver-core.cjs');
let _tursodatabase_database_wasm = require("@tursodatabase/database-wasm");

//#region src/tursodatabase/wasm.ts
function drizzle(...params) {
	if (typeof params[0] === "string") return require_tursodatabase_driver_core.construct(new _tursodatabase_database_wasm.Database(params[0]), params[1]);
	const { connection, client, ...drizzleConfig } = params[0];
	if (client) return require_tursodatabase_driver_core.construct(client, drizzleConfig);
	return require_tursodatabase_driver_core.construct(typeof connection === "string" ? new _tursodatabase_database_wasm.Database(connection) : new _tursodatabase_database_wasm.Database(connection.path, connection), drizzleConfig);
}
(function(_drizzle) {
	function mock(config) {
		return require_tursodatabase_driver_core.construct({}, config);
	}
	_drizzle.mock = mock;
})(drizzle || (drizzle = {}));

//#endregion
Object.defineProperty(exports, 'drizzle', {
  enumerable: true,
  get: function () {
    return drizzle;
  }
});
//# sourceMappingURL=wasm.cjs.map