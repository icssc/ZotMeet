import { entityKind, is } from "./entity.js";
import { Table } from "./table.js";
import { Column } from "./column.js";

//#region src/casing.ts
function toSnakeCase(input) {
	return (input.replace(/['\u2019]/g, "").match(/[\da-z]+|[A-Z]+(?![a-z])|[A-Z][\da-z]+/g) ?? []).map((word) => word.toLowerCase()).join("_");
}
function toCamelCase(input) {
	return (input.replace(/['\u2019]/g, "").match(/[\da-z]+|[A-Z]+(?![a-z])|[A-Z][\da-z]+/g) ?? []).reduce((acc, word, i) => {
		return acc + (i === 0 ? word.toLowerCase() : `${word[0].toUpperCase()}${word.slice(1)}`);
	}, "");
}
function noopCase(input) {
	return input;
}
var CasingCache = class {
	static [entityKind] = "CasingCache";
	/** @internal */
	cache = {};
	cachedTables = {};
	convert;
	constructor(casing) {
		this.convert = casing === "snake_case" ? toSnakeCase : casing === "camelCase" ? toCamelCase : noopCase;
	}
	getColumnCasing(column) {
		if (!column.keyAsName) return column.name;
		const key = `${column.table[Table.Symbol.Schema] ?? "public"}.${column.table[Table.Symbol.OriginalName]}.${column.name}`;
		if (!this.cache[key]) this.cacheTable(column.table);
		return this.cache[key];
	}
	cacheTable(table) {
		const tableKey = `${table[Table.Symbol.Schema] ?? "public"}.${table[Table.Symbol.OriginalName]}`;
		if (!this.cachedTables[tableKey]) {
			for (const column of Object.values(table[Table.Symbol.Columns])) {
				if (!is(column, Column)) continue;
				const columnKey = `${tableKey}.${column.name}`;
				this.cache[columnKey] = this.convert(column.name);
			}
			this.cachedTables[tableKey] = true;
		}
	}
	clearCache() {
		this.cache = {};
		this.cachedTables = {};
	}
};

//#endregion
export { CasingCache, toCamelCase, toSnakeCase };
//# sourceMappingURL=casing.js.map