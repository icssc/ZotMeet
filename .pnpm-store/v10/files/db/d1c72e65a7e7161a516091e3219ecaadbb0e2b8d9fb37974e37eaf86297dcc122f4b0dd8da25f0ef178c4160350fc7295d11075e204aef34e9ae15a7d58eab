import { GelSelectBase, GelSelectQueryBuilderBase } from "./select.js";
import { GelPreparedQuery, PreparedQueryConfig } from "../session.js";
import { Subquery } from "../../subquery.js";
import { Table, UpdateTableConfig } from "../../table.js";
import { Assume, ValidateShape, ValueOrArray } from "../../utils.js";
import { ColumnsSelection, Placeholder, SQL, SQLWrapper, View } from "../../sql/sql.js";
import { TypedQueryBuilder } from "../../query-builders/query-builder.js";
import { GelViewBase } from "../view-base.js";
import { GelColumn } from "../columns/index.js";
import { GelTable, GelTableWithColumns } from "../table.js";
import { SelectedFields as SelectedFields$1, SelectedFieldsFlat as SelectedFieldsFlat$1, SelectedFieldsOrdered as SelectedFieldsOrdered$1 } from "../../operations.js";
import { AppendToNullabilityMap, AppendToResult, BuildSubquerySelection, GetSelectTableName, JoinNullability, JoinType, MapColumnsToTableAlias, SelectMode, SelectResult, SetOperator } from "../../query-builders/select.types.js";
import { GelViewWithSelection } from "../view.js";

//#region src/gel-core/query-builders/select.types.d.ts
interface GelSelectJoinConfig {
  on: SQL | undefined;
  table: GelTable | Subquery | GelViewBase | SQL;
  alias: string | undefined;
  joinType: JoinType;
  lateral?: boolean;
}
type BuildAliasTable<TTable extends GelTable | View, TAlias extends string> = TTable extends Table ? GelTableWithColumns<UpdateTableConfig<TTable['_'], {
  name: TAlias;
  columns: MapColumnsToTableAlias<TTable['_']['columns'], TAlias, 'gel'>;
}>> : TTable extends View ? GelViewWithSelection<TAlias, TTable['_']['existing'], MapColumnsToTableAlias<TTable['_']['selectedFields'], TAlias, 'gel'>> : never;
interface GelSelectConfig {
  withList?: Subquery[];
  fields: Record<string, unknown>;
  fieldsFlat?: SelectedFieldsOrdered;
  where?: SQL;
  having?: SQL;
  table: GelTable | Subquery | GelViewBase | SQL;
  limit?: number | Placeholder;
  offset?: number | Placeholder;
  joins?: GelSelectJoinConfig[];
  orderBy?: (GelColumn | SQL | SQL.Aliased)[];
  groupBy?: (GelColumn | SQL | SQL.Aliased)[];
  lockingClause?: {
    strength: LockStrength;
    config: LockConfig;
  };
  distinct?: boolean | {
    on: (GelColumn | SQLWrapper)[];
  };
  setOperators: {
    rightSelect: TypedQueryBuilder<any, any>;
    type: SetOperator;
    isAll: boolean;
    orderBy?: (GelColumn | SQL | SQL.Aliased)[];
    limit?: number | Placeholder;
    offset?: number | Placeholder;
  }[];
}
type GelSelectJoin<T extends AnyGelSelectQueryBuilder, TDynamic extends boolean, TJoinType extends JoinType, TJoinedTable extends GelTable | Subquery | GelViewBase | SQL, TJoinedName extends GetSelectTableName<TJoinedTable> = GetSelectTableName<TJoinedTable>> = T extends any ? GelSelectWithout<GelSelectKind<T['_']['hkt'], T['_']['tableName'], AppendToResult<T['_']['tableName'], T['_']['selection'], TJoinedName, TJoinedTable extends Table ? TJoinedTable['_']['columns'] : TJoinedTable extends Subquery ? Assume<TJoinedTable['_']['selectedFields'], SelectedFields> : never, T['_']['selectMode']>, T['_']['selectMode'] extends 'partial' ? T['_']['selectMode'] : 'multiple', AppendToNullabilityMap<T['_']['nullabilityMap'], TJoinedName, TJoinType>, T['_']['dynamic'], T['_']['excludedMethods']>, TDynamic, T['_']['excludedMethods']> : never;
type GelSelectJoinFn<T extends AnyGelSelectQueryBuilder, TDynamic extends boolean, TJoinType extends JoinType, TIsLateral extends boolean> = <TJoinedTable extends (TIsLateral extends true ? Subquery | SQL : GelTable | Subquery | GelViewBase | SQL), TJoinedName extends GetSelectTableName<TJoinedTable> = GetSelectTableName<TJoinedTable>>(table: TJoinedTable, on: ((aliases: T['_']['selection']) => SQL | undefined) | SQL | undefined) => GelSelectJoin<T, TDynamic, TJoinType, TJoinedTable, TJoinedName>;
type GelSelectCrossJoinFn<T extends AnyGelSelectQueryBuilder, TDynamic extends boolean, TIsLateral extends boolean> = <TJoinedTable extends (TIsLateral extends true ? Subquery | SQL : GelTable | Subquery | GelViewBase | SQL), TJoinedName extends GetSelectTableName<TJoinedTable> = GetSelectTableName<TJoinedTable>>(table: TJoinedTable) => GelSelectJoin<T, TDynamic, 'cross', TJoinedTable, TJoinedName>;
type SelectedFieldsFlat = SelectedFieldsFlat$1<GelColumn>;
type SelectedFields = SelectedFields$1<GelColumn, GelTable>;
type SelectedFieldsOrdered = SelectedFieldsOrdered$1<GelColumn>;
type LockStrength = 'update' | 'no key update' | 'share' | 'key share';
type LockConfig = {
  of?: ValueOrArray<GelTable>;
} & ({
  noWait: true;
  skipLocked?: undefined;
} | {
  noWait?: undefined;
  skipLocked: true;
} | {
  noWait?: undefined;
  skipLocked?: undefined;
});
interface GelSelectHKTBase {
  tableName: string | undefined;
  selection: unknown;
  selectMode: SelectMode;
  nullabilityMap: unknown;
  dynamic: boolean;
  excludedMethods: string;
  result: unknown;
  selectedFields: unknown;
  _type: unknown;
}
type GelSelectKind<T extends GelSelectHKTBase, TTableName extends string | undefined, TSelection extends ColumnsSelection, TSelectMode extends SelectMode, TNullabilityMap extends Record<string, JoinNullability>, TDynamic extends boolean, TExcludedMethods extends string, TResult = SelectResult<TSelection, TSelectMode, TNullabilityMap>[], TSelectedFields = BuildSubquerySelection<TSelection, TNullabilityMap>> = (T & {
  tableName: TTableName;
  selection: TSelection;
  selectMode: TSelectMode;
  nullabilityMap: TNullabilityMap;
  dynamic: TDynamic;
  excludedMethods: TExcludedMethods;
  result: TResult;
  selectedFields: TSelectedFields;
})['_type'];
interface GelSelectQueryBuilderHKT extends GelSelectHKTBase {
  _type: GelSelectQueryBuilderBase<GelSelectQueryBuilderHKT, this['tableName'], Assume<this['selection'], ColumnsSelection>, this['selectMode'], Assume<this['nullabilityMap'], Record<string, JoinNullability>>, this['dynamic'], this['excludedMethods'], Assume<this['result'], any[]>, Assume<this['selectedFields'], ColumnsSelection>>;
}
interface GelSelectHKT extends GelSelectHKTBase {
  _type: GelSelectBase<this['tableName'], Assume<this['selection'], ColumnsSelection>, this['selectMode'], Assume<this['nullabilityMap'], Record<string, JoinNullability>>, this['dynamic'], this['excludedMethods'], Assume<this['result'], any[]>, Assume<this['selectedFields'], ColumnsSelection>>;
}
type CreateGelSelectFromBuilderMode<TBuilderMode extends 'db' | 'qb', TTableName extends string | undefined, TSelection extends ColumnsSelection, TSelectMode extends SelectMode> = TBuilderMode extends 'db' ? GelSelectBase<TTableName, TSelection, TSelectMode> : GelSelectQueryBuilderBase<GelSelectQueryBuilderHKT, TTableName, TSelection, TSelectMode>;
type GelSetOperatorExcludedMethods = 'leftJoin' | 'rightJoin' | 'innerJoin' | 'fullJoin' | 'where' | 'having' | 'groupBy' | 'for';
type GelSelectWithout<T extends AnyGelSelectQueryBuilder, TDynamic extends boolean, K extends keyof T & string, TResetExcluded extends boolean = false> = TDynamic extends true ? T : Omit<GelSelectKind<T['_']['hkt'], T['_']['tableName'], T['_']['selection'], T['_']['selectMode'], T['_']['nullabilityMap'], TDynamic, TResetExcluded extends true ? K : T['_']['excludedMethods'] | K, T['_']['result'], T['_']['selectedFields']>, TResetExcluded extends true ? K : T['_']['excludedMethods'] | K>;
type GelSelectPrepare<T extends AnyGelSelect> = GelPreparedQuery<PreparedQueryConfig & {
  execute: T['_']['result'];
}>;
type GelSelectDynamic<T extends AnyGelSelectQueryBuilder> = GelSelectKind<T['_']['hkt'], T['_']['tableName'], T['_']['selection'], T['_']['selectMode'], T['_']['nullabilityMap'], true, never, T['_']['result'], T['_']['selectedFields']>;
type GelSelectQueryBuilder<THKT extends GelSelectHKTBase = GelSelectQueryBuilderHKT, TTableName extends string | undefined = string | undefined, TSelection extends ColumnsSelection = ColumnsSelection, TSelectMode extends SelectMode = SelectMode, TNullabilityMap extends Record<string, JoinNullability> = Record<string, JoinNullability>, TResult extends any[] = unknown[], TSelectedFields extends ColumnsSelection = ColumnsSelection> = GelSelectQueryBuilderBase<THKT, TTableName, TSelection, TSelectMode, TNullabilityMap, true, never, TResult, TSelectedFields>;
type AnyGelSelectQueryBuilder = GelSelectQueryBuilderBase<any, any, any, any, any, any, any, any, any>;
type AnyGelSetOperatorInterface = GelSetOperatorInterface<any, any, any, any, any, any, any, any>;
interface GelSetOperatorInterface<TTableName extends string | undefined, TSelection extends ColumnsSelection, TSelectMode extends SelectMode, TNullabilityMap extends Record<string, JoinNullability> = (TTableName extends string ? Record<TTableName, 'not-null'> : {}), TDynamic extends boolean = false, TExcludedMethods extends string = never, TResult extends any[] = SelectResult<TSelection, TSelectMode, TNullabilityMap>[], TSelectedFields extends ColumnsSelection = BuildSubquerySelection<TSelection, TNullabilityMap>> {
  _: {
    readonly hkt: GelSelectHKT;
    readonly tableName: TTableName;
    readonly selection: TSelection;
    readonly selectMode: TSelectMode;
    readonly nullabilityMap: TNullabilityMap;
    readonly dynamic: TDynamic;
    readonly excludedMethods: TExcludedMethods;
    readonly result: TResult;
    readonly selectedFields: TSelectedFields;
  };
}
type GelSetOperatorWithResult<TResult extends any[]> = GelSetOperatorInterface<any, any, any, any, any, any, TResult, any>;
type GelSelect<TTableName extends string | undefined = string | undefined, TSelection extends ColumnsSelection = Record<string, any>, TSelectMode extends SelectMode = SelectMode, TNullabilityMap extends Record<string, JoinNullability> = Record<string, JoinNullability>> = GelSelectBase<TTableName, TSelection, TSelectMode, TNullabilityMap, true, never>;
type AnyGelSelect = GelSelectBase<any, any, any, any, any, any, any, any>;
type GelSetOperator<TTableName extends string | undefined = string | undefined, TSelection extends ColumnsSelection = Record<string, any>, TSelectMode extends SelectMode = SelectMode, TNullabilityMap extends Record<string, JoinNullability> = Record<string, JoinNullability>> = GelSelectBase<TTableName, TSelection, TSelectMode, TNullabilityMap, true, GelSetOperatorExcludedMethods>;
type SetOperatorRightSelect<TValue extends GelSetOperatorWithResult<TResult>, TResult extends any[]> = TValue extends GelSetOperatorInterface<any, any, any, any, any, any, infer TValueResult, any> ? ValidateShape<TValueResult[number], TResult[number], TypedQueryBuilder<any, TValueResult>> : TValue;
type SetOperatorRestSelect<TValue extends readonly GelSetOperatorWithResult<TResult>[], TResult extends any[]> = TValue extends [infer First, ...infer Rest] ? First extends GelSetOperatorInterface<any, any, any, any, any, any, infer TValueResult, any> ? Rest extends AnyGelSetOperatorInterface[] ? [ValidateShape<TValueResult[number], TResult[number], TypedQueryBuilder<any, TValueResult>>, ...SetOperatorRestSelect<Rest, TResult>] : ValidateShape<TValueResult[number], TResult[number], TypedQueryBuilder<any, TValueResult>[]> : never : TValue;
type GelCreateSetOperatorFn = <TTableName extends string | undefined, TSelection extends ColumnsSelection, TSelectMode extends SelectMode, TValue extends GelSetOperatorWithResult<TResult>, TRest extends GelSetOperatorWithResult<TResult>[], TNullabilityMap extends Record<string, JoinNullability> = (TTableName extends string ? Record<TTableName, 'not-null'> : {}), TDynamic extends boolean = false, TExcludedMethods extends string = never, TResult extends any[] = SelectResult<TSelection, TSelectMode, TNullabilityMap>[], TSelectedFields extends ColumnsSelection = BuildSubquerySelection<TSelection, TNullabilityMap>>(leftSelect: GelSetOperatorInterface<TTableName, TSelection, TSelectMode, TNullabilityMap, TDynamic, TExcludedMethods, TResult, TSelectedFields>, rightSelect: SetOperatorRightSelect<TValue, TResult>, ...restSelects: SetOperatorRestSelect<TRest, TResult>) => GelSelectWithout<GelSelectBase<TTableName, TSelection, TSelectMode, TNullabilityMap, TDynamic, TExcludedMethods, TResult, TSelectedFields>, false, GelSetOperatorExcludedMethods, true>;
type GetGelSetOperators = {
  union: GelCreateSetOperatorFn;
  intersect: GelCreateSetOperatorFn;
  except: GelCreateSetOperatorFn;
  unionAll: GelCreateSetOperatorFn;
  intersectAll: GelCreateSetOperatorFn;
  exceptAll: GelCreateSetOperatorFn;
};
//#endregion
export { AnyGelSelect, AnyGelSelectQueryBuilder, AnyGelSetOperatorInterface, BuildAliasTable, CreateGelSelectFromBuilderMode, GelCreateSetOperatorFn, GelSelect, GelSelectConfig, GelSelectCrossJoinFn, GelSelectDynamic, GelSelectHKT, GelSelectHKTBase, GelSelectJoin, GelSelectJoinConfig, GelSelectJoinFn, GelSelectKind, GelSelectPrepare, GelSelectQueryBuilder, GelSelectQueryBuilderHKT, GelSelectWithout, GelSetOperator, GelSetOperatorExcludedMethods, GelSetOperatorInterface, GelSetOperatorWithResult, GetGelSetOperators, LockConfig, LockStrength, SelectedFields, SelectedFieldsFlat, SelectedFieldsOrdered, SetOperatorRestSelect, SetOperatorRightSelect };
//# sourceMappingURL=select.types.d.ts.map