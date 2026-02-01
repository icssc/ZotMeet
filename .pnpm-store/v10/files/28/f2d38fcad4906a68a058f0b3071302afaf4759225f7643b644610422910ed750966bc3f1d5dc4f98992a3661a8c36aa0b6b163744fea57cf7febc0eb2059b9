import { GelDatabase } from "./db.js";
import { entityKind, is } from "../entity.js";
import { tracer } from "../tracing.js";
import { NoopCache, hashQuery } from "../cache/core/cache.js";
import { DrizzleQueryError, TransactionRollbackError } from "../errors.js";

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
		if (this.cache === void 0 || is(this.cache, NoopCache) || this.queryMetadata === void 0) try {
			return await query();
		} catch (e) {
			throw new DrizzleQueryError(queryString, params, e);
		}
		if (this.cacheConfig && !this.cacheConfig.enabled) try {
			return await query();
		} catch (e) {
			throw new DrizzleQueryError(queryString, params, e);
		}
		if ((this.queryMetadata.type === "insert" || this.queryMetadata.type === "update" || this.queryMetadata.type === "delete") && this.queryMetadata.tables.length > 0) try {
			const [res] = await Promise.all([query(), this.cache.onMutate({ tables: this.queryMetadata.tables })]);
			return res;
		} catch (e) {
			throw new DrizzleQueryError(queryString, params, e);
		}
		if (!this.cacheConfig) try {
			return await query();
		} catch (e) {
			throw new DrizzleQueryError(queryString, params, e);
		}
		if (this.queryMetadata.type === "select") {
			const fromCache = await this.cache.get(this.cacheConfig.tag ?? await hashQuery(queryString, params), this.queryMetadata.tables, this.cacheConfig.tag !== void 0, this.cacheConfig.autoInvalidate);
			if (fromCache === void 0) {
				let result;
				try {
					result = await query();
				} catch (e) {
					throw new DrizzleQueryError(queryString, params, e);
				}
				await this.cache.put(this.cacheConfig.tag ?? await hashQuery(queryString, params), result, this.cacheConfig.autoInvalidate ? this.queryMetadata.tables : [], this.cacheConfig.tag !== void 0, this.cacheConfig.config);
				return result;
			}
			return fromCache;
		}
		try {
			return await query();
		} catch (e) {
			throw new DrizzleQueryError(queryString, params, e);
		}
	}
	authToken;
	getQuery() {
		return this.query;
	}
	mapResult(response, _isFromBatch) {
		return response;
	}
	static [entityKind] = "GelPreparedQuery";
	/** @internal */
	joinsNotNullableMap;
};
var GelSession = class {
	static [entityKind] = "GelSession";
	constructor(dialect) {
		this.dialect = dialect;
	}
	execute(query) {
		return tracer.startActiveSpan("drizzle.operation", () => {
			return tracer.startActiveSpan("drizzle.prepareQuery", () => {
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
var GelTransaction = class extends GelDatabase {
	static [entityKind] = "GelTransaction";
	constructor(dialect, session, relations, schema) {
		super(dialect, session, relations, schema);
		this.relations = relations;
		this.schema = schema;
	}
	rollback() {
		throw new TransactionRollbackError();
	}
};

//#endregion
export { GelPreparedQuery, GelSession, GelTransaction };
//# sourceMappingURL=session.js.map