const require_rolldown_runtime = require('../_virtual/rolldown_runtime.cjs');
const require_mysql_core_table = require('./table.cjs');
const require_mysql_core_view_base = require('./view-base.cjs');
const require_mysql_core_view_common = require('./view-common.cjs');
const require_mysql_core_query_builders_query_builder = require('./query-builders/query-builder.cjs');
let __entity_ts = require("../entity.cjs");
let __utils_ts = require("../utils.cjs");
let __selection_proxy_ts = require("../selection-proxy.cjs");

//#region src/mysql-core/view.ts
var ViewBuilderCore = class {
	static [__entity_ts.entityKind] = "MySqlViewBuilder";
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
	static [__entity_ts.entityKind] = "MySqlViewBuilder";
	as(qb) {
		if (typeof qb === "function") qb = qb(new require_mysql_core_query_builders_query_builder.QueryBuilder());
		const selectionProxy = new __selection_proxy_ts.SelectionProxyHandler({
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
	static [__entity_ts.entityKind] = "MySqlManualViewBuilder";
	columns;
	constructor(name, columns, schema) {
		super(name, schema);
		this.columns = (0, __utils_ts.getTableColumns)(require_mysql_core_table.mysqlTable(name, columns));
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
		}), new __selection_proxy_ts.SelectionProxyHandler({
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
		}), new __selection_proxy_ts.SelectionProxyHandler({
			alias: this.name,
			sqlBehavior: "error",
			sqlAliasedBehavior: "alias",
			replaceOriginalName: true
		}));
	}
};
var MySqlView = class extends require_mysql_core_view_base.MySqlViewBase {
	static [__entity_ts.entityKind] = "MySqlView";
	[require_mysql_core_view_common.MySqlViewConfig];
	constructor({ mysqlConfig, config }) {
		super(config);
		this[require_mysql_core_view_common.MySqlViewConfig] = mysqlConfig;
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
exports.ManualViewBuilder = ManualViewBuilder;
exports.MySqlView = MySqlView;
exports.ViewBuilder = ViewBuilder;
exports.ViewBuilderCore = ViewBuilderCore;
exports.mysqlView = mysqlView;
exports.mysqlViewWithSchema = mysqlViewWithSchema;
//# sourceMappingURL=view.cjs.map