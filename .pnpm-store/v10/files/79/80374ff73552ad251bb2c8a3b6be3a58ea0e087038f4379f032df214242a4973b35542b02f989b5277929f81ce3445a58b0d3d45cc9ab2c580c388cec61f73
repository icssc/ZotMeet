const require_rolldown_runtime = require('../../_virtual/rolldown_runtime.cjs');
const require_gel_core_columns_common = require('./common.cjs');
let __entity_ts = require("../../entity.cjs");

//#region src/gel-core/columns/bytes.ts
var GelBytesBuilder = class extends require_gel_core_columns_common.GelColumnBuilder {
	static [__entity_ts.entityKind] = "GelBytesBuilder";
	constructor(name) {
		super(name, "object buffer", "GelBytes");
	}
	/** @internal */
	build(table) {
		return new GelBytes(table, this.config);
	}
};
var GelBytes = class extends require_gel_core_columns_common.GelColumn {
	static [__entity_ts.entityKind] = "GelBytes";
	getSQLType() {
		return "bytea";
	}
};
function bytes(name) {
	return new GelBytesBuilder(name ?? "");
}

//#endregion
exports.GelBytes = GelBytes;
exports.GelBytesBuilder = GelBytesBuilder;
exports.bytes = bytes;
//# sourceMappingURL=bytes.cjs.map