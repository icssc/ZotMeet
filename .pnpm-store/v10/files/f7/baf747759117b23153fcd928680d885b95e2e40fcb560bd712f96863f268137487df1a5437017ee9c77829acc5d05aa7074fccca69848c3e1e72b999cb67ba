import { entityKind } from "./entity.js";
import { CasingCache } from "./casing.js";
import { BinaryOperator, and, arrayContained, arrayContains, arrayOverlaps, between, exists, ilike, inArray, isNotNull, isNull, like, not, notBetween, notExists, notIlike, notInArray, notLike, or } from "./sql/expressions/conditions.js";
import { asc, desc } from "./sql/expressions/select.js";
import "./sql/expressions/index.js";
import { Assume, DrizzleTypeError, Equal, Simplify, ValueOrArray } from "./utils.js";
import { Placeholder, SQL, SQLWrapper, View, sql } from "./sql/sql.js";
import { AnyColumn, Column } from "./column.js";
import "./index.js";
import { Table } from "./table.js";

//#region src/relations.d.ts
type FilteredSchemaEntry = Table<any> | View<string, boolean, FieldSelection>;
type SchemaEntry = Table<any> | View<string, boolean, any>;
type Schema = Record<string, SchemaEntry>;
type GetTableViewColumns<T extends SchemaEntry> = T extends View<string, boolean, any> ? T['_']['selectedFields'] : T extends Table<any> ? T['_']['columns'] : never;
type GetTableViewFieldSelection<T extends SchemaEntry> = T extends View<string, boolean, FieldSelection> ? T['_']['selectedFields'] : T extends Table<any> ? T['_']['columns'] : never;
type FieldValue = Column<any> | SQLWrapper | SQL.Aliased | SQL;
type FieldSelection = Record<string, FieldValue>;
declare function processRelations(tablesConfig: TablesRelationalConfig, tables: Schema): TablesRelationalConfig;
/** Builds relational config for every table in schema */
declare function buildRelations<TTables extends Schema, TConfig extends AnyRelationsBuilderConfig>(tables: TTables, config: TConfig): ExtractTablesWithRelations<TConfig, TTables>;
/** Builds relational config only for tables present in relational config */
declare function buildRelationsParts<TTables extends Schema, TConfig extends AnyRelationsBuilderConfig>(tables: TTables, config: TConfig): ExtractTablesWithRelationsParts<TConfig, TTables>;
type RelationsRecord = Record<string, AnyRelation>;
type EmptyRelations = {};
type AnyRelations = TablesRelationalConfig;
declare abstract class Relation<TTargetTableName extends string = string> {
  readonly targetTableName: TTargetTableName;
  static readonly [entityKind]: string;
  readonly $brand: 'RelationV2';
  readonly relationType: 'many' | 'one';
  fieldName: string;
  sourceColumns: Column<any>[];
  targetColumns: Column<any>[];
  alias: string | undefined;
  where: AnyTableFilter | undefined;
  sourceTable: SchemaEntry;
  targetTable: SchemaEntry;
  through?: {
    source: RelationsBuilderColumnBase[];
    target: RelationsBuilderColumnBase[];
  };
  throughTable?: SchemaEntry;
  isReversed?: boolean;
  constructor(targetTable: SchemaEntry, targetTableName: TTargetTableName);
}
type AnyRelation = Relation<string>;
declare class One<TTargetTableName extends string, TOptional extends boolean = boolean> extends Relation<TTargetTableName> {
  static readonly [entityKind]: string;
  protected $relationBrand: 'OneV2';
  readonly relationType: "one";
  readonly optional: TOptional;
  constructor(tables: Schema, targetTable: SchemaEntry, targetTableName: TTargetTableName, config: AnyOneConfig | undefined);
}
type AnyOne = One<string, boolean>;
declare class Many<TTargetTableName extends string> extends Relation<TTargetTableName> {
  readonly config: AnyManyConfig | undefined;
  static readonly [entityKind]: string;
  protected $relationBrand: 'ManyV2';
  readonly relationType: "many";
  constructor(tables: Schema, targetTable: SchemaEntry, targetTableName: TTargetTableName, config: AnyManyConfig | undefined);
}
type AnyMany = Many<string>;
declare abstract class AggregatedField<T = unknown> implements SQLWrapper<T> {
  static readonly [entityKind]: string;
  readonly $brand: 'AggregatedField';
  readonly _: {
    readonly data: T;
  };
  protected table: SchemaEntry | undefined;
  onTable(table: SchemaEntry): this;
  abstract getSQL(): SQL<T>;
}
declare class Count extends AggregatedField<number> {
  static readonly [entityKind]: string;
  protected $aggregatedFieldBrand: 'Count';
  private query;
  getSQL(): SQL<number>;
}
type ExtractObjectValues<T> = T[keyof T];
declare const operators: {
  and: typeof and;
  between: typeof between;
  eq: BinaryOperator;
  exists: typeof exists;
  gt: BinaryOperator;
  gte: BinaryOperator;
  ilike: typeof ilike;
  inArray: typeof inArray;
  arrayContains: typeof arrayContains;
  arrayContained: typeof arrayContained;
  arrayOverlaps: typeof arrayOverlaps;
  isNull: typeof isNull;
  isNotNull: typeof isNotNull;
  like: typeof like;
  lt: BinaryOperator;
  lte: BinaryOperator;
  ne: BinaryOperator;
  not: typeof not;
  notBetween: typeof notBetween;
  notExists: typeof notExists;
  notLike: typeof notLike;
  notIlike: typeof notIlike;
  notInArray: typeof notInArray;
  or: typeof or;
  sql: typeof sql;
};
type Operators = typeof operators;
declare const orderByOperators: {
  sql: typeof sql;
  asc: typeof asc;
  desc: typeof desc;
};
type OrderByOperators = typeof orderByOperators;
declare function getOrderByOperators(): OrderByOperators;
type FindTargetTableInRelationalConfig<TConfig extends TablesRelationalConfig, TRelation extends AnyRelation> = TConfig[TRelation['targetTableName']];
interface SQLOperator {
  sql: Operators['sql'];
}
type DBQueryConfigColumns<TColumns extends FieldSelection> = { [K in keyof TColumns]?: boolean | undefined };
type DBQueryConfigExtras<TTable extends SchemaEntry> = Record<string, SQLWrapper | ((table: TTable, operators: SQLOperator) => SQLWrapper)>;
type DBQueryConfigOrderByCallback<TTable extends SchemaEntry> = (table: TTable, operators: OrderByOperators) => ValueOrArray<AnyColumn | SQL>;
type DBQueryConfigOrderByObject<TColumns extends FieldSelection> = { [K in keyof TColumns]?: 'asc' | 'desc' | undefined };
type DBQueryConfigOrderBy<TTable extends SchemaEntry, TColumns extends FieldSelection> = DBQueryConfigOrderByCallback<TTable> | DBQueryConfigOrderByObject<TColumns>;
type DBQueryConfigWith<TSchema extends TablesRelationalConfig, TRelations extends RelationsRecord> = { [K in keyof TRelations]?: boolean | (DBQueryConfig<TRelations[K]['relationType'], TSchema, FindTargetTableInRelationalConfig<TSchema, TRelations[K]>>) | undefined };
type DBQueryConfig<TRelationType extends 'one' | 'many' = 'one' | 'many', TSchema extends TablesRelationalConfig = TablesRelationalConfig, TTableConfig extends TableRelationalConfig = TableRelationalConfig> = (TTableConfig['relations'] extends Record<string, never> ? {} : {
  with?: DBQueryConfigWith<TSchema, TTableConfig['relations']> | undefined;
}) & {
  columns?: DBQueryConfigColumns<GetTableViewFieldSelection<TTableConfig['table']>> | undefined;
  where?: RelationsFilter<TTableConfig, TSchema> | undefined;
  extras?: DBQueryConfigExtras<TTableConfig['table']> | undefined;
  orderBy?: DBQueryConfigOrderBy<TTableConfig['table'], GetTableViewFieldSelection<TTableConfig['table']>> | undefined;
  offset?: number | Placeholder | undefined;
} & (TRelationType extends 'many' ? {
  limit?: number | Placeholder | undefined;
} : {});
type AnyDBQueryConfig = {
  columns?: DBQueryConfigColumns<GetTableViewFieldSelection<TableRelationalConfig['table']>> | undefined;
  where?: RelationsFilter<TableRelationalConfig, TablesRelationalConfig> | undefined;
  extras?: DBQueryConfigExtras<TableRelationalConfig['table']> | undefined;
  with?: Record<string, AnyDBQueryConfig> | undefined;
  orderBy?: DBQueryConfigOrderBy<TableRelationalConfig['table'], GetTableViewFieldSelection<TableRelationalConfig['table']>> | undefined;
  offset?: number | Placeholder | undefined;
  limit?: number | Placeholder | undefined;
};
interface TableRelationalConfig {
  table: SchemaEntry;
  name: string;
  relations: RelationsRecord;
}
type TablesRelationalConfig = Record<string, TableRelationalConfig>;
type ExtractTablesWithRelations<TConfig extends AnyRelationsBuilderConfig, TTables extends Schema> = { [K in keyof TTables]: {
  table: TTables[K];
  name: K & string;
  relations: TConfig extends { [CK in K]: Record<string, any> } ? TConfig[K] : {};
} };
type ExtractTablesWithRelationsParts<TConfig extends AnyRelationsBuilderConfig, TTables extends Schema> = { [K in NonUndefinedKeysOnly<TConfig> & keyof TTables]: {
  table: TTables[K & string];
  name: K & string;
  relations: TConfig[K] extends Record<string, any> ? TConfig[K] : {};
} };
type ReturnTypeOrValue<T> = T extends ((...args: any[]) => infer R) ? R : T;
type RelationResultKind<TResult, TInclude, TRelation extends AnyRelation> = TRelation extends AnyOne ? (TResult | (Equal<TRelation['optional'], true> extends true ? null : TInclude extends Record<string, unknown> ? TInclude['where'] extends Record<string, any> ? null : never : never)) : TResult[];
type BuildRelationResult<TConfig extends TablesRelationalConfig, TInclude, TRelations extends RelationsRecord> = { [K in TruthyKeysOnly<TInclude> & keyof TRelations]: TRelations[K] extends infer TRel extends AnyRelation ? RelationResultKind<BuildQueryResult<TConfig, FindTargetTableInRelationalConfig<TConfig, TRel>, Assume<TInclude[K], true | Record<string, unknown>>>, TInclude[K], TRel> : TRelations[K] extends AggregatedField<infer TData> ? TData : never };
type NonUndefinedKeysOnly<T> = { [K in keyof T]: T[K] extends undefined ? never : K }[keyof T];
type TruthyKeysOnly<T> = { [K in keyof T]: T[K] extends undefined | false ? never : K }[keyof T];
type InferRelationalQueryTableResult<TRawSelection extends Record<string, unknown>, TSelectedFields extends Record<string, unknown> | 'Full' = 'Full'> = TSelectedFields extends 'Full' ? TRawSelection : { [K in Equal<Exclude<TSelectedFields[keyof TSelectedFields & keyof TRawSelection], undefined>, false> extends true ? Exclude<keyof TRawSelection, NonUndefinedKeysOnly<TSelectedFields>> : { [K in keyof TSelectedFields]: Equal<TSelectedFields[K], true> extends true ? K : never }[keyof TSelectedFields] & keyof TRawSelection]: TRawSelection[K] };
type BuildQueryResult<TSchema extends TablesRelationalConfig, TTableConfig extends TableRelationalConfig, TFullSelection extends true | Record<string, unknown>, TModel extends Record<string, unknown> = Assume<TTableConfig['table'], {
  $inferSelect: Record<string, unknown>;
}>['$inferSelect']> = TFullSelection extends true | Record<string, never> ? TModel : TFullSelection extends Record<string, unknown> ? Simplify<(InferRelationalQueryTableResult<TModel, TFullSelection['columns'] extends Record<string, unknown> ? TFullSelection['columns'] : 'Full'>) & (TFullSelection['extras'] extends Record<string, SQLWrapper | ((...args: any[]) => SQLWrapper)> ? { [K in NonUndefinedKeysOnly<ReturnTypeOrValue<TFullSelection['extras']>>]: ReturnType<Assume<ReturnTypeOrValue<TFullSelection['extras'][K & string]>, SQLWrapper>['getSQL']>['_']['type'] } : {}) & (TFullSelection['with'] extends Record<string, unknown> ? BuildRelationResult<TSchema, TFullSelection['with'], TTableConfig['relations']> : {})> : never;
interface BuildRelationalQueryResult {
  selection: {
    key: string;
    field: Column<any> | Table | View | SQL | SQL.Aliased | SQLWrapper | AggregatedField;
    isArray?: boolean;
    selection?: BuildRelationalQueryResult['selection'];
    isOptional?: boolean;
  }[];
  sql: SQL;
}
declare function mapRelationalRow(row: Record<string, unknown>, buildQueryResultSelection: BuildRelationalQueryResult['selection'], mapColumnValue?: (value: unknown) => unknown, /** Needed for SQLite as it returns JSON values as strings */
parseJson?: boolean, /** Needed for SingleStore as it returns JSON arrays as strings */
parseJsonIfString?: boolean, path?: string): Record<string, unknown>;
declare class RelationsBuilderTable<TTableName$1 extends string = string> {
  static readonly [entityKind]: string;
  protected readonly _: {
    readonly name: TTableName$1;
    readonly table: SchemaEntry;
  };
  constructor(table: SchemaEntry, name: TTableName$1);
}
interface RelationsBuilderColumnConfig<TTableName$1 extends string = string> {
  readonly tableName: TTableName$1;
  readonly column: FieldValue;
  readonly through?: RelationsBuilderColumnBase;
  readonly key: string;
}
interface RelationsBuilderColumnBase<TTableName$1 extends string = string> {
  _: RelationsBuilderColumnConfig<TTableName$1>;
}
declare class RelationsBuilderColumn<TTableName$1 extends string = string> implements RelationsBuilderColumnBase<TTableName$1> {
  static readonly [entityKind]: string;
  readonly _: {
    readonly tableName: TTableName$1;
    readonly column: FieldValue;
    readonly key: string;
  };
  constructor(column: FieldValue, tableName: TTableName$1, key: string);
  through(column: RelationsBuilderColumn): RelationsBuilderJunctionColumn<TTableName$1>;
}
declare class RelationsBuilderJunctionColumn<TTableName$1 extends string = string> implements RelationsBuilderColumnBase<TTableName$1> {
  static readonly [entityKind]: string;
  readonly _: {
    readonly tableName: TTableName$1;
    readonly column: FieldValue;
    readonly through: RelationsBuilderColumnBase;
    readonly key: string;
  };
  constructor(column: FieldValue, tableName: TTableName$1, key: string, through: RelationsBuilderColumnBase);
}
interface RelationFieldsFilterInternals<T> {
  eq?: T | Placeholder | undefined;
  ne?: T | Placeholder | undefined;
  gt?: T | Placeholder | undefined;
  gte?: T | Placeholder | undefined;
  lt?: T | Placeholder | undefined;
  lte?: T | Placeholder | undefined;
  in?: (T | Placeholder)[] | Placeholder | undefined;
  notIn?: (T | Placeholder)[] | Placeholder | undefined;
  arrayContains?: (T extends Array<infer E> ? (E | Placeholder)[] : (T | Placeholder)[]) | Placeholder | undefined;
  arrayContained?: (T extends Array<infer E> ? (E | Placeholder)[] : (T | Placeholder)[]) | Placeholder | undefined;
  arrayOverlaps?: (T extends Array<infer E> ? (E | Placeholder)[] : (T | Placeholder)[]) | Placeholder | undefined;
  like?: string | Placeholder | undefined;
  ilike?: string | Placeholder | undefined;
  notLike?: string | Placeholder | undefined;
  notIlike?: string | Placeholder | undefined;
  isNull?: true | undefined;
  isNotNull?: true | undefined;
  NOT?: RelationsFieldFilter<T> | undefined;
  OR?: RelationsFieldFilter<T>[] | undefined;
  AND?: RelationsFieldFilter<T>[] | undefined;
}
type RelationsFieldFilter<T = unknown> = RelationFieldsFilterInternals<T> | (unknown extends T ? never : T extends object ? never : T) | Placeholder;
interface RelationsFilterCommons<TTable extends TableRelationalConfig = TableRelationalConfig, TSchema extends TablesRelationalConfig = TablesRelationalConfig> {
  OR?: RelationsFilter<TTable, TSchema>[] | undefined;
  NOT?: RelationsFilter<TTable, TSchema> | undefined;
  AND?: RelationsFilter<TTable, TSchema>[] | undefined;
  RAW?: SQLWrapper | ((table: TTable['table'], operators: Operators) => SQL) | undefined;
}
type RelationsFilterColumns<TColumns extends Record<string, unknown>> = { [K in keyof TColumns]?: (TColumns[K] extends {
  _: {
    data: infer Data;
  };
} ? RelationsFieldFilter<Data> : RelationsFieldFilter<unknown>) | undefined };
type RelationsFilterRelations<TTable extends TableRelationalConfig, TSchema extends TablesRelationalConfig, TRelations extends RelationsRecord = TTable['relations']> = { [K in keyof TRelations]?: boolean | RelationsFilter<FindTargetTableInRelationalConfig<TSchema, TRelations[K]>, TSchema> | undefined };
type RelationsFilter<TTable extends TableRelationalConfig, TSchema extends TablesRelationalConfig, TColumns extends FieldSelection = GetTableViewFieldSelection<TTable['table']>> = TTable['relations'] extends Record<string, never> ? TableFilter<TTable['table']> : RelationsFilterColumns<TColumns> & RelationsFilterRelations<TTable, TSchema> & RelationsFilterCommons<TTable, TSchema>;
interface TableFilterCommons<TTable extends SchemaEntry = SchemaEntry, TColumns extends Record<string, unknown> = GetTableViewColumns<TTable>> {
  OR?: TableFilter<TTable, TColumns>[] | undefined;
  NOT?: TableFilter<TTable, TColumns> | undefined;
  AND?: TableFilter<TTable, TColumns>[] | undefined;
  RAW?: SQLWrapper | ((table: TTable, operators: Operators) => SQL) | undefined;
}
type TableFilterColumns<TColumns extends Record<string, unknown>> = { [K in keyof TColumns]?: (TColumns[K] extends {
  _: {
    data: infer Data;
  };
} ? RelationsFieldFilter<Data> : RelationsFieldFilter<unknown>) | undefined };
type TableFilter<TTable extends SchemaEntry = SchemaEntry, TColumns extends Record<string, unknown> = GetTableViewColumns<TTable>> = TableFilterColumns<TColumns> & TableFilterCommons<TTable, TColumns>;
type AnyRelationsFilter = RelationsFilter<TableRelationalConfig, TablesRelationalConfig, FieldSelection>;
type AnyTableFilter = TableFilter<SchemaEntry, FieldSelection>;
interface OneConfig<TTargetTable extends SchemaEntry, TOptional extends boolean> {
  from?: RelationsBuilderColumnBase | [RelationsBuilderColumnBase, ...RelationsBuilderColumnBase[]];
  to?: RelationsBuilderColumnBase | [RelationsBuilderColumnBase, ...RelationsBuilderColumnBase[]];
  where?: TableFilter<TTargetTable>;
  optional?: TOptional;
  alias?: string;
}
type AnyOneConfig = OneConfig<SchemaEntry, boolean>;
interface ManyConfig<TTargetTable extends SchemaEntry> {
  from?: RelationsBuilderColumnBase | [RelationsBuilderColumnBase, ...RelationsBuilderColumnBase[]];
  to?: RelationsBuilderColumnBase | [RelationsBuilderColumnBase, ...RelationsBuilderColumnBase[]];
  where?: TableFilter<TTargetTable>;
  alias?: string;
}
type AnyManyConfig = ManyConfig<SchemaEntry>;
interface OneFn<TTargetTable extends SchemaEntry, TTargetTableName extends string> {
  <TOptional extends boolean = true>(config?: OneConfig<TTargetTable, TOptional>): One<TTargetTableName, TOptional>;
}
interface ManyFn<TTargetTable extends SchemaEntry, TTargetTableName extends string> {
  (config?: ManyConfig<TTargetTable>): Many<TTargetTableName>;
}
declare class RelationsHelperStatic<TTables extends Schema> {
  static readonly [entityKind]: string;
  private readonly _;
  constructor(tables: TTables);
  one: { [K in keyof TTables]: TTables[K] extends FilteredSchemaEntry ? OneFn<TTables[K], K & string> : DrizzleTypeError<'Views with nested selections are not supported by the relational query builder'> };
  many: { [K in keyof TTables]: TTables[K] extends FilteredSchemaEntry ? ManyFn<TTables[K], K & string> : DrizzleTypeError<'Views with nested selections are not supported by the relational query builder'> };
}
type RelationsBuilderColumns<TTable extends SchemaEntry, TTableName$1 extends string> = { [TColumnName in keyof GetTableViewColumns<TTable>]: RelationsBuilderColumn<TTableName$1> };
type RelationsBuilderTables<TSchema extends Schema> = { [TTableName in keyof TSchema]: TSchema[TTableName] extends FilteredSchemaEntry ? (RelationsBuilderColumns<TSchema[TTableName], TTableName & string> & RelationsBuilderTable<TTableName & string>) : DrizzleTypeError<'Views with nested selections are not supported by the relational query builder'> };
type RelationsBuilder<TSchema extends Schema> = RelationsBuilderTables<TSchema> & RelationsHelperStatic<TSchema>;
type RelationsBuilderConfigValue = RelationsRecord | undefined;
type RelationsBuilderConfig<TTables extends Schema> = { [TTableName in keyof TTables]?: RelationsBuilderConfigValue };
type AnyRelationsBuilderConfig = Record<string, RelationsBuilderConfigValue>;
type ExtractTablesFromSchema<TSchema extends Record<string, unknown>> = Assume<{ [K in keyof TSchema as TSchema[K] extends SchemaEntry ? K extends string ? K : never : never]: TSchema[K] }, Schema>;
declare function createRelationsHelper<TTables extends Schema>(tables: TTables): RelationsBuilder<TTables>;
declare function extractTablesFromSchema<TSchema extends Record<string, unknown>>(schema: TSchema): ExtractTablesFromSchema<TSchema>;
type IncludeEveryTable<TTables extends Schema> = { [K in keyof TTables]: {} };
/** Builds relational config for every table in schema */
declare function defineRelations<TSchema extends Record<string, unknown>, TTables extends Schema = ExtractTablesFromSchema<TSchema>>(schema: TSchema): ExtractTablesWithRelations<{}, TTables>;
/** Builds relational config for every table in schema */
declare function defineRelations<TSchema extends Record<string, unknown>, TConfig extends RelationsBuilderConfig<TTables>, TTables extends Schema = ExtractTablesFromSchema<TSchema>>(schema: TSchema, relations: (helpers: RelationsBuilder<TTables>) => TConfig): ExtractTablesWithRelations<TConfig, TTables>;
/** Builds relational config for every table in schema */
declare function defineRelationsPart<TSchema extends Record<string, unknown>, TTables extends Schema = ExtractTablesFromSchema<TSchema>>(schema: TSchema): ExtractTablesWithRelationsParts<IncludeEveryTable<TTables>, TTables>;
/** Builds relational config only for tables present in relational config */
declare function defineRelationsPart<TSchema extends Record<string, unknown>, TConfig extends RelationsBuilderConfig<TTables>, TTables extends Schema = ExtractTablesFromSchema<TSchema>>(schema: TSchema, relations: (helpers: RelationsBuilder<TTables>) => TConfig): ExtractTablesWithRelationsParts<TConfig, TTables>;
interface WithContainer {
  with?: Record<string, boolean | AnyDBQueryConfig | undefined>;
}
interface ColumnWithTSName {
  column: Table | View | Column<any> | SQL | SQLWrapper | SQL.Aliased;
  tsName: string;
}
type RelationsOrder<TColumns extends FieldSelection> = { [K in keyof TColumns]?: 'asc' | 'desc' };
type OrderBy = Exclude<AnyDBQueryConfig['orderBy'], undefined>;
type Extras = Exclude<AnyDBQueryConfig['extras'], undefined>;
declare function relationsFilterToSQL(table: SchemaEntry, filter: AnyRelationsFilter | AnyTableFilter): SQL | undefined;
declare function relationsFilterToSQL(table: SchemaEntry, filter: AnyRelationsFilter | AnyTableFilter, tableRelations: RelationsRecord, tablesRelations: TablesRelationalConfig, casing: CasingCache, depth?: number): SQL | undefined;
declare function relationsOrderToSQL(table: SchemaEntry, orders: OrderBy): SQL | undefined;
declare function relationExtrasToSQL(table: SchemaEntry, extras: Extras): {
  sql: SQL<unknown> | undefined;
  selection: {
    key: string;
    field: Column<any> | Table | View | SQL | SQL.Aliased | SQLWrapper | AggregatedField;
    isArray?: boolean;
    selection?: BuildRelationalQueryResult["selection"];
    isOptional?: boolean;
  }[];
};
interface BuiltRelationFilters {
  filter?: SQL;
  joinCondition?: SQL;
}
declare function relationToSQL(casing: CasingCache, relation: Relation, sourceTable: SchemaEntry, targetTable: SchemaEntry, throughTable?: SchemaEntry): BuiltRelationFilters;
declare function getTableAsAliasSQL(table: SchemaEntry): SQL<unknown>;
//#endregion
export { AggregatedField, AnyDBQueryConfig, AnyMany, AnyManyConfig, AnyOne, AnyOneConfig, AnyRelation, AnyRelations, AnyRelationsBuilderConfig, AnyRelationsFilter, AnyTableFilter, BuildQueryResult, BuildRelationResult, BuildRelationalQueryResult, BuiltRelationFilters, ColumnWithTSName, Count, DBQueryConfig, DBQueryConfigColumns, DBQueryConfigExtras, DBQueryConfigOrderBy, DBQueryConfigOrderByCallback, DBQueryConfigOrderByObject, DBQueryConfigWith, EmptyRelations, ExtractObjectValues, ExtractTablesFromSchema, ExtractTablesWithRelations, ExtractTablesWithRelationsParts, Extras, FieldSelection, FieldValue, FilteredSchemaEntry, FindTargetTableInRelationalConfig, GetTableViewColumns, GetTableViewFieldSelection, IncludeEveryTable, InferRelationalQueryTableResult, Many, ManyConfig, ManyFn, NonUndefinedKeysOnly, One, OneConfig, OneFn, Operators, OrderBy, OrderByOperators, Relation, RelationFieldsFilterInternals, RelationResultKind, RelationsBuilder, RelationsBuilderColumn, RelationsBuilderColumnBase, RelationsBuilderColumnConfig, RelationsBuilderColumns, RelationsBuilderConfig, RelationsBuilderConfigValue, RelationsBuilderJunctionColumn, RelationsBuilderTable, RelationsBuilderTables, RelationsFieldFilter, RelationsFilter, RelationsFilterColumns, RelationsFilterCommons, RelationsFilterRelations, RelationsHelperStatic, RelationsOrder, RelationsRecord, ReturnTypeOrValue, SQLOperator, Schema, SchemaEntry, TableFilter, TableFilterColumns, TableFilterCommons, TableRelationalConfig, TablesRelationalConfig, TruthyKeysOnly, WithContainer, buildRelations, buildRelationsParts, createRelationsHelper, defineRelations, defineRelationsPart, extractTablesFromSchema, getOrderByOperators, getTableAsAliasSQL, mapRelationalRow, operators, orderByOperators, processRelations, relationExtrasToSQL, relationToSQL, relationsFilterToSQL, relationsOrderToSQL };
//# sourceMappingURL=relations.d.ts.map