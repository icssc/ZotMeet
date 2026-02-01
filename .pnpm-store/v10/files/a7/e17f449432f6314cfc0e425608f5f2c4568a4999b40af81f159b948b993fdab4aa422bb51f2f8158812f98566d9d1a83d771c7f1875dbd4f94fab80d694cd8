const require_rolldown_runtime = require('../../_virtual/rolldown_runtime.cjs');
const require_mysql_core_columns_common = require('./common.cjs');
let __entity_ts = require("../../entity.cjs");
let __utils_ts = require("../../utils.cjs");

//#region src/mysql-core/columns/smallint.ts
var MySqlSmallIntBuilder = class extends require_mysql_core_columns_common.MySqlColumnBuilderWithAutoIncrement {
	static [__entity_ts.entityKind] = "MySqlSmallIntBuilder";
	constructor(name, config) {
		super(name, config?.unsigned ? "number uint16" : "number int16", "MySqlSmallInt");
		this.config.unsigned = config ? config.unsigned : false;
	}
	/** @internal */
	build(table) {
		return new MySqlSmallInt(table, this.config);
	}
};
var MySqlSmallInt = class extends require_mysql_core_columns_common.MySqlColumnWithAutoIncrement {
	static [__entity_ts.entityKind] = "MySqlSmallInt";
	getSQLType() {
		return `smallint${this.config.unsigned ? " unsigned" : ""}`;
	}
	mapFromDriverValue(value) {
		if (typeof value === "string") return Number(value);
		return value;
	}
};
function smallint(a, b) {
	const { name, config } = (0, __utils_ts.getColumnNameAndConfig)(a, b);
	return new MySqlSmallIntBuilder(name, config);
}

//#endregion
exports.MySqlSmallInt = MySqlSmallInt;
exports.MySqlSmallIntBuilder = MySqlSmallIntBuilder;
exports.smallint = smallint;
//# sourceMappingURL=smallint.cjs.map