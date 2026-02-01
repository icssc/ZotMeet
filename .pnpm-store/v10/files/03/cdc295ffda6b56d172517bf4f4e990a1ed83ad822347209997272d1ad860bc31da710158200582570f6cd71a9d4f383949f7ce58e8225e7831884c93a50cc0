import { GelColumnBuilder } from "./common.js";
import { entityKind } from "../../entity.js";

//#region src/gel-core/columns/int.common.ts
var GelIntColumnBaseBuilder = class extends GelColumnBuilder {
	static [entityKind] = "GelIntColumnBaseBuilder";
	generatedAlwaysAsIdentity(sequence) {
		if (sequence) {
			const { name, ...options } = sequence;
			this.config.generatedIdentity = {
				type: "always",
				sequenceName: name,
				sequenceOptions: options
			};
		} else this.config.generatedIdentity = { type: "always" };
		this.config.hasDefault = true;
		this.config.notNull = true;
		return this;
	}
	generatedByDefaultAsIdentity(sequence) {
		if (sequence) {
			const { name, ...options } = sequence;
			this.config.generatedIdentity = {
				type: "byDefault",
				sequenceName: name,
				sequenceOptions: options
			};
		} else this.config.generatedIdentity = { type: "byDefault" };
		this.config.hasDefault = true;
		this.config.notNull = true;
		return this;
	}
};

//#endregion
export { GelIntColumnBaseBuilder };
//# sourceMappingURL=int.common.js.map