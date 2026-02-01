const require_rolldown_runtime = require('../_virtual/rolldown_runtime.cjs');
const require_gel_core_db = require('./db.cjs');
let __entity_ts = require("../entity.cjs");
let __tracing_ts = require("../tracing.cjs");
let __cache_core_cache_ts = require("../cache/core/cache.cjs");
let __errors_ts = require("../errors.cjs");

//#region src/gel-core/session.ts
var GelPreparedQuery = class {
	constructor(query, cache, queryMetadata, cacheConfig) {
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
	authToken;
	getQuery() {
		return this.query;
	}
	mapResult(response, _isFromBatch) {
		return response;
	}
	static [__entity_ts.entityKind] = "GelPreparedQuery";
	/** @internal */
	joinsNotNullableMap;
};
var GelSession = class {
	static [__entity_ts.entityKind] = "GelSession";
	constructor(dialect) {
		this.dialect = dialect;
	}
	execute(query) {
		return __tracing_ts.tracer.startActiveSpan("drizzle.operation", () => {
			return __tracing_ts.tracer.startActiveSpan("drizzle.prepareQuery", () => {
				return this.prepareQuery(this.dialect.sqlToQuery(query), void 0, void 0, false);
			}).execute(void 0);
		});
	}
	all(query) {
		return this.prepareQuery(this.dialect.sqlToQuery(query), void 0, void 0, false).all();
	}
	async count(sql) {
		const res = await this.execute(sql);
		return Number(res[0]["count"]);
	}
};
var GelTransaction = class extends require_gel_core_db.GelDatabase {
	static [__entity_ts.entityKind] = "GelTransaction";
	constructor(dialect, session, relations, schema) {
		super(dialect, session, relations, schema);
		this.relations = relations;
		this.schema = schema;
	}
	rollback() {
		throw new __errors_ts.TransactionRollbackError();
	}
};

//#endregion
exports.GelPreparedQuery = GelPreparedQuery;
exports.GelSession = GelSession;
exports.GelTransaction = GelTransaction;
//# sourceMappingURL=session.cjs.map