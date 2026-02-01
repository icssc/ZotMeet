import { entityKind } from "../entity.js";
import { mapResultRow } from "../utils.js";
import { fillPlaceholders, sql } from "../sql/sql.js";
import { NoopLogger } from "../logger.js";
import { NoopCache } from "../cache/core/index.js";
import { SQLiteTransaction } from "../sqlite-core/index.js";
import { SQLitePreparedQuery as SQLitePreparedQuery$1, SQLiteSession as SQLiteSession$1 } from "../sqlite-core/session.js";

//#region src/op-sqlite/session.ts
var OPSQLiteSession = class extends SQLiteSession$1 {
	static [entityKind] = "OPSQLiteSession";
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
	prepareQuery(query, fields, executeMethod, isResponseInArrayMode, customResultMapper, queryMetadata, cacheConfig) {
		return new OPSQLitePreparedQuery(this.client, query, this.logger, this.cache, queryMetadata, cacheConfig, fields, executeMethod, isResponseInArrayMode, customResultMapper);
	}
	prepareRelationalQuery(query, fields, executeMethod, customResultMapper) {
		return new OPSQLitePreparedQuery(this.client, query, this.logger, this.cache, void 0, void 0, fields, executeMethod, false, customResultMapper, true);
	}
	transaction(transaction, config = {}) {
		const tx = new OPSQLiteTransaction("async", this.dialect, this, this.relations, this.schema);
		this.run(sql.raw(`begin${config?.behavior ? " " + config.behavior : ""}`));
		try {
			const result = transaction(tx);
			this.run(sql`commit`);
			return result;
		} catch (err) {
			this.run(sql`rollback`);
			throw err;
		}
	}
};
var OPSQLiteTransaction = class OPSQLiteTransaction extends SQLiteTransaction {
	static [entityKind] = "OPSQLiteTransaction";
	transaction(transaction) {
		const savepointName = `sp${this.nestedIndex}`;
		const tx = new OPSQLiteTransaction("async", this.dialect, this.session, this.relations, this.schema, this.nestedIndex + 1);
		this.session.run(sql.raw(`savepoint ${savepointName}`));
		try {
			const result = transaction(tx);
			this.session.run(sql.raw(`release savepoint ${savepointName}`));
			return result;
		} catch (err) {
			this.session.run(sql.raw(`rollback to savepoint ${savepointName}`));
			throw err;
		}
	}
};
var OPSQLitePreparedQuery = class extends SQLitePreparedQuery$1 {
	static [entityKind] = "OPSQLitePreparedQuery";
	constructor(client, query, logger, cache, queryMetadata, cacheConfig, fields, executeMethod, _isResponseInArrayMode, customResultMapper, isRqbV2Query) {
		super("sync", executeMethod, query, cache, queryMetadata, cacheConfig);
		this.client = client;
		this.logger = logger;
		this.fields = fields;
		this._isResponseInArrayMode = _isResponseInArrayMode;
		this.customResultMapper = customResultMapper;
		this.isRqbV2Query = isRqbV2Query;
	}
	async run(placeholderValues) {
		const params = fillPlaceholders(this.query.params, placeholderValues ?? {});
		this.logger.logQuery(this.query.sql, params);
		return await this.queryWithCache(this.query.sql, params, async () => {
			return this.client.executeAsync(this.query.sql, params);
		});
	}
	async all(placeholderValues) {
		if (this.isRqbV2Query) return this.allRqbV2(placeholderValues);
		const { fields, joinsNotNullableMap, query, logger, customResultMapper, client } = this;
		if (!fields && !customResultMapper) {
			const params = fillPlaceholders(query.params, placeholderValues ?? {});
			logger.logQuery(query.sql, params);
			return await this.queryWithCache(query.sql, params, async () => {
				return client.execute(query.sql, params).rows?._array || [];
			});
		}
		const rows = await this.values(placeholderValues);
		if (customResultMapper) return customResultMapper(rows);
		return rows.map((row) => mapResultRow(fields, row, joinsNotNullableMap));
	}
	async allRqbV2(placeholderValues) {
		const { query, logger, customResultMapper, client } = this;
		const params = fillPlaceholders(query.params, placeholderValues ?? {});
		logger.logQuery(query.sql, params);
		return customResultMapper(client.execute(query.sql, params).rows?._array || []);
	}
	async get(placeholderValues) {
		if (this.isRqbV2Query) return this.getRqbV2(placeholderValues);
		const { fields, joinsNotNullableMap, customResultMapper, query, logger, client } = this;
		const params = fillPlaceholders(query.params, placeholderValues ?? {});
		logger.logQuery(query.sql, params);
		if (!fields && !customResultMapper) return (await this.queryWithCache(query.sql, params, async () => {
			return client.execute(query.sql, params).rows?._array || [];
		}))[0];
		const rows = await this.values(placeholderValues);
		const row = rows[0];
		if (!row) return;
		if (customResultMapper) return customResultMapper(rows);
		return mapResultRow(fields, row, joinsNotNullableMap);
	}
	async getRqbV2(placeholderValues) {
		const { customResultMapper, query, logger, client } = this;
		const params = fillPlaceholders(query.params, placeholderValues ?? {});
		logger.logQuery(query.sql, params);
		const row = (client.execute(query.sql, params).rows?._array || [])[0];
		if (!row) return;
		return customResultMapper([row]);
	}
	async values(placeholderValues) {
		const params = fillPlaceholders(this.query.params, placeholderValues ?? {});
		this.logger.logQuery(this.query.sql, params);
		return await this.queryWithCache(this.query.sql, params, async () => {
			return await this.client.executeRawAsync(this.query.sql, params);
		});
	}
	/** @internal */
	isResponseInArrayMode() {
		return this._isResponseInArrayMode;
	}
};

//#endregion
export { OPSQLitePreparedQuery, OPSQLiteSession, OPSQLiteTransaction };
//# sourceMappingURL=session.js.map