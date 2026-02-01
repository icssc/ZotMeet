const require_rolldown_runtime = require('../../_virtual/rolldown_runtime.cjs');
let __entity_ts = require("../../entity.cjs");
let __column_ts = require("../../column.cjs");
let __column_builder_ts = require("../../column-builder.cjs");
let __sqlite_core_foreign_keys_ts = require("../foreign-keys.cjs");

//#region src/sqlite-core/columns/common.ts
var SQLiteColumnBuilder = class extends __column_builder_ts.ColumnBuilder {
	static [__entity_ts.entityKind] = "SQLiteColumnBuilder";
	foreignKeyConfigs = [];
	references(ref, actions = {}) {
		this.foreignKeyConfigs.push({
			ref,
			actions
		});
		return this;
	}
	unique(name) {
		this.config.isUnique = true;
		this.config.uniqueName = name;
		return this;
	}
	generatedAlwaysAs(as, config) {
		this.config.generated = {
			as,
			type: "always",
			mode: config?.mode ?? "virtual"
		};
		return this;
	}
	/** @internal */
	buildForeignKeys(column, table) {
		return this.foreignKeyConfigs.map(({ ref, actions }) => {
			return ((ref$1, actions$1) => {
				const builder = new __sqlite_core_foreign_keys_ts.ForeignKeyBuilder(() => {
					const foreignColumn = ref$1();
					return {
						columns: [column],
						foreignColumns: [foreignColumn]
					};
				});
				if (actions$1.onUpdate) builder.onUpdate(actions$1.onUpdate);
				if (actions$1.onDelete) builder.onDelete(actions$1.onDelete);
				return builder.build(table);
			})(ref, actions);
		});
	}
};
var SQLiteColumn = class extends __column_ts.Column {
	static [__entity_ts.entityKind] = "SQLiteColumn";
	/** @internal */
	table;
	constructor(table, config) {
		super(table, config);
		this.table = table;
	}
};

//#endregion
exports.SQLiteColumn = SQLiteColumn;
exports.SQLiteColumnBuilder = SQLiteColumnBuilder;
//# sourceMappingURL=common.cjs.map