const require_rolldown_runtime = require('../_virtual/rolldown_runtime.cjs');
let __entity_ts = require("../entity.cjs");

//#region src/cockroach-core/checks.ts
var CheckBuilder = class {
	static [__entity_ts.entityKind] = "CockroachCheckBuilder";
	brand;
	constructor(name, value) {
		this.name = name;
		this.value = value;
	}
	/** @internal */
	build(table) {
		return new Check(table, this);
	}
};
var Check = class {
	static [__entity_ts.entityKind] = "CockroachCheck";
	name;
	value;
	constructor(table, builder) {
		this.table = table;
		this.name = builder.name;
		this.value = builder.value;
	}
};
function check(name, value) {
	return new CheckBuilder(name, value);
}

//#endregion
exports.Check = Check;
exports.CheckBuilder = CheckBuilder;
exports.check = check;
//# sourceMappingURL=checks.cjs.map