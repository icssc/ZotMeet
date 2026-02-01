import { SingleStoreSelectBase, SingleStoreSelectQueryBuilderBase } from "./select.js";
import { PreparedQueryHKTBase, PreparedQueryKind, SingleStorePreparedQueryConfig } from "../session.js";
import { Subquery } from "../../subquery.js";
import { Table, UpdateTableConfig } from "../../table.js";
import { Assume, ValidateShape } from "../../utils.js";
import { ColumnsSelection, Placeholder, SQL, View } from "../../sql/sql.js";
import { TypedQueryBuilder } from "../../query-builders/query-builder.js";
import { SelectedFields as SelectedFields$1, SelectedFieldsFlat as SelectedFieldsFlat$1, SelectedFieldsOrdered as SelectedFieldsOrdered$1 } from "../../operations.js";
import { AppendToNullabilityMap, AppendToResult, BuildSubquerySelection, GetSelectTableName, JoinNullability, JoinType, MapColumnsToTableAlias, SelectMode, SelectResult, SetOperator } from "../../query-builders/select.types.js";
import { SingleStoreColumn } from "../columns/index.js";
import { SingleStoreTable, SingleStoreTableWithColumns } from "../table.js";

//#region src/singlestore-core/query-builders/select.types.d.ts
interface SingleStoreSelectJoinConfig {
  on: SQL | undefined;
  table: SingleStoreTable | Subquery | SQL;
  alias: string | undefined;
  joinType: JoinType;
  lateral?: boolean;
}
type BuildAliasTable<TTable extends SingleStoreTable | View, TAlias extends string> = TTable extends Table ? SingleStoreTableWithColumns<UpdateTableConfig<TTable['_'], {
  name: TAlias;
  columns: MapColumnsToTableAlias<TTable['_']['columns'], TAlias, 'singlestore'>;
}>> : never;
interface SingleStoreSelectConfig {
  withList?: Subquery[];
  fields: Record<string, unknown>;
  fieldsFlat?: SelectedFieldsOrdered;
  where?: SQL;
  having?: SQL;
  table: SingleStoreTable | Subquery | SQL;
  limit?: number | Placeholder;
  offset?: number | Placeholder;
  joins?: SingleStoreSelectJoinConfig[];
  orderBy?: (SingleStoreColumn | SQL | SQL.Aliased)[];
  groupBy?: (SingleStoreColumn | SQL | SQL.Aliased)[];
  lockingClause?: {
    strength: LockStrength;
    config: LockConfig;
  };
  distinct?: boolean;
  setOperators: {
    rightSelect: TypedQueryBuilder<any, any>;
    type: SetOperator;
    isAll: boolean;
    orderBy?: (SingleStoreColumn | SQL | SQL.Aliased)[];
    limit?: number | Placeholder;
    offset?: number | Placeholder;
  }[];
}
type SingleStoreJoin<T extends AnySingleStoreSelectQueryBuilder, TDynamic extends boolean, TJoinType extends JoinType, TJoinedTable extends SingleStoreTable | Subquery | SQL,
// | SingleStoreViewBase
TJoinedName extends GetSelectTableName<TJoinedTable> = GetSelectTableName<TJoinedTable>> = T extends any ? SingleStoreSelectWithout<SingleStoreSelectKind<T['_']['hkt'], T['_']['tableName'], AppendToResult<T['_']['tableName'], T['_']['selection'], TJoinedName, TJoinedTable extends SingleStoreTable ? TJoinedTable['_']['columns'] : TJoinedTable extends Subquery ? Assume<TJoinedTable['_']['selectedFields'], SelectedFields> : never, T['_']['selectMode']>, T['_']['selectMode'] extends 'partial' ? T['_']['selectMode'] : 'multiple', T['_']['preparedQueryHKT'], AppendToNullabilityMap<T['_']['nullabilityMap'], TJoinedName, TJoinType>, TDynamic, T['_']['excludedMethods']>, TDynamic, T['_']['excludedMethods']> : never;
type SingleStoreJoinFn<T extends AnySingleStoreSelectQueryBuilder, TDynamic extends boolean, TJoinType extends JoinType, TIsLateral extends boolean> = <TJoinedTable extends (TIsLateral extends true ? Subquery | SQL : SingleStoreTable | Subquery | SQL), TJoinedName extends GetSelectTableName<TJoinedTable> = GetSelectTableName<TJoinedTable>>(table: TJoinedTable, on: ((aliases: T['_']['selection']) => SQL | undefined) | SQL | undefined) => SingleStoreJoin<T, TDynamic, TJoinType, TJoinedTable, TJoinedName>;
type SingleStoreCrossJoinFn<T extends AnySingleStoreSelectQueryBuilder, TDynamic extends boolean, TIsLateral extends boolean> = <TJoinedTable extends (TIsLateral extends true ? Subquery | SQL : SingleStoreTable | Subquery | SQL), TJoinedName extends GetSelectTableName<TJoinedTable> = GetSelectTableName<TJoinedTable>>(table: TJoinedTable) => SingleStoreJoin<T, TDynamic, 'cross', TJoinedTable, TJoinedName>;
type SelectedFieldsFlat = SelectedFieldsFlat$1<SingleStoreColumn>;
type SelectedFields = SelectedFields$1<SingleStoreColumn, SingleStoreTable>;
type SelectedFieldsOrdered = SelectedFieldsOrdered$1<SingleStoreColumn>;
type LockStrength = 'update' | 'share';
type LockConfig = {
  noWait: true;
  skipLocked?: undefined;
} | {
  noWait?: undefined;
  skipLocked: true;
} | {
  noWait?: undefined;
  skipLocked?: undefined;
};
interface SingleStoreSelectHKTBase {
  tableName: string | undefined;
  selection: unknown;
  selectMode: SelectMode;
  preparedQueryHKT: unknown;
  nullabilityMap: unknown;
  dynamic: boolean;
  excludedMethods: string;
  result: unknown;
  selectedFields: unknown;
  _type: unknown;
}
type SingleStoreSelectKind<T extends SingleStoreSelectHKTBase, TTableName extends string | undefined, TSelection extends ColumnsSelection, TSelectMode extends SelectMode, TPreparedQueryHKT extends PreparedQueryHKTBase, TNullabilityMap extends Record<string, JoinNullability>, TDynamic extends boolean, TExcludedMethods extends string, TResult = SelectResult<TSelection, TSelectMode, TNullabilityMap>[], TSelectedFields = BuildSubquerySelection<TSelection, TNullabilityMap>> = (T & {
  tableName: TTableName;
  selection: TSelection;
  selectMode: TSelectMode;
  preparedQueryHKT: TPreparedQueryHKT;
  nullabilityMap: TNullabilityMap;
  dynamic: TDynamic;
  excludedMethods: TExcludedMethods;
  result: TResult;
  selectedFields: TSelectedFields;
})['_type'];
interface SingleStoreSelectQueryBuilderHKT extends SingleStoreSelectHKTBase {
  _type: SingleStoreSelectQueryBuilderBase<SingleStoreSelectQueryBuilderHKT, this['tableName'], Assume<this['selection'], ColumnsSelection>, this['selectMode'], Assume<this['preparedQueryHKT'], PreparedQueryHKTBase>, Assume<this['nullabilityMap'], Record<string, JoinNullability>>, this['dynamic'], this['excludedMethods'], Assume<this['result'], any[]>, Assume<this['selectedFields'], ColumnsSelection>>;
}
interface SingleStoreSelectHKT extends SingleStoreSelectHKTBase {
  _type: SingleStoreSelectBase<this['tableName'], Assume<this['selection'], ColumnsSelection>, this['selectMode'], Assume<this['preparedQueryHKT'], PreparedQueryHKTBase>, Assume<this['nullabilityMap'], Record<string, JoinNullability>>, this['dynamic'], this['excludedMethods'], Assume<this['result'], any[]>, Assume<this['selectedFields'], ColumnsSelection>>;
}
type SingleStoreSetOperatorExcludedMethods = 'where' | 'having' | 'groupBy' | 'session' | 'leftJoin' | 'rightJoin' | 'innerJoin' | 'fullJoin' | 'for';
type SingleStoreSelectWithout<T extends AnySingleStoreSelectQueryBuilder, TDynamic extends boolean, K extends keyof T & string, TResetExcluded extends boolean = false> = TDynamic extends true ? T : Omit<SingleStoreSelectKind<T['_']['hkt'], T['_']['tableName'], T['_']['selection'], T['_']['selectMode'], T['_']['preparedQueryHKT'], T['_']['nullabilityMap'], TDynamic, TResetExcluded extends true ? K : T['_']['excludedMethods'] | K, T['_']['result'], T['_']['selectedFields']>, TResetExcluded extends true ? K : T['_']['excludedMethods'] | K>;
type SingleStoreSelectPrepare<T extends AnySingleStoreSelect> = PreparedQueryKind<T['_']['preparedQueryHKT'], SingleStorePreparedQueryConfig & {
  execute: T['_']['result'];
  iterator: T['_']['result'][number];
}, true>;
type SingleStoreSelectDynamic<T extends AnySingleStoreSelectQueryBuilder> = SingleStoreSelectKind<T['_']['hkt'], T['_']['tableName'], T['_']['selection'], T['_']['selectMode'], T['_']['preparedQueryHKT'], T['_']['nullabilityMap'], true, never, T['_']['result'], T['_']['selectedFields']>;
type CreateSingleStoreSelectFromBuilderMode<TBuilderMode extends 'db' | 'qb', TTableName extends string | undefined, TSelection extends ColumnsSelection, TSelectMode extends SelectMode, TPreparedQueryHKT extends PreparedQueryHKTBase> = TBuilderMode extends 'db' ? SingleStoreSelectBase<TTableName, TSelection, TSelectMode, TPreparedQueryHKT> : SingleStoreSelectQueryBuilderBase<SingleStoreSelectQueryBuilderHKT, TTableName, TSelection, TSelectMode, TPreparedQueryHKT>;
type SingleStoreSelectQueryBuilder<THKT extends SingleStoreSelectHKTBase = SingleStoreSelectQueryBuilderHKT, TTableName extends string | undefined = string | undefined, TSelection extends ColumnsSelection = ColumnsSelection, TSelectMode extends SelectMode = SelectMode, TPreparedQueryHKT extends PreparedQueryHKTBase = PreparedQueryHKTBase, TNullabilityMap extends Record<string, JoinNullability> = Record<string, JoinNullability>, TResult extends any[] = unknown[], TSelectedFields extends ColumnsSelection = ColumnsSelection> = SingleStoreSelectQueryBuilderBase<THKT, TTableName, TSelection, TSelectMode, TPreparedQueryHKT, TNullabilityMap, true, never, TResult, TSelectedFields>;
type AnySingleStoreSelectQueryBuilder = SingleStoreSelectQueryBuilderBase<any, any, any, any, any, any, any, any, any>;
type AnySingleStoreSetOperatorInterface = SingleStoreSetOperatorInterface<any, any, any, any, any, any, any, any, any>;
interface SingleStoreSetOperatorInterface<TTableName extends string | undefined, TSelection extends ColumnsSelection, TSelectMode extends SelectMode, TPreparedQueryHKT extends PreparedQueryHKTBase = PreparedQueryHKTBase, TNullabilityMap extends Record<string, JoinNullability> = (TTableName extends string ? Record<TTableName, 'not-null'> : {}), TDynamic extends boolean = false, TExcludedMethods extends string = never, TResult extends any[] = SelectResult<TSelection, TSelectMode, TNullabilityMap>[], TSelectedFields extends ColumnsSelection = BuildSubquerySelection<TSelection, TNullabilityMap>> {
  _: {
    readonly hkt: SingleStoreSelectHKT;
    readonly tableName: TTableName;
    readonly selection: TSelection;
    readonly selectMode: TSelectMode;
    readonly preparedQueryHKT: TPreparedQueryHKT;
    readonly nullabilityMap: TNullabilityMap;
    readonly dynamic: TDynamic;
    readonly excludedMethods: TExcludedMethods;
    readonly result: TResult;
    readonly selectedFields: TSelectedFields;
  };
}
type SingleStoreSetOperatorWithResult<TResult extends any[]> = SingleStoreSetOperatorInterface<any, any, any, any, any, any, any, TResult, any>;
type SingleStoreSelect<TTableName extends string | undefined = string | undefined, TSelection extends ColumnsSelection = Record<string, any>, TSelectMode extends SelectMode = SelectMode, TNullabilityMap extends Record<string, JoinNullability> = Record<string, JoinNullability>> = SingleStoreSelectBase<TTableName, TSelection, TSelectMode, PreparedQueryHKTBase, TNullabilityMap, true, never>;
type AnySingleStoreSelect = SingleStoreSelectBase<any, any, any, any, any, any, any, any>;
type SingleStoreSetOperator<TTableName extends string | undefined = string | undefined, TSelection extends ColumnsSelection = Record<string, any>, TSelectMode extends SelectMode = SelectMode, TPreparedQueryHKT extends PreparedQueryHKTBase = PreparedQueryHKTBase, TNullabilityMap extends Record<string, JoinNullability> = Record<string, JoinNullability>> = SingleStoreSelectBase<TTableName, TSelection, TSelectMode, TPreparedQueryHKT, TNullabilityMap, true, SingleStoreSetOperatorExcludedMethods>;
type SetOperatorRightSelect<TValue extends SingleStoreSetOperatorWithResult<TResult>, TResult extends any[]> = TValue extends SingleStoreSetOperatorInterface<any, any, any, any, any, any, any, infer TValueResult, any> ? ValidateShape<TValueResult[number], TResult[number], TypedQueryBuilder<any, TValueResult>> : TValue;
type SetOperatorRestSelect<TValue extends readonly SingleStoreSetOperatorWithResult<TResult>[], TResult extends any[]> = TValue extends [infer First, ...infer Rest] ? First extends SingleStoreSetOperatorInterface<any, any, any, any, any, any, any, infer TValueResult, any> ? Rest extends AnySingleStoreSetOperatorInterface[] ? [ValidateShape<TValueResult[number], TResult[number], TypedQueryBuilder<any, TValueResult>>, ...SetOperatorRestSelect<Rest, TResult>] : ValidateShape<TValueResult[number], TResult[number], TypedQueryBuilder<any, TValueResult>[]> : never : TValue;
type SingleStoreCreateSetOperatorFn = <TTableName extends string | undefined, TSelection extends ColumnsSelection, TSelectMode extends SelectMode, TValue extends SingleStoreSetOperatorWithResult<TResult>, TRest extends SingleStoreSetOperatorWithResult<TResult>[], TPreparedQueryHKT extends PreparedQueryHKTBase = PreparedQueryHKTBase, TNullabilityMap extends Record<string, JoinNullability> = (TTableName extends string ? Record<TTableName, 'not-null'> : {}), TDynamic extends boolean = false, TExcludedMethods extends string = never, TResult extends any[] = SelectResult<TSelection, TSelectMode, TNullabilityMap>[], TSelectedFields extends ColumnsSelection = BuildSubquerySelection<TSelection, TNullabilityMap>>(leftSelect: SingleStoreSetOperatorInterface<TTableName, TSelection, TSelectMode, TPreparedQueryHKT, TNullabilityMap, TDynamic, TExcludedMethods, TResult, TSelectedFields>, rightSelect: SetOperatorRightSelect<TValue, TResult>, ...restSelects: SetOperatorRestSelect<TRest, TResult>) => SingleStoreSelectWithout<SingleStoreSelectBase<TTableName, TSelection, TSelectMode, TPreparedQueryHKT, TNullabilityMap, TDynamic, TExcludedMethods, TResult, TSelectedFields>, false, SingleStoreSetOperatorExcludedMethods, true>;
type GetSingleStoreSetOperators = {
  union: SingleStoreCreateSetOperatorFn;
  intersect: SingleStoreCreateSetOperatorFn;
  except: SingleStoreCreateSetOperatorFn;
  unionAll: SingleStoreCreateSetOperatorFn;
  minus: SingleStoreCreateSetOperatorFn;
};
//#endregion
export { AnySingleStoreSelect, AnySingleStoreSelectQueryBuilder, AnySingleStoreSetOperatorInterface, BuildAliasTable, CreateSingleStoreSelectFromBuilderMode, GetSingleStoreSetOperators, LockConfig, LockStrength, SelectedFields, SelectedFieldsFlat, SelectedFieldsOrdered, SetOperatorRestSelect, SetOperatorRightSelect, SingleStoreCreateSetOperatorFn, SingleStoreCrossJoinFn, SingleStoreJoin, SingleStoreJoinFn, SingleStoreSelect, SingleStoreSelectConfig, SingleStoreSelectDynamic, SingleStoreSelectHKT, SingleStoreSelectHKTBase, SingleStoreSelectJoinConfig, SingleStoreSelectKind, SingleStoreSelectPrepare, SingleStoreSelectQueryBuilder, SingleStoreSelectQueryBuilderHKT, SingleStoreSelectWithout, SingleStoreSetOperator, SingleStoreSetOperatorExcludedMethods, SingleStoreSetOperatorInterface, SingleStoreSetOperatorWithResult };
//# sourceMappingURL=select.types.d.ts.map