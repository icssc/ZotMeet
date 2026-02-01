import { entityKind } from "../../entity.js";
import { Column } from "../../column.js";
import { ColumnBuilder } from "../../column-builder.js";
import { ForeignKeyBuilder } from "../foreign-keys.js";

//#region src/sqlite-core/columns/common.ts
var SQLiteColumnBuilder = class extends ColumnBuilder {
	static [entityKind] = "SQLiteColumnBuilder";
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
				const builder = new ForeignKeyBuilder(() => {
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
var SQLiteColumn = class extends Column {
	static [entityKind] = "SQLiteColumn";
	/** @internal */
	table;
	constructor(table, config) {
		super(table, config);
		this.table = table;
	}
};

//#endregion
export { SQLiteColumn, SQLiteColumnBuilder };
//# sourceMappingURL=common.js.map