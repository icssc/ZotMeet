import { PgDeleteBase, PgDeleteHKTBase } from "../query-builders/delete.cjs";
import { PgEffectPreparedQuery, PgEffectSession } from "./session.cjs";
import { entityKind } from "../../entity.cjs";
import { TypedQueryBuilder } from "../../query-builders/query-builder.cjs";
import { ColumnsSelection, SQLWrapper } from "../../sql/sql.cjs";
import { Assume } from "../../utils.cjs";
import { RunnableQuery } from "../../runnable-query.cjs";
import { PgTable } from "../table.cjs";
import { PgQueryResultHKT, PgQueryResultKind, PreparedQueryConfig } from "../session.cjs";
import { QueryEffect } from "../../effect-core/query-effect.cjs";

//#region src/pg-core/effect/delete.d.ts
type PgEffectDelete<TTable extends PgTable = PgTable, TQueryResult extends PgQueryResultHKT = PgQueryResultHKT, TSelectedFields extends ColumnsSelection | undefined = undefined, TReturning extends Record<string, unknown> | undefined = Record<string, unknown> | undefined> = PgEffectDeleteBase<TTable, TQueryResult, TSelectedFields, TReturning, true, never>;
type PgEffectDeletePrepare<T extends AnyEffectPgDelete> = PgEffectPreparedQuery<PreparedQueryConfig & {
  execute: T['_']['returning'] extends undefined ? PgQueryResultKind<T['_']['queryResult'], never> : T['_']['returning'][];
}>;
type AnyEffectPgDelete = PgEffectDeleteBase<any, any, any, any, any, any>;
interface PgEffectDeleteHKT extends PgDeleteHKTBase {
  _type: PgEffectDeleteBase<Assume<this['table'], PgTable>, Assume<this['queryResult'], PgQueryResultHKT>, Assume<this['selectedFields'], ColumnsSelection | undefined>, Assume<this['returning'], Record<string, unknown> | undefined>, this['dynamic'], this['excludedMethods']>;
}
interface PgEffectDeleteBase<TTable extends PgTable, TQueryResult extends PgQueryResultHKT, TSelectedFields extends ColumnsSelection | undefined = undefined, TReturning extends Record<string, unknown> | undefined = undefined, TDynamic extends boolean = false, TExcludedMethods extends string = never> extends QueryEffect<TReturning extends undefined ? PgQueryResultKind<TQueryResult, never> : TReturning[]> {}
declare class PgEffectDeleteBase<TTable extends PgTable, TQueryResult extends PgQueryResultHKT, TSelectedFields extends ColumnsSelection | undefined = undefined, TReturning extends Record<string, unknown> | undefined = undefined, TDynamic extends boolean = false, TExcludedMethods extends string = never> extends PgDeleteBase<PgEffectDeleteHKT, TTable, TQueryResult, TSelectedFields, TReturning, TDynamic, TExcludedMethods> implements TypedQueryBuilder<TSelectedFields, TReturning extends undefined ? PgQueryResultKind<TQueryResult, never> : TReturning[]>, RunnableQuery<TReturning extends undefined ? PgQueryResultKind<TQueryResult, never> : TReturning[], 'pg'>, SQLWrapper {
  static readonly [entityKind]: string;
  protected session: PgEffectSession;
  prepare(name: string): PgEffectDeletePrepare<this>;
  execute: ReturnType<this['prepare']>['execute'];
}
//#endregion
export { AnyEffectPgDelete, PgEffectDelete, PgEffectDeleteBase, PgEffectDeleteHKT, PgEffectDeletePrepare };
//# sourceMappingURL=delete.d.cts.map