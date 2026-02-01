const require_rolldown_runtime = require('../_virtual/rolldown_runtime.cjs');
let __entity_ts = require("../entity.cjs");

//#region src/gel-core/roles.ts
var GelRole = class {
	static [__entity_ts.entityKind] = "GelRole";
	/** @internal */
	_existing;
	/** @internal */
	createDb;
	/** @internal */
	createRole;
	/** @internal */
	inherit;
	constructor(name, config) {
		this.name = name;
		if (config) {
			this.createDb = config.createDb;
			this.createRole = config.createRole;
			this.inherit = config.inherit;
		}
	}
	existing() {
		this._existing = true;
		return this;
	}
};
function gelRole(name, config) {
	return new GelRole(name, config);
}

//#endregion
exports.GelRole = GelRole;
exports.gelRole = gelRole;
//# sourceMappingURL=roles.cjs.map