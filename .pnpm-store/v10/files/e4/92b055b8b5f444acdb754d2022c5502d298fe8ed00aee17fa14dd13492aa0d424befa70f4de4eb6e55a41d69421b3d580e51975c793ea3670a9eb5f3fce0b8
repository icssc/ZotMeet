import { entityKind } from "../../entity.js";
import { Column } from "../../column.js";
import { ColumnBuilder } from "../../column-builder.js";
import { ForeignKeyBuilder } from "../foreign-keys.js";

//#region src/mssql-core/columns/common.ts
var MsSqlColumnBuilder = class extends ColumnBuilder {
	static [entityKind] = "MsSqlColumnBuilder";
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
var MsSqlColumn = class extends Column {
	static [entityKind] = "MsSqlColumn";
	/** @internal */
	table;
	constructor(table, config) {
		super(table, config);
		this.table = table;
	}
	/** @internal */
	shouldDisableInsert() {
		return false;
	}
};
var MsSqlColumnBuilderWithIdentity = class extends MsSqlColumnBuilder {
	static [entityKind] = "MsSqlColumnBuilderWithAutoIncrement";
	constructor(name, dataType, columnType) {
		super(name, dataType, columnType);
	}
	identity(config) {
		this.config.identity = {
			seed: config ? config.seed : 1,
			increment: config ? config.increment : 1
		};
		this.config.hasDefault = true;
		this.config.notNull = true;
		return this;
	}
};
var MsSqlColumnWithIdentity = class extends MsSqlColumn {
	static [entityKind] = "MsSqlColumnWithAutoIncrement";
	identity = this.config.identity;
	shouldDisableInsert() {
		return !!this.identity;
	}
};

//#endregion
export { MsSqlColumn, MsSqlColumnBuilder, MsSqlColumnBuilderWithIdentity, MsSqlColumnWithIdentity };
//# sourceMappingURL=common.js.map