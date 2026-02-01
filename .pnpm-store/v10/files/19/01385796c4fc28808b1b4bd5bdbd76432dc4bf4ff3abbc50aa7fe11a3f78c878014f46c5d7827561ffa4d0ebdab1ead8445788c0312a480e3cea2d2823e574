const require_rolldown_runtime = require('../_virtual/rolldown_runtime.cjs');
let __entity_ts = require("../entity.cjs");
let __subquery_ts = require("../subquery.cjs");
let __sql_sql_ts = require("../sql/sql.cjs");
let __sqlite_core_index_ts = require("../sqlite-core/index.cjs");
let react = require("react");
let expo_sqlite = require("expo-sqlite");
let __sqlite_core_query_builders__query_ts = require("../sqlite-core/query-builders/_query.cjs");
__sqlite_core_query_builders__query_ts = require_rolldown_runtime.__toESM(__sqlite_core_query_builders__query_ts);
let __sqlite_core_query_builders_query_ts = require("../sqlite-core/query-builders/query.cjs");

//#region src/expo-sqlite/query.ts
const useLiveQuery = (query, deps = []) => {
	const [data, setData] = (0, react.useState)((0, __entity_ts.is)(query, __sqlite_core_query_builders__query_ts.SQLiteRelationalQuery) || (0, __entity_ts.is)(query, __sqlite_core_query_builders_query_ts.SQLiteRelationalQuery) && query.mode === "first" ? void 0 : []);
	const [error, setError] = (0, react.useState)();
	const [updatedAt, setUpdatedAt] = (0, react.useState)();
	(0, react.useEffect)(() => {
		const entity = (0, __entity_ts.is)(query, __sqlite_core_query_builders__query_ts.SQLiteRelationalQuery) || (0, __entity_ts.is)(query, __sqlite_core_query_builders_query_ts.SQLiteRelationalQuery) ? query.table : query.config.table;
		if ((0, __entity_ts.is)(entity, __subquery_ts.Subquery) || (0, __entity_ts.is)(entity, __sql_sql_ts.SQL)) {
			setError(/* @__PURE__ */ new Error("Selecting from subqueries and SQL are not supported in useLiveQuery"));
			return;
		}
		let listener;
		const handleData = (data$1) => {
			setData(data$1);
			setUpdatedAt(/* @__PURE__ */ new Date());
		};
		query.then(handleData).catch(setError);
		if ((0, __entity_ts.is)(entity, __sqlite_core_index_ts.SQLiteTable) || (0, __entity_ts.is)(entity, __sqlite_core_index_ts.SQLiteView)) {
			const config = (0, __entity_ts.is)(entity, __sqlite_core_index_ts.SQLiteTable) ? (0, __sqlite_core_index_ts.getTableConfig)(entity) : (0, __sqlite_core_index_ts.getViewConfig)(entity);
			listener = (0, expo_sqlite.addDatabaseChangeListener)(({ tableName }) => {
				if (config.name === tableName) query.then(handleData).catch(setError);
			});
		}
		return () => {
			listener?.remove();
		};
	}, deps);
	return {
		data,
		error,
		updatedAt
	};
};

//#endregion
exports.useLiveQuery = useLiveQuery;
//# sourceMappingURL=query.cjs.map