const require_rolldown_runtime = require('../../_virtual/rolldown_runtime.cjs');
const require_gel_core_columns_common = require('./common.cjs');
let __entity_ts = require("../../entity.cjs");

//#region src/gel-core/columns/uuid.ts
var GelUUIDBuilder = class extends require_gel_core_columns_common.GelColumnBuilder {
	static [__entity_ts.entityKind] = "GelUUIDBuilder";
	constructor(name) {
		super(name, "string uuid", "GelUUID");
	}
	/** @internal */
	build(table) {
		return new GelUUID(table, this.config);
	}
};
var GelUUID = class extends require_gel_core_columns_common.GelColumn {
	static [__entity_ts.entityKind] = "GelUUID";
	getSQLType() {
		return "uuid";
	}
};
function uuid(name) {
	return new GelUUIDBuilder(name ?? "");
}

//#endregion
exports.GelUUID = GelUUID;
exports.GelUUIDBuilder = GelUUIDBuilder;
exports.uuid = uuid;
//# sourceMappingURL=uuid.cjs.map