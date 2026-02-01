const require_rolldown_runtime = require('../../_virtual/rolldown_runtime.cjs');
const require_pg_core_columns_common = require('./common.cjs');
let __entity_ts = require("../../entity.cjs");

//#region src/pg-core/columns/bytea.ts
var PgByteaBuilder = class extends require_pg_core_columns_common.PgColumnBuilder {
	static [__entity_ts.entityKind] = "PgByteaBuilder";
	constructor(name) {
		super(name, "object buffer", "PgBytea");
	}
	/** @internal */
	build(table) {
		return new PgBytea(table, this.config);
	}
};
var PgBytea = class extends require_pg_core_columns_common.PgColumn {
	static [__entity_ts.entityKind] = "PgBytea";
	mapFromDriverValue(value) {
		if (Buffer.isBuffer(value)) return value;
		if (typeof value === "string") {
			const trimmed = value.slice(2, value.length);
			return Buffer.from(trimmed, "hex");
		}
		return Buffer.from(value);
	}
	getSQLType() {
		return "bytea";
	}
};
function bytea(name) {
	return new PgByteaBuilder(name ?? "");
}

//#endregion
exports.PgBytea = PgBytea;
exports.PgByteaBuilder = PgByteaBuilder;
exports.bytea = bytea;
//# sourceMappingURL=bytea.cjs.map