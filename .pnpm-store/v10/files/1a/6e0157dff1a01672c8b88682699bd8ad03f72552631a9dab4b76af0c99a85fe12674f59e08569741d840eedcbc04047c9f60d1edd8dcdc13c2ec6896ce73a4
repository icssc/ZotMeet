import { SQLiteDialect } from "../dialect.cjs";
import { SQLiteTable } from "../table.cjs";
import { PreparedQueryConfig, SQLitePreparedQuery, SQLiteSession } from "../session.cjs";
import { entityKind } from "../../entity.cjs";
import { Query, SQLWrapper } from "../../sql/sql.cjs";
import { KnownKeysOnly } from "../../utils.cjs";
import { QueryPromise } from "../../query-promise.cjs";
import { RunnableQuery } from "../../runnable-query.cjs";
import { BuildQueryResult, DBQueryConfig, TableRelationalConfig, TablesRelationalConfig } from "../../relations.cjs";

//#region src/sqlite-core/query-builders/query.d.ts
type SQLiteRelationalQueryKind<TMode extends 'sync' | 'async', TResult> = TMode extends 'async' ? SQLiteRelationalQuery<TMode, TResult> : SQLiteSyncRelationalQuery<TResult>;
declare class RelationalQueryBuilder<TMode extends 'sync' | 'async', TSchema extends TablesRelationalConfig, TFields extends TableRelationalConfig> {
  private mode;
  private schema;
  private table;
  private tableConfig;
  private dialect;
  private session;
  private rowMode?;
  private forbidJsonb?;
  static readonly [entityKind]: string;
  constructor(mode: TMode, schema: TSchema, table: SQLiteTable, tableConfig: TableRelationalConfig, dialect: SQLiteDialect, session: SQLiteSession<any, any, any, any, any>, rowMode?: boolean | undefined, forbidJsonb?: boolean | undefined);
  findMany<TConfig extends DBQueryConfig<'many', TSchema, TFields>>(config?: KnownKeysOnly<TConfig, DBQueryConfig<'many', TSchema, TFields>>): SQLiteRelationalQueryKind<TMode, BuildQueryResult<TSchema, TFields, TConfig>[]>;
  findFirst<TConfig extends DBQueryConfig<'one', TSchema, TFields>>(config?: KnownKeysOnly<TConfig, DBQueryConfig<'one', TSchema, TFields>>): SQLiteRelationalQueryKind<TMode, BuildQueryResult<TSchema, TFields, TConfig> | undefined>;
}
declare class SQLiteRelationalQuery<TType extends 'sync' | 'async', TResult> extends QueryPromise<TResult> implements RunnableQuery<TResult, 'sqlite'>, SQLWrapper {
  private schema;
  private tableConfig;
  private dialect;
  private session;
  private config;
  private rowMode?;
  private forbidJsonb?;
  static readonly [entityKind]: string;
  readonly _: {
    readonly dialect: 'sqlite';
    readonly type: TType;
    readonly result: TResult;
  };
  constructor(schema: TablesRelationalConfig, table: SQLiteTable, tableConfig: TableRelationalConfig, dialect: SQLiteDialect, session: SQLiteSession<TType, any, any, any, any>, config: DBQueryConfig<'many' | 'one'> | true, mode: 'many' | 'first', rowMode?: boolean | undefined, forbidJsonb?: boolean | undefined);
  prepare(): SQLitePreparedQuery<PreparedQueryConfig & {
    type: TType;
    all: TResult;
    get: TResult;
    execute: TResult;
  }>;
  private _getQuery;
  private _toSQL;
  toSQL(): Query;
  execute(): Promise<TResult>;
}
declare class SQLiteSyncRelationalQuery<TResult> extends SQLiteRelationalQuery<'sync', TResult> {
  static readonly [entityKind]: string;
  sync(): TResult;
}
//#endregion
export { RelationalQueryBuilder, SQLiteRelationalQuery, SQLiteRelationalQueryKind, SQLiteSyncRelationalQuery };
//# sourceMappingURL=query.d.cts.map