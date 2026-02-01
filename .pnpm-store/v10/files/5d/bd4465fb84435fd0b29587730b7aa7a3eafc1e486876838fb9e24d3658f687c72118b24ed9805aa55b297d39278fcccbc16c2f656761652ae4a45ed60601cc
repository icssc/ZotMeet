const require_rolldown_runtime = require('./_virtual/rolldown_runtime.cjs');
let __entity_ts = require("./entity.cjs");

//#region src/errors.ts
var DrizzleError = class extends Error {
	static [__entity_ts.entityKind] = "DrizzleError";
	constructor({ message, cause }) {
		super(message);
		this.name = "DrizzleError";
		this.cause = cause;
	}
};
var DrizzleQueryError = class DrizzleQueryError extends Error {
	static [__entity_ts.entityKind] = "DrizzleQueryError";
	constructor(query, params, cause) {
		super(`Failed query: ${query}\nparams: ${params}`);
		this.query = query;
		this.params = params;
		this.cause = cause;
		Error.captureStackTrace(this, DrizzleQueryError);
		if (cause) this.cause = cause;
	}
};
var TransactionRollbackError = class extends DrizzleError {
	static [__entity_ts.entityKind] = "TransactionRollbackError";
	constructor() {
		super({ message: "Rollback" });
	}
};

//#endregion
exports.DrizzleError = DrizzleError;
exports.DrizzleQueryError = DrizzleQueryError;
exports.TransactionRollbackError = TransactionRollbackError;
//# sourceMappingURL=errors.cjs.map