const require_rolldown_runtime = require('../../_virtual/rolldown_runtime.cjs');
const require_pg_core_columns_common = require('./common.cjs');
const require_pg_core_columns_int_common = require('./int.common.cjs');
let __entity_ts = require("../../entity.cjs");

//#region src/pg-core/columns/smallint.ts
var PgSmallIntBuilder = class extends require_pg_core_columns_int_common.PgIntColumnBuilder {
	static [__entity_ts.entityKind] = "PgSmallIntBuilder";
	constructor(name) {
		super(name, "number int16", "PgSmallInt");
	}
	/** @internal */
	build(table) {
		return new PgSmallInt(table, this.config);
	}
};
var PgSmallInt = class extends require_pg_core_columns_common.PgColumn {
	static [__entity_ts.entityKind] = "PgSmallInt";
	getSQLType() {
		return "smallint";
	}
	mapFromDriverValue(value) {
		if (typeof value === "string") return Number(value);
		return value;
	}
};
function smallint(name) {
	return new PgSmallIntBuilder(name ?? "");
}

//#endregion
exports.PgSmallInt = PgSmallInt;
exports.PgSmallIntBuilder = PgSmallIntBuilder;
exports.smallint = smallint;
//# sourceMappingURL=smallint.cjs.map