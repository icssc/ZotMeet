const require_rolldown_runtime = require('../../_virtual/rolldown_runtime.cjs');
const require_libsql_driver_core = require('../driver-core.cjs');
let _libsql_client_web = require("@libsql/client/web");

//#region src/libsql/web/index.ts
function drizzle(...params) {
	if (typeof params[0] === "string") return require_libsql_driver_core.construct((0, _libsql_client_web.createClient)({ url: params[0] }), params[1]);
	const { connection, client, ...drizzleConfig } = params[0];
	if (client) return require_libsql_driver_core.construct(client, drizzleConfig);
	return require_libsql_driver_core.construct(typeof connection === "string" ? (0, _libsql_client_web.createClient)({ url: connection }) : (0, _libsql_client_web.createClient)(connection), drizzleConfig);
}
(function(_drizzle) {
	function mock(config) {
		return require_libsql_driver_core.construct({}, config);
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
//# sourceMappingURL=index.cjs.map