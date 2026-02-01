import { entityKind } from "../../entity.js";
import { SQL, sql } from "../../sql/sql.js";

//#region src/cockroach-core/query-builders/count.ts
var CockroachCountBuilder = class CockroachCountBuilder extends SQL {
	sql;
	token;
	static [entityKind] = "CockroachCountBuilder";
	[Symbol.toStringTag] = "CockroachCountBuilder";
	session;
	static buildEmbeddedCount(source, filters) {
		return sql`(select count(*) from ${source}${sql.raw(" where ").if(filters)}${filters})`;
	}
	static buildCount(source, filters) {
		return sql`select count(*) as count from ${source}${sql.raw(" where ").if(filters)}${filters};`;
	}
	constructor(params) {
		super(CockroachCountBuilder.buildEmbeddedCount(params.source, params.filters).queryChunks);
		this.params = params;
		this.mapWith(Number);
		this.session = params.session;
		this.sql = CockroachCountBuilder.buildCount(params.source, params.filters);
	}
	/** @intrnal */
	setToken(token) {
		this.token = token;
		return this;
	}
	then(onfulfilled, onrejected) {
		return Promise.resolve(this.session.count(this.sql, this.token)).then(onfulfilled, onrejected);
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
export { CockroachCountBuilder };
//# sourceMappingURL=count.js.map