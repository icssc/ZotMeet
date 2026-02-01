const require_rolldown_runtime = require('../_virtual/rolldown_runtime.cjs');
let __entity_ts = require("../entity.cjs");
let __utils_ts = require("../utils.cjs");
let __sql_sql_ts = require("../sql/sql.cjs");
let __logger_ts = require("../logger.cjs");
let __sqlite_core_index_ts = require("../sqlite-core/index.cjs");
let __sqlite_core_session_ts = require("../sqlite-core/session.cjs");

//#region src/expo-sqlite/session.ts
var ExpoSQLiteSession = class extends __sqlite_core_session_ts.SQLiteSession {
	static [__entity_ts.entityKind] = "ExpoSQLiteSession";
	logger;
	constructor(client, dialect, relations, schema, options = {}) {
		super(dialect);
		this.client = client;
		this.relations = relations;
		this.schema = schema;
		this.logger = options.logger ?? new __logger_ts.NoopLogger();
	}
	prepareQuery(query, fields, executeMethod, isResponseInArrayMode, customResultMapper) {
		return new ExpoSQLitePreparedQuery(this.client.prepareSync(query.sql), query, this.logger, fields, executeMethod, isResponseInArrayMode, customResultMapper);
	}
	prepareRelationalQuery(query, fields, executeMethod, customResultMapper) {
		return new ExpoSQLitePreparedQuery(this.client.prepareSync(query.sql), query, this.logger, fields, executeMethod, false, customResultMapper, true);
	}
	transaction(transaction, config = {}) {
		const tx = new ExpoSQLiteTransaction("sync", this.dialect, this, this.relations, this.schema);
		this.run(__sql_sql_ts.sql.raw(`begin${config?.behavior ? " " + config.behavior : ""}`));
		try {
			const result = transaction(tx);
			this.run(__sql_sql_ts.sql`commit`);
			return result;
		} catch (err) {
			this.run(__sql_sql_ts.sql`rollback`);
			throw err;
		}
	}
};
var ExpoSQLiteTransaction = class ExpoSQLiteTransaction extends __sqlite_core_index_ts.SQLiteTransaction {
	static [__entity_ts.entityKind] = "ExpoSQLiteTransaction";
	transaction(transaction) {
		const savepointName = `sp${this.nestedIndex}`;
		const tx = new ExpoSQLiteTransaction("sync", this.dialect, this.session, this.relations, this.schema, this.nestedIndex + 1);
		this.session.run(__sql_sql_ts.sql.raw(`savepoint ${savepointName}`));
		try {
			const result = transaction(tx);
			this.session.run(__sql_sql_ts.sql.raw(`release savepoint ${savepointName}`));
			return result;
		} catch (err) {
			this.session.run(__sql_sql_ts.sql.raw(`rollback to savepoint ${savepointName}`));
			throw err;
		}
	}
};
var ExpoSQLitePreparedQuery = class extends __sqlite_core_session_ts.SQLitePreparedQuery {
	static [__entity_ts.entityKind] = "ExpoSQLitePreparedQuery";
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
		const params = (0, __sql_sql_ts.fillPlaceholders)(this.query.params, placeholderValues ?? {});
		this.logger.logQuery(this.query.sql, params);
		const { changes, lastInsertRowId } = this.stmt.executeSync(params);
		return {
			changes,
			lastInsertRowId
		};
	}
	all(placeholderValues) {
		if (this.isRqbV2Query) return this.allRqbV2(placeholderValues);
		const { fields, joinsNotNullableMap, query, logger, stmt, customResultMapper } = this;
		if (!fields && !customResultMapper) {
			const params = (0, __sql_sql_ts.fillPlaceholders)(query.params, placeholderValues ?? {});
			logger.logQuery(query.sql, params);
			return stmt.executeSync(params).getAllSync();
		}
		const rows = this.values(placeholderValues);
		if (customResultMapper) return customResultMapper(rows);
		return rows.map((row) => (0, __utils_ts.mapResultRow)(fields, row, joinsNotNullableMap));
	}
	allRqbV2(placeholderValues) {
		const { query, logger, stmt, customResultMapper } = this;
		const params = (0, __sql_sql_ts.fillPlaceholders)(query.params, placeholderValues ?? {});
		logger.logQuery(query.sql, params);
		return customResultMapper(stmt.executeSync(params).getAllSync());
	}
	get(placeholderValues) {
		if (this.isRqbV2Query) return this.getRqbV2(placeholderValues);
		const params = (0, __sql_sql_ts.fillPlaceholders)(this.query.params, placeholderValues ?? {});
		this.logger.logQuery(this.query.sql, params);
		const { fields, stmt, joinsNotNullableMap, customResultMapper } = this;
		if (!fields && !customResultMapper) return stmt.executeSync(params).getFirstSync();
		const rows = this.values(placeholderValues);
		const row = rows[0];
		if (!row) return;
		if (customResultMapper) return customResultMapper(rows);
		return (0, __utils_ts.mapResultRow)(fields, row, joinsNotNullableMap);
	}
	getRqbV2(placeholderValues) {
		const params = (0, __sql_sql_ts.fillPlaceholders)(this.query.params, placeholderValues ?? {});
		this.logger.logQuery(this.query.sql, params);
		const { stmt, customResultMapper } = this;
		const row = stmt.executeSync(params).getFirstSync();
		if (!row) return;
		return customResultMapper([row]);
	}
	values(placeholderValues) {
		const params = (0, __sql_sql_ts.fillPlaceholders)(this.query.params, placeholderValues ?? {});
		this.logger.logQuery(this.query.sql, params);
		return this.stmt.executeForRawResultSync(params).getAllSync();
	}
	/** @internal */
	isResponseInArrayMode() {
		return this._isResponseInArrayMode;
	}
};

//#endregion
exports.ExpoSQLitePreparedQuery = ExpoSQLitePreparedQuery;
exports.ExpoSQLiteSession = ExpoSQLiteSession;
exports.ExpoSQLiteTransaction = ExpoSQLiteTransaction;
//# sourceMappingURL=session.cjs.map