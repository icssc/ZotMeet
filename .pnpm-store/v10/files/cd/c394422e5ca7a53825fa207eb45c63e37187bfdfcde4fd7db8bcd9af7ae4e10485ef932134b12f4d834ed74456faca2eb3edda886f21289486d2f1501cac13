import { PgViewBase } from "../view-base.js";
import { Join, PgUpdateBase, PgUpdateHKTBase } from "../query-builders/update.js";
import { PgAsyncPreparedQuery, PgAsyncSession } from "./session.js";
import { entityKind } from "../../entity.js";
import { Subquery } from "../../subquery.js";
import { Assume } from "../../utils.js";
import { ColumnsSelection, SQL } from "../../sql/sql.js";
import { QueryPromise } from "../../query-promise.js";
import { PgTable } from "../table.js";
import { JoinNullability } from "../../query-builders/select.types.js";
import { RunnableQuery } from "../../runnable-query.js";
import { PgQueryResultHKT, PgQueryResultKind, PreparedQueryConfig } from "../session.js";

//#region src/pg-core/async/update.d.ts
type PgAsyncUpdatePrepare<T extends AnyPgAsyncUpdate> = PgAsyncPreparedQuery<PreparedQueryConfig & {
  execute: T['_']['returning'] extends undefined ? PgQueryResultKind<T['_']['queryResult'], never> : T['_']['returning'][];
}>;
type PgAsyncUpdate<TTable extends PgTable = PgTable, TQueryResult extends PgQueryResultHKT = PgQueryResultHKT, TFrom extends PgTable | Subquery | PgViewBase | SQL | undefined = undefined, TSelectedFields extends ColumnsSelection | undefined = undefined, TReturning extends Record<string, unknown> | undefined = Record<string, unknown> | undefined, TNullabilityMap extends Record<string, JoinNullability> = Record<TTable['_']['name'], 'not-null'>, TJoins extends Join[] = []> = PgAsyncUpdateBase<TTable, TQueryResult, TFrom, TSelectedFields, TReturning, TNullabilityMap, TJoins, true, never>;
interface PgAsyncUpdateHKT extends PgUpdateHKTBase {
  _type: PgAsyncUpdateBase<Assume<this['table'], PgTable>, Assume<this['queryResult'], PgQueryResultHKT>, Assume<this['from'], PgTable | Subquery | PgViewBase | SQL | undefined>, Assume<this['selectedFields'], ColumnsSelection | undefined>, Assume<this['returning'], Record<string, unknown> | undefined>, Assume<this['nullabilityMap'], Record<string, JoinNullability>>, Assume<this['joins'], Join[]>, this['dynamic'], this['excludedMethods']>;
}
type AnyPgAsyncUpdate = PgAsyncUpdateBase<any, any, any, any, any, any, any, any, any>;
interface PgAsyncUpdateBase<TTable extends PgTable, TQueryResult extends PgQueryResultHKT, TFrom extends PgTable | Subquery | PgViewBase | SQL | undefined = undefined, TSelectedFields extends ColumnsSelection | undefined = undefined, TReturning extends Record<string, unknown> | undefined = undefined, TNullabilityMap extends Record<string, JoinNullability> = Record<TTable['_']['name'], 'not-null'>, TJoins extends Join[] = [], TDynamic extends boolean = false, TExcludedMethods extends string = never> extends QueryPromise<TReturning extends undefined ? PgQueryResultKind<TQueryResult, never> : TReturning[]> {}
declare class PgAsyncUpdateBase<TTable extends PgTable, TQueryResult extends PgQueryResultHKT, TFrom extends PgTable | Subquery | PgViewBase | SQL | undefined = undefined, TSelectedFields extends ColumnsSelection | undefined = undefined, TReturning extends Record<string, unknown> | undefined = undefined, TNullabilityMap extends Record<string, JoinNullability> = Record<TTable['_']['name'], 'not-null'>, TJoins extends Join[] = [], TDynamic extends boolean = false, TExcludedMethods extends string = never> extends PgUpdateBase<PgAsyncUpdateHKT, TTable, TQueryResult, TFrom, TSelectedFields, TReturning, TNullabilityMap, TJoins, TDynamic, TExcludedMethods> implements RunnableQuery<TReturning extends undefined ? PgQueryResultKind<TQueryResult, never> : TReturning[], 'pg'> {
  static readonly [entityKind]: string;
  protected session: PgAsyncSession;
  prepare(name: string): PgAsyncUpdatePrepare<this>;
  execute: ReturnType<this['prepare']>['execute'];
}
//#endregion
export { AnyPgAsyncUpdate, PgAsyncUpdate, PgAsyncUpdateBase, PgAsyncUpdateHKT, PgAsyncUpdatePrepare };
//# sourceMappingURL=update.d.ts.map