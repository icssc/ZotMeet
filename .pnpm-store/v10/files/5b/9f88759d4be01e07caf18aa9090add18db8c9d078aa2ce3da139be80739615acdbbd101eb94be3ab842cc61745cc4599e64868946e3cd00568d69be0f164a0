const require_rolldown_runtime = require('../_virtual/rolldown_runtime.cjs');
const require_sqlite_core_db = require('./db.cjs');
let __entity_ts = require("../entity.cjs");
let __cache_core_cache_ts = require("../cache/core/cache.cjs");
let __errors_ts = require("../errors.cjs");
let __query_promise_ts = require("../query-promise.cjs");

//#region src/sqlite-core/session.ts
var ExecuteResultSync = class extends __query_promise_ts.QueryPromise {
	static [__entity_ts.entityKind] = "ExecuteResultSync";
	constructor(resultCb) {
		super();
		this.resultCb = resultCb;
	}
	async execute() {
		return this.resultCb();
	}
	sync() {
		return this.resultCb();
	}
};
var SQLitePreparedQuery = class {
	static [__entity_ts.entityKind] = "PreparedQuery";
	/** @internal */
	joinsNotNullableMap;
	constructor(mode, executeMethod, query, cache, queryMetadata, cacheConfig) {
		this.mode = mode;
		this.executeMethod = executeMethod;
		this.query = query;
		this.cache = cache;
		this.queryMetadata = queryMetadata;
		this.cacheConfig = cacheConfig;
		if (cache && cache.strategy() === "all" && cacheConfig === void 0) this.cacheConfig = {
			enabled: true,
			autoInvalidate: true
		};
		if (!this.cacheConfig?.enabled) this.cacheConfig = void 0;
	}
	/** @internal */
	async queryWithCache(queryString, params, query) {
		if (this.cache === void 0 || (0, __entity_ts.is)(this.cache, __cache_core_cache_ts.NoopCache) || this.queryMetadata === void 0) try {
			return await query();
		} catch (e) {
			throw new __errors_ts.DrizzleQueryError(queryString, params, e);
		}
		if (this.cacheConfig && !this.cacheConfig.enabled) try {
			return await query();
		} catch (e) {
			throw new __errors_ts.DrizzleQueryError(queryString, params, e);
		}
		if ((this.queryMetadata.type === "insert" || this.queryMetadata.type === "update" || this.queryMetadata.type === "delete") && this.queryMetadata.tables.length > 0) try {
			const [res] = await Promise.all([query(), this.cache.onMutate({ tables: this.queryMetadata.tables })]);
			return res;
		} catch (e) {
			throw new __errors_ts.DrizzleQueryError(queryString, params, e);
		}
		if (!this.cacheConfig) try {
			return await query();
		} catch (e) {
			throw new __errors_ts.DrizzleQueryError(queryString, params, e);
		}
		if (this.queryMetadata.type === "select") {
			const fromCache = await this.cache.get(this.cacheConfig.tag ?? await (0, __cache_core_cache_ts.hashQuery)(queryString, params), this.queryMetadata.tables, this.cacheConfig.tag !== void 0, this.cacheConfig.autoInvalidate);
			if (fromCache === void 0) {
				let result;
				try {
					result = await query();
				} catch (e) {
					throw new __errors_ts.DrizzleQueryError(queryString, params, e);
				}
				await this.cache.put(this.cacheConfig.tag ?? await (0, __cache_core_cache_ts.hashQuery)(queryString, params), result, this.cacheConfig.autoInvalidate ? this.queryMetadata.tables : [], this.cacheConfig.tag !== void 0, this.cacheConfig.config);
				return result;
			}
			return fromCache;
		}
		try {
			return await query();
		} catch (e) {
			throw new __errors_ts.DrizzleQueryError(queryString, params, e);
		}
	}
	getQuery() {
		return this.query;
	}
	mapRunResult(result, _isFromBatch) {
		return result;
	}
	mapAllResult(_result, _isFromBatch) {
		throw new Error("Not implemented");
	}
	mapGetResult(_result, _isFromBatch) {
		throw new Error("Not implemented");
	}
	execute(placeholderValues) {
		if (this.mode === "async") return this[this.executeMethod](placeholderValues);
		return new ExecuteResultSync(() => this[this.executeMethod](placeholderValues));
	}
	mapResult(response, isFromBatch) {
		switch (this.executeMethod) {
			case "run": return this.mapRunResult(response, isFromBatch);
			case "all": return this.mapAllResult(response, isFromBatch);
			case "get": return this.mapGetResult(response, isFromBatch);
		}
	}
};
var SQLiteSession = class {
	static [__entity_ts.entityKind] = "SQLiteSession";
	constructor(dialect) {
		this.dialect = dialect;
	}
	prepareOneTimeQuery(query, fields, executeMethod, isResponseInArrayMode, customResultMapper, queryMetadata, cacheConfig) {
		return this.prepareQuery(query, fields, executeMethod, isResponseInArrayMode, customResultMapper, queryMetadata, cacheConfig);
	}
	prepareOneTimeRelationalQuery(query, fields, executeMethod, customResultMapper) {
		return this.prepareRelationalQuery(query, fields, executeMethod, customResultMapper);
	}
	run(query) {
		const staticQuery = this.dialect.sqlToQuery(query);
		try {
			return this.prepareOneTimeQuery(staticQuery, void 0, "run", false).run();
		} catch (err) {
			throw new __errors_ts.DrizzleError({
				cause: err,
				message: `Failed to run the query '${staticQuery.sql}'`
			});
		}
	}
	/** @internal */
	extractRawRunValueFromBatchResult(result) {
		return result;
	}
	all(query) {
		return this.prepareOneTimeQuery(this.dialect.sqlToQuery(query), void 0, "run", false).all();
	}
	/** @internal */
	extractRawAllValueFromBatchResult(_result) {
		throw new Error("Not implemented");
	}
	get(query) {
		return this.prepareOneTimeQuery(this.dialect.sqlToQuery(query), void 0, "run", false).get();
	}
	/** @internal */
	extractRawGetValueFromBatchResult(_result) {
		throw new Error("Not implemented");
	}
	values(query) {
		return this.prepareOneTimeQuery(this.dialect.sqlToQuery(query), void 0, "run", false).values();
	}
	async count(sql) {
		return (await this.values(sql))[0][0];
	}
	/** @internal */
	extractRawValuesValueFromBatchResult(_result) {
		throw new Error("Not implemented");
	}
};
var SQLiteTransaction = class extends require_sqlite_core_db.BaseSQLiteDatabase {
	static [__entity_ts.entityKind] = "SQLiteTransaction";
	constructor(resultType, dialect, session, relations, schema, nestedIndex = 0, rowModeRQB, forbidJsonb) {
		super(resultType, dialect, session, relations, schema, rowModeRQB, forbidJsonb);
		this.relations = relations;
		this.schema = schema;
		this.nestedIndex = nestedIndex;
	}
	rollback() {
		throw new __errors_ts.TransactionRollbackError();
	}
};

//#endregion
exports.ExecuteResultSync = ExecuteResultSync;
exports.SQLitePreparedQuery = SQLitePreparedQuery;
exports.SQLiteSession = SQLiteSession;
exports.SQLiteTransaction = SQLiteTransaction;
//# sourceMappingURL=session.cjs.map