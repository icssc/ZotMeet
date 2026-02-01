const require_rolldown_runtime = require('../../../_virtual/rolldown_runtime.cjs');
const require_pg_core_columns_common = require('../common.cjs');
const require_pg_core_columns_postgis_extension_utils = require('./utils.cjs');
let __entity_ts = require("../../../entity.cjs");
let __utils_ts = require("../../../utils.cjs");

//#region src/pg-core/columns/postgis_extension/geometry.ts
var PgGeometryBuilder = class extends require_pg_core_columns_common.PgColumnBuilder {
	static [__entity_ts.entityKind] = "PgGeometryBuilder";
	constructor(name, srid) {
		super(name, "array geometry", "PgGeometry");
		this.config.srid = srid;
	}
	/** @internal */
	build(table) {
		return new PgGeometry(table, this.config);
	}
};
var PgGeometry = class extends require_pg_core_columns_common.PgColumn {
	static [__entity_ts.entityKind] = "PgGeometry";
	srid = this.config.srid;
	mode = "tuple";
	getSQLType() {
		return `geometry(point${this.srid === void 0 ? "" : `,${this.srid}`})`;
	}
	mapFromDriverValue(value) {
		if (typeof value !== "string") return value;
		return require_pg_core_columns_postgis_extension_utils.parseEWKB(value).point;
	}
	mapToDriverValue(value) {
		return `point(${value[0]} ${value[1]})`;
	}
};
var PgGeometryObjectBuilder = class extends require_pg_core_columns_common.PgColumnBuilder {
	static [__entity_ts.entityKind] = "PgGeometryObjectBuilder";
	constructor(name, srid) {
		super(name, "object geometry", "PgGeometryObject");
		this.config.srid = srid;
	}
	/** @internal */
	build(table) {
		return new PgGeometryObject(table, this.config);
	}
};
var PgGeometryObject = class extends require_pg_core_columns_common.PgColumn {
	static [__entity_ts.entityKind] = "PgGeometryObject";
	srid = this.config.srid;
	mode = "object";
	getSQLType() {
		return `geometry(point${this.srid === void 0 ? "" : `,${this.srid}`})`;
	}
	mapFromDriverValue(value) {
		const parsed = require_pg_core_columns_postgis_extension_utils.parseEWKB(value);
		return {
			x: parsed.point[0],
			y: parsed.point[1]
		};
	}
	mapToDriverValue(value) {
		return `point(${value.x} ${value.y})`;
	}
};
function geometry(a, b) {
	const { name, config } = (0, __utils_ts.getColumnNameAndConfig)(a, b);
	if (!config?.mode || config.mode === "tuple") return new PgGeometryBuilder(name, config?.srid);
	return new PgGeometryObjectBuilder(name, config?.srid);
}

//#endregion
exports.PgGeometry = PgGeometry;
exports.PgGeometryBuilder = PgGeometryBuilder;
exports.PgGeometryObject = PgGeometryObject;
exports.PgGeometryObjectBuilder = PgGeometryObjectBuilder;
exports.geometry = geometry;
//# sourceMappingURL=geometry.cjs.map