import { PgColumn, PgColumnBuilder } from "./common.js";
import { entityKind } from "../../entity.js";

//#region src/pg-core/columns/bytea.ts
var PgByteaBuilder = class extends PgColumnBuilder {
	static [entityKind] = "PgByteaBuilder";
	constructor(name) {
		super(name, "object buffer", "PgBytea");
	}
	/** @internal */
	build(table) {
		return new PgBytea(table, this.config);
	}
};
var PgBytea = class extends PgColumn {
	static [entityKind] = "PgBytea";
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
export { PgBytea, PgByteaBuilder, bytea };
//# sourceMappingURL=bytea.js.map