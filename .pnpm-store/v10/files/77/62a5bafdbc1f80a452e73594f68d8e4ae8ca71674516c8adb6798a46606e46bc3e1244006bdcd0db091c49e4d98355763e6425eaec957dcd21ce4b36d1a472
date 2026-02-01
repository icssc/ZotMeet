import { PgDeleteBase, PgDeleteHKTBase } from "../query-builders/delete.js";
import { PgAsyncPreparedQuery, PgAsyncSession } from "./session.js";
import { entityKind } from "../../entity.js";
import { Assume } from "../../utils.js";
import { ColumnsSelection, SQLWrapper } from "../../sql/sql.js";
import { QueryPromise } from "../../query-promise.js";
import { TypedQueryBuilder } from "../../query-builders/query-builder.js";
import { PgTable } from "../table.js";
import { RunnableQuery } from "../../runnable-query.js";
import { PgQueryResultHKT, PgQueryResultKind, PreparedQueryConfig } from "../session.js";

//#region src/pg-core/async/delete.d.ts
type PgAsyncDelete<TTable extends PgTable = PgTable, TQueryResult extends PgQueryResultHKT = PgQueryResultHKT, TSelectedFields extends ColumnsSelection | undefined = undefined, TReturning extends Record<string, unknown> | undefined = Record<string, unknown> | undefined> = PgAsyncDeleteBase<TTable, TQueryResult, TSelectedFields, TReturning, true, never>;
type PgAsyncDeletePrepare<T extends AnyAsyncPgDelete> = PgAsyncPreparedQuery<PreparedQueryConfig & {
  execute: T['_']['returning'] extends undefined ? PgQueryResultKind<T['_']['queryResult'], never> : T['_']['returning'][];
}>;
type AnyAsyncPgDelete = PgAsyncDeleteBase<any, any, any, any, any, any>;
interface PgAsyncDeleteHKT extends PgDeleteHKTBase {
  _type: PgAsyncDeleteBase<Assume<this['table'], PgTable>, Assume<this['queryResult'], PgQueryResultHKT>, Assume<this['selectedFields'], ColumnsSelection | undefined>, Assume<this['returning'], Record<string, unknown> | undefined>, this['dynamic'], this['excludedMethods']>;
}
interface PgAsyncDeleteBase<TTable extends PgTable, TQueryResult extends PgQueryResultHKT, TSelectedFields extends ColumnsSelection | undefined = undefined, TReturning extends Record<string, unknown> | undefined = undefined, TDynamic extends boolean = false, TExcludedMethods extends string = never> extends QueryPromise<TReturning extends undefined ? PgQueryResultKind<TQueryResult, never> : TReturning[]> {}
declare class PgAsyncDeleteBase<TTable extends PgTable, TQueryResult extends PgQueryResultHKT, TSelectedFields extends ColumnsSelection | undefined = undefined, TReturning extends Record<string, unknown> | undefined = undefined, TDynamic extends boolean = false, TExcludedMethods extends string = never> extends PgDeleteBase<PgAsyncDeleteHKT, TTable, TQueryResult, TSelectedFields, TReturning, TDynamic, TExcludedMethods> implements TypedQueryBuilder<TSelectedFields, TReturning extends undefined ? PgQueryResultKind<TQueryResult, never> : TReturning[]>, RunnableQuery<TReturning extends undefined ? PgQueryResultKind<TQueryResult, never> : TReturning[], 'pg'>, SQLWrapper {
  static readonly [entityKind]: string;
  protected session: PgAsyncSession;
  prepare(name: string): PgAsyncDeletePrepare<this>;
  execute: ReturnType<this['prepare']>['execute'];
}
//#endregion
export { AnyAsyncPgDelete, PgAsyncDelete, PgAsyncDeleteBase, PgAsyncDeleteHKT, PgAsyncDeletePrepare };
//# sourceMappingURL=delete.d.ts.map