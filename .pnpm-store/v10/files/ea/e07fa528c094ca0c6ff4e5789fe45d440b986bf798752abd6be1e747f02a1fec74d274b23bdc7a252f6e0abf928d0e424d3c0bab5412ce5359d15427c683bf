import { PgSelectBase, PgSelectBuilder } from "../query-builders/select.js";
import { PgSelectHKTBase, SelectedFields } from "../query-builders/select.types.js";
import { PreparedQueryConfig } from "../session.js";
import { PgEffectPreparedQuery, PgEffectSession } from "./session.js";
import { entityKind } from "../../entity.js";
import { Assume } from "../../utils.js";
import { ColumnsSelection } from "../../sql/sql.js";
import { QueryEffect } from "../../effect-core/query-effect.js";
import { BuildSubquerySelection, JoinNullability, SelectMode, SelectResult } from "../../query-builders/select.types.js";

//#region src/pg-core/effect/select.d.ts
type PgEffectSelectPrepare<T extends AnyPgEffectSelect> = PgEffectPreparedQuery<PreparedQueryConfig & {
  execute: T['_']['result'];
}>;
type PgEffectSelectBuilder<TSelection extends SelectedFields | undefined> = PgSelectBuilder<TSelection, PgEffectSelectHKT>;
type PgEffectSelect<TTableName extends string | undefined = string | undefined, TSelection extends ColumnsSelection = Record<string, any>, TSelectMode extends SelectMode = SelectMode, TNullabilityMap extends Record<string, JoinNullability> = Record<string, JoinNullability>> = PgEffectSelectBase<TTableName, TSelection, TSelectMode, TNullabilityMap, true, never>;
interface PgEffectSelectHKT extends PgSelectHKTBase {
  _type: PgEffectSelectBase<this['tableName'], Assume<this['selection'], ColumnsSelection>, this['selectMode'], Assume<this['nullabilityMap'], Record<string, JoinNullability>>, this['dynamic'], this['excludedMethods'], Assume<this['result'], any[]>, Assume<this['selectedFields'], ColumnsSelection>>;
}
interface PgEffectSelectBase<TTableName extends string | undefined, TSelection extends ColumnsSelection | undefined, TSelectMode extends SelectMode, TNullabilityMap extends Record<string, JoinNullability> = (TTableName extends string ? Record<TTableName, 'not-null'> : {}), TDynamic extends boolean = false, TExcludedMethods extends string = never, TResult extends any[] = SelectResult<TSelection, TSelectMode, TNullabilityMap>[], TSelectedFields extends ColumnsSelection = BuildSubquerySelection<Assume<TSelection, ColumnsSelection>, TNullabilityMap>> extends QueryEffect<TResult> {}
declare class PgEffectSelectBase<TTableName extends string | undefined, TSelection extends ColumnsSelection | undefined, TSelectMode extends SelectMode, TNullabilityMap extends Record<string, JoinNullability> = (TTableName extends string ? Record<TTableName, 'not-null'> : {}), TDynamic extends boolean = false, TExcludedMethods extends string = never, TResult extends any[] = SelectResult<TSelection, TSelectMode, TNullabilityMap>[], TSelectedFields extends ColumnsSelection = BuildSubquerySelection<Assume<TSelection, ColumnsSelection>, TNullabilityMap>> extends PgSelectBase<PgEffectSelectHKT, TTableName, TSelection, TSelectMode, TNullabilityMap, TDynamic, TExcludedMethods, TResult, TSelectedFields> {
  static readonly [entityKind]: string;
  protected session: PgEffectSession;
  /**
   * Create a prepared statement for this query. This allows
   * the database to remember this query for the given session
   * and call it by name, rather than specifying the full query.
   *
   * {@link https://www.postgresql.org/docs/current/sql-prepare.html | Postgres prepare documentation}
   */
  prepare(name: string): PgEffectSelectPrepare<this>;
  execute: ReturnType<this['prepare']>['execute'];
}
type AnyPgEffectSelect = PgEffectSelectBase<any, any, any, any, any, any, any, any>;
//#endregion
export { AnyPgEffectSelect, PgEffectSelect, PgEffectSelectBase, PgEffectSelectBuilder, PgEffectSelectHKT, PgEffectSelectPrepare };
//# sourceMappingURL=select.d.ts.map