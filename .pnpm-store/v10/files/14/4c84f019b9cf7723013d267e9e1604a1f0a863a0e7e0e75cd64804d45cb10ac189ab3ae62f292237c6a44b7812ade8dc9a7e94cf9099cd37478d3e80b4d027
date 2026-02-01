import { PgTable } from "../table.js";
import { PgDialect } from "../dialect.js";
import { PreparedQueryConfig } from "../session.js";
import { PgAsyncPreparedQuery, PgAsyncSession } from "../async/session.js";
import { entityKind } from "../../entity.js";
import { KnownKeysOnly } from "../../utils.js";
import { Query, SQLWrapper } from "../../sql/sql.js";
import * as V1 from "../../_relations.js";
import { QueryPromise } from "../../query-promise.js";
import { RunnableQuery } from "../../runnable-query.js";

//#region src/pg-core/query-builders/_query.d.ts
declare class _RelationalQueryBuilder<TSchema extends V1.TablesRelationalConfig, TFields extends V1.TableRelationalConfig> {
  private fullSchema;
  private schema;
  private tableNamesMap;
  private table;
  private tableConfig;
  private dialect;
  private session;
  static readonly [entityKind]: string;
  constructor(fullSchema: Record<string, unknown>, schema: TSchema, tableNamesMap: Record<string, string>, table: PgTable, tableConfig: V1.TableRelationalConfig, dialect: PgDialect, session: PgAsyncSession);
  findMany<TConfig extends V1.DBQueryConfig<'many', true, TSchema, TFields>>(config?: KnownKeysOnly<TConfig, V1.DBQueryConfig<'many', true, TSchema, TFields>>): _PgRelationalQuery<V1.BuildQueryResult<TSchema, TFields, TConfig>[]>;
  findFirst<TSelection extends Omit<V1.DBQueryConfig<'many', true, TSchema, TFields>, 'limit'>>(config?: KnownKeysOnly<TSelection, Omit<V1.DBQueryConfig<'many', true, TSchema, TFields>, 'limit'>>): _PgRelationalQuery<V1.BuildQueryResult<TSchema, TFields, TSelection> | undefined>;
}
declare class _PgRelationalQuery<TResult> extends QueryPromise<TResult> implements RunnableQuery<TResult, 'pg'>, SQLWrapper {
  private fullSchema;
  private schema;
  private tableNamesMap;
  private table;
  private tableConfig;
  private dialect;
  private session;
  private config;
  private mode;
  static readonly [entityKind]: string;
  readonly _: {
    readonly dialect: 'pg';
    readonly result: TResult;
  };
  constructor(fullSchema: Record<string, unknown>, schema: V1.TablesRelationalConfig, tableNamesMap: Record<string, string>, table: PgTable, tableConfig: V1.TableRelationalConfig, dialect: PgDialect, session: PgAsyncSession, config: V1.DBQueryConfig<'many', true> | true, mode: 'many' | 'first');
  prepare(name: string): PgAsyncPreparedQuery<PreparedQueryConfig & {
    execute: TResult;
  }>;
  private _getQuery;
  private _toSQL;
  toSQL(): Query;
  private authToken?;
  execute(): Promise<TResult>;
}
//#endregion
export { _PgRelationalQuery, _RelationalQueryBuilder };
//# sourceMappingURL=_query.d.ts.map