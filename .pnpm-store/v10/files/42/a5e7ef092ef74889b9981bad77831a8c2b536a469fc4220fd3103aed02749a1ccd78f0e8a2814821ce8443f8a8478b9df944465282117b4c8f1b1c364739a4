const require_rolldown_runtime = require('../../_virtual/rolldown_runtime.cjs');
const require_mysql_core_columns_common = require('./common.cjs');
let __entity_ts = require("../../entity.cjs");

//#region src/mysql-core/columns/serial.ts
var MySqlSerialBuilder = class extends require_mysql_core_columns_common.MySqlColumnBuilderWithAutoIncrement {
	static [__entity_ts.entityKind] = "MySqlSerialBuilder";
	constructor(name) {
		super(name, "number uint53", "MySqlSerial");
		this.config.hasDefault = true;
		this.config.autoIncrement = true;
	}
	/** @internal */
	build(table) {
		return new MySqlSerial(table, this.config);
	}
};
var MySqlSerial = class extends require_mysql_core_columns_common.MySqlColumnWithAutoIncrement {
	static [__entity_ts.entityKind] = "MySqlSerial";
	getSQLType() {
		return "serial";
	}
	mapFromDriverValue(value) {
		if (typeof value === "string") return Number(value);
		return value;
	}
};
function serial(name) {
	return new MySqlSerialBuilder(name ?? "");
}

//#endregion
exports.MySqlSerial = MySqlSerial;
exports.MySqlSerialBuilder = MySqlSerialBuilder;
exports.serial = serial;
//# sourceMappingURL=serial.cjs.map