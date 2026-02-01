import { PgColumn, PgColumnBuilder } from "../common.js";
import { entityKind } from "../../../entity.js";
import { getColumnNameAndConfig } from "../../../utils.js";

//#region src/pg-core/columns/vector_extension/halfvec.ts
var PgHalfVectorBuilder = class extends PgColumnBuilder {
	static [entityKind] = "PgHalfVectorBuilder";
	constructor(name, config) {
		super(name, "array halfvector", "PgHalfVector");
		this.config.length = config.dimensions;
		this.config.isLengthExact = true;
	}
	/** @internal */
	build(table) {
		return new PgHalfVector(table, this.config);
	}
};
var PgHalfVector = class extends PgColumn {
	static [entityKind] = "PgHalfVector";
	getSQLType() {
		return `halfvec(${this.length})`;
	}
	mapToDriverValue(value) {
		return JSON.stringify(value);
	}
	mapFromDriverValue(value) {
		return value.slice(1, -1).split(",").map((v) => Number.parseFloat(v));
	}
};
function halfvec(a, b) {
	const { name, config } = getColumnNameAndConfig(a, b);
	return new PgHalfVectorBuilder(name, config);
}

//#endregion
export { PgHalfVector, PgHalfVectorBuilder, halfvec };
//# sourceMappingURL=halfvec.js.map