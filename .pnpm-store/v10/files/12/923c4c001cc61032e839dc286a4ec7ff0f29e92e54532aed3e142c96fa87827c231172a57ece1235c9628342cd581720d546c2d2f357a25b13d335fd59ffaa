import { gelTable } from "./table.js";
import { GelViewBase } from "./view-base.js";
import { GelMaterializedViewConfig, GelViewConfig } from "./view-common.js";
import { QueryBuilder } from "./query-builders/query-builder.js";
import { entityKind, is } from "../entity.js";
import { getTableColumns } from "../utils.js";
import { SelectionProxyHandler } from "../selection-proxy.js";

//#region src/gel-core/view.ts
var DefaultViewBuilderCore = class {
	static [entityKind] = "GelDefaultViewBuilderCore";
	constructor(name, schema) {
		this.name = name;
		this.schema = schema;
	}
	config = {};
	with(config) {
		this.config.with = config;
		return this;
	}
};
var ViewBuilder = class extends DefaultViewBuilderCore {
	static [entityKind] = "GelViewBuilder";
	as(qb) {
		if (typeof qb === "function") qb = qb(new QueryBuilder());
		const selectionProxy = new SelectionProxyHandler({
			alias: this.name,
			sqlBehavior: "error",
			sqlAliasedBehavior: "alias",
			replaceOriginalName: true
		});
		const aliasedSelection = new Proxy(qb.getSelectedFields(), selectionProxy);
		return new Proxy(new GelView({
			GelConfig: this.config,
			config: {
				name: this.name,
				schema: this.schema,
				selectedFields: aliasedSelection,
				query: qb.getSQL().inlineParams()
			}
		}), selectionProxy);
	}
};
var ManualViewBuilder = class extends DefaultViewBuilderCore {
	static [entityKind] = "GelManualViewBuilder";
	columns;
	constructor(name, columns, schema) {
		super(name, schema);
		this.columns = getTableColumns(gelTable(name, columns));
	}
	existing() {
		return new Proxy(new GelView({
			GelConfig: void 0,
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
		return new Proxy(new GelView({
			GelConfig: this.config,
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
var MaterializedViewBuilderCore = class {
	static [entityKind] = "GelMaterializedViewBuilderCore";
	constructor(name, schema) {
		this.name = name;
		this.schema = schema;
	}
	config = {};
	using(using) {
		this.config.using = using;
		return this;
	}
	with(config) {
		this.config.with = config;
		return this;
	}
	tablespace(tablespace) {
		this.config.tablespace = tablespace;
		return this;
	}
	withNoData() {
		this.config.withNoData = true;
		return this;
	}
};
var MaterializedViewBuilder = class extends MaterializedViewBuilderCore {
	static [entityKind] = "GelMaterializedViewBuilder";
	as(qb) {
		if (typeof qb === "function") qb = qb(new QueryBuilder());
		const selectionProxy = new SelectionProxyHandler({
			alias: this.name,
			sqlBehavior: "error",
			sqlAliasedBehavior: "alias",
			replaceOriginalName: true
		});
		const aliasedSelection = new Proxy(qb.getSelectedFields(), selectionProxy);
		return new Proxy(new GelMaterializedView({
			GelConfig: {
				with: this.config.with,
				using: this.config.using,
				tablespace: this.config.tablespace,
				withNoData: this.config.withNoData
			},
			config: {
				name: this.name,
				schema: this.schema,
				selectedFields: aliasedSelection,
				query: qb.getSQL().inlineParams()
			}
		}), selectionProxy);
	}
};
var ManualMaterializedViewBuilder = class extends MaterializedViewBuilderCore {
	static [entityKind] = "GelManualMaterializedViewBuilder";
	columns;
	constructor(name, columns, schema) {
		super(name, schema);
		this.columns = getTableColumns(gelTable(name, columns));
	}
	existing() {
		return new Proxy(new GelMaterializedView({
			GelConfig: {
				tablespace: this.config.tablespace,
				using: this.config.using,
				with: this.config.with,
				withNoData: this.config.withNoData
			},
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
		return new Proxy(new GelMaterializedView({
			GelConfig: {
				tablespace: this.config.tablespace,
				using: this.config.using,
				with: this.config.with,
				withNoData: this.config.withNoData
			},
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
var GelView = class extends GelViewBase {
	static [entityKind] = "GelView";
	[GelViewConfig];
	constructor({ GelConfig, config }) {
		super(config);
		if (GelConfig) this[GelViewConfig] = { with: GelConfig.with };
	}
};
var GelMaterializedView = class extends GelViewBase {
	static [entityKind] = "GelMaterializedView";
	[GelMaterializedViewConfig];
	constructor({ GelConfig, config }) {
		super(config);
		this[GelMaterializedViewConfig] = {
			with: GelConfig?.with,
			using: GelConfig?.using,
			tablespace: GelConfig?.tablespace,
			withNoData: GelConfig?.withNoData
		};
	}
};
/** @internal */
function gelViewWithSchema(name, selection, schema) {
	if (selection) return new ManualViewBuilder(name, selection, schema);
	return new ViewBuilder(name, schema);
}
/** @internal */
function gelMaterializedViewWithSchema(name, selection, schema) {
	if (selection) return new ManualMaterializedViewBuilder(name, selection, schema);
	return new MaterializedViewBuilder(name, schema);
}

//#endregion
export { DefaultViewBuilderCore, GelMaterializedView, GelView, ManualMaterializedViewBuilder, ManualViewBuilder, MaterializedViewBuilder, MaterializedViewBuilderCore, ViewBuilder, gelMaterializedViewWithSchema, gelViewWithSchema };
//# sourceMappingURL=view.js.map