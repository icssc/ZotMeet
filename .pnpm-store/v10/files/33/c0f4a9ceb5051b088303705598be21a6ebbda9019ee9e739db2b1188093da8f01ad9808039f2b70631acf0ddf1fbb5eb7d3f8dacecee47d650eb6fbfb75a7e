import { CockroachTable } from "../table.cjs";
import { CockroachDialect } from "../dialect.cjs";
import { CockroachPreparedQuery, CockroachSession, PreparedQueryConfig } from "../session.cjs";
import { entityKind } from "../../entity.cjs";
import { Query, SQLWrapper } from "../../sql/sql.cjs";
import { KnownKeysOnly } from "../../utils.cjs";
import { BuildQueryResult, DBQueryConfig, TableRelationalConfig, TablesRelationalConfig } from "../../_relations.cjs";
import { QueryPromise } from "../../query-promise.cjs";
import { RunnableQuery } from "../../runnable-query.cjs";

//#region src/cockroach-core/query-builders/query.d.ts
declare class RelationalQueryBuilder<TSchema extends TablesRelationalConfig, TFields extends TableRelationalConfig> {
  private fullSchema;
  private schema;
  private tableNamesMap;
  private table;
  private tableConfig;
  private dialect;
  private session;
  static readonly [entityKind]: string;
  constructor(fullSchema: Record<string, unknown>, schema: TSchema, tableNamesMap: Record<string, string>, table: CockroachTable, tableConfig: TableRelationalConfig, dialect: CockroachDialect, session: CockroachSession);
  findMany<TConfig extends DBQueryConfig<'many', true, TSchema, TFields>>(config?: KnownKeysOnly<TConfig, DBQueryConfig<'many', true, TSchema, TFields>>): CockroachRelationalQuery<BuildQueryResult<TSchema, TFields, TConfig>[]>;
  findFirst<TSelection extends Omit<DBQueryConfig<'many', true, TSchema, TFields>, 'limit'>>(config?: KnownKeysOnly<TSelection, Omit<DBQueryConfig<'many', true, TSchema, TFields>, 'limit'>>): CockroachRelationalQuery<BuildQueryResult<TSchema, TFields, TSelection> | undefined>;
}
declare class CockroachRelationalQuery<TResult> extends QueryPromise<TResult> implements RunnableQuery<TResult, 'pg'>, SQLWrapper {
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
  constructor(fullSchema: Record<string, unknown>, schema: TablesRelationalConfig, tableNamesMap: Record<string, string>, table: CockroachTable, tableConfig: TableRelationalConfig, dialect: CockroachDialect, session: CockroachSession, config: DBQueryConfig<'many', true> | true, mode: 'many' | 'first');
  prepare(name: string): CockroachPreparedQuery<PreparedQueryConfig & {
    execute: TResult;
  }>;
  private _getQuery;
  private _toSQL;
  toSQL(): Query;
  private authToken?;
  execute(): Promise<TResult>;
}
//#endregion
export { CockroachRelationalQuery, RelationalQueryBuilder };
//# sourceMappingURL=query.d.cts.map