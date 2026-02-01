const require_rolldown_runtime = require('../../_virtual/rolldown_runtime.cjs');
const require_mysql_core_columns_common = require('./common.cjs');
let __entity_ts = require("../../entity.cjs");
let __utils_ts = require("../../utils.cjs");

//#region src/mysql-core/columns/varbinary.ts
var MySqlVarBinaryBuilder = class extends require_mysql_core_columns_common.MySqlColumnBuilder {
	static [__entity_ts.entityKind] = "MySqlVarBinaryBuilder";
	/** @internal */
	constructor(name, config) {
		super(name, "string binary", "MySqlVarBinary");
		this.config.length = config.length;
	}
	/** @internal */
	build(table) {
		return new MySqlVarBinary(table, this.config);
	}
};
var MySqlVarBinary = class extends require_mysql_core_columns_common.MySqlColumn {
	static [__entity_ts.entityKind] = "MySqlVarBinary";
	mapFromDriverValue(value) {
		if (typeof value === "string") return value;
		if (Buffer.isBuffer(value)) return value.toString();
		const str = [];
		for (const v of value) str.push(v === 49 ? "1" : "0");
		return str.join("");
	}
	getSQLType() {
		return this.length === void 0 ? `varbinary` : `varbinary(${this.length})`;
	}
};
function varbinary(a, b) {
	const { name, config } = (0, __utils_ts.getColumnNameAndConfig)(a, b);
	return new MySqlVarBinaryBuilder(name, config);
}

//#endregion
exports.MySqlVarBinary = MySqlVarBinary;
exports.MySqlVarBinaryBuilder = MySqlVarBinaryBuilder;
exports.varbinary = varbinary;
//# sourceMappingURL=varbinary.cjs.map