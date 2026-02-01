const require_rolldown_runtime = require('./_virtual/rolldown_runtime.cjs');
const require_entity = require('./entity.cjs');
const require_table = require('./table.cjs');
let __column_ts = require("./column.cjs");

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
	static [require_entity.entityKind] = "CasingCache";
	/** @internal */
	cache = {};
	cachedTables = {};
	convert;
	constructor(casing) {
		this.convert = casing === "snake_case" ? toSnakeCase : casing === "camelCase" ? toCamelCase : noopCase;
	}
	getColumnCasing(column) {
		if (!column.keyAsName) return column.name;
		const key = `${column.table[require_table.Table.Symbol.Schema] ?? "public"}.${column.table[require_table.Table.Symbol.OriginalName]}.${column.name}`;
		if (!this.cache[key]) this.cacheTable(column.table);
		return this.cache[key];
	}
	cacheTable(table) {
		const tableKey = `${table[require_table.Table.Symbol.Schema] ?? "public"}.${table[require_table.Table.Symbol.OriginalName]}`;
		if (!this.cachedTables[tableKey]) {
			for (const column of Object.values(table[require_table.Table.Symbol.Columns])) {
				if (!require_entity.is(column, __column_ts.Column)) continue;
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
exports.CasingCache = CasingCache;
exports.toCamelCase = toCamelCase;
exports.toSnakeCase = toSnakeCase;
//# sourceMappingURL=casing.cjs.map