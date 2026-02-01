const require_rolldown_runtime = require('../_virtual/rolldown_runtime.cjs');
let __entity_ts = require("../entity.cjs");

//#region src/cockroach-core/roles.ts
var CockroachRole = class {
	static [__entity_ts.entityKind] = "CockroachRole";
	/** @internal */
	_existing;
	/** @internal */
	createDb;
	/** @internal */
	createRole;
	constructor(name, config) {
		this.name = name;
		if (config) {
			this.createDb = config.createDb;
			this.createRole = config.createRole;
		}
	}
	existing() {
		this._existing = true;
		return this;
	}
};
function cockroachRole(name, config) {
	return new CockroachRole(name, config);
}

//#endregion
exports.CockroachRole = CockroachRole;
exports.cockroachRole = cockroachRole;
//# sourceMappingURL=roles.cjs.map