import { PgInsertBase, PgInsertHKTBase } from "../query-builders/insert.js";
import { PgAsyncPreparedQuery, PgAsyncSession } from "./session.js";
import { entityKind } from "../../entity.js";
import { Assume } from "../../utils.js";
import { ColumnsSelection } from "../../sql/sql.js";
import { QueryPromise } from "../../query-promise.js";
import { PgTable } from "../table.js";
import { RunnableQuery } from "../../runnable-query.js";
import { PgQueryResultHKT, PgQueryResultKind, PreparedQueryConfig } from "../session.js";

//#region src/pg-core/async/insert.d.ts
interface PgAsyncInsertHKT extends PgInsertHKTBase {
  _type: PgAsyncInsertBase<Assume<this['table'], PgTable>, Assume<this['queryResult'], PgQueryResultHKT>, this['selectedFields'], this['returning'], this['dynamic'], this['excludedMethods']>;
}
type AnyPgAsyncInsert = PgAsyncInsertBase<any, any, any, any, any, any>;
type PgInsertPrepare<T extends AnyPgAsyncInsert> = PgAsyncPreparedQuery<PreparedQueryConfig & {
  execute: T['_']['result'];
}>;
type PgAsyncInsert<TTable extends PgTable = PgTable, TQueryResult extends PgQueryResultHKT = PgQueryResultHKT, TSelectedFields extends ColumnsSelection | undefined = ColumnsSelection | undefined, TReturning extends Record<string, unknown> | undefined = Record<string, unknown> | undefined> = PgAsyncInsertBase<TTable, TQueryResult, TSelectedFields, TReturning, true, never>;
interface PgAsyncInsertBase<TTable extends PgTable, TQueryResult extends PgQueryResultHKT, TSelectedFields = undefined, TReturning = undefined, TDynamic extends boolean = false, TExcludedMethods extends string = never> extends QueryPromise<TReturning extends undefined ? PgQueryResultKind<TQueryResult, never> : TReturning[]> {}
declare class PgAsyncInsertBase<TTable extends PgTable, TQueryResult extends PgQueryResultHKT, TSelectedFields = undefined, TReturning = undefined, TDynamic extends boolean = false, TExcludedMethods extends string = never> extends PgInsertBase<PgAsyncInsertHKT, TTable, TQueryResult, TSelectedFields, TReturning, TDynamic, TExcludedMethods> implements RunnableQuery<TReturning extends undefined ? PgQueryResultKind<TQueryResult, never> : TReturning[], 'pg'> {
  static readonly [entityKind]: string;
  protected session: PgAsyncSession;
  prepare(name: string): PgInsertPrepare<this>;
  execute: ReturnType<this['prepare']>['execute'];
}
//#endregion
export { AnyPgAsyncInsert, PgAsyncInsert, PgAsyncInsertBase, PgAsyncInsertHKT, PgInsertPrepare };
//# sourceMappingURL=insert.d.ts.map