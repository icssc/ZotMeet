import { MsSqlTable } from "../table.cjs";
import { MsSqlDialect } from "../dialect.cjs";
import { MsSqlSession, PreparedQueryConfig, PreparedQueryHKTBase, PreparedQueryKind } from "../session.cjs";
import { entityKind } from "../../entity.cjs";
import { Query } from "../../sql/sql.cjs";
import { KnownKeysOnly } from "../../utils.cjs";
import { BuildQueryResult, DBQueryConfig, TableRelationalConfig, TablesRelationalConfig } from "../../_relations.cjs";
import { QueryPromise } from "../../query-promise.cjs";

//#region src/mssql-core/query-builders/query.d.ts
declare class RelationalQueryBuilder<TPreparedQueryHKT extends PreparedQueryHKTBase, TSchema extends TablesRelationalConfig, TFields extends TableRelationalConfig> {
  private fullSchema;
  private schema;
  private tableNamesMap;
  private table;
  private tableConfig;
  private dialect;
  private session;
  static readonly [entityKind]: string;
  constructor(fullSchema: Record<string, unknown>, schema: TSchema, tableNamesMap: Record<string, string>, table: MsSqlTable, tableConfig: TableRelationalConfig, dialect: MsSqlDialect, session: MsSqlSession);
  findMany<TConfig extends DBQueryConfig<'many', true, TSchema, TFields>>(config?: KnownKeysOnly<TConfig, DBQueryConfig<'many', true, TSchema, TFields>>): MsSqlRelationalQuery<TPreparedQueryHKT, BuildQueryResult<TSchema, TFields, TConfig>[]>;
  findFirst<TSelection extends Omit<DBQueryConfig<'many', true, TSchema, TFields>, 'limit'>>(config?: KnownKeysOnly<TSelection, Omit<DBQueryConfig<'many', true, TSchema, TFields>, 'limit'>>): MsSqlRelationalQuery<TPreparedQueryHKT, BuildQueryResult<TSchema, TFields, TSelection> | undefined>;
}
declare class MsSqlRelationalQuery<TPreparedQueryHKT extends PreparedQueryHKTBase, TResult> extends QueryPromise<TResult> {
  private fullSchema;
  private schema;
  private tableNamesMap;
  private table;
  private tableConfig;
  private dialect;
  private session;
  private config;
  private queryMode;
  static readonly [entityKind]: string;
  protected $brand: 'MsSqlRelationalQuery';
  constructor(fullSchema: Record<string, unknown>, schema: TablesRelationalConfig, tableNamesMap: Record<string, string>, table: MsSqlTable, tableConfig: TableRelationalConfig, dialect: MsSqlDialect, session: MsSqlSession, config: DBQueryConfig<'many', true> | true, queryMode: 'many' | 'first');
  prepare(): PreparedQueryKind<TPreparedQueryHKT, PreparedQueryConfig & {
    execute: TResult;
  }, true>;
  private _getQuery;
  private _toSQL;
  toSQL(): Query;
  execute(): Promise<TResult>;
}
//#endregion
export { MsSqlRelationalQuery, RelationalQueryBuilder };
//# sourceMappingURL=query.d.cts.map