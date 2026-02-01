const require_rolldown_runtime = require('../_virtual/rolldown_runtime.cjs');
const require_pg_core_columns_all = require('./columns/all.cjs');
let __entity_ts = require("../entity.cjs");
let __table_ts = require("../table.cjs");

//#region src/pg-core/table.ts
/** @internal */
const InlineForeignKeys = Symbol.for("drizzle:PgInlineForeignKeys");
/** @internal */
const EnableRLS = Symbol.for("drizzle:EnableRLS");
var PgTable = class extends __table_ts.Table {
	static [__entity_ts.entityKind] = "PgTable";
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
function pgTableWithSchema(name, columns, extraConfig, schema, baseName = name) {
	const rawTable = new PgTable(name, schema, baseName);
	const parsedColumns = typeof columns === "function" ? columns(require_pg_core_columns_all.getPgColumnBuilders()) : columns;
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
	if (extraConfig) table[PgTable.Symbol.ExtraConfigBuilder] = extraConfig;
	return Object.assign(table, { enableRLS: () => {
		table[PgTable.Symbol.EnableRLS] = true;
		return table;
	} });
}
const pgTableInternal = (name, columns, extraConfig) => {
	return pgTableWithSchema(name, columns, extraConfig, void 0);
};
const pgTableWithRLS = (name, columns, extraConfig) => {
	const table = pgTableWithSchema(name, columns, extraConfig, void 0);
	table[EnableRLS] = true;
	return table;
};
const pgTable = Object.assign(pgTableInternal, { withRLS: pgTableWithRLS });
function pgTableCreator(customizeTableName) {
	const fn = (name, columns, extraConfig) => {
		return pgTableWithSchema(customizeTableName(name), columns, extraConfig, void 0, name);
	};
	return Object.assign(fn, { withRLS: ((name, columns, extraConfig) => {
		const table = pgTableWithSchema(customizeTableName(name), columns, extraConfig, void 0, name);
		table[EnableRLS] = true;
		return table;
	}) });
}

//#endregion
exports.EnableRLS = EnableRLS;
exports.InlineForeignKeys = InlineForeignKeys;
exports.PgTable = PgTable;
exports.pgTable = pgTable;
exports.pgTableCreator = pgTableCreator;
exports.pgTableWithSchema = pgTableWithSchema;
//# sourceMappingURL=table.cjs.map