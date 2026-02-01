import { PgColumn, PgColumnBuilder } from "./common.js";
import { entityKind } from "../../entity.js";
import { getColumnNameAndConfig } from "../../utils.js";

//#region src/pg-core/columns/numeric.ts
var PgNumericBuilder = class extends PgColumnBuilder {
	static [entityKind] = "PgNumericBuilder";
	constructor(name, precision, scale) {
		super(name, "string numeric", "PgNumeric");
		this.config.precision = precision;
		this.config.scale = scale;
	}
	/** @internal */
	build(table) {
		return new PgNumeric(table, this.config);
	}
};
var PgNumeric = class extends PgColumn {
	static [entityKind] = "PgNumeric";
	precision;
	scale;
	constructor(table, config) {
		super(table, config);
		this.precision = config.precision;
		this.scale = config.scale;
	}
	mapFromDriverValue(value) {
		if (typeof value === "string") return value;
		return String(value);
	}
	getSQLType() {
		if (this.precision !== void 0 && this.scale !== void 0) return `numeric(${this.precision}, ${this.scale})`;
		else if (this.precision === void 0) return "numeric";
		else return `numeric(${this.precision})`;
	}
};
var PgNumericNumberBuilder = class extends PgColumnBuilder {
	static [entityKind] = "PgNumericNumberBuilder";
	constructor(name, precision, scale) {
		super(name, "number", "PgNumericNumber");
		this.config.precision = precision;
		this.config.scale = scale;
	}
	/** @internal */
	build(table) {
		return new PgNumericNumber(table, this.config);
	}
};
var PgNumericNumber = class extends PgColumn {
	static [entityKind] = "PgNumericNumber";
	precision;
	scale;
	constructor(table, config) {
		super(table, config);
		this.precision = config.precision;
		this.scale = config.scale;
	}
	mapFromDriverValue(value) {
		if (typeof value === "number") return value;
		return Number(value);
	}
	mapToDriverValue(value) {
		return String(value);
	}
	getSQLType() {
		if (this.precision !== void 0 && this.scale !== void 0) return `numeric(${this.precision}, ${this.scale})`;
		else if (this.precision === void 0) return "numeric";
		else return `numeric(${this.precision})`;
	}
};
var PgNumericBigIntBuilder = class extends PgColumnBuilder {
	static [entityKind] = "PgNumericBigIntBuilder";
	constructor(name, precision, scale) {
		super(name, "bigint int64", "PgNumericBigInt");
		this.config.precision = precision;
		this.config.scale = scale;
	}
	/** @internal */
	build(table) {
		return new PgNumericBigInt(table, this.config);
	}
};
var PgNumericBigInt = class extends PgColumn {
	static [entityKind] = "PgNumericBigInt";
	precision;
	scale;
	constructor(table, config) {
		super(table, config);
		this.precision = config.precision;
		this.scale = config.scale;
	}
	mapFromDriverValue(value) {
		return BigInt(value);
	}
	mapToDriverValue(value) {
		return String(value);
	}
	getSQLType() {
		if (this.precision !== void 0 && this.scale !== void 0) return `numeric(${this.precision}, ${this.scale})`;
		else if (this.precision === void 0) return "numeric";
		else return `numeric(${this.precision})`;
	}
};
function numeric(a, b) {
	const { name, config } = getColumnNameAndConfig(a, b);
	const mode = config?.mode;
	return mode === "number" ? new PgNumericNumberBuilder(name, config?.precision, config?.scale) : mode === "bigint" ? new PgNumericBigIntBuilder(name, config?.precision, config?.scale) : new PgNumericBuilder(name, config?.precision, config?.scale);
}
const decimal = numeric;

//#endregion
export { PgNumeric, PgNumericBigInt, PgNumericBigIntBuilder, PgNumericBuilder, PgNumericNumber, PgNumericNumberBuilder, decimal, numeric };
//# sourceMappingURL=numeric.js.map