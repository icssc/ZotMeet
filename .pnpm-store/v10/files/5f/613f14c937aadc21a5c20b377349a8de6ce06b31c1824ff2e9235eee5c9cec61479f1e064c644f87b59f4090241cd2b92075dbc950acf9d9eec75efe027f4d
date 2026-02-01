import { PgSelectBase } from "./select.cjs";
import { SelectedFields as SelectedFields$1, SelectedFieldsFlat as SelectedFieldsFlat$1, SelectedFieldsOrdered as SelectedFieldsOrdered$1 } from "../../operations.cjs";
import { TypedQueryBuilder } from "../../query-builders/query-builder.cjs";
import { AppendToNullabilityMap, AppendToResult, BuildSubquerySelection, GetSelectTableName, JoinNullability, JoinType, MapColumnsToTableAlias, SelectMode, SelectResult, SetOperator } from "../../query-builders/select.types.cjs";
import { ColumnsSelection, Placeholder, SQL, SQLWrapper, View } from "../../sql/sql.cjs";
import { Subquery } from "../../subquery.cjs";
import { Table, UpdateTableConfig } from "../../table.cjs";
import { Assume, DrizzleTypeError, Equal, ValidateShape, ValueOrArray } from "../../utils.cjs";
import { PgColumn } from "../columns/index.cjs";
import { PgTable, PgTableWithColumns } from "../table.cjs";
import { PgViewBase } from "../view-base.cjs";
import { PgViewWithSelection } from "../view.cjs";

//#region src/pg-core/query-builders/select.types.d.ts
interface PgSelectJoinConfig {
  on: SQL | undefined;
  table: PgTable | Subquery | PgViewBase | SQL;
  alias: string | undefined;
  joinType: JoinType;
  lateral?: boolean;
}
type BuildAliasTable<TTable extends PgTable | View, TAlias extends string> = TTable extends Table ? PgTableWithColumns<UpdateTableConfig<TTable['_'], {
  name: TAlias;
  columns: MapColumnsToTableAlias<TTable['_']['columns'], TAlias, 'pg'>;
}>> : TTable extends View ? PgViewWithSelection<TAlias, TTable['_']['existing'], MapColumnsToTableAlias<TTable['_']['selectedFields'], TAlias, 'pg'>> : never;
interface PgSelectConfig {
  withList?: Subquery[];
  fields: Record<string, unknown>;
  fieldsFlat?: SelectedFieldsOrdered;
  where?: SQL;
  having?: SQL;
  table: PgTable | Subquery | PgViewBase | SQL;
  limit?: number | Placeholder;
  offset?: number | Placeholder;
  joins?: PgSelectJoinConfig[];
  orderBy?: (PgColumn | SQL | SQL.Aliased)[];
  groupBy?: (PgColumn | SQL | SQL.Aliased)[];
  lockingClause?: {
    strength: LockStrength;
    config: LockConfig;
  };
  distinct?: boolean | {
    on: (PgColumn | SQLWrapper)[];
  };
  setOperators: {
    rightSelect: TypedQueryBuilder<any, any>;
    type: SetOperator;
    isAll: boolean;
    orderBy?: (PgColumn | SQL | SQL.Aliased)[];
    limit?: number | Placeholder;
    offset?: number | Placeholder;
  }[];
}
type TableLikeHasEmptySelection<T extends PgTable | Subquery | PgViewBase | SQL> = T extends Subquery ? Equal<T['_']['selectedFields'], {}> extends true ? true : false : false;
type PgSelectJoin<T extends AnyPgSelectQueryBuilder, TDynamic extends boolean, TJoinType extends JoinType, TJoinedTable extends PgTable | Subquery | PgViewBase | SQL, TJoinedName extends GetSelectTableName<TJoinedTable> = GetSelectTableName<TJoinedTable>> = T extends any ? PgSelectWithout<PgSelectKind<T['_']['hkt'], T['_']['tableName'], AppendToResult<T['_']['tableName'], T['_']['selection'], TJoinedName, TJoinedTable extends Table ? TJoinedTable['_']['columns'] : TJoinedTable extends Subquery | View ? Assume<TJoinedTable['_']['selectedFields'], SelectedFields> : never, T['_']['selectMode']>, T['_']['selectMode'] extends 'partial' ? T['_']['selectMode'] : 'multiple', AppendToNullabilityMap<T['_']['nullabilityMap'], TJoinedName, TJoinType>, T['_']['dynamic'], T['_']['excludedMethods']>, TDynamic, T['_']['excludedMethods']> : never;
type PgSelectJoinFn<T extends AnyPgSelectQueryBuilder, TDynamic extends boolean, TJoinType extends JoinType, TIsLateral extends boolean> = <TJoinedTable extends (TIsLateral extends true ? Subquery | SQL : PgTable | Subquery | PgViewBase | SQL), TJoinedName extends GetSelectTableName<TJoinedTable> = GetSelectTableName<TJoinedTable>>(table: TableLikeHasEmptySelection<TJoinedTable> extends true ? DrizzleTypeError<"Cannot reference a data-modifying statement subquery if it doesn't contain a `returning` clause"> : TJoinedTable, on: ((aliases: T['_']['selection']) => SQL | undefined) | SQL | undefined) => PgSelectJoin<T, TDynamic, TJoinType, TJoinedTable, TJoinedName>;
type PgSelectCrossJoinFn<T extends AnyPgSelectQueryBuilder, TDynamic extends boolean, TIsLateral extends boolean> = <TJoinedTable extends (TIsLateral extends true ? Subquery | SQL : PgTable | Subquery | PgViewBase | SQL), TJoinedName extends GetSelectTableName<TJoinedTable> = GetSelectTableName<TJoinedTable>>(table: TableLikeHasEmptySelection<TJoinedTable> extends true ? DrizzleTypeError<"Cannot reference a data-modifying statement subquery if it doesn't contain a `returning` clause"> : TJoinedTable) => PgSelectJoin<T, TDynamic, 'cross', TJoinedTable, TJoinedName>;
type SelectedFieldsFlat = SelectedFieldsFlat$1<PgColumn>;
type SelectedFields = SelectedFields$1<PgColumn, PgTable>;
type SelectedFieldsOrdered = SelectedFieldsOrdered$1<PgColumn>;
type LockStrength = 'update' | 'no key update' | 'share' | 'key share';
type LockConfig = {
  of?: ValueOrArray<PgTable>;
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
interface PgSelectHKTBase {
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
type PgSelectKind<T extends PgSelectHKTBase, TTableName extends string | undefined, TSelection extends ColumnsSelection, TSelectMode extends SelectMode, TNullabilityMap extends Record<string, JoinNullability>, TDynamic extends boolean, TExcludedMethods extends string, TResult = SelectResult<TSelection, TSelectMode, TNullabilityMap>[], TSelectedFields = BuildSubquerySelection<TSelection, TNullabilityMap>> = (T & {
  tableName: TTableName;
  selection: TSelection;
  selectMode: TSelectMode;
  nullabilityMap: TNullabilityMap;
  dynamic: TDynamic;
  excludedMethods: TExcludedMethods;
  result: TResult;
  selectedFields: TSelectedFields;
})['_type'];
interface PgSelectQueryBuilderHKT extends PgSelectHKTBase {
  _type: PgSelectBase<PgSelectQueryBuilderHKT, this['tableName'], Assume<this['selection'], ColumnsSelection>, this['selectMode'], Assume<this['nullabilityMap'], Record<string, JoinNullability>>, this['dynamic'], this['excludedMethods'], Assume<this['result'], any[]>, Assume<this['selectedFields'], ColumnsSelection>>;
}
type PgSetOperatorExcludedMethods = 'leftJoin' | 'rightJoin' | 'innerJoin' | 'fullJoin' | 'where' | 'having' | 'groupBy' | 'for' | 'from';
type PgSelectWithout<T extends AnyPgSelectQueryBuilder, TDynamic extends boolean, K extends keyof T & string, TResetExcluded extends boolean = false> = TDynamic extends true ? T : Omit<PgSelectKind<T['_']['hkt'], T['_']['tableName'], T['_']['selection'], T['_']['selectMode'], T['_']['nullabilityMap'], TDynamic, TResetExcluded extends true ? K : T['_']['excludedMethods'] | K, T['_']['result'], T['_']['selectedFields']>, TResetExcluded extends true ? K : T['_']['excludedMethods'] | K>;
type PgSelectDynamic<T extends AnyPgSelectQueryBuilder> = PgSelectKind<T['_']['hkt'], T['_']['tableName'], T['_']['selection'], T['_']['selectMode'], T['_']['nullabilityMap'], true, never, T['_']['result'], T['_']['selectedFields']>;
type AnyPgSelectQueryBuilder = PgSelectBase<any, any, any, any, any, any, any, any, any>;
type AnyPgSetOperatorInterface = PgSetOperatorInterface<any, any, any, any, any, any, any, any>;
interface PgSetOperatorInterface<THKT extends PgSelectHKTBase, TTableName extends string | undefined, TSelection extends ColumnsSelection, TSelectMode extends SelectMode, TNullabilityMap extends Record<string, JoinNullability> = (TTableName extends string ? Record<TTableName, 'not-null'> : {}), TDynamic extends boolean = false, TExcludedMethods extends string = never, TResult extends any[] = SelectResult<TSelection, TSelectMode, TNullabilityMap>[], TSelectedFields extends ColumnsSelection = BuildSubquerySelection<TSelection, TNullabilityMap>> {
  _: {
    readonly hkt: THKT;
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
type PgSetOperatorWithResult<TResult extends any[]> = PgSetOperatorInterface<PgSelectQueryBuilderHKT, any, any, any, any, any, any, TResult, any>;
type PgSetOperator<TTableName extends string | undefined = string | undefined, TSelection extends ColumnsSelection = Record<string, any>, TSelectMode extends SelectMode = SelectMode, TNullabilityMap extends Record<string, JoinNullability> = Record<string, JoinNullability>> = PgSelectBase<PgSelectQueryBuilderHKT, TTableName, TSelection, TSelectMode, TNullabilityMap, true, PgSetOperatorExcludedMethods>;
type SetOperatorRightSelect<TValue extends PgSetOperatorWithResult<TResult>, TResult extends any[]> = TValue extends PgSetOperatorInterface<any, any, any, any, any, any, any, infer TValueResult, any> ? ValidateShape<TValueResult[number], TResult[number], TypedQueryBuilder<any, TValueResult>> : TValue;
type SetOperatorRestSelect<TValue extends readonly PgSetOperatorWithResult<TResult>[], TResult extends any[]> = TValue extends [infer First, ...infer Rest] ? First extends PgSetOperatorInterface<any, any, any, any, any, any, any, infer TValueResult, any> ? Rest extends AnyPgSetOperatorInterface[] ? [ValidateShape<TValueResult[number], TResult[number], TypedQueryBuilder<any, TValueResult>>, ...SetOperatorRestSelect<Rest, TResult>] : ValidateShape<TValueResult[number], TResult[number], TypedQueryBuilder<any, TValueResult>[]> : never : TValue;
type PgCreateSetOperatorFn = <THKT extends PgSelectHKTBase, TTableName extends string | undefined, TSelection extends ColumnsSelection, TSelectMode extends SelectMode, TValue extends PgSetOperatorWithResult<TResult>, TRest extends PgSetOperatorWithResult<TResult>[], TNullabilityMap extends Record<string, JoinNullability> = (TTableName extends string ? Record<TTableName, 'not-null'> : {}), TDynamic extends boolean = false, TExcludedMethods extends string = never, TResult extends any[] = SelectResult<TSelection, TSelectMode, TNullabilityMap>[], TSelectedFields extends ColumnsSelection = BuildSubquerySelection<TSelection, TNullabilityMap>>(leftSelect: PgSetOperatorInterface<THKT, TTableName, TSelection, TSelectMode, TNullabilityMap, TDynamic, TExcludedMethods, TResult, TSelectedFields>, rightSelect: SetOperatorRightSelect<TValue, TResult>, ...restSelects: SetOperatorRestSelect<TRest, TResult>) => PgSelectWithout<PgSelectBase<THKT, TTableName, TSelection, TSelectMode, TNullabilityMap, TDynamic, TExcludedMethods, TResult, TSelectedFields>, false, PgSetOperatorExcludedMethods, true>;
type GetPgSetOperators = {
  union: PgCreateSetOperatorFn;
  intersect: PgCreateSetOperatorFn;
  except: PgCreateSetOperatorFn;
  unionAll: PgCreateSetOperatorFn;
  intersectAll: PgCreateSetOperatorFn;
  exceptAll: PgCreateSetOperatorFn;
};
//#endregion
export { AnyPgSelectQueryBuilder, AnyPgSetOperatorInterface, BuildAliasTable, GetPgSetOperators, LockConfig, LockStrength, PgCreateSetOperatorFn, PgSelectConfig, PgSelectCrossJoinFn, PgSelectDynamic, PgSelectHKTBase, PgSelectJoin, PgSelectJoinConfig, PgSelectJoinFn, PgSelectKind, PgSelectQueryBuilderHKT, PgSelectWithout, PgSetOperator, PgSetOperatorExcludedMethods, PgSetOperatorInterface, PgSetOperatorWithResult, SelectedFields, SelectedFieldsFlat, SelectedFieldsOrdered, SetOperatorRestSelect, SetOperatorRightSelect, TableLikeHasEmptySelection };
//# sourceMappingURL=select.types.d.cts.map