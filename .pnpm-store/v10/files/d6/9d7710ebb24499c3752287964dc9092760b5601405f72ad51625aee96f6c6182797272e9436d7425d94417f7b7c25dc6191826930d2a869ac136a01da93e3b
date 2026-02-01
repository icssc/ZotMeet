import { Table } from "../table.cjs";
import { AnyColumn, Column } from "../column.cjs";
import { entityKind } from "../entity.cjs";
import { SelectResult } from "../query-builders/select.types.cjs";
import { Subquery } from "../subquery.cjs";
import { Assume, Equal } from "../utils.cjs";
import { CasingCache } from "../casing.cjs";

//#region src/sql/sql.d.ts

/**
 * This class is used to indicate a primitive param value that is used in `sql` tag.
 * It is only used on type level and is never instantiated at runtime.
 * If you see a value of this type in the code, its runtime value is actually the primitive param value.
 */
declare class FakePrimitiveParam {
  static readonly [entityKind]: string;
}
type Chunk = string | Table | View | AnyColumn | Name | Param | Placeholder | SQL;
interface BuildQueryConfig {
  casing: CasingCache;
  escapeName(name: string): string;
  escapeParam(num: number, value: unknown): string;
  escapeString(str: string): string;
  prepareTyping?: (encoder: DriverValueEncoder<unknown, unknown>) => QueryTypingsValue;
  paramStartIndex?: {
    value: number;
  };
  inlineParams?: boolean;
  invokeSource?: 'indexes' | 'mssql-check' | 'mssql-view-with-schemabinding' | undefined;
}
type QueryTypingsValue = 'json' | 'decimal' | 'time' | 'timestamp' | 'uuid' | 'date' | 'none';
interface Query {
  sql: string;
  params: unknown[];
}
interface QueryWithTypings extends Query {
  typings?: QueryTypingsValue[];
}
/**
 * Any value that implements the `getSQL` method. The implementations include:
 * - `Table`
 * - `Column`
 * - `View`
 * - `Subquery`
 * - `SQL`
 * - `SQL.Aliased`
 * - `Placeholder`
 * - `Param`
 */
interface SQLWrapper<T = unknown> {
  getSQL(): SQL<T>;
  shouldOmitSQLParens?(): boolean;
}
declare function isSQLWrapper(value: unknown): value is SQLWrapper;
declare class StringChunk implements SQLWrapper {
  static readonly [entityKind]: string;
  readonly value: string[];
  constructor(value: string | string[]);
  getSQL(): SQL<unknown>;
}
declare class SQL<T = unknown> implements SQLWrapper<T> {
  readonly queryChunks: SQLChunk[];
  static readonly [entityKind]: string;
  _: {
    brand: 'SQL';
    type: T;
  };
  constructor(queryChunks: SQLChunk[]);
  append(query: SQL): this;
  toQuery(config: BuildQueryConfig): QueryWithTypings;
  buildQueryFromSourceParams(chunks: SQLChunk[], _config: BuildQueryConfig): Query;
  private mapInlineParam;
  getSQL(): SQL<T>;
  as(alias: string): SQL.Aliased<T>;
  /**
   * @deprecated
   * Use ``sql<DataType>`query`.as(alias)`` instead.
   */
  as<TData>(): SQL<TData>;
  /**
   * @deprecated
   * Use ``sql<DataType>`query`.as(alias)`` instead.
   */
  as<TData>(alias: string): SQL.Aliased<TData>;
  mapWith<TDecoder extends DriverValueDecoder<any, any> | DriverValueDecoder<any, any>['mapFromDriverValue']>(decoder: TDecoder): SQL<GetDecoderResult<TDecoder>>;
  inlineParams(): this;
  /**
   * This method is used to conditionally include a part of the query.
   *
   * @param condition - Condition to check
   * @returns itself if the condition is `true`, otherwise `undefined`
   */
  if(condition: any | undefined): this | undefined;
}
type GetDecoderResult<T> = T extends Column ? T['_']['data'] : T extends DriverValueDecoder<infer TData, any> | DriverValueDecoder<infer TData, any>['mapFromDriverValue'] ? TData : never;
/**
 * Any DB name (table, column, index etc.)
 */
declare class Name implements SQLWrapper {
  readonly value: string;
  static readonly [entityKind]: string;
  protected brand: 'Name';
  constructor(value: string);
  getSQL(): SQL<unknown>;
}
/**
 * Any DB name (table, column, index etc.)
 * @deprecated Use `sql.identifier` instead.
 */
declare function name(value: string): Name;
interface DriverValueDecoder<TData, TDriverParam> {
  mapFromDriverValue(value: TDriverParam): TData;
}
interface DriverValueEncoder<TData, TDriverParam> {
  mapToDriverValue(value: TData): TDriverParam | SQL;
}
declare function isDriverValueEncoder(value: unknown): value is DriverValueEncoder<any, any>;
declare const noopDecoder: DriverValueDecoder<any, any>;
declare const noopEncoder: DriverValueEncoder<any, any>;
interface DriverValueMapper<TData, TDriverParam> extends DriverValueDecoder<TData, TDriverParam>, DriverValueEncoder<TData, TDriverParam> {}
declare const noopMapper: DriverValueMapper<any, any>;
/** Parameter value that is optionally bound to an encoder (for example, a column). */
declare class Param<TDataType = unknown, TDriverParamType = TDataType> implements SQLWrapper {
  readonly value: TDataType;
  readonly encoder: DriverValueEncoder<TDataType, TDriverParamType>;
  static readonly [entityKind]: string;
  protected brand: 'BoundParamValue';
  /**
   * @param value - Parameter value
   * @param encoder - Encoder to convert the value to a driver parameter
   */
  constructor(value: TDataType, encoder?: DriverValueEncoder<TDataType, TDriverParamType>);
  getSQL(): SQL<unknown>;
}
/** @deprecated Use `sql.param` instead. */
declare function param<TData, TDriver>(value: TData, encoder?: DriverValueEncoder<TData, TDriver>): Param<TData, TDriver>;
/**
 * Anything that can be passed to the `` sql`...` `` tagged function.
 */
type SQLChunk = StringChunk | SQLChunk[] | SQLWrapper | SQL | Table | View | Subquery | AnyColumn | Param | Name | undefined | FakePrimitiveParam | Placeholder;
type SQLGenerator<T = unknown> = typeof sql<T>;
declare function sql<T>(strings: TemplateStringsArray, ...params: any[]): SQL<T>;
declare namespace sql {
  function empty(): SQL;
  /** @deprecated - use `sql.join()` */
  function fromList(list: SQLChunk[]): SQL;
  /**
   * Convenience function to create an SQL query from a raw string.
   * @param str The raw SQL query string.
   */
  function raw(str: string): SQL;
  /**
   * Join a list of SQL chunks with a separator.
   * @example
   * ```ts
   * const query = sql.join([sql`a`, sql`b`, sql`c`]);
   * // sql`abc`
   * ```
   * @example
   * ```ts
   * const query = sql.join([sql`a`, sql`b`, sql`c`], sql`, `);
   * // sql`a, b, c`
   * ```
   */
  function join(chunks: SQLChunk[], separator?: SQLChunk): SQL;
  /**
   * Create a SQL chunk that represents a DB identifier (table, column, index etc.).
   * When used in a query, the identifier will be escaped based on the DB engine.
   * For example, in PostgreSQL, identifiers are escaped with double quotes.
   *
   * **WARNING: This function does not offer any protection against SQL injections, so you must validate any user input beforehand.**
   *
   * @example ```ts
   * const query = sql`SELECT * FROM ${sql.identifier('my-table')}`;
   * // 'SELECT * FROM "my-table"'
   * ```
   */
  function identifier(value: string): Name;
  function placeholder<TName extends string>(name: TName): Placeholder<TName>;
  function param<TData, TDriver>(value: TData, encoder?: DriverValueEncoder<TData, TDriver>): Param<TData, TDriver>;
}
declare namespace SQL {
  class Aliased<T = unknown> implements SQLWrapper<T> {
    readonly sql: SQL<T>;
    readonly fieldAlias: string;
    static readonly [entityKind]: string;
    _: {
      brand: 'SQL.Aliased';
      type: T;
    };
    constructor(sql: SQL<T>, fieldAlias: string);
    getSQL(): SQL<T>;
  }
}
declare class Placeholder<TName extends string = string, TValue = any> implements SQLWrapper {
  readonly name: TName;
  static readonly [entityKind]: string;
  protected: TValue;
  constructor(name: TName);
  getSQL(): SQL;
}
/** @deprecated Use `sql.placeholder` instead. */
declare function placeholder<TName extends string>(name: TName): Placeholder<TName>;
declare function fillPlaceholders(params: unknown[], values: Record<string, unknown>): unknown[];
type ColumnsSelection = Record<string, unknown>;
declare abstract class View<TName extends string = string, TExisting extends boolean = boolean, TSelection extends ColumnsSelection = ColumnsSelection> {
  static readonly [entityKind]: string;
  _: {
    brand: 'View';
    viewBrand: string;
    name: TName;
    existing: TExisting;
    selectedFields: TSelection;
  };
  readonly $inferSelect: InferSelectViewModel<View<Assume<TName, string>, TExisting, TSelection>>;
  constructor({
    name,
    schema,
    selectedFields,
    query
  }: {
    name: TName;
    schema: string | undefined;
    selectedFields: ColumnsSelection;
    query: SQL | undefined;
  });
}
declare function isView(view: unknown): view is View;
declare function getViewName<T extends View>(view: T): T['_']['name'];
type InferSelectViewModel<TView extends View> = Equal<TView['_']['selectedFields'], {
  [x: string]: unknown;
}> extends true ? {
  [x: string]: unknown;
} : SelectResult<TView['_']['selectedFields'], 'single', Record<TView['_']['name'], 'not-null'>>;
type SQLEntity = SQL | SQLWrapper | SQL.Aliased | Table | View;
//#endregion
export { BuildQueryConfig, Chunk, ColumnsSelection, DriverValueDecoder, DriverValueEncoder, DriverValueMapper, FakePrimitiveParam, GetDecoderResult, InferSelectViewModel, Name, Param, Placeholder, Query, QueryTypingsValue, QueryWithTypings, SQL, SQLChunk, SQLEntity, SQLGenerator, SQLWrapper, StringChunk, View, fillPlaceholders, getViewName, isDriverValueEncoder, isSQLWrapper, isView, name, noopDecoder, noopEncoder, noopMapper, param, placeholder, sql };
//# sourceMappingURL=sql.d.cts.map