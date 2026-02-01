import { entityKind } from "../../entity.js";
import { SQL, sql } from "../../sql/sql.js";

//#region src/gel-core/query-builders/count.ts
var GelCountBuilder = class GelCountBuilder extends SQL {
	sql;
	static [entityKind] = "GelCountBuilder";
	[Symbol.toStringTag] = "GelCountBuilder";
	session;
	static buildEmbeddedCount(source, filters) {
		return sql`(select count(*) from ${source}${sql.raw(" where ").if(filters)}${filters})`;
	}
	static buildCount(source, filters) {
		return sql`select count(*) as count from ${source}${sql.raw(" where ").if(filters)}${filters};`;
	}
	constructor(params) {
		super(GelCountBuilder.buildEmbeddedCount(params.source, params.filters).queryChunks);
		this.params = params;
		this.mapWith(Number);
		this.session = params.session;
		this.sql = GelCountBuilder.buildCount(params.source, params.filters);
	}
	then(onfulfilled, onrejected) {
		return Promise.resolve(this.session.count(this.sql)).then(onfulfilled, onrejected);
	}
	catch(onRejected) {
		return this.then(void 0, onRejected);
	}
	finally(onFinally) {
		return this.then((value) => {
			onFinally?.();
			return value;
		}, (reason) => {
			onFinally?.();
			throw reason;
		});
	}
};

//#endregion
export { GelCountBuilder };
//# sourceMappingURL=count.js.map