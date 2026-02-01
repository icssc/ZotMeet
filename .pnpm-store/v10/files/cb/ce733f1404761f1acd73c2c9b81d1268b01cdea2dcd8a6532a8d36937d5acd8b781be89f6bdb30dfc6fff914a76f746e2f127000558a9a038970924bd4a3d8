import { entityKind } from "../entity.js";
import { mapResultRow } from "../utils.js";
import { fillPlaceholders, sql } from "../sql/sql.js";
import { NoopLogger } from "../logger.js";
import { NoopCache } from "../cache/core/index.js";
import { SQLiteTransaction } from "../sqlite-core/index.js";
import { SQLitePreparedQuery as SQLitePreparedQuery$1, SQLiteSession as SQLiteSession$1 } from "../sqlite-core/session.js";

//#region src/d1/session.ts
var SQLiteD1Session = class extends SQLiteSession$1 {
	static [entityKind] = "SQLiteD1Session";
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
	prepareQuery(query, fields, executeMethod, isResponseInArrayMode, customResultMapper, queryMetadata, cacheConfig) {
		return new D1PreparedQuery(this.client.prepare(query.sql), query, this.logger, this.cache, queryMetadata, cacheConfig, fields, executeMethod, isResponseInArrayMode, customResultMapper);
	}
	prepareRelationalQuery(query, fields, executeMethod, customResultMapper) {
		return new D1PreparedQuery(this.client.prepare(query.sql), query, this.logger, this.cache, void 0, void 0, fields, executeMethod, false, customResultMapper, true);
	}
	async batch(queries) {
		const preparedQueries = [];
		const builtQueries = [];
		for (const query of queries) {
			const preparedQuery = query._prepare();
			const builtQuery = preparedQuery.getQuery();
			preparedQueries.push(preparedQuery);
			if (builtQuery.params.length > 0) builtQueries.push(preparedQuery.stmt.bind(...builtQuery.params));
			else {
				const builtQuery$1 = preparedQuery.getQuery();
				builtQueries.push(this.client.prepare(builtQuery$1.sql).bind(...builtQuery$1.params));
			}
		}
		return (await this.client.batch(builtQueries)).map((result, i) => preparedQueries[i].mapResult(result, true));
	}
	extractRawAllValueFromBatchResult(result) {
		return result.results;
	}
	extractRawGetValueFromBatchResult(result) {
		return result.results[0];
	}
	extractRawValuesValueFromBatchResult(result) {
		return d1ToRawMapping(result.results);
	}
	async transaction(transaction, config) {
		const tx = new D1Transaction("async", this.dialect, this, this.relations, this.schema, void 0, void 0, true);
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
};
var D1Transaction = class D1Transaction extends SQLiteTransaction {
	static [entityKind] = "D1Transaction";
	async transaction(transaction) {
		const savepointName = `sp${this.nestedIndex}`;
		const tx = new D1Transaction("async", this.dialect, this.session, this.relations, this.schema, this.nestedIndex + 1, void 0, this.forbidJsonb);
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
/**
* This function was taken from the D1 implementation: https://github.com/cloudflare/workerd/blob/4aae9f4c7ae30a59a88ca868c4aff88bda85c956/src/cloudflare/internal/d1-api.ts#L287
* It may cause issues with duplicated column names in join queries, which should be fixed on the D1 side.
* @param results
* @returns
*/
function d1ToRawMapping(results) {
	const rows = [];
	for (const row of results) {
		const entry = Object.keys(row).map((k) => row[k]);
		rows.push(entry);
	}
	return rows;
}
var D1PreparedQuery = class extends SQLitePreparedQuery$1 {
	static [entityKind] = "D1PreparedQuery";
	/** @internal */
	fields;
	/** @internal */
	stmt;
	constructor(stmt, query, logger, cache, queryMetadata, cacheConfig, fields, executeMethod, _isResponseInArrayMode, customResultMapper, isRqbV2Query) {
		super("async", executeMethod, query, cache, queryMetadata, cacheConfig);
		this.logger = logger;
		this._isResponseInArrayMode = _isResponseInArrayMode;
		this.customResultMapper = customResultMapper;
		this.isRqbV2Query = isRqbV2Query;
		this.fields = fields;
		this.stmt = stmt;
	}
	async run(placeholderValues) {
		const params = fillPlaceholders(this.query.params, placeholderValues ?? {});
		this.logger.logQuery(this.query.sql, params);
		return await this.queryWithCache(this.query.sql, params, async () => {
			return this.stmt.bind(...params).run();
		});
	}
	async all(placeholderValues) {
		if (this.isRqbV2Query) return this.allRqbV2(placeholderValues);
		const { fields, query, logger, stmt, customResultMapper } = this;
		if (!fields && !customResultMapper) {
			const params = fillPlaceholders(query.params, placeholderValues ?? {});
			logger.logQuery(query.sql, params);
			return await this.queryWithCache(query.sql, params, async () => {
				return stmt.bind(...params).all().then(({ results }) => this.mapAllResult(results));
			});
		}
		const rows = await this.values(placeholderValues);
		return this.mapAllResult(rows);
	}
	async allRqbV2(placeholderValues) {
		const { query, logger, stmt, customResultMapper } = this;
		const params = fillPlaceholders(query.params, placeholderValues ?? {});
		logger.logQuery(query.sql, params);
		return stmt.bind(...params).all().then(({ results }) => customResultMapper(results));
	}
	mapAllResult(rows, isFromBatch) {
		if (isFromBatch) rows = this.isRqbV2Query ? rows.results : d1ToRawMapping(rows.results);
		if (!this.fields && !this.customResultMapper) return rows;
		if (this.customResultMapper) return this.customResultMapper(rows);
		return rows.map((row) => mapResultRow(this.fields, row, this.joinsNotNullableMap));
	}
	async get(placeholderValues) {
		if (this.isRqbV2Query) return this.getRqbV2(placeholderValues);
		const { fields, joinsNotNullableMap, query, logger, stmt, customResultMapper } = this;
		if (!fields && !customResultMapper) {
			const params = fillPlaceholders(query.params, placeholderValues ?? {});
			logger.logQuery(query.sql, params);
			return await this.queryWithCache(query.sql, params, async () => {
				return stmt.bind(...params).all().then(({ results }) => results[0]);
			});
		}
		const rows = await this.values(placeholderValues);
		if (!rows[0]) return;
		if (customResultMapper) return customResultMapper(rows);
		return mapResultRow(fields, rows[0], joinsNotNullableMap);
	}
	async getRqbV2(placeholderValues) {
		const { query, logger, stmt, customResultMapper } = this;
		const params = fillPlaceholders(query.params, placeholderValues ?? {});
		logger.logQuery(query.sql, params);
		const { results: rows } = await stmt.bind(...params).all();
		if (!rows[0]) return;
		return customResultMapper(rows);
	}
	mapGetResult(result, isFromBatch) {
		if (isFromBatch) result = this.isRqbV2Query ? result.results[0] : d1ToRawMapping(result.results)[0];
		if (!this.fields && !this.customResultMapper) return result;
		if (this.customResultMapper) return this.customResultMapper([result]);
		return mapResultRow(this.fields, result, this.joinsNotNullableMap);
	}
	async values(placeholderValues) {
		const params = fillPlaceholders(this.query.params, placeholderValues ?? {});
		this.logger.logQuery(this.query.sql, params);
		return await this.queryWithCache(this.query.sql, params, async () => {
			return this.stmt.bind(...params).raw();
		});
	}
	/** @internal */
	isResponseInArrayMode() {
		return this._isResponseInArrayMode;
	}
};

//#endregion
export { D1PreparedQuery, D1Transaction, SQLiteD1Session };
//# sourceMappingURL=session.js.map