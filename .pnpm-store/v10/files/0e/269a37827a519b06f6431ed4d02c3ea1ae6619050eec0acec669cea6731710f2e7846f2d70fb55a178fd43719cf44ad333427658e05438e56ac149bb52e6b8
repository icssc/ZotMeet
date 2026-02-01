import { CockroachSelectBase, CockroachSelectQueryBuilderBase } from "./select.cjs";
import { CockroachPreparedQuery, PreparedQueryConfig } from "../session.cjs";
import { CockroachColumn } from "../columns/index.cjs";
import { CockroachTable, CockroachTableWithColumns } from "../table.cjs";
import { CockroachViewBase } from "../view-base.cjs";
import { CockroachViewWithSelection } from "../view.cjs";
import { SelectedFields as SelectedFields$1, SelectedFieldsFlat as SelectedFieldsFlat$1, SelectedFieldsOrdered as SelectedFieldsOrdered$1 } from "../../operations.cjs";
import { TypedQueryBuilder } from "../../query-builders/query-builder.cjs";
import { AppendToNullabilityMap, AppendToResult, BuildSubquerySelection, GetSelectTableName, JoinNullability, JoinType, MapColumnsToTableAlias, SelectMode, SelectResult, SetOperator } from "../../query-builders/select.types.cjs";
import { ColumnsSelection, Placeholder, SQL, SQLWrapper, View } from "../../sql/sql.cjs";
import { Subquery } from "../../subquery.cjs";
import { Table, UpdateTableConfig } from "../../table.cjs";
import { Assume, DrizzleTypeError, Equal, ValidateShape, ValueOrArray } from "../../utils.cjs";

//#region src/cockroach-core/query-builders/select.types.d.ts
interface CockroachSelectJoinConfig {
  on: SQL | undefined;
  table: CockroachTable | Subquery | CockroachViewBase | SQL;
  alias: string | undefined;
  joinType: JoinType;
  lateral?: boolean;
}
type BuildAliasTable<TTable extends CockroachTable | View, TAlias extends string> = TTable extends Table ? CockroachTableWithColumns<UpdateTableConfig<TTable['_'], {
  name: TAlias;
  columns: MapColumnsToTableAlias<TTable['_']['columns'], TAlias, 'cockroach'>;
}>> : TTable extends View ? CockroachViewWithSelection<TAlias, TTable['_']['existing'], MapColumnsToTableAlias<TTable['_']['selectedFields'], TAlias, 'cockroach'>> : never;
interface CockroachSelectConfig {
  withList?: Subquery[];
  fields: Record<string, unknown>;
  fieldsFlat?: SelectedFieldsOrdered;
  where?: SQL;
  having?: SQL;
  table: CockroachTable | Subquery | CockroachViewBase | SQL;
  limit?: number | Placeholder;
  offset?: number | Placeholder;
  joins?: CockroachSelectJoinConfig[];
  orderBy?: (CockroachColumn | SQL | SQL.Aliased)[];
  groupBy?: (CockroachColumn | SQL | SQL.Aliased)[];
  lockingClause?: {
    strength: LockStrength;
    config: LockConfig;
  };
  distinct?: boolean | {
    on: (CockroachColumn | SQLWrapper)[];
  };
  setOperators: {
    rightSelect: TypedQueryBuilder<any, any>;
    type: SetOperator;
    isAll: boolean;
    orderBy?: (CockroachColumn | SQL | SQL.Aliased)[];
    limit?: number | Placeholder;
    offset?: number | Placeholder;
  }[];
}
type TableLikeHasEmptySelection<T extends CockroachTable | Subquery | CockroachViewBase | SQL> = T extends Subquery ? Equal<T['_']['selectedFields'], {}> extends true ? true : false : false;
type CockroachSelectJoin<T extends AnyCockroachSelectQueryBuilder, TDynamic extends boolean, TJoinType extends JoinType, TJoinedTable extends CockroachTable | Subquery | CockroachViewBase | SQL, TJoinedName extends GetSelectTableName<TJoinedTable> = GetSelectTableName<TJoinedTable>> = T extends any ? CockroachSelectWithout<CockroachSelectKind<T['_']['hkt'], T['_']['tableName'], AppendToResult<T['_']['tableName'], T['_']['selection'], TJoinedName, TJoinedTable extends Table ? TJoinedTable['_']['columns'] : TJoinedTable extends Subquery | View ? Assume<TJoinedTable['_']['selectedFields'], SelectedFields> : never, T['_']['selectMode']>, T['_']['selectMode'] extends 'partial' ? T['_']['selectMode'] : 'multiple', AppendToNullabilityMap<T['_']['nullabilityMap'], TJoinedName, TJoinType>, T['_']['dynamic'], T['_']['excludedMethods']>, TDynamic, T['_']['excludedMethods']> : never;
type CockroachSelectJoinFn<T extends AnyCockroachSelectQueryBuilder, TDynamic extends boolean, TJoinType extends JoinType, TIsLateral extends boolean> = <TJoinedTable extends (TIsLateral extends true ? Subquery | SQL : CockroachTable | Subquery | CockroachViewBase | SQL), TJoinedName extends GetSelectTableName<TJoinedTable> = GetSelectTableName<TJoinedTable>>(table: TableLikeHasEmptySelection<TJoinedTable> extends true ? DrizzleTypeError<"Cannot reference a data-modifying statement subquery if it doesn't contain a `returning` clause"> : TJoinedTable, on: ((aliases: T['_']['selection']) => SQL | undefined) | SQL | undefined) => CockroachSelectJoin<T, TDynamic, TJoinType, TJoinedTable, TJoinedName>;
type CockroachSelectCrossJoinFn<T extends AnyCockroachSelectQueryBuilder, TDynamic extends boolean, TIsLateral extends boolean> = <TJoinedTable extends (TIsLateral extends true ? Subquery | SQL : CockroachTable | Subquery | CockroachViewBase | SQL), TJoinedName extends GetSelectTableName<TJoinedTable> = GetSelectTableName<TJoinedTable>>(table: TableLikeHasEmptySelection<TJoinedTable> extends true ? DrizzleTypeError<"Cannot reference a data-modifying statement subquery if it doesn't contain a `returning` clause"> : TJoinedTable) => CockroachSelectJoin<T, TDynamic, 'cross', TJoinedTable, TJoinedName>;
type SelectedFieldsFlat = SelectedFieldsFlat$1<CockroachColumn>;
type SelectedFields = SelectedFields$1<CockroachColumn, CockroachTable>;
type SelectedFieldsOrdered = SelectedFieldsOrdered$1<CockroachColumn>;
type LockStrength = 'update' | 'no key update' | 'share' | 'key share';
type LockConfig = {
  of?: ValueOrArray<CockroachTable>;
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
interface CockroachSelectHKTBase {
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
type CockroachSelectKind<T extends CockroachSelectHKTBase, TTableName extends string | undefined, TSelection extends ColumnsSelection, TSelectMode extends SelectMode, TNullabilityMap extends Record<string, JoinNullability>, TDynamic extends boolean, TExcludedMethods extends string, TResult = SelectResult<TSelection, TSelectMode, TNullabilityMap>[], TSelectedFields = BuildSubquerySelection<TSelection, TNullabilityMap>> = (T & {
  tableName: TTableName;
  selection: TSelection;
  selectMode: TSelectMode;
  nullabilityMap: TNullabilityMap;
  dynamic: TDynamic;
  excludedMethods: TExcludedMethods;
  result: TResult;
  selectedFields: TSelectedFields;
})['_type'];
interface CockroachSelectQueryBuilderHKT extends CockroachSelectHKTBase {
  _type: CockroachSelectQueryBuilderBase<CockroachSelectQueryBuilderHKT, this['tableName'], Assume<this['selection'], ColumnsSelection>, this['selectMode'], Assume<this['nullabilityMap'], Record<string, JoinNullability>>, this['dynamic'], this['excludedMethods'], Assume<this['result'], any[]>, Assume<this['selectedFields'], ColumnsSelection>>;
}
interface CockroachSelectHKT extends CockroachSelectHKTBase {
  _type: CockroachSelectBase<this['tableName'], Assume<this['selection'], ColumnsSelection>, this['selectMode'], Assume<this['nullabilityMap'], Record<string, JoinNullability>>, this['dynamic'], this['excludedMethods'], Assume<this['result'], any[]>, Assume<this['selectedFields'], ColumnsSelection>>;
}
type CreateCockroachSelectFromBuilderMode<TBuilderMode extends 'db' | 'qb', TTableName extends string | undefined, TSelection extends ColumnsSelection, TSelectMode extends SelectMode> = TBuilderMode extends 'db' ? CockroachSelectBase<TTableName, TSelection, TSelectMode> : CockroachSelectQueryBuilderBase<CockroachSelectQueryBuilderHKT, TTableName, TSelection, TSelectMode>;
type CockroachSetOperatorExcludedMethods = 'leftJoin' | 'rightJoin' | 'innerJoin' | 'fullJoin' | 'where' | 'having' | 'groupBy' | 'for';
type CockroachSelectWithout<T extends AnyCockroachSelectQueryBuilder, TDynamic extends boolean, K extends keyof T & string, TResetExcluded extends boolean = false> = TDynamic extends true ? T : Omit<CockroachSelectKind<T['_']['hkt'], T['_']['tableName'], T['_']['selection'], T['_']['selectMode'], T['_']['nullabilityMap'], TDynamic, TResetExcluded extends true ? K : T['_']['excludedMethods'] | K, T['_']['result'], T['_']['selectedFields']>, TResetExcluded extends true ? K : T['_']['excludedMethods'] | K>;
type CockroachSelectPrepare<T extends AnyCockroachSelect> = CockroachPreparedQuery<PreparedQueryConfig & {
  execute: T['_']['result'];
}>;
type CockroachSelectDynamic<T extends AnyCockroachSelectQueryBuilder> = CockroachSelectKind<T['_']['hkt'], T['_']['tableName'], T['_']['selection'], T['_']['selectMode'], T['_']['nullabilityMap'], true, never, T['_']['result'], T['_']['selectedFields']>;
type CockroachSelectQueryBuilder<THKT extends CockroachSelectHKTBase = CockroachSelectQueryBuilderHKT, TTableName extends string | undefined = string | undefined, TSelection extends ColumnsSelection = ColumnsSelection, TSelectMode extends SelectMode = SelectMode, TNullabilityMap extends Record<string, JoinNullability> = Record<string, JoinNullability>, TResult extends any[] = unknown[], TSelectedFields extends ColumnsSelection = ColumnsSelection> = CockroachSelectQueryBuilderBase<THKT, TTableName, TSelection, TSelectMode, TNullabilityMap, true, never, TResult, TSelectedFields>;
type AnyCockroachSelectQueryBuilder = CockroachSelectQueryBuilderBase<any, any, any, any, any, any, any, any, any>;
type AnyCockroachSetOperatorInterface = CockroachSetOperatorInterface<any, any, any, any, any, any, any, any>;
interface CockroachSetOperatorInterface<TTableName extends string | undefined, TSelection extends ColumnsSelection, TSelectMode extends SelectMode, TNullabilityMap extends Record<string, JoinNullability> = (TTableName extends string ? Record<TTableName, 'not-null'> : {}), TDynamic extends boolean = false, TExcludedMethods extends string = never, TResult extends any[] = SelectResult<TSelection, TSelectMode, TNullabilityMap>[], TSelectedFields extends ColumnsSelection = BuildSubquerySelection<TSelection, TNullabilityMap>> {
  _: {
    readonly hkt: CockroachSelectHKT;
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
type CockroachSetOperatorWithResult<TResult extends any[]> = CockroachSetOperatorInterface<any, any, any, any, any, any, TResult, any>;
type CockroachSelect<TTableName extends string | undefined = string | undefined, TSelection extends ColumnsSelection = Record<string, any>, TSelectMode extends SelectMode = SelectMode, TNullabilityMap extends Record<string, JoinNullability> = Record<string, JoinNullability>> = CockroachSelectBase<TTableName, TSelection, TSelectMode, TNullabilityMap, true, never>;
type AnyCockroachSelect = CockroachSelectBase<any, any, any, any, any, any, any, any>;
type CockroachSetOperator<TTableName extends string | undefined = string | undefined, TSelection extends ColumnsSelection = Record<string, any>, TSelectMode extends SelectMode = SelectMode, TNullabilityMap extends Record<string, JoinNullability> = Record<string, JoinNullability>> = CockroachSelectBase<TTableName, TSelection, TSelectMode, TNullabilityMap, true, CockroachSetOperatorExcludedMethods>;
type SetOperatorRightSelect<TValue extends CockroachSetOperatorWithResult<TResult>, TResult extends any[]> = TValue extends CockroachSetOperatorInterface<any, any, any, any, any, any, infer TValueResult, any> ? ValidateShape<TValueResult[number], TResult[number], TypedQueryBuilder<any, TValueResult>> : TValue;
type SetOperatorRestSelect<TValue extends readonly CockroachSetOperatorWithResult<TResult>[], TResult extends any[]> = TValue extends [infer First, ...infer Rest] ? First extends CockroachSetOperatorInterface<any, any, any, any, any, any, infer TValueResult, any> ? Rest extends AnyCockroachSetOperatorInterface[] ? [ValidateShape<TValueResult[number], TResult[number], TypedQueryBuilder<any, TValueResult>>, ...SetOperatorRestSelect<Rest, TResult>] : ValidateShape<TValueResult[number], TResult[number], TypedQueryBuilder<any, TValueResult>[]> : never : TValue;
type CockroachCreateSetOperatorFn = <TTableName extends string | undefined, TSelection extends ColumnsSelection, TSelectMode extends SelectMode, TValue extends CockroachSetOperatorWithResult<TResult>, TRest extends CockroachSetOperatorWithResult<TResult>[], TNullabilityMap extends Record<string, JoinNullability> = (TTableName extends string ? Record<TTableName, 'not-null'> : {}), TDynamic extends boolean = false, TExcludedMethods extends string = never, TResult extends any[] = SelectResult<TSelection, TSelectMode, TNullabilityMap>[], TSelectedFields extends ColumnsSelection = BuildSubquerySelection<TSelection, TNullabilityMap>>(leftSelect: CockroachSetOperatorInterface<TTableName, TSelection, TSelectMode, TNullabilityMap, TDynamic, TExcludedMethods, TResult, TSelectedFields>, rightSelect: SetOperatorRightSelect<TValue, TResult>, ...restSelects: SetOperatorRestSelect<TRest, TResult>) => CockroachSelectWithout<CockroachSelectBase<TTableName, TSelection, TSelectMode, TNullabilityMap, TDynamic, TExcludedMethods, TResult, TSelectedFields>, false, CockroachSetOperatorExcludedMethods, true>;
type GetCockroachSetOperators = {
  union: CockroachCreateSetOperatorFn;
  intersect: CockroachCreateSetOperatorFn;
  except: CockroachCreateSetOperatorFn;
  unionAll: CockroachCreateSetOperatorFn;
  intersectAll: CockroachCreateSetOperatorFn;
  exceptAll: CockroachCreateSetOperatorFn;
};
//#endregion
export { AnyCockroachSelect, AnyCockroachSelectQueryBuilder, AnyCockroachSetOperatorInterface, BuildAliasTable, CockroachCreateSetOperatorFn, CockroachSelect, CockroachSelectConfig, CockroachSelectCrossJoinFn, CockroachSelectDynamic, CockroachSelectHKT, CockroachSelectHKTBase, CockroachSelectJoin, CockroachSelectJoinConfig, CockroachSelectJoinFn, CockroachSelectKind, CockroachSelectPrepare, CockroachSelectQueryBuilder, CockroachSelectQueryBuilderHKT, CockroachSelectWithout, CockroachSetOperator, CockroachSetOperatorExcludedMethods, CockroachSetOperatorInterface, CockroachSetOperatorWithResult, CreateCockroachSelectFromBuilderMode, GetCockroachSetOperators, LockConfig, LockStrength, SelectedFields, SelectedFieldsFlat, SelectedFieldsOrdered, SetOperatorRestSelect, SetOperatorRightSelect, TableLikeHasEmptySelection };
//# sourceMappingURL=select.types.d.cts.map