import { entityKind } from "../entity.js";
import { mapResultRow } from "../utils.js";
import { fillPlaceholders, sql } from "../sql/sql.js";
import { NoopLogger } from "../logger.js";
import { NoopCache } from "../cache/core/index.js";
import { SQLiteTransaction } from "../sqlite-core/index.js";
import { SQLitePreparedQuery as SQLitePreparedQuery$1, SQLiteSession as SQLiteSession$1 } from "../sqlite-core/session.js";

//#region src/sqlite-proxy/session.ts
var SQLiteRemoteSession = class extends SQLiteSession$1 {
	static [entityKind] = "SQLiteRemoteSession";
	logger;
	cache;
	constructor(client, dialect, relations, schema, batchCLient, options = {}) {
		super(dialect);
		this.client = client;
		this.relations = relations;
		this.schema = schema;
		this.batchCLient = batchCLient;
		this.logger = options.logger ?? new NoopLogger();
		this.cache = options.cache ?? new NoopCache();
	}
	prepareQuery(query, fields, executeMethod, isResponseInArrayMode, customResultMapper, queryMetadata, cacheConfig) {
		return new RemotePreparedQuery(this.client, query, this.logger, this.cache, queryMetadata, cacheConfig, fields, executeMethod, isResponseInArrayMode, customResultMapper);
	}
	prepareRelationalQuery(query, fields, executeMethod, customResultMapper) {
		return new RemotePreparedQuery(this.client, query, this.logger, this.cache, void 0, void 0, fields, executeMethod, true, customResultMapper, true);
	}
	async batch(queries) {
		const preparedQueries = [];
		const builtQueries = [];
		for (const query of queries) {
			const preparedQuery = query._prepare();
			const builtQuery = preparedQuery.getQuery();
			preparedQueries.push(preparedQuery);
			builtQueries.push({
				sql: builtQuery.sql,
				params: builtQuery.params,
				method: builtQuery.method
			});
		}
		return (await this.batchCLient(builtQueries)).map((result, i) => preparedQueries[i].mapResult(result, true));
	}
	async transaction(transaction, config) {
		const tx = new SQLiteProxyTransaction("async", this.dialect, this, this.relations, this.schema, void 0, true);
		await this.run(sql.raw(`begin${config?.behavior ? " " + config.behavior : ""}`));
		try {
			const result = await transaction(tx);
			await this.run(sql`commit`);
			return result;
		} catch (err) {
			await this.run(sql`rollback`);
			throw err;
		}
	}
	extractRawAllValueFromBatchResult(result) {
		return result.rows;
	}
	extractRawGetValueFromBatchResult(result) {
		return result.rows[0];
	}
	extractRawValuesValueFromBatchResult(result) {
		return result.rows;
	}
};
var SQLiteProxyTransaction = class SQLiteProxyTransaction extends SQLiteTransaction {
	static [entityKind] = "SQLiteProxyTransaction";
	async transaction(transaction) {
		const savepointName = `sp${this.nestedIndex}`;
		const tx = new SQLiteProxyTransaction("async", this.dialect, this.session, this.relations, this.schema, this.nestedIndex + 1, true);
		await this.session.run(sql.raw(`savepoint ${savepointName}`));
		try {
			const result = await transaction(tx);
			await this.session.run(sql.raw(`release savepoint ${savepointName}`));
			return result;
		} catch (err) {
			await this.session.run(sql.raw(`rollback to savepoint ${savepointName}`));
			throw err;
		}
	}
};
var RemotePreparedQuery = class extends SQLitePreparedQuery$1 {
	static [entityKind] = "SQLiteProxyPreparedQuery";
	method;
	constructor(client, query, logger, cache, queryMetadata, cacheConfig, fields, executeMethod, _isResponseInArrayMode, customResultMapper, isRqbV2Query) {
		super("async", executeMethod, query, cache, queryMetadata, cacheConfig);
		this.client = client;
		this.logger = logger;
		this.fields = fields;
		this._isResponseInArrayMode = _isResponseInArrayMode;
		this.customResultMapper = customResultMapper;
		this.isRqbV2Query = isRqbV2Query;
		this.method = executeMethod;
	}
	getQuery() {
		return {
			...this.query,
			method: this.method
		};
	}
	async run(placeholderValues) {
		const params = fillPlaceholders(this.query.params, placeholderValues ?? {});
		this.logger.logQuery(this.query.sql, params);
		return await this.queryWithCache(this.query.sql, params, async () => {
			return await this.client(this.query.sql, params, "run");
		});
	}
	mapAllResult(rows, isFromBatch) {
		if (isFromBatch) rows = rows.rows;
		if (!this.fields && !this.customResultMapper) return rows;
		if (this.customResultMapper) return this.customResultMapper(this.isRqbV2Query ? rows.map((r) => JSON.parse(r[0])) : rows);
		return rows.map((row) => {
			return mapResultRow(this.fields, row, this.joinsNotNullableMap);
		});
	}
	async all(placeholderValues) {
		if (this.isRqbV2Query) return this.allRqbV2(placeholderValues);
		const { query, logger, client } = this;
		const params = fillPlaceholders(query.params, placeholderValues ?? {});
		logger.logQuery(query.sql, params);
		const { rows } = await this.queryWithCache(query.sql, params, async () => {
			return await client(query.sql, params, "all");
		});
		return this.mapAllResult(rows);
	}
	async get(placeholderValues) {
		if (this.isRqbV2Query) return this.getRqbV2(placeholderValues);
		const { query, logger, client } = this;
		const params = fillPlaceholders(query.params, placeholderValues ?? {});
		logger.logQuery(query.sql, params);
		const clientResult = await this.queryWithCache(query.sql, params, async () => {
			return await client(query.sql, params, "get");
		});
		return this.mapGetResult(clientResult.rows);
	}
	async allRqbV2(placeholderValues) {
		const { query, logger, client } = this;
		const params = fillPlaceholders(query.params, placeholderValues ?? {});
		logger.logQuery(query.sql, params);
		const { rows } = await client(query.sql, params, "all");
		return this.mapAllResult(rows);
	}
	async getRqbV2(placeholderValues) {
		const { query, logger, client } = this;
		const params = fillPlaceholders(query.params, placeholderValues ?? {});
		logger.logQuery(query.sql, params);
		const { rows } = await client(query.sql, params, "get");
		return this.mapGetResult(rows);
	}
	mapGetResult(rows, isFromBatch) {
		if (isFromBatch) rows = rows.rows;
		const row = rows;
		if (!this.fields && !this.customResultMapper) return row;
		if (!row) return;
		if (this.customResultMapper) return this.customResultMapper([this.isRqbV2Query ? JSON.parse(row) : rows]);
		return mapResultRow(this.fields, row, this.joinsNotNullableMap);
	}
	async values(placeholderValues) {
		const params = fillPlaceholders(this.query.params, placeholderValues ?? {});
		this.logger.logQuery(this.query.sql, params);
		return (await this.queryWithCache(this.query.sql, params, async () => {
			return await this.client(this.query.sql, params, "values");
		})).rows;
	}
	/** @internal */
	isResponseInArrayMode() {
		return this._isResponseInArrayMode;
	}
};

//#endregion
export { RemotePreparedQuery, SQLiteProxyTransaction, SQLiteRemoteSession };
//# sourceMappingURL=session.js.map