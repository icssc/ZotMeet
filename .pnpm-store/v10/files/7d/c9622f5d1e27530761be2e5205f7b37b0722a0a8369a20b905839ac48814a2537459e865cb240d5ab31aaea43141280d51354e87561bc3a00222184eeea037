const require_rolldown_runtime = require('../../_virtual/rolldown_runtime.cjs');
const require_pg_core_columns_common = require('./common.cjs');
const require_pg_core_columns_int_common = require('./int.common.cjs');
let __entity_ts = require("../../entity.cjs");

//#region src/pg-core/columns/integer.ts
var PgIntegerBuilder = class extends require_pg_core_columns_int_common.PgIntColumnBuilder {
	static [__entity_ts.entityKind] = "PgIntegerBuilder";
	constructor(name) {
		super(name, "number int32", "PgInteger");
	}
	/** @internal */
	build(table) {
		return new PgInteger(table, this.config);
	}
};
var PgInteger = class extends require_pg_core_columns_common.PgColumn {
	static [__entity_ts.entityKind] = "PgInteger";
	getSQLType() {
		return "integer";
	}
	mapFromDriverValue(value) {
		if (typeof value === "string") return Number.parseInt(value);
		return value;
	}
};
function integer(name) {
	return new PgIntegerBuilder(name ?? "");
}

//#endregion
exports.PgInteger = PgInteger;
exports.PgIntegerBuilder = PgIntegerBuilder;
exports.integer = integer;
//# sourceMappingURL=integer.cjs.map