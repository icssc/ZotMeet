import { MySqlTable } from "../table.js";
import { MySqlView } from "../view.js";
import { MySqlDialect } from "../dialect.js";
import { MySqlPreparedQueryConfig, MySqlSession, PreparedQueryHKTBase, PreparedQueryKind } from "../session.js";
import { entityKind } from "../../entity.js";
import { KnownKeysOnly } from "../../utils.js";
import { Query } from "../../sql/sql.js";
import { QueryPromise } from "../../query-promise.js";
import { BuildQueryResult, DBQueryConfig, TableRelationalConfig, TablesRelationalConfig } from "../../relations.js";

//#region src/mysql-core/query-builders/query.d.ts
declare class RelationalQueryBuilder<TPreparedQueryHKT extends PreparedQueryHKTBase, TSchema extends TablesRelationalConfig, TFields extends TableRelationalConfig> {
  private schema;
  private table;
  private tableConfig;
  private dialect;
  private session;
  static readonly [entityKind]: string;
  constructor(schema: TSchema, table: MySqlTable | MySqlView, tableConfig: TableRelationalConfig, dialect: MySqlDialect, session: MySqlSession);
  findMany<TConfig extends DBQueryConfig<'many', TSchema, TFields>>(config?: KnownKeysOnly<TConfig, DBQueryConfig<'many', TSchema, TFields>>): MySqlRelationalQuery<TPreparedQueryHKT, BuildQueryResult<TSchema, TFields, TConfig>[]>;
  findFirst<TSelection extends DBQueryConfig<'one', TSchema, TFields>>(config?: KnownKeysOnly<TSelection, DBQueryConfig<'one', TSchema, TFields>>): MySqlRelationalQuery<TPreparedQueryHKT, BuildQueryResult<TSchema, TFields, TSelection> | undefined>;
}
declare class MySqlRelationalQuery<TPreparedQueryHKT extends PreparedQueryHKTBase, TResult> extends QueryPromise<TResult> {
  private schema;
  private table;
  private tableConfig;
  private dialect;
  private session;
  private config;
  private mode;
  static readonly [entityKind]: string;
  protected $brand: 'MySqlRelationalQuery';
  constructor(schema: TablesRelationalConfig, table: MySqlTable | MySqlView, tableConfig: TableRelationalConfig, dialect: MySqlDialect, session: MySqlSession, config: DBQueryConfig<'many' | 'one'> | true, mode: 'many' | 'first');
  prepare(): PreparedQueryKind<TPreparedQueryHKT, MySqlPreparedQueryConfig & {
    execute: TResult;
  }, true>;
  private _getQuery;
  private _toSQL;
  toSQL(): Query;
  execute(): Promise<TResult>;
}
//#endregion
export { MySqlRelationalQuery, RelationalQueryBuilder };
//# sourceMappingURL=query.d.ts.map