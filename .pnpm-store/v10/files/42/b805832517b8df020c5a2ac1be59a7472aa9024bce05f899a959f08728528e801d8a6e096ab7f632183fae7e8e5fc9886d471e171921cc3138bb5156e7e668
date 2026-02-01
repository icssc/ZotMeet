import { MySqlDateBaseColumn, MySqlDateColumnBaseBuilder } from "./date.common.js";
import { entityKind } from "../../entity.js";
import { getColumnNameAndConfig } from "../../utils.js";

//#region src/mysql-core/columns/timestamp.ts
var MySqlTimestampBuilder = class extends MySqlDateColumnBaseBuilder {
	static [entityKind] = "MySqlTimestampBuilder";
	constructor(name, config) {
		super(name, "object date", "MySqlTimestamp");
		this.config.fsp = config?.fsp;
	}
	/** @internal */
	build(table) {
		return new MySqlTimestamp(table, this.config);
	}
};
var MySqlTimestamp = class extends MySqlDateBaseColumn {
	static [entityKind] = "MySqlTimestamp";
	fsp = this.config.fsp;
	getSQLType() {
		return `timestamp${this.fsp === void 0 ? "" : `(${this.fsp})`}`;
	}
	mapFromDriverValue(value) {
		if (typeof value === "string") return /* @__PURE__ */ new Date(value + "+0000");
		return value;
	}
	mapToDriverValue(value) {
		if (typeof value === "string") return value;
		return value.toISOString().slice(0, -1).replace("T", " ");
	}
};
var MySqlTimestampStringBuilder = class extends MySqlDateColumnBaseBuilder {
	static [entityKind] = "MySqlTimestampStringBuilder";
	constructor(name, config) {
		super(name, "string timestamp", "MySqlTimestampString");
		this.config.fsp = config?.fsp;
	}
	/** @internal */
	build(table) {
		return new MySqlTimestampString(table, this.config);
	}
};
var MySqlTimestampString = class extends MySqlDateBaseColumn {
	static [entityKind] = "MySqlTimestampString";
	fsp = this.config.fsp;
	getSQLType() {
		return `timestamp${this.fsp === void 0 ? "" : `(${this.fsp})`}`;
	}
	mapFromDriverValue(value) {
		if (typeof value === "string") return value;
		const shortened = value.toISOString().slice(0, -1).replace("T", " ");
		if (shortened.endsWith(".000")) return shortened.slice(0, -4);
		return shortened;
	}
	mapToDriverValue(value) {
		if (typeof value === "string") return value;
		return value.toISOString().slice(0, -1).replace("T", " ");
	}
};
function timestamp(a, b = {}) {
	const { name, config } = getColumnNameAndConfig(a, b);
	if (config?.mode === "string") return new MySqlTimestampStringBuilder(name, config);
	return new MySqlTimestampBuilder(name, config);
}

//#endregion
export { MySqlTimestamp, MySqlTimestampBuilder, MySqlTimestampString, MySqlTimestampStringBuilder, timestamp };
//# sourceMappingURL=timestamp.js.map