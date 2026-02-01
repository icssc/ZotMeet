import { SQLiteDialect } from "../dialect.js";
import { SQLiteTable } from "../table.js";
import { PreparedQueryConfig, SQLitePreparedQuery, SQLiteSession } from "../session.js";
import { entityKind } from "../../entity.js";
import { KnownKeysOnly } from "../../utils.js";
import { Query, SQLWrapper } from "../../sql/sql.js";
import * as V1 from "../../_relations.js";
import { QueryPromise } from "../../query-promise.js";
import { RunnableQuery } from "../../runnable-query.js";

//#region src/sqlite-core/query-builders/_query.d.ts
type SQLiteRelationalQueryKind<TMode extends 'sync' | 'async', TResult> = TMode extends 'async' ? SQLiteRelationalQuery<TMode, TResult> : SQLiteSyncRelationalQuery<TResult>;
declare class _RelationalQueryBuilder<TMode extends 'sync' | 'async', TFullSchema extends Record<string, unknown>, TSchema extends V1.TablesRelationalConfig, TFields extends V1.TableRelationalConfig> {
  protected mode: TMode;
  protected fullSchema: Record<string, unknown>;
  protected schema: TSchema;
  protected tableNamesMap: Record<string, string>;
  protected table: SQLiteTable;
  protected tableConfig: V1.TableRelationalConfig;
  protected dialect: SQLiteDialect;
  protected session: SQLiteSession<'async', unknown, TFullSchema, any, TSchema>;
  static readonly [entityKind]: string;
  constructor(mode: TMode, fullSchema: Record<string, unknown>, schema: TSchema, tableNamesMap: Record<string, string>, table: SQLiteTable, tableConfig: V1.TableRelationalConfig, dialect: SQLiteDialect, session: SQLiteSession<'async', unknown, TFullSchema, any, TSchema>);
  findMany<TConfig extends V1.DBQueryConfig<'many', true, TSchema, TFields>>(config?: KnownKeysOnly<TConfig, V1.DBQueryConfig<'many', true, TSchema, TFields>>): SQLiteRelationalQueryKind<TMode, V1.BuildQueryResult<TSchema, TFields, TConfig>[]>;
  findFirst<TSelection extends Omit<V1.DBQueryConfig<'many', true, TSchema, TFields>, 'limit'>>(config?: KnownKeysOnly<TSelection, Omit<V1.DBQueryConfig<'many', true, TSchema, TFields>, 'limit'>>): SQLiteRelationalQueryKind<TMode, V1.BuildQueryResult<TSchema, TFields, TSelection> | undefined>;
}
declare class SQLiteRelationalQuery<TType extends 'sync' | 'async', TResult> extends QueryPromise<TResult> implements RunnableQuery<TResult, 'sqlite'>, SQLWrapper {
  private fullSchema;
  private schema;
  private tableNamesMap;
  private tableConfig;
  private dialect;
  private session;
  private config;
  static readonly [entityKind]: string;
  readonly _: {
    readonly dialect: 'sqlite';
    readonly type: TType;
    readonly result: TResult;
  };
  constructor(fullSchema: Record<string, unknown>, schema: V1.TablesRelationalConfig, tableNamesMap: Record<string, string>, /** @internal */
  table: SQLiteTable, tableConfig: V1.TableRelationalConfig, dialect: SQLiteDialect, session: SQLiteSession<'sync' | 'async', unknown, Record<string, unknown>, any, V1.TablesRelationalConfig>, config: V1.DBQueryConfig<'many', true> | true, mode: 'many' | 'first');
  prepare(): SQLitePreparedQuery<PreparedQueryConfig & {
    type: TType;
    all: TResult;
    get: TResult;
    execute: TResult;
  }>;
  private _toSQL;
  toSQL(): Query;
  execute(): Promise<TResult>;
}
declare class SQLiteSyncRelationalQuery<TResult> extends SQLiteRelationalQuery<'sync', TResult> {
  static readonly [entityKind]: string;
  sync(): TResult;
}
//#endregion
export { SQLiteRelationalQuery, SQLiteRelationalQueryKind, SQLiteSyncRelationalQuery, _RelationalQueryBuilder };
//# sourceMappingURL=_query.d.ts.map