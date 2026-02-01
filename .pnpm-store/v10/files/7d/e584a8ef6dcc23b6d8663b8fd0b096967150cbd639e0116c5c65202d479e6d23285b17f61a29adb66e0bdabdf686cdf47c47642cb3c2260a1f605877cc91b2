const require_rolldown_runtime = require('../_virtual/rolldown_runtime.cjs');
let __entity_ts = require("../entity.cjs");
let __utils_ts = require("../utils.cjs");
let __sql_sql_ts = require("../sql/sql.cjs");
let __logger_ts = require("../logger.cjs");
let __sqlite_core_index_ts = require("../sqlite-core/index.cjs");
let __sqlite_core_session_ts = require("../sqlite-core/session.cjs");

//#region src/sql-js/session.ts
var SQLJsSession = class extends __sqlite_core_session_ts.SQLiteSession {
	static [__entity_ts.entityKind] = "SQLJsSession";
	logger;
	constructor(client, dialect, relations, schema, options = {}) {
		super(dialect);
		this.client = client;
		this.relations = relations;
		this.schema = schema;
		this.logger = options.logger ?? new __logger_ts.NoopLogger();
	}
	prepareQuery(query, fields, executeMethod, isResponseInArrayMode) {
		return new PreparedQuery(this.client, query, this.logger, fields, executeMethod, isResponseInArrayMode);
	}
	prepareRelationalQuery(query, fields, executeMethod, customResultMapper) {
		return new PreparedQuery(this.client, query, this.logger, fields, executeMethod, false, customResultMapper, true);
	}
	transaction(transaction, config = {}) {
		const tx = new SQLJsTransaction("sync", this.dialect, this, this.relations, this.schema);
		this.run(__sql_sql_ts.sql.raw(`begin${config.behavior ? ` ${config.behavior}` : ""}`));
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
var SQLJsTransaction = class SQLJsTransaction extends __sqlite_core_index_ts.SQLiteTransaction {
	static [__entity_ts.entityKind] = "SQLJsTransaction";
	transaction(transaction) {
		const savepointName = `sp${this.nestedIndex + 1}`;
		const tx = new SQLJsTransaction("sync", this.dialect, this.session, this.relations, this.schema, this.nestedIndex + 1);
		tx.run(__sql_sql_ts.sql.raw(`savepoint ${savepointName}`));
		try {
			const result = transaction(tx);
			tx.run(__sql_sql_ts.sql.raw(`release savepoint ${savepointName}`));
			return result;
		} catch (err) {
			tx.run(__sql_sql_ts.sql.raw(`rollback to savepoint ${savepointName}`));
			throw err;
		}
	}
};
var PreparedQuery = class extends __sqlite_core_session_ts.SQLitePreparedQuery {
	static [__entity_ts.entityKind] = "SQLJsPreparedQuery";
	constructor(client, query, logger, fields, executeMethod, _isResponseInArrayMode, customResultMapper, isRqbV2Query) {
		super("sync", executeMethod, query);
		this.client = client;
		this.logger = logger;
		this.fields = fields;
		this._isResponseInArrayMode = _isResponseInArrayMode;
		this.customResultMapper = customResultMapper;
		this.isRqbV2Query = isRqbV2Query;
	}
	run(placeholderValues) {
		const stmt = this.client.prepare(this.query.sql);
		const params = (0, __sql_sql_ts.fillPlaceholders)(this.query.params, placeholderValues ?? {});
		this.logger.logQuery(this.query.sql, params);
		const result = stmt.run(params);
		stmt.free();
		return result;
	}
	all(placeholderValues) {
		if (this.isRqbV2Query) return this.allRqbV2(placeholderValues);
		const stmt = this.client.prepare(this.query.sql);
		const { fields, joinsNotNullableMap, logger, query, customResultMapper } = this;
		if (!fields && !customResultMapper) {
			const params = (0, __sql_sql_ts.fillPlaceholders)(query.params, placeholderValues ?? {});
			logger.logQuery(query.sql, params);
			stmt.bind(params);
			const rows$1 = [];
			while (stmt.step()) rows$1.push(stmt.getAsObject());
			stmt.free();
			return rows$1;
		}
		const rows = this.values(placeholderValues);
		if (customResultMapper) return customResultMapper(rows, normalizeFieldValue);
		return rows.map((row) => (0, __utils_ts.mapResultRow)(fields, row.map((v) => normalizeFieldValue(v)), joinsNotNullableMap));
	}
	allRqbV2(placeholderValues) {
		const stmt = this.client.prepare(this.query.sql);
		const { logger, query, customResultMapper } = this;
		const params = (0, __sql_sql_ts.fillPlaceholders)(query.params, placeholderValues ?? {});
		logger.logQuery(query.sql, params);
		stmt.bind(params);
		const rows = [];
		while (stmt.step()) rows.push(stmt.getAsObject());
		stmt.free();
		return customResultMapper(rows, normalizeFieldValue);
	}
	get(placeholderValues) {
		if (this.isRqbV2Query) return this.getRqbV2(placeholderValues);
		const stmt = this.client.prepare(this.query.sql);
		const params = (0, __sql_sql_ts.fillPlaceholders)(this.query.params, placeholderValues ?? {});
		this.logger.logQuery(this.query.sql, params);
		const { fields, joinsNotNullableMap, customResultMapper } = this;
		if (!fields && !customResultMapper) {
			const result = stmt.getAsObject(params);
			stmt.free();
			return result;
		}
		const row = stmt.get(params);
		stmt.free();
		if (!row || row.length === 0 && fields.length > 0) return;
		if (customResultMapper) return customResultMapper([row], normalizeFieldValue);
		return (0, __utils_ts.mapResultRow)(fields, row.map((v) => normalizeFieldValue(v)), joinsNotNullableMap);
	}
	getRqbV2(placeholderValues) {
		const stmt = this.client.prepare(this.query.sql);
		const params = (0, __sql_sql_ts.fillPlaceholders)(this.query.params, placeholderValues ?? {});
		this.logger.logQuery(this.query.sql, params);
		const { customResultMapper } = this;
		const row = stmt.getAsObject(params);
		stmt.free();
		if (!row) return;
		let nonUndef = false;
		for (const v of Object.values(row)) if (v !== void 0) {
			nonUndef = true;
			break;
		}
		if (!nonUndef) return void 0;
		return customResultMapper([row], normalizeFieldValue);
	}
	values(placeholderValues) {
		const stmt = this.client.prepare(this.query.sql);
		const params = (0, __sql_sql_ts.fillPlaceholders)(this.query.params, placeholderValues ?? {});
		this.logger.logQuery(this.query.sql, params);
		stmt.bind(params);
		const rows = [];
		while (stmt.step()) rows.push(stmt.get());
		stmt.free();
		return rows;
	}
	/** @internal */
	isResponseInArrayMode() {
		return this._isResponseInArrayMode;
	}
};
function normalizeFieldValue(value) {
	if (value instanceof Uint8Array) {
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
exports.PreparedQuery = PreparedQuery;
exports.SQLJsSession = SQLJsSession;
exports.SQLJsTransaction = SQLJsTransaction;
//# sourceMappingURL=session.cjs.map