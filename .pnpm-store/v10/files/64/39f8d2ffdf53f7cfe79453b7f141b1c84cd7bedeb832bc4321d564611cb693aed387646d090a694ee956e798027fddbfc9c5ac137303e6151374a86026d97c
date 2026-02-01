const require_rolldown_runtime = require('../../_virtual/rolldown_runtime.cjs');
const require_pg_core_columns_common = require('./common.cjs');
const require_pg_core_columns_int_common = require('./int.common.cjs');
let __entity_ts = require("../../entity.cjs");
let __utils_ts = require("../../utils.cjs");

//#region src/pg-core/columns/bigint.ts
var PgBigInt53Builder = class extends require_pg_core_columns_int_common.PgIntColumnBuilder {
	static [__entity_ts.entityKind] = "PgBigInt53Builder";
	constructor(name) {
		super(name, "number int53", "PgBigInt53");
	}
	/** @internal */
	build(table) {
		return new PgBigInt53(table, this.config);
	}
};
var PgBigInt53 = class extends require_pg_core_columns_common.PgColumn {
	static [__entity_ts.entityKind] = "PgBigInt53";
	getSQLType() {
		return "bigint";
	}
	mapFromDriverValue(value) {
		if (typeof value === "number") return value;
		return Number(value);
	}
};
var PgBigInt64Builder = class extends require_pg_core_columns_int_common.PgIntColumnBuilder {
	static [__entity_ts.entityKind] = "PgBigInt64Builder";
	constructor(name) {
		super(name, "bigint int64", "PgBigInt64");
	}
	/** @internal */
	build(table) {
		return new PgBigInt64(table, this.config);
	}
};
var PgBigInt64 = class extends require_pg_core_columns_common.PgColumn {
	static [__entity_ts.entityKind] = "PgBigInt64";
	getSQLType() {
		return "bigint";
	}
	mapFromDriverValue(value) {
		return BigInt(value);
	}
};
var PgBigIntStringBuilder = class extends require_pg_core_columns_int_common.PgIntColumnBuilder {
	static [__entity_ts.entityKind] = "PgBigIntStringBuilder";
	constructor(name) {
		super(name, "string int64", "PgBigIntString");
	}
	/** @internal */
	build(table) {
		return new PgBigIntString(table, this.config);
	}
};
var PgBigIntString = class extends require_pg_core_columns_common.PgColumn {
	static [__entity_ts.entityKind] = "PgBigIntString";
	getSQLType() {
		return "bigint";
	}
	mapFromDriverValue(value) {
		if (typeof value === "string") return value;
		return String(value);
	}
};
function bigint(a, b) {
	const { name, config } = (0, __utils_ts.getColumnNameAndConfig)(a, b);
	if (config.mode === "number") return new PgBigInt53Builder(name);
	if (config.mode === "string") return new PgBigIntStringBuilder(name);
	return new PgBigInt64Builder(name);
}

//#endregion
exports.PgBigInt53 = PgBigInt53;
exports.PgBigInt53Builder = PgBigInt53Builder;
exports.PgBigInt64 = PgBigInt64;
exports.PgBigInt64Builder = PgBigInt64Builder;
exports.PgBigIntString = PgBigIntString;
exports.PgBigIntStringBuilder = PgBigIntStringBuilder;
exports.bigint = bigint;
//# sourceMappingURL=bigint.cjs.map