const require_rolldown_runtime = require('../../../_virtual/rolldown_runtime.cjs');
const require_pg_core_columns_common = require('../common.cjs');
let __entity_ts = require("../../../entity.cjs");
let __utils_ts = require("../../../utils.cjs");

//#region src/pg-core/columns/vector_extension/vector.ts
var PgVectorBuilder = class extends require_pg_core_columns_common.PgColumnBuilder {
	static [__entity_ts.entityKind] = "PgVectorBuilder";
	constructor(name, config) {
		super(name, "array vector", "PgVector");
		this.config.length = config.dimensions;
		this.config.isLengthExact = true;
	}
	/** @internal */
	build(table) {
		return new PgVector(table, this.config);
	}
};
var PgVector = class extends require_pg_core_columns_common.PgColumn {
	static [__entity_ts.entityKind] = "PgVector";
	getSQLType() {
		return `vector(${this.length})`;
	}
	mapToDriverValue(value) {
		return JSON.stringify(value);
	}
	mapFromDriverValue(value) {
		return value.slice(1, -1).split(",").map((v) => Number.parseFloat(v));
	}
};
function vector(a, b) {
	const { name, config } = (0, __utils_ts.getColumnNameAndConfig)(a, b);
	return new PgVectorBuilder(name, config);
}

//#endregion
exports.PgVector = PgVector;
exports.PgVectorBuilder = PgVectorBuilder;
exports.vector = vector;
//# sourceMappingURL=vector.cjs.map