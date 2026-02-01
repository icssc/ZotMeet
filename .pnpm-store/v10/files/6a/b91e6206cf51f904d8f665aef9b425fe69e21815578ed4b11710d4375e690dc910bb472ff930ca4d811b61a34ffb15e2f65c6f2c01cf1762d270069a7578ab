import { PgColumn } from "./common.js";
import { PgDateColumnBuilder } from "./date.common.js";
import { entityKind } from "../../entity.js";
import { getColumnNameAndConfig } from "../../utils.js";

//#region src/pg-core/columns/timestamp.ts
var PgTimestampBuilder = class extends PgDateColumnBuilder {
	static [entityKind] = "PgTimestampBuilder";
	constructor(name, withTimezone, precision) {
		super(name, "object date", "PgTimestamp");
		this.config.withTimezone = withTimezone;
		this.config.precision = precision;
	}
	/** @internal */
	build(table) {
		return new PgTimestamp(table, this.config);
	}
};
var PgTimestamp = class extends PgColumn {
	static [entityKind] = "PgTimestamp";
	withTimezone;
	precision;
	constructor(table, config) {
		super(table, config);
		this.withTimezone = config.withTimezone;
		this.precision = config.precision;
	}
	getSQLType() {
		return `timestamp${this.precision === void 0 ? "" : ` (${this.precision})`}${this.withTimezone ? " with time zone" : ""}`;
	}
	mapFromDriverValue(value) {
		if (typeof value === "string") return new Date(this.withTimezone ? value : value + "+0000");
		return value;
	}
	mapToDriverValue(value) {
		if (typeof value === "string") return value;
		return value.toISOString();
	}
};
var PgTimestampStringBuilder = class extends PgDateColumnBuilder {
	static [entityKind] = "PgTimestampStringBuilder";
	constructor(name, withTimezone, precision) {
		super(name, "string timestamp", "PgTimestampString");
		this.config.withTimezone = withTimezone;
		this.config.precision = precision;
	}
	/** @internal */
	build(table) {
		return new PgTimestampString(table, this.config);
	}
};
var PgTimestampString = class extends PgColumn {
	static [entityKind] = "PgTimestampString";
	withTimezone;
	precision;
	constructor(table, config) {
		super(table, config);
		this.withTimezone = config.withTimezone;
		this.precision = config.precision;
	}
	getSQLType() {
		return `timestamp${this.precision === void 0 ? "" : `(${this.precision})`}${this.withTimezone ? " with time zone" : ""}`;
	}
	mapFromDriverValue(value) {
		if (typeof value === "string") return value;
		const shortened = value.toISOString().slice(0, -1).replace("T", " ");
		if (this.withTimezone) return `${shortened}+00`;
		return shortened;
	}
	mapToDriverValue(value) {
		if (typeof value === "string") return value;
		return value.toISOString();
	}
};
function timestamp(a, b = {}) {
	const { name, config } = getColumnNameAndConfig(a, b);
	if (config?.mode === "string") return new PgTimestampStringBuilder(name, config.withTimezone ?? false, config.precision);
	return new PgTimestampBuilder(name, config?.withTimezone ?? false, config?.precision);
}

//#endregion
export { PgTimestamp, PgTimestampBuilder, PgTimestampString, PgTimestampStringBuilder, timestamp };
//# sourceMappingURL=timestamp.js.map