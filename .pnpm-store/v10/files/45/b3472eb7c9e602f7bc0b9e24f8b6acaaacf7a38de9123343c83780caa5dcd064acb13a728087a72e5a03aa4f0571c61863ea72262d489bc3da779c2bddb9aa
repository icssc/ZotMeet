import { extractUsedTable } from "../utils.js";
import { PgUpdateBase } from "../query-builders/update.js";
import { entityKind } from "../../entity.js";
import { applyMixins } from "../../utils.js";
import { QueryPromise } from "../../query-promise.js";

//#region src/pg-core/async/update.ts
var PgAsyncUpdateBase = class extends PgUpdateBase {
	static [entityKind] = "PgAsyncUpdate";
	/** @internal */
	_prepare(name) {
		const query = this.session.prepareQuery(this.dialect.sqlToQuery(this.getSQL()), this.config.returning, name, true, void 0, {
			type: "insert",
			tables: extractUsedTable(this.config.table)
		}, this.cacheConfig);
		query.joinsNotNullableMap = this.joinsNotNullableMap;
		return query;
	}
	prepare(name) {
		return this._prepare(name);
	}
	execute = (placeholderValues = {}) => {
		return this._prepare().execute(placeholderValues);
	};
};
applyMixins(PgAsyncUpdateBase, [QueryPromise]);

//#endregion
export { PgAsyncUpdateBase };
//# sourceMappingURL=update.js.map