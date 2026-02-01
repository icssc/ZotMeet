import { PgColumn, PgColumnBuilder } from "./common.js";
import { entityKind } from "../../entity.js";
import { getColumnNameAndConfig } from "../../utils.js";

//#region src/pg-core/columns/line.ts
var PgLineBuilder = class extends PgColumnBuilder {
	static [entityKind] = "PgLineBuilder";
	constructor(name) {
		super(name, "array line", "PgLine");
	}
	/** @internal */
	build(table) {
		return new PgLineTuple(table, this.config);
	}
};
var PgLineTuple = class extends PgColumn {
	static [entityKind] = "PgLine";
	mode = "tuple";
	getSQLType() {
		return "line";
	}
	mapFromDriverValue(value) {
		const [a, b, c] = value.slice(1, -1).split(",");
		return [
			Number.parseFloat(a),
			Number.parseFloat(b),
			Number.parseFloat(c)
		];
	}
	mapToDriverValue(value) {
		return `{${value[0]},${value[1]},${value[2]}}`;
	}
};
var PgLineABCBuilder = class extends PgColumnBuilder {
	static [entityKind] = "PgLineABCBuilder";
	constructor(name) {
		super(name, "object line", "PgLineABC");
	}
	/** @internal */
	build(table) {
		return new PgLineABC(table, this.config);
	}
};
var PgLineABC = class extends PgColumn {
	static [entityKind] = "PgLineABC";
	mode = "abc";
	getSQLType() {
		return "line";
	}
	mapFromDriverValue(value) {
		const [a, b, c] = value.slice(1, -1).split(",");
		return {
			a: Number.parseFloat(a),
			b: Number.parseFloat(b),
			c: Number.parseFloat(c)
		};
	}
	mapToDriverValue(value) {
		return `{${value.a},${value.b},${value.c}}`;
	}
};
function line(a, b) {
	const { name, config } = getColumnNameAndConfig(a, b);
	if (!config?.mode || config.mode === "tuple") return new PgLineBuilder(name);
	return new PgLineABCBuilder(name);
}

//#endregion
export { PgLineABC, PgLineABCBuilder, PgLineBuilder, PgLineTuple, line };
//# sourceMappingURL=line.js.map