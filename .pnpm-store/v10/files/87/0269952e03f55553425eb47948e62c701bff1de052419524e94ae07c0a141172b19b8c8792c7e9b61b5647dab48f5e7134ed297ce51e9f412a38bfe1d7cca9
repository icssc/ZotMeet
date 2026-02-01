import { entityKind } from "../entity.js";
import { mapResultRow } from "../utils.js";
import { fillPlaceholders, sql } from "../sql/sql.js";
import { NoopLogger } from "../logger.js";
import { SQLiteTransaction } from "../sqlite-core/index.js";
import { SQLitePreparedQuery as SQLitePreparedQuery$1, SQLiteSession as SQLiteSession$1 } from "../sqlite-core/session.js";

//#region src/bun-sqlite/session.ts
var SQLiteBunSession = class extends SQLiteSession$1 {
	static [entityKind] = "SQLiteBunSession";
	logger;
	constructor(client, dialect, relations, schema, options = {}) {
		super(dialect);
		this.client = client;
		this.relations = relations;
		this.schema = schema;
		this.logger = options.logger ?? new NoopLogger();
	}
	exec(query) {
		this.client.exec(query);
	}
	prepareQuery(query, fields, executeMethod, isResponseInArrayMode, customResultMapper) {
		return new PreparedQuery(this.client.prepare(query.sql), query, this.logger, fields, executeMethod, isResponseInArrayMode, customResultMapper);
	}
	prepareRelationalQuery(query, fields, executeMethod, customResultMapper) {
		return new PreparedQuery(this.client.prepare(query.sql), query, this.logger, fields, executeMethod, false, customResultMapper, true);
	}
	transaction(transaction, config = {}) {
		const tx = new SQLiteBunTransaction("sync", this.dialect, this, this.relations, this.schema);
		let result;
		this.client.transaction(() => {
			result = transaction(tx);
		})[config.behavior ?? "deferred"]();
		return result;
	}
};
var SQLiteBunTransaction = class SQLiteBunTransaction extends SQLiteTransaction {
	static [entityKind] = "SQLiteBunTransaction";
	transaction(transaction) {
		const savepointName = `sp${this.nestedIndex}`;
		const tx = new SQLiteBunTransaction("sync", this.dialect, this.session, this.relations, this.schema, this.nestedIndex + 1);
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
var PreparedQuery = class extends SQLitePreparedQuery$1 {
	static [entityKind] = "SQLiteBunPreparedQuery";
	constructor(stmt, query, logger, fields, executeMethod, _isResponseInArrayMode, customResultMapper, isRqbV2Query) {
		super("sync", executeMethod, query);
		this.stmt = stmt;
		this.logger = logger;
		this.fields = fields;
		this._isResponseInArrayMode = _isResponseInArrayMode;
		this.customResultMapper = customResultMapper;
		this.isRqbV2Query = isRqbV2Query;
	}
	run(placeholderValues) {
		const params = fillPlaceholders(this.query.params, placeholderValues ?? {});
		this.logger.logQuery(this.query.sql, params);
		return this.stmt.run(...params);
	}
	all(placeholderValues) {
		if (this.isRqbV2Query) return this.allRqbV2(placeholderValues);
		const { fields, query, logger, joinsNotNullableMap, stmt, customResultMapper } = this;
		if (!fields && !customResultMapper) {
			const params = fillPlaceholders(query.params, placeholderValues ?? {});
			logger.logQuery(query.sql, params);
			return stmt.all(...params);
		}
		const rows = this.values(placeholderValues);
		if (customResultMapper) return customResultMapper(rows);
		return rows.map((row) => mapResultRow(fields, row, joinsNotNullableMap));
	}
	get(placeholderValues) {
		if (this.isRqbV2Query) return this.getRqbV2(placeholderValues);
		const params = fillPlaceholders(this.query.params, placeholderValues ?? {});
		this.logger.logQuery(this.query.sql, params);
		const { fields, joinsNotNullableMap, customResultMapper } = this;
		if (!fields && !customResultMapper) {
			const row$1 = this.stmt.get(...params);
			if (!row$1) return void 0;
			return row$1;
		}
		const row = this.stmt.values(...params)[0];
		if (!row) return;
		if (customResultMapper) return customResultMapper([row]);
		return mapResultRow(fields, row, joinsNotNullableMap);
	}
	allRqbV2(placeholderValues) {
		const { query, logger, stmt, customResultMapper } = this;
		const params = fillPlaceholders(query.params, placeholderValues ?? {});
		logger.logQuery(query.sql, params);
		return customResultMapper(stmt.all(...params));
	}
	getRqbV2(placeholderValues) {
		const params = fillPlaceholders(this.query.params, placeholderValues ?? {});
		this.logger.logQuery(this.query.sql, params);
		const { stmt, customResultMapper } = this;
		const row = stmt.get(...params);
		if (!row) return void 0;
		return customResultMapper([row]);
	}
	values(placeholderValues) {
		const params = fillPlaceholders(this.query.params, placeholderValues ?? {});
		this.logger.logQuery(this.query.sql, params);
		return this.stmt.values(...params);
	}
	/** @internal */
	isResponseInArrayMode() {
		return this._isResponseInArrayMode;
	}
};

//#endregion
export { PreparedQuery, SQLiteBunSession, SQLiteBunTransaction };
//# sourceMappingURL=session.js.map