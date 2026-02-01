import { PgSelectBase, PgSelectBuilder } from "../query-builders/select.cjs";
import { PgSelectHKTBase, SelectedFields } from "../query-builders/select.types.cjs";
import { PreparedQueryConfig } from "../session.cjs";
import { PgAsyncPreparedQuery, PgAsyncSession } from "./session.cjs";
import { entityKind } from "../../entity.cjs";
import { BuildSubquerySelection, JoinNullability, SelectMode, SelectResult } from "../../query-builders/select.types.cjs";
import { ColumnsSelection } from "../../sql/sql.cjs";
import { Assume } from "../../utils.cjs";
import { QueryPromise } from "../../query-promise.cjs";

//#region src/pg-core/async/select.d.ts
type PgAsyncSelectPrepare<T extends AnyPgAsyncSelect> = PgAsyncPreparedQuery<PreparedQueryConfig & {
  execute: T['_']['result'];
}>;
type PgAsyncSelectBuilder<TSelection extends SelectedFields | undefined> = PgSelectBuilder<TSelection, PgAsyncSelectHKT>;
type PgAsyncSelect<TTableName extends string | undefined = string | undefined, TSelection extends ColumnsSelection = Record<string, any>, TSelectMode extends SelectMode = SelectMode, TNullabilityMap extends Record<string, JoinNullability> = Record<string, JoinNullability>> = PgAsyncSelectBase<TTableName, TSelection, TSelectMode, TNullabilityMap, true, never>;
interface PgAsyncSelectHKT extends PgSelectHKTBase {
  _type: PgAsyncSelectBase<this['tableName'], Assume<this['selection'], ColumnsSelection>, this['selectMode'], Assume<this['nullabilityMap'], Record<string, JoinNullability>>, this['dynamic'], this['excludedMethods'], Assume<this['result'], any[]>, Assume<this['selectedFields'], ColumnsSelection>>;
}
interface PgAsyncSelectBase<TTableName extends string | undefined, TSelection extends ColumnsSelection | undefined, TSelectMode extends SelectMode, TNullabilityMap extends Record<string, JoinNullability> = (TTableName extends string ? Record<TTableName, 'not-null'> : {}), TDynamic extends boolean = false, TExcludedMethods extends string = never, TResult extends any[] = SelectResult<TSelection, TSelectMode, TNullabilityMap>[], TSelectedFields extends ColumnsSelection = BuildSubquerySelection<Assume<TSelection, ColumnsSelection>, TNullabilityMap>> extends QueryPromise<TResult> {}
declare class PgAsyncSelectBase<TTableName extends string | undefined, TSelection extends ColumnsSelection | undefined, TSelectMode extends SelectMode, TNullabilityMap extends Record<string, JoinNullability> = (TTableName extends string ? Record<TTableName, 'not-null'> : {}), TDynamic extends boolean = false, TExcludedMethods extends string = never, TResult extends any[] = SelectResult<TSelection, TSelectMode, TNullabilityMap>[], TSelectedFields extends ColumnsSelection = BuildSubquerySelection<Assume<TSelection, ColumnsSelection>, TNullabilityMap>> extends PgSelectBase<PgAsyncSelectHKT, TTableName, TSelection, TSelectMode, TNullabilityMap, TDynamic, TExcludedMethods, TResult, TSelectedFields> {
  static readonly [entityKind]: string;
  protected session: PgAsyncSession;
  /**
   * Create a prepared statement for this query. This allows
   * the database to remember this query for the given session
   * and call it by name, rather than specifying the full query.
   *
   * {@link https://www.postgresql.org/docs/current/sql-prepare.html | Postgres prepare documentation}
   */
  prepare(name: string): PgAsyncSelectPrepare<this>;
  execute(placeholderValues?: Record<string, unknown>): Promise<this["_"]["result"]>;
}
type AnyPgAsyncSelect = PgAsyncSelectBase<any, any, any, any, any, any, any, any>;
//#endregion
export { AnyPgAsyncSelect, PgAsyncSelect, PgAsyncSelectBase, PgAsyncSelectBuilder, PgAsyncSelectHKT, PgAsyncSelectPrepare };
//# sourceMappingURL=select.d.cts.map