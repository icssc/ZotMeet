import { SQLiteViewBase } from "../view-base.js";
import { SQLiteSelectBase, SQLiteSelectQueryBuilderBase } from "./select.js";
import { SQLiteViewWithSelection } from "../view.js";
import { SQLitePreparedQuery } from "../session.js";
import { Subquery } from "../../subquery.js";
import { Table, UpdateTableConfig } from "../../table.js";
import { Assume, ValidateShape } from "../../utils.js";
import { ColumnsSelection, Placeholder, SQL, View } from "../../sql/sql.js";
import { TypedQueryBuilder } from "../../query-builders/query-builder.js";
import { SQLiteColumn } from "../columns/index.js";
import { SQLiteTable, SQLiteTableWithColumns } from "../table.js";
import { SelectedFields as SelectedFields$1, SelectedFieldsFlat as SelectedFieldsFlat$1, SelectedFieldsOrdered as SelectedFieldsOrdered$1 } from "../../operations.js";
import { AppendToNullabilityMap, AppendToResult, BuildSubquerySelection, GetSelectTableName, JoinNullability, JoinType, MapColumnsToTableAlias, SelectMode, SelectResult, SetOperator } from "../../query-builders/select.types.js";

//#region src/sqlite-core/query-builders/select.types.d.ts
interface SQLiteSelectJoinConfig {
  on: SQL | undefined;
  table: SQLiteTable | Subquery | SQLiteViewBase | SQL;
  alias: string | undefined;
  joinType: JoinType;
}
type BuildAliasTable<TTable extends SQLiteTable | View, TAlias extends string> = TTable extends Table ? SQLiteTableWithColumns<UpdateTableConfig<TTable['_'], {
  name: TAlias;
  columns: MapColumnsToTableAlias<TTable['_']['columns'], TAlias, 'sqlite'>;
}>> : TTable extends View ? SQLiteViewWithSelection<TAlias, TTable['_']['existing'], MapColumnsToTableAlias<TTable['_']['selectedFields'], TAlias, 'sqlite'>> : never;
interface SQLiteSelectConfig {
  withList?: Subquery[];
  fields: Record<string, unknown>;
  fieldsFlat?: SelectedFieldsOrdered;
  where?: SQL;
  having?: SQL;
  table: SQLiteTable | Subquery | SQLiteViewBase | SQL;
  limit?: number | Placeholder;
  offset?: number | Placeholder;
  joins?: SQLiteSelectJoinConfig[];
  orderBy?: (SQLiteColumn | SQL | SQL.Aliased)[];
  groupBy?: (SQLiteColumn | SQL | SQL.Aliased)[];
  distinct?: boolean;
  setOperators: {
    rightSelect: TypedQueryBuilder<any, any>;
    type: SetOperator;
    isAll: boolean;
    orderBy?: (SQLiteColumn | SQL | SQL.Aliased)[];
    limit?: number | Placeholder;
    offset?: number | Placeholder;
  }[];
}
type SQLiteSelectJoin<T extends AnySQLiteSelectQueryBuilder, TDynamic extends boolean, TJoinType extends JoinType, TJoinedTable extends SQLiteTable | Subquery | SQLiteViewBase | SQL, TJoinedName extends GetSelectTableName<TJoinedTable> = GetSelectTableName<TJoinedTable>> = T extends any ? SQLiteSelectWithout<SQLiteSelectKind<T['_']['hkt'], T['_']['tableName'], T['_']['resultType'], T['_']['runResult'], AppendToResult<T['_']['tableName'], T['_']['selection'], TJoinedName, TJoinedTable extends SQLiteTable ? TJoinedTable['_']['columns'] : TJoinedTable extends Subquery | View ? Assume<TJoinedTable['_']['selectedFields'], SelectedFields> : never, T['_']['selectMode']>, T['_']['selectMode'] extends 'partial' ? T['_']['selectMode'] : 'multiple', AppendToNullabilityMap<T['_']['nullabilityMap'], TJoinedName, TJoinType>, T['_']['dynamic'], T['_']['excludedMethods']>, TDynamic, T['_']['excludedMethods']> : never;
type SQLiteSelectJoinFn<T extends AnySQLiteSelectQueryBuilder, TDynamic extends boolean, TJoinType extends JoinType> = <TJoinedTable extends SQLiteTable | Subquery | SQLiteViewBase | SQL, TJoinedName extends GetSelectTableName<TJoinedTable> = GetSelectTableName<TJoinedTable>>(table: TJoinedTable, on: ((aliases: T['_']['selection']) => SQL | undefined) | SQL | undefined) => SQLiteSelectJoin<T, TDynamic, TJoinType, TJoinedTable, TJoinedName>;
type SQLiteSelectCrossJoinFn<T extends AnySQLiteSelectQueryBuilder, TDynamic extends boolean> = <TJoinedTable extends SQLiteTable | Subquery | SQLiteViewBase | SQL, TJoinedName extends GetSelectTableName<TJoinedTable> = GetSelectTableName<TJoinedTable>>(table: TJoinedTable) => SQLiteSelectJoin<T, TDynamic, 'cross', TJoinedTable, TJoinedName>;
type SelectedFieldsFlat = SelectedFieldsFlat$1<SQLiteColumn>;
type SelectedFields = SelectedFields$1<SQLiteColumn, SQLiteTable>;
type SelectedFieldsOrdered = SelectedFieldsOrdered$1<SQLiteColumn>;
interface SQLiteSelectHKTBase {
  tableName: string | undefined;
  resultType: 'sync' | 'async';
  runResult: unknown;
  selection: unknown;
  selectMode: SelectMode;
  nullabilityMap: unknown;
  dynamic: boolean;
  excludedMethods: string;
  result: unknown;
  selectedFields: unknown;
  _type: unknown;
}
type SQLiteSelectKind<T extends SQLiteSelectHKTBase, TTableName extends string | undefined, TResultType extends 'sync' | 'async', TRunResult, TSelection extends ColumnsSelection, TSelectMode extends SelectMode, TNullabilityMap extends Record<string, JoinNullability>, TDynamic extends boolean, TExcludedMethods extends string, TResult = SelectResult<TSelection, TSelectMode, TNullabilityMap>[], TSelectedFields = BuildSubquerySelection<TSelection, TNullabilityMap>> = (T & {
  tableName: TTableName;
  resultType: TResultType;
  runResult: TRunResult;
  selection: TSelection;
  selectMode: TSelectMode;
  nullabilityMap: TNullabilityMap;
  dynamic: TDynamic;
  excludedMethods: TExcludedMethods;
  result: TResult;
  selectedFields: TSelectedFields;
})['_type'];
interface SQLiteSelectQueryBuilderHKT extends SQLiteSelectHKTBase {
  _type: SQLiteSelectQueryBuilderBase<SQLiteSelectQueryBuilderHKT, this['tableName'], this['resultType'], this['runResult'], Assume<this['selection'], ColumnsSelection>, this['selectMode'], Assume<this['nullabilityMap'], Record<string, JoinNullability>>, this['dynamic'], this['excludedMethods'], Assume<this['result'], any[]>, Assume<this['selectedFields'], ColumnsSelection>>;
}
interface SQLiteSelectHKT extends SQLiteSelectHKTBase {
  _type: SQLiteSelectBase<this['tableName'], this['resultType'], this['runResult'], Assume<this['selection'], ColumnsSelection>, this['selectMode'], Assume<this['nullabilityMap'], Record<string, JoinNullability>>, this['dynamic'], this['excludedMethods'], Assume<this['result'], any[]>, Assume<this['selectedFields'], ColumnsSelection>>;
}
type SQLiteSetOperatorExcludedMethods = 'config' | 'leftJoin' | 'rightJoin' | 'innerJoin' | 'fullJoin' | 'where' | 'having' | 'groupBy';
type CreateSQLiteSelectFromBuilderMode<TBuilderMode extends 'db' | 'qb', TTableName extends string | undefined, TResultType extends 'sync' | 'async', TRunResult, TSelection extends ColumnsSelection, TSelectMode extends SelectMode> = TBuilderMode extends 'db' ? SQLiteSelectBase<TTableName, TResultType, TRunResult, TSelection, TSelectMode> : SQLiteSelectQueryBuilderBase<SQLiteSelectQueryBuilderHKT, TTableName, TResultType, TRunResult, TSelection, TSelectMode>;
type SQLiteSelectWithout<T extends AnySQLiteSelectQueryBuilder, TDynamic extends boolean, K extends keyof T & string, TResetExcluded extends boolean = false> = TDynamic extends true ? T : Omit<SQLiteSelectKind<T['_']['hkt'], T['_']['tableName'], T['_']['resultType'], T['_']['runResult'], T['_']['selection'], T['_']['selectMode'], T['_']['nullabilityMap'], TDynamic, TResetExcluded extends true ? K : T['_']['excludedMethods'] | K, T['_']['result'], T['_']['selectedFields']>, TResetExcluded extends true ? K : T['_']['excludedMethods'] | K>;
type SQLiteSelectExecute<T extends AnySQLiteSelect> = T['_']['result'];
type SQLiteSelectPrepare<T extends AnySQLiteSelect> = SQLitePreparedQuery<{
  type: T['_']['resultType'];
  run: T['_']['runResult'];
  all: T['_']['result'];
  get: T['_']['result'][number] | undefined;
  values: any[][];
  execute: SQLiteSelectExecute<T>;
}>;
type SQLiteSelectDynamic<T extends AnySQLiteSelectQueryBuilder> = SQLiteSelectKind<T['_']['hkt'], T['_']['tableName'], T['_']['resultType'], T['_']['runResult'], T['_']['selection'], T['_']['selectMode'], T['_']['nullabilityMap'], true, never, T['_']['result'], T['_']['selectedFields']>;
type SQLiteSelectQueryBuilder<THKT extends SQLiteSelectHKTBase = SQLiteSelectQueryBuilderHKT, TTableName extends string | undefined = string | undefined, TResultType extends 'sync' | 'async' = 'sync' | 'async', TRunResult = unknown, TSelection extends ColumnsSelection = ColumnsSelection, TSelectMode extends SelectMode = SelectMode, TNullabilityMap extends Record<string, JoinNullability> = Record<string, JoinNullability>, TResult extends any[] = unknown[], TSelectedFields extends ColumnsSelection = ColumnsSelection> = SQLiteSelectQueryBuilderBase<THKT, TTableName, TResultType, TRunResult, TSelection, TSelectMode, TNullabilityMap, true, never, TResult, TSelectedFields>;
type AnySQLiteSelectQueryBuilder = SQLiteSelectQueryBuilderBase<any, any, any, any, any, any, any, any, any, any, any>;
type AnySQLiteSetOperatorInterface = SQLiteSetOperatorInterface<any, any, any, any, any, any, any, any, any>;
interface SQLiteSetOperatorInterface<TTableName extends string | undefined, TResultType extends 'sync' | 'async', TRunResult, TSelection extends ColumnsSelection, TSelectMode extends SelectMode = 'single', TNullabilityMap extends Record<string, JoinNullability> = (TTableName extends string ? Record<TTableName, 'not-null'> : {}), TDynamic extends boolean = false, TExcludedMethods extends string = never, TResult extends any[] = SelectResult<TSelection, TSelectMode, TNullabilityMap>[], TSelectedFields extends ColumnsSelection = BuildSubquerySelection<TSelection, TNullabilityMap>> {
  _: {
    readonly hkt: SQLiteSelectHKTBase;
    readonly tableName: TTableName;
    readonly resultType: TResultType;
    readonly runResult: TRunResult;
    readonly selection: TSelection;
    readonly selectMode: TSelectMode;
    readonly nullabilityMap: TNullabilityMap;
    readonly dynamic: TDynamic;
    readonly excludedMethods: TExcludedMethods;
    readonly result: TResult;
    readonly selectedFields: TSelectedFields;
  };
}
type SQLiteSetOperatorWithResult<TResult extends any[]> = SQLiteSetOperatorInterface<any, any, any, any, any, any, any, any, TResult, any>;
type SQLiteSelect<TTableName extends string | undefined = string | undefined, TResultType extends 'sync' | 'async' = 'sync' | 'async', TRunResult = unknown, TSelection extends ColumnsSelection = Record<string, any>, TSelectMode extends SelectMode = SelectMode, TNullabilityMap extends Record<string, JoinNullability> = Record<string, JoinNullability>> = SQLiteSelectBase<TTableName, TResultType, TRunResult, TSelection, TSelectMode, TNullabilityMap, true, never>;
type AnySQLiteSelect = SQLiteSelectBase<any, any, any, any, any, any, any, any, any, any>;
type SQLiteSetOperator<TTableName extends string | undefined = string | undefined, TResultType extends 'sync' | 'async' = 'sync' | 'async', TRunResult = unknown, TSelection extends ColumnsSelection = Record<string, any>, TSelectMode extends SelectMode = SelectMode, TNullabilityMap extends Record<string, JoinNullability> = Record<string, JoinNullability>> = SQLiteSelectBase<TTableName, TResultType, TRunResult, TSelection, TSelectMode, TNullabilityMap, true, SQLiteSetOperatorExcludedMethods>;
type SetOperatorRightSelect<TValue extends SQLiteSetOperatorWithResult<TResult>, TResult extends any[]> = TValue extends SQLiteSetOperatorInterface<any, any, any, any, any, any, any, any, infer TValueResult, any> ? ValidateShape<TValueResult[number], TResult[number], TypedQueryBuilder<any, TValueResult>> : TValue;
type SetOperatorRestSelect<TValue extends readonly SQLiteSetOperatorWithResult<TResult>[], TResult extends any[]> = TValue extends [infer First, ...infer Rest] ? First extends SQLiteSetOperatorInterface<any, any, any, any, any, any, any, any, infer TValueResult, any> ? Rest extends AnySQLiteSetOperatorInterface[] ? [ValidateShape<TValueResult[number], TResult[number], TypedQueryBuilder<any, TValueResult>>, ...SetOperatorRestSelect<Rest, TResult>] : ValidateShape<TValueResult[number], TResult[number], TypedQueryBuilder<any, TValueResult>[]> : never : TValue;
type SQLiteCreateSetOperatorFn = <TTableName extends string | undefined, TResultType extends 'sync' | 'async', TRunResult, TSelection extends ColumnsSelection, TValue extends SQLiteSetOperatorWithResult<TResult>, TRest extends SQLiteSetOperatorWithResult<TResult>[], TSelectMode extends SelectMode = 'single', TNullabilityMap extends Record<string, JoinNullability> = (TTableName extends string ? Record<TTableName, 'not-null'> : {}), TDynamic extends boolean = false, TExcludedMethods extends string = never, TResult extends any[] = SelectResult<TSelection, TSelectMode, TNullabilityMap>[], TSelectedFields extends ColumnsSelection = BuildSubquerySelection<TSelection, TNullabilityMap>>(leftSelect: SQLiteSetOperatorInterface<TTableName, TResultType, TRunResult, TSelection, TSelectMode, TNullabilityMap, TDynamic, TExcludedMethods, TResult, TSelectedFields>, rightSelect: SetOperatorRightSelect<TValue, TResult>, ...restSelects: SetOperatorRestSelect<TRest, TResult>) => SQLiteSelectWithout<SQLiteSelectBase<TTableName, TResultType, TRunResult, TSelection, TSelectMode, TNullabilityMap, TDynamic, TExcludedMethods, TResult, TSelectedFields>, false, SQLiteSetOperatorExcludedMethods, true>;
type GetSQLiteSetOperators = {
  union: SQLiteCreateSetOperatorFn;
  intersect: SQLiteCreateSetOperatorFn;
  except: SQLiteCreateSetOperatorFn;
  unionAll: SQLiteCreateSetOperatorFn;
};
//#endregion
export { AnySQLiteSelect, AnySQLiteSelectQueryBuilder, AnySQLiteSetOperatorInterface, BuildAliasTable, CreateSQLiteSelectFromBuilderMode, GetSQLiteSetOperators, SQLiteCreateSetOperatorFn, SQLiteSelect, SQLiteSelectConfig, SQLiteSelectCrossJoinFn, SQLiteSelectDynamic, SQLiteSelectExecute, SQLiteSelectHKT, SQLiteSelectHKTBase, SQLiteSelectJoin, SQLiteSelectJoinConfig, SQLiteSelectJoinFn, SQLiteSelectKind, SQLiteSelectPrepare, SQLiteSelectQueryBuilder, SQLiteSelectQueryBuilderHKT, SQLiteSelectWithout, SQLiteSetOperator, SQLiteSetOperatorExcludedMethods, SQLiteSetOperatorInterface, SQLiteSetOperatorWithResult, SelectedFields, SelectedFieldsFlat, SelectedFieldsOrdered, SetOperatorRestSelect, SetOperatorRightSelect };
//# sourceMappingURL=select.types.d.ts.map