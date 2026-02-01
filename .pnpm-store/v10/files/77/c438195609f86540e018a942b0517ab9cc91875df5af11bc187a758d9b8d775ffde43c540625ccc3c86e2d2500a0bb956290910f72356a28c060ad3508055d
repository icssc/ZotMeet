const require_rolldown_runtime = require('../../_virtual/rolldown_runtime.cjs');
const require_pg_core_columns_common = require('./common.cjs');
let __entity_ts = require("../../entity.cjs");

//#region src/pg-core/columns/jsonb.ts
var PgJsonbBuilder = class extends require_pg_core_columns_common.PgColumnBuilder {
	static [__entity_ts.entityKind] = "PgJsonbBuilder";
	constructor(name) {
		super(name, "object json", "PgJsonb");
	}
	/** @internal */
	build(table) {
		return new PgJsonb(table, this.config);
	}
};
var PgJsonb = class extends require_pg_core_columns_common.PgColumn {
	static [__entity_ts.entityKind] = "PgJsonb";
	constructor(table, config) {
		super(table, config);
	}
	getSQLType() {
		return "jsonb";
	}
	mapToDriverValue(value) {
		return JSON.stringify(value);
	}
	mapFromDriverValue(value) {
		if (typeof value === "string") try {
			return JSON.parse(value);
		} catch {
			return value;
		}
		return value;
	}
};
function jsonb(name) {
	return new PgJsonbBuilder(name ?? "");
}

//#endregion
exports.PgJsonb = PgJsonb;
exports.PgJsonbBuilder = PgJsonbBuilder;
exports.jsonb = jsonb;
//# sourceMappingURL=jsonb.cjs.map