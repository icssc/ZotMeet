import { SingleStoreTable } from "../table.js";
import { SingleStoreView } from "../view.js";
import { SingleStoreDialect } from "../dialect.js";
import { PreparedQueryHKTBase, PreparedQueryKind, SingleStorePreparedQueryConfig, SingleStoreSession } from "../session.js";
import { entityKind } from "../../entity.js";
import { KnownKeysOnly } from "../../utils.js";
import { Query } from "../../sql/sql.js";
import { QueryPromise } from "../../query-promise.js";
import { BuildQueryResult, DBQueryConfig, TableRelationalConfig, TablesRelationalConfig } from "../../relations.js";

//#region src/singlestore-core/query-builders/query.d.ts
declare class RelationalQueryBuilder<TPreparedQueryHKT extends PreparedQueryHKTBase, TSchema extends TablesRelationalConfig, TFields extends TableRelationalConfig> {
  private schema;
  private table;
  private tableConfig;
  private dialect;
  private session;
  static readonly [entityKind]: string;
  constructor(schema: TSchema, table: SingleStoreTable | SingleStoreView, tableConfig: TableRelationalConfig, dialect: SingleStoreDialect, session: SingleStoreSession);
  findMany<TConfig extends DBQueryConfig<'many', TSchema, TFields>>(config?: KnownKeysOnly<TConfig, DBQueryConfig<'many', TSchema, TFields>>): SingleStoreRelationalQuery<TPreparedQueryHKT, BuildQueryResult<TSchema, TFields, TConfig>[]>;
  findFirst<TSelection extends DBQueryConfig<'one', TSchema, TFields>>(config?: KnownKeysOnly<TSelection, DBQueryConfig<'one', TSchema, TFields>>): SingleStoreRelationalQuery<TPreparedQueryHKT, BuildQueryResult<TSchema, TFields, TSelection> | undefined>;
}
declare class SingleStoreRelationalQuery<TPreparedQueryHKT extends PreparedQueryHKTBase, TResult> extends QueryPromise<TResult> {
  private schema;
  private table;
  private tableConfig;
  private dialect;
  private session;
  private config;
  private mode;
  static readonly [entityKind]: string;
  protected $brand: 'SingleStoreRelationalQuery';
  constructor(schema: TablesRelationalConfig, table: SingleStoreTable | SingleStoreView, tableConfig: TableRelationalConfig, dialect: SingleStoreDialect, session: SingleStoreSession, config: DBQueryConfig<'many' | 'one'> | true, mode: 'many' | 'first');
  prepare(): PreparedQueryKind<TPreparedQueryHKT, SingleStorePreparedQueryConfig & {
    execute: TResult;
  }, true>;
  private _getQuery;
  private _toSQL;
  toSQL(): Query;
  execute(): Promise<TResult>;
}
//#endregion
export { RelationalQueryBuilder, SingleStoreRelationalQuery };
//# sourceMappingURL=query.d.ts.map