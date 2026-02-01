const require_rolldown_runtime = require('../../_virtual/rolldown_runtime.cjs');
const require_mysql_core_columns_common = require('./common.cjs');
let __entity_ts = require("../../entity.cjs");
let __utils_ts = require("../../utils.cjs");

//#region src/mysql-core/columns/blob.ts
var MySqlStringBlobBuilder = class extends require_mysql_core_columns_common.MySqlColumnBuilder {
	static [__entity_ts.entityKind] = "MySqlBlobBuilder";
	constructor(name, blobType) {
		super(name, "string", "MySqlBlob");
		this.config.blobType = blobType;
		switch (blobType) {
			case "tinyblob":
				this.config.length = 255;
				break;
			case "blob":
				this.config.length = 65535;
				break;
			case "mediumblob":
				this.config.length = 16777215;
				break;
			case "longblob":
				this.config.length = 4294967295;
				break;
		}
	}
	/** @internal */
	build(table) {
		return new MySqlStringBlob(table, this.config);
	}
};
var MySqlStringBlob = class extends require_mysql_core_columns_common.MySqlColumn {
	static [__entity_ts.entityKind] = "MySqlBlob";
	blobType = this.config.blobType;
	getSQLType() {
		return this.blobType;
	}
	mapFromDriverValue(value) {
		if (typeof value === "string") return atob(value);
		if (typeof Buffer !== "undefined" && Buffer.from) return (Buffer.isBuffer(value) ? value : value instanceof ArrayBuffer ? Buffer.from(value) : value.buffer ? Buffer.from(value.buffer, value.byteOffset, value.byteLength) : Buffer.from(value)).toString("utf8");
		return __utils_ts.textDecoder.decode(value);
	}
};
var MySqlBufferBlobBuilder = class extends require_mysql_core_columns_common.MySqlColumnBuilder {
	static [__entity_ts.entityKind] = "MySqlBlobBuilder";
	constructor(name, blobType) {
		super(name, "string", "MySqlBlob");
		this.config.blobType = blobType;
		switch (blobType) {
			case "tinyblob":
				this.config.length = 255;
				break;
			case "blob":
				this.config.length = 65535;
				break;
			case "mediumblob":
				this.config.length = 16777215;
				break;
			case "longblob":
				this.config.length = 4294967295;
				break;
		}
	}
	/** @internal */
	build(table) {
		return new MySqlBufferBlob(table, this.config);
	}
};
var MySqlBufferBlob = class extends require_mysql_core_columns_common.MySqlColumn {
	static [__entity_ts.entityKind] = "MySqlBlob";
	blobType = this.config.blobType;
	getSQLType() {
		return this.blobType;
	}
	mapFromDriverValue(value) {
		if (typeof value === "string") return Buffer.from(value, "base64");
		if (Buffer.isBuffer(value)) return value;
		return Buffer.from(value);
	}
};
function blob(a, b = {}) {
	const { name, config } = (0, __utils_ts.getColumnNameAndConfig)(a, b);
	if (config?.mode === "string") return new MySqlStringBlobBuilder(name, "blob");
	return new MySqlBufferBlobBuilder(name, "blob");
}
function tinyblob(a, b = {}) {
	const { name, config } = (0, __utils_ts.getColumnNameAndConfig)(a, b);
	if (config?.mode === "string") return new MySqlStringBlobBuilder(name, "tinyblob");
	return new MySqlBufferBlobBuilder(name, "tinyblob");
}
function mediumblob(a, b = {}) {
	const { name, config } = (0, __utils_ts.getColumnNameAndConfig)(a, b);
	if (config?.mode === "string") return new MySqlStringBlobBuilder(name, "mediumblob");
	return new MySqlBufferBlobBuilder(name, "mediumblob");
}
function longblob(a, b = {}) {
	const { name, config } = (0, __utils_ts.getColumnNameAndConfig)(a, b);
	if (config?.mode === "string") return new MySqlStringBlobBuilder(name, "longblob");
	return new MySqlBufferBlobBuilder(name, "longblob");
}

//#endregion
exports.MySqlBufferBlob = MySqlBufferBlob;
exports.MySqlBufferBlobBuilder = MySqlBufferBlobBuilder;
exports.MySqlStringBlob = MySqlStringBlob;
exports.MySqlStringBlobBuilder = MySqlStringBlobBuilder;
exports.blob = blob;
exports.longblob = longblob;
exports.mediumblob = mediumblob;
exports.tinyblob = tinyblob;
//# sourceMappingURL=blob.cjs.map