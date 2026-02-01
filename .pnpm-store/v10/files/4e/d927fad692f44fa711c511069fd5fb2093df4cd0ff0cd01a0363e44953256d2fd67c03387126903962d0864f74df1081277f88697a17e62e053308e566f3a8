import { PgInsertBase, PgInsertHKTBase } from "../query-builders/insert.cjs";
import { PgEffectPreparedQuery, PgEffectSession } from "./session.cjs";
import { entityKind } from "../../entity.cjs";
import { ColumnsSelection } from "../../sql/sql.cjs";
import { Assume } from "../../utils.cjs";
import { RunnableQuery } from "../../runnable-query.cjs";
import { PgTable } from "../table.cjs";
import { PgQueryResultHKT, PgQueryResultKind, PreparedQueryConfig } from "../session.cjs";
import { QueryEffect } from "../../effect-core/query-effect.cjs";

//#region src/pg-core/effect/insert.d.ts
interface PgEffectInsertHKT extends PgInsertHKTBase {
  _type: PgEffectInsertBase<Assume<this['table'], PgTable>, Assume<this['queryResult'], PgQueryResultHKT>, this['selectedFields'], this['returning'], this['dynamic'], this['excludedMethods']>;
}
type AnyPgEffectInsert = PgEffectInsertBase<any, any, any, any, any, any>;
type PgInsertPrepare<T extends AnyPgEffectInsert> = PgEffectPreparedQuery<PreparedQueryConfig & {
  execute: T['_']['result'];
}>;
type PgInsert<TTable extends PgTable = PgTable, TQueryResult extends PgQueryResultHKT = PgQueryResultHKT, TSelectedFields extends ColumnsSelection | undefined = ColumnsSelection | undefined, TReturning extends Record<string, unknown> | undefined = Record<string, unknown> | undefined> = PgInsertBase<PgEffectInsertHKT, TTable, TQueryResult, TSelectedFields, TReturning, true, never>;
interface PgEffectInsertBase<TTable extends PgTable, TQueryResult extends PgQueryResultHKT, TSelectedFields = undefined, TReturning = undefined, TDynamic extends boolean = false, TExcludedMethods extends string = never> extends QueryEffect<TReturning extends undefined ? PgQueryResultKind<TQueryResult, never> : TReturning[]> {}
declare class PgEffectInsertBase<TTable extends PgTable, TQueryResult extends PgQueryResultHKT, TSelectedFields = undefined, TReturning = undefined, TDynamic extends boolean = false, TExcludedMethods extends string = never> extends PgInsertBase<PgEffectInsertHKT, TTable, TQueryResult, TSelectedFields, TReturning, TDynamic, TExcludedMethods> implements RunnableQuery<TReturning extends undefined ? PgQueryResultKind<TQueryResult, never> : TReturning[], 'pg'> {
  static readonly [entityKind]: string;
  protected session: PgEffectSession;
  prepare(name: string): PgInsertPrepare<this>;
  execute: ReturnType<this['prepare']>['execute'];
}
//#endregion
export { AnyPgEffectInsert, PgEffectInsertBase, PgEffectInsertHKT, PgInsert, PgInsertPrepare };
//# sourceMappingURL=insert.d.cts.map