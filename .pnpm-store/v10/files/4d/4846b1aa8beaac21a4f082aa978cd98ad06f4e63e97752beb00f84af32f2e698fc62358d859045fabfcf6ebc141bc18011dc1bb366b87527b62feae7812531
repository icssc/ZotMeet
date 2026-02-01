const require_rolldown_runtime = require('../../_virtual/rolldown_runtime.cjs');
const require_mysql_core_columns_common = require('./common.cjs');
let __entity_ts = require("../../entity.cjs");
let __utils_ts = require("../../utils.cjs");

//#region src/mysql-core/columns/binary.ts
var MySqlBinaryBuilder = class extends require_mysql_core_columns_common.MySqlColumnBuilder {
	static [__entity_ts.entityKind] = "MySqlBinaryBuilder";
	constructor(name, length) {
		super(name, "string binary", "MySqlBinary");
		this.config.length = length ?? 1;
		this.config.setLength = length !== void 0;
	}
	/** @internal */
	build(table) {
		return new MySqlBinary(table, this.config);
	}
};
var MySqlBinary = class extends require_mysql_core_columns_common.MySqlColumn {
	static [__entity_ts.entityKind] = "MySqlBinary";
	mapFromDriverValue(value) {
		if (typeof value === "string") return value;
		if (Buffer.isBuffer(value)) return value.toString();
		const str = [];
		for (const v of value) str.push(v === 49 ? "1" : "0");
		return str.join("");
	}
	getSQLType() {
		return this.config.setLength ? `binary(${this.length})` : `binary`;
	}
};
function binary(a, b = {}) {
	const { name, config } = (0, __utils_ts.getColumnNameAndConfig)(a, b);
	return new MySqlBinaryBuilder(name, config.length);
}

//#endregion
exports.MySqlBinary = MySqlBinary;
exports.MySqlBinaryBuilder = MySqlBinaryBuilder;
exports.binary = binary;
//# sourceMappingURL=binary.cjs.map