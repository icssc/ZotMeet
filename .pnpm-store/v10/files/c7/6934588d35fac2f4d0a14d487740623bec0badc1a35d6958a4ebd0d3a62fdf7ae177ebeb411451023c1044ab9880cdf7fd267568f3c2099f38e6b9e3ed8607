import { PgDeleteBase, PgDeleteHKTBase } from "../query-builders/delete.js";
import { PgEffectPreparedQuery, PgEffectSession } from "./session.js";
import { entityKind } from "../../entity.js";
import { Assume } from "../../utils.js";
import { ColumnsSelection, SQLWrapper } from "../../sql/sql.js";
import { TypedQueryBuilder } from "../../query-builders/query-builder.js";
import { PgTable } from "../table.js";
import { QueryEffect } from "../../effect-core/query-effect.js";
import { RunnableQuery } from "../../runnable-query.js";
import { PgQueryResultHKT, PgQueryResultKind, PreparedQueryConfig } from "../session.js";

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
//# sourceMappingURL=delete.d.ts.map