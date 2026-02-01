const require_rolldown_runtime = require('../../_virtual/rolldown_runtime.cjs');
const require_pg_core_columns_common = require('./common.cjs');
let __entity_ts = require("../../entity.cjs");

//#region src/pg-core/columns/serial.ts
var PgSerialBuilder = class extends require_pg_core_columns_common.PgColumnBuilder {
	static [__entity_ts.entityKind] = "PgSerialBuilder";
	constructor(name) {
		super(name, "number int32", "PgSerial");
		this.config.hasDefault = true;
		this.config.notNull = true;
	}
	/** @internal */
	build(table) {
		return new PgSerial(table, this.config);
	}
};
var PgSerial = class extends require_pg_core_columns_common.PgColumn {
	static [__entity_ts.entityKind] = "PgSerial";
	getSQLType() {
		return "serial";
	}
};
function serial(name) {
	return new PgSerialBuilder(name ?? "");
}

//#endregion
exports.PgSerial = PgSerial;
exports.PgSerialBuilder = PgSerialBuilder;
exports.serial = serial;
//# sourceMappingURL=serial.cjs.map