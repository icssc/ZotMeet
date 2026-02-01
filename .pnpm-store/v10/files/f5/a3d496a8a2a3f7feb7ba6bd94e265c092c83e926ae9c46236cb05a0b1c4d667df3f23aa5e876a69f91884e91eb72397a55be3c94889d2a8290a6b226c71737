const require_rolldown_runtime = require('../_virtual/rolldown_runtime.cjs');
const require_gel_core_table = require('./table.cjs');
const require_gel_core_view_base = require('./view-base.cjs');
const require_gel_core_view_common = require('./view-common.cjs');
const require_gel_core_query_builders_query_builder = require('./query-builders/query-builder.cjs');
let __entity_ts = require("../entity.cjs");
let __utils_ts = require("../utils.cjs");
let __selection_proxy_ts = require("../selection-proxy.cjs");

//#region src/gel-core/view.ts
var DefaultViewBuilderCore = class {
	static [__entity_ts.entityKind] = "GelDefaultViewBuilderCore";
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
	static [__entity_ts.entityKind] = "GelViewBuilder";
	as(qb) {
		if (typeof qb === "function") qb = qb(new require_gel_core_query_builders_query_builder.QueryBuilder());
		const selectionProxy = new __selection_proxy_ts.SelectionProxyHandler({
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
	static [__entity_ts.entityKind] = "GelManualViewBuilder";
	columns;
	constructor(name, columns, schema) {
		super(name, schema);
		this.columns = (0, __utils_ts.getTableColumns)(require_gel_core_table.gelTable(name, columns));
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
		}), new __selection_proxy_ts.SelectionProxyHandler({
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
		}), new __selection_proxy_ts.SelectionProxyHandler({
			alias: this.name,
			sqlBehavior: "error",
			sqlAliasedBehavior: "alias",
			replaceOriginalName: true
		}));
	}
};
var MaterializedViewBuilderCore = class {
	static [__entity_ts.entityKind] = "GelMaterializedViewBuilderCore";
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
	static [__entity_ts.entityKind] = "GelMaterializedViewBuilder";
	as(qb) {
		if (typeof qb === "function") qb = qb(new require_gel_core_query_builders_query_builder.QueryBuilder());
		const selectionProxy = new __selection_proxy_ts.SelectionProxyHandler({
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
	static [__entity_ts.entityKind] = "GelManualMaterializedViewBuilder";
	columns;
	constructor(name, columns, schema) {
		super(name, schema);
		this.columns = (0, __utils_ts.getTableColumns)(require_gel_core_table.gelTable(name, columns));
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
		}), new __selection_proxy_ts.SelectionProxyHandler({
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
		}), new __selection_proxy_ts.SelectionProxyHandler({
			alias: this.name,
			sqlBehavior: "error",
			sqlAliasedBehavior: "alias",
			replaceOriginalName: true
		}));
	}
};
var GelView = class extends require_gel_core_view_base.GelViewBase {
	static [__entity_ts.entityKind] = "GelView";
	[require_gel_core_view_common.GelViewConfig];
	constructor({ GelConfig, config }) {
		super(config);
		if (GelConfig) this[require_gel_core_view_common.GelViewConfig] = { with: GelConfig.with };
	}
};
var GelMaterializedView = class extends require_gel_core_view_base.GelViewBase {
	static [__entity_ts.entityKind] = "GelMaterializedView";
	[require_gel_core_view_common.GelMaterializedViewConfig];
	constructor({ GelConfig, config }) {
		super(config);
		this[require_gel_core_view_common.GelMaterializedViewConfig] = {
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
exports.DefaultViewBuilderCore = DefaultViewBuilderCore;
exports.GelMaterializedView = GelMaterializedView;
exports.GelView = GelView;
exports.ManualMaterializedViewBuilder = ManualMaterializedViewBuilder;
exports.ManualViewBuilder = ManualViewBuilder;
exports.MaterializedViewBuilder = MaterializedViewBuilder;
exports.MaterializedViewBuilderCore = MaterializedViewBuilderCore;
exports.ViewBuilder = ViewBuilder;
exports.gelMaterializedViewWithSchema = gelMaterializedViewWithSchema;
exports.gelViewWithSchema = gelViewWithSchema;
//# sourceMappingURL=view.cjs.map