import { PgColumn, PgColumnBuilder } from "../common.js";
import { parseEWKB } from "./utils.js";
import { entityKind } from "../../../entity.js";
import { getColumnNameAndConfig } from "../../../utils.js";

//#region src/pg-core/columns/postgis_extension/geometry.ts
var PgGeometryBuilder = class extends PgColumnBuilder {
	static [entityKind] = "PgGeometryBuilder";
	constructor(name, srid) {
		super(name, "array geometry", "PgGeometry");
		this.config.srid = srid;
	}
	/** @internal */
	build(table) {
		return new PgGeometry(table, this.config);
	}
};
var PgGeometry = class extends PgColumn {
	static [entityKind] = "PgGeometry";
	srid = this.config.srid;
	mode = "tuple";
	getSQLType() {
		return `geometry(point${this.srid === void 0 ? "" : `,${this.srid}`})`;
	}
	mapFromDriverValue(value) {
		if (typeof value !== "string") return value;
		return parseEWKB(value).point;
	}
	mapToDriverValue(value) {
		return `point(${value[0]} ${value[1]})`;
	}
};
var PgGeometryObjectBuilder = class extends PgColumnBuilder {
	static [entityKind] = "PgGeometryObjectBuilder";
	constructor(name, srid) {
		super(name, "object geometry", "PgGeometryObject");
		this.config.srid = srid;
	}
	/** @internal */
	build(table) {
		return new PgGeometryObject(table, this.config);
	}
};
var PgGeometryObject = class extends PgColumn {
	static [entityKind] = "PgGeometryObject";
	srid = this.config.srid;
	mode = "object";
	getSQLType() {
		return `geometry(point${this.srid === void 0 ? "" : `,${this.srid}`})`;
	}
	mapFromDriverValue(value) {
		const parsed = parseEWKB(value);
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
	const { name, config } = getColumnNameAndConfig(a, b);
	if (!config?.mode || config.mode === "tuple") return new PgGeometryBuilder(name, config?.srid);
	return new PgGeometryObjectBuilder(name, config?.srid);
}

//#endregion
export { PgGeometry, PgGeometryBuilder, PgGeometryObject, PgGeometryObjectBuilder, geometry };
//# sourceMappingURL=geometry.js.map