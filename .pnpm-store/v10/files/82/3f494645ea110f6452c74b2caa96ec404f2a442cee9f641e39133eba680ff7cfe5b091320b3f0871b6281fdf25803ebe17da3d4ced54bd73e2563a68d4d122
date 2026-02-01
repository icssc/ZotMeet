const require_rolldown_runtime = require('../../_virtual/rolldown_runtime.cjs');
const require_pg_core_columns_common = require('./common.cjs');
let __entity_ts = require("../../entity.cjs");

//#region src/pg-core/columns/real.ts
var PgRealBuilder = class extends require_pg_core_columns_common.PgColumnBuilder {
	static [__entity_ts.entityKind] = "PgRealBuilder";
	constructor(name, length) {
		super(name, "number float", "PgReal");
		this.config.length = length;
	}
	/** @internal */
	build(table) {
		return new PgReal(table, this.config);
	}
};
var PgReal = class extends require_pg_core_columns_common.PgColumn {
	static [__entity_ts.entityKind] = "PgReal";
	constructor(table, config) {
		super(table, config);
	}
	getSQLType() {
		return "real";
	}
	mapFromDriverValue(value) {
		if (typeof value === "string") return Number.parseFloat(value);
		return value;
	}
};
function real(name) {
	return new PgRealBuilder(name ?? "");
}

//#endregion
exports.PgReal = PgReal;
exports.PgRealBuilder = PgRealBuilder;
exports.real = real;
//# sourceMappingURL=real.cjs.map