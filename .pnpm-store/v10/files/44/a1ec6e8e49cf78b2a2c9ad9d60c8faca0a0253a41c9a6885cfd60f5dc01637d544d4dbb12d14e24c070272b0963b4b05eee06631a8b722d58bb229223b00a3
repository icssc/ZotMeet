import { mysqlTable } from "./table.js";
import { MySqlViewBase } from "./view-base.js";
import { MySqlViewConfig } from "./view-common.js";
import { QueryBuilder } from "./query-builders/query-builder.js";
import { entityKind } from "../entity.js";
import { getTableColumns } from "../utils.js";
import { SelectionProxyHandler } from "../selection-proxy.js";

//#region src/mysql-core/view.ts
var ViewBuilderCore = class {
	static [entityKind] = "MySqlViewBuilder";
	constructor(name, schema) {
		this.name = name;
		this.schema = schema;
	}
	config = {};
	algorithm(algorithm) {
		this.config.algorithm = algorithm;
		return this;
	}
	sqlSecurity(sqlSecurity) {
		this.config.sqlSecurity = sqlSecurity;
		return this;
	}
	withCheckOption(withCheckOption) {
		this.config.withCheckOption = withCheckOption ?? "cascaded";
		return this;
	}
};
var ViewBuilder = class extends ViewBuilderCore {
	static [entityKind] = "MySqlViewBuilder";
	as(qb) {
		if (typeof qb === "function") qb = qb(new QueryBuilder());
		const selectionProxy = new SelectionProxyHandler({
			alias: this.name,
			sqlBehavior: "error",
			sqlAliasedBehavior: "alias",
			replaceOriginalName: true
		});
		const aliasedSelection = new Proxy(qb.getSelectedFields(), selectionProxy);
		return new Proxy(new MySqlView({
			mysqlConfig: this.config,
			config: {
				name: this.name,
				schema: this.schema,
				selectedFields: aliasedSelection,
				query: qb.getSQL().inlineParams()
			}
		}), selectionProxy);
	}
};
var ManualViewBuilder = class extends ViewBuilderCore {
	static [entityKind] = "MySqlManualViewBuilder";
	columns;
	constructor(name, columns, schema) {
		super(name, schema);
		this.columns = getTableColumns(mysqlTable(name, columns));
	}
	existing() {
		return new Proxy(new MySqlView({
			mysqlConfig: void 0,
			config: {
				name: this.name,
				schema: this.schema,
				selectedFields: this.columns,
				query: void 0
			}
		}), new SelectionProxyHandler({
			alias: this.name,
			sqlBehavior: "error",
			sqlAliasedBehavior: "alias",
			replaceOriginalName: true
		}));
	}
	as(query) {
		return new Proxy(new MySqlView({
			mysqlConfig: this.config,
			config: {
				name: this.name,
				schema: this.schema,
				selectedFields: this.columns,
				query: query.inlineParams()
			}
		}), new SelectionProxyHandler({
			alias: this.name,
			sqlBehavior: "error",
			sqlAliasedBehavior: "alias",
			replaceOriginalName: true
		}));
	}
};
var MySqlView = class extends MySqlViewBase {
	static [entityKind] = "MySqlView";
	[MySqlViewConfig];
	constructor({ mysqlConfig, config }) {
		super(config);
		this[MySqlViewConfig] = mysqlConfig;
	}
};
/** @internal */
function mysqlViewWithSchema(name, selection, schema) {
	if (selection) return new ManualViewBuilder(name, selection, schema);
	return new ViewBuilder(name, schema);
}
function mysqlView(name, selection) {
	return mysqlViewWithSchema(name, selection, void 0);
}

//#endregion
export { ManualViewBuilder, MySqlView, ViewBuilder, ViewBuilderCore, mysqlView, mysqlViewWithSchema };
//# sourceMappingURL=view.js.map