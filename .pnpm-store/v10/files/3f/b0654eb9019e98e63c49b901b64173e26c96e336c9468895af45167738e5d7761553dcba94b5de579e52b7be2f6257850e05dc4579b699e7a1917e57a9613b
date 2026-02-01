import { entityKind } from "../entity.js";
import { tracer } from "../tracing.js";
import { mapResultRow } from "../utils.js";
import { fillPlaceholders, sql } from "../sql/sql.js";
import { NoopLogger } from "../logger.js";
import { NoopCache } from "../cache/core/index.js";
import { PgAsyncPreparedQuery, PgAsyncSession, PgAsyncTransaction } from "../pg-core/async/session.js";
import pg from "pg";

//#region src/node-postgres/session.ts
const { Pool: Pool$1, types } = pg;
var NodePgPreparedQuery = class extends PgAsyncPreparedQuery {
	static [entityKind] = "NodePgPreparedQuery";
	rawQueryConfig;
	queryConfig;
	constructor(client, queryString, params, logger, cache, queryMetadata, cacheConfig, fields, name, _isResponseInArrayMode, customResultMapper, isRqbV2Query) {
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
		this.rawQueryConfig = {
			name,
			text: queryString,
			types: { getTypeParser: (typeId, format) => {
				if (typeId === types.builtins.TIMESTAMPTZ) return (val) => val;
				if (typeId === types.builtins.TIMESTAMP) return (val) => val;
				if (typeId === types.builtins.DATE) return (val) => val;
				if (typeId === types.builtins.INTERVAL) return (val) => val;
				if (typeId === 1231) return (val) => val;
				if (typeId === 1115) return (val) => val;
				if (typeId === 1185) return (val) => val;
				if (typeId === 1187) return (val) => val;
				if (typeId === 1182) return (val) => val;
				return types.getTypeParser(typeId, format);
			} }
		};
		this.queryConfig = {
			name,
			text: queryString,
			rowMode: "array",
			types: { getTypeParser: (typeId, format) => {
				if (typeId === types.builtins.TIMESTAMPTZ) return (val) => val;
				if (typeId === types.builtins.TIMESTAMP) return (val) => val;
				if (typeId === types.builtins.DATE) return (val) => val;
				if (typeId === types.builtins.INTERVAL) return (val) => val;
				if (typeId === 1231) return (val) => val;
				if (typeId === 1115) return (val) => val;
				if (typeId === 1185) return (val) => val;
				if (typeId === 1187) return (val) => val;
				if (typeId === 1182) return (val) => val;
				return types.getTypeParser(typeId, format);
			} }
		};
	}
	async execute(placeholderValues = {}) {
		if (this.isRqbV2Query) return this.executeRqbV2(placeholderValues);
		return tracer.startActiveSpan("drizzle.execute", async () => {
			const params = fillPlaceholders(this.params, placeholderValues);
			this.logger.logQuery(this.rawQueryConfig.text, params);
			const { fields, rawQueryConfig: rawQuery, client, queryConfig: query, joinsNotNullableMap, customResultMapper } = this;
			if (!fields && !customResultMapper) return tracer.startActiveSpan("drizzle.driver.execute", async (span) => {
				span?.setAttributes({
					"drizzle.query.name": rawQuery.name,
					"drizzle.query.text": rawQuery.text,
					"drizzle.query.params": JSON.stringify(params)
				});
				return this.queryWithCache(rawQuery.text, params, async () => {
					return await client.query(rawQuery, params);
				});
			});
			const result = await tracer.startActiveSpan("drizzle.driver.execute", (span) => {
				span?.setAttributes({
					"drizzle.query.name": query.name,
					"drizzle.query.text": query.text,
					"drizzle.query.params": JSON.stringify(params)
				});
				return this.queryWithCache(query.text, params, async () => {
					return await client.query(query, params);
				});
			});
			return tracer.startActiveSpan("drizzle.mapResponse", () => {
				return customResultMapper ? customResultMapper(result.rows) : result.rows.map((row) => mapResultRow(fields, row, joinsNotNullableMap));
			});
		});
	}
	async executeRqbV2(placeholderValues = {}) {
		return tracer.startActiveSpan("drizzle.execute", async () => {
			const params = fillPlaceholders(this.params, placeholderValues);
			this.logger.logQuery(this.rawQueryConfig.text, params);
			const { rawQueryConfig: rawQuery, client, customResultMapper } = this;
			const result = await tracer.startActiveSpan("drizzle.driver.execute", (span) => {
				span?.setAttributes({
					"drizzle.query.name": rawQuery.name,
					"drizzle.query.text": rawQuery.text,
					"drizzle.query.params": JSON.stringify(params)
				});
				return client.query(rawQuery, params);
			});
			return tracer.startActiveSpan("drizzle.mapResponse", () => {
				return customResultMapper(result.rows);
			});
		});
	}
	all(placeholderValues = {}) {
		return tracer.startActiveSpan("drizzle.execute", () => {
			const params = fillPlaceholders(this.params, placeholderValues);
			this.logger.logQuery(this.rawQueryConfig.text, params);
			return tracer.startActiveSpan("drizzle.driver.execute", (span) => {
				span?.setAttributes({
					"drizzle.query.name": this.rawQueryConfig.name,
					"drizzle.query.text": this.rawQueryConfig.text,
					"drizzle.query.params": JSON.stringify(params)
				});
				return this.queryWithCache(this.rawQueryConfig.text, params, async () => {
					return this.client.query(this.rawQueryConfig, params);
				}).then((result) => result.rows);
			});
		});
	}
	/** @internal */
	isResponseInArrayMode() {
		return this._isResponseInArrayMode;
	}
};
var NodePgSession = class NodePgSession extends PgAsyncSession {
	static [entityKind] = "NodePgSession";
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
		return new NodePgPreparedQuery(this.client, query.sql, query.params, this.logger, this.cache, queryMetadata, cacheConfig, fields, name, isResponseInArrayMode, customResultMapper);
	}
	prepareRelationalQuery(query, fields, name, customResultMapper) {
		return new NodePgPreparedQuery(this.client, query.sql, query.params, this.logger, this.cache, void 0, void 0, fields, name, false, customResultMapper, true);
	}
	async transaction(transaction, config) {
		const isPool = this.client instanceof Pool$1 || Object.getPrototypeOf(this.client).constructor.name.includes("Pool");
		const session = isPool ? new NodePgSession(await this.client.connect(), this.dialect, this.relations, this.schema, this.options) : this;
		const tx = new NodePgTransaction(this.dialect, session, this.relations, this.schema);
		await tx.execute(sql`begin${config ? sql` ${tx.getTransactionConfigSQL(config)}` : void 0}`);
		try {
			const result = await transaction(tx);
			await tx.execute(sql`commit`);
			return result;
		} catch (error) {
			await tx.execute(sql`rollback`);
			throw error;
		} finally {
			if (isPool) session.client.release();
		}
	}
};
var NodePgTransaction = class NodePgTransaction extends PgAsyncTransaction {
	static [entityKind] = "NodePgTransaction";
	async transaction(transaction) {
		const savepointName = `sp${this.nestedIndex + 1}`;
		const tx = new NodePgTransaction(this.dialect, this.session, this.relations, this.schema, this.nestedIndex + 1);
		await tx.execute(sql.raw(`savepoint ${savepointName}`));
		try {
			const result = await transaction(tx);
			await tx.execute(sql.raw(`release savepoint ${savepointName}`));
			return result;
		} catch (err) {
			await tx.execute(sql.raw(`rollback to savepoint ${savepointName}`));
			throw err;
		}
	}
};

//#endregion
export { NodePgPreparedQuery, NodePgSession, NodePgTransaction };
//# sourceMappingURL=session.js.map