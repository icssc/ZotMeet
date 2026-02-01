import { entityKind } from "../entity.js";
import { tracer } from "../tracing.js";
import { mapResultRow } from "../utils.js";
import { fillPlaceholders } from "../sql/sql.js";
import { NoopLogger } from "../logger.js";
import { PgAsyncPreparedQuery, PgAsyncSession, PgAsyncTransaction } from "../pg-core/async/session.js";
import { NoopCache } from "../cache/core/cache.js";

//#region src/pg-proxy/session.ts
var PgRemoteSession = class extends PgAsyncSession {
	static [entityKind] = "PgRemoteSession";
	logger;
	cache;
	constructor(client, dialect, relations, schema, options = {}) {
		super(dialect);
		this.client = client;
		this.relations = relations;
		this.schema = schema;
		this.logger = options.logger ?? new NoopLogger();
		this.cache = options.cache ?? new NoopCache();
	}
	prepareQuery(query, fields, name, isResponseInArrayMode, customResultMapper, queryMetadata, cacheConfig) {
		return new PreparedQuery(this.client, query.sql, query.params, query.typings, this.logger, this.cache, queryMetadata, cacheConfig, fields, isResponseInArrayMode, customResultMapper);
	}
	prepareRelationalQuery(query, fields, name, customResultMapper) {
		return new PreparedQuery(this.client, query.sql, query.params, query.typings, this.logger, this.cache, void 0, void 0, fields, false, customResultMapper, true);
	}
	async transaction(_transaction, _config) {
		throw new Error("Transactions are not supported by the Postgres Proxy driver");
	}
};
var PgProxyTransaction = class extends PgAsyncTransaction {
	static [entityKind] = "PgProxyTransaction";
	async transaction(_transaction) {
		throw new Error("Transactions are not supported by the Postgres Proxy driver");
	}
};
var PreparedQuery = class extends PgAsyncPreparedQuery {
	static [entityKind] = "PgProxyPreparedQuery";
	constructor(client, queryString, params, typings, logger, cache, queryMetadata, cacheConfig, fields, _isResponseInArrayMode, customResultMapper, isRqbV2Query) {
		super({
			sql: queryString,
			params
		}, cache, queryMetadata, cacheConfig);
		this.client = client;
		this.queryString = queryString;
		this.params = params;
		this.typings = typings;
		this.logger = logger;
		this.fields = fields;
		this._isResponseInArrayMode = _isResponseInArrayMode;
		this.customResultMapper = customResultMapper;
		this.isRqbV2Query = isRqbV2Query;
	}
	async execute(placeholderValues = {}) {
		if (this.isRqbV2Query) return this.executeRqbV2(placeholderValues);
		return tracer.startActiveSpan("drizzle.execute", async (span) => {
			const params = fillPlaceholders(this.params, placeholderValues);
			const { fields, client, queryString, joinsNotNullableMap, customResultMapper, logger, typings } = this;
			span?.setAttributes({
				"drizzle.query.text": queryString,
				"drizzle.query.params": JSON.stringify(params)
			});
			logger.logQuery(queryString, params);
			if (!fields && !customResultMapper) return tracer.startActiveSpan("drizzle.driver.execute", async () => {
				const { rows: rows$1 } = await this.queryWithCache(queryString, params, async () => {
					return await client(queryString, params, "execute", typings);
				});
				return rows$1;
			});
			const rows = await tracer.startActiveSpan("drizzle.driver.execute", async () => {
				span?.setAttributes({
					"drizzle.query.text": queryString,
					"drizzle.query.params": JSON.stringify(params)
				});
				const { rows: rows$1 } = await this.queryWithCache(queryString, params, async () => {
					return await client(queryString, params, "all", typings);
				});
				return rows$1;
			});
			return tracer.startActiveSpan("drizzle.mapResponse", () => {
				return customResultMapper ? customResultMapper(rows) : rows.map((row) => mapResultRow(fields, row, joinsNotNullableMap));
			});
		});
	}
	async executeRqbV2(placeholderValues = {}) {
		return tracer.startActiveSpan("drizzle.execute", async (span) => {
			const params = fillPlaceholders(this.params, placeholderValues);
			const { client, queryString, customResultMapper, logger, typings } = this;
			span?.setAttributes({
				"drizzle.query.text": queryString,
				"drizzle.query.params": JSON.stringify(params)
			});
			logger.logQuery(queryString, params);
			const rows = await tracer.startActiveSpan("drizzle.driver.execute", async () => {
				const { rows: rows$1 } = await client(queryString, params, "execute", typings);
				return rows$1;
			});
			return tracer.startActiveSpan("drizzle.mapResponse", () => {
				return customResultMapper(rows);
			});
		});
	}
	async all() {}
	/** @internal */
	isResponseInArrayMode() {
		return this._isResponseInArrayMode;
	}
};

//#endregion
export { PgProxyTransaction, PgRemoteSession, PreparedQuery };
//# sourceMappingURL=session.js.map