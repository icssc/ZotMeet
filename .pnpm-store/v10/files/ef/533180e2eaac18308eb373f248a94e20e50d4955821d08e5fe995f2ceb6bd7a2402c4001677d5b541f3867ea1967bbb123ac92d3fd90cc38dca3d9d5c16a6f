import { CockroachColumn, ExtraConfigColumn } from "./cockroach-core/columns/common.js";
import "./cockroach-core/index.js";
import { GelColumn, GelExtraConfigColumn } from "./gel-core/columns/common.js";
import "./gel-core/index.js";
import { MsSqlColumn } from "./mssql-core/columns/common.js";
import "./mssql-core/index.js";
import { MySqlColumn } from "./mysql-core/columns/common.js";
import "./mysql-core/index.js";
import { PgSequenceOptions } from "./pg-core/sequence.js";
import { ExtraConfigColumn as ExtraConfigColumn$1, PgColumn } from "./pg-core/columns/common.js";
import "./pg-core/index.js";
import { SingleStoreColumn } from "./singlestore-core/columns/common.js";
import "./singlestore-core/index.js";
import { Assume } from "./utils.js";
import { SQL } from "./sql/sql.js";
import { SQLiteColumn } from "./sqlite-core/columns/common.js";
import "./sqlite-core/index.js";
import { Column, ColumnBaseConfig } from "./column.js";
import { entityKind } from "./entity.js";

//#region src/column-builder.d.ts
type ColumnDataType = 'array' | 'bigint' | 'boolean' | 'custom' | 'number' | 'object' | 'string';
type ColumnDataArrayConstraint = 'vector' | 'int64vector' | 'halfvector' | 'basecolumn' | 'point' | 'geometry' | 'line';
type ColumnDataBigIntConstraint = 'int64' | 'uint64';
type ColumnDataNumberConstraint = 'double' | 'float' | 'int8' | 'int16' | 'int24' | 'int32' | 'int53' | 'udouble' | 'ufloat' | 'uint8' | 'uint16' | 'uint24' | 'uint32' | 'uint53' | 'unsigned' | 'year';
type ColumnDataObjectConstraint = 'buffer' | 'date' | 'geometry' | 'json' | 'line' | 'point' | 'dateDuration' | 'duration' | 'localDate' | 'localDateTime' | 'localTime' | 'relDuration';
type ColumnDataStringConstraint = 'binary' | 'cidr' | 'date' | 'datetime' | 'enum' | 'inet' | 'int64' | 'interval' | 'macaddr' | 'macaddr8' | 'numeric' | 'sparsevec' | 'time' | 'timestamp' | 'uint64' | 'unumeric' | 'uuid';
type ColumnDataConstraint = ColumnDataArrayConstraint | ColumnDataBigIntConstraint | ColumnDataNumberConstraint | ColumnDataObjectConstraint | ColumnDataStringConstraint;
type ColumnType = ColumnDataType | `array ${ColumnDataArrayConstraint}` | `bigint ${ColumnDataBigIntConstraint}` | `number ${ColumnDataNumberConstraint}` | `object ${ColumnDataObjectConstraint}` | `string ${ColumnDataStringConstraint}`;
interface ColumnTypeData<TType extends ColumnDataType = ColumnDataType, TConstraint extends ColumnDataConstraint | undefined = ColumnDataConstraint | undefined> {
  type: TType;
  constraint: TConstraint;
}
type ExtractColumnTypeData<T extends ColumnType> = T extends `${infer Type extends ColumnDataType} ${infer Constraint extends ColumnDataConstraint}` ? ColumnTypeData<Type, Constraint> : ColumnTypeData<Assume<T, ColumnDataType>, undefined>;
declare function extractExtendedColumnType<TColumn extends Column>(column: TColumn): ExtractColumnTypeData<TColumn['_']['dataType']>;
type Dialect = 'pg' | 'mysql' | 'sqlite' | 'singlestore' | 'mssql' | 'common' | 'gel' | 'cockroach';
type GeneratedStorageMode = 'virtual' | 'stored' | 'persisted';
type GeneratedType = 'always' | 'byDefault';
interface GeneratedColumnConfig<TDataType> {
  as: TDataType | SQL | (() => SQL);
  type?: GeneratedType;
  mode?: GeneratedStorageMode;
}
interface GeneratedIdentityConfig {
  sequenceName?: string;
  sequenceOptions?: PgSequenceOptions;
  type: 'always' | 'byDefault';
}
interface ColumnBuilderBaseConfig<TDataType extends ColumnType> {
  dataType: TDataType;
  data: unknown;
  driverParam: unknown;
  notNull?: boolean;
  hasDefault?: boolean;
}
type MakeColumnConfig<T extends ColumnBuilderBaseConfig<ColumnType>, TTableName extends string, TDialect extends Dialect = 'common', TData = (T extends {
  $type: infer U;
} ? U : T['data'])> = {
  name: string;
  tableName: TTableName;
  dataType: T['dataType'];
  data: TData;
  driverParam: T['driverParam'];
  notNull: T['notNull'] extends true ? true : false;
  hasDefault: T['hasDefault'] extends true ? true : false;
  isPrimaryKey: T extends {
    isPrimaryKey: true;
  } ? true : false;
  isAutoincrement: T extends {
    isAutoincrement: true;
  } ? true : false;
  hasRuntimeDefault: T extends {
    hasRuntimeDefault: true;
  } ? true : false;
  enumValues: T extends {
    enumValues: [string, ...string[]];
  } ? T['enumValues'] : undefined;
  baseColumn: T extends {
    baseBuilder: infer U extends ColumnBuilderBase;
  } ? BuildColumn<TTableName, U, TDialect> : never;
  identity: T extends {
    identity: 'always';
  } ? 'always' : T extends {
    identity: 'byDefault';
  } ? 'byDefault' : undefined;
  generated: T extends {
    generated: infer G;
  } ? unknown extends G ? undefined : G extends undefined ? undefined : G : undefined;
} & {};
interface ColumnBuilderRuntimeConfig<TData> {
  name: string;
  keyAsName: boolean;
  notNull: boolean;
  default: TData | SQL | undefined;
  defaultFn: (() => TData | SQL) | undefined;
  onUpdateFn: (() => TData | SQL) | undefined;
  hasDefault: boolean;
  primaryKey: boolean;
  isUnique: boolean;
  uniqueName: string | undefined;
  uniqueType: string | undefined;
  dataType: string;
  columnType: string;
  generated: GeneratedColumnConfig<TData> | undefined;
  generatedIdentity: GeneratedIdentityConfig | undefined;
}
interface ColumnBuilderExtraConfig {
  primaryKeyHasDefault?: boolean;
}
type NotNull<T> = T & {
  _: {
    notNull: true;
  };
};
type HasDefault<T> = T & {
  _: {
    hasDefault: true;
  };
};
type IsPrimaryKey<T> = T & {
  _: {
    isPrimaryKey: true;
    notNull: true;
  };
};
type IsAutoincrement<T> = T & {
  _: {
    isAutoincrement: true;
  };
};
type HasRuntimeDefault<T> = T & {
  _: {
    hasRuntimeDefault: true;
  };
};
type $Type<T, TType> = T & {
  _: {
    $type: TType;
  };
};
type HasGenerated<T, TGenerated = {}> = T & {
  _: {
    hasDefault: true;
    generated: TGenerated;
  };
};
type IsIdentity<T, TType extends 'always' | 'byDefault'> = T & {
  _: {
    notNull: true;
    hasDefault: true;
    identity: TType;
  };
};
interface ColumnBuilderBase<out T extends ColumnBuilderBaseConfig<ColumnType> = ColumnBuilderBaseConfig<ColumnType>> {
  _: T;
}
declare abstract class ColumnBuilder<out T extends ColumnBuilderBaseConfig<ColumnType>, TRuntimeConfig extends object = object, TExtraConfig extends ColumnBuilderExtraConfig = ColumnBuilderExtraConfig> implements ColumnBuilderBase<T> {
  static readonly [entityKind]: string;
  _: T;
  constructor(name: string, dataType: ColumnType, columnType: string);
  /**
   * Changes the data type of the column. Commonly used with `json` columns. Also, useful for branded types.
   *
   * @example
   * ```ts
   * const users = pgTable('users', {
   * 	id: integer('id').$type<UserId>().primaryKey(),
   * 	details: json('details').$type<UserDetails>().notNull(),
   * });
   * ```
   */
  $type<TType>(): $Type<this, TType>;
  /**
   * Adds a `not null` clause to the column definition.
   *
   * Affects the `select` model of the table - columns *without* `not null` will be nullable on select.
   */
  notNull(): NotNull<this>;
  /**
   * Adds a `default <value>` clause to the column definition.
   *
   * Affects the `insert` model of the table - columns *with* `default` are optional on insert.
   *
   * If you need to set a dynamic default value, use {@link $defaultFn} instead.
   */
  default(value: (this['_'] extends {
    $type: infer U;
  } ? U : this['_']['data']) | SQL): HasDefault<this>;
  /**
   * Adds a dynamic default value to the column.
   * The function will be called when the row is inserted, and the returned value will be used as the column value.
   *
   * **Note:** This value does not affect the `drizzle-kit` behavior, it is only used at runtime in `drizzle-orm`.
   */
  $defaultFn(fn: () => (this['_'] extends {
    $type: infer U;
  } ? U : this['_']['data']) | SQL): HasRuntimeDefault<HasDefault<this>>;
  /**
   * Alias for {@link $defaultFn}.
   */
  $default: (fn: () => (this["_"] extends {
    $type: infer U;
  } ? U : this["_"]["data"]) | SQL) => HasRuntimeDefault<HasDefault<this>>;
  /**
   * Adds a dynamic update value to the column.
   * The function will be called when the row is updated, and the returned value will be used as the column value if none is provided.
   * If no `default` (or `$defaultFn`) value is provided, the function will be called when the row is inserted as well, and the returned value will be used as the column value.
   *
   * **Note:** This value does not affect the `drizzle-kit` behavior, it is only used at runtime in `drizzle-orm`.
   */
  $onUpdateFn(fn: () => (this['_'] extends {
    $type: infer U;
  } ? U : this['_']['data']) | SQL): HasDefault<this>;
  /**
   * Alias for {@link $onUpdateFn}.
   */
  $onUpdate: (fn: () => (this["_"] extends {
    $type: infer U;
  } ? U : this["_"]["data"]) | SQL) => HasDefault<this>;
  /**
   * Adds a `primary key` clause to the column definition. This implicitly makes the column `not null`.
   *
   * In SQLite, `integer primary key` implicitly makes the column auto-incrementing.
   */
  primaryKey(): TExtraConfig['primaryKeyHasDefault'] extends true ? IsPrimaryKey<HasDefault<this>> : IsPrimaryKey<this>;
  abstract generatedAlwaysAs(as: SQL | T['data'] | (() => SQL), config?: Partial<GeneratedColumnConfig<unknown>>): HasGenerated<this, {
    type: 'always';
  }>;
}
type BuildColumn<TTableName extends string, TBuilder extends ColumnBuilderBase, TDialect extends Dialect, TBuiltConfig extends ColumnBaseConfig<ColumnType> = MakeColumnConfig<TBuilder['_'], TTableName, TDialect>> = TDialect extends 'mysql' ? MySqlColumn<TBuiltConfig, {}> : TDialect extends 'mssql' ? MsSqlColumn<TBuiltConfig, {}> : TDialect extends 'sqlite' ? SQLiteColumn<TBuiltConfig, {}> : TDialect extends 'singlestore' ? SingleStoreColumn<TBuiltConfig, {}> : TDialect extends 'gel' ? GelColumn<TBuiltConfig, {}> : TDialect extends 'cockroach' ? CockroachColumn<TBuiltConfig, {}> : TDialect extends 'common' ? Column<TBuiltConfig, {}> : never;
type BuildIndexColumn<TDialect extends Dialect> = TDialect extends 'pg' ? ExtraConfigColumn$1 : TDialect extends 'cockroach' ? ExtraConfigColumn : TDialect extends 'gel' ? GelExtraConfigColumn : never;
type BuildColumns<TTableName extends string, TConfigMap extends Record<string, ColumnBuilderBase>, TDialect extends Dialect> = { [Key in keyof TConfigMap]: BuildColumn<TTableName, TConfigMap[Key], TDialect> } & {};
type BuildExtraConfigColumns<_TTableName extends string, TConfigMap extends Record<string, ColumnBuilderBase>, TDialect extends Dialect> = { [Key in keyof TConfigMap]: BuildIndexColumn<TDialect> } & {};
type ChangeColumnTableName<TColumn extends Column, TAlias extends string, TDialect extends Dialect> = TDialect extends 'pg' ? PgColumn<TColumn['_']['dataType'], Omit<TColumn['_'], 'tableName'> & {
  tableName: TAlias;
  insertType: unknown;
}> : TDialect extends 'mysql' ? MySqlColumn<MakeColumnConfig<TColumn['_'], TAlias>> : TDialect extends 'singlestore' ? SingleStoreColumn<MakeColumnConfig<TColumn['_'], TAlias>> : TDialect extends 'sqlite' ? SQLiteColumn<MakeColumnConfig<TColumn['_'], TAlias>> : TDialect extends 'gel' ? GelColumn<MakeColumnConfig<TColumn['_'], TAlias>> : TDialect extends 'mssql' ? MsSqlColumn<MakeColumnConfig<TColumn['_'], TAlias>> : TDialect extends 'cockroach' ? CockroachColumn<MakeColumnConfig<TColumn['_'], TAlias>> : never;
//#endregion
export { $Type, BuildColumn, BuildColumns, BuildExtraConfigColumns, BuildIndexColumn, ChangeColumnTableName, ColumnBuilder, ColumnBuilderBase, ColumnBuilderBaseConfig, ColumnBuilderExtraConfig, ColumnBuilderRuntimeConfig, ColumnDataArrayConstraint, ColumnDataBigIntConstraint, ColumnDataConstraint, ColumnDataNumberConstraint, ColumnDataObjectConstraint, ColumnDataStringConstraint, ColumnDataType, ColumnType, ColumnTypeData, Dialect, ExtractColumnTypeData, GeneratedColumnConfig, GeneratedIdentityConfig, GeneratedStorageMode, GeneratedType, HasDefault, HasGenerated, HasRuntimeDefault, IsAutoincrement, IsIdentity, IsPrimaryKey, MakeColumnConfig, NotNull, extractExtendedColumnType };
//# sourceMappingURL=column-builder.d.ts.map