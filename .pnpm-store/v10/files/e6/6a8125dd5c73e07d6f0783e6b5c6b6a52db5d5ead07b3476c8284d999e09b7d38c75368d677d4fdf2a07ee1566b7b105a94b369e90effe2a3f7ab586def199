import { entityKind } from "../entity.js";

//#region src/gel-core/roles.ts
var GelRole = class {
	static [entityKind] = "GelRole";
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
export { GelRole, gelRole };
//# sourceMappingURL=roles.js.map