const require_rolldown_runtime = require('../../_virtual/rolldown_runtime.cjs');
const require_pg_core_columns_common = require('./common.cjs');
let __entity_ts = require("../../entity.cjs");
let __utils_ts = require("../../utils.cjs");

//#region src/pg-core/columns/text.ts
var PgTextBuilder = class extends require_pg_core_columns_common.PgColumnBuilder {
	static [__entity_ts.entityKind] = "PgTextBuilder";
	constructor(name, config) {
		super(name, config.enum?.length ? "string enum" : "string", "PgText");
		this.config.enumValues = config.enum;
	}
	/** @internal */
	build(table) {
		return new PgText(table, this.config, this.config.enumValues);
	}
};
var PgText = class extends require_pg_core_columns_common.PgColumn {
	static [__entity_ts.entityKind] = "PgText";
	enumValues;
	constructor(table, config, enumValues) {
		super(table, config);
		this.enumValues = enumValues;
	}
	getSQLType() {
		return "text";
	}
};
function text(a, b = {}) {
	const { name, config } = (0, __utils_ts.getColumnNameAndConfig)(a, b);
	return new PgTextBuilder(name, config);
}

//#endregion
exports.PgText = PgText;
exports.PgTextBuilder = PgTextBuilder;
exports.text = text;
//# sourceMappingURL=text.cjs.map