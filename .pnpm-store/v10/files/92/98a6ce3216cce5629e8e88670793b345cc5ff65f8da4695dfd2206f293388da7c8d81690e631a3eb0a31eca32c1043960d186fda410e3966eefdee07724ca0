const require_rolldown_runtime = require('../../_virtual/rolldown_runtime.cjs');
const require_gel_core_columns_common = require('./common.cjs');
let __entity_ts = require("../../entity.cjs");

//#region src/gel-core/columns/text.ts
var GelTextBuilder = class extends require_gel_core_columns_common.GelColumnBuilder {
	static [__entity_ts.entityKind] = "GelTextBuilder";
	constructor(name) {
		super(name, "string", "GelText");
	}
	/** @internal */
	build(table) {
		return new GelText(table, this.config);
	}
};
var GelText = class extends require_gel_core_columns_common.GelColumn {
	static [__entity_ts.entityKind] = "GelText";
	enumValues = this.config.enumValues;
	getSQLType() {
		return "text";
	}
};
function text(name) {
	return new GelTextBuilder(name ?? "");
}

//#endregion
exports.GelText = GelText;
exports.GelTextBuilder = GelTextBuilder;
exports.text = text;
//# sourceMappingURL=text.cjs.map