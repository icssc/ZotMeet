const require_rolldown_runtime = require('../../_virtual/rolldown_runtime.cjs');
const require_gel_core_columns_common = require('./common.cjs');
let __entity_ts = require("../../entity.cjs");

//#region src/gel-core/columns/boolean.ts
var GelBooleanBuilder = class extends require_gel_core_columns_common.GelColumnBuilder {
	static [__entity_ts.entityKind] = "GelBooleanBuilder";
	constructor(name) {
		super(name, "boolean", "GelBoolean");
	}
	/** @internal */
	build(table) {
		return new GelBoolean(table, this.config);
	}
};
var GelBoolean = class extends require_gel_core_columns_common.GelColumn {
	static [__entity_ts.entityKind] = "GelBoolean";
	getSQLType() {
		return "boolean";
	}
};
function boolean(name) {
	return new GelBooleanBuilder(name ?? "");
}

//#endregion
exports.GelBoolean = GelBoolean;
exports.GelBooleanBuilder = GelBooleanBuilder;
exports.boolean = boolean;
//# sourceMappingURL=boolean.cjs.map