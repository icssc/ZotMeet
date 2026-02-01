import { entityKind } from "../entity.js";
import { mapResultRow } from "../utils.js";
import { fillPlaceholders, sql } from "../sql/sql.js";
import { NoopLogger } from "../logger.js";
import { NoopCache } from "../cache/core/index.js";
import { SQLiteTransaction } from "../sqlite-core/index.js";
import { SQLitePreparedQuery as SQLitePreparedQuery$1, SQLiteSession as SQLiteSession$1 } from "../sqlite-core/session.js";

//#region src/libsql/session.ts
var LibSQLSession = class LibSQLSession extends SQLiteSession$1 {
	static [entityKind] = "LibSQLSession";
	logger;
	cache;
	constructor(client, dialect, relations, schema, options, tx) {
		super(dialect);
		this.client = client;
		this.relations = relations;
		this.schema = schema;
		this.options = options;
		this.tx = tx;
		this.logger = options.logger ?? new NoopLogger();
		this.cache = options.cache ?? new NoopCache();
	}
	prepareQuery(query, fields, executeMethod, isResponseInArrayMode, customResultMapper, queryMetadata, cacheConfig) {
		return new LibSQLPreparedQuery(this.client, query, this.logger, this.cache, queryMetadata, cacheConfig, fields, this.tx, executeMethod, isResponseInArrayMode, customResultMapper);
	}
	prepareRelationalQuery(query, fields, executeMethod, customResultMapper) {
		return new LibSQLPreparedQuery(this.client, query, this.logger, this.cache, void 0, void 0, fields, this.tx, executeMethod, false, customResultMapper, true);
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
				args: builtQuery.params
			});
		}
		return (await this.client.batch(builtQueries)).map((result, i) => preparedQueries[i].mapResult(result, true));
	}
	async migrate(queries) {
		const preparedQueries = [];
		const builtQueries = [];
		for (const query of queries) {
			const preparedQuery = query._prepare();
			const builtQuery = preparedQuery.getQuery();
			preparedQueries.push(preparedQuery);
			builtQueries.push({
				sql: builtQuery.sql,
				args: builtQuery.params
			});
		}
		return (await this.client.migrate(builtQueries)).map((result, i) => preparedQueries[i].mapResult(result, true));
	}
	async transaction(transaction, _config) {
		const libsqlTx = await this.client.transaction();
		const session = new LibSQLSession(this.client, this.dialect, this.relations, this.schema, this.options, libsqlTx);
		const tx = new LibSQLTransaction("async", this.dialect, session, this.relations, this.schema);
		try {
			const result = await transaction(tx);
			await libsqlTx.commit();
			return result;
		} catch (err) {
			await libsqlTx.rollback();
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
var LibSQLTransaction = class LibSQLTransaction extends SQLiteTransaction {
	static [entityKind] = "LibSQLTransaction";
	async transaction(transaction) {
		const savepointName = `sp${this.nestedIndex}`;
		const tx = new LibSQLTransaction("async", this.dialect, this.session, this.relations, this.schema, this.nestedIndex + 1);
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
var LibSQLPreparedQuery = class extends SQLitePreparedQuery$1 {
	static [entityKind] = "LibSQLPreparedQuery";
	constructor(client, query, logger, cache, queryMetadata, cacheConfig, fields, tx, executeMethod, _isResponseInArrayMode, customResultMapper, isRqbV2Query) {
		super("async", executeMethod, query, cache, queryMetadata, cacheConfig);
		this.client = client;
		this.logger = logger;
		this.fields = fields;
		this.tx = tx;
		this._isResponseInArrayMode = _isResponseInArrayMode;
		this.customResultMapper = customResultMapper;
		this.isRqbV2Query = isRqbV2Query;
	}
	async run(placeholderValues) {
		const params = fillPlaceholders(this.query.params, placeholderValues ?? {});
		this.logger.logQuery(this.query.sql, params);
		return await this.queryWithCache(this.query.sql, params, async () => {
			const stmt = {
				sql: this.query.sql,
				args: params
			};
			return this.tx ? this.tx.execute(stmt) : this.client.execute(stmt);
		});
	}
	async all(placeholderValues) {
		if (this.isRqbV2Query) return this.allRqbV2(placeholderValues);
		const { fields, logger, query, tx, client, customResultMapper } = this;
		if (!fields && !customResultMapper) {
			const params = fillPlaceholders(query.params, placeholderValues ?? {});
			logger.logQuery(query.sql, params);
			return await this.queryWithCache(query.sql, params, async () => {
				const stmt = {
					sql: query.sql,
					args: params
				};
				return (tx ? tx.execute(stmt) : client.execute(stmt)).then(({ rows: rows$1 }) => this.mapAllResult(rows$1));
			});
		}
		const rows = await this.values(placeholderValues);
		return this.mapAllResult(rows);
	}
	async allRqbV2(placeholderValues) {
		const { logger, query, tx, client, customResultMapper } = this;
		const params = fillPlaceholders(query.params, placeholderValues ?? {});
		logger.logQuery(query.sql, params);
		const stmt = {
			sql: query.sql,
			args: params
		};
		return customResultMapper(await (tx ?? client).execute(stmt).then(({ rows }) => rows.map((row) => normalizeRow(row))), normalizeFieldValue);
	}
	mapAllResult(rows, isFromBatch) {
		if (isFromBatch) rows = rows.rows;
		if (!this.fields && !this.customResultMapper) return rows.map((row) => normalizeRow(row));
		if (this.customResultMapper) return this.customResultMapper(rows, normalizeFieldValue);
		return rows.map((row) => {
			return mapResultRow(this.fields, Array.prototype.slice.call(row).map((v) => normalizeFieldValue(v)), this.joinsNotNullableMap);
		});
	}
	async get(placeholderValues) {
		if (this.isRqbV2Query) return this.getRqbV2(placeholderValues);
		const { fields, logger, query, tx, client, customResultMapper } = this;
		if (!fields && !customResultMapper) {
			const params = fillPlaceholders(query.params, placeholderValues ?? {});
			logger.logQuery(query.sql, params);
			return await this.queryWithCache(query.sql, params, async () => {
				const stmt = {
					sql: query.sql,
					args: params
				};
				return (tx ? tx.execute(stmt) : client.execute(stmt)).then(({ rows: rows$1 }) => this.mapGetResult(rows$1));
			});
		}
		const rows = await this.values(placeholderValues);
		return this.mapGetResult(rows);
	}
	async getRqbV2(placeholderValues) {
		const { logger, query, tx, client, customResultMapper } = this;
		const params = fillPlaceholders(query.params, placeholderValues ?? {});
		logger.logQuery(query.sql, params);
		const stmt = {
			sql: query.sql,
			args: params
		};
		const { rows } = await (tx ?? client).execute(stmt);
		if (rows[0] === void 0) return;
		return customResultMapper([normalizeRow(rows[0])], normalizeFieldValue);
	}
	mapGetResult(rows, isFromBatch) {
		if (isFromBatch) rows = rows.rows;
		const row = rows[0];
		if (!this.fields && !this.customResultMapper) return normalizeRow(row);
		if (!row) return;
		if (this.customResultMapper) return this.customResultMapper(rows, normalizeFieldValue);
		return mapResultRow(this.fields, Array.prototype.slice.call(row).map((v) => normalizeFieldValue(v)), this.joinsNotNullableMap);
	}
	async values(placeholderValues) {
		const params = fillPlaceholders(this.query.params, placeholderValues ?? {});
		this.logger.logQuery(this.query.sql, params);
		return await this.queryWithCache(this.query.sql, params, async () => {
			const stmt = {
				sql: this.query.sql,
				args: params
			};
			return (this.tx ? this.tx.execute(stmt) : this.client.execute(stmt)).then(({ rows }) => rows);
		});
	}
	/** @internal */
	isResponseInArrayMode() {
		return this._isResponseInArrayMode;
	}
};
function normalizeRow(obj) {
	return Object.keys(obj).reduce((acc, key) => {
		if (Object.prototype.propertyIsEnumerable.call(obj, key)) acc[key] = obj[key];
		return acc;
	}, {});
}
function normalizeFieldValue(value) {
	if (typeof ArrayBuffer !== "undefined" && value instanceof ArrayBuffer) {
		if (typeof Buffer !== "undefined") {
			if (!(value instanceof Buffer)) return Buffer.from(value);
			return value;
		}
		if (typeof TextDecoder !== "undefined") return new TextDecoder().decode(value);
		throw new Error("TextDecoder is not available. Please provide either Buffer or TextDecoder polyfill.");
	}
	return value;
}

//#endregion
export { LibSQLPreparedQuery, LibSQLSession, LibSQLTransaction };
//# sourceMappingURL=session.js.map