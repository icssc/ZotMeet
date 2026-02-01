import { MySqlColumn, MySqlColumnBuilder } from "./common.js";
import { entityKind } from "../../entity.js";
import { getColumnNameAndConfig } from "../../utils.js";

//#region src/mysql-core/columns/binary.ts
var MySqlBinaryBuilder = class extends MySqlColumnBuilder {
	static [entityKind] = "MySqlBinaryBuilder";
	constructor(name, length) {
		super(name, "string binary", "MySqlBinary");
		this.config.length = length ?? 1;
		this.config.setLength = length !== void 0;
	}
	/** @internal */
	build(table) {
		return new MySqlBinary(table, this.config);
	}
};
var MySqlBinary = class extends MySqlColumn {
	static [entityKind] = "MySqlBinary";
	mapFromDriverValue(value) {
		if (typeof value === "string") return value;
		if (Buffer.isBuffer(value)) return value.toString();
		const str = [];
		for (const v of value) str.push(v === 49 ? "1" : "0");
		return str.join("");
	}
	getSQLType() {
		return this.config.setLength ? `binary(${this.length})` : `binary`;
	}
};
function binary(a, b = {}) {
	const { name, config } = getColumnNameAndConfig(a, b);
	return new MySqlBinaryBuilder(name, config.length);
}

//#endregion
export { MySqlBinary, MySqlBinaryBuilder, binary };
//# sourceMappingURL=binary.js.map