const require_rolldown_runtime = require('../_virtual/rolldown_runtime.cjs');
const require_gel_core_columns_all = require('./columns/all.cjs');
let __entity_ts = require("../entity.cjs");
let __table_ts = require("../table.cjs");

//#region src/gel-core/table.ts
/** @internal */
const InlineForeignKeys = Symbol.for("drizzle:GelInlineForeignKeys");
/** @internal */
const EnableRLS = Symbol.for("drizzle:EnableRLS");
var GelTable = class extends __table_ts.Table {
	static [__entity_ts.entityKind] = "GelTable";
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
function gelTableWithSchema(name, columns, extraConfig, schema, baseName = name) {
	const rawTable = new GelTable(name, schema, baseName);
	const parsedColumns = typeof columns === "function" ? columns(require_gel_core_columns_all.getGelColumnBuilders()) : columns;
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
	if (extraConfig) table[GelTable.Symbol.ExtraConfigBuilder] = extraConfig;
	return Object.assign(table, { enableRLS: () => {
		table[GelTable.Symbol.EnableRLS] = true;
		return table;
	} });
}
const gelTable = (name, columns, extraConfig) => {
	return gelTableWithSchema(name, columns, extraConfig, void 0);
};
function gelTableCreator(customizeTableName) {
	return (name, columns, extraConfig) => {
		return gelTableWithSchema(customizeTableName(name), columns, extraConfig, void 0, name);
	};
}

//#endregion
exports.EnableRLS = EnableRLS;
exports.GelTable = GelTable;
exports.InlineForeignKeys = InlineForeignKeys;
exports.gelTable = gelTable;
exports.gelTableCreator = gelTableCreator;
exports.gelTableWithSchema = gelTableWithSchema;
//# sourceMappingURL=table.cjs.map