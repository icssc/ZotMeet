import { entityKind } from "../entity.js";
import { tracer } from "../tracing.js";
import { mapResultRow } from "../utils.js";
import { fillPlaceholders } from "../sql/sql.js";
import { NoopLogger } from "../logger.js";
import { NoopCache } from "../cache/core/index.js";
import { GelPreparedQuery, GelSession, GelTransaction } from "../gel-core/session.js";

//#region src/gel/session.ts
var GelDbPreparedQuery = class extends GelPreparedQuery {
	static [entityKind] = "GelPreparedQuery";
	constructor(client, queryString, params, logger, cache, queryMetadata, cacheConfig, fields, _isResponseInArrayMode, customResultMapper, transaction = false, isRqbV2Query) {
		super({
			sql: queryString,
			params
		}, cache, queryMetadata, cacheConfig);
		this.client = client;
		this.queryString = queryString;
		this.params = params;
		this.logger = logger;
		this.fields = fields;
		this._isResponseInArrayMode = _isResponseInArrayMode;
		this.customResultMapper = customResultMapper;
		this.transaction = transaction;
		this.isRqbV2Query = isRqbV2Query;
	}
	async execute(placeholderValues = {}) {
		if (this.isRqbV2Query) return this.executeRqbV2(placeholderValues);
		return tracer.startActiveSpan("drizzle.execute", async () => {
			const params = fillPlaceholders(this.params, placeholderValues);
			this.logger.logQuery(this.queryString, params);
			const { fields, queryString: query, client, joinsNotNullableMap, customResultMapper } = this;
			if (!fields && !customResultMapper) return tracer.startActiveSpan("drizzle.driver.execute", async (span) => {
				span?.setAttributes({
					"drizzle.query.text": query,
					"drizzle.query.params": JSON.stringify(params)
				});
				return await this.queryWithCache(query, params, async () => {
					return await client.querySQL(query, params.length ? params : void 0);
				});
			});
			const result = await tracer.startActiveSpan("drizzle.driver.execute", async (span) => {
				span?.setAttributes({
					"drizzle.query.text": query,
					"drizzle.query.params": JSON.stringify(params)
				});
				return await this.queryWithCache(query, params, async () => {
					return await client.withSQLRowMode("array").querySQL(query, params.length ? params : void 0);
				});
			});
			return tracer.startActiveSpan("drizzle.mapResponse", () => {
				return customResultMapper ? customResultMapper(result) : result.map((row) => mapResultRow(fields, row, joinsNotNullableMap));
			});
		});
	}
	async executeRqbV2(placeholderValues = {}) {
		return tracer.startActiveSpan("drizzle.execute", async () => {
			const params = fillPlaceholders(this.params, placeholderValues);
			this.logger.logQuery(this.queryString, params);
			const { queryString: query, client, customResultMapper } = this;
			const result = await tracer.startActiveSpan("drizzle.driver.execute", (span) => {
				span?.setAttributes({
					"drizzle.query.text": query,
					"drizzle.query.params": JSON.stringify(params)
				});
				return client.querySQL(query, params.length ? params : void 0);
			});
			return tracer.startActiveSpan("drizzle.mapResponse", () => {
				return customResultMapper(result);
			});
		});
	}
	async all(placeholderValues = {}) {
		return await tracer.startActiveSpan("drizzle.execute", async () => {
			const params = fillPlaceholders(this.params, placeholderValues);
			this.logger.logQuery(this.queryString, params);
			return await tracer.startActiveSpan("drizzle.driver.execute", async (span) => {
				span?.setAttributes({
					"drizzle.query.text": this.queryString,
					"drizzle.query.params": JSON.stringify(params)
				});
				return await this.queryWithCache(this.queryString, params, async () => {
					return await this.client.withSQLRowMode("array").querySQL(this.queryString, params.length ? params : void 0).then((result) => result);
				});
			});
		});
	}
	/** @internal */
	isResponseInArrayMode() {
		return this._isResponseInArrayMode;
	}
};
var GelDbSession = class GelDbSession extends GelSession {
	static [entityKind] = "GelDbSession";
	logger;
	cache;
	constructor(client, dialect, relations, schema, options = {}) {
		super(dialect);
		this.client = client;
		this.relations = relations;
		this.schema = schema;
		this.options = options;
		this.logger = options.logger ?? new NoopLogger();
		this.cache = options.cache ?? new NoopCache();
	}
	prepareQuery(query, fields, name, isResponseInArrayMode, customResultMapper, queryMetadata, cacheConfig) {
		return new GelDbPreparedQuery(this.client, query.sql, query.params, this.logger, this.cache, queryMetadata, cacheConfig, fields, isResponseInArrayMode, customResultMapper);
	}
	prepareRelationalQuery(query, fields, name, customResultMapper) {
		return new GelDbPreparedQuery(this.client, query.sql, query.params, this.logger, this.cache, void 0, void 0, fields, false, customResultMapper, void 0, true);
	}
	async transaction(transaction) {
		return await this.client.transaction(async (clientTx) => {
			const session = new GelDbSession(clientTx, this.dialect, this.relations, this.schema, this.options);
			return await transaction(new GelDbTransaction(this.dialect, session, this.relations, this.schema));
		});
	}
	async count(sql$1) {
		const res = await this.execute(sql$1);
		return Number(res[0]["count"]);
	}
};
var GelDbTransaction = class GelDbTransaction extends GelTransaction {
	static [entityKind] = "GelDbTransaction";
	async transaction(transaction) {
		return await transaction(new GelDbTransaction(this.dialect, this.session, this.relations, this.schema));
	}
};

//#endregion
export { GelDbPreparedQuery, GelDbSession, GelDbTransaction };
//# sourceMappingURL=session.js.map