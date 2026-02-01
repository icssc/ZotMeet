import { parsePgArray } from "../utils/array.js";
import { PgColumn, PgColumnBuilder } from "./common.js";
import { entityKind } from "../../entity.js";
import { getColumnNameAndConfig } from "../../utils.js";

//#region src/pg-core/columns/custom.ts
var PgCustomColumnBuilder = class extends PgColumnBuilder {
	static [entityKind] = "PgCustomColumnBuilder";
	constructor(name, fieldConfig, customTypeParams) {
		super(name, "custom", "PgCustomColumn");
		this.config.fieldConfig = fieldConfig;
		this.config.customTypeParams = customTypeParams;
	}
	/** @internal */
	build(table) {
		return new PgCustomColumn(table, this.config);
	}
};
var PgCustomColumn = class extends PgColumn {
	static [entityKind] = "PgCustomColumn";
	sqlName;
	mapTo;
	mapFrom;
	mapJson;
	forJsonSelect;
	constructor(table, config) {
		super(table, config);
		this.sqlName = config.customTypeParams.dataType(config.fieldConfig);
		this.mapTo = config.customTypeParams.toDriver;
		this.mapFrom = config.customTypeParams.fromDriver;
		this.mapJson = config.customTypeParams.fromJson;
		this.forJsonSelect = config.customTypeParams.forJsonSelect;
		if (this.dimensions) {
			const elementMapper = (value) => {
				if (typeof this.mapJson === "function") return this.mapJson(value);
				if (typeof this.mapFrom === "function") return this.mapFrom(value);
				return value;
			};
			this.mapFromJsonValue = (value) => {
				if (value === null) return value;
				const arr = typeof value === "string" ? parsePgArray(value) : value;
				return this.mapJsonArrayElements(arr, elementMapper, this.dimensions);
			};
		}
	}
	/** @internal */
	mapJsonArrayElements(value, mapper, depth) {
		if (depth > 0 && Array.isArray(value)) return value.map((v) => v === null ? null : this.mapJsonArrayElements(v, mapper, depth - 1));
		return mapper(value);
	}
	getSQLType() {
		return this.sqlName;
	}
	mapFromDriverValue(value) {
		return typeof this.mapFrom === "function" ? this.mapFrom(value) : value;
	}
	mapFromJsonValue(value) {
		return typeof this.mapJson === "function" ? this.mapJson(value) : this.mapFromDriverValue(value);
	}
	jsonSelectIdentifier(identifier, sql, arrayDimensions) {
		if (typeof this.forJsonSelect === "function") return this.forJsonSelect(identifier, sql, arrayDimensions);
		const rawType = this.getSQLType().toLowerCase();
		const parenPos = rawType.indexOf("(");
		switch (parenPos + 1 ? rawType.slice(0, parenPos) : rawType) {
			case "bytea":
			case "geometry":
			case "timestamp":
			case "numeric":
			case "bigint": {
				const arrVal = "[]".repeat(arrayDimensions ?? 0);
				return sql`${identifier}::text${sql.raw(arrVal).if(arrayDimensions)}`;
			}
			default: return identifier;
		}
	}
	mapToDriverValue(value) {
		return typeof this.mapTo === "function" ? this.mapTo(value) : value;
	}
};
/**
* Custom pg database data type generator
*/
function customType(customTypeParams) {
	return (a, b) => {
		const { name, config } = getColumnNameAndConfig(a, b);
		return new PgCustomColumnBuilder(name, config, customTypeParams);
	};
}

//#endregion
export { PgCustomColumn, PgCustomColumnBuilder, customType };
//# sourceMappingURL=custom.js.map