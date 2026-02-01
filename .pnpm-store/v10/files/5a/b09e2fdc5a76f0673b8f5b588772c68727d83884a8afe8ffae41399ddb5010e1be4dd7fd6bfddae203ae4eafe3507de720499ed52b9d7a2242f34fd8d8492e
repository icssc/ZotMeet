const require_rolldown_runtime = require('../_virtual/rolldown_runtime.cjs');
const require_cockroach_core_columns_all = require('./columns/all.cjs');
let __entity_ts = require("../entity.cjs");
let __table_ts = require("../table.cjs");

//#region src/cockroach-core/table.ts
/** @internal */
const InlineForeignKeys = Symbol.for("drizzle:CockroachInlineForeignKeys");
/** @internal */
const EnableRLS = Symbol.for("drizzle:EnableRLS");
var CockroachTable = class extends __table_ts.Table {
	static [__entity_ts.entityKind] = "CockroachTable";
	/** @internal */
	static Symbol = Object.assign({}, __table_ts.Table.Symbol, {
		InlineForeignKeys,
		EnableRLS
	});
	/**@internal */
	[InlineForeignKeys] = [];
	/** @internal */
	[EnableRLS] = false;
	/** @internal */
	[__table_ts.Table.Symbol.ExtraConfigBuilder] = void 0;
	/** @internal */
	[__table_ts.Table.Symbol.ExtraConfigColumns] = {};
};
/** @internal */
function cockroachTableWithSchema(name, columns, extraConfig, schema, baseName = name) {
	const rawTable = new CockroachTable(name, schema, baseName);
	const parsedColumns = typeof columns === "function" ? columns(require_cockroach_core_columns_all.getCockroachColumnBuilders()) : columns;
	const builtColumns = Object.fromEntries(Object.entries(parsedColumns).map(([name$1, colBuilderBase]) => {
		const colBuilder = colBuilderBase;
		colBuilder.setName(name$1);
		const column = colBuilder.build(rawTable);
		rawTable[InlineForeignKeys].push(...colBuilder.buildForeignKeys(column, rawTable));
		return [name$1, column];
	}));
	const builtColumnsForExtraConfig = Object.fromEntries(Object.entries(parsedColumns).map(([name$1, colBuilderBase]) => {
		const colBuilder = colBuilderBase;
		colBuilder.setName(name$1);
		return [name$1, colBuilder.buildExtraConfigColumn(rawTable)];
	}));
	const table = Object.assign(rawTable, builtColumns);
	table[__table_ts.Table.Symbol.Columns] = builtColumns;
	table[__table_ts.Table.Symbol.ExtraConfigColumns] = builtColumnsForExtraConfig;
	if (extraConfig) table[CockroachTable.Symbol.ExtraConfigBuilder] = extraConfig;
	return Object.assign(table, { enableRLS: () => {
		table[CockroachTable.Symbol.EnableRLS] = true;
		return table;
	} });
}
const cockroachTableInternal = (name, columns, extraConfig) => {
	return cockroachTableWithSchema(name, columns, extraConfig, void 0);
};
const cockroachTableWithRLS = (name, columns, extraConfig) => {
	const table = cockroachTableWithSchema(name, columns, extraConfig, void 0);
	table[EnableRLS] = true;
	return table;
};
const cockroachTable = Object.assign(cockroachTableInternal, { withRLS: cockroachTableWithRLS });
function cockroachTableCreator(customizeTableName) {
	const fn = (name, columns, extraConfig) => {
		return cockroachTableWithSchema(customizeTableName(name), columns, extraConfig, void 0, name);
	};
	return Object.assign(fn, { withRLS: ((name, columns, extraConfig) => {
		const table = cockroachTableWithSchema(customizeTableName(name), columns, extraConfig, void 0, name);
		table[EnableRLS] = true;
		return table;
	}) });
}

//#endregion
exports.CockroachTable = CockroachTable;
exports.EnableRLS = EnableRLS;
exports.InlineForeignKeys = InlineForeignKeys;
exports.cockroachTable = cockroachTable;
exports.cockroachTableCreator = cockroachTableCreator;
exports.cockroachTableWithSchema = cockroachTableWithSchema;
//# sourceMappingURL=table.cjs.map