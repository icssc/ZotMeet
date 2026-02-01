const require_rolldown_runtime = require('../../_virtual/rolldown_runtime.cjs');
const require_gel_core_columns_common = require('./common.cjs');
let __entity_ts = require("../../entity.cjs");

//#region src/gel-core/columns/json.ts
var GelJsonBuilder = class extends require_gel_core_columns_common.GelColumnBuilder {
	static [__entity_ts.entityKind] = "GelJsonBuilder";
	constructor(name) {
		super(name, "object json", "GelJson");
	}
	/** @internal */
	build(table) {
		return new GelJson(table, this.config);
	}
};
var GelJson = class extends require_gel_core_columns_common.GelColumn {
	static [__entity_ts.entityKind] = "GelJson";
	constructor(table, config) {
		super(table, config);
	}
	getSQLType() {
		return "json";
	}
};
function json(name) {
	return new GelJsonBuilder(name ?? "");
}

//#endregion
exports.GelJson = GelJson;
exports.GelJsonBuilder = GelJsonBuilder;
exports.json = json;
//# sourceMappingURL=json.cjs.map