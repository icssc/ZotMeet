import { MySqlTable } from "../table.js";
import { MySqlDialect } from "../dialect.js";
import { Mode, MySqlPreparedQueryConfig, MySqlSession, PreparedQueryHKTBase, PreparedQueryKind } from "../session.js";
import { entityKind } from "../../entity.js";
import { KnownKeysOnly } from "../../utils.js";
import { Query } from "../../sql/sql.js";
import * as V1 from "../../_relations.js";
import { QueryPromise } from "../../query-promise.js";

//#region src/mysql-core/query-builders/_query.d.ts
declare class _RelationalQueryBuilder<TPreparedQueryHKT extends PreparedQueryHKTBase, TSchema extends V1.TablesRelationalConfig, TFields extends V1.TableRelationalConfig> {
  private fullSchema;
  private schema;
  private tableNamesMap;
  private table;
  private tableConfig;
  private dialect;
  private session;
  private mode;
  static readonly [entityKind]: string;
  constructor(fullSchema: Record<string, unknown>, schema: TSchema, tableNamesMap: Record<string, string>, table: MySqlTable, tableConfig: V1.TableRelationalConfig, dialect: MySqlDialect, session: MySqlSession, mode: Mode);
  findMany<TConfig extends V1.DBQueryConfig<'many', true, TSchema, TFields>>(config?: KnownKeysOnly<TConfig, V1.DBQueryConfig<'many', true, TSchema, TFields>>): MySqlRelationalQuery<TPreparedQueryHKT, V1.BuildQueryResult<TSchema, TFields, TConfig>[]>;
  findFirst<TSelection extends Omit<V1.DBQueryConfig<'many', true, TSchema, TFields>, 'limit'>>(config?: KnownKeysOnly<TSelection, Omit<V1.DBQueryConfig<'many', true, TSchema, TFields>, 'limit'>>): MySqlRelationalQuery<TPreparedQueryHKT, V1.BuildQueryResult<TSchema, TFields, TSelection> | undefined>;
}
declare class MySqlRelationalQuery<TPreparedQueryHKT extends PreparedQueryHKTBase, TResult> extends QueryPromise<TResult> {
  private fullSchema;
  private schema;
  private tableNamesMap;
  private table;
  private tableConfig;
  private dialect;
  private session;
  private config;
  private queryMode;
  private mode?;
  static readonly [entityKind]: string;
  protected $brand: 'MySqlRelationalQuery';
  constructor(fullSchema: Record<string, unknown>, schema: V1.TablesRelationalConfig, tableNamesMap: Record<string, string>, table: MySqlTable, tableConfig: V1.TableRelationalConfig, dialect: MySqlDialect, session: MySqlSession, config: V1.DBQueryConfig<'many', true> | true, queryMode: 'many' | 'first', mode?: Mode | undefined);
  prepare(): PreparedQueryKind<TPreparedQueryHKT, MySqlPreparedQueryConfig & {
    execute: TResult;
  }, true>;
  private _getQuery;
  private _toSQL;
  toSQL(): Query;
  execute(): Promise<TResult>;
}
//#endregion
export { MySqlRelationalQuery, _RelationalQueryBuilder };
//# sourceMappingURL=_query.d.ts.map