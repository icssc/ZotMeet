const require_rolldown_runtime = require('../_virtual/rolldown_runtime.cjs');
let __entity_ts = require("../entity.cjs");

//#region src/gel-core/sequence.ts
var GelSequence = class {
	static [__entity_ts.entityKind] = "GelSequence";
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
	return (0, __entity_ts.is)(obj, GelSequence);
}

//#endregion
exports.GelSequence = GelSequence;
exports.gelSequence = gelSequence;
exports.gelSequenceWithSchema = gelSequenceWithSchema;
exports.isGelSequence = isGelSequence;
//# sourceMappingURL=sequence.cjs.map