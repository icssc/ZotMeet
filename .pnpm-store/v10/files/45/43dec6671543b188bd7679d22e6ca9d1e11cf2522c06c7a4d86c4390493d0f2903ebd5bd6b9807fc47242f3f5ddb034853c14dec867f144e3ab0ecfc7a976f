const require_rolldown_runtime = require('../../_virtual/rolldown_runtime.cjs');
const require_mysql_core_columns_common = require('./common.cjs');
let __entity_ts = require("../../entity.cjs");
let __utils_ts = require("../../utils.cjs");

//#region src/mysql-core/columns/bigint.ts
var MySqlBigInt53Builder = class extends require_mysql_core_columns_common.MySqlColumnBuilderWithAutoIncrement {
	static [__entity_ts.entityKind] = "MySqlBigInt53Builder";
	constructor(name, unsigned = false) {
		super(name, unsigned ? "number uint53" : "number int53", "MySqlBigInt53");
		this.config.unsigned = unsigned;
	}
	/** @internal */
	build(table) {
		return new MySqlBigInt53(table, this.config);
	}
};
var MySqlBigInt53 = class extends require_mysql_core_columns_common.MySqlColumnWithAutoIncrement {
	static [__entity_ts.entityKind] = "MySqlBigInt53";
	getSQLType() {
		return `bigint${this.config.unsigned ? " unsigned" : ""}`;
	}
	mapFromDriverValue(value) {
		if (typeof value === "number") return value;
		return Number(value);
	}
};
var MySqlBigInt64Builder = class extends require_mysql_core_columns_common.MySqlColumnBuilderWithAutoIncrement {
	static [__entity_ts.entityKind] = "MySqlBigInt64Builder";
	constructor(name, unsigned = false) {
		super(name, unsigned ? "bigint uint64" : "bigint int64", "MySqlBigInt64");
		this.config.unsigned = unsigned;
	}
	/** @internal */
	build(table) {
		return new MySqlBigInt64(table, this.config);
	}
};
var MySqlBigInt64 = class extends require_mysql_core_columns_common.MySqlColumnWithAutoIncrement {
	static [__entity_ts.entityKind] = "MySqlBigInt64";
	getSQLType() {
		return `bigint${this.config.unsigned ? " unsigned" : ""}`;
	}
	mapToDriverValue(value) {
		return value.toString();
	}
	mapFromDriverValue(value) {
		if (typeof value === "bigint") return value;
		return BigInt(value);
	}
};
var MySqlBigIntStringBuilder = class extends require_mysql_core_columns_common.MySqlColumnBuilderWithAutoIncrement {
	static [__entity_ts.entityKind] = "MySqlBigIntStringBuilder";
	constructor(name, unsigned = false) {
		super(name, unsigned ? "string uint64" : "string int64", "MySqlBigIntString");
		this.config.unsigned = unsigned;
	}
	/** @internal */
	build(table) {
		return new MySqlBigIntString(table, this.config);
	}
};
var MySqlBigIntString = class extends require_mysql_core_columns_common.MySqlColumnWithAutoIncrement {
	static [__entity_ts.entityKind] = "MySqlBigIntString";
	getSQLType() {
		return `bigint${this.config.unsigned ? " unsigned" : ""}`;
	}
	mapFromDriverValue(value) {
		if (typeof value === "string") return value;
		return String(value);
	}
};
function bigint(a, b) {
	const { name, config } = (0, __utils_ts.getColumnNameAndConfig)(a, b);
	if (config.mode === "number") return new MySqlBigInt53Builder(name, config.unsigned);
	if (config.mode === "string") return new MySqlBigIntStringBuilder(name, config.unsigned);
	return new MySqlBigInt64Builder(name, config.unsigned);
}

//#endregion
exports.MySqlBigInt53 = MySqlBigInt53;
exports.MySqlBigInt53Builder = MySqlBigInt53Builder;
exports.MySqlBigInt64 = MySqlBigInt64;
exports.MySqlBigInt64Builder = MySqlBigInt64Builder;
exports.MySqlBigIntString = MySqlBigIntString;
exports.MySqlBigIntStringBuilder = MySqlBigIntStringBuilder;
exports.bigint = bigint;
//# sourceMappingURL=bigint.cjs.map