import { entityKind, is } from "../entity.js";

//#region src/gel-core/sequence.ts
var GelSequence = class {
	static [entityKind] = "GelSequence";
	constructor(seqName, seqOptions, schema) {
		this.seqName = seqName;
		this.seqOptions = seqOptions;
		this.schema = schema;
	}
};
function gelSequence(name, options) {
	return gelSequenceWithSchema(name, options, void 0);
}
/** @internal */
function gelSequenceWithSchema(name, options, schema) {
	return new GelSequence(name, options, schema);
}
function isGelSequence(obj) {
	return is(obj, GelSequence);
}

//#endregion
export { GelSequence, gelSequence, gelSequenceWithSchema, isGelSequence };
//# sourceMappingURL=sequence.js.map