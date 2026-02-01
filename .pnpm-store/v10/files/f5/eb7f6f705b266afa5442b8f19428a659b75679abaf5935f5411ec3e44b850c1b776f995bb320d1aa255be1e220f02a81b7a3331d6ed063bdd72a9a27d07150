import { GelTable } from "../table.cjs";
import { GelDialect } from "../dialect.cjs";
import { GelPreparedQuery, GelSession, PreparedQueryConfig } from "../session.cjs";
import { entityKind } from "../../entity.cjs";
import { Query, SQLWrapper } from "../../sql/sql.cjs";
import { KnownKeysOnly } from "../../utils.cjs";
import { QueryPromise } from "../../query-promise.cjs";
import { RunnableQuery } from "../../runnable-query.cjs";
import { BuildQueryResult, DBQueryConfig, TableRelationalConfig, TablesRelationalConfig } from "../../relations.cjs";

//#region src/gel-core/query-builders/query.d.ts
declare class RelationalQueryBuilder<TSchema extends TablesRelationalConfig, TFields extends TableRelationalConfig> {
  private schema;
  private table;
  private tableConfig;
  private dialect;
  private session;
  static readonly [entityKind]: string;
  constructor(schema: TSchema, table: GelTable, tableConfig: TableRelationalConfig, dialect: GelDialect, session: GelSession);
  findMany<TConfig extends DBQueryConfig<'many', TSchema, TFields>>(config?: KnownKeysOnly<TConfig, DBQueryConfig<'many', TSchema, TFields>>): PgRelationalQuery<BuildQueryResult<TSchema, TFields, TConfig>[]>;
  findFirst<TConfig extends DBQueryConfig<'one', TSchema, TFields>>(config?: KnownKeysOnly<TConfig, DBQueryConfig<'one', TSchema, TFields>>): PgRelationalQuery<BuildQueryResult<TSchema, TFields, TConfig> | undefined>;
}
declare class PgRelationalQuery<TResult> extends QueryPromise<TResult> implements RunnableQuery<TResult, 'pg'>, SQLWrapper {
  private schema;
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
  constructor(schema: TablesRelationalConfig, table: GelTable, tableConfig: TableRelationalConfig, dialect: GelDialect, session: GelSession, config: DBQueryConfig<'many' | 'one'> | true, mode: 'many' | 'first');
  prepare(name: string): GelPreparedQuery<PreparedQueryConfig & {
    execute: TResult;
  }>;
  private _getQuery;
  private _toSQL;
  toSQL(): Query;
  private authToken?;
  execute(): Promise<TResult>;
}
//#endregion
export { PgRelationalQuery, RelationalQueryBuilder };
//# sourceMappingURL=query.d.cts.map