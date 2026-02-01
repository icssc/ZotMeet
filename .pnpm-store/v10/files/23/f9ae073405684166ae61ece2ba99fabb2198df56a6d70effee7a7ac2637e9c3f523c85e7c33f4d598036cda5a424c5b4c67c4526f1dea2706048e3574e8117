const require_rolldown_runtime = require('../_virtual/rolldown_runtime.cjs');
let __entity_ts = require("../entity.cjs");

//#region src/pg-core/session.ts
var PgBasePreparedQuery = class {
	static [__entity_ts.entityKind] = "PgBasePreparedQuery";
	constructor(query) {
		this.query = query;
	}
	getQuery() {
		return this.query;
	}
	mapResult(response, _isFromBatch) {
		return response;
	}
	/** @internal */
	joinsNotNullableMap;
};
var PgSession = class {
	static [__entity_ts.entityKind] = "PgSession";
	constructor(dialect) {
		this.dialect = dialect;
	}
};

//#endregion
exports.PgBasePreparedQuery = PgBasePreparedQuery;
exports.PgSession = PgSession;
//# sourceMappingURL=session.cjs.map