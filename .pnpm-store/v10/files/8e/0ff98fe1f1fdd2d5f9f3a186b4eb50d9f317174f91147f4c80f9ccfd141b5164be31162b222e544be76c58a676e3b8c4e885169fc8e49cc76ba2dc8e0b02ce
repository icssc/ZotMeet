const require_rolldown_runtime = require('../_virtual/rolldown_runtime.cjs');
const require_cockroach_core_table = require('./table.cjs');
const require_cockroach_core_view_base = require('./view-base.cjs');
const require_cockroach_core_query_builders_query_builder = require('./query-builders/query-builder.cjs');
let __entity_ts = require("../entity.cjs");
let __utils_ts = require("../utils.cjs");
let __selection_proxy_ts = require("../selection-proxy.cjs");

//#region src/cockroach-core/view.ts
var DefaultViewBuilderCore = class {
	static [__entity_ts.entityKind] = "CockroachDefaultViewBuilderCore";
	constructor(name, schema) {
		this.name = name;
		this.schema = schema;
	}
};
var ViewBuilder = class extends DefaultViewBuilderCore {
	static [__entity_ts.entityKind] = "CockroachViewBuilder";
	as(qb) {
		if (typeof qb === "function") qb = qb(new require_cockroach_core_query_builders_query_builder.QueryBuilder());
		const selectionProxy = new __selection_proxy_ts.SelectionProxyHandler({
			alias: this.name,
			sqlBehavior: "error",
			sqlAliasedBehavior: "alias",
			replaceOriginalName: true
		});
		const aliasedSelection = new Proxy(qb.getSelectedFields(), selectionProxy);
		return new Proxy(new CockroachView({ config: {
			name: this.name,
			schema: this.schema,
			selectedFields: aliasedSelection,
			query: qb.getSQL().inlineParams()
		} }), selectionProxy);
	}
};
var ManualViewBuilder = class extends DefaultViewBuilderCore {
	static [__entity_ts.entityKind] = "CockroachManualViewBuilder";
	columns;
	constructor(name, columns, schema) {
		super(name, schema);
		this.columns = (0, __utils_ts.getTableColumns)(require_cockroach_core_table.cockroachTable(name, columns));
	}
	existing() {
		return new Proxy(new CockroachView({ config: {
			name: this.name,
			schema: this.schema,
			selectedFields: this.columns,
			query: void 0
		} }), new __selection_proxy_ts.SelectionProxyHandler({
			alias: this.name,
			sqlBehavior: "error",
			sqlAliasedBehavior: "alias",
			replaceOriginalName: true
		}));
	}
	as(query) {
		return new Proxy(new CockroachView({ config: {
			name: this.name,
			schema: this.schema,
			selectedFields: this.columns,
			query: query.inlineParams()
		} }), new __selection_proxy_ts.SelectionProxyHandler({
			alias: this.name,
			sqlBehavior: "error",
			sqlAliasedBehavior: "alias",
			replaceOriginalName: true
		}));
	}
};
var MaterializedViewBuilderCore = class {
	static [__entity_ts.entityKind] = "CockroachMaterializedViewBuilderCore";
	constructor(name, schema) {
		this.name = name;
		this.schema = schema;
	}
	config = {};
	withNoData() {
		this.config.withNoData = true;
		return this;
	}
};
var MaterializedViewBuilder = class extends MaterializedViewBuilderCore {
	static [__entity_ts.entityKind] = "CockroachMaterializedViewBuilder";
	as(qb) {
		if (typeof qb === "function") qb = qb(new require_cockroach_core_query_builders_query_builder.QueryBuilder());
		const selectionProxy = new __selection_proxy_ts.SelectionProxyHandler({
			alias: this.name,
			sqlBehavior: "error",
			sqlAliasedBehavior: "alias",
			replaceOriginalName: true
		});
		const aliasedSelection = new Proxy(qb.getSelectedFields(), selectionProxy);
		return new Proxy(new CockroachMaterializedView({
			cockroachConfig: { withNoData: this.config.withNoData },
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
	static [__entity_ts.entityKind] = "CockroachManualMaterializedViewBuilder";
	columns;
	constructor(name, columns, schema) {
		super(name, schema);
		this.columns = (0, __utils_ts.getTableColumns)(require_cockroach_core_table.cockroachTable(name, columns));
	}
	existing() {
		return new Proxy(new CockroachMaterializedView({
			cockroachConfig: { withNoData: this.config.withNoData },
			config: {
				name: this.name,
				schema: this.schema,
				selectedFields: this.columns,
				query: void 0
			}
		}), new __selection_proxy_ts.SelectionProxyHandler({
			alias: this.name,
			sqlBehavior: "error",
			sqlAliasedBehavior: "alias",
			replaceOriginalName: true
		}));
	}
	as(query) {
		return new Proxy(new CockroachMaterializedView({
			cockroachConfig: { withNoData: this.config.withNoData },
			config: {
				name: this.name,
				schema: this.schema,
				selectedFields: this.columns,
				query: query.inlineParams()
			}
		}), new __selection_proxy_ts.SelectionProxyHandler({
			alias: this.name,
			sqlBehavior: "error",
			sqlAliasedBehavior: "alias",
			replaceOriginalName: true
		}));
	}
};
var CockroachView = class extends require_cockroach_core_view_base.CockroachViewBase {
	static [__entity_ts.entityKind] = "CockroachView";
	constructor({ config }) {
		super(config);
	}
};
const CockroachMaterializedViewConfig = Symbol.for("drizzle:CockroachMaterializedViewConfig");
var CockroachMaterializedView = class extends require_cockroach_core_view_base.CockroachViewBase {
	static [__entity_ts.entityKind] = "CockroachMaterializedView";
	[CockroachMaterializedViewConfig];
	constructor({ cockroachConfig, config }) {
		super(config);
		this[CockroachMaterializedViewConfig] = { withNoData: cockroachConfig?.withNoData };
	}
};
/** @internal */
function cockroachViewWithSchema(name, selection, schema) {
	if (selection) return new ManualViewBuilder(name, selection, schema);
	return new ViewBuilder(name, schema);
}
/** @internal */
function cockroachMaterializedViewWithSchema(name, selection, schema) {
	if (selection) return new ManualMaterializedViewBuilder(name, selection, schema);
	return new MaterializedViewBuilder(name, schema);
}
function cockroachView(name, columns) {
	return cockroachViewWithSchema(name, columns, void 0);
}
function cockroachMaterializedView(name, columns) {
	return cockroachMaterializedViewWithSchema(name, columns, void 0);
}
function isCockroachView(obj) {
	return (0, __entity_ts.is)(obj, CockroachView);
}
function isCockroachMaterializedView(obj) {
	return (0, __entity_ts.is)(obj, CockroachMaterializedView);
}

//#endregion
exports.CockroachMaterializedView = CockroachMaterializedView;
exports.CockroachMaterializedViewConfig = CockroachMaterializedViewConfig;
exports.CockroachView = CockroachView;
exports.DefaultViewBuilderCore = DefaultViewBuilderCore;
exports.ManualMaterializedViewBuilder = ManualMaterializedViewBuilder;
exports.ManualViewBuilder = ManualViewBuilder;
exports.MaterializedViewBuilder = MaterializedViewBuilder;
exports.MaterializedViewBuilderCore = MaterializedViewBuilderCore;
exports.ViewBuilder = ViewBuilder;
exports.cockroachMaterializedView = cockroachMaterializedView;
exports.cockroachMaterializedViewWithSchema = cockroachMaterializedViewWithSchema;
exports.cockroachView = cockroachView;
exports.cockroachViewWithSchema = cockroachViewWithSchema;
exports.isCockroachMaterializedView = isCockroachMaterializedView;
exports.isCockroachView = isCockroachView;
//# sourceMappingURL=view.cjs.map