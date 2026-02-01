import { entityKind } from "../../entity.js";
import { tracer } from "../../tracing.js";
import { mapResultRow } from "../../utils.js";
import { fillPlaceholders } from "../../sql/sql.js";
import { NoopLogger } from "../../logger.js";
import { NoopCache } from "../../cache/core/index.js";
import { PgAsyncPreparedQuery, PgAsyncSession, PgAsyncTransaction } from "../../pg-core/async/session.js";

//#region src/bun-sql/postgres/session.ts
var BunSQLPreparedQuery = class extends PgAsyncPreparedQuery {
	static [entityKind] = "BunSQLPreparedQuery";
	constructor(client, queryString, params, logger, cache, queryMetadata, cacheConfig, fields, _isResponseInArrayMode, customResultMapper, isRqbV2Query) {
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
		this.isRqbV2Query = isRqbV2Query;
	}
	async execute(placeholderValues = {}) {
		if (this.isRqbV2Query) return this.executeRqbV2(placeholderValues);
		return tracer.startActiveSpan("drizzle.execute", async (span) => {
			const params = fillPlaceholders(this.params, placeholderValues);
			span?.setAttributes({
				"drizzle.query.text": this.queryString,
				"drizzle.query.params": JSON.stringify(params)
			});
			this.logger.logQuery(this.queryString, params);
			const { fields, queryString: query, client, joinsNotNullableMap, customResultMapper } = this;
			if (!fields && !customResultMapper) return tracer.startActiveSpan("drizzle.driver.execute", async () => {
				return await this.queryWithCache(query, params, async () => {
					return await client.unsafe(query, params);
				});
			});
			const rows = await tracer.startActiveSpan("drizzle.driver.execute", async () => {
				span?.setAttributes({
					"drizzle.query.text": query,
					"drizzle.query.params": JSON.stringify(params)
				});
				return await this.queryWithCache(query, params, async () => {
					return client.unsafe(query, params).values();
				});
			});
			return tracer.startActiveSpan("drizzle.mapResponse", () => {
				return customResultMapper ? customResultMapper(rows) : rows.map((row) => mapResultRow(fields, row, joinsNotNullableMap));
			});
		});
	}
	async executeRqbV2(placeholderValues = {}) {
		return tracer.startActiveSpan("drizzle.execute", async (span) => {
			const params = fillPlaceholders(this.params, placeholderValues);
			span?.setAttributes({
				"drizzle.query.text": this.queryString,
				"drizzle.query.params": JSON.stringify(params)
			});
			this.logger.logQuery(this.queryString, params);
			const { queryString: query, client, customResultMapper } = this;
			const rows = await tracer.startActiveSpan("drizzle.driver.execute", () => {
				span?.setAttributes({
					"drizzle.query.text": query,
					"drizzle.query.params": JSON.stringify(params)
				});
				return client.unsafe(query, params);
			});
			return tracer.startActiveSpan("drizzle.mapResponse", () => {
				return customResultMapper(rows);
			});
		});
	}
	all(placeholderValues = {}) {
		return tracer.startActiveSpan("drizzle.execute", async (span) => {
			const params = fillPlaceholders(this.params, placeholderValues);
			span?.setAttributes({
				"drizzle.query.text": this.queryString,
				"drizzle.query.params": JSON.stringify(params)
			});
			this.logger.logQuery(this.queryString, params);
			return tracer.startActiveSpan("drizzle.driver.execute", async () => {
				span?.setAttributes({
					"drizzle.query.text": this.queryString,
					"drizzle.query.params": JSON.stringify(params)
				});
				return await this.queryWithCache(this.queryString, params, async () => {
					return await this.client.unsafe(this.queryString, params);
				});
			});
		});
	}
	/** @internal */
	isResponseInArrayMode() {
		return this._isResponseInArrayMode;
	}
};
var BunSQLSession = class BunSQLSession extends PgAsyncSession {
	static [entityKind] = "BunSQLSession";
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
		return new BunSQLPreparedQuery(this.client, query.sql, query.params, this.logger, this.cache, queryMetadata, cacheConfig, fields, isResponseInArrayMode, customResultMapper);
	}
	prepareRelationalQuery(query, fields, name, customResultMapper) {
		return new BunSQLPreparedQuery(this.client, query.sql, query.params, this.logger, this.cache, void 0, void 0, fields, true, customResultMapper, true);
	}
	query(query, params) {
		this.logger.logQuery(query, params);
		return this.client.unsafe(query, params).values();
	}
	queryObjects(query, params) {
		return this.client.unsafe(query, params);
	}
	transaction(transaction, config) {
		return this.client.begin(async (client) => {
			const session = new BunSQLSession(client, this.dialect, this.relations, this.schema, this.options);
			const tx = new BunSQLTransaction(this.dialect, session, this.relations, this.schema);
			if (config) await tx.setTransaction(config);
			return transaction(tx);
		});
	}
};
var BunSQLTransaction = class BunSQLTransaction extends PgAsyncTransaction {
	static [entityKind] = "BunSQLTransaction";
	constructor(dialect, session, relations, schema, nestedIndex = 0) {
		super(dialect, session, relations, schema, nestedIndex);
		this.session = session;
	}
	transaction(transaction) {
		return this.session.client.savepoint((client) => {
			const session = new BunSQLSession(client, this.dialect, this.relations, this.schema, this.session.options);
			return transaction(new BunSQLTransaction(this.dialect, session, this.relations, this.schema));
		});
	}
};

//#endregion
export { BunSQLPreparedQuery, BunSQLSession, BunSQLTransaction };
//# sourceMappingURL=session.js.map