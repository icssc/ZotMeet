import { sqliteTable } from "./table.js";
import { SQLiteViewBase } from "./view-base.js";
import { QueryBuilder } from "./query-builders/query-builder.js";
import { entityKind } from "../entity.js";
import { getTableColumns } from "../utils.js";
import { SelectionProxyHandler } from "../selection-proxy.js";

//#region src/sqlite-core/view.ts
var ViewBuilderCore = class {
	static [entityKind] = "SQLiteViewBuilderCore";
	constructor(name) {
		this.name = name;
	}
	config = {};
};
var ViewBuilder = class extends ViewBuilderCore {
	static [entityKind] = "SQLiteViewBuilder";
	as(qb) {
		if (typeof qb === "function") qb = qb(new QueryBuilder());
		const selectionProxy = new SelectionProxyHandler({
			alias: this.name,
			sqlBehavior: "error",
			sqlAliasedBehavior: "alias",
			replaceOriginalName: true
		});
		const aliasedSelectedFields = qb.getSelectedFields();
		return new Proxy(new SQLiteView({ config: {
			name: this.name,
			schema: void 0,
			selectedFields: aliasedSelectedFields,
			query: qb.getSQL().inlineParams()
		} }), selectionProxy);
	}
};
var ManualViewBuilder = class extends ViewBuilderCore {
	static [entityKind] = "SQLiteManualViewBuilder";
	columns;
	constructor(name, columns) {
		super(name);
		this.columns = getTableColumns(sqliteTable(name, columns));
	}
	existing() {
		return new Proxy(new SQLiteView({ config: {
			name: this.name,
			schema: void 0,
			selectedFields: this.columns,
			query: void 0
		} }), new SelectionProxyHandler({
			alias: this.name,
			sqlBehavior: "error",
			sqlAliasedBehavior: "alias",
			replaceOriginalName: true
		}));
	}
	as(query) {
		return new Proxy(new SQLiteView({ config: {
			name: this.name,
			schema: void 0,
			selectedFields: this.columns,
			query: query.inlineParams()
		} }), new SelectionProxyHandler({
			alias: this.name,
			sqlBehavior: "error",
			sqlAliasedBehavior: "alias",
			replaceOriginalName: true
		}));
	}
};
var SQLiteView = class extends SQLiteViewBase {
	static [entityKind] = "SQLiteView";
	constructor({ config }) {
		super(config);
	}
};
function sqliteView(name, selection) {
	if (selection) return new ManualViewBuilder(name, selection);
	return new ViewBuilder(name);
}
const view = sqliteView;

//#endregion
export { ManualViewBuilder, SQLiteView, ViewBuilder, ViewBuilderCore, sqliteView, view };
//# sourceMappingURL=view.js.map